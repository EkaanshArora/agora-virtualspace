import type { ICameraVideoTrack } from "../../agora-rtc-react";
import type { Dispatch } from "react";
import { useState } from "react";
import { FiCamera, FiCameraOff } from "react-icons/fi";
import { cams } from "./ButtonContainer";

export const VideoMuteButton = (props: {
  localVideoMuteState: boolean;
  localVideoTrack: ICameraVideoTrack;
  setLocalVideoMuteState: Dispatch<boolean>;
}) => {
  const { localVideoMuteState, localVideoTrack, setLocalVideoMuteState } = props;
  const [currentCam, setCurrentCam] = useState<string>(cams[0]?.deviceId as string);
  const localVideoTrackMute = () => {
    void localVideoTrack
      .setMuted(!localVideoTrack.muted)
      .then(() => setLocalVideoMuteState(localVideoTrack.muted));
  };
  
  return (
    <div className="flex flex-row">
      <button className="mr-2 h-8" onClick={() => localVideoTrackMute()}>
        {localVideoMuteState ? <FiCameraOff size={25} /> : <FiCamera size={25} />}
      </button>
      <select
        id="cam"
        className="block h-8 w-56 rounded-lg border border-gray-300 bg-gray-50 bg-opacity-40 p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        onChange={(e) => {
          const deviceId = e.target.value;
          void localVideoTrack
            .setDevice(deviceId)
            .then(() => setCurrentCam(deviceId))
            .catch(console.log);
        }}
      >
        {cams.map((cam) => (
          <option key={cam.deviceId} selected={cam.deviceId === currentCam} value={cam.deviceId}>
            {cam.label}
          </option>
        ))}
      </select>
    </div>
  );
};
