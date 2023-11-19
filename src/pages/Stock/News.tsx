import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function News() {
  const { id } = useParams();
  const [news, setNews] = useState([]);

  const getNews = async () => {
    const res = await api.getStocksNews(id, "2023-11-15");
    setNews(res.data);
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <div>
      <p>新聞</p>
      <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
        {news.map((post, index) => (
          <div
            className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            key={index}
          >
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-600">
                  <a href="/" className="hover:underline">
                    {post.source}
                  </a>
                </p>
                <a href="/" className="mt-2 block">
                  <p className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </p>
                </a>
              </div>
              <div className="mt-6 flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    <a href="/" className="hover:underline">
                      {post.soucre}
                    </a>
                  </p>
                  <div className="flex justify-end space-x-1 text-sm text-gray-500">
                    <time>{post.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
