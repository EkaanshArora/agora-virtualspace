import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
  const roomDetails = api.example.getRoom.useQuery({roomId: router.query.channel as string })
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
  console.log('!',roomDetails.data?.stageName)

  return ready ? (
    <>
      {/* <h1 className="text-2xl font-bold">{router.query.name}</h1> */}
      {tokenDetails.data && roomDetails.data ? (
        <>
          <button
            className="absolute z-10"
            onClick={() => {
              void router.push("/").then(() => {
                router.reload();
              });
            }}
          >
            back
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
    </>
  ) : (
    <></>
  );
};

export default Call;
