import CodeEditior from "@/components/codeEditior";
import HelperHeader from "@/components/helperHeader";
import RenderCode from "@/components/renderCode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Compiler = () => {
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
