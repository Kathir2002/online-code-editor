import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { apiUrlDB } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateCurrentUser, updateIsLoggedin } from "@/redux/slices/appSlice";
import { useState } from "react";
import { updateCodeValue, updateCurrentLanguage, updateFullCode, updateIsOwner } from "@/redux/slices/compilerSlice";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Switch } from "@/components/ui/switch"

const Header = () => {
  const [loading, setLoading] = useState({ logoutLoading: false, createRepoLoading: false });
  const isLoggedin = useSelector(
    (state: RootState) => state.appSlice.isLoggedIn
  );
  const currentUser = useSelector(
    (state: RootState) => state.appSlice.currentUser
  );
  const dispatch = useDispatch();
  const [repoDetails, setRepoDetails] = useState<{ name: string, isPrivate: boolean, description: string }>({ description: "", isPrivate: false, name: "" })
  const [open, setOpen] = useState(false)

  const logoutHandler = async () => {
    setLoading(prev => ({ ...prev, logoutLoading: true }));
    await axios
      .post(`${apiUrlDB}/api/auth/logout`, {}, { withCredentials: true })
      .then((res) => {
        setLoading(prev => ({ ...prev, logoutLoading: false }));
        if (res.data.status) {
          dispatch(updateIsLoggedin(false));
          dispatch(
            updateCurrentUser({
              email: "",
              savedCodes: [],
              picture: "",
              username: "",
            })
          );
          dispatch(updateIsOwner(false));
          toast(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoading(prev => ({ ...prev, logoutLoading: false }));
        toast(err?.response?.data?.message);
      });
  };

  const handleCreateRepo = async () => {
    if (!repoDetails?.name) {
      toast("Github repo name is required!")
      return
    }
    setLoading(prev => ({ ...prev, createRepoLoading: true }));
    await axios.post(apiUrlDB + "/api/repo/create", { name: repoDetails?.name, description: repoDetails?.description, isPrivate: repoDetails?.isPrivate }, { withCredentials: true }).then(res => {
      if (res?.data?.success) {
        setOpen(false)
        dispatch(updateCurrentUser({ ...currentUser, repoName: repoDetails?.name }));
        setLoading(prev => ({ ...prev, createRepoLoading: false }));
        toast(res?.data?.message)
      }
    }).catch(err => {
      setOpen(false)
      setLoading(prev => ({ ...prev, createRepoLoading: false }));
      console.log("Error in creating repo", err?.response);

    })
  }

  const [error, setError] = useState("")

  const validateRepoName = (value: string) => {
    const isValid = /^[a-z0-9-]+$/.test(
      value.trim().toLowerCase().replace(/\s+/g, "-")
    )
    setError(isValid ? "" : "Invalid characters in repo name")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setRepoDetails(prev => ({ ...prev, name: val }))
    validateRepoName(val)
  }

  return (
    <nav className="w-full h-[60px] bg-gray-900 text-white p-3 flex justify-between items-center ">
      <Link to={"/"}>
        <h2 className="font-bold select-none ">Sniplet</h2>
      </Link>
      <ul className=" flex gap-2   ">
        <li>
          <Link to={"/compiler"}>
            <Button onClick={() => {
              dispatch(updateCurrentLanguage("javascript"))
              dispatch(updateCodeValue(`// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler
              
console.log("Hello World!");`));
            }} variant={"link"}>Compiler</Button>
          </Link>
        </li>
        <li>
          <Link to={"/code-editor"}>
            <Button onClick={() => {
              dispatch(updateCurrentLanguage("html"));
              dispatch(updateFullCode({
                javascript: `function addTask() {
                var taskInput = document.getElementById("taskInput");
                var taskText = taskInput.value.trim();
                    
                if (taskText !== "") {
                  var taskList = document.getElementById("taskList");
                  var newTask = document.createElement("li");
                  newTask.textContent = taskText;
                  newTask.onclick = toggleTask;
                  taskList.appendChild(newTask);
                  taskInput.value = "";
                } else {
                  alert("Please enter a task!");
                }
              }
                  
              function toggleTask() {
                  this.classList.toggle("completed");
              }
              `}));
            }} variant={"link"}>Online code Editor</Button>
          </Link>
        </li>
        {isLoggedin ? (
          <>
            <li>
              <Link to={"/my-codes"}>
                <Button variant={"blue"}>My Codes</Button>
              </Link>
            </li>
            {!currentUser?.repoName ? <li>
              <Dialog open={open} onOpenChange={(open) => { setOpen(open); setRepoDetails({ description: "", isPrivate: false, name: "" }); setError("") }} >
                <DialogTrigger asChild>
                  <Button variant={"secondary"} onClick={() => setOpen(prev => !prev)} >+ Create Repo</Button>
                </DialogTrigger>

                <DialogContent className="bg-[#1f1f2e] text-white rounded-2xl shadow-xl max-w-md p-8 backdrop-blur-md">
                  <DialogHeader>
                    <DialogTitle className="flex gap-2 justify-center items-center text-2xl font-semibold">
                      Create Github Repo
                    </DialogTitle>
                  </DialogHeader>

                  <DialogDescription className="flex flex-col gap-4 mt-4">
                    <Input
                      type="text"
                      required
                      value={repoDetails?.name}
                      onChange={handleChange}
                      placeholder="Repository Name"
                      className="px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    {error && <p className="text-sm text-wheat-600">{error}</p>}
                    <Input
                      type="text"
                      value={repoDetails?.description}
                      onChange={(e) => setRepoDetails(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Repo Description"
                      className="px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <div className="flex items-center justify-between py-2">
                      <label
                        htmlFor="isPrivate"
                        className="text-sm font-medium text-white"
                      >
                        Is Private
                      </label>
                      <Switch
                        id="isPrivate"
                        checked={repoDetails?.isPrivate}
                        onCheckedChange={() =>
                          setRepoDetails((prev) => ({
                            ...prev,
                            isPrivate: !prev?.isPrivate,
                          }))
                        }
                      />
                    </div>

                  </DialogDescription>

                  <DialogFooter className="mt-1">
                    <Button
                      onClick={handleCreateRepo}
                      disabled={loading?.createRepoLoading}
                      className="w-full bg-teal-400 text-black font-semibold py-3 rounded-lg hover:bg-teal-300 transition duration-200"
                    >
                      {loading?.createRepoLoading ? "Creating..." : "Create Repository"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </li> : undefined}
            <li>
              <Button
                loading={loading?.logoutLoading}
                onClick={() => logoutHandler()}
                variant={"destructive"}
              >
                Logout
              </Button>
            </li>
            <li>
              <Avatar>
                <AvatarImage src={currentUser.picture} />
                <AvatarFallback className=" capitalize">
                  {currentUser.username?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to={"/login"}>
                <Button variant={"blue"}>Login</Button>
              </Link>
            </li>
            <li>
              <Link to={"/signup"}>
                <Button variant={"blue"}>Signup</Button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
