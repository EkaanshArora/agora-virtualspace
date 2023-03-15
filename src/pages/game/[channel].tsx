import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { characters } from "../../components/utils";
import Card from "../../ui/Card";
import { api } from "../../utils/api";

const Game = dynamic(() => import("../../components/GameContainer"), {
  ssr: false,
});

const Call = () => {
  const router = useRouter();
  const session = useSession();
  const [ready, setReady] = useState(false);
  const roomDetails = api.example.getRoom.useQuery({ roomId: router.query.channel as string });
  const tokenDetails = api.example.getToken.useQuery(
    { channel: router.query.channel as string },
    { enabled: router.query.channel !== undefined }
  );

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true);
  }, [router.isReady]);

  if (session.status === "loading") return <Card text="loading..." />;
  if (session.status === "unauthenticated") void router.replace("/");
  if (tokenDetails.isLoading || roomDetails.isLoading) return <Card text="loading..." />;
  if (tokenDetails.isError || roomDetails.isError) return <Card text="error" />;
  console.log("!", roomDetails.data?.stageName);

  return ready ? (
    <div className="bg-gray-100 w-screen h-full overflow-auto fixed top-0" style={{transform: 'translate3d(0,0,0)'}}>
      {tokenDetails.data && roomDetails.data ? (
        <>
          <button
            className="absolute left-2 z-10 my-2 cursor-pointer rounded bg-white bg-opacity-60 px-2 py-1 shadow-sm hover:shadow-lg"
            onClick={() => {
              void router.push("/");
            }}
          >
            <FiArrowLeft />
          </button>
          <Game
            channel={router.query.channel as string}
            agoraId={tokenDetails.data.agoraId}
            rtmToken={tokenDetails.data.rtm}
            rtcToken={tokenDetails.data.rtc}
            stageName={roomDetails.data.stageName}
            character={
              router.query.character === "birb"
                ? characters.pet
                : router.query.character === "devil"
                ? characters.devil
                : characters.timmy
            }
          />
        </>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
};

export default Call;
