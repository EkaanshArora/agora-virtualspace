import { useEffect, useState } from "react";
import { Vector3 } from "three";
import AgoraRTM from "agora-rtm-sdk";
import AgoraRTC from "agora-rtc-sdk-ng";
import { createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { Game } from "./Game";
import { handleChannelMessage } from "./AgoraHelpers";
import { env } from "../env/client.mjs";
import type { agoraUserType, customSpriteConfig, remoteUserType } from "./types";
import { styles } from "./styles";
import { Videos } from "./Videos";

AgoraRTC.setLogLevel(2);
const appId = env.NEXT_PUBLIC_APP_ID;
const useTracks = createMicrophoneAndCameraTracks();
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
}) {
  const { ready, tracks, error } = useTracks();
  const [remoteUsers, setRemoteUsers] = useState<remoteUserType>({});
  const [playerPos, setPlayerPos] = useState(new Vector3());
  const { agoraId, rtcToken, rtmToken, channel, character } = props;
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
        <div className="max-w-sm rounded overflow-hidden shadow-lg">{error.message}</div>
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
    <div style={styles.parent}>
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
          />
        </>
      ) : (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">Starting camera...</div>
      )}
    </div>
  );
}

export default App;
