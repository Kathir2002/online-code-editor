import Header from "./components/header";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import axios from "axios";
import { apiUrlDB } from "./lib/utils";
import { useDispatch } from "react-redux";
import { updateCurrentUser, updateIsLoggedin } from "./redux/slices/appSlice";
import AllRoutes from "./allRoutes";

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    getCurrentUser();
  }, []);

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
        toast(err?.response?.data?.message);
      });
  };
  return (
    <>
      <Toaster position="bottom-right" theme="dark" />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Header />
        <AllRoutes />
      </ThemeProvider>
    </>
  );
}
