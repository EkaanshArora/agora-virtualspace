import type { Dispatch, SetStateAction } from "react";
import type { Vector3 } from "three";
import type { RtmMessage, RtmTextMessage } from "agora-rtm-sdk";
import type { remoteUserType } from "../types";

export const handleChannelMessage = (
  message: RtmMessage,
  uid: string,
  setRemoteUsers: Dispatch<SetStateAction<remoteUserType>>
) => {
  const position = JSON.parse((message as RtmTextMessage).text) as Vector3;
  setRemoteUsers((p) => ({ ...p, [parseInt(uid)]: { position } }));
};
