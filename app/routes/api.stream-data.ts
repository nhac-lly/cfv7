import type { LoaderFunction } from "react-router";

// Sample data generator function
function* generateSampleData() {
 const items = [
  { id: 1, name: "Item 1", status: "active" },
  { id: 2, name: "Item 2", status: "pending" },
  { id: 3, name: "Item 3", status: "completed" },
  { id: 4, name: "Item 4", status: "active" },
  { id: 5, name: "Item 5", status: "pending" },
 ];

 for (const item of items) {
  yield item;
 }
}

export const loader: LoaderFunction = async ({ request }) => {
 // Create a TransformStream to handle the streaming
 const stream = new TransformStream();
 const writer = stream.writable.getWriter();
 const encoder = new TextEncoder();

 // Start the streaming process
 (async () => {
  try {
   // Write the opening bracket for the JSON array
   await writer.write(encoder.encode('{"data":['));

   let isFirst = true;
   for (const item of generateSampleData()) {
    // Add comma between items (except for the first item)
    if (!isFirst) {
     await writer.write(encoder.encode(","));
    }
    isFirst = false;

    // Simulate some delay between chunks
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Write the item
    await writer.write(encoder.encode(JSON.stringify(item)));
   }

   // Write the closing brackets
   await writer.write(encoder.encode("]}"));
   await writer.close();
  } catch (error) {
   console.error("Streaming error:", error);
   writer.abort(error);
  }
 })();

 // Return the response with appropriate headers
 return new Response(stream.readable, {
  headers: {
   "Content-Type": "application/json",
   "Cache-Control": "no-cache",
   "Transfer-Encoding": "chunked",
  },
 });
};
