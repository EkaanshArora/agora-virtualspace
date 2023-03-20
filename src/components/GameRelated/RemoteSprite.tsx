import { useFrame } from "@react-three/fiber";
import { Circle, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { AgoraDict, rtcClient } from "../GameContainer";
import { useAnimatedSprite } from "use-animated-sprite";
import {
  handleSprite,
  getRandomPet,
  remoteSpriteCircleShader,
  distanceToUnsubscribe,
} from "../utils";
import type { MutableRefObject } from "react";
import type { Sprite } from "three";
import { api } from "../../utils/api";

export const RemoteSprite = (props: { position: Vector3; playerPos: Vector3; uid: number }) => {
  const spriteRef = useRef<Sprite>(null);
  const circleRef = useRef<Sprite>(null); // type hack
  const randomPetRef = useRef(getRandomPet());
  const spriteConfigPet = randomPetRef.current;
  const [sprite, setSprite] = useState(spriteConfigPet.stand);
  const texture = useAnimatedSprite(spriteRef as MutableRefObject<Sprite>, sprite);
  const { position, playerPos, uid } = props;
  const { data } = api.example.getUserName.useQuery({ agoraId: uid });
  useFrame(() => {
    const remotePos = spriteRef.current?.position;
    const agoraUser = AgoraDict[uid];
    if (remotePos) {
      remotePos.lerp(position, 0.5);
      circleRef.current?.position.set(position.x, position.y, position.z - 0.2);
      // spritesheet logic
      handleSprite(setSprite, position, remotePos, spriteConfigPet);
      // subscription logic
      if (agoraUser) {
        if (
          remotePos.distanceTo(playerPos) > distanceToUnsubscribe &&
          agoraUser.isSubscribedAudio
        ) {
          void rtcClient
            .unsubscribe(agoraUser.agoraUser, "audio")
            .then(() => (agoraUser.isSubscribedAudio = false))
            .catch(console.log);
        }
        if (
          remotePos.distanceTo(playerPos) > distanceToUnsubscribe &&
          agoraUser.isSubscribedVideo
        ) {
          void rtcClient
            .unsubscribe(agoraUser.agoraUser, "video")
            .then(() => (agoraUser.isSubscribedVideo = false))
            .catch(console.log);
        }
        if (
          remotePos.distanceTo(playerPos) < distanceToUnsubscribe &&
          !agoraUser.isSubscribedAudio
        ) {
          void rtcClient
            .subscribe(agoraUser.agoraUser, "audio")
            .then((t) => t.play())
            .then(() => (agoraUser.isSubscribedAudio = true))
            .catch(console.log);
        }
        if (
          remotePos.distanceTo(playerPos) < distanceToUnsubscribe &&
          !agoraUser.isSubscribedVideo
        ) {
          void rtcClient
            .subscribe(agoraUser.agoraUser, "video")
            .then(() => (agoraUser.isSubscribedVideo = true))
            .catch(console.log);
        }
      } else {
        console.warn("no user", agoraUser, AgoraDict);
      }
    }
  });

  return (
    <>
      <Circle
        scale={distanceToUnsubscribe * 1.2}
        ref={circleRef}
        position={new Vector3(0, -0.2, 0.1)}
        material={remoteSpriteCircleShader}
      />
      <sprite ref={spriteRef} scale={spriteConfigPet.charSize}>
        <spriteMaterial map={texture} />
        <Text scale={0.18} anchorY={2.6} outlineWidth={0.04}>
          {data?.name ? data.name?.split(" ")[0] : '...'}
        </Text>
      </sprite>
    </>
  );
};
