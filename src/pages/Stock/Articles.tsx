import { auth, db, storage } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import FullScreen from "~icons/majesticons/arrows-expand-full-line";

import useFavoritesStore from "@/utils/useFavoriteStore";

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
  id: string;
}

export default function Articles() {
  const { favoriteArticles, getFavoriteArticles } = useFavoritesStore();
  const { id } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const uploadImgRef = useRef<HTMLInputElement>(null);

  const industryCode = StockCode.filter(
    (item) => item.證券代號.toString() === id,
  );

  const handleArticlesSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error("請先登入");
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
      const docRef = await addDoc(collection(db, "Articles"), {
        author_id: auth.currentUser!.uid,
        author_name: auth.currentUser?.displayName,
        content: content,
        created_time: new Date(),
        industry: industryCode[0].產業別,
        number_of_favorite: 0,
        photo: imgUrl,
        reply: [],
        stock_code: id,
        title: title,
      });
      const newDocumentId = docRef.id;
      await updateDoc(doc(db, "Articles", newDocumentId), {
        id: newDocumentId,
      });
      toast.success("發文成功");
      setContent("");
      setTitle("");
    }
  };

  const handleArticleFavorite = async (id: string) => {
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const docSnap = await getDoc(memberRef);

    if (docSnap.exists()) {
      if (docSnap.data().favorite_articles.includes(id)) {
        await updateDoc(memberRef, {
          favorite_articles: arrayRemove(id),
        });
        toast.success("取消收藏");
        return;
      } else {
        await updateDoc(memberRef, {
          favorite_articles: arrayUnion(id),
        });
        toast.success("加入收藏");
      }
    }
  };

  const q = query(collection(db, "Articles"), where("stock_code", "==", id));
  const getArticlesByStock = async () => {
    const querySnapshot = await getDocs(q);
    const articlesData = querySnapshot.docs.map((doc) => doc.data());
    setArticles(articlesData as Article[]);
  };

  // const getAuthorAvatar = async (id: string) => {
  //   const memberRef = doc(db, "Member", id);
  //   const docSnap = await getDoc(memberRef);
  //   if (docSnap.exists()) {
  //     return docSnap.data().avatar;
  //   }
  // };

  useEffect(() => {
    onSnapshot(q, () => {
      getArticlesByStock();
    });
  }, []);

  useEffect(() => {
    getFavoriteArticles();
  }, [favoriteArticles]);

  return (
    <div>
      <div className="mx-auto">
        <div className="relative   pb-20   lg:pb-28 lg:pt-12">
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center text-3xl">文章專區</div>
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
                        onClick={() => handleArticleFavorite(post.id)}
                      >
                        {favoriteArticles.includes(post.id)
                          ? "取消收藏"
                          : "收藏文章"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form>
          <div className="mb-4 w-full rounded-lg border border-cyan-800 bg-gray-300 focus:border-cyan-800">
            <div className="flex items-center justify-end border-b px-3 py-2 dark:border-gray-600">
              <div>
                <button
                  type="button"
                  className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100   sm:ms-auto"
                >
                  <FullScreen className="h-6 w-6" />
                  <span className="sr-only">Full screen</span>
                </button>
              </div>
            </div>
            <div className="rounded-b-lg bg-white px-4 py-2 ">
              <label htmlFor="editor" className="sr-only">
                Publish post
              </label>
              <textarea
                id="title"
                rows={1}
                className="mb-8 block w-full border-0 bg-white px-0 text-sm text-gray-800 focus:ring-0 "
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              ></textarea>
              <textarea
                id="editor"
                rows={8}
                className="block w-full border-0 bg-white px-0 text-sm text-gray-800 focus:ring-0 "
                placeholder="Write an article..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="flex flex-row">
              <input
                className=" block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none "
                id="file_input"
                type="file"
                ref={uploadImgRef}
              />
              <button
                type="submit"
                className=" group inline-flex  rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-800 text-sm font-medium text-gray-900 focus:outline-none  focus:ring-cyan-200     "
                onClick={handleArticlesSubmit}
              >
                <span className=" rounded-md bg-cyan-700 px-8 py-2.5 text-white transition-all duration-75 ease-in group-hover:bg-opacity-0">
                  Submit
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
