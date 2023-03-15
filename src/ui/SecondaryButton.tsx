import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";

const SecondaryButton: React.FC<PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>> = (
  props
) => {
  const { children, ...rest } = props;
  return (
    <button
      className="m-1 cursor-pointer rounded-md bg-white px-4 py-1 text-lg leading-7 text-blue-600 shadow-sm hover:shadow-md"
      {...rest}
    >
      {children}
    </button>
  );
};
export default SecondaryButton;
