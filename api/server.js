require("./configs/db");
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const createError = require("http-errors");
const routes = require("./routes");
const { Server } = require("socket.io");
const { PORT, COR_OPTIONS, SOCKET_OPTIONS, CLIENT_URL } = require("./configs");
const { socketHandler } = require("./socket");
const path = require("path");

const port = PORT || 5000;
const app = express();
const httpServer = http.createServer(app);

app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors(COR_OPTIONS));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.use(express.static(path.join(__dirname, "build")));

// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// routes
app.use(routes());

// middleware
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

httpServer.listen(port, () => console.log("Server is running on port " + port));

// socket io
const io = new Server(httpServer, SOCKET_OPTIONS);
socketHandler(io);
