import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { apiUrlDB } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateCurrentUser, updateIsLoggedin } from "@/redux/slices/appSlice";
import { useState } from "react";
import { updateIsOwner } from "@/redux/slices/compilerSlice";

const Header = () => {
  const [loading, setLoading] = useState(false);
  const isLoggedin = useSelector(
    (state: RootState) => state.appSlice.isLoggedIn
  );
  const currentUser = useSelector(
    (state: RootState) => state.appSlice.currentUser
  );
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    setLoading(true);
    await axios
      .post(`${apiUrlDB}/api/auth/logout`, {}, { withCredentials: true })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          dispatch(updateIsLoggedin(false));
          dispatch(
            updateCurrentUser({
              email: "",
              savedCodes: [],
              picture: "",
              username: "",
            })
          );
          dispatch(updateIsOwner(false));
          toast(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast(err?.response?.data?.message);
      });
  };

  return (
    <nav className="w-full h-[60px] bg-gray-900 text-white p-3 flex justify-between items-center ">
      <Link to={"/"}>
        <h2 className="font-bold select-none ">LK Compiler</h2>
      </Link>
      <ul className=" flex gap-2   ">
        <li>
          <Link to={"/compiler"}>
            <Button variant={"link"}>Compiler</Button>
          </Link>
        </li>
        <li>
          <Link to={"/all-codes"}>
            <Button loading={loading} variant={"link"}>
              All Codes
            </Button>
          </Link>
        </li>
        {isLoggedin ? (
          <>
            <li>
              <Link to={"/my-codes"}>
                <Button variant={"blue"}>My Codes</Button>
              </Link>
            </li>
            <li>
              <Button onClick={() => logoutHandler()} variant={"destructive"}>
                Logout
              </Button>
            </li>
            <li>
              <Avatar>
                <AvatarImage src={currentUser.picture} />
                <AvatarFallback className=" capitalize">
                  {currentUser.username?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to={"/login"}>
                <Button variant={"blue"}>Login</Button>
              </Link>
            </li>
            <li>
              <Link to={"/signup"}>
                <Button variant={"blue"}>Signup</Button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
