import { RootState } from "@/redux/store";
import { MutableRefObject, useEffect, useState } from "react";
import { useSelector } from "react-redux";
const CodeWorker = new URL('../worker/codeRunner.worker.ts', import.meta.url);

export default function RenderCode({isCompiler ,workerRef}: { isCompiler: boolean, workerRef:MutableRefObject<Worker | null> }) {
  // const workerRef = useRef<Worker | null>(null);
  const [output, setOutput] = useState('');

  useEffect(() => {
    const worker = new Worker(CodeWorker, { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<{ output: string }>) => {
      console.log(e.data.output, "Output from worker");
      setOutput(e.data.output);
    };

    return () => {
      worker.terminate();
    };
  }, []);

   

  const fullCode = useSelector(
    (state: RootState) => state.compilerSlice.fullCode
  );

  const combinedCode = `<html><style>${fullCode.css}</style><body>${fullCode.html}</body><script>${fullCode.javascript}</script></html>`;

  const iframeCode = `data:text/html;charset=utf-8,${encodeURIComponent(
    combinedCode
  )}`;

  return (
    <div className="bg-white h-[calc(100dvh-60px)]">
      {
        isCompiler && (
          <h2 className="text-xl font-bold mb-4 text-black pl-3 pt-3">
            Output
          </h2>
        )
      }
      {
        isCompiler ? 
        (<pre className="p-4 bg-gray-100 h-full overflow-auto">
            <p className="text-black">{output}</p>
        </pre>):
        <iframe className="w-full h-full" src={iframeCode} /> 

      }
    </div>
  );
}
