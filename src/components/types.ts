import type { Vector3 } from "three";
import type { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";

export type agoraUserType = {
  agoraUser: IAgoraRTCRemoteUser;
  isSubscribed: boolean;
};

export type userPosition = {
  position: Vector3;
};

export type remoteUserType = { [uid: number]: userPosition };

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}
