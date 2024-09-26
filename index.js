require("dotenv").config();
const express = require("express");
const app = express();
const apiRoute = require("./router");
const apiBaokim = require("./baokim");
require("./models/mongo-provider.js");
require("dotenv").config();
const session = require("express-session");
const passport = require("./config/passportConfig");
app.use(express.json());
app.use("/api", apiRoute);
app.use("/apiBaokim", apiBaokim);
const path = require("path");

//chat
//ong an do dau tien
const UserModel = require('./models/NguoiDungSchema.js')
const http = require('http').Server(app);
const io = require('socket.io')(http)
var usp = io.of('/user-namespace')
usp.on('connection',async function(Socket){
  console.log('User Connected')

  var userId = Socket.handshake.auth.token;

  try {
    await UserModel.findByIdAndUpdate({_id: userId}, {$set: {tinhTrang: 1}});
    // user broadcast online status
    Socket.broadcast.emit('getOnlineUser', {user_id: userId});
  } catch (error) {
    console.error('Error updating user status:', error);
  }

  Socket.on('disconnect',async function(){
    console.log('user Disconnected');

    var userId = Socket.handshake.auth.token;
    try {
      await UserModel.findByIdAndUpdate({_id: userId}, {$set: {tinhTrang: 0}});
      // user broadcast offline status
      Socket.broadcast.emit('getOfflineUser', {user_id: userId});
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  })
});


// Thư mục chứa hình ảnh
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





app.listen(3000, () => {
  console.log("Server is running on port 5000");
});
