const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

//middleware

app.use(cors());
app.use(express.json());


//routes
const authRoutes = require('./routes/auth')
const locationRoutes = require('./routes/location')
const listingRoutes = require('./routes/listing')
const messagesRoutes = require('./routes/messages')
const auditRoutes = require('./routes/audit')
const subscriptionRoutes = require('./routes/subscription')
const dashboardRoutes = require('./routes/dashboard')
app.use(authRoutes)
app.use(locationRoutes)
app.use(listingRoutes)
app.use(messagesRoutes)
app.use(auditRoutes)
app.use(subscriptionRoutes)
app.use(dashboardRoutes)




app.listen(5000, () => {
  console.log(`Server is currently running on port 5000`);
});