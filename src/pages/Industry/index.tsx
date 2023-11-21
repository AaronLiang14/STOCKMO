import { useEffect } from "react";
import useLoginStore from "../../utils/useLoginStore";

export default function Industry() {
  const { init } = useLoginStore();

  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <p>Industry</p>
    </>
  );
}
