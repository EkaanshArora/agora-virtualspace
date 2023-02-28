import { useFrame } from "@react-three/fiber";
import { Circle } from "@react-three/drei";
import type { MutableRefObject } from "react";
import { useRef, useState } from "react";
import type { Sprite } from "three";
import { Vector3, ShaderMaterial, Color } from "three";
import { AgoraDict, rtcClient } from "./GameContainer";
import { useAnimatedSprite } from "use-animated-sprite";
import { handleSprite, getRandomPet } from "./utils";

const distanceToUnsubscribe = 1.5;

const custom3Material = new ShaderMaterial({
  transparent: true,
  uniforms: {
    vlak3color1: { value: new Color("#ff00ff") },
  },
  vertexShader: `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, 0.1, 1.0);
    }
  `,
  fragmentShader: `
     
   uniform vec3 vlak3color1;
    uniform vec3 origin;

 
    varying vec3 vUv;
   
    void main() {
      float distance = clamp(length(vUv), 0., 1.0);

      // y < 0 = transparent, > 1 = opaque
      float alpha = smoothstep(1.0, 0.0, distance) / 3.5;
      // y < 1 = color1, > 2 = color2
      float colorMix = smoothstep(1.0, 2.0, vUv.y);
  
      gl_FragColor = vec4(vlak3color1, alpha);
  }
`,
});

export const RemoteSprite = (props: {
  position: Vector3;
  playerPos: Vector3;
  uid: number;
}) => {
  const spriteRef = useRef<Sprite>(null);
  const circleRef = useRef<Sprite>(null); // type hack
  const randomPetRef = useRef(getRandomPet());
  const spriteConfigPet = randomPetRef.current;
  const [sprite, setSprite] = useState(spriteConfigPet.stand);
  const texture = useAnimatedSprite(spriteRef as MutableRefObject<Sprite>, sprite);
  const { position, playerPos, uid } = props;
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
    <>
      <Circle
        scale={distanceToUnsubscribe * 1.2}
        ref={circleRef}
        position={new Vector3(0, -0.2, 0.1)}
        material={
          custom3Material
          // new MeshBasicMaterial({
          //   color: "#f0f",
          //   opacity: 0.1,
          //   transparent: true,
          // })
        }
      />
      <sprite ref={spriteRef} scale={spriteConfigPet.charSize}>
        <spriteMaterial map={texture} />
      </sprite>
    </>
  );
};
