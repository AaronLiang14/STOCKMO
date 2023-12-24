import { auth, db } from "@/config/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firestoreApi = {
  async getMemberInfo() {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser?.uid);
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
  async sendNewMessage(id: string, message: object) {
    if (!auth.currentUser) return;
    const chatRoomsRef = doc(db, "ChatRooms", id);
    await updateDoc(chatRoomsRef, {
      messages: arrayUnion(message),
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
