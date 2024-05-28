const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./Config/db");
const nodemailer = require("nodemailer");
const UserRouter = require("./Routes/userRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Hello InnoByte");
});

app.use("/api/auth", UserRouter);
const PORT = process.env.PORT;
connectDB();
app.listen(PORT, async (req, res) => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
