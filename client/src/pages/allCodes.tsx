import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { apiUrlDB } from "@/lib/utils";
import CodeItem from "@/components/codeItem";

const AllCodes = () => {
  const [allCodes, setAllCodes] = useState([]);

  useEffect(() => {
    getAllCodes();
  }, []);

  const getAllCodes = async () => {
    await axios
      .get(`${apiUrlDB}/api/compiler/get-all-codes`)
      .then((res) => {
        setAllCodes(res.data);
      })
      .catch((err) => {
        toast(err.response.data.message);
      })
      .finally(() => {});
  };

  return allCodes.length !== 0 ? (
    <div className=" grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 p-3">
      {allCodes.map((item, index: number) => (
        <CodeItem data={item} key={index} isDeleteBtnVisible={false} />
      ))}
    </div>
  ) : (
    <p className=" block w-full font-mono text-slate-500 text-center p-3">
      No Codes found
    </p>
  );
};

export default AllCodes;
