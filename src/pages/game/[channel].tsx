import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "../../utils/api";

const Game = dynamic(() => import("../../components/GameContainer"), {
  ssr: false,
});

const Call = () => {
  const router = useRouter();
  const session = useSession();
  const [ready, setReady] = useState(false);
  const q = api.example.getToken.useQuery({
    channel: router.query.channel as string,
  });

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true);
  }, [router.isReady]);

  if (session.status === "loading") return <p>loading..</p>;
  if (session.status === "unauthenticated") void router.replace("/");
  if (q.isLoading) return <p>joining...</p>;
  if (q.isError) return <p>error</p>;

  return ready ? (
    <>
      <h1 className="text-2xl font-bold">{router.query.name}</h1>
      {q.data.agoraId ? (
        <>
          <button
            onClick={() => {
              void router.push("/").then(() => {
                router.reload();
              });
            }}
            style={{ position: "absolute", zIndex: 2 }}
          >
            back
          </button>
          <Game
            channel={router.query.channel as string}
            agoraId={q.data.agoraId}
            rtmToken={q.data.rtm}
            rtcToken={q.data.rtc}
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
