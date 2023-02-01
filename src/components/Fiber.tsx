import type { KeyboardControlsEntry } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import type { RefObject } from "react";
import { useLayoutEffect } from "react";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import type { Sprite } from "three";
import { TextureLoader } from "three";
import { Vector3 } from "three";
import type { RtmTextMessage } from "agora-rtm-sdk";
import AgoraRTM from "agora-rtm-sdk";
import { env } from "../env/client.mjs";

const appId = env.NEXT_PUBLIC_APP_ID;
const charSize = 0.7;

const rtmClient = AgoraRTM.createInstance(appId, {
  logFilter: AgoraRTM.LOG_FILTER_WARNING,
});
const rtmChannel = rtmClient.createChannel("location");
const localUid = Math.floor(Math.random() * 10);
const sendPositionRTM = (position: Vector3) => {
  void rtmChannel.sendMessage({ text: JSON.stringify(position) });
};

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}

function App() {
  const [remoteUsers, setRemoteUsers] = useState<remoteUserType>({});
  useEffect(() => {
    async function init() {
      console.log("!UE");
      rtmChannel.on("MemberJoined", function (memberId) {
        console.log("!join", memberId);
        setRemoteUsers((p) => ({
          ...p,
          [parseInt(memberId)]: { position: new Vector3(0, 0, 0) },
        }));
      });

      rtmChannel.on("ChannelMessage", (message, uid) => {
        const position = JSON.parse(
          (message as RtmTextMessage).text
        ) as Vector3;
        setRemoteUsers((p) => ({ ...p, [parseInt(uid)]: { position } }));
      });
      try {
        await rtmClient.login({ uid: String(localUid) });
        await rtmChannel.join();
      } catch (e) {
        console.log(e);
      }
      console.log(`joined RTM: ${localUid} ${rtmChannel.channelId}`);
    }
    void init();

    return () => {
      const func = () => {
        // await rtmChannel.leave();
        rtmChannel.removeAllListeners();
        // await rtmClient.logout();
        setRemoteUsers({});
      };
      try {
        void func();
      } catch (e) {
        console.log(e);
      }
    };
  }, []);
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
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
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <KeyboardControls map={map}>
          <Player remoteUsers={remoteUsers} />
        </KeyboardControls>
      </Canvas>
    </div>
  );
}

const _velocity = new Vector3();
const speed = 4;
const map = new TextureLoader().load("/char.png");
const map2 = new TextureLoader().load("/stage.webp");

const Player = (props: { remoteUsers: remoteUserType }) => {
  const { remoteUsers } = props;
  const ref = useRef<Sprite>(null);
  const remoteRefs = useRef<{ [uid: number]: RefObject<Sprite> }>({});
  useLayoutEffect(() => {
    console.log("!!LE");
    Object.keys(remoteUsers).map(
      (curuid) => (remoteRefs.current[parseInt(curuid)] = createRef())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(remoteUsers).length]);
  const counter = useRef(0);
  const [, get] = useKeyboardControls<Controls>();
  useFrame((s, dl) => {
    if (!ref.current) return;
    const state = get();
    if (state.left && !state.right) _velocity.x = -1;
    if (state.right && !state.left) _velocity.x = 1;
    if (!state.left && !state.right) _velocity.x = 0;

    if (state.forward && !state.back) _velocity.y = 1;
    if (state.back && !state.forward) _velocity.y = -1;
    if (!state.forward && !state.back) _velocity.y = 0;

    ref.current.position.addScaledVector(_velocity, speed * dl);
    const time = s.clock.getElapsedTime();
    const factor = 10;
    if (Math.round(time * factor) / factor > counter.current) {
      sendPositionRTM(ref.current?.position);
      counter.current = Math.round(time * factor) / factor;
    }

    Object.keys(remoteRefs.current).map((r) => {
      const local = remoteRefs.current[parseInt(r)]
      if(local?.current){
      const pos = local.current.position;
      const remoteUser = remoteUsers[parseInt(r)]
      if (remoteUser)
       pos.set(
          pos.x + (remoteUser.position.x - pos.x) / 10,
          pos.y + (remoteUser.position.y - pos.y) / 10,
          0
        );
      }
    });
  });

  
  return (
    <>
    <sprite scale={new Vector3(15, 9, 1)} >
      <spriteMaterial map={map2} />
    </sprite>
      <sprite ref={ref} scale={charSize}>
        <spriteMaterial map={map} />
      </sprite>
      {Object.keys(remoteUsers).map((u) => (
        <>
          {
            <sprite scale={charSize} ref={remoteRefs.current[parseInt(u)]} key={u}>
              <spriteMaterial map={map} />
            </sprite>
          }
        </>
      ))}
    </>
  );
};

export default App;

type userState = {
  // agoraUser: IAgoraRTCRemoteUser,
  position: Vector3;
  // distanceFromUser: number,
  // panValue: number,
  // panNode: StereoPannerNode,
  // gainValue: number,
  // gainNode: GainNode,
  // isSubscribed: boolean,
  // color: string,
};

type remoteUserType = { [uid: number]: userState };
