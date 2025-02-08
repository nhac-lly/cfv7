import { type LoaderFunction, useLoaderData } from "react-router";

interface Env {
 D1: D1Database;
}

export const loader: LoaderFunction = async ({ context, params }) => {
 const env = context.cloudflare.env as Env;
 const { results } = await env.D1.prepare("SELECT * FROM acc LIMIT 5").all();
 return results;
};

export default function Index() {
 const results = useLoaderData<typeof loader>();
 return (
  <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
   <h1>Welcome to Remix</h1>
   <div>
    A value from D1:
    <pre>{JSON.stringify(results)}</pre>
   </div>
  </div>
 );
}
