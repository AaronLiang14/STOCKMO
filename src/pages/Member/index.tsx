import { useEffect } from "react";
import useLoginStore from "../../utils/useLoginStore";
import Login from "./Login";
import MemberInfo from "./MemberInfo";

export default function Member() {
  const { init, handleLogout, isLogin } = useLoginStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      {isLogin ? (
        <>
          <MemberInfo />
          <button
            type="button"
            className="mb-2 me-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
            onClick={handleLogout}
          >
            登出
          </button>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}
