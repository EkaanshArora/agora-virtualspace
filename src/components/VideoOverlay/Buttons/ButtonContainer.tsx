import type { ICameraVideoTrack, IMicrophoneAudioTrack } from "../../../agora-rtc-react";
import AgoraRTC from "../../../agora-rtc-react";
import { AudioMuteButton } from "./AudioMuteButton";
import { VideoMuteButton } from "./VideoMuteButton";

export const cams = await AgoraRTC.getCameras(true);
export const mics = await AgoraRTC.getMicrophones(true);

export function Buttons(props: {
  localVideoMuteState: boolean;
  setLocalVideoMuteState: React.Dispatch<boolean>;
  localVideoTrack: ICameraVideoTrack;
  localAudioTrack: IMicrophoneAudioTrack;
}) {
  const { localAudioTrack, localVideoTrack, localVideoMuteState, setLocalVideoMuteState } = props;

  return (
    <div className="absolute top-2 right-2 z-20 rounded-lg bg-white bg-opacity-50 p-3 shadow-sm hover:shadow-lg">
      <VideoMuteButton
        setLocalVideoMuteState={setLocalVideoMuteState}
        localVideoMuteState={localVideoMuteState}
        localVideoTrack={localVideoTrack}
      />
      <AudioMuteButton localAudioTrack={localAudioTrack} />
    </div>
  );
}
