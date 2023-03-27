import type { Vector3 } from "three";
import type { ICameraVideoTrack, IMicrophoneAudioTrack } from "../../agora-rtc-react";
import { AgoraVideoPlayer } from "../../agora-rtc-react";
import type { remoteUserType } from "../types";
import { RemoteVideo } from "./RemoteVideo";
import { MutedVideo } from "../../ui/MutedVideo";

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
      {Object.keys(remoteUsers).map((uid) => (
        <RemoteVideo key={uid} uid={uid} remoteUsers={remoteUsers} playerPos={playerPos} />
      ))}
      {!localVideoMuteState ? (
        <div className="mx-1 h-full w-24">
          <AgoraVideoPlayer
            className="h-24 w-24 overflow-hidden rounded-full"
            videoTrack={localVideoTrack}
          />
          <div className="m-1 rounded-full bg-white leading-tight opacity-60">
            <p className="m-auto w-20 justify-center self-center overflow-hidden text-ellipsis whitespace-nowrap align-middle text-sm">
              you
            </p>
          </div>
        </div>
      ) : (
        <MutedVideo name={"you"} />
      )}
    </div>
  );
};
