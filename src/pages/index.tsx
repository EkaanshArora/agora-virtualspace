import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Link href={'/call/test'}>call</Link>
      <Link href={'/fiber'}>fiber</Link>
    </>
  );
};

export default Home;
