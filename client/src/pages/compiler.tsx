import CodeEditior from "@/components/codeEditior";
import HelperHeader from "@/components/helperHeader";
import Loader from "@/components/loader/loader";
import RenderCode from "@/components/renderCode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { apiUrlDB } from "@/lib/utils";
import { updateCodeValue, updateCurrentLanguage, updateFullCode, updateIsOwner, updateJSCode } from "@/redux/slices/compilerSlice";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Compiler = ({isCompiler}:{isCompiler:boolean}) => {
  
  const { urlId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const workerRef = useRef<Worker | null>(null);


  useEffect(() => {
    if (urlId) {
      const getCode = async () => {
        setLoading(true);
        await axios
          .post(
            `${apiUrlDB}/api/compiler/getCode`,
            { urlId },
            { withCredentials: true }
          )
          .then((res) => {
            dispatch(updateFullCode(res?.data?.fullCode));
            dispatch(updateIsOwner(res.data.isOwner));
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            if (axios.isAxiosError(err)) {
              if (err?.response?.status === 500) {
                toast("Invaild URL, Default code loaded!");
              }
            }
          })
        
      };
      getCode();
    }
  }, [urlId]);

   useEffect(() => {
    if(!loading) {
      if(isCompiler) {
        dispatch(updateCurrentLanguage("javascript"),"hai-hellpo")
        dispatch(updateCodeValue(`// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler

console.log("Hello World!");`));
      } else {
        dispatch(updateCurrentLanguage("html"));
        dispatch(updateJSCode(`function addTask() {
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
`));
      }
    }
  },[isCompiler])

  

  if (loading) {
    return (
      <div className="w-screen h-[calc(100dvh-60px)] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className=" h-[calc(100dvh-60px)] min-w-[350px]"
        defaultSize={50}
      >
        <HelperHeader isCompiler={isCompiler} workerRef={workerRef} />
        <CodeEditior />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className=" h-[calc(100dvh-60px)] min-w-[350px] "
        defaultSize={50}
      >
        <RenderCode workerRef={workerRef} isCompiler={isCompiler} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Compiler;
