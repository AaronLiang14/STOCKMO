import { auth, db, storage } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
import "@/index.css";
import { Button } from "@nextui-org/react";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Transaction } from "@tiptap/pm/state";
import { EditorContent, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import BlockquoteIcon from "~icons/clarity/block-quote-line";
import StrikeIcon from "~icons/ic/baseline-strikethrough-s";
import OrderList from "~icons/ic/twotone-format-list-numbered";
import ImageIcon from "~icons/material-symbols/add-photo-alternate-outline-rounded";
import BoldIcon from "~icons/material-symbols/format-bold";
import H1Icon from "~icons/material-symbols/format-h1";
import H2Icon from "~icons/material-symbols/format-h2";
import H3Icon from "~icons/material-symbols/format-h3";
import H4Icon from "~icons/material-symbols/format-h4";
import ItalicIcon from "~icons/material-symbols/format-italic";
import BulletListIcon from "~icons/material-symbols/format-list-bulleted";
const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadImage = e.target.files[0];
      const imageRef = ref(storage, `images/${uploadImage.name}`);
      const imgUploadBytes = await uploadBytes(imageRef, uploadImage);
      const imgUrl = await getDownloadURL(imgUploadBytes.ref);
      if (imgUrl) {
        editor.chain().focus().setImage({ src: imgUrl }).run();
      }
    }
  };

  return (
    <>
      <div className="flex h-10 items-center gap-4 border pl-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <BoldIcon
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("bold") && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <ItalicIcon
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("italic") && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <StrikeIcon
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("strike") && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          <H1Icon
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("heading", { level: 1 }) && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is_active" : ""
          }
        >
          <H2Icon
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("heading", { level: 2 }) && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is_active" : ""
          }
        >
          <H3Icon
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("heading", { level: 3 }) && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is_active" : ""
          }
        >
          <H4Icon
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("heading", { level: 4 }) && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <BulletListIcon
            className={`h-6 w-6 rounded-sm ${
              editor.isActive("bulletList") && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <OrderList
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("orderedList") && "bg-black text-white"
            }`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <BlockquoteIcon
            className={`h-6 w-6 rounded-sm  ${
              editor.isActive("blockquote") && "bg-black text-white"
            }`}
          />
        </button>
        <button>
          <label htmlFor="images_input">
            {" "}
            <ImageIcon className="cursor-pointer" />
          </label>
          <input
            type="file"
            id="images_input"
            name="images_input"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </button>
      </div>
    </>
  );
};

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Document,
  Paragraph,
  Text,
  Image,
  Dropcursor,
];

export default function Tiptap() {
  const initialContent = "<p>開始撰寫文章...</p>";
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState("");
  const { id } = useParams();

  const handleContentUpdate = (newContent: {
    editor: Editor;
    transaction: Transaction;
  }) => {
    setContent(newContent.editor.getHTML());
  };

  const industryCode = StockCode.filter(
    (item) => item.stockCode.toString() === id,
  );

  const handleSubmitArticles = async () => {
    if (!title) {
      toast.error("請輸入文章標題");
      return;
    }
    const docRef = await addDoc(collection(db, "Articles"), {
      author_id: auth.currentUser!.uid,
      author_name: auth.currentUser?.displayName,
      content: content,
      created_time: new Date(),
      industry: industryCode[0].industry,
      stock_code: id,
      title: title,
    });
    const newDocumentId = docRef.id;
    await updateDoc(doc(db, "Articles", newDocumentId), {
      id: newDocumentId,
    });
    toast.success("發文成功");
    setTitle("");
    setContent(initialContent);
  };

  return (
    <div className="relative hidden rounded-lg border border-black p-0.5 sm:block ">
      <input
        placeholder="文章標題"
        className="w-full py-2  pl-4 "
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <div>
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={content}
          onUpdate={(e) => handleContentUpdate(e)}
        >
          <EditorContent editor={null} />
        </EditorProvider>
      </div>

      <Button
        type="submit"
        color="primary"
        size="sm"
        className="absolute bottom-1 right-1"
        onClick={() => {
          handleSubmitArticles();
        }}
      >
        發表文章{" "}
      </Button>
    </div>
  );
}
