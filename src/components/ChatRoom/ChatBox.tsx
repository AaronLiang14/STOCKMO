import StockCode from "@/data/StockCode.json";
import { useChatRoomStore } from "@/utils/useLoginStore";
import { useParams } from "react-router-dom";
import ReturnIcon from "~icons/ion/arrow-return-left";
import Close from "~icons/ion/close-round";
import ChatPlus from "~icons/tabler/message-circle-plus";
import EngageChatRooms from "./EngageChatRooms";
import IndependentChatRoom from "./IndependentChatRoom";

interface ChatBoxProps {
  dispatch: React.Dispatch<{ type: "TOGGLE" }>;
}

export default function ChatBox({ dispatch }: ChatBoxProps) {
  const handleCheckBox = () => {
    dispatch({ type: "TOGGLE" });
  };
  const {
    roomID,
    isAllRoom,
    isIndependentRoom,
    changeIsIndependentRoom,
    changeIsAllRoom,
    changeRoomID,
  } = useChatRoomStore();
  const { id } = useParams();
  const roomName = StockCode.filter(
    (stock) => stock.stockCode === parseInt(roomID),
  )[0].stockName;

  return (
    <>
      <div className="fixed bottom-10 right-32 z-50 w-96">
        <div className="w-full max-w-lg rounded-lg bg-white shadow-md">
          <div className="flex items-center justify-between rounded-t-lg border-b bg-cyan-800 p-4 text-white">
            {isIndependentRoom ? (
              <ReturnIcon
                className="cursor-pointer"
                onClick={() => {
                  changeIsAllRoom(true);
                  changeIsIndependentRoom(false);
                }}
              />
            ) : id ? (
              <ChatPlus
                onClick={() => {
                  changeIsIndependentRoom(true);
                  changeIsAllRoom(false);
                  changeRoomID(id);
                }}
                className="cursor-pointer"
              />
            ) : (
              <div className="w-[19.2px]" />
            )}
            <p className="text-lg font-semibold">
              {isAllRoom ? "聊天室" : roomName}
            </p>
            <Close
              onClick={handleCheckBox}
              className="h-4 w-4 cursor-pointer"
            />
          </div>
        </div>
        {isAllRoom && <EngageChatRooms />}
        {isIndependentRoom && <IndependentChatRoom id={roomID} />}
      </div>
    </>
  );
}
