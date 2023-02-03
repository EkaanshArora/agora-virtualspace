import { Canvas } from "@react-three/fiber";
import type { KeyboardControlsEntry } from "@react-three/drei";
import { KeyboardControls } from "@react-three/drei";
import type { Dispatch, SetStateAction } from "react";
import { useMemo } from "react";
import type { Vector3 } from "three";
import { Stage } from "./Stage";
import { Player } from "./Player";
import { RemoteSprite } from "./RemoteSprite";
import type { remoteUserType, userPosition } from "./types";
import { Controls } from "./types";

export const Game = (props: {
  setPlayerPos: Dispatch<SetStateAction<Vector3>>;
  remoteUsers: remoteUserType;
  playerPos: Vector3;
}) => {
  const { playerPos, remoteUsers, setPlayerPos } = props;
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
      <Canvas>
        <KeyboardControls map={keyMap}>
          <Stage />
          <Player setPlayerPos={setPlayerPos} />
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
