import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface News {
  date: string;
  source: string;
  title: string;
  url: string;
  link: string;
}

export default function News() {
  const { id } = useParams();
  const [news, setNews] = useState<News[]>([]);

  const getNews = async () => {
    const res = await api.getStocksNews(id!, "2023-11-15");
    setNews(res.data);
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <div>
      <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
        {news.reverse().map((post, index) => (
          <a href={post.link}>
            <div
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              key={index}
            >
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    {post.source}
                  </p>
                  <p className="text-gray-904 pt-4 text-xl font-semibold">
                    {post.title}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-end">
                  <div className="ml-3">
                    <div className="flex justify-end space-x-1 text-sm text-gray-500">
                      <time>{post.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
