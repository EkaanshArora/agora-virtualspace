import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

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
          <h1 className="my-10 text-6xl font-bold leading-3 text-gray-700">Agora Virtual Space</h1>
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
        <h1 className="my-10 text-6xl font-bold leading-3 text-gray-700">Agora Virtual Space</h1>
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

export default Home;
