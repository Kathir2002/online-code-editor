import { Code, Copy, LoaderCircle, Save, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  compilerSliceStateType,
  updateCurrentLanguage,
} from "@/redux/slices/compilerSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const HelperHeader = () => {
  const dispatch = useDispatch();
  const { urlId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [saveBtn, setSaveBtn] = useState<boolean>(false);
  const currentLanguage = useSelector(
    (state: RootState) => state.compilerSlice.currentLanguage
  );
  const fullCode = useSelector(
    (state: RootState) => state.compilerSlice.fullCode
  );

  useEffect(() => {
    if (urlId) {
      setSaveBtn(true);
    } else {
      setSaveBtn(false);
    }
  }, [urlId]);

  const handleSaveCode = async () => {
    setLoading(true);
    await axios
      .post("http://localhost:5000/api/compiler/save", { fullCode })
      .then((res) => {
        navigate(`/compiler/${res?.data?.url}`, { replace: true });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="__helper_header h-[50px] bg-black text-white p-2 flex justify-between items-center gap-1">
      <div className="__btn_container flex gap-1">
        <Button
          onClick={() => handleSaveCode()}
          className="flex justify-center items-center gap-1"
          variant={"success"}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle size={16} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save{" "}
            </>
          )}
        </Button>
        {saveBtn && (
          <Dialog>
            <DialogTrigger className="whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2 flex justify-center items-center gap-1">
              <Share2 size={16} /> Share
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex gap-1 justify-center items-center">
                  <Code /> Share your Code!
                </DialogTitle>
                <DialogDescription className=" flex flex-col gap-2">
                  <div className="__url flex gap-1">
                    <input
                      type="text"
                      disabled
                      className=" w-full px-2 py-2 rounded bg-slate-800 text-slate-400 select-none"
                      value={window.location.href}
                    />
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        window.navigator.clipboard.writeText(
                          window.location.href
                        );
                        toast("URL Copied to your clipboard!");
                      }}
                    >
                      {" "}
                      <Copy size={14} />{" "}
                    </Button>
                  </div>
                  <p className="text-center">
                    Share this url with your friends to collabrate.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
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
