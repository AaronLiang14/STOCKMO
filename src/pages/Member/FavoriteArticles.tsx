import { auth, db } from "@/config/firebase";
import { Button, Card, CardBody, Image } from "@nextui-org/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  content: string;
  author_name: string;
  datetime: string;
  date: string;
  photo: string;
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

  const getArticlesDetail = async () => {
    setArticles([]);
    favoriteArticles.map(async (item) => {
      const articleRef = doc(db, "Articles", item);
      const docSnap = await getDoc(articleRef);
      setArticles((articles) => [...articles, docSnap.data() as Article]);
    });
  };

  const handleRemoveFavorite = async () => {
    const newFavoriteArticles = favoriteArticles.filter(
      (item) => item !== articles[0].id,
    );
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    await updateDoc(memberRef, {
      favorite_articles: newFavoriteArticles,
    });
    getFavoriteArticles();
  };

  useEffect(() => {
    getFavoriteArticles();
  }, []);

  useEffect(() => {
    getArticlesDetail();
  }, [favoriteArticles]);

  return (
    <>
      <div className="mx-auto mt-24 w-full pr-8">
        {articles.length > 0 ? (
          <div className="space-y-10 ">
            {articles.map((article) => (
              <Card key={article.id} className="h-full">
                <CardBody className="flex flex-row py-4">
                  <Image
                    alt="articles photo"
                    className=" object-cover"
                    src={article.photo}
                    height={200}
                    width={200}
                  />

                  <div className="ml-6 w-full">
                    <p className=" text-2xl font-medium text-gray-900 ">
                      {article.title}
                    </p>
                    <p className="mt-3 space-y-6 text-sm text-gray-500">
                      {article.content}
                    </p>
                  </div>
                  <Button
                    color="danger"
                    className="absolute right-4 top-4"
                    size="sm"
                    onClick={() => handleRemoveFavorite()}
                  >
                    移除收藏
                  </Button>
                </CardBody>
              </Card>
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
