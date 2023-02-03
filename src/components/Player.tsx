import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import type { Sprite } from "three";
import { TextureLoader } from "three";
import { Vector3 } from "three";
import type { Controls } from "./types";
import { rtmChannel } from "./Fiber";

export const sendPositionRTM = (position: Vector3) => {
  void rtmChannel
    .sendMessage({ text: JSON.stringify(position) })
    .catch((e) => console.log(e));
};

const playerTexMap = new TextureLoader().load("/char.png");
const charSize = 0.5;
const _velocity = new Vector3();
const speed = 4;

export const Player = (props: {
  setPlayerPos: Dispatch<SetStateAction<Vector3>>;
}) => {
  const ref = useRef<Sprite>(null);
  const counter = useRef(0);
  const { setPlayerPos } = props;
  const [, get] = useKeyboardControls<Controls>();
  useFrame((s, dl) => {
    if (!ref.current) return;
    const state = get();
    if (state.left && !state.right) _velocity.x = -1;
    if (state.right && !state.left) _velocity.x = 1;
    if (!state.left && !state.right) _velocity.x = 0;

    if (state.forward && !state.back) _velocity.y = 1;
    if (state.back && !state.forward) _velocity.y = -1;
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
      <spriteMaterial map={playerTexMap} />
    </sprite>
  );
};
