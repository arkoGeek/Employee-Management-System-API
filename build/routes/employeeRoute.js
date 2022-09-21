"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeeControllers = require("../controllers/employeeControllers");
const router = (0, express_1.Router)();
router.get("/", employeeControllers.getAllEmployees);
router.post("/", employeeControllers.createAnEmployee);
router.get("/:id", employeeControllers.getOneEmployee);
module.exports = router;
