import { useEffect } from "react";
import useLoginStore from "../../utils/useLoginStore";

export default function Home() {
  const { init } = useLoginStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="">
        <p>Home</p>
      </div>
    </>
  );
}
// h-screen bg-[url('./src/pages/Home/indexBG.png')]
