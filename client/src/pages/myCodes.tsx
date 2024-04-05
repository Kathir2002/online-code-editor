import { apiUrlDB } from "@/lib/utils";
import axios from "axios";
import { useEffect } from "react";

const MyCodes = () => {
  useEffect(() => {
    getMyCodes();
  }, []);
  const getMyCodes = async () => {
    axios
      .get(`${apiUrlDB}/api/compiler/my-codes`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return <div>MyCodes</div>;
};

export default MyCodes;
