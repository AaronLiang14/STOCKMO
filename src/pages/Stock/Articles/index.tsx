import FullArticle from "@/components/Modals/FullArticles";
import { auth, db } from "@/config/firebase";
import { useFavoritesStore } from "@/utils/useLoginStore";
import { Button, Card } from "@nextui-org/react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import SubmitArticles from "./SubmitArticles";

interface Article {
  author_id: string;
  author_name: string;
  content: string;
  created_time: Date;
  industry: string;
  number_of_favorite: number;
  photo: string;
  reply: string[];
  stock_code: string;
  title: string;
  id: string;
}

const AuthorAvatar = ({ id }: { id: string }) => {
  const [avatar, setAvatar] = useState<string>("");
  const [name, setName] = useState<string>("");
  const getAuthorAvatar = async () => {
    const memberRef = doc(db, "Member", id);
    const docSnap = await getDoc(memberRef);
    if (docSnap.exists()) {
      setAvatar(docSnap.data().avatar);
      setName(docSnap.data().name);
    }
  };
  getAuthorAvatar();

  return (
    <div className="flex flex-shrink-0 flex-row items-end">
      <img className="h-10 w-10 rounded-full" src={avatar} alt="" />
      <p className="pl-2"> {name}</p>
    </div>
  );
};

export default function Articles() {
  const { favoriteArticles, getFavoriteArticles } = useFavoritesStore();
  const { id } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);

  const handleArticleFavorite = async (id: string) => {
    if (!auth.currentUser) {
      toast.error("請先登入");
      return;
    }
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const docSnap = await getDoc(memberRef);

    if (docSnap.exists()) {
      if (docSnap.data().favorite_articles.includes(id)) {
        await updateDoc(memberRef, {
          favorite_articles: arrayRemove(id),
        });
        toast.success("取消收藏");
        return;
      } else {
        await updateDoc(memberRef, {
          favorite_articles: arrayUnion(id),
        });
        toast.success("加入收藏");
      }
    }
  };

  const q = query(collection(db, "Articles"), where("stock_code", "==", id));
  const getArticlesByStock = async () => {
    const querySnapshot = await getDocs(q);
    const articlesData = querySnapshot.docs.map((doc) => doc.data());
    setArticles(articlesData as Article[]);
  };

  useEffect(() => {
    onSnapshot(q, () => {
      getArticlesByStock();
    });
  }, []);

  useEffect(() => {
    getFavoriteArticles();
  }, [favoriteArticles, auth.currentUser]);

  return (
    <div>
      <SubmitArticles />
      <div className="mx-auto my-12">
        <div
          className={`grid gap-12 lg:max-w-none ${
            articles.length > 0 && "lg:grid-cols-3"
          }`}
        >
          {articles.length === 0 ? (
            <div className="flex items-center justify-center">
              <p className="text-2xl">目前沒有文章，點擊右上方按鈕來發表！</p>
            </div>
          ) : (
            articles.map((post, index) => (
              <Card
                className="flex flex-col overflow-hidden rounded-lg "
                key={index}
              >
                <div>
                  <img
                    className="h-48 w-full object-cover"
                    src={post.photo}
                    alt={post.title}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </p>
                  </div>
                  <div className="relative mt-6 flex items-center justify-between">
                    <AuthorAvatar id={post.author_id} />
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        color="primary"
                        onClick={() => handleArticleFavorite(post.id)}
                        size="sm"
                      >
                        {favoriteArticles.includes(post.id)
                          ? "取消收藏"
                          : "收藏文章"}
                      </Button>
                      <FullArticle article={post} />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
