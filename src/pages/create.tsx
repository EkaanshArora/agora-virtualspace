import Link from "next/link";
import { useState } from "react";
import { api } from "../utils/api";
import PrimaryButton from "../ui/PrimaryButton";
import Image from "next/image";

const Create = () => {
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [stageName, setStageName] = useState("stage");
  const mutation = api.main.createRoom.useMutation();

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <form
        className="grid w-80 self-center"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(
            { name: room, description, stageName: stageName },
            {
              onSuccess: () => {
                setDescription("");
                setRoom("");
              },
            }
          );
        }}
      >
        <h1 className="mb-8 pt-8 text-4xl font-extrabold leading-none text-gray-900">
          Create Room
        </h1>
        <div>
          <label htmlFor="room_name" className="mb-2 block text-sm font-medium text-gray-900 ">
            Room name
          </label>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Name"
            type="text"
            id="room_name"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="desc" className="mb-2 block text-sm font-medium text-gray-900 ">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            type="text"
            id="desc"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
            required
          />
        </div>
        <div>
          <label htmlFor="stage" className="m-2 block text-sm font-medium text-gray-900 ">
            Select a map
          </label>
          <Image className="m-auto h-64 pb-2" height={256} width={320} src={`/${stageName}.webp`} alt="stage" />
          <select
            id="stage"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
            onChange={(e) => setStageName(e.target.value)}
          >
            <option value="stage" selected>
              Village
            </option>
            <option value="stage1">Farm</option>
            <option value="stage2">Forest</option>
            <option value="stage3">Water</option>
            <option value="stage4">Sci-Fi</option>
          </select>
        </div>
        <br />
        <div className="mb-2 block text-sm font-medium text-red-600">{mutation.error?.message}</div>
        {mutation.status === "success" && (
          <div>
            <span className="mb-2 text-xl font-medium text-green-600">Room created, </span>
            <Link href="/view">
              <span className="mb-2 text-xl font-medium text-green-600 underline">view rooms</span>
            </Link>
            <span className="mb-2 text-xl font-medium text-green-600">.</span>
          </div>
        )}
        <br />
        <PrimaryButton formAction="submit">Create</PrimaryButton>
        <Link href="/">
          <button className="my-8 cursor-pointer rounded-md bg-white px-4 py-1 text-lg leading-7 text-blue-600 shadow-sm hover:shadow-md">
            back
          </button>
        </Link>
      </form>
    </div>
  );
};
export default Create;
