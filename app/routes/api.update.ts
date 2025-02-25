import type { LoaderFunction } from "react-router";

export const loader: LoaderFunction = async ({ request }) => {
 const formData = await request.formData();
 const id = formData.get("id");
 const name = formData.get("name");

 return new Response(JSON.stringify({ id, name }), {
  headers: {
   "Content-Type": "application/json",
  },
 });
};