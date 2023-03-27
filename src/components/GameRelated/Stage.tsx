import { useLayoutEffect, useRef, useState } from "react";
import type { Texture } from "three";
import { Vector3, TextureLoader } from "three";
import Card from "../../ui/Card";

const TextureHolder = new TextureLoader();

export const Stage = (props: { stageName: string }) => {
  const stageName = props.stageName;
  const TextureRef = useRef<Texture>();
  const [textureLoaded, setTextureLoaded] = useState(false);

  useLayoutEffect(() => {
    TextureRef.current = TextureHolder.load(`/${stageName}.webp`);
    setTextureLoaded(true);
  }, [stageName]);

  if (!textureLoaded) return <></>

  return (
    <sprite scale={new Vector3(16, 9, 1)}>
      <spriteMaterial map={TextureRef.current} />
    </sprite>
  );
};
