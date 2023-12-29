import { db } from "@/config/firebase";
import firestoreApi from "@/utils/firestoreApi";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import HTMLReactParser from "html-react-parser";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ArticleProps {
  author_id: string;
  author_name: string;
  content: string;
  created_time: Timestamp;
  industry: string;
  stock_code: string;
  title: string;
  id: string;
}

const initialArticle: ArticleProps = {
  author_id: "",
  author_name: "",
  content: "",
  created_time: Timestamp.now(),
  industry: "",
  stock_code: "",
  title: "",
  id: "",
};

const AuthorAvatar = ({ id }: { id: string }) => {
  const [avatar, setAvatar] = useState<string>("");
  const [name, setName] = useState<string>("");
  const getAuthorAvatar = async () => {
    const memberData = await firestoreApi.getMemberInfo(id);
    setAvatar(memberData?.avatar);
    setName(memberData?.name);
  };
  getAuthorAvatar();

  return (
    <div className="flex flex-shrink-0 flex-row items-center">
      <img className="h-10 w-10 rounded-full" src={avatar} alt="" />
      <p className="pl-2"> {name}</p>
    </div>
  );
};

export default function IndependentArticles() {
  const { articleID } = useParams();
  const [article, setArticle] = useState<ArticleProps>(initialArticle);

  const getIndependentArticles = async () => {
    const articleRef = doc(db, "Articles", articleID!);
    const docSnap = await getDoc(articleRef);
    if (docSnap.exists()) {
      setArticle(docSnap.data() as ArticleProps);
    }
  };

  useEffect(() => {
    getIndependentArticles();
  }, []);

  return (
    <>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-2xl">{article.title}</div>
        <AuthorAvatar id={article.author_id} />
      </div>

      <div className="mt-4">{HTMLReactParser(article.content)}</div>
    </>
  );
}
