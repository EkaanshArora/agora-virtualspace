import { FiUser } from "react-icons/fi";

export function MutedVideo(props: { name: string | null | undefined } | undefined) {
  return (
    <div className="flex h-full w-[200px] flex-col items-center justify-center bg-gray-200">
      <FiUser size={50} />
      <p>{props?.name}</p>
    </div>
  );
}
