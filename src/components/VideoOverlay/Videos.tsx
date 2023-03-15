import type { Vector3 } from "three";
import type { ICameraVideoTrack, IMicrophoneAudioTrack } from "../../agora-rtc-react";
import { AgoraVideoPlayer } from "../../agora-rtc-react";
import type { remoteUserType } from "../types";
import { RemoteVideo } from "./RemoteVideo";
import { MutedVideo } from "./MutedVideo";

export const Videos = (props: {
  remoteUsers: remoteUserType;
  localVideoMuteState: boolean;
  localVideoTrack: ICameraVideoTrack;
  localAudioTrack: IMicrophoneAudioTrack;
  playerPos: Vector3;
}) => {
  const { localVideoTrack, remoteUsers, playerPos, localVideoMuteState } = props;

  return (
    <div className="absolute right-0 bottom-0 z-10 flex h-32 w-screen justify-center p-2">
      {Object.keys(remoteUsers).map((u) => (
        <RemoteVideo key={u} u={u} remoteUsers={remoteUsers} playerPos={playerPos} />
      ))}
      {!localVideoMuteState ? (
        <AgoraVideoPlayer
          className="mx-1 h-full w-28 overflow-hidden rounded-full"
          videoTrack={localVideoTrack}
        />
      ) : (
        <MutedVideo name={"you"} />
      )}
    </div>
  );
};
