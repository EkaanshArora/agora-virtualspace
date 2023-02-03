import type { Dispatch, SetStateAction } from "react";
import { Vector3 } from "three";
import type { RtmMessage, RtmTextMessage } from "agora-rtm-sdk";
import type { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import type { remoteUserType } from "./types";
import { AgoraDict } from "./Fiber";

export const handleRtcPublish = (
  user: IAgoraRTCRemoteUser,
  mediaType: "audio" | "video"
) => {
  console.log("userjoined", user.uid);
  if (mediaType === "audio") {
    AgoraDict[user.uid as number] = {
      agoraUser: user,
      isSubscribed: false,
    };
  }
};
export const handleRtcUnpublish = (
  user: IAgoraRTCRemoteUser,
  mediaType: "audio" | "video",
  setRemoteUsers: Dispatch<SetStateAction<remoteUserType>>
) => {
  if (mediaType === "audio") {
    user.audioTrack?.stop();
    delete AgoraDict[user.uid as number];
    setRemoteUsers((ps) => {
      const copy = { ...ps };
      delete copy[user.uid as number];
      return copy;
    });
  }
};
export const handleMemberJoined = (
  memberId: string,
  setRemoteUsers: Dispatch<SetStateAction<remoteUserType>>
) => {
  console.log("!join", memberId);
  setRemoteUsers((p) => ({
    ...p,
    [parseInt(memberId)]: { position: new Vector3(0, 0, 0) },
  }));
};
export const handleChannelMessage = (
  message: RtmMessage,
  uid: string,
  setRemoteUsers: Dispatch<SetStateAction<remoteUserType>>
) => {
  const position = JSON.parse((message as RtmTextMessage).text) as Vector3;
  setRemoteUsers((p) => ({ ...p, [parseInt(uid)]: { position } }));
};
