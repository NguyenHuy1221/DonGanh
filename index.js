require("dotenv").config();
const express = require("express");

const apiRoute = require("./router");
const apiBaokim = require("./baokim");
require("./models/mongo-provider.js");
const app = express();
const session = require("express-session");
const passport = require("./config/passportConfig");
app.use(express.json());
app.use("/api", apiRoute);
app.use("/apiBaokim", apiBaokim);
const path = require("path");
const ConversationModel = require("./models/ConversationSchema.js");
const MessageModel = require("./models/MessageSchema.js");
//chat ong an do thu 3
const cors = require("cors");
app.use(cors());
const jwt = require('jsonwebtoken')

//chat
const http = require("http"); // Needed to set up a server with socket.io
// const socketIO = require("socket.io"); // Socket.IO for real-time functionality
var server = http.createServer(app); // Use http server
// const io = socketIO(server); // Initialize socket.io on the server
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
});

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

app.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Đăng nhập thất bại", error: err });
    }
    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    }
    // Đăng nhập thành công, thực hiện lưu thông tin user vào session
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi đăng nhập", error: err });
      }
      // Đăng ký hoặc đăng nhập thành công, trả về thông báo
      return res
        .status(200)
        .json({ message: "Đăng nhập Google thành công", user });
    });
  })(req, res, next);
});

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

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);
  // Lấy token từ handshake
  const token = socket.handshake.auth.token;
  console.log(token);
  let userid;
  // Xác thực token
  try {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err);
      } else {
        console.log("Decoded token:", decoded);
        userid = decoded.data;
      }
    });
  } catch (err) {
    console.log("Token verification failed:", err);
    socket.emit("error", { message: "Authentication failed" });
    socket.disconnect(); // Ngắt kết nối nếu token không hợp lệ
    return; // Dừng quá trình nếu token không hợp lệ
  }

  // Đảm bảo userid đã tồn tại trước khi xử lý sự kiện khác
  if (!userid) {
    socket.emit("error", { message: "Invalid token" });
    return;
  }
  socket.on("/test", (mgs) => {
    console.log(mgs);
    // io.emit("/test", mgs);
  });

  console.log(userid); // Đảm bảo userid đã được gán trước khi sử dụng

  socket.on("join", async ({ conversationId }) => {
    try {
      if (!userid) {
        console.error("User ID is not defined");
        socket.emit("error", { message: "User not authenticated" });
        return;
      }
      // Tìm cuộc trò chuyện và populate các tin nhắn
      const conversation = await ConversationModel.findById(
        conversationId
      ).populate("messages");

      if (conversation) {
        socket.join(conversationId);
        console.log(`User ${userid} joined conversation ${conversationId}`);

        // Sắp xếp các tin nhắn theo thứ tự thời gian
        const sortedMessages = conversation.messages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        socket.emit("Joined", {
          conversationId,
          messages: sortedMessages,
        });
      } else {
        socket.emit("error", { message: "Conversation not found" });
      }
    } catch (error) {
      console.error(
        `Error during join (conversationId: ${conversationId}):`,
        error
      );
      socket.emit("error", { message: "An error occurred while joining" });
    }
  });

  socket.on('sendMessage', async ({ conversationId, text, imageUrl, videoUrl }) => {
    try {
      const message = new MessageModel({
        text,
        imageUrl,
        videoUrl,
        msgByUserId: userid,
      });
      // Gửi phản hồi nhanh chóng tới client
      io.to(conversationId).emit('message', { conversationId, message });
      // Lưu tin nhắn và cập nhật cuộc trò chuyện không đồng bộ
      await message.save();
      const conversation = await ConversationModel.findById(conversationId);
      console.log(conversation)
      conversation.messages.push(message._id);
      await conversation.save();
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'An error occurred while sending the message' });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
server.listen(5000, "0.0.0.0", () => {
  console.log("Server  is running on port 3000");
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
