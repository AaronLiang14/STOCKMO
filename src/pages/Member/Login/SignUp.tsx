import ChangeAvatar from "@/components/Header/ChangeAvatar";
import useLoginStore from "@/utils/useLoginStore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const { handleNativeSignUp, avatarFile, init } = useLoginStore();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailClicked, setIsEmailClicked] = useState(false);
  const [isPasswordClicked, setIsPasswordClicked] = useState(false);
  const [isNameClicked, setIsNameClicked] = useState(false);

  const validateEmail = () => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const validatePassword = () => {
    setIsPasswordValid(password.length >= 6);
  };

  return (
    <>
      <div className="relative z-20 m-auto w-8/12 max-w-md rounded-lg bg-white bg-opacity-80">
        <div className=" rounded-lg px-10 py-8 shadow">
          <ChangeAvatar />
          <form className="space-y-6" action="#" method="POST">
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
                  onBlur={() => {
                    setIsNameValid(name.length !== 0);
                    setIsNameClicked(true);
                  }}
                />
              </div>
              {!isNameValid && isNameClicked && (
                <div className="mt-1 text-xs text-red-500">
                  使用者暱稱不可為空
                </div>
              )}
            </div>

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
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  onBlur={() => {
                    validateEmail();
                    setIsEmailClicked(true);
                  }}
                />
              </div>
              {!isEmailValid && isEmailClicked && (
                <div className="mt-1 text-xs text-red-500">
                  請輸入正確的 Email 格式 ex: abc@gmail.com
                </div>
              )}
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
                  onBlur={() => {
                    validatePassword();
                    setIsPasswordClicked(true);
                  }}
                />
              </div>

              {!isPasswordValid && isPasswordClicked && (
                <div className="mt-1 text-xs text-red-500">
                  密碼長度需大於6碼
                </div>
              )}
            </div>

            <div className="flex w-full gap-4">
              <div
                className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 "
                onClick={() => {
                  if (!isEmailValid && !isPasswordValid && !isNameValid) {
                    toast.error("使用者暱稱、帳號及密碼格式錯誤");
                    return;
                  }

                  if (!isEmailValid && !isPasswordValid) {
                    toast.error("帳號及密碼格式錯誤");
                    return;
                  }

                  if (!isEmailValid && !isNameValid) {
                    toast.error("帳號及使用者暱稱格式錯誤");
                    return;
                  }

                  if (!isNameValid) {
                    toast.error("請輸入使用者暱稱");
                    return;
                  }

                  if (!isEmailValid) {
                    toast.error("請輸入正確的 Email 格式");
                    return;
                  }

                  if (!isPasswordValid) {
                    toast.error("密碼長度需大於6碼");
                    return;
                  }

                  if (isEmailValid && isPasswordValid && isNameValid) {
                    handleNativeSignUp(
                      email,
                      password,
                      name,
                      avatarFile as File,
                      () => {
                        navigate("/");
                      },
                    );
                    init();
                  }
                }}
              >
                註冊
              </div>
            </div>

            <div className=" text-right">
              <span>已有帳號？</span>
              <Link
                to="/login/signIn"
                className="cursor-pointer text-blue-500 underline"
              >
                按此登入
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
