import useLoginStore from "@/utils/useLoginStore";
import { Avatar } from "@nextui-org/react";

export default function ChangeAvatar() {
  const { avatar, handleAvatarChange } = useLoginStore();
  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <label htmlFor="file_input">
          <Avatar
            src={avatar}
            className="h-24 w-24 cursor-pointer text-large"
            alt="previewIMG"
          />
        </label>
      </div>

      <input
        className="my-4 hidden cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none "
        id="file_input"
        name="file_input"
        type="file"
        onChange={handleAvatarChange}
      />
    </>
  );
}
