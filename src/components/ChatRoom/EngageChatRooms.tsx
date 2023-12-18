import { auth, db } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
import useChatRoomStore from "@/utils/useChatRoomStore";
import { Avatar, Spinner } from "@nextui-org/react";
import { Timestamp, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ChatRoomMessage {
  member_id: string;
  room_id: string;
  text: string;
  message_time: Timestamp;
}

export default function EngageChatRooms() {
  const chatRoomsRef = collection(db, "ChatRooms");
  const [chatRooms, setChatRooms] = useState<ChatRoomMessage[][]>([]);
  const { changeRoomID, changeIsIndependentRoom, changeIsAllRoom } =
    useChatRoomStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAllChatRooms = async () => {
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllChatRooms();
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner className=" flex h-[400px] justify-center bg-white" />
      ) : (
        <div className="h-[395px] overflow-y-auto rounded-b-lg border-1 bg-white shadow-lg">
          {chatRooms.length > 0 ? (
            chatRooms.map((chatRoom) => {
              const stockID = chatRoom[0].room_id;
              const stockName = StockCode.filter(
                (stock) => stock.stockCode === parseInt(stockID),
              );
              const latestMessage = chatRoom[chatRoom.length - 1].text;
              const latestMessageTime =
                chatRoom[chatRoom.length - 1].message_time;
              return (
                <div
                  className="relative m-1 flex cursor-pointer border p-2"
                  key={stockID}
                  onClick={() => {
                    changeRoomID(stockID);
                    changeIsIndependentRoom(true);
                    changeIsAllRoom(false);
                  }}
                >
                  <Avatar
                    showFallback
                    name={stockID}
                    classNames={{
                      base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                      icon: "text-black/80",
                    }}
                    className="min-w-unit-10"
                  />
                  <div className="ml-4 text-xs ">
                    <p className="text-base font-medium">
                      {stockName[0].stockName}
                    </p>
                    <p>{latestMessage}</p>
                  </div>

                  <div className="absolute right-5 top-3 ml-auto">
                    <p className="min-w-unit-20 text-end text-xs">
                      {latestMessageTime.toDate().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <p> 請先至個股頁面</p>
              <Link to="/stock/2330/latest" className="text-blue-500">
                個股頁面
              </Link>
              <p>傳遞訊息來加入聊天室</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
