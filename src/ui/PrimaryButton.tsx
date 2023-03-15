import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";

const PrimaryButton: React.FC<PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>> = (
  props
) => {
  const { children, ...rest } = props;
  return (
    <button
      className="m-1 mx-4 cursor-pointer rounded-md bg-blue-500 px-6 py-2 text-xl leading-7 text-white shadow-md hover:bg-blue-600 hover:shadow-lg"
      {...rest}
    >
      {children}
    </button>
  );
};
export default PrimaryButton;
