import { useEffect } from "react";
import useLoginStore from "../../utils/useLoginStore";

export default function Macroeconomics() {
  const { init } = useLoginStore();

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <p>Macroeconomics</p>
    </>
  );
}
