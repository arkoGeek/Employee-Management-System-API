import "reflect-metadata";
import {Request, Response} from "express"
import AppDataSource from "../data-source";
import { ContactInfo } from "../models/ContactInfo";
import { Employee } from "../models/Employee";
import { Meeting } from "../models/Meeting";
import { Task } from "../models/Task";
import { validationResult } from "express-validator";

const employeeRepo = AppDataSource.getRepository(Employee);
const contactInfoRepo = AppDataSource.getRepository(ContactInfo);
const meetingRepo = AppDataSource.getRepository(Meeting);
const taskRepo = AppDataSource.getRepository(Task);

//400 => Bad request
//401 => Unauth
//403 => Forbidden
//404 => not found
//422 => Unprocessbale entiry
//429 => Rate limiters => no of requests per second
//500 => ISE




exports.createAnEmployee = async(req : Request, res : Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors : errors.array()})
  }
  const available = await contactInfoRepo.findOneBy({email : req.body.email});
  if(available){
    return res.status(401).json({msg : "Employee present already!"})
  }
  const emp = new Employee();
  const contactInfo = new ContactInfo();
  emp.name = req.body.name;
  emp.role = req.body.role;
  if(req.body.superior){
    const data = await employeeRepo.createQueryBuilder("employee")
    .leftJoinAndSelect("employee.manager", "manager")
    .leftJoinAndSelect("employee.directReports", "directReports")
    .where("employee.name = :name", {name : req.body.superior})
    .getOne();
    if(!data){
      return res.status(422).json({msg : "Superior employee doesn't exist"});
    }
    emp.manager = data;
    if(!data.directReports){
      data.directReports = [emp];
    }else{
      const dirReports = [...data.directReports, emp];
      data.directReports = dirReports;
    }
    await employeeRepo.save(data);
  }
  contactInfo.phone = req.body.phone; 
  contactInfo.email = req.body.email;
  contactInfo.city = req.body.city;
  emp.contactInfo = contactInfo;
  contactInfo.employee = emp;
  try{
    await employeeRepo.save(emp);
    await contactInfoRepo.save(contactInfo);
    res.status(201).json({msg : "Employee added successfully!"});
  }catch(err){
    console.log("Error occurred : ", err);
  }
}

exports.getAllEmployees = async(req : Request, res : Response) => {
  try{
    const emp = await employeeRepo.createQueryBuilder("employee")
    .leftJoinAndSelect("employee.manager", "manager")
    .leftJoinAndSelect("employee.contactInfo", "contactInfo")
    .leftJoinAndSelect("employee.directReports", "directReports")
    .leftJoinAndSelect("employee.tasks", "tasks")
    .leftJoinAndSelect("employee.meetings", "meetings")
    .select(["employee.name", "employee.role", "manager.name", "directReports.name", "tasks.name", "meetings.zoomURL", "employee.id", "contactInfo.email"])
    .getMany();
    res.json({employees : emp});
  }catch(err){
    console.log("Error fetching employee records : ", err);
  }
}

exports.getOneEmployee = async(req : Request, res : Response) => {
  try{
    const emp = await employeeRepo.createQueryBuilder("employee")
    .leftJoinAndSelect("employee.manager", "manager")
    .leftJoinAndSelect("employee.contactInfo", "contactInfo")
    .leftJoinAndSelect("employee.directReports", "directReports")
    .leftJoinAndSelect("employee.tasks", "tasks")
    .leftJoinAndSelect("employee.meetings", "meetings")
    .select(["employee.name", "manager.name", "directReports.name", "tasks.name", "meetings.zoomURL", "contactInfo.email"])
    .where("employee.id = :id", {id : req.query.empid})
    .getOne();
    res.json({emp : emp});
  }catch(err){
    console.log("Error finding : ",err);
    res.status(500).json({msg : "Internal Server Error"});
  }
}

exports.getEmpolyeesByRole = async(req : Request, res : Response) => {
  try{
    const emps = await employeeRepo.createQueryBuilder("employee")
    .leftJoinAndSelect("employee.contactInfo", "contactInfo")
    .select(["employee.name", "employee.id", "contactInfo.phone", "contactInfo.email"])
    .where("employee.role = :role", {role : req.query.role})
    .getMany();
    res.status(200).json({employees : emps})
  }catch(err){
    console.log("Error occured : ", err);
    res.status(500).json({msg : "Internal Server Error"});
  }
}