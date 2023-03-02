import { Vector3, TextureLoader} from "three";

const stageTexMap = new TextureLoader().load("/stage.webp");

export const Stage = () => {
  return (
    <sprite scale={new Vector3(15, 9, 1)}>
      <spriteMaterial map={stageTexMap} />
    </sprite>
  );
};
