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
import { updateFullCode } from "@/redux/slices/compilerSlice";
import { handleError } from "@/utils/handleError";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const Compiler = () => {
  const { urlId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
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
            console.log(res?.data);
            dispatch(updateFullCode(res?.data?.fullCode));
          })
          .catch((err) => {
            if (axios.isAxiosError(err)) {
              if (err?.response?.status === 500) {
                toast("Invaild URL, Default code loaded!");
              }
            }
            handleError(err);
          })
          .finally(() => {
            setLoading(false);
          });
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
        <HelperHeader />
        <CodeEditior />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className=" h-[calc(100dvh-60px)] min-w-[350px] "
        defaultSize={50}
      >
        <RenderCode />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Compiler;
