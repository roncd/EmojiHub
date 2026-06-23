require('dotenv').config();
const app = require('./app')

const PORT = process.env.PORT

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const config = require("../swagger.config");

const specs = swaggerJsdoc(config);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.listen(PORT, () => {
  console.log(`api-service a démarré sur le port:  ${PORT}`)
})