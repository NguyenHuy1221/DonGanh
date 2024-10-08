require("dotenv").config();
const express = require("express");

const apiRoute = require("./router");
const apiBaokim = require("./baokim");
require("./models/mongo-provider.js");
const app = express();
require("dotenv").config();
const session = require("express-session");
const passport = require("./config/passportConfig");
app.use(express.json());
app.use("/api", apiRoute);
app.use("/apiBaokim", apiBaokim);
const path = require("path");

//chat ong an do thu 3
const cors = require('cors');
app.use(cors());
//chat
const http = require("http"); // Needed to set up a server with socket.io
const socketIO = require("socket.io"); // Socket.IO for real-time functionality
const server = http.createServer(app); // Use http server
const io = socketIO(server); // Initialize socket.io on the server


// // Thư mục chứa hình ảnh
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware kiểm tra người dùng đã xác thực
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// Định nghĩa các tuyến đường
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(
    `chúc mừng bạn trúng 100 triệu hãy nạp 100k vào tài khoản 0387162509 NH Timo để rút 100 triệu ${req.user.tenNguoiDung} thân mến`
  );
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Tuyến đường bắt đầu quá trình xác thực Facebook
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Tuyến đường xử lý callback từ Facebook
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//chat

// Socket.IO implementation
io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for chat messages
  socket.on("chat message", (msg) => {
    console.log("Message received: ", msg);

    // Broadcast message to all connected clients
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//gpt 
// const http = require('http');
// const socketIo = require('socket.io');
// const server = http.createServer(app);
// const io = require('./socket')(server)

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//       console.log('user disconnected');
//   });

//   socket.on('chat message', (msg) => {
//       io.emit('chat message', msg);
//   });
// });


// const socketSetup = require("./socket/index.js")
// const http = require('http');
// Tạo server HTTP từ ứng dụng Express
// const server = http.createServer(app);

// const io = socketSetup(server);
// app.use('/socket', socketSetup);
// main.js hoặc app.js
// const socket = io('https://imp-model-widely.ngrok-free.app', {
//   path: '/socket.io/',
//   auth: {
//       token: 'your_jwt_token'
//   }
// });

// socket.on('connect', () => {
//   console.log('Connected to server');
// });

// socket.on('onlineUser', (users) => {
//   console.log('Online users:', users);
// });
















//chat ong an do thu 2
// const port = 3000;
// var http= require("http")
// const cors = require("cors")
// var server = http.createServer(app)
// var io = require("socket.io")(server,{
//   cors:
//   {
//     origin:"*"
//   }
// });

// //middlewre
// app.use(cors())
// var clients = {};

// io.on("connection", (socket) => {
//   console.log("connetetd");
//   console.log(socket.id, "has joined");
//   socket.on("signin", (id) => {
//     console.log(id);
//     clients[id] = socket;
//     console.log(clients);
//   });
//   socket.on("message", (msg) => {
//     console.log(msg);
//     let targetId = msg.targetId;
//     if (clients[targetId]) clients[targetId].emit("message", msg);
//   });
// });

// server.listen(port, "0.0.0.0", () => {
//   console.log("server started");
// });


// const http = require('http').createServer(app);
// const io = require('socket.io')(http);

// var usp = io.of('/user-namespace')
// usp.on('connection', function(socket){
//   console.log('User Connected');

//   socket.on('disconnect', function(){
//     console.log('user Disconnected')
//   })
// })

// var http = require("http");
// var server = http.createServer(app);
// var io = require("socket.io")(server);

// //middlewre
// var clients = {};

// io.on("connection", (socket) => {
//   console.log("connetetd");
//   console.log(socket.id, "has joined");
//   socket.on("signin", (id) => {
//     console.log(id);
//     clients[id] = socket;
//     console.log(clients);
//   });
//   socket.on("message", (msg) => {
//     console.log(msg);
//     let targetId = msg.targetId;
//     if (clients[targetId]) clients[targetId].emit("message", msg);
//   });
// });




// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
