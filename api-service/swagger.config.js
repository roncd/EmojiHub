const path = require("path");

module.exports = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EmojiHub API",
      version: "1.0.0",
      description: "Documentation API du projet EmojiHub"
    }
  },
    apis: [path.join(__dirname, "./src/routes/*.js")]
};
