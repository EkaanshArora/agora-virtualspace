import { useFrame } from "@react-three/fiber";
import type { MutableRefObject} from "react";
import { useRef, useState } from "react";
import type { Vector3, Sprite } from "three";
import { AgoraDict, rtcClient } from "./Fiber";
import { useAnimatedSprite } from "use-animated-sprite";

const distanceToUnsubscribe = 1;
const charSize = 1.2;

export const RemoteSprite = (props: {
  position: Vector3;
  playerPos: Vector3;
  uid: number;
}) => {
  const ref = useRef<Sprite>(null);
  const [s, _ss] = useState(spriteConfigs.left);
  const texture = useAnimatedSprite(ref as MutableRefObject<Sprite>, s);
  const { position, playerPos, uid } = props;
  useFrame(() => {
    const remotePos = ref.current?.position;
    const agoraUser = AgoraDict[uid];
    if (remotePos) {
      remotePos.lerp(position, 0.5);
      // spritesheet logic
      if (
        Math.abs(position.x - remotePos.x) < 1e-4 &&
        Math.abs(position.y - remotePos.y) < 1e-4
      ) {
        _ss(spriteConfigs.stand);
      } else if (
        Math.abs(position.x - remotePos.x) > Math.abs(position.y - remotePos.y)
      ) {
        if (position.x > remotePos.x) {
          _ss(spriteConfigs.right);
          console.log("right");
        } else if (position.x < remotePos.x) {
          console.log("left");
          _ss(spriteConfigs.left);
        }
      } else {
        if (position.y > remotePos.y) {
          console.log("up");
          _ss(spriteConfigs.up);
        } else if (position.y < remotePos.y) {
          console.log("down");
          _ss(spriteConfigs.down);
        }
      }

      // subscription logic
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
      <spriteMaterial map={texture} />
    </sprite>
  );
};

const spriteConfigs = {
  stand: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 1,
    spriteX: 0,
    spriteY: 7,
    interval: 0.2,
  },
  left: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 0,
    interval: 0.2,
  },
  right: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 1,
    interval: 0.2,
  },
  up: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 2,
    interval: 0.2,
  },
  down: {
    spriteSheetUrl: `/charh.png`,
    xCount: 8,
    yCount: 8,
    spriteFrames: 6,
    spriteX: 0,
    spriteY: 3,
    interval: 0.2,
  },
};
