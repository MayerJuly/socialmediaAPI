const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const cors = require('cors');
const multer = require("multer");
const app = express();
const path = require("path");

dotenv.config();



mongoose.connect(process.env.MONGO_URL).
    then(() => {
        console.log('Mongo db is connected')
    }
    )

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors( {
    credentials:true,
    origin: process.env.CLIENT_URL
}))



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});
const upload = multer({ storage: storage });


app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
        return await res.status(200).json('File uploaded successfully');
    } catch (error) {
        console.error(error);
    }
})


app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


app.listen(8800, () => {
})