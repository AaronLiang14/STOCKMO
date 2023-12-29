import ChatRoom from "@/components/ChatRoom";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import ChartsDisplay from "./ChartsDisplay";
import ChartsOptions from "./ChartsOptions";

export default function Dashboard() {
  return (
    <>
      <div className="m-auto flex min-h-[calc(100vh_-_35px)] items-center justify-center pt-20  md:hidden">
        請使用電腦版網頁來啟用儀表板功能
      </div>

      <div className="m-auto hidden w-11/12 flex-col pt-24 sm:pt-36 md:flex">
        <ChartsOptions />
        <ChartsDisplay />
      </div>
      <ChatRoom />
    </>
  );
}
