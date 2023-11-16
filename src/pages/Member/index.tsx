import { onAuthStateChanged, signInWithPopup } from "@firebase/auth";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebase";
import Login from "./Login";
import MemberInfo from "./MemberInfo";

export default function Member() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogIn = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/");
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setIsLogin(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (result) => {
      if (result) {
        console.log(result);
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, []);

  return (
    <>
      {isLogin ? (
        <>
          <MemberInfo />
          <button
            type="button"
            className="mb-2 me-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
            onClick={logout}
          >
            登出
          </button>
        </>
      ) : (
        <Login handleLogin={handleLogIn} />
      )}
    </>
  );
}
