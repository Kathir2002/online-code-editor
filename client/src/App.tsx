import Header from "./components/header";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { useEffect } from "react";
import axios from "axios";
import { apiUrlDB } from "./lib/utils";
import { useDispatch } from "react-redux";
import { updateCurrentUser, updateIsLoggedin } from "./redux/slices/appSlice";
import AllRoutes from "./allRoutes";
import { useAuthContext } from "./context/authContext";

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    getCurrentUser();
  }, []);

  const { authUser, loading }: any = useAuthContext();
  if (loading) return null;
  console.log(loading, "=============loading=========================");

  const getCurrentUser = async () => {
    axios
      .get(`${apiUrlDB}/api/auth/user-details`, { withCredentials: true })
      .then((res) => {
        if (res?.data.status) {
          dispatch(updateCurrentUser(res?.data?.user));
          dispatch(updateIsLoggedin(true));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Toaster position="bottom-right" theme="dark" />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <AllRoutes authUser={authUser} />
      </ThemeProvider>
    </>
  );
}
