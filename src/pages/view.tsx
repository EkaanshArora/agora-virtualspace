import { useRouter } from "next/router";
import { api } from "../utils/api";
import Card from "../ui/Card";
import Link from "next/link";

const ViewRooms = () => {
  const rooms = api.example.getAllRooms.useQuery();
  const router = useRouter();
  if (rooms.isLoading || !rooms.data) {
    return <Card text="loading..." />;
  }
  return (
    <div className="h-max bg-gray-100 min-h-screen">
      <h1 className="mb-8 p-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
        Rooms:
      </h1>
      <div className="flex flex-wrap m-8">
        {rooms.data &&
          rooms.data.map((room) => (
            <div key={room.roomId} className="mb-4 flex flex-wrap justify-center max-w-sm min-w-sm m-auto min-h-96">
              <button
                className="flex cursor-pointer flex-col items-center justify-center self-center rounded bg-white p-4 shadow-sm hover:shadow-lg w-full"
                onClick={() => {
                  void router.push(`game/${room.roomId}`);
                }}
              >
                <p className="text-xl font-bold dark:text-white">{room.name}</p>
                <p className="text-md font-normal text-gray-500 dark:text-gray-400 truncate w-56">
                  {room.description}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-64 w-96 m-auto pb-2 object-cover" src={`/${(room.stageName ?? 'stage') as string}.webp`} alt="stage" />
              </button>
            </div>
          ))}
      </div>
      <br />
      <Link href="/">back</Link>
      <br />
      <br />
    </div>
  );
};

export default ViewRooms;
