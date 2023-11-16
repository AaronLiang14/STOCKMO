import { auth } from "../../config/firebase";

export default function MemberInfo() {
  return (
    <>
      <img
        className="m-auto my-10 flex justify-center rounded-full"
        src={auth?.currentUser?.photoURL || ""}
      />
      <div className="m-auto flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className="rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          >
            我的文章
          </button>

          <button
            type="button"
            className="rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          >
            股票收藏
          </button>
        </div>
      </div>
    </>
  );
}
