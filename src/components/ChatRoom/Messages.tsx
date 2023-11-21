import { Avatar } from "@nextui-org/react";

const OtherMessage = (
  message: string,
  index: number,
  name: string,
  avatar: string,
) => {
  return (
    <div className="flex flex-row">
      <Avatar src={avatar} />
      <div className="mb-2 ml-2" key={index}>
        <p className="inline-block rounded-lg bg-gray-200 px-4 py-2 text-gray-700">
          {message}
        </p>
        <p>{name}</p>
      </div>
    </div>
  );
};

const MyMessage = (
  message: string,
  index: number,
  name: string,
  avatar: string,
) => {
  return (
    <div className="flex flex-row justify-end ">
      <div className="mb-2 mr-2 text-right" key={index}>
        <p className="inline-block rounded-lg bg-cyan-800 px-4 py-2 text-white">
          {message}
        </p>
        <p>{name}</p>
      </div>
      <Avatar src={avatar} />
    </div>
  );
};

export { MyMessage, OtherMessage };
