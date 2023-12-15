import ChangeAvatar from "@/components/Header/ChangeAvatar";
import useLoginStore from "@/utils/useLoginStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const validationSchema = z.object({
  name: z.string().trim().min(1, { message: "使用者暱稱不可為空" }),
  email: z
    .string()
    .min(1, { message: "請輸入正確的 Email 格式 ex: abc@gmail.com" })
    .email({
      message: "請輸入正確的 Email 格式 ex: abc@gmail.com",
    }),
  password: z.string().trim().min(6, { message: "密碼長度需大於6碼" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function Login() {
  const { handleNativeSignUp, avatarFile, init } = useLoginStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    handleNativeSignUp(
      data.email,
      data.password,
      data.name,
      avatarFile as File,
      () => {
        navigate("/");
        init();
      },
    );
  };

  return (
    <>
      <div className="relative z-20 m-auto w-8/12 max-w-md rounded-lg bg-white bg-opacity-80">
        <div className=" rounded-lg px-10 py-8 shadow">
          <ChangeAvatar />
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
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
                  type="email"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <div className="mt-1 text-xs text-red-500">
                  {errors.email.message}{" "}
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
                  type="password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <div className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </div>
              )}
            </div>

            <div className="flex w-full gap-4">
              <button
                type="submit"
                className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 "
              >
                註冊
              </button>
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
