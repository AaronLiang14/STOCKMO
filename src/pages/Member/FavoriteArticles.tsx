import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import useFavoritesStore from "../../utils/useFavoriteStore";

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

      setArticles((articles) => [...articles, docSnap.data()]);
    });
  };

  const getDetail = async () => {
    getFavoriteArticles();
    getArticlesDetail();
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4  sm:px-6  lg:max-w-7xl lg:px-8">
          <div className="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
            {articles.map((article) => (
              <div
                key={article.id}
                className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
              >
                <img src={article.photo}></img>
                <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                  <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      標題：{article.title}
                    </h3>

                    <div className="mt-3 space-y-6 text-sm text-gray-500">
                      內文：{article.content}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-sm  ">
                  <p className="font-medium text-gray-900">
                    {article.author_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
