const chokidar = require("chokidar");

function setupFileWatcher(onChange) {
  const watcher = chokidar.watch("./src", {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", (path) => {
    console.log(`文件已更改: ${path}`);
    onChange(path);
  });
}

module.exports = setupFileWatcher;
