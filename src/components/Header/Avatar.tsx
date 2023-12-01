import { auth } from "@/config/firebase";
import useLoginStore from "@/utils/useLoginStore";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AvatarComponent() {
  const { isLogin, handleLogout } = useLoginStore();
  const navigate = useNavigate();
  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            src={(isLogin && auth.currentUser!.photoURL) || ""}
          />
        </DropdownTrigger>
        {isLogin ? (
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="gap-2">
              <p className="font-semibold">
                {isLogin && "Hi, " + auth.currentUser!.displayName}
              </p>
            </DropdownItem>
            <DropdownItem
              key="configurations"
              onClick={() => navigate("member/favoriteStocks")}
            >
              股票收藏
            </DropdownItem>
            <DropdownItem
              key="help_and_feedback"
              onClick={() => navigate("member/favoriteArticles")}
            >
              文章收藏
            </DropdownItem>
            <DropdownItem key="system">設定</DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onClick={() => {
                handleLogout();
                navigate("/");
                toast.success("已登出");
              }}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              className="gap-2"
              onClick={() => navigate("/login")}
            >
              <p className="font-semibold">登入 OR 註冊</p>
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
    </>
  );
}
