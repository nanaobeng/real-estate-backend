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
const accountRoutes = require('./routes/account')
app.use(authRoutes)
app.use(locationRoutes)
app.use(listingRoutes)
app.use(messagesRoutes)
app.use(auditRoutes)
app.use(subscriptionRoutes)
app.use(dashboardRoutes)
app.use(accountRoutes)




const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})