import GDP from "@/components/Graph/Macro/GDP";
import Unemployment from "@/components/Graph/Macro/Unemployment";

export default function Dashboard() {
  return (
    <>
      <div className="mb-24 min-h-[calc(100vh_-_120px)]  pt-24">
        <GDP />
        <Unemployment />
      </div>
    </>
  );
}
