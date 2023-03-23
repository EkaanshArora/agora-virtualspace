import type { IMicrophoneAudioTrack } from "../../agora-rtc-react";
import { useState } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";
import { mics } from "./ButtonContainer";

export const AudioMuteButton = (props: { localAudioTrack: IMicrophoneAudioTrack; }) => {
  const { localAudioTrack } = props;
  const [localAudioMuteState, setLocalAudioMuteState] = useState(false);
  const [currentMic, setCurrentMic] = useState<string>(mics[0]?.deviceId as string);

  const localAudioTrackMute = () => {
    void localAudioTrack
      .setMuted(!localAudioTrack.muted)
      .then(() => setLocalAudioMuteState(localAudioTrack.muted));
  };

  return (
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
  );
};
