import { createProxyMiddleware } from "http-proxy-middleware";

export default function (app: any) {
  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: "http://localhost:3010",
      ws: true, 
      changeOrigin: true,
    })
  );
}
