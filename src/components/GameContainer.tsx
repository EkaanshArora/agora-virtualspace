import { useEffect, useState } from "react";
import { Vector3 } from "three";
import AgoraRTM from "agora-rtm-sdk";
// import  from "agora-rtc-sdk-ng";
import AgoraRTC, { AgoraProvider, useMicrophoneAndCameraTracks } from "../agora-rtc-react";
import { Game } from "./GameRelated/Game";
import { handleChannelMessage } from "./VideoOverlay/AgoraHelpers";
import { env } from "../env/client.mjs";
import type { agoraUserType, customSpriteConfig, remoteUserType } from "./types";
import { Videos } from "./VideoOverlay/Videos";

AgoraRTC.setLogLevel(2);
const appId = env.NEXT_PUBLIC_APP_ID;
// const useTracks = createMicrophoneAndCameraTracks();
export let AgoraDict: { [uid: number]: agoraUserType } = {};
export const rtmClient = AgoraRTM.createInstance(appId, {
  logFilter: AgoraRTM.LOG_FILTER_WARNING,
});

// channelname is extracted from the URL
export const rtmChannel = rtmClient.createChannel(window.location.pathname.slice("/game/".length));
export const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

function App(props: {
  agoraId: number;
  rtcToken: string;
  rtmToken: string;
  channel: string;
  character: customSpriteConfig;
  stageName: string;
}) {
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
          console.log("!", agoraId, rtcToken);
          await rtcClient.join(appId, channel, rtcToken, agoraId);
          await rtcClient.publish(tracks).catch((e) => {
            console.log(e);
          });
          console.log("!joined RTC: " + String(agoraId));
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
        rtmChannel.removeAllListeners();
        rtcClient.removeAllListeners();
        // await rtmChannel.leave();
        // await rtmClient.logout();
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
      <>
        <br />
        <br />
        <br />
        <div className="max-w-sm overflow-hidden rounded shadow-lg">{error.message}</div>
        <br />
        <br />
        <button
          onClick={() => {
            location.reload();
          }}
        >
          refresh
        </button>
      </>
    );
  }

  return (
    <div className="h-screen w-screen">
      {ready && tracks ? (
        <>
          <Videos
            playerPos={playerPos}
            localAudioTrack={tracks[0]}
            remoteUsers={remoteUsers}
            localVideoTrack={tracks[1]}
          />
          <Game
            setPlayerPos={setPlayerPos}
            remoteUsers={remoteUsers}
            playerPos={playerPos}
            character={character}
            stageName={stageName}
          />
        </>
      ) : (
        <div className="max-w-sm overflow-hidden rounded shadow-lg">Starting camera...</div>
      )}
    </div>
  );
}

const GameWrapper = (props: {
  agoraId: number;
  rtcToken: string;
  rtmToken: string;
  channel: string;
  character: customSpriteConfig;
  stageName: string;
}) => {
  const {agoraId,channel,character,rtcToken,rtmToken,stageName} = props;
return (
    <AgoraProvider>
      <App
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

export default GameWrapper;
