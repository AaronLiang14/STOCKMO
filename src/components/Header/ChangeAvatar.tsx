import useLoginStore from "@/utils/useLoginStore";
import { Avatar } from "@nextui-org/react";

export default function ChangeAvatar() {
  const { avatar, handleAvatarChange } = useLoginStore();

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <Avatar
          src={avatar || undefined}
          className="h-24 w-24 text-large"
          alt="previewIMG"
        />
      </div>
      <input
        className="my-4 block cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none "
        id="file_input"
        type="file"
        onChange={handleAvatarChange}
      />
    </>
  );
}
