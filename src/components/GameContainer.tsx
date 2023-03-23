import { useEffect, useState } from "react";
import { Vector3 } from "three";
import AgoraRTM from "agora-rtm-sdk";
import AgoraRTC, { AgoraProvider, useMicrophoneAndCameraTracks } from "../agora-rtc-react";
import { Game } from "./GameRelated/Game";
import { handleChannelMessage } from "./VideoOverlay/AgoraHelpers";
import { env } from "../env/client.mjs";
import type { agoraUserType, customSpriteConfig, remoteUserType } from "./types";
import { Videos } from "./VideoOverlay/Videos";
import { Buttons } from "./VideoOverlay/ButtonContainer";
import Card from "../ui/Card";
import SecondaryButton from "../ui/SecondaryButton";
import { sendPositionRTM } from "./GameRelated/Player";

AgoraRTC.setLogLevel(2);
const appId = env.NEXT_PUBLIC_APP_ID;
export let AgoraDict: { [uid: number]: agoraUserType } = {};
export const rtmClient = AgoraRTM.createInstance(appId, {
  logFilter: AgoraRTM.LOG_FILTER_WARNING,
});

// channelname is extracted from the URL
export const rtmChannel = rtmClient.createChannel(window.location.pathname.slice("/game/".length));
export const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const GameContainerWrapped = (props: GameProps) => {
  const { agoraId, channel, character, rtcToken, rtmToken, stageName } = props;
  return (
    <AgoraProvider>
      <GameContainer
        agoraId={agoraId}
        channel={channel}
        character={character}
        rtcToken={rtcToken}
        rtmToken={rtmToken}
        stageName={stageName}
      />
    </AgoraProvider>
  );
};

function GameContainer(props: GameProps) {
  const [localVideoMuteState, setLocalVideoMuteState] = useState(false);
  const { isSuccess: ready, data: tracks, error } = useMicrophoneAndCameraTracks("usetrack");
  const [remoteUsers, setRemoteUsers] = useState<remoteUserType>({});
  const [playerPos, setPlayerPos] = useState(new Vector3());
  const { agoraId, rtcToken, rtmToken, channel, character, stageName } = props;
  useEffect(() => {
    async function init() {
      // RTC
      if (ready && tracks) {
        try {
          rtcClient.on("user-joined", (user) => {
            AgoraDict[user.uid as number] = {
              agoraUser: user,
              isSubscribedVideo: false,
              isSubscribedAudio: false,
            };
          });
          rtcClient.on("user-left", (user) => {
            setRemoteUsers((ps) => {
              const copy = { ...ps };
              delete copy[user.uid as number];
              return copy;
            });
            delete AgoraDict[user.uid as number];
          });
          await rtcClient.join(appId, channel, rtcToken, agoraId);
          await rtcClient.publish(tracks).catch((e) => {
            console.log(e);
          });
        } catch (e) {
          console.log("!", e);
        }
        // RTM
        try {
          rtmChannel.on("ChannelMessage", (message, uid) =>
            handleChannelMessage(message, uid, setRemoteUsers)
          );
          await rtmClient.login({ uid: String(agoraId), token: rtmToken });
          await rtmChannel.join();
        } catch (e) {
          console.log(e);
        }
        console.log(`joined RTM: ${agoraId} ${rtmChannel.channelId}`);
      }
    }
    void init();

    return () => {
      const func = () => {
        void sendPositionRTM(new Vector3(1000, 1000, 100));
        rtmChannel.removeAllListeners();
        rtcClient.removeAllListeners();
        // void rtmChannel.leave();
        // void rtmClient.logout();
        setRemoteUsers({});
        AgoraDict = {};
      };
      try {
        void func();
      } catch (e) {
        console.log(e);
      }
    };
  }, [ready]);

  if (error) {
    return (
      <Card text={error.message}>
        <div className="mx-auto mt-4 max-w-sm">
          <SecondaryButton
            onClick={() => {
              location.reload();
            }}
          >
            refresh
          </SecondaryButton>
        </div>
      </Card>
    );
  }

  return (
    <>
      {ready && tracks ? (
        <div className="h-screen w-screen bg-gray-100">
          <Videos
            playerPos={playerPos}
            localAudioTrack={tracks[0]}
            localVideoTrack={tracks[1]}
            remoteUsers={remoteUsers}
            localVideoMuteState={localVideoMuteState}
          />
          <Buttons
            localVideoMuteState={localVideoMuteState}
            setLocalVideoMuteState={setLocalVideoMuteState}
            localAudioTrack={tracks[0]}
            localVideoTrack={tracks[1]}
          />
          <Game
            setPlayerPos={setPlayerPos}
            remoteUsers={remoteUsers}
            playerPos={playerPos}
            character={character}
            stageName={stageName}
          />
        </div>
      ) : (
        <Card text="Starting camera..." />
      )}
    </>
  );
}

type GameProps = {
  agoraId: number;
  rtcToken: string;
  rtmToken: string;
  channel: string;
  character: customSpriteConfig;
  stageName: string;
};

export default GameContainerWrapped;
