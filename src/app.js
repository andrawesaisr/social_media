const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const authRoute = require("./routers/auth");
const usersRoute = require("./routers/users");
const postsRoute = require("./routers/posts");
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
const port = process.env.PORT;

mongoose.connect(
  "mongodb+srv://andrew:password111@cluster0.k1lrhbw.mongodb.net/social_network",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

app.get("/", (req, res) => {
  res.send("welcome to express app!!");
});

app.listen(port, () => {
  console.log(`Backend server is runnign on port ${port}`);
});
