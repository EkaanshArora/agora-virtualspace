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
  const roomDetails = api.main.getRoom.useQuery({ roomId: router.query.channel as string });
  const tokenDetails = api.main.getToken.useQuery(
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

  return ready ? (
    <div
      className="fixed top-0 h-full w-screen overflow-auto bg-gray-100"
      style={{ transform: "translate3d(0,0,0)" }}
    >
      {tokenDetails.data && roomDetails.data ? (
        <>
          <button
            className="absolute left-2 z-10 my-2 cursor-pointer rounded bg-white bg-opacity-60 px-2 py-1 shadow-sm hover:shadow-lg"
            onClick={() => {
              void router.push("/").then(
                // gc everything
                () => void router.reload()
              );
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
            character={characters.timmy}
          />
        </>
      ) : (
        <Card text="error" />
      )}
    </div>
  ) : (
    <Card text="loading..." />
  );
};

export default Call;
