const express = require("express");
const app = express();
const cors = require("cors");

//middleware

app.use(cors());
app.use(express.json());


//routes
const authRoutes = require('./routes/auth')
const locationRoutes = require('./routes/location')
const listingRoutes = require('./routes/listing')
app.use(authRoutes)
app.use(locationRoutes)
app.use(listingRoutes)




app.listen(5000, () => {
  console.log(`Server is currently running on port 5000`);
});