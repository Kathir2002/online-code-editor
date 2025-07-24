import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/loader/loader";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const Compiler = lazy(() => import("./pages/compiler"));
const NotFound = lazy(() => import("./pages/notFound"));
const MyCodes = lazy(() => import("./pages/myCodes"));

export default function AllRoutes() {
  const isLoggedin = useSelector(
    (state: RootState) => state.appSlice.isLoggedIn
  );

  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100dvh-60px)] flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!isLoggedin ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!isLoggedin ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route
          path="/my-codes"
          element={isLoggedin ? <MyCodes /> : <Navigate to={"/login"} />}
        />
        <Route path="/compiler/:urlId?" element={<Compiler isCompiler={true} />} />
        <Route path="/code-editor/:urlId?" element={<Compiler isCompiler={false} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
