import {Router} from "express";
import { check } from "express-validator";
const taskControllers = require("../controllers/taskControllers");

const router : Router = Router();

router.post("/", [
  check("email", "Please provide proper name").trim().isEmail(),
  check("taskname", "Please provide proper task").trim().isLength({min : 4})
], taskControllers.createTask);

router.get("/", taskControllers.getAllTasks);
router.get("/tasksOfEmp", taskControllers.getTasksForEmployee);

module.exports = router;