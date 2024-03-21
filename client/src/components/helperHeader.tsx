import { Save, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  compilerSliceStateType,
  updateCurrentLanguage,
} from "@/redux/slices/compilerSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";

const HelperHeader = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const currentLanguage = useSelector(
    (state: RootState) => state.compilerSlice.currentLanguage
  );
  const fullCode = useSelector(
    (state: RootState) => state.compilerSlice.fullCode
  );

  const handleSaveCode = async () => {
    await axios
      .post("http://localhost:5000/api/compiler/save", { fullCode })
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="__helper_header h-[50px] bg-black text-white p-2 flex justify-between items-center gap-1">
      <div className="__btn_container flex gap-1">
        <Button
          onClick={() => handleSaveCode()}
          className="flex justify-center items-center gap-1"
          variant={"success"}
        >
          <Save size={16} /> Save
        </Button>
        <Button
          className="flex justify-center items-center gap-1"
          variant={"secondary"}
        >
          <Share2 size={16} /> Share
        </Button>
      </div>
      <div className="__tab_switcher">
        <Select
          defaultValue={currentLanguage}
          onValueChange={(value) =>
            dispatch(
              updateCurrentLanguage(
                value as compilerSliceStateType["currentLanguage"]
              )
            )
          }
        >
          <SelectTrigger className="w-[120px] bg-gray-800 outline-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HelperHeader;
