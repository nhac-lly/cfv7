export class StreamingAPIClient {
 private worker: Worker | null = null;

 private initWorker() {
  if (!this.worker) {
   this.worker = new Worker(
    new URL("../workers/streamWorker.ts", import.meta.url),
    { type: "module" },
   );
  }
  return this.worker;
 }

 request<T>(
  url: string,
  options: RequestInit = {},
  onChunk?: (data: Partial<T>) => void,
 ) {
  const worker = this.initWorker();
  let buffer = "";

  return new Promise<T>((resolve, reject) => {
   worker.onmessage = (event) => {
    const { type, payload } = event.data;

    switch (type) {
     case "STREAM_DATA":
      buffer += payload;
      console.log(buffer);
      try {
       // Try to parse accumulated buffer as valid JSON
       if (buffer.startsWith('{"data":[') && buffer.includes("}")) {
        const cleanBuffer = buffer.slice(0, -1);
        const partial = buffer.includes("]}")
         ? buffer
         : buffer.at(-1) === ","
           ? `${buffer.slice(0, -1)}]}`
           : `${buffer}]}`;
        console.log(partial);
        const parsedData = JSON.parse(partial) as T;
        console.log(parsedData);
        onChunk?.(parsedData);
       }
      } catch (error) {
       console.log(error);
       // Ignore parsing errors for incomplete JSON
      }
      break;
     case "STREAM_COMPLETE":
      try {
       const fullData = JSON.parse(buffer) as T;
       resolve(fullData);
      } catch (error) {
       reject(new Error("Failed to parse stream data"));
      }
      break;
     case "STREAM_ERROR":
      reject(new Error(payload));
      break;
    }
   };

   worker.onerror = (error) => {
    reject(new Error(`Worker error: ${error.message}`));
   };

   worker.postMessage({ url, options });
  });
 }

 destroy() {
  if (this.worker) {
   this.worker.terminate();
   this.worker = null;
  }
 }
}

// Create a singleton instance
export const apiClient = new StreamingAPIClient();
