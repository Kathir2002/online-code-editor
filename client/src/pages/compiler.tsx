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
import { updateCodeValue, updateCurrentLanguage, updateFullCode, updateIsOwner } from "@/redux/slices/compilerSlice";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Compiler = ({ isCompiler }: { isCompiler: boolean }) => {

  const { urlId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const workerRef = useRef<Worker | null>(null);
  const [isFromCompiler, setIsFromCompiler] = useState(false)

  useEffect(() => {
    if (isCompiler != undefined) {
      setIsFromCompiler(isCompiler)
    }
  }, [isCompiler])

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
            dispatch(updateFullCode(res?.data?.data?.fullCode));
            if (res?.data?.data?.githubFilePath) {
              dispatch(updateCurrentLanguage("javascript"))
              dispatch(updateCodeValue(res?.data?.data?.fullCode?.javascript));
              setIsFromCompiler(true)
            } else {
              dispatch(updateCurrentLanguage("html"))
              dispatch(updateCodeValue(res?.data?.data?.fullCode));
              setIsFromCompiler(false)

            }
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
        <HelperHeader isCompiler={isFromCompiler} workerRef={workerRef} />
        <CodeEditior />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className=" h-[calc(100dvh-60px)] min-w-[350px] "
        defaultSize={50}
      >
        <RenderCode workerRef={workerRef} isCompiler={isFromCompiler} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Compiler;
