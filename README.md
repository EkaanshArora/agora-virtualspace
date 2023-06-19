# Agora Virtual Space

A 2D virtual space where user's can move around and voice/video chat with other user's near them.

> Here's a [live demo](https://agora-virtualspace.vercel.app/)

![screenshot](/readmeassets/screenshot.png)

## Table of Contents
  * [Table of Contents](#table-of-contents)
  * [Getting Started](#getting-started)
    + [To run locally:](#to-run-locally)
  * [Features](#features)
  * [Project Structure](#project-structure)
    + [Frontend Components](#frontend-components)
  * [Diagrams](#diagrams)
    + [Architecture](#architecture)
    + [User Flow](#user-flow)
    + [Backend](#backend)
    + [Components](#components)
  * [Screenshots](#screenshots)
    + [Home](#home)
    + [Create Room](#create-room)
    + [View Rooms](#view-rooms)
    + [VirtualSpace](#virtualspace)
  * [Code Breakdown](#code-breakdown)
    + [High-level App](#high-level-app)
    + [Virtual Space Page](#virtual-space-page)
    + [Videos](#videos)
    + [Game](#game)
      - [Container](#container)
      - [Player](#player)
      - [RemoteSprite](#remotesprite)
    + [Audio/Video Chat](#audiovideo-chat)        
## Getting Started
### To run locally:

- Rename `.env.example` to `.env` and fill in the required details
- Execute `pnpm i` (if you don't hav pnpm install with `npm i -g pnpm`)
- Execute `pnpm run dev` to start a server on [localhost:3000](http://localhost:3000)

The tools we'll use for this projects are:
- Agora RTC & RTM SDKs
- React
- NextJS
- React-three-fiber
- Prisma
- tRPC
- NextAuth (GitHub)

## Features

| **Feature** | **Description** |
| --- | --- |
| OAuth | Uses NextAuth for authentication |
| Space Management | Create & join rooms |
| Virtual Environment | A 2D enviornment that resembles an office or an event |
| User Avatar | A 2D avatar that the user can move around in the virtual space with the keyboard |
| Data Synchronisation | Sync locations across user |
| Animations | Animate the avatar with a spritesheet |
| Voice Channel | Ability for users to communicate with each other over voice |
| Video Feeds | Display user videos |
| Agora Tokens | Expose an API to secure rooms  |
| Proximity Subscription | Ability to join a voice channel based on location proximity |
| User controls | Ability to mute/unmute local audio/video feeds |
| Mobile Support | Works on mobile devices using gesture handler |
| Deployment (CI/CD) | Deploy the frontend and backend online |

## Project Structure
```
├── package.json
├── prisma
├── public
├── src
│   ├── agora-rtc-react.tsx
│   ├── components
│   ├── env
│   ├── pages
│   │   ├── api
│   │   ├── _app.tsx
│   │   ├── create.tsx
│   │   ├── game
│   │   │   └── [channel].tsx
│   │   ├── index.tsx
│   │   └── view.tsx
│   ├── server
│   ├── styles
│   ├── ui
│   └── utils
```
### Frontend Components
```
├── GameContainer.tsx
├── GameRelated
│   ├── Game.tsx
│   ├── Player.tsx
│   ├── RemoteSprite.tsx
│   └── Stage.tsx
├── RouteValidator.tsx
├── types.ts
├── utils.ts
└── VideoOverlay
    ├── AgoraHelpers.tsx
    ├── Buttons
    │   ├── AudioMuteButton.tsx
    │   ├── ButtonContainer.tsx
    │   └── VideoMuteButton.tsx
    ├── RemoteVideo.tsx
    └── Videos.tsx
```
## Diagrams
### Architecture
![](readmeassets/architecture.png)
### User Flow
![](readmeassets/userflow.png)
### Backend
![](readmeassets/backend.png)

### Components
![](readmeassets/components.png)
## Screenshots
### Home
![](readmeassets/home.png)
### Create Room
![](readmeassets/create.png)

### View Rooms
![](readmeassets/view.png)
### VirtualSpace
![](readmeassets/screenshot.png)

## Code Breakdown

### High-level App
We're using NextJS to create our app, each route exists as a file in the `pages` directory. 
We've implemented Auth using NextAuth, an authenticated user can create a room or view existing rooms. On room creation we store it to our database and list the rooms on the view screen. Rooms are where people can interact with each other, each room is an isolated space.
```tsx
const Home: NextPage = () => {
  const { data, status } = useSession();

  if (status === "loading") {
    <Card text="loading..." />;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Head>
          <title>Agora Virtual Space</title>
        </Head>
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100">
          <h1 className="my-10 text-5xl font-bold leading-none text-gray-700">
            Agora Virtual Space
          </h1>
          <div className="my-10">
            <SecondaryButton onClick={() => void signIn()}>Sign In</SecondaryButton>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="my-10 text-5xl font-bold leading-none text-gray-700">Agora Virtual Space</h1>
        <div className="my-10 flex-col">
          <Link href={"/view"}>
            <PrimaryButton>View Rooms</PrimaryButton>
          </Link>
          <Link href={"/create"}>
            <PrimaryButton>Create Room</PrimaryButton>
          </Link>
        </div>
        <div className="my-10">
          <h3 className="m-2">Signed in as: {data?.user.name}</h3>
          <SecondaryButton onClick={() => void signOut()}>Sign Out</SecondaryButton>
        </div>
      </div>
    </>
  );
};
```

### Virtual Space Page
We're using React-Three-Fiber which uses an HTML Canvas and ThreeJS to render out the virtual-space. The user can see themself as a "human" sprite, all remote users are rendered with a "bird" sprite of different colors. Moving close to another user starts a video chat which is rendered on top of the 2D stage in the bottom of the screen. We're using Agora RTM SDK to send & receive the positions of the users in the room. 

```tsx
<div className="h-screen w-screen bg-gray-100">
  <Videos
    playerPos={playerPos}
    localAudioTrack={tracks[0]}
    localVideoTrack={tracks[1]}
    remoteUsers={remoteUsers}
    localVideoMuteState={localVideoMuteState}
  />
  <Buttons
    localVideoMuteState={localVideoMuteState}
    setLocalVideoMuteState={setLocalVideoMuteState}
    localAudioTrack={tracks[0]}
    localVideoTrack={tracks[1]}
  />
  <Game
    setPlayerPos={setPlayerPos}
    remoteUsers={remoteUsers}
    playerPos={playerPos}
    character={character}
    stageName={stageName}
  />
</div>
```
### Videos
Renders the videos in the bottom of the screen
```tsx
<div className="absolute right-0 bottom-0 z-10 flex h-32 w-screen justify-center p-2">
  {Object.keys(remoteUsers).map((uid) => (
    <RemoteVideo key={uid} uid={uid} remoteUsers={remoteUsers} playerPos={playerPos} />
  ))}
  {!localVideoMuteState ? (
    <div className="mx-1 h-full w-24">
      <AgoraVideoPlayer
        className="h-24 w-24 overflow-hidden rounded-full"
        videoTrack={localVideoTrack}
      />
      <div className="m-1 rounded-full bg-white leading-tight opacity-60">
        <p className="m-auto w-20 justify-center self-center overflow-hidden text-ellipsis whitespace-nowrap align-middle text-sm">
          you
        </p>
      </div>
    </div>
  ) : (
    <MutedVideo name={"you"} />
  )}
</div>
```
### Game
The game component is the actual react-three-fiber canvas that houses the 2D space and character rendering and logic
#### Container
Composes the different components we need to render on screen
```tsx
<>
  <Canvas {...bind()} style={{touchAction: 'none'}}>
    <KeyboardControls map={keyMap}>
      <Stage stageName={stageName} />
      <Player setPlayerPos={setPlayerPos} character={character} />
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
</>
```
#### Player
The local user is rendered by this component while also handling the user controls
```tsx
export const Player = (props: {
  setPlayerPos: Dispatch<SetStateAction<Vector3>>;
  character: customSpriteConfig;
}) => {
  const ref = useRef<Sprite>(null);
  const { setPlayerPos, character } = props;
  const [spriteState, setSpriteState] = useState(character.left);
  const texture = useAnimatedSprite(ref as MutableRefObject<Sprite>, spriteState);
  const frustum = useRef(new Frustum());
  const boundsMatrix = useRef(new Matrix4());
  const counter = useRef(0);
  const [, get] = useKeyboardControls<Controls>();

  useFrame((s, dl) => {
    if (!ref.current) return;
    // handle user controls
    if (dragRef[0] || dragRef[1]) {
      handleMouse(setSpriteState, character);
    } else {
      const keyState = get();
      handleKeyboard(keyState, setSpriteState, character);
      if (keyState.jump) {
        // reset position on jump
        ref.current.position.set(0, 0, 0);
      }
    }
    // handle out of bounds
    boundsMatrix.current.multiplyMatrices(s.camera.projectionMatrix, s.camera.matrixWorldInverse);
    frustum.current.setFromProjectionMatrix(boundsMatrix.current);
    if (!frustum.current.containsPoint(ref.current.position)) {
      ref.current.position.lerp(new Vector3(0, 0, 0), 0.1);
      setPlayerPos(ref.current.position);
    } else {
      ref.current.position.addScaledVector(_velocity, character.speed * dl);
      ref.current.position.z = 1;
      setPlayerPos(ref.current.position);
    }
    // throttle
    const time = s.clock.getElapsedTime();
    const factor = 10;
    if (Math.round(time * factor) / factor > counter.current) {
      sendPositionRTM(ref.current.position);
      counter.current = Math.round(time * factor) / factor;
    }
  });

  return (
    <sprite ref={ref} scale={character.charSize}>
      <spriteMaterial map={texture} />
      <Text scale={[0.36, 0.18, 1]} anchorY={3} outlineWidth={0.04}>
        You
      </Text>
    </sprite>
  );
};
```
#### RemoteSprite
The remote user is rendered as a remote sprite
```tsx
export const RemoteSprite = (props: { position: Vector3; playerPos: Vector3; uid: number }) => {
  const spriteRef = useRef<Sprite>(null);
  const circleRef = useRef<Sprite>(null);
  const randomPetRef = useRef(getRandomPet());
  const spriteConfigPet = randomPetRef.current;
  const [sprite, setSprite] = useState(spriteConfigPet.stand);
  const texture = useAnimatedSprite(spriteRef as MutableRefObject<Sprite>, sprite);
  const { position, playerPos, uid } = props;
  const { data } = api.main.getUserName.useQuery({ agoraId: uid });

  useFrame(() => {
    const remotePos = spriteRef.current?.position;
    const agoraUser = AgoraDict[uid];
    if (remotePos) {
      remotePos.lerp(position, 0.5);
      circleRef.current?.position.set(position.x, position.y, position.z - 0.2);
      // spritesheet logic
      handleSprite(setSprite, position, remotePos, spriteConfigPet);
      if (agoraUser) {
        // subscription logic
        handleSubscription(remotePos, playerPos, agoraUser);
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

function handleSubscription(remotePos: Vector3, playerPos: Vector3, agoraUser: agoraUserType) {
  if (remotePos.distanceTo(playerPos) > distanceToUnsubscribe &&
    agoraUser.isSubscribedAudio) {
    void rtcClient
      .unsubscribe(agoraUser.agoraUser, "audio")
      .then(() => (agoraUser.isSubscribedAudio = false))
      .catch(console.log);
  }
  ...
}

```
### Audio/Video Chat
We're using the Agora RTC SDK for Audio and Video chat. On joining a room we join an Agora RTC and RTM channel. When a user moves in the requisite distance, we selectively subscribe their available audio/video.
We've created a react wrapper for the Agora Web SDK which is used as follows:

```tsx
export const rtmChannel = rtmClient.createChannel(window.location.pathname.slice("/game/".length));
export const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
...
function GameContainer(props: GameProps) {
  const { isSuccess: ready, data: tracks, error } = useMicrophoneAndCameraTracks("usetrack");

  useEffect(() => {
    async function init() {
      // RTC
      if (ready && tracks) {
        try {
          rtcClient.on("user-joined", (user) => {
            AgoraDict[user.uid as number] = {
              agoraUser: user,
              isSubscribedVideo: false,
              isSubscribedAudio: false,
            };
          });
          rtcClient.on("user-left", (user) => {
            setRemoteUsers((ps) => {
              const copy = { ...ps };
              delete copy[user.uid as number];
              return copy;
            });
            delete AgoraDict[user.uid as number];
          });
          await rtcClient.join(appId, channel, rtcToken, agoraId);
          await rtcClient.publish(tracks).catch((e) => {
            console.log(e);
          });
        } catch (e) {
          console.log("!", e);
        }
        // RTM
        try {
          rtmChannel.on("ChannelMessage", (message, uid) =>
            handleChannelMessage(message, uid, setRemoteUsers)
          );
          await rtmClient.login({ uid: String(agoraId), token: rtmToken });
          await rtmChannel.join();
        } catch (e) {
          console.log(e);
        }
        console.log(`joined RTM: ${agoraId} ${rtmChannel.channelId}`);
      }
    }
    void init();

    return () => {
      const func = () => {
        void sendPositionRTM(new Vector3(1000, 1000, 100));
        rtmChannel.removeAllListeners();
        rtcClient.removeAllListeners();
        setRemoteUsers({});
        AgoraDict = {};
      };
      try {
        void func();
      } catch (e) {
        console.log(e);
      }
    };
  }, [ready]);
  ...
```