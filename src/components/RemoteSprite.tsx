import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from "three";
import type { Vector3, Sprite } from "three";
import { AgoraDict, rtcClient } from "./Fiber";

const distanceToUnsubscribe = 1;

const remotePlayerTexMap = new TextureLoader().load("/char.png");
const charSize = 0.5;

export const RemoteSprite = (props: {
  position: Vector3;
  playerPos: Vector3;
  uid: number;
}) => {
  const ref = useRef<Sprite>(null);
  const { position, playerPos, uid } = props;
  useFrame(() => {
    const remotePos = ref.current?.position;
    const agoraUser = AgoraDict[uid];
    if (remotePos) {
      remotePos.lerp(position, 0.1);
      if (agoraUser) {
        if (
          remotePos.distanceTo(playerPos) > distanceToUnsubscribe &&
          agoraUser.isSubscribed
        ) {
          console.log("!UNSUB");
          void rtcClient
            .unsubscribe(agoraUser.agoraUser)
            .then(() => (agoraUser.isSubscribed = false))
            .catch((e) => console.log(e));
        }
        if (
          remotePos.distanceTo(playerPos) < distanceToUnsubscribe &&
          !agoraUser.isSubscribed
        ) {
          console.log("!SUB");
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
        console.error("no user", agoraUser, AgoraDict);
      }
    }
  });
  return (
    <sprite ref={ref} scale={charSize}>
      <spriteMaterial map={remotePlayerTexMap} />
    </sprite>
  );
};
