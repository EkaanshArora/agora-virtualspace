const Card = (props: { text: string }) => (
  <div className="flex h-screen w-screen flex-wrap justify-center bg-gray-50">
    <div className="flex h-24 w-64 items-center justify-center self-center rounded bg-white shadow-lg">
      {props.text}
    </div>
  </div>
);
export default Card;
