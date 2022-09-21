import { Router } from "express";
import { check } from "express-validator";

const router = Router();
const meetingControllers = require("../controllers/meetingControllers");

router.post("/", [
  check("attendees", "Provide a proper entry").trim(),
  check("zoomURL", "Provide a proper URL").trim().isURL()
], meetingControllers.createMeeting);

router.get("/", meetingControllers.getAllMeetings);
router.delete("/deleteById", meetingControllers.removeMeeting);

module.exports = router;