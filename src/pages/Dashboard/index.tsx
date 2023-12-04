import GDP from "@/components/Graph/Macro/GDP";
import Unemployment from "@/components/Graph/Macro/Unemployment";

export default function Dashboard() {
  return (
    <>
      <div className="pt-24">
        <GDP />
        <Unemployment />
      </div>
    </>
  );
}