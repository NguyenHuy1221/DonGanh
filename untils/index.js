const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const multer = require("multer");
const { uid } = require("uid");

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); //hỉnh ảnh sẽ chưa trong folder uploads
  },
  filename: (req, file, cb) => {
    console.log(file);
    const id = uid();
    cb(null, `${id}-${file.originalname}`); // mặc định sẽ save name của hình ảnh
    // là name gốc, chúng ta có thể rename nó.
  },
});

const upload = multer({ storage: storage });

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

function generateToken(payLoad) {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined");
  }

  const token = jwt.sign({ data: payLoad }, secretKey, {
    expiresIn: process.env.EXPIRE_TIME,
  });

  return token;
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  upload,
};
