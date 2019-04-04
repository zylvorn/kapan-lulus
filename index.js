require("babel-register")({
  presets: [["env", { useBuiltIns: true }]]
});

module.exports = require("./entrypoint");
