import { type PropsWithChildren } from "react";

const Card: React.FC<PropsWithChildren<{ text: string }>> = (props) => (
  <div className="flex h-screen w-screen flex-col flex-wrap justify-center bg-gray-50">
    <div className="flex h-32 w-72 items-center justify-center self-center rounded bg-white p-4 shadow-lg">
      {props.text}
    </div>
    {props.children}
  </div>
);
export default Card;
