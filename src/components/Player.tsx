import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import { useRef } from "react";
import type { Sprite} from "three";
// import { TextureLoader } from "three";
import { Vector3 } from "three";
import type { Controls } from "./types";
import { rtmChannel } from "./Fiber";
import { useAnimatedSprite } from 'use-animated-sprite';

const charSize = 1.2;
const _velocity = new Vector3();
const speed = 1;

export const sendPositionRTM = (position: Vector3) => {
  void rtmChannel
    .sendMessage({ text: JSON.stringify(position) })
    .catch((e) => console.log(e));
};

export const Player = (props: {
  setPlayerPos: Dispatch<SetStateAction<Vector3>>;
}) => {
  const ref = useRef<Sprite>(null);
  const [s, _ss] = useState(spriteConfigs.left)
  const texture = useAnimatedSprite(ref as MutableRefObject<Sprite>, s)
  const counter = useRef(0);
  const { setPlayerPos } = props;
  const [, get] = useKeyboardControls<Controls>();
  useFrame((s, dl) => {
    if (!ref.current) return;
    const state = get();
    if (state.left && !state.right) {
      _velocity.x = -1;
      _ss(spriteConfigs.left)
    }
    if (state.right && !state.left) {
      _velocity.x = 1;
      _ss(spriteConfigs.right)
    }
    if (!state.left && !state.right) {
      _velocity.x = -0;
      _ss(spriteConfigs.stand)
    }
    
    if (state.forward && !state.back){
      _velocity.y = 1;
      _ss(spriteConfigs.up)
    }
    if (state.back && !state.forward){
      _velocity.y = -1;
      _ss(spriteConfigs.down)
    }
    if (!state.forward && !state.back) _velocity.y = 0;
    
    if (state.jump) ref.current.position.set(0, 0, 0);
    ref.current.position.addScaledVector(_velocity, speed * dl);
    setPlayerPos(ref.current.position);
    const time = s.clock.getElapsedTime();
    const factor = 10;
    if (Math.round(time * factor) / factor > counter.current) {
      sendPositionRTM(ref.current?.position);
      counter.current = Math.round(time * factor) / factor;
    }
  });
  
  return (
    <sprite ref={ref} scale={charSize}>
      <spriteMaterial map={texture} />
    </sprite>
  );
};

const spriteConfigs = {
  stand:{
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 1,
    spriteX: 0,
    spriteY: 7,
    interval: 0.2,
  },
  left:{
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 0,
    interval: 0.2,
  },
  right:{
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 1,
    interval: 0.2,
  },
  up:{
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
  }
}