import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/index.module.css";

const Home: NextPage = () => {
  const { data, status } = useSession();

  if (status === "loading") {
    return <p>loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Head>
          <title>Agora Virtual Space</title>
        </Head>
        <div
          className={styles.containerOuter}
          style={{ flexDirection: "column" }}
        >
          <h1 className={styles.title}>Login</h1>
          <div>
            <button onClick={() => void signIn()} className={styles.button}>
              Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={styles.containerOuter}
        style={{ flexDirection: "column" }}
      >
        <h1 className={styles.title}></h1>
        <h3>Hi {data?.user.name}</h3>
        <div style={{ flexDirection: "column" }}>
          <Link href={"/view"}>
            <button className={styles.button}>View Rooms</button>
          </Link>
          <Link href={"/create"}>
            <button className={styles.button}>Create</button>
          </Link>
        </div>

        <div>
          <button onClick={() => void signOut()} className={styles.button}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
