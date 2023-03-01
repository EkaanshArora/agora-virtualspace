import Link from "next/link";
import { useState } from "react";
import { api } from "../utils/api";
import styles from "../styles/index.module.css";

const Create = () => {
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const mutation = api.example.createRoom.useMutation();

  return (
    <div className="flex flex-col">
      <form
        className="grid w-96 gap-4 self-center"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(
            { name: room, description },
            {
              onSuccess: () => {
                setDescription("");
                setRoom("");
              },
            }
          );
        }}
      >
        <h1 className="mb-8 p-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
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
