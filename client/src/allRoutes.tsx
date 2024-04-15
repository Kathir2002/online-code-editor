import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/loader/loader";
import { useAuthContext } from "./context/authContext";

const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const Compiler = lazy(() => import("./pages/compiler"));
const NotFound = lazy(() => import("./pages/notFound"));
const AllCodes = lazy(() => import("./pages/allCodes"));
const MyCodes = lazy(() => import("./pages/myCodes"));

export default function AllRoutes() {
  const { authUser, loading }: any = useAuthContext();
  if (loading) return null;

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
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route path="/all-codes" element={<AllCodes />} />
        <Route
          path="/my-codes"
          element={authUser ? <MyCodes /> : <Navigate to={"/login"} />}
        />
        <Route path="/compiler/:urlId?" element={<Compiler />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
