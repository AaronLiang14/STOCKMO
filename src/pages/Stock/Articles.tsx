import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FullScreen from "~icons/majesticons/arrows-expand-full-line";
import { auth, db, storage } from "../../config/firebase";
import StockCode from "../../data/StockCode.json";

interface Article {
  author_id: string;
  author_name: string;
  content: string;
  created_time: Date;
  industry: string;
  number_of_favorite: number;
  photo: string;
  reply: string[];
  stock_code: string;
  title: string;
}

export default function Articles() {
  const { id } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const title = useRef("");
  const content = useRef("");
  const uploadImgRef = useRef<HTMLInputElement>(null);

  const industryCode = StockCode.filter(
    (item) => item.證券代號.toString() === id,
  );

  const handleArticlesSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (uploadImgRef.current && uploadImgRef.current.files) {
      const imageRef = ref(
        storage,
        `images/${uploadImgRef.current?.files[0].name}`,
      );
      const imgUploadBytes = await uploadBytes(
        imageRef,
        uploadImgRef.current?.files[0],
      );
      const imgUrl = await getDownloadURL(imgUploadBytes.ref);
      await addDoc(collection(db, "Articles"), {
        author_id: auth.lastNotifiedUid,
        author_name: auth.currentUser?.displayName,
        content: content.current,
        created_time: new Date(),
        industry: industryCode[0].產業別,
        number_of_favorite: 0,
        photo: imgUrl,
        reply: [],
        stock_code: id,
        title: title.current,
      });
    }
  };

  const handleArticleFavorite = async () => {
    //取得這篇文章的id
  };

  const q = query(collection(db, "Articles"), where("stock_code", "==", id));
  useEffect(() => {
    const getArticles = async () => {
      const querySnapshot = await getDocs(q);
      const articlesData = querySnapshot.docs.map((doc) => doc.data());
      setArticles(articlesData);
    };

    getArticles();
  }, []);
  return (
    <>
      <div className="mx-auto w-9/12">
        <div className="relative bg-gray-50 px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center text-lg">文章專區</div>
            <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
              {articles.map((post, index) => (
                <div
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                  key={index}
                >
                  <div className="flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover"
                      src={post.photo}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between bg-white p-6">
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={post.photo}
                          alt=""
                        />
                      </div>
                      <button
                        type="button"
                        className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleArticleFavorite}
                      >
                        收藏
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form>
          <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
            <div className="flex items-center justify-end border-b px-3 py-2 dark:border-gray-600">
              <div>
                <button
                  type="button"
                  className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white sm:ms-auto"
                >
                  <FullScreen className="h-6 w-6" />
                  <span className="sr-only">Full screen</span>
                </button>
              </div>
            </div>
            <div className="rounded-b-lg bg-white px-4 py-2 dark:bg-gray-800">
              <label htmlFor="editor" className="sr-only">
                Publish post
              </label>
              <textarea
                id="title"
                rows={1}
                className="mb-8 block w-full border-0 bg-white px-0 text-sm text-gray-800 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="Title"
                onChange={(e) => (title.current = e.target.value)}
                required
              ></textarea>
              <textarea
                id="editor"
                rows={8}
                className="block w-full border-0 bg-white px-0 text-sm text-gray-800 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="Write an article..."
                onChange={(e) => (content.current = e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <label
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            ref={uploadImgRef}
          />
          <button
            type="submit"
            className="mt-5 inline-flex items-center rounded-lg bg-blue-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
            onClick={handleArticlesSubmit}
          >
            Publish post
          </button>
        </form>
      </div>
    </>
  );
}
