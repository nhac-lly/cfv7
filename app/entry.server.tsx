import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

export default async function handleRequest(
 request: Request,
 status: number,
 headers: Headers,
 routerContext: EntryContext,
 _loadContext: AppLoadContext,
) {
 const userAgent = request.headers.get("user-agent");
 const stream = await renderToReadableStream(
  <ServerRouter context={routerContext} url={request.url} />,
  {
   signal: request.signal,
   onError(error: unknown) {
    if (!request.signal.aborted) {
     // Log streaming rendering errors from inside the shell
     console.error(error);
    }
    // biome-ignore lint/style/noParameterAssign: It's ok
    status = 500;
   },
  },
 );

 if (isbot(userAgent)) await stream.allReady;

 headers.set("Content-Type", "text/html; charset=utf-8");
 headers.set("Transfer-Encoding", "chunked");
 headers.set("Cache-Control", "no-cache");

 return new Response(stream, { status, headers });
}
