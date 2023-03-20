import { FiUser } from "react-icons/fi";

export function MutedVideo(props: { name: string | null | undefined } | undefined) {
  return (
    <div className="mx-1 h-full w-24">
    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gray-200">
      <FiUser size={36} />
    </div>
    <div className="m-1 rounded-full bg-white leading-tight opacity-60">

      <p className="m-auto w-20 overflow-hidden text-ellipsis whitespace-nowrap text-sm align-middle self-center justify-center">
        {props?.name}
      </p>
      </div>
      </div>
  );
}
