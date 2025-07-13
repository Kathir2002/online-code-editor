import {
  Code,
  Copy,
  Download,
  LoaderCircle,
  PencilLine,
  Save,
  Share2,
} from "lucide-react";
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
import { MutableRefObject, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { apiUrlDB } from "@/lib/utils";

const HelperHeader = ({isCompiler,workerRef}:{isCompiler:boolean, workerRef:MutableRefObject<Worker | null> }) => {
  
  const dispatch = useDispatch();
  const { urlId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [saveBtn, setSaveBtn] = useState<boolean>(false);
  const [editBtn, setEditBtn] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("My Code");
  const currentLanguage = useSelector(
    (state: RootState) => state.compilerSlice.currentLanguage
  );
  
  const isOwner = useSelector(
    (state: RootState) => state.compilerSlice.isOwner
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
      .post(
        `${apiUrlDB}/api/compiler/save`,
        { fullCode, title },
        { withCredentials: true }
      )
      .then((res) => {
        navigate(`/compiler/${res?.data?.url}`, { replace: true });
      })
      .catch((err) => {
        toast(err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDownloadCode = async () => {
    if (
      fullCode.html === "" ||
      fullCode.css === "" ||
      fullCode.javascript === ""
    ) {
      toast("Error: Code is empty!");
    } else {
      const htmlCode = new Blob([fullCode.html], { type: "text/html" });
      const cssCode = new Blob([fullCode.css], { type: "text/css" });
      const javascriptCode = new Blob([fullCode.javascript], {
        type: "text/javascript",
      });
      const htmlLink = document.createElement("a");
      const cssLink = document.createElement("a");
      const javascriptLink = document.createElement("a");

      htmlLink.href = URL.createObjectURL(htmlCode);
      htmlLink.download = `index.html`;
      document.body.appendChild(htmlLink);

      cssLink.href = URL.createObjectURL(cssCode);
      cssLink.download = `style.css`;
      document.body.appendChild(cssLink);

      javascriptLink.href = URL.createObjectURL(javascriptCode);
      javascriptLink.download = `script.js`;
      document.body.appendChild(javascriptLink);

      if (fullCode.html !== "" && !isCompiler) {
        htmlLink.click();
      }
      if (fullCode.css !== "" && !isCompiler) {
        cssLink.click();
      }
      if (fullCode.javascript !== "") {
        javascriptLink.click();
      }

      document.body.removeChild(htmlLink);
      document.body.removeChild(cssLink);
      document.body.removeChild(javascriptLink);
      toast("Code downloaded successfully!");
    }
  };

  const handleEditIcon = async () => {
    setEditBtn(true);
    await axios
      .put(
        `${apiUrlDB}/api/compiler/edit/${urlId}`,
        { fullCode },
        { withCredentials: true }
      )
      .then((res) => {
        if (res?.data?.status) {
          toast(res?.data?.message);
        }
      })
      .catch((err) => {
        toast(err?.response?.data?.message);
      })
      .finally(() => {
        setEditBtn(false);
      });
  };

  const runCode = () => {
    if (workerRef.current) {
      console.log(fullCode.javascript, "Running code in worker");
      
      workerRef.current.postMessage(fullCode.javascript);
    }
  };

  return (
    <div className="__helper_header h-[50px] bg-black text-white p-2 flex justify-between items-center gap-1">
      <div className="__btn_container flex gap-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"success"} disabled={loading} size={"icon"}>
              {loading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex gap-1 justify-center items-center">
                <Code /> Save your Code!
              </DialogTitle>
              <DialogDescription className=" flex flex-col gap-2">
                <div className="__url flex gap-1">
                  <Input
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    className=" bg-slate-700 focus:ring-0"
                    placeholder="Type a title for the code..."
                  />
                  <Button variant={"success"} onClick={() => handleSaveCode()}>
                    Save
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Button
          onClick={() => {
            handleDownloadCode();
          }}
          variant={"blue"}
          size={"icon"}
        >
          <Download size={16} />
        </Button>

        {saveBtn && (
          <>
            {isOwner && (
              <Button
                loading={editBtn}
                size={"icon"}
                onClick={() => {
                  handleEditIcon();
                }}
                variant={"blue"}
              >
                <PencilLine size={16} />
              </Button>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button size={"icon"} variant={"secondary"}>
                  <Share2 size={16} />
                </Button>
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
          </>
        )}
      </div>
      <div className="__tab_switcher flex items-center gap-2">
      {isCompiler && <button onClick={() => runCode()} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
        Run
      </button>}
      <div className="__tab_switcher">
        <Select
          value={currentLanguage}
          onValueChange={(value) => {
            dispatch(
              updateCurrentLanguage(
                value as compilerSliceStateType["currentLanguage"]
              )
            )}
          }
        >
         
          <SelectTrigger className="w-[120px] bg-gray-800 outline-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              { !isCompiler ? <>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
              </> : undefined}
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      </div>
    </div>
  );
};

export default HelperHeader;
