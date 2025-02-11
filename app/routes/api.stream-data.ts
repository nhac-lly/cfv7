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
 // Create a ReadableStream directly
 const stream = new ReadableStream({
  async start(controller) {
   const encoder = new TextEncoder();

   try {
    // Write the opening bracket
    controller.enqueue(encoder.encode('{"data":['));

    let isFirst = true;
    for (const item of generateSampleData()) {
     // Add comma between items
     if (!isFirst) {
      controller.enqueue(encoder.encode(","));
     }
     isFirst = false;

     // Simulate delay
     await new Promise((resolve) => setTimeout(resolve, 500));

     // Write the item
     controller.enqueue(encoder.encode(JSON.stringify(item)));
    }

    // Write the closing brackets
    controller.enqueue(encoder.encode("]}"));
    controller.close();
   } catch (error) {
    controller.error(error);
   }
  },
 });

 // Return the response with appropriate headers
 return new Response(stream, {
  headers: {
   "Content-Type": "application/json",
   "Cache-Control": "no-cache",
   "Transfer-Encoding": "chunked",
   // Add CORS headers
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Methods": "GET, OPTIONS",
   "Access-Control-Allow-Headers": "Content-Type",
  },
 });
};
