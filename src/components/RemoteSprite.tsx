import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useRef, useState } from "react";
import type { Vector3, Sprite } from "three";
import { AgoraDict, rtcClient } from "./GameContainer";
import { useAnimatedSprite } from "use-animated-sprite";
import { handleSprite, getRandomPet } from "./utils";

const distanceToUnsubscribe = 1;

export const RemoteSprite = (props: {
  position: Vector3;
  playerPos: Vector3;
  uid: number;
}) => {
  const ref = useRef<Sprite>(null);
  const randomPetRef = useRef(getRandomPet());
  const spriteConfigPet = randomPetRef.current;
  const [sprite, setSprite] = useState(spriteConfigPet.stand);
  const texture = useAnimatedSprite(ref as MutableRefObject<Sprite>, sprite);
  const { position, playerPos, uid } = props;
  useFrame(() => {
    const remotePos = ref.current?.position;
    const agoraUser = AgoraDict[uid];
    if (remotePos) {
      remotePos.lerp(position, 0.5);
      // spritesheet logic
      handleSprite(setSprite, position, remotePos, spriteConfigPet);

      // subscription logic
      if (agoraUser) {
        if (
          remotePos.distanceTo(playerPos) > distanceToUnsubscribe &&
          agoraUser.isSubscribed
        ) {
          void rtcClient
            .unsubscribe(agoraUser.agoraUser)
            .then(() => (agoraUser.isSubscribed = false))
            .catch((e) => console.log(e));
        }
        if (
          remotePos.distanceTo(playerPos) < distanceToUnsubscribe &&
          !agoraUser.isSubscribed
        ) {
          void rtcClient
            .subscribe(agoraUser.agoraUser, "audio")
            .then((t) => t.play())
            .then(() => (agoraUser.isSubscribed = true))
            .catch((e) => console.log(e));
          void rtcClient
            .subscribe(agoraUser.agoraUser, "video")
            .catch((e) => console.log(e));
        }
      } else {
        console.warn("no user", agoraUser, AgoraDict);
      }
    }
  });
  return (
    <sprite ref={ref} scale={spriteConfigPet.charSize}>
      <spriteMaterial map={texture} />
    </sprite>
  );
};
