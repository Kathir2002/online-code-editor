import CodeItem from "@/components/codeItem";
import Loader from "@/components/loader/loader";
import { apiUrlDB } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MyCodes = () => {
  const [myCodes, setMyCodes] = useState([]);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getMyCodes();
  }, [isDeleted]);

  const getMyCodes = async () => {
    setIsLoading(true);
    await axios
      .get(`${apiUrlDB}/api/compiler/my-codes`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.status) {
          setMyCodes(res?.data?.myCodes);
        }
      })
      .catch((err) => {
        toast(err?.response?.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return isLoading ? (
    <div className="w-full h-[calc(100dvh-60px)] flex justify-center items-center self-center">
      <Loader />
    </div>
  ) : myCodes.length !== 0 ? (
    <div className=" border-2 p-3 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
      {myCodes.map((item, index) => (
        <CodeItem
          isDeleteBtnVisible={true}
          isDeleted={isDeleted}
          setIsDeleted={setIsDeleted}
          data={item}
          key={index}
        />
      ))}
    </div>
  ) : (
    <>
      <p className=" font-mono text-center text-slate-600 p-3">
        You don't have any saved codes!
      </p>
    </>
  );
};

export default MyCodes;
