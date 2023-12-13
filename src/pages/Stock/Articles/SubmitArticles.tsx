import { auth, db, storage } from "@/config/firebase";
import StockCode from "@/data/StockCode.json";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function SubmitArticles() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const uploadImgRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const industryCode = StockCode.filter(
    (item) => item.stockCode.toString() === id,
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
        industry: industryCode[0].industry,
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

  return (
    <div className="flex flex-row justify-between">
      <div className="my-12">
        <p className="border-l-8 border-solid border-red-500 pl-4 text-2xl font-semibold text-gray-900">
          文章列表
        </p>
      </div>
      <div className="mt-12 flex justify-end">
        <Button
          onPress={onOpen}
          color="primary"
          onClick={() => !auth.currentUser && toast.error("請先登入")}
        >
          發表文章
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  發文章
                </ModalHeader>
                <ModalBody>
                  <form>
                    <Textarea
                      label="文章標題"
                      variant="bordered"
                      placeholder="文章標題"
                      disableAnimation
                      disableAutosize
                      className="mb-4 h-10 w-full"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                    <Textarea
                      variant="bordered"
                      className=" w-full  "
                      placeholder="寫下你的想法吧..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    ></Textarea>

                    <Input
                      className="mt-12 w-full max-w-xs cursor-pointer"
                      id="file_input"
                      type="file"
                      ref={uploadImgRef}
                    />
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleArticlesSubmit}
                    color="primary"
                    onPress={onClose}
                    isDisabled={!title || !content || !uploadImgRef}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
