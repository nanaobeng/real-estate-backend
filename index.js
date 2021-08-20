const express = require("express");
const app = express();
const cors = require("cors");

//middleware

app.use(cors());
app.use(express.json());

//routes
app.use("/authentication", require("./routes/auth"));


app.listen(5000, () => {
  console.log(`Server is currently running on port 5000`);
});