import ChatRoom from "@/components/ChatRoom";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import ChartsDisplay from "./ChartsDisplay";
import ChartsOptions from "./ChartsOptions";

export default function Dashboard() {
  return (
    <>
      <div className="m-auto flex w-11/12 flex-col pt-24 sm:pt-36">
        <ChartsOptions />
        <ChartsDisplay />
      </div>
      <ChatRoom />
    </>
  );
}
