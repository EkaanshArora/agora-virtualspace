import AgoraUIKit from "agora-react-uikit";
import { useRouter } from "next/router";
import { env } from "../env/client.mjs";


const Videocall = (props: { channel: string }) => {
  const router = useRouter()
  return (
    <>
      <h2>{props.channel}</h2>
        <div style={{ width: '100vw', height: '80vh', display: 'flex' }}>
          <AgoraUIKit
            rtcProps={{ appId: env.NEXT_PUBLIC_APP_ID, channel: props.channel }}
            callbacks={{
              EndCall: () => {
                void router.push('/').then(() => { router.reload() })
              }
            }}
          />
        </div> : <></>
    </>
  )

}

export default Videocall;
