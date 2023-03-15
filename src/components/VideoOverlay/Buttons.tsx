import type { ICameraVideoTrack, IMicrophoneAudioTrack } from "../../agora-rtc-react";
import AgoraRTC from "../../agora-rtc-react";
import { useState } from "react";
import { FiCamera, FiCameraOff, FiMic, FiMicOff } from "react-icons/fi";
const cams = await AgoraRTC.getCameras();
const mics = await AgoraRTC.getMicrophones();
export function Buttons(props: {
  localVideoMuteState: boolean;
  setLocalVideoMuteState: React.Dispatch<boolean>;
  localVideoTrack: ICameraVideoTrack;
  localAudioTrack: IMicrophoneAudioTrack;
}) {
  const { localAudioTrack, localVideoTrack, localVideoMuteState, setLocalVideoMuteState } = props;
  const [localAudioMuteState, setLocalAudioMuteState] = useState(false);
  const [currentCam, setCurrentCam] = useState<string>(cams[0]?.deviceId as string);
  const [currentMic, setCurrentMic] = useState<string>(mics[0]?.deviceId as string);

  const localVideoTrackMute = () => {
    void localVideoTrack
      .setMuted(!localVideoTrack.muted)
      .then(() => setLocalVideoMuteState(localVideoTrack.muted));
  };

  const localAudioTrackMute = () => {
    void localAudioTrack
      .setMuted(!localAudioTrack.muted)
      .then(() => setLocalAudioMuteState(localAudioTrack.muted));
  };

  return (
    <div className="absolute top-2 right-2 z-20 rounded-lg bg-white bg-opacity-50 p-3">
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
      <div className="mt-2 flex flex-row">
        <button className="mr-2 h-8" onClick={() => localAudioTrackMute()}>
          {localAudioMuteState ? <FiMicOff size={25} /> : <FiMic size={25} />}
        </button>
        <select
          id="mic"
          className="block w-56 truncate rounded-lg border border-gray-300 bg-gray-50 bg-opacity-40 p-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => {
            const deviceId = e.target.value;
            void localAudioTrack
              .setDevice(deviceId)
              .then(() => setCurrentMic(deviceId))
              .catch(console.log);
          }}
        >
          {mics.map((mic) => (
            <option
              className="w-16 truncate"
              key={mic.deviceId}
              selected={mic.deviceId === currentMic}
              value={mic.deviceId}
            >
              {mic.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
