import http from "node:http";

const { app } = await import("./v1/src/index");

http.createServer(app);
