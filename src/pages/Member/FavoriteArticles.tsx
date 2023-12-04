import { auth, db } from "@/config/firebase";
import useFavoritesStore from "@/utils/useFavoriteStore";
import { Card, CardBody, Image } from "@nextui-org/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

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
  const { favoriteArticles, getFavoriteArticles } = useFavoritesStore();
  const [articles, setArticles] = useState<Article[]>([]);

  const getArticlesDetail = async () => {
    favoriteArticles.map(async (item) => {
      const articleRef = doc(db, "Articles", item);
      const docSnap = await getDoc(articleRef);
      setArticles((articles) => [...articles, docSnap.data() as Article]);
    });
  };
  useEffect(() => {
    getFavoriteArticles();
  }, [auth.currentUser]);

  useEffect(() => {
    getArticlesDetail();
  }, [favoriteArticles]);

  return (
    <>
      <div className="mx-auto mt-24 w-full pr-8">
        <div className="space-y-10 ">
          {articles.map((article) => (
            <Card key={article.id} className="h-full">
              <CardBody className="flex flex-row py-4">
                <Image
                  alt="articles photo"
                  className=" object-cover"
                  src={article.photo}
                  height={400}
                  width={400}
                />

                <div className="ml-24 w-full">
                  <p className=" text-2xl font-medium text-gray-900 ">
                    {article.title}
                  </p>
                  <p className="mt-3 space-y-6 text-sm text-gray-500">
                    {article.content}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
