import timeSelect from "@/components/Graph/TimeSelect";
import api from "@/utils/finMindApi";
import { Card, Spinner } from "@nextui-org/react";
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
  const [loading, setLoading] = useState(true);

  const getNews = async () => {
    try {
      const res = await api.getStocksNews(id!, timeSelect.oneMonth);
      setNews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <div>
      <div className="mx-auto mt-12 grid grid-cols-1 gap-4">
        {news.reverse().map((post, index) => (
          <a href={post.link} target="_blank" key={index}>
            <Card className="flex flex-col overflow-hidden rounded-lg">
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    {post.source}
                  </p>
                  <p className="text-gray-904 pt-4 text-xl font-semibold">
                    {post.title}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-end">
                  <div className="flex justify-end space-x-1 text-sm text-gray-500">
                    <div>{post.date}</div>
                  </div>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
      {loading ? (
        <div className="mt-48 flex flex-col items-center justify-center gap-4">
          <Spinner />
          <p className="text-lg">讀取中{"        "}...</p>
        </div>
      ) : (
        <div className="mx-auto mt-12 grid grid-cols-1 gap-4">
          {news.reverse().map((post, index) => (
            <a href={post.link} target="_blank" key={index}>
              <Card className="flex flex-col overflow-hidden rounded-lg">
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                      {post.source}
                    </p>
                    <p className="text-gray-904 pt-4 text-xl font-semibold">
                      {post.title}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-end">
                    <div className="flex justify-end space-x-1 text-sm text-gray-500">
                      <div>{post.date}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
