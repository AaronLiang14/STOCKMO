import timeSelect from "@/components/Graph/TimeSelect";
import api from "@/utils/api";
import { Card, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const dataForDemo = [
  {
    date: "12/15/2023 08:40 AM",
    link: "https://news.google.com/rss/articles/CBMilQJodHRwczovL2hrLmZpbmFuY2UueWFob28uY29tL25ld3MvJUU5JUJCJTkxJUU2JTlEJUJFJUU2JTk0JTlDJUU2JTg5JThCJUU5JTg3JTkxJUU5JTg1JTkyJUU1JTgyJUFDJUU3JTk0JTlGJUU2JTk2JUIwJUU2JTk4JTlGJUU3JUFDJUFDJUU0JUI4JTg5JUU5JTgzJUE4JUU2JTlCJUIyLSVFOSU5OSU5MCVFOSU4NyU4RiVFNiVCMyVCMCVFNSU5RCVBNiVFNyU4MSVCMC0lRTUlQTQlQTclRTUlQjglQUIlRTYlQkElOTAlRTklODUlOTItJUU3JTk5JUJCJUU1JUEwJUI0LTA0MzQwMTk0NS5odG1s0gEA?oc=5",
    source: "Yahoo",
    stock_id: "1234",
    title: "黑松攜手金酒催生新星第三部曲「限量泰坦灰大師源酒」登場 - Yahoo",
  },
  {
    date: "12/11/2023 08:34 AM",
    link: "https://news.google.com/rss/articles/CBMijgFodHRwczovL3R3LnN0b2NrLnlhaG9vLmNvbS9uZXdzLyVFOSVBMyU5RiVFNSU5MyU4MSVFOCU4MiVBMS0lRTklQkIlOTElRTYlOUQlQkUxMiVFNiU5QyU4ODIwJUU2JTk3JUE1JUU2JUIzJTk1JUU4JUFBJUFBJUU2JTlDJTgzLTA3MjUwODE5NS5odG1s0gEA?oc=5",
    source: "Yahoo奇摩股市",
    stock_id: "1234",
    title: "《食品股》黑松12月20日法說會 - Yahoo奇摩股市",
  },
  {
    date: "12/11/2023 07:33 AM",
    link: "https://news.google.com/rss/articles/CBMijgFodHRwczovL3R3LnN0b2NrLnlhaG9vLmNvbS9uZXdzLyVFOSVBMyU5RiVFNSU5MyU4MSVFOCU4MiVBMS0lRTklQkIlOTElRTYlOUQlQkUxMiVFNiU5QyU4ODIwJUU2JTk3JUE1JUU2JUIzJTk1JUU4JUFBJUFBJUU2JTlDJTgzLTA3MjUwODE5NS5odG1s0gEA?oc=5",
    source: "Yahoo奇摩股市",
    stock_id: "1234",
    title: "《食品股》黑松12月20日法說會 - Yahoo奇摩股市",
  },
  {
    date: "12/11/2023 07:30 AM",
    link: "https://news.google.com/rss/articles/CBMiuwFodHRwczovL3R3LnN0b2NrLnlhaG9vLmNvbS9uZXdzLyVFNSU4NSVBQyVFNSU5MSU4QS0lRTklQkIlOTElRTYlOUQlQkUlRTUlQjAlODclRTYlOTYlQkMxMiVFNiU5QyU4ODIwJUU2JTk3JUE1JUU1JThGJUFDJUU5JTk2JThCJUU2JUIzJTk1JUU0JUJBJUJBJUU4JUFBJUFBJUU2JTk4JThFJUU2JTlDJTgzLTA3MTk1MzgyMS5odG1s0gEA?oc=5",
    source: "Yahoo奇摩股市",
    stock_id: "1234",
    title: "【公告】黑松將於12月20日召開法人說明會 - Yahoo奇摩股市",
  },
  {
    date: "12/11/2023 07:30 AM",
    link: "https://news.google.com/rss/articles/CBMiOmh0dHBzOi8vd2FudHJpY2guY2hpbmF0aW1lcy5jb20vbmV3cy8yMDIzMTIxMTkwMDcwOC00MjAxMDHSAT5odHRwczovL3dhbnRyaWNoLmNoaW5hdGltZXMuY29tL2FtcC9uZXdzLzIwMjMxMjExOTAwNzA4LTQyMDEwMQ?oc=5",
    source: "旺得富 WantRich",
    stock_id: "1234",
    title: "《食品股》黑松12月20日法說會 - 旺得富 WantRich",
  },
  {
    date: "12/08/2023 07:38 AM",
    link: "https://news.google.com/rss/articles/CBMiJmh0dHBzOi8vbmV3cy5jbnllcy5jb20vbmV3cy9pZC81NDAzOTcy0gEqaHR0cHM6Ly9hbXAtbmV3cy5jbnllcy5jb20vbmV3cy9pZC81NDAzOTcy?oc=5",
    source: "Anue鉅亨",
    stock_id: "1234",
    title: "黑松11月營收8.93億元",
  },
];
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
      console.log(err);
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
        {dataForDemo.reverse().map((post, index) => (
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
