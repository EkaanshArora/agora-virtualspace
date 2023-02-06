import { useRouter } from "next/router";
import { api } from "../utils/api";
import styles from "../styles/index.module.css";

const ViewRooms = () => {
  const query = api.example.getAllRooms.useQuery();
  const router = useRouter();

  return (
    <>
      <h1 className={styles.title}>Rooms:</h1>
      <div>
        {query.isLoading || !query.data ? (
          <p>loading...</p>
        ) : (
          <>
            {query.data &&
              query.data.map((room) => (
                <div
                  key={room.roomId}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    void router.push(`game/${room.roomId}`);
                  }}
                >
                  <h2>{room.name}</h2>
                  <p>{room.description}</p>
                  <br />
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default ViewRooms;
