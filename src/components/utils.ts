import type { Dispatch, SetStateAction } from "react";
import { Vector3 } from "three";

export const handleSprite = (
  _ss: Dispatch<
    SetStateAction<{
      spriteSheetUrl: string;
      xCount: number;
      yCount: number;
      spriteFrames: number;
      spriteX: number;
      spriteY: number;
      interval: number;
    }>
  >,
  position: Vector3,
  remotePos: Vector3
) => {
  if (
    Math.abs(position.x - remotePos.x) < 1e-4 &&
    Math.abs(position.y - remotePos.y) < 1e-4
  ) {
    _ss(spriteConfigs.stand);
  } else if (
    Math.abs(position.x - remotePos.x) > Math.abs(position.y - remotePos.y)
  ) {
    if (position.x > remotePos.x) {
      _ss(spriteConfigs.right);
      console.log("right");
    } else if (position.x < remotePos.x) {
      console.log("left");
      _ss(spriteConfigs.left);
    }
  } else {
    if (position.y > remotePos.y) {
      console.log("up");
      _ss(spriteConfigs.up);
    } else if (position.y < remotePos.y) {
      console.log("down");
      _ss(spriteConfigs.down);
    }
  }
};

const babyCommon = {
  spriteSheetUrl: `/charh.png`,
  xCount: 8,
  yCount: 8,
  interval: 0.2,
  spriteX: 0,
};
export const spriteConfigs = {
  charSize: 1.2,
  speed: 1,
  stand: {
    ...babyCommon,
    spriteFrames: 1,
    spriteY: 7,
  },
  left: {
    ...babyCommon,
    spriteFrames: 6,
    spriteY: 0,
  },
  right: {
    ...babyCommon,
    spriteFrames: 6,
    spriteY: 1,
  },
  up: { ...babyCommon, spriteFrames: 6, spriteX: 0, spriteY: 2, interval: 0.2 },
  down: {
    ...babyCommon,
    spriteFrames: 6,
    spriteY: 3,
  },
};

const timmyCommon = {
  spriteSheetUrl: `/sprite.png`,
  xCount: 4,
  yCount: 5,
  interval: 0.1,
  spriteX: 0,
  spriteFrames: 4,
};
const timmySize = new Vector3(0.3, 0.6, 0);
export const spriteConfigTimmy = {
  charSize: timmySize,
  speed: 1,
  stand: {
    ...timmyCommon,
    spriteY: 0,
  },
  left: {
    ...timmyCommon,
    spriteY: 3,
  },
  right: {
    ...timmyCommon,
    spriteY: 2,
  },
  up: {
    ...timmyCommon,
    spriteY: 1,
  },
  down: {
    ...timmyCommon,
    spriteY: 4,
  },
};
