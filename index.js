require("dotenv").config();
const express = require("express");
const app = express();
const apiRoute = require("./router");
require("./models/mongo-provider.js");
require("dotenv").config();
const session = require("express-session");
const passport = require("./config/passportConfig");
app.use(express.json());
app.use("/api", apiRoute);
app.use(express.static('public'));
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

// app.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
