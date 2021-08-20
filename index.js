const express = require("express");
const app = express();
const cors = require("cors");

//middleware

app.use(cors());
app.use(express.json());


//routes
const authRoutes = require('./routes/auth')
app.use(authRoutes)



app.listen(5000, () => {
  console.log(`Server is currently running on port 5000`);
});