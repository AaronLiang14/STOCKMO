import ChangeAvatar from "@/components/Header/ChangeAvatar";
import useLoginStore from "@/utils/useLoginStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginBG from "./LoginBG.jpg";

export default function Login() {
  const {
    handleGoogleLogin,
    handleNativeSignUp,
    handleNativeLogin,
    avatarFile,
  } = useLoginStore();

  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleGoogle = async () => {
    await handleGoogleLogin();
    navigate("/");
  };

  return (
    <>
      <div
        className="flex h-[calc(100vh)] items-center justify-center bg-cover bg-top sm:bg-top"
        style={{
          backgroundImage: `url(${LoginBG})`,
        }}
      >
        <div className="m-auto w-8/12 max-w-md rounded-lg bg-white bg-opacity-80">
          <div className="rounded-lg px-10 py-8 shadow">
            {isSignUp && <ChangeAvatar />}
            <form className="space-y-6" action="#" method="POST">
              {isSignUp && (
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="name"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {isSignUp ? (
                <div className="flex w-full gap-4">
                  <div
                    className="flex w-full  justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 "
                    onClick={() => {
                      handleNativeSignUp(
                        email,
                        password,
                        name,
                        avatarFile as File,
                      );
                      navigate("/");
                    }}
                  >
                    註冊
                  </div>
                </div>
              ) : (
                <div className="flex w-full gap-4">
                  <div
                    className="flex w-full  justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 "
                    onClick={() => {
                      handleNativeLogin(email, password);
                      toast.success("登入成功");
                      navigate("/");
                    }}
                  >
                    登入
                  </div>
                </div>
              )}

              <div
                onClick={() => setIsSignUp(!isSignUp)}
                className="cursor-pointer text-right"
              >
                {isSignUp ? (
                  <span>Already have an account?</span>
                ) : (
                  <span>Create an account</span>
                )}
              </div>

              {!isSignUp && (
                <>
                  <div className="relative  ">
                    <div className="relative flex justify-center text-sm">
                      <span className=" px-2 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="flex w-full justify-center gap-2 rounded-lg border border-slate-200 bg-gray-100 px-4 py-2 text-slate-700 transition  hover:border-slate-400 hover:text-slate-900 hover:shadow "
                      onClick={() => handleGoogle()}
                    >
                      <img
                        className="h-6 w-6"
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google logo"
                      />
                      <span className=" text-black">Google</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
