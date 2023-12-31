import { auth, db } from "@/config/firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const firestoreApi = {
  async setupMemberInfo(imgUrl: string, email: string, name: string) {
    await setDoc(doc(db, "Member", auth.currentUser!.uid), {
      avatar: imgUrl,
      email: email,
      name: name,
      favorite_articles: [],
      favorite_stocks: [],
      realized: [],
      unrealized: [],
      cash: 100000,
      dashboard_layout: [],
    });
  },

  async getMemberInfo(id: string) {
    const memberRef = doc(db, "Member", id);
    const memberData = await getDoc(memberRef);
    return memberData.data();
  },

  async updateDashboardLayout(newLayout: object[]) {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
    await updateDoc(memberRef, {
      dashboard_layout: newLayout,
    });
  },

  async ifChartExistInDashboard(id: string) {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
    const memberData = await getDoc(memberRef);
    const dashboardLayout = memberData.data()?.dashboard_layout;
    const ifExist = dashboardLayout?.find(
      (item: { i: string }) => item.i === id,
    );
    if (ifExist) return true;
  },

  async sendNewMessage(id: string, message: object) {
    if (!auth.currentUser) return;
    const chatRoomsRef = doc(db, "ChatRooms", id);
    await updateDoc(chatRoomsRef, {
      messages: arrayUnion(message),
    });
  },

  async updateMemberCashAndUnrealized(cash: number, unrealized: object[]) {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
    await updateDoc(memberRef, {
      cash: cash,
      unrealized: unrealized,
    });
  },

  async updateRealized(
    OldRealized: object[],
    newRealized: {
      stock_id: string;
      sell_price: number;
      volume: number;
      buy_price: number;
      time: Date;
    },
  ) {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
    await updateDoc(memberRef, {
      realized: [...OldRealized, newRealized],
    });
  },

  async cancelEntrustment(id: string) {
    const entrustmentRef = doc(db, "Trades", id);
    await updateDoc(entrustmentRef, {
      status: "已取消",
    });
  },

  async handleTrade(
    buySell: string,
    stockID: string,
    trade: string,
    order: string,
    price: number,
    volume: number,
  ) {
    const docRef = await addDoc(collection(db, "Trades"), {
      buy_or_sell: buySell,
      stock_id: stockID,
      trade_type: trade,
      order_type: order,
      member_id: auth.currentUser?.uid,
      status: "委託成功",
      order: {
        price: price,
        volume: volume,
        time: new Date(),
      },
      deal: {
        price: 0,
        volume: 0,
        time: new Date(),
      },
    });
    const newDocID = docRef.id;
    await updateDoc(doc(db, "Trades", newDocID), {
      id: newDocID,
    });
  },

  async getEntrustment() {
    const orderQuery = query(
      collection(db, "Trades"),
      where("member_id", "==", auth.currentUser?.uid || ""),
    );
    if (!auth.currentUser) return;
    const orders = await getDocs(orderQuery);
    return orders;
  },

  async matchmaking(id: string, orderPrice: number, orderVolume: number) {
    const entrustmentRef = doc(db, "Trades", id);
    await updateDoc(entrustmentRef, {
      status: "已成交",
      deal: {
        price: orderPrice,
        volume: orderVolume,
        time: new Date(),
      },
    });
  },

  async updateFavorite(id: string, type: string, favoriteType: string) {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
    if (type === "remove") {
      await updateDoc(memberRef, {
        [favoriteType]: arrayRemove(id),
      });
      return;
    }
    await updateDoc(memberRef, {
      [favoriteType]: arrayUnion(id),
    });
  },

  getExistedMessageOrSetNewChatRoom(id: string) {
    const chatRoomsRef = doc(db, "ChatRooms", id!);
    return new Promise((resolve, reject) => {
      onSnapshot(chatRoomsRef, (doc) => {
        if (doc.data() === undefined) {
          setDoc(chatRoomsRef, {
            messages: [],
          })
            .then(() => {
              resolve([]);
            })
            .catch(reject);
        } else {
          resolve(doc.data()?.messages);
        }
      });
    });
  },

  async getAllEngagedChatRooms() {
    const chatRoomsRef = collection(db, "ChatRooms");
    const querySnapshot = await getDocs(chatRoomsRef);
    const chatRooms = querySnapshot.docs.map((doc) => doc.data().messages);
    const userEngagedChatRooms = chatRooms.filter(
      (chatRoom) =>
        chatRoom.length > 0 &&
        chatRoom
          .map(
            (message: { member_id: string }) =>
              message.member_id === auth.currentUser?.uid,
          )
          .includes(true),
    );
    return userEngagedChatRooms;
  },
};

export default firestoreApi;
