import { Dispatch, SetStateAction } from "react";
import { Vector3 } from "three";

export const handleSprite = (_ss: Dispatch<SetStateAction<{
  spriteSheetUrl: string;
  xCount: number;
  yCount: number;
  spriteFrames: number;
  spriteX: number;
  spriteY: number;
  interval: number;
}>>, position: Vector3, remotePos: Vector3) => {
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
}


export const spriteConfigs = {
  stand: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 1,
    spriteX: 0,
    spriteY: 7,
    interval: 0.2,
  },
  left: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 0,
    interval: 0.2,
  },
  right: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 1,
    interval: 0.2,
  },
  up: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 2,
    interval: 0.2,
  },
  down: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 3,
    interval: 0.2,
  },
};
