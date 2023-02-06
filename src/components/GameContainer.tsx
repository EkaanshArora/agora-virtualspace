import { useEffect, useState } from "react";
import { Vector3 } from "three";
import AgoraRTM from "agora-rtm-sdk";
import AgoraRTC, { type IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { Game } from "./Game";
import {
  handleRtcPublish,
  handleRtcUnpublish,
  handleChannelMessage,
} from "./AgoraHelpers";
import { env } from "../env/client.mjs";
import type { agoraUserType, remoteUserType } from "./types";
import { styles } from "./styles";

AgoraRTC.setLogLevel(2);
const appId = env.NEXT_PUBLIC_APP_ID;
const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
export let AgoraDict: { [uid: number]: agoraUserType } = {};
export const rtmClient = AgoraRTM.createInstance(appId, {
  logFilter: AgoraRTM.LOG_FILTER_WARNING,
});

// channelname is extracted from the URL
export const rtmChannel = rtmClient.createChannel(
  window.location.pathname.slice("/game/".length)
);
export const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

function App(props: {
  agoraId: number;
  rtcToken: string;
  rtmToken: string;
  channel: string;
}) {
  const [remoteUsers, setRemoteUsers] = useState<remoteUserType>({});
  const [playerPos, setPlayerPos] = useState(new Vector3());
  const { agoraId, rtcToken, rtmToken, channel } = props;
  useEffect(() => {
    async function init() {
      // RTC
      try {
        rtcClient.on("user-published", handleRtcPublish);
        rtcClient.on("user-unpublished", (user, type) =>
          handleRtcUnpublish(user, type, setRemoteUsers)
        );
        console.log("!", agoraId, rtcToken);
        await rtcClient.join(appId, channel, rtcToken, agoraId);
        await rtcClient
          .publish([localAudioTrack, localVideoTrack])
          .catch((e) => {
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
  }, []);

  return (
    <div style={styles.parent}>
      <div style={styles.videoHolder}>
        {Object.keys(remoteUsers).map(
          (u) =>
            AgoraDict[parseInt(u)]?.agoraUser.videoTrack && (
              <AgoraVideoPlayer
                key={u}
                style={styles.videoTile}
                videoTrack={
                  AgoraDict[parseInt(u)]?.agoraUser
                    .videoTrack as IRemoteVideoTrack
                }
              />
            )
        )}
        {localVideoTrack && (
          <AgoraVideoPlayer
            style={styles.videoTile}
            videoTrack={localVideoTrack}
          />
        )}
      </div>
      <Game
        setPlayerPos={setPlayerPos}
        remoteUsers={remoteUsers}
        playerPos={playerPos}
      />
    </div>
  );
}

export default App;
