import { auth, db } from "@/config/firebase";
import { useFavoritesStore } from "@/utils/useLoginStore";
import { Button, Card } from "@nextui-org/react";
import {
  Timestamp,
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
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import Tiptap from "./Tiptap";

interface Article {
  author_id: string;
  author_name: string;
  content: string;
  created_time: Timestamp;
  industry: string;
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
    <div className="flex flex-shrink-0 flex-row items-center">
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
      <div className="my-12">
        <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
          文章列表
        </p>
      </div>
      <div className="mx-auto my-12">
        <div className={` grid gap-12 lg:max-w-none`}>
          {articles.length === 0 ? (
            <div className="flex items-center justify-center">
              <p className="text-2xl">
                目前沒有文章，滾動至下方來撰寫一篇文章吧
              </p>
            </div>
          ) : (
            articles.map((post, index) => (
              <Link to={`./${post.id}`}>
                <Card
                  className="flex h-40 flex-col overflow-hidden rounded-lg"
                  key={index}
                >
                  <div className="relative flex flex-1 flex-col justify-between p-6">
                    <div className="flex-1">
                      <p className="mb-12 text-xl  font-semibold text-gray-900">
                        {post.title}
                      </p>
                      <AuthorAvatar id={post.author_id} />
                    </div>
                    <Button
                      type="button"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleArticleFavorite(post.id);
                      }}
                      size="sm"
                      className="absolute right-10 top-5"
                    >
                      {favoriteArticles.includes(post.id)
                        ? "取消收藏"
                        : "收藏文章"}
                    </Button>
                    <div className="absolute bottom-5 right-10 text-sm text-gray-500">
                      {post.created_time.toDate().toLocaleDateString()}{" "}
                      {post.created_time.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
      <div className="my-12">
        <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
          撰寫文章
        </p>
      </div>
      {!auth.currentUser ? (
        <div className="flex items-center justify-center">
          <p className="text-2xl">登入後即可撰寫文章</p>
        </div>
      ) : (
        <Tiptap />
      )}
    </div>
  );
}
