import { Canvas, useFrame } from "@react-three/fiber";
import type { KeyboardControlsEntry} from "@react-three/drei";
import { KeyboardControls, useKeyboardControls } from "@react-three/drei";
import type {
  Dispatch,
  SetStateAction
} from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Sprite } from "three";
import { TextureLoader } from "three";
import { Vector3 } from "three";
import type { RtmTextMessage } from "agora-rtm-sdk";
import AgoraRTM from "agora-rtm-sdk";
import { env } from "../env/client.mjs";
import type { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import AgoraRTC from "agora-rtc-sdk-ng";

const appId = env.NEXT_PUBLIC_APP_ID;
const charSize = 0.5;
const _velocity = new Vector3();
const speed = 4;
const map = new TextureLoader().load("/char.png");
const map2 = new TextureLoader().load("/stage.webp");
const distanceToUnsubscribe = 1;
const AgoraDict: { [uid: number]: agoraUserType } = {};

const rtmClient = AgoraRTM.createInstance(appId, {
  logFilter: AgoraRTM.LOG_FILTER_WARNING,
});
const rtmChannel = rtmClient.createChannel("location");
const localUid = Math.floor(Math.random() * 10);
const sendPositionRTM = (position: Vector3) => {
  void rtmChannel.sendMessage({ text: JSON.stringify(position) }).catch(e=>console.log(e));
};

AgoraRTC.setLogLevel(2);
const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}

function App() {
  const [remoteUsers, setRemoteUsers] = useState<remoteUserType>({});
  const [playerPos, setPlayerPos] = useState(new Vector3());
  useEffect(() => {
    async function init() {
      console.log("!UE");

      // RTC
      try {
        rtcClient.on("user-published", (user, type) => {
          console.log("!!!!!!userjoin", user.uid);
          if (type === "audio") {
            AgoraDict[user.uid as number] = {
              agoraUser: user,
              isSubscribed: false,
            };
          }
        });
        rtcClient.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "audio") {
            user.audioTrack?.stop();
            delete AgoraDict[user.uid as number]
            setRemoteUsers((ps) => {
              const copy = {...ps}
              delete copy[user.uid as number]
              return copy
          });
          }
        });

        await rtcClient.join(appId, "test", null, localUid);
        const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await rtcClient.publish([localAudioTrack]).catch((e) => {
          console.log(e);
        });
        console.log("joined RTC: " + String(localUid));
      } catch (e) {
        console.log(e);
      }
      // RTM
      rtmChannel.on("MemberJoined", function (memberId) {
        console.log("!join", memberId);
        setRemoteUsers((p) => ({
          ...p,
          [parseInt(memberId)]: { position: new Vector3(0, 0, 0) },
        }));
      });
      
      rtmChannel.on("MemberLeft", function (memberId) {
        console.log("!leave", memberId);
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
          <Stage />
          <Player setPlayerPos={setPlayerPos} />
          {Object.keys(remoteUsers).map((u) => (
            <RemoteSprite
              playerPos={playerPos}
              position={(remoteUsers[parseInt(u)] as userPosition).position}
              key={u}
              uid={parseInt(u)}
            />
          ))}
        </KeyboardControls>
      </Canvas>
    </div>
  );
}

const Stage = () => {
  return (
    <sprite scale={new Vector3(15, 9, 1)}>
      <spriteMaterial map={map2} />
    </sprite>
  );
};

const Player = (props: { setPlayerPos: Dispatch<SetStateAction<Vector3>> }) => {
  const ref = useRef<Sprite>(null);
  const counter = useRef(0);
  const { setPlayerPos } = props;
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

    if (state.jump) ref.current.position.set(0, 0, 0);
    ref.current.position.addScaledVector(_velocity, speed * dl);
    setPlayerPos(ref.current.position);
    const time = s.clock.getElapsedTime();
    const factor = 10;
    if (Math.round(time * factor) / factor > counter.current) {
      sendPositionRTM(ref.current?.position);
      counter.current = Math.round(time * factor) / factor;
    }
  });

  return (
    <sprite ref={ref} scale={charSize}>
      <spriteMaterial map={map} />
    </sprite>
  );
};

const RemoteSprite = (props: {
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
        }
      } else {
        console.error("no user", agoraUser, AgoraDict);
      }
    }
  });
  return (
    <sprite ref={ref} scale={charSize}>
      <spriteMaterial map={map} />
    </sprite>
  );
};

export default App;

type agoraUserType = {
  agoraUser: IAgoraRTCRemoteUser;
  isSubscribed: boolean;
};

type userPosition = {
  position: Vector3;
};

type remoteUserType = { [uid: number]: userPosition };
