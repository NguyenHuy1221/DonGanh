const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://nguyenquanghuy12a99:nguyenquanghuy12a99@cluster0.le2kyqy.mongodb.net/?retryWrites=true&w=majority&appName=DonGanh"
);

mongoose.connection.on("error", (err) => {
  console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});
