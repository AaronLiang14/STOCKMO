import { Outlet } from "react-router-dom";
import LoginBG from "./LoginBG.jpg";

export default function Login() {
  return (
    <>
      <div
        className="flex h-[calc(100vh)] items-center justify-center bg-cover bg-top sm:bg-top"
        style={{
          backgroundImage: `url(${LoginBG})`,
        }}
      >
        <div className=" absolute inset-0 z-10 h-full w-full bg-black/30"></div>
        <Outlet />
      </div>
    </>
  );
}
