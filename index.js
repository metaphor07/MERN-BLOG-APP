const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
app.use("/images", express.static(path.join(__dirname, "/images")));

// connect to the database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log(`Database connection successful...`))
  .catch((error) => console.log(`Database connection Error: ${error}`));

// here, we written code for using "multer"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    res.status(200).json("File has been uploaded");
  } catch (error) {
    console.log("upload error", error);
  }
});

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(port, () => {
  console.log(`Listining on port number: ${port}`);
});
