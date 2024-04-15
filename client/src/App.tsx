import Header from "./components/header";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCurrentUser, updateIsLoggedin } from "./redux/slices/appSlice";
import AllRoutes from "./allRoutes";
import { useGetUserDetailsQuery } from "./redux/slices/api";

export default function App() {
  const { data, error } = useGetUserDetailsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(updateCurrentUser(data.user));
      dispatch(updateIsLoggedin(true));
    } else if (error) {
      dispatch(updateCurrentUser({}));
      dispatch(updateIsLoggedin(false));
    }
  }, [data, error]);
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
