import { useFrame } from "@react-three/fiber";
import { Text, useKeyboardControls } from "@react-three/drei";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { useState } from "react";
import { useRef } from "react";
import type { Sprite } from "three";
import { Frustum, Matrix4 } from "three";
import { Vector3 } from "three";
import type { Controls, customSpriteConfig } from "../types";
import { rtmChannel } from "../GameContainer";
import { useAnimatedSprite } from "use-animated-sprite";

const _velocity = new Vector3();
export const dragRef = [0, 0] as [number, number];

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
  const frustum = useRef(new Frustum());
  const boundsMatrix = useRef(new Matrix4());
  const counter = useRef(0);
  const [, get] = useKeyboardControls<Controls>();

  useFrame((s, dl) => {
    if (!ref.current) return;
    // handle user controls
    if (dragRef[0] || dragRef[1]) {
      handleMouse(setSpriteState, character);
    } else {
      const keyState = get();
      handleKeyboard(keyState, setSpriteState, character);
      if (keyState.jump) {
        // reset position on jump
        ref.current.position.set(0, 0, 0);
      }
    }
    // handle out of bounds
    boundsMatrix.current.multiplyMatrices(s.camera.projectionMatrix, s.camera.matrixWorldInverse);
    frustum.current.setFromProjectionMatrix(boundsMatrix.current);
    if (!frustum.current.containsPoint(ref.current.position)) {
      ref.current.position.lerp(new Vector3(0, 0, 0), 0.1);
      setPlayerPos(ref.current.position);
    } else {
      ref.current.position.addScaledVector(_velocity, character.speed * dl);
      ref.current.position.z = 1;
      setPlayerPos(ref.current.position);
    }
    // throttle
    const time = s.clock.getElapsedTime();
    const factor = 10;
    if (Math.round(time * factor) / factor > counter.current) {
      sendPositionRTM(ref.current.position);
      counter.current = Math.round(time * factor) / factor;
    }
  });

  return (
    <sprite ref={ref} scale={character.charSize}>
      <spriteMaterial map={texture} />
      <Text scale={[0.36, 0.18, 1]} anchorY={3} outlineWidth={0.04}>
        You
      </Text>
    </sprite>
  );
};

function handleKeyboard(
  keyState: { forward: boolean; back: boolean; left: boolean; right: boolean; jump: boolean },
  setSpriteState: Dispatch<
    SetStateAction<{
      spriteSheetUrl: string;
      xCount: number;
      yCount: number;
      spriteX: number;
      spriteY: number;
      spriteFrames: number;
      interval: number;
    }>
  >,
  character: customSpriteConfig,
) {
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
}

function handleMouse(
  setSpriteState: Dispatch<
    SetStateAction<{
      spriteSheetUrl: string;
      xCount: number;
      yCount: number;
      spriteX: number;
      spriteY: number;
      spriteFrames: number;
      interval: number;
    }>
  >,
  character: customSpriteConfig
) {
  if (dragRef[0] < 0) {
    _velocity.x = -0.7;
    setSpriteState(character.left);
  }
  if (dragRef[0] > 0) {
    _velocity.x = 0.7;
    setSpriteState(character.right);
  }
  if (dragRef[0] === 0) {
    _velocity.x = 0;
    setSpriteState(character.stand);
  }

  if (dragRef[1] < 0) {
    _velocity.y = 0.7;
    setSpriteState(character.up);
  }
  if (dragRef[1] > 0) {
    _velocity.y = -0.7;
    setSpriteState(character.down);
  }
  if (dragRef[1] === 0) {
    _velocity.y = 0;
  }
}
