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
      setArticles((articles) => [...articles, docSnap.data() as Article]);
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
              <div key={article.id} className="flex flex-row pt-10  ">
                <img src={article.photo} className="mr-24 h-60 w-72"></img>
                <div className="">
                  <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                    <p className="text-2xl font-medium text-gray-900 ">
                      {article.title}
                    </p>

                    <div className="mt-3 space-y-6 text-sm text-gray-500">
                      {article.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
