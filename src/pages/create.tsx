import Link from "next/link";
import { useState } from "react";
import { api } from "../utils/api";
import styles from "../styles/index.module.css";

const Create = () => {
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");

  const mutation = api.example.createRoom.useMutation();
  return (
    <div style={{ flexDirection: "column" }}>
      <h1 className={styles.title}>
        Create {mutation.isSuccess ? "Another" : ""} Room
      </h1>
      <div style={{ flexDirection: "column" }}>
        <div>
          <label>Name: </label>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="roomname"
          />
        </div>
        <br />
        <div>
          <label>Description: </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
          />
        </div>
      </div>
      <br />
      <div style={{ color: "#ff3333" }}>{mutation.error?.message}</div>
      {mutation.status === "success" ? (
        <div>
          <span style={{ color: "#33ff33" }}>Success, </span>
          <Link href="/view">
            <p style={{ textDecoration: "underline" }}>view rooms</p>
          </Link>
        </div>
      ) : (
        <></>
      )}
      <br />
      <button
        className={styles.button}
        onClick={() => {
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
        Create
      </button>
    </div>
  );
};
export default Create;
