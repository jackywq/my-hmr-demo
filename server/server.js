const WebSocket = require("ws");
const express = require("express");
const path = require("path");
const setupFileWatcher = require("./watcher");

// 创建 HTTP 服务器
const app = express();
app.use(express.static("client")); // 提供静态文件服务

// 提供 src 目录的静态资源服务
app.use("/src", express.static(path.resolve(__dirname, "../src")));

const server = app.listen(3000, () => {
  console.log("服务器已启动: http://localhost:3000");
});

// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server }); // 服务端写法

wss.on("connection", (ws) => {
  console.log("客户端已连接");

  ws.on("close", () => {
    console.log("客户端已断开连接");
  });

  ws.on("error", (error) => {
    console.error("WebSocket 错误:", error);
  });

  // 监听文件变化
  setupFileWatcher((path) => {
    console.log(`文件已更改为: ${path}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "update", path }));
      }
    });
  });
});
