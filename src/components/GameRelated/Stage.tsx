import { Vector3, TextureLoader } from "three";

export const Stage = (props: { stageName: string }) => {
  const stageName = props.stageName; // ?? "stage";
  return (
    <sprite scale={new Vector3(15, 9, 1)}>
      <spriteMaterial map={(new TextureLoader().load(`/${stageName}.webp`))} />
    </sprite>
  );
};
