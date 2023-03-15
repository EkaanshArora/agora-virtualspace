import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { useState } from "react";
import { useRef } from "react";
import type { Sprite } from "three";
import { Vector3 } from "three";
import type { Controls, customSpriteConfig } from "../types";
import { rtmChannel } from "../GameContainer";
import { useAnimatedSprite } from "use-animated-sprite";
import { useDrag } from "@use-gesture/react";
const _velocity = new Vector3();

export const sendPositionRTM = (position: Vector3) => {
  void rtmChannel.sendMessage({ text: JSON.stringify(position) }).catch((e) => console.log(e));
};

export const Player = (props: {
  setPlayerPos: Dispatch<SetStateAction<Vector3>>;
  character: customSpriteConfig;
}) => {
  const ref = useRef<Sprite>(null);
  const { setPlayerPos, character } = props;
  const [spriteState, setSpriteState] = useState(character.left);
  const texture = useAnimatedSprite(ref as MutableRefObject<Sprite>, spriteState);
  const counter = useRef(0);
  const bind = useDrag((state) => {
    dragRef.current = state.direction;
    if (!state.dragging) {
      dragRef.current = [0, 0];
    }
  }, { pointer: { touch: true }});
  const dragRef = useRef<[number, number]>([0, 0]);
  const [, get] = useKeyboardControls<Controls>();
  useFrame((s, dl) => {
    if (!ref.current) return;
    if (dragRef.current[0] || dragRef.current[1]) {
      console.log(dragRef.current);
      if (dragRef.current[0] < 0) {
        _velocity.x = -0.4;
        setSpriteState(character.left);
      }
      if (dragRef.current[0] > 0) {
        _velocity.x = 0.4;
        setSpriteState(character.right);
      }
      if (dragRef.current[0] === 0) {
        _velocity.x = -0;
        setSpriteState(character.stand);
      }

      if (dragRef.current[1] < 0) {
        _velocity.y = 0.4;
        setSpriteState(character.up);
      }
      if (dragRef.current[1] > 0) {
        _velocity.y = -0.4;
        setSpriteState(character.down);
      }
      if (dragRef.current[1] === 0) {
        _velocity.y = 0;
      }
    } else {
      const keyState = get();
      if (keyState.left && !keyState.right) {
        _velocity.x = -1;
        setSpriteState(character.left);
      }
      if (keyState.right && !keyState.left) {
        _velocity.x = 1;
        setSpriteState(character.right);
      }
      if (!keyState.left && !keyState.right) {
        _velocity.x = -0;
        setSpriteState(character.stand);
      }

      if (keyState.forward && !keyState.back) {
        _velocity.y = 1;
        setSpriteState(character.up);
      }
      if (keyState.back && !keyState.forward) {
        _velocity.y = -1;
        setSpriteState(character.down);
      }
      if (!keyState.forward && !keyState.back) _velocity.y = 0;

      if (keyState.jump) ref.current.position.set(0, 0, 0);
    }
    ref.current.position.addScaledVector(_velocity, character.speed * dl);
    ref.current.position.z = 1;
    setPlayerPos(ref.current.position);
    const time = s.clock.getElapsedTime();
    const factor = 10;
    if (Math.round(time * factor) / factor > counter.current) {
      sendPositionRTM(ref.current.position);
      counter.current = Math.round(time * factor) / factor;
    }
  });

  return (
    // @ts-expect-error binding useGesture to sprite makes TS unhappy but seems to work
    <sprite ref={ref} scale={character.charSize} {...bind()}>
      <spriteMaterial map={texture} />
    </sprite>
  );
};
