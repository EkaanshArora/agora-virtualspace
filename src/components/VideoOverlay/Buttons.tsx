import type { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useState } from "react";
import { FiCamera, FiCameraOff, FiMic, FiMicOff } from "react-icons/fi";

export function Buttons(props: {
  localVideoMuteState: boolean;
  setLocalVideoMuteState: React.Dispatch<boolean>
  localVideoTrack: ICameraVideoTrack;
  localAudioTrack: IMicrophoneAudioTrack;
}) {
  const { localAudioTrack, localVideoTrack, localVideoMuteState, setLocalVideoMuteState} = props;
  const [s1, ss1] = useState(false);
  const localVideoTrackMute = () => {
    void localVideoTrack.setMuted(!localVideoTrack.muted).then(() => setLocalVideoMuteState(localVideoTrack.muted));
  };
  const localAudioTrackMute = () => {
    void localAudioTrack.setMuted(!localAudioTrack.muted).then(() => ss1(localAudioTrack.muted));
  };
  return (
    <div className="absolute bottom-0 right-4 z-20 bg-white bg-opacity-80 pl-5">
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
      <button className="h-10 w-10" onClick={() => localVideoTrackMute()}>
        {localVideoMuteState ? <FiCameraOff size={25} /> : <FiCamera size={25} />}
      </button>
      <br />
      <button className="h-10 w-10" onClick={() => localAudioTrackMute()}>
        {s1 ? <FiMicOff size={25} /> : <FiMic size={25} />}
      </button>
    </div>
  );
}
