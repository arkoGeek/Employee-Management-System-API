"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = __importDefault(require("../data-source"));
const ContactInfo_1 = require("../models/ContactInfo");
const Employee_1 = require("../models/Employee");
const Meeting_1 = require("../models/Meeting");
const Task_1 = require("../models/Task");
// import { ifError } from "assert";
const employeeRepo = data_source_1.default.getRepository(Employee_1.Employee);
const contactInfoRepo = data_source_1.default.getRepository(ContactInfo_1.ContactInfo);
const meetingRepo = data_source_1.default.getRepository(Meeting_1.Meeting);
const taskRepo = data_source_1.default.getRepository(Task_1.Task);
//400 => Bad request
//401 => Unauth
//403 => Forbidden
//404 => not found
//422 => Unprocessbale entiry
//429 => Rate limiters => no of requests per second
//500 => ISE
exports.createAnEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const available = yield contactInfoRepo.findOneBy({ email: req.body.email });
    if (available) {
        return res.status(422).json({ msg: "Employee present already!" });
    }
    const emp = new Employee_1.Employee();
    const contactInfo = new ContactInfo_1.ContactInfo();
    emp.name = req.body.name;
    emp.role = req.body.role;
    if (req.body.superior) {
        const data = yield employeeRepo.createQueryBuilder("employee")
            .leftJoinAndSelect("employee.manager", "manager")
            .leftJoinAndSelect("employee.directReports", "directReports")
            .where("employee.name = :name", { name: req.body.superior })
            .getOne();
        if (!data) {
            return res.status(422).json({ msg: "Superior employee doesn't exist" });
        }
        emp.manager = data;
        if (!data.directReports) {
            data.directReports = [emp];
        }
        else {
            const dirReports = [...data.directReports, emp];
            data.directReports = dirReports;
        }
        yield employeeRepo.save(data);
        console.log(data);
    }
    contactInfo.phone = req.body.phone;
    contactInfo.email = req.body.email;
    emp.contactInfo = contactInfo;
    contactInfo.employee = emp;
    try {
        yield employeeRepo.save(emp);
        yield contactInfoRepo.save(contactInfo);
        res.status(201).json({ msg: "Employee added successfully!" });
    }
    catch (err) {
        console.log("Error occurred : ", err);
    }
});
exports.getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emp = yield employeeRepo.createQueryBuilder("employee")
            .leftJoinAndSelect("employee.manager", "manager")
            .leftJoinAndSelect("employee.contactInfo", "contactInfo")
            .leftJoinAndSelect("employee.directReports", "directReports")
            .leftJoinAndSelect("employee.tasks", "tasks")
            .leftJoinAndSelect("employee.meetings", "meetings")
            .select(["employee.name", "employee.role", "manager.name", "directReports.name", "tasks.name", "meetings.zoomURL", "employee.id"])
            .getMany();
        res.json({ employees: emp });
    }
    catch (err) {
        console.log("Error fetching employee records : ", err);
    }
});
exports.getOneEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emp = yield employeeRepo.createQueryBuilder("employee")
            .leftJoinAndSelect("employee.manager", "manager")
            .leftJoinAndSelect("employee.contactInfo", "contactInfo")
            .leftJoinAndSelect("employee.directReports", "directReports")
            .leftJoinAndSelect("employee.tasks", "tasks")
            .leftJoinAndSelect("employee.meetings", "meetings")
            .select(["employee.name", "manager.name", "directReports.name", "tasks.name", "meetings.zoomURL"])
            .where("employee.id = :id", { id: req.query.empid })
            .getOne();
        res.json({ emp: emp });
    }
    catch (err) {
        console.log("Error finding : ", err);
    }
});
