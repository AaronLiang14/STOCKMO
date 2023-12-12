import { Avatar } from "@nextui-org/react";

const OtherMessage = (
  message: string,
  index: number,
  name: string,
  avatar: string,
  time: string,
  ref: React.RefObject<HTMLDivElement>,
) => {
  const timeString = time.split(":");
  return (
    <div className="flex flex-row" key={index} ref={ref}>
      <Avatar src={avatar} />
      <div className="mb-2 ml-2">
        <p className="mb-1 ml-1 text-xs">{name}</p>
        <p className="inline-block rounded-lg bg-gray-200 px-4 py-2 text-gray-700">
          {message}
        </p>
      </div>
      <div className="mb-2 mr-1 flex items-end">
        <p className="mb-1 ml-1 text-xs">
          {timeString[0]}:{timeString[1]}
          {timeString[2].split(" ")[1]}
        </p>
      </div>
    </div>
  );
};

const MyMessage = (
  message: string,
  index: number,
  name: string,
  avatar: string,
  time: string,
  ref: React.RefObject<HTMLDivElement>,
) => {
  const timeString = time.split(":");
  return (
    <div className="flex flex-row justify-end" key={index} ref={ref}>
      <div className="mb-2 mr-1 flex items-end">
        <p className="mb-1 mr-1 text-xs">
          {timeString[0]}:{timeString[1]}
          {timeString[2].split(" ")[1]}
        </p>
      </div>

      <div className="mb-2 mr-2 text-right" key={index}>
        <p className="mb-1 mr-1 text-xs">{name}</p>
        <p className="inline-block rounded-lg bg-cyan-800 px-4 py-2 text-white">
          {message}
        </p>
      </div>
      <Avatar src={avatar} />
    </div>
  );
};

export { MyMessage, OtherMessage };
