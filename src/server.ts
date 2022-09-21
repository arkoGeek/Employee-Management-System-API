import express from "express";
const employeeRoute = require("./routes/employeeRoute");
const taskRoute = require("./routes/taskRoute");
const meetingRoute = require("./routes/meetingRoute");

const app = express();

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use("/emp", employeeRoute);
app.use("/task", taskRoute);
app.use("/meetings", meetingRoute);

app.listen(4000, () => {
  console.log("Server running on port 4000");
})