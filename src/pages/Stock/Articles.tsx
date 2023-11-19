import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import UploadPicture from "~icons/icon-park-outline/upload-picture";
import FullScreen from "~icons/majesticons/arrows-expand-full-line";
import { auth, db } from "../../config/firebase";

export default function Articles() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const title = useRef("");
  const content = useRef("");
  const handleArticlesSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    await setDoc(doc(db, "Articles", "123"), {
      author_id: auth.lastNotifiedUid,
      author_name: auth.currentUser?.displayName,
      content: content.current,
      created_time: new Date(),
      industry_code: 1,
      number_of_favorite: 12,
      photo: "https://picsum.photos/200/300",
      reply: [],
      stock_code: id,
      title: title.current,
    });
  };

  useEffect(() => {
    const getArticles = async () => {
      const querySnapshot = await getDocs(collection(db, "Articles"));
      const articlesData = querySnapshot.docs.map((doc) => doc.data());
      setArticles(articlesData);
    };

    getArticles();
  }, []);

  console.log(articles);
  return (
    <>
      <div>
        <div className="relative bg-gray-50 px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="absolute inset-0">
            <div className="h-1/3 bg-white sm:h-2/3" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                文章專區
              </p>
            </div>
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
                      <p className="text-sm font-medium text-indigo-600">
                        <a href="/" className="hover:underline">
                          {post.name}
                        </a>
                      </p>
                      <a href="/" className="mt-2 block">
                        <p className="text-xl font-semibold text-gray-900">
                          {post.title}
                        </p>
                      </a>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <a href="/">
                          <span className="sr-only">{post.name}</span>
                          <img
                            className="h-10 w-10 rounded-full"
                            src={post.photo}
                            alt=""
                          />
                        </a>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          <a href="/" className="hover:underline">
                            {post.name}
                          </a>
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                          {/* <time dateTime={post.datetime}>{post.date}</time> */}
                          <span aria-hidden="true">&middot;</span>
                          {/* <span>{post.readingTime} read</span> */}
                        </div>
                      </div>
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
                  data-tooltip-target="tooltip-fullscreen"
                  className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white sm:ms-auto"
                >
                  <UploadPicture className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  data-tooltip-target="tooltip-fullscreen"
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
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-blue-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
            onClick={handleArticlesSubmit}
          >
            Publish post
          </button>
        </form>
      </div>
    </>
  );
}
