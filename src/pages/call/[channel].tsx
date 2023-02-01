import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
const Videocall = dynamic(
  () => import("../../components/Videocall"),
  { ssr: false }
)

const Call = () => {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true)
  }, [router.isReady]);

  return (
    ready ?
      <>
        <h1 className="text-2xl font-bold" >
          {router.query.name}
        </h1 >
        <Videocall channel={router.query.channel as string} />
      </>
      : <></>
  )
}

export default Call;
