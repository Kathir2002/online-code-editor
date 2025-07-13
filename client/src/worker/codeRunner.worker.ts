self.onmessage = (e: MessageEvent<string>) => {
  const code = e.data;

  try {
    let capturedOutput = '';
    const originalLog = console.log;

    // Capture console.log output
    console.log = (...args: any[]) => {
      capturedOutput += args.join(' ') + '\n';
    };

    const result = new Function(code)();

    // Restore original log
    console.log = originalLog;

    const finalOutput =
      capturedOutput.trim() || (result !== undefined ? result.toString() : 'undefined');

    self.postMessage({ output: finalOutput });
  } catch (error: any) {
    self.postMessage({ output: `Error: ${error.message}` });
  }
};

export {}; // 👈 Important to make it a module
