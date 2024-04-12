import { apiUrlDB } from "@/lib/utils";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
//@ts-ignore
export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: any) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true);
      await axios
        .get(`${apiUrlDB}/api/auth/user-details`, { withCredentials: true })
        .then(async (res) => {
          setAuthUser(res?.data?.user);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
