import { auth, db } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
import { useChatRoomStore } from "@/utils/useLoginStore";
import { Avatar } from "@nextui-org/react";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
interface ChatRoomMessage {
  member_id: string;
  room_id: string;
  text: string;
  message_time: Date;
}

export default function EngageChatRooms() {
  const chatRoomsRef = collection(db, "ChatRooms");
  const [chatRooms, setChatRooms] = useState<ChatRoomMessage[][]>([]);
  const { changeRoomID, changeIsIndependentRoom, changeIsAllRoom } =
    useChatRoomStore();

  const getAllChatRooms = async () => {
    const querySnapshot = await getDocs(chatRoomsRef);
    const chatRooms = querySnapshot.docs.map((doc) => doc.data().messages);
    const userEngagedCharRooms = chatRooms.filter(
      (chatRoom) =>
        chatRoom.length > 0 &&
        chatRoom
          .map(
            (message: { member_id: string }) =>
              message.member_id === auth.currentUser?.uid,
          )
          .includes(true),
    );
    setChatRooms(userEngagedCharRooms);
  };

  useEffect(() => {
    getAllChatRooms();
  }, []);

  return (
    <div className="h-[395px] overflow-y-auto rounded-b-lg border-1 bg-white shadow-lg">
      {chatRooms.length > 0 ? (
        chatRooms.map((chatRoom) => {
          const stockID = chatRoom[0].room_id;
          const stockName = StockCode.filter(
            (stock) => stock.stockCode === parseInt(stockID),
          );
          const latestMessage = chatRoom[chatRoom.length - 1].text;
          const latestMessageTime = chatRoom[chatRoom.length - 1].message_time;
          return (
            <div
              className="m-1 flex cursor-pointer border p-2"
              key={stockID}
              onClick={() => {
                changeRoomID(stockID);
                changeIsIndependentRoom(true);
                changeIsAllRoom(false);
              }}
            >
              <Avatar showFallback name={stockID} />
              <div className="ml-4 text-xs ">
                <p className="text-base font-medium">
                  {stockName[0].stockName}
                </p>
                <p>{latestMessage}</p>
              </div>

              <div className="ml-auto">
                <p className="text-xs">
                  {latestMessageTime.toDate().toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400">
          請先至個股頁面傳遞訊息來加入聊天室
        </div>
      )}
    </div>
  );
}
