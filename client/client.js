// 动态加载模块
let currentModule = null;

function loadModule() {
  console.log("重新加载模块...");

  import(`./src/module.js?t=${Date.now()}`) // src后面加上时间戳，防止缓存
    .then((module) => {
      console.log("模块加载成功:", module);
      currentModule = module;
      render();
    })
    .catch((err) => {
      console.error("加载模块失败:", err);
    });
}

// 渲染模块
function render() {
  const root = document.getElementById("root");
  root.innerHTML = "";
  root.appendChild(currentModule.render());
  console.log("渲染模块完成");
}

// 初始化
loadModule();

// 连接 WebSocket
const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
  console.log("WebSocket 连接成功");
};

ws.onerror = (error) => {
  console.error("WebSocket 连接失败:", error);
};

ws.onclose = () => {
  console.log("WebSocket 连接关闭");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("接收到消息:", message);

  if (message.type === "update") {
    console.log(`文件已更新: ${message.path}`);
    // 重新加载模块
    loadModule();
  }
};
