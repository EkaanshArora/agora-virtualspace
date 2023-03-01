import type { Dispatch, SetStateAction } from "react";
import { Color, ShaderMaterial, Vector3 } from "three";
import type { customSpriteConfig } from "./types";

export const remoteSpriteCircleShader = new ShaderMaterial({
  transparent: true,
  uniforms: {
    vlak3color1: { value: new Color("#ff00ff") },
  },
  vertexShader: `
    varying vec3 vUv; 

    void main() {
      vUv = position; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, 0.1, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 vlak3color1;
    uniform vec3 origin;

    varying vec3 vUv;
   
    void main() {
      float distance = clamp(length(vUv), 0., 1.0);

      // y < 0 = transparent, > 1 = opaque
      float alpha = smoothstep(1.0, 0.0, distance) / 3.0;
      // y < 1 = color1, > 2 = color2
      float colorMix = smoothstep(1.0, 2.0, vUv.y);
  
      gl_FragColor = vec4(vlak3color1, alpha);
    }
  `,
});

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
  remotePos: Vector3,
  spriteConfig: customSpriteConfig
) => {
  if (
    Math.abs(position.x - remotePos.x) < 1e-4 &&
    Math.abs(position.y - remotePos.y) < 1e-4
  ) {
    _ss(spriteConfig.stand);
  } else if (
    Math.abs(position.x - remotePos.x) > Math.abs(position.y - remotePos.y)
  ) {
    if (position.x > remotePos.x) {
      _ss(spriteConfig.right);
      console.log("right");
    } else if (position.x < remotePos.x) {
      console.log("left");
      _ss(spriteConfig.left);
    }
  } else {
    if (position.y > remotePos.y) {
      console.log("up");
      _ss(spriteConfig.up);
    } else if (position.y < remotePos.y) {
      console.log("down");
      _ss(spriteConfig.down);
    }
  }
};

const babyCommon = {
  spriteSheetUrl: `/devil.png`,
  xCount: 8,
  yCount: 8,
  interval: 0.2,
  spriteX: 0,
};
export const spriteConfigBaby: customSpriteConfig = {
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
  interval: 0.15,
  spriteX: 0,
  spriteFrames: 4,
};
const timmySize = new Vector3(0.3, 0.6, 0);
export const spriteConfigTimmy: customSpriteConfig = {
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

const petCommon = {
  spriteSheetUrl: `/pet0.png`,
  xCount: 4,
  yCount: 5,
  interval: 0.15,
  spriteX: 0,
  spriteFrames: 4,
};
export const spriteConfigPet: customSpriteConfig = {
  charSize: 0.5,
  speed: 1,
  stand: {
    ...petCommon,
    spriteY: 0,
  },
  left: {
    ...petCommon,
    spriteY: 3,
  },
  right: {
    ...petCommon,
    spriteY: 4,
  },
  up: {
    ...petCommon,
    spriteY: 1,
  },
  down: {
    ...petCommon,
    spriteY: 2,
  },
};

export const characters = {
  timmy: spriteConfigTimmy,
  devil: spriteConfigBaby,
  pet: spriteConfigPet,
};

export const getRandomPet = () => {
  const t = Math.floor(Math.random() * 4);
  const common = {
    spriteSheetUrl: `/pet${t}.png`,
    xCount: 4,
    yCount: 5,
    interval: 0.25,
    spriteX: 0,
    spriteFrames: 4,
  };
  const spriteConfig: customSpriteConfig = {
    charSize: 0.5,
    speed: 1,
    stand: {
      ...common,
      spriteY: 0,
    },
    left: {
      ...common,
      spriteY: 3,
    },
    right: {
      ...common,
      spriteY: 4,
    },
    up: {
      ...common,
      spriteY: 1,
    },
    down: {
      ...common,
      spriteY: 2,
    },
  };
  return spriteConfig;
};
