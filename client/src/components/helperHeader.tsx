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
  DialogFooter,
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

const HelperHeader = ({ isCompiler, workerRef }: { isCompiler: boolean, workerRef: MutableRefObject<Worker | null> }) => {

  const dispatch = useDispatch();
  const { urlId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [saveBtn, setSaveBtn] = useState<boolean>(false);
  const [editBtn, setEditBtn] = useState<boolean>(false);
  const [open, setOpen] = useState(false)
  const [codeDetails, setCodeDetails] = useState<{ title: string, description?: string, filePath: string }>({ title: "", description: "", filePath: "" });
  const currentLanguage = useSelector(
    (state: RootState) => state.compilerSlice.currentLanguage
  );
  const isOwner = useSelector(
    (state: RootState) => state.compilerSlice.isOwner
  );
  const fullCode = useSelector(
    (state: RootState) => state.compilerSlice.fullCode
  );

  const userDetails = useSelector(
    (state: RootState) => state.appSlice.currentUser
  );
  const isLoggedIn = useSelector((state: RootState) => state?.appSlice?.isLoggedIn)

  useEffect(() => {
    if (urlId) {
      setSaveBtn(true);
    } else {
      setSaveBtn(false);
    }
  }, [urlId]);

  const handleSaveCode = async () => {

    if (!codeDetails.title || codeDetails.title.trim() === "") {
      toast("Please provide a title for your code.");
      return;
    } else if (isCompiler && !fullCode.javascript) {
      toast("Please write some JavaScript code to save.");
      return;
    } else if (isCompiler && (!codeDetails.description || codeDetails.description.trim() === "")) {
      toast("Please provide a description for your code.");
      return;
    } else if (isCompiler && !userDetails?.repoName) {
      toast("You need to create Repository!")
      return
    } else if (isCompiler && !codeDetails?.filePath.match(/^(?:[\w.-]+\/)*[\w.-]+\.js$/)) {
      toast("Enter a valid file Path!")
      return
    }

    setLoading(true);
    await axios
      .post(
        `${apiUrlDB}/api/compiler/save`,
        {
          ...isCompiler ? ({ javascript: fullCode?.javascript }) : ({ fullCode: fullCode }),
          isCompiler,
          title: codeDetails?.title,
          description: codeDetails?.description ?? "No description provided",
          filePath: codeDetails?.filePath
        },
        { withCredentials: true }
      )
      .then((res) => {
        setOpen(false)
        navigate(`${isCompiler ? "/compiler" : "/code-editor"}/${res?.data?.url}`, { replace: true });
      })
      .catch((err) => {
        setOpen(false)
        toast(err?.response?.data?.message);
      })
      .finally(() => {
        setOpen(false)
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
        {
          ...isCompiler ? ({ javascript: fullCode?.javascript }) : ({ fullCode: fullCode })
        },
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
      workerRef.current.postMessage(fullCode.javascript);
    }
  };

  const isGithubCompiler = userDetails?.isFromGithub && isCompiler;

  return (
    <div className="__helper_header h-[50px] bg-black text-white p-2 flex justify-between items-center gap-1">
      <div className="__btn_container flex gap-1">
        {isLoggedIn ? <Dialog open={open} onOpenChange={(open) => { setOpen(open); setCodeDetails({ filePath: "", title: "", description: "" }) }} >
          <DialogTrigger asChild>
            <Button variant="success" disabled={loading} size="icon">
              {loading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <Save size={16} />
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[#1f1f2e] text-white rounded-2xl shadow-xl max-w-md p-8 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="flex gap-2 justify-center items-center text-2xl font-semibold">
                💾  Save your Code!
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="flex flex-col gap-4 mt-4">
              <Input
                type="text"
                required
                value={codeDetails?.title}
                onChange={(e) => setCodeDetails(prev => ({ ...prev, title: e.target.value }))}
                placeholder="My Code"
                className="px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />

              {isGithubCompiler && (
                <>
                  <Input
                    type="text"
                    value={codeDetails?.description}
                    onChange={(e) => setCodeDetails(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Type a description for the code..."
                    className="px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <Input
                    type="text"
                    // disabled
                    value={codeDetails?.filePath}
                    onChange={(e) => setCodeDetails(prev => ({ ...prev, filePath: e.target.value }))}
                    placeholder="Type the file path (e.g., src/utils/helper.js)"
                    className="px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </>
              )}
            </DialogDescription>

            <DialogFooter className="mt-6">
              <Button
                onClick={handleSaveCode}
                disabled={loading}
                className="w-full bg-teal-400 text-black font-semibold py-3 rounded-lg hover:bg-teal-300 transition duration-200"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> : undefined}


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
              )
            }
            }
          >

            <SelectTrigger className="w-[120px] bg-gray-800 outline-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {!isCompiler ? <>
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
