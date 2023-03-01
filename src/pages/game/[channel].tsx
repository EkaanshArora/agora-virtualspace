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
  const q = api.example.getToken.useQuery(
    { channel: router.query.channel as string },
    {
      refetchOnWindowFocus: false,
      enabled: router.query.channel !== undefined,
    }
  );

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true);
  }, [router.isReady]);

  if (session.status === "loading") return <Card text="loading..." />;
  if (session.status === "unauthenticated") void router.replace("/");
  if (q.isLoading) return <Card text="loading..." />;
  if (q.isError) return <Card text="error" />;

  return ready ? (
    <>
      {/* <h1 className="text-2xl font-bold">{router.query.name}</h1> */}
      {q.data.agoraId ? (
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
            agoraId={q.data.agoraId}
            rtmToken={q.data.rtm}
            rtcToken={q.data.rtc}
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
