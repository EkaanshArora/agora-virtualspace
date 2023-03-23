import { Canvas } from "@react-three/fiber";
import type { KeyboardControlsEntry } from "@react-three/drei";
import { KeyboardControls } from "@react-three/drei";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import type { Vector3 } from "three";
import { Stage } from "./Stage";
import { dragRef, Player } from "./Player";
import { RemoteSprite } from "./RemoteSprite";
import type { customSpriteConfig, remoteUserType, userPosition } from "../types";
import { Controls } from "../types";
import { useDrag } from "@use-gesture/react";

export const Game = (props: GameProps) => {
  const { playerPos, remoteUsers, setPlayerPos, character, stageName } = props;
  const bind = useDrag((state) => {
    dragRef[0] = state.direction[0];
    dragRef[1] = state.direction[1];
    if (!state.dragging) {
      dragRef[0] = 0;
      dragRef[1] = 0;
    }
  }, {});
  
  const keyMap = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "w", "W"] },
      { name: Controls.back, keys: ["ArrowDown", "s", "S"] },
      { name: Controls.left, keys: ["ArrowLeft", "a", "A"] },
      { name: Controls.right, keys: ["ArrowRight", "d", "D"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <>
      <Canvas {...bind()} style={{touchAction: 'none'}}>
        <KeyboardControls map={keyMap}>
          <Stage stageName={stageName} />
          <Player setPlayerPos={setPlayerPos} character={character} />
          {Object.keys(remoteUsers).map((u) => (
            <RemoteSprite
              playerPos={playerPos}
              position={(remoteUsers[parseInt(u)] as userPosition).position}
              key={u}
              uid={parseInt(u)}
            />
          ))}
        </KeyboardControls>
      </Canvas>
    </>
  );
};

type GameProps = {
  setPlayerPos: Dispatch<SetStateAction<Vector3>>;
  remoteUsers: remoteUserType;
  playerPos: Vector3;
  character: customSpriteConfig;
  stageName: string;
};
