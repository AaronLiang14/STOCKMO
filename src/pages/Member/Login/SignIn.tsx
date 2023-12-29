import useLoginStore from "@/utils/useLoginStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const validationSchema = z.object({
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
  const { handleGoogleLogin, handleNativeLogin, init } = useLoginStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      email: "user01@gmail.com",
      password: "stockmo2023",
    },
  });

  const navigate = useNavigate();

  const handleGoogle = async () => {
    await handleGoogleLogin();
    navigate("/");
  };

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    handleNativeLogin(data.email, data.password, () => {
      navigate("/");
      init();
    });
  };

  return (
    <>
      <div className="relative z-20 m-auto w-11/12 max-w-md rounded-lg bg-white bg-opacity-80 md:w-8/12">
        <div className=" rounded-lg px-10 py-8 shadow">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  {errors.email.message}
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
              <button className="flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 ">
                登入
              </button>
            </div>

            <div className=" text-right">
              <span>尚未註冊？</span>
              <Link
                to="/login/signUp"
                className="cursor-pointer text-blue-500 underline"
              >
                按此註冊
              </Link>
            </div>

            <div className="relative  ">
              <div className="relative flex justify-center text-sm">
                <span className=" px-2 text-gray-500">或用以下方式登入</span>
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
          </form>
        </div>
      </div>
    </>
  );
}
