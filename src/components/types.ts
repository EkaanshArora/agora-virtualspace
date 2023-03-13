import type { Vector3 } from "three";
import type { IAgoraRTCRemoteUser } from "../agora-rtc-react";

export type agoraUserType = {
  agoraUser: IAgoraRTCRemoteUser;
  isSubscribedVideo: boolean;
  isSubscribedAudio: boolean;
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

type SpriteSheetConfig = {
  spriteSheetUrl: string;
  xCount: number;
  yCount: number;
  spriteX: number;
  spriteY: number;
  spriteFrames: number;
  interval: number;
}

export type customSpriteConfig = {
  charSize: number | Vector3,
  speed: number,
  stand: SpriteSheetConfig,
  left: SpriteSheetConfig,
  right: SpriteSheetConfig,
  up: SpriteSheetConfig,
  down: SpriteSheetConfig,
}
