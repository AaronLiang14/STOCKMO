import { auth, db } from "@/config/firebase";
import { Button, Card } from "@nextui-org/react";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function FavoriteArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);

  const getFavoriteArticles = async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const docSnap = await getDoc(memberRef);
    setFavoriteArticles(docSnap.data()!.favorite_articles || []);
  };

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

  const getArticlesDetail = async () => {
    setArticles([]);
    favoriteArticles.map(async (item) => {
      const articleRef = doc(db, "Articles", item);
      const docSnap = await getDoc(articleRef);
      setArticles((articles) => [...articles, docSnap.data() as Article]);
    });
  };

  const handleRemoveFavorite = async (id: string) => {
    const newFavoriteArticles = favoriteArticles.filter((item) => item !== id);
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    await updateDoc(memberRef, {
      favorite_articles: newFavoriteArticles,
    });
    getFavoriteArticles();
  };

  useEffect(() => {
    getFavoriteArticles();
  }, [auth.currentUser]);

  useEffect(() => {
    getArticlesDetail();
  }, [favoriteArticles]);

  return (
    <>
      <div className="mx-auto mt-12 w-11/12 max-w-[1280px]">
        {articles.length > 0 ? (
          <div className="space-y-10">
            {articles.map((post, index) => (
              <Link
                to={`/../stock/${post.stock_code}/articles/${post.id}`}
                key={index}
              >
                <Card
                  className="mb-4 flex h-40 flex-col overflow-hidden rounded-lg"
                  key={index}
                >
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="flex flex-1 flex-row justify-between  ">
                      <p className="mb-12 text-sm font-semibold text-gray-900 sm:text-xl">
                        {post.title}
                      </p>
                      <Button
                        color="danger"
                        className=""
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFavorite(post.id);
                        }}
                      >
                        移除收藏
                      </Button>
                    </div>

                    <div className="flex flex-row items-end justify-between ">
                      <AuthorAvatar id={post.author_id} />
                      <div className="text-sm text-gray-400">
                        {post.created_time.toDate().toLocaleDateString()}{" "}
                        {post.created_time.toDate().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center gap-12">
            <p className="text-2xl">目前沒有收藏的文章，到文章頁面看看吧</p>
            <Link to="/stock/2330/articles">
              <Button color="primary">前往文章頁面</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
