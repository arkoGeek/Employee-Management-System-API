import {Router} from "express"
const employeeControllers = require("../controllers/employeeControllers")
import {check} from "express-validator";

const router : Router = Router();

router.get("/", employeeControllers.getAllEmployees);
router.post("/", [
  check("name", "Please provide a name").trim().isLength({min : 4}),
  check("email", "Please provide a proper email").trim().isEmail(),
  check("role", "Please provide a proper role").trim().exists().notEmpty()
], employeeControllers.createAnEmployee);
router.get("/getOne", employeeControllers.getOneEmployee);
router.get("/getByRole", employeeControllers.getEmpolyeesByRole);

module.exports = router;