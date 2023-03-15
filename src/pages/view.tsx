import { useRouter } from "next/router";
import { api } from "../utils/api";
import Card from "../ui/Card";
import Link from "next/link";
import SecondaryButton from "../ui/SecondaryButton";

const ViewRooms = () => {
  const rooms = api.example.getAllRooms.useQuery();
  const router = useRouter();
  if (rooms.isLoading || !rooms.data) {
    return <Card text="loading..." />;
  }
  return (
    <div className="h-max min-h-screen bg-gray-100">
      <h1 className="mb-8 p-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900">
        Rooms
      </h1>
      <div className="m-8 flex flex-wrap">
        {rooms.data &&
          rooms.data.map((room) => (
            <div
              key={room.roomId}
              className="min-w-sm min-h-96 m-auto mb-4 flex max-w-sm flex-wrap justify-center"
            >
              <button
                className="flex w-full cursor-pointer flex-col items-center justify-center self-center rounded bg-white p-4 shadow-sm hover:shadow-lg"
                onClick={() => {
                  void router.push(`game/${room.roomId}`);
                }}
              >
                <p className="text-xl font-bold ">{room.name}</p>
                <p className="text-md font-normal text-gray-500 ">{room.description}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="m-auto h-64 w-96 object-cover pb-2"
                  src={`/${room.stageName ?? "stage"}.webp`}
                  alt="stage"
                />
              </button>
            </div>
          ))}
      </div>
      <Link href="/">
        <SecondaryButton>back</SecondaryButton>
      </Link>
      <br />
      <br />
    </div>
  );
};

export default ViewRooms;
