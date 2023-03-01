import type { Vector3 } from "three";
import type { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import AgoraRTC, { type IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { AgoraVideoPlayer } from "agora-rtc-react";
import type { remoteUserType } from "./types";
import { styles } from "./styles";
import { AgoraDict } from "./GameContainer";

export const Videos = (props: {
  remoteUsers: remoteUserType;
  localVideoTrack: ICameraVideoTrack;
  localAudioTrack: IMicrophoneAudioTrack;
  playerPos: Vector3;
}) => {
  const { localVideoTrack, localAudioTrack, remoteUsers, playerPos } = props;
  return (
    <div style={styles.videoHolder}>
      <Buttons localVideoTrack={localVideoTrack} localAudioTrack={localAudioTrack} />
      {Object.keys(remoteUsers).map((u) => (
        <>
          <div>{AgoraDict[parseInt(u)]?.agoraUser?.uid}</div>
          {AgoraDict[parseInt(u)]?.agoraUser.videoTrack ? (
            <div
              key={u}
              style={
                remoteUsers[parseInt(u)]?.position
                  ? {
                      opacity: 1 / playerPos.distanceTo(remoteUsers[parseInt(u)]!.position),
                    }
                  : {}
              }
            >
              <AgoraVideoPlayer
                style={styles.videoTile}
                videoTrack={AgoraDict[parseInt(u)]?.agoraUser.videoTrack as IRemoteVideoTrack}
              />
            </div>
          ) : (
            AgoraDict[parseInt(u)]?.agoraUser.audioTrack && (
              <div style={styles.videoTileMuted}>
                mutedvideo
                {u}
              </div>
            )
          )}
        </>
      ))}
      {localVideoTrack && (
        <AgoraVideoPlayer style={styles.videoTile} videoTrack={localVideoTrack} />
      )}
    </div>
  );
};

function Buttons(props: {
  localVideoTrack: ICameraVideoTrack;
  localAudioTrack: IMicrophoneAudioTrack;
}) {
  const { localAudioTrack, localVideoTrack } = props;
  const localVideoTrackMute = () => {
    void localVideoTrack.setMuted(!localVideoTrack.muted);
  };
  const localAudioTrackMute = () => {
    void localAudioTrack.setMuted(!localAudioTrack.muted);
  };
  return (
    <div>
      <button
        onClick={() => {
          void AgoraRTC.getCameras().then((d) => {
            if (d[1]) void localVideoTrack.setDevice(d[1].deviceId);
          });
        }}
      >
        cam
      </button>
      <br />
      <button onClick={() => localVideoTrackMute()}>
        localVideoTrack: {String(localVideoTrack.muted)}
      </button>
      <br />
      <button onClick={() => localAudioTrackMute()}>
        localAudioTrack: {String(localAudioTrack.muted)}
      </button>
    </div>
  );
}
