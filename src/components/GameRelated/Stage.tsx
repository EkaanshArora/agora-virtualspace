import { useEffect, useRef, useState } from "react";
import type { Texture } from "three";
import { Vector3, TextureLoader } from "three";

const TextureHolder = new TextureLoader();

export const Stage = (props: { stageName: string }) => {
  const stageName = props.stageName; // ?? "stage";
  const TextureRef = useRef<Texture>();
  const [textureLoaded, setTextureLoaded] = useState(false);

  useEffect(() => {
    TextureRef.current = TextureHolder.load(`/${stageName}.webp`);
    setTextureLoaded(true);
  }, [stageName]);
  
  return (
    textureLoaded ? (
      <sprite scale={new Vector3(15, 9, 1)}>
        <spriteMaterial map={TextureRef.current} />
      </sprite>
    ) : <></>
  );
};
