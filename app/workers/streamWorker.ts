// Define message types for worker communication
type WorkerMessage = {
 type: "START_STREAM" | "STREAM_DATA" | "STREAM_COMPLETE" | "STREAM_ERROR";
 payload?: any;
};

self.onmessage = async (event) => {
 const { url, options } = event.data;

 try {
  const response = await fetch(url, options);

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
   throw new Error("Response has no body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
   const { done, value } = await reader.read();

   if (done) {
    self.postMessage({ type: "STREAM_COMPLETE" });
    break;
   }

   const chunk = decoder.decode(value, { stream: true });
   self.postMessage({
    type: "STREAM_DATA",
    payload: chunk,
   });
  }
 } catch (error) {
  self.postMessage({
   type: "STREAM_ERROR",
   payload: error.message,
  });
 }
};
