import { FiUser } from "react-icons/fi";

export function MutedVideo(props: { name: string | null | undefined } | undefined) {
  return (
    <div className="mx-1 flex h-full w-28 flex-col items-center justify-center rounded-full bg-gray-200">
      <FiUser size={36} />
      <p
        className="w-24 overflow-hidden text-ellipsis whitespace-nowrap px-1 text-sm leading-4"
        // style={{
        //   lineHeight: '1em',
        //   display: '-webkit-box',
        //   WebkitLineClamp: 2,
        //   WebkitBoxOrient: 'vertical',
        //   height: '2em',
        //   overflow: 'hidden',
        //   // whiteSpace:'nowrap',
        //   maxWidth: '5rem',
        //   textOverflow:'ellipsis',
        //   width: '100%',
        // }}
      >
        {props?.name}
      </p>
    </div>
  );
}
