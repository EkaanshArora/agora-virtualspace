import { useRouter } from "next/router";
import { api } from "../utils/api";
import styles from "../styles/index.module.css";
import Card from "../ui/Card";
import Link from "next/link";

const ViewRooms = () => {
  const query = api.example.getAllRooms.useQuery();
  const router = useRouter();
  if (query.isLoading || !query.data) {
    return <Card text="loading..." />;
  }
  return (
    <div className="h-screen bg-gray-50">
      <h1 className="mb-8 p-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        Rooms:
      </h1>
      <div>
        {query.data &&
          query.data.map((room) => (
            <div key={room.roomId} className="mb-4 flex flex-wrap justify-center max-w-xl m-auto">
              <button
                className="flex cursor-pointer flex-col items-center justify-center self-center rounded bg-white p-4 shadow-sm hover:shadow-lg w-full"
                onClick={() => {
                  void router.push(`game/${room.roomId}`);
                }}
              >
                <p className="text-xl font-bold dark:text-white">{room.name}</p>
                <p className="text-md max-w-6xl font-normal text-gray-500 dark:text-gray-400">
                  {room.description}
                </p>
              </button>
            </div>
          ))}
      </div>
      <br />
      <Link href="/">back</Link>
    </div>
  );
};

export default ViewRooms;
