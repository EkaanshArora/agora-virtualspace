import type { Vector3 } from "three";
import type { ICameraVideoTrack, IMicrophoneAudioTrack } from "../../agora-rtc-react";
import { AgoraVideoPlayer } from "../../agora-rtc-react";
import type { remoteUserType } from "../types";
import { Buttons } from "./Buttons";
import { RemoteVideo } from "./RemoteVideo";
import { MutedVideo } from "./MutedVideo";
import { useState } from "react";

export const Videos = (props: {
  remoteUsers: remoteUserType;
  localVideoTrack: ICameraVideoTrack;
  localAudioTrack: IMicrophoneAudioTrack;
  playerPos: Vector3;
}) => {
  const { localVideoTrack, localAudioTrack, remoteUsers, playerPos } = props;
  const [localVideoMuteState, setLocalVideoMuteState] = useState(false);

  return (
    <div className="absolute right-0 bottom-0 z-10 flex h-32 w-screen justify-center">
      <Buttons
        localVideoMuteState={localVideoMuteState}
        setLocalVideoMuteState={setLocalVideoMuteState}
        localVideoTrack={localVideoTrack}
        localAudioTrack={localAudioTrack}
      />
      {Object.keys(remoteUsers).map((u) => (
        <RemoteVideo key={u} u={u} remoteUsers={remoteUsers} playerPos={playerPos} />
      ))}
      {!localVideoMuteState ? (
        <AgoraVideoPlayer className="h-full w-48" videoTrack={localVideoTrack} />
      ) : (
        <MutedVideo name={"you"} />
      )}
    </div>
  );
};
