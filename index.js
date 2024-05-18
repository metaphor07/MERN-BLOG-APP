const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const path = require("path");
const app = express();
app.use(cors());
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");

// const multer = require("multer");
// app.use("/images", express.static(path.join(__dirname, "/images")));

// connect to the database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log(`Database connection successful...`))
  .catch((error) => console.log(`Database connection Error: ${error}`));

// here, we written code for using "multer"
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), async (req, res) => {
//   try {
//     res.status(200).json("File has been uploaded");
//   } catch (error) {
//     console.log("upload error", error);
//   }
// });

const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/firestore");
require("firebase/compat/storage");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARpAYf4dEWavMxVqOZGnX01Y6tk9dZ2zo",
  authDomain: "blog-application-17cd6.firebaseapp.com",
  databaseURL: "https://blog-application-17cd6-default-rtdb.firebaseio.com",
  projectId: "blog-application-17cd6",
  storageBucket: "blog-application-17cd6.appspot.com",
  messagingSenderId: "684721473504",
  appId: "1:684721473504:web:ca313102af74187ef0cd85",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const firApp = initializeApp(firebaseConfig);
const storage = firebase.storage();

app.post("/upload/", async (req, res) => {
  try {
    // console.log("file ", req.body);
    const data = req.body;
    console.log("file ", data);
    const fileName = new Date().getTime() + data.name;
    // Upload the item (file buffer) to Firebase storage
    const uploadTask = storage
      .ref(`/items/${fileName}`)
      .put(file, { contentType: "image/jpeg" });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress =
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // // console.log("Upload is " + Math.round(progress) + "% done");
        // // setUploadPerc(uploadPerc.type: item.label, uploadPerc.value= progress)
        // // setUploadPerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          res.status(200).json(url);
        });
      }
    );
  } catch (error) {
    console.log(error);
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
