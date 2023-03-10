import Link from "next/link";
import { useState } from "react";
import { api } from "../utils/api";
import styles from "../styles/index.module.css";

const Create = () => {
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [stageName, setStageName] = useState("stage");
  const mutation = api.example.createRoom.useMutation();

  return (
    <div className="flex flex-col">
      <form
        className="grid w-96 self-center"
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
        <h1 className="mb-8 pt-8 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          Create Room
        </h1>
        <div>
          <label
            htmlFor="room_name"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Room name
          </label>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Name"
            type="text"
            id="room_name"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
        </div>
        <br />
        <div>
          <label
            htmlFor="desc"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            type="text"
            id="desc"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="stage"
            className="m-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Select a map
          </label>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-64 m-auto pb-2" src={`/${stageName}.webp`} alt="stage" />
          <select
            id="stage"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            onChange={(e)=>setStageName(e.target.value)}
          >
            <option value="stage" selected>Village</option>
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
        <button className={styles.button} formAction="submit">
          Create
        </button>
        <br />
        <Link href="/">back</Link>
      </form>
    </div>
  );
};
export default Create;
