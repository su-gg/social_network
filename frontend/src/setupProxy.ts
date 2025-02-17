import { createProxyMiddleware } from "http-proxy-middleware";

//const API_URL = "https://prod-beyondwords-04dd84f0b17e.herokuapp.com";
const API_URL = "http://localhost:3010";

export default function (app: any) {
  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: API_URL,
      ws: true, 
      changeOrigin: true,
    })
  );
}
