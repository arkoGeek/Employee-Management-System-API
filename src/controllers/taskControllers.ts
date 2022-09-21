import { Request, Response } from "express";
import { validationResult } from "express-validator";
import AppDataSource from "../data-source";
import { ContactInfo } from "../models/ContactInfo";
import { Employee } from "../models/Employee";
import { Meeting } from "../models/Meeting";
import { Task } from "../models/Task";

const employeeRepo = AppDataSource.getRepository(Employee);
const contactInfoRepo = AppDataSource.getRepository(ContactInfo);
const meetingRepo = AppDataSource.getRepository(Meeting);
const taskRepo = AppDataSource.getRepository(Task);

exports.createTask = async(req : Request, res : Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors : errors.array()});
  }
  const emp = await employeeRepo.createQueryBuilder("employee")
  .leftJoinAndSelect("employee.contactInfo", "contactInfo")
  .leftJoinAndSelect("employee.tasks", "tasks")
  .select(["employee.name", "contactInfo.email", "tasks", "employee.id"])
  .where("contactInfo.email = :email", {email : req.body.email})
  .getOne();

  if(!emp){
    return res.status(422).json({msg : "Employee with this email, not found."})
  }

  const task = new Task();
  task.name = req.body.taskname;
  
  if(!emp.tasks){
    emp.tasks = [task];
  }else{
    emp.tasks = [...emp.tasks, task];
  }

  try{
    await taskRepo.save(task);
    await employeeRepo.save(emp);
    res.status(200).json({msg : "Task added!"})
  }catch(err){
    console.log('Error occurred : ', err);
    res.status(500).json({msg : "ISE"});
  }
}

exports.getAllTasks = async(req : Request, res : Response) => {
  try{
    const tasks = await taskRepo.createQueryBuilder("task")
    .leftJoinAndSelect("task.employee", "employee")
    .select(["task.name", "task.id", "employee"])
    .getMany()
    res.status(200).json({tasks : tasks});
  }catch(err){
    console.log('Error occurred : ', err);
    res.status(500).json({msg : "ISE"});
  }
}

exports.getTasksForEmployee = async(req : Request, res : Response) => {
  try{
    const tasks = await taskRepo.createQueryBuilder("task")
    .leftJoinAndSelect("task.employee", "employee")
    .select(["task.name", "task.id", "employee.id", "employee.name"])
    .where("employee.id = :id", {id : req.query.empid})
    .getMany()
    res.status(200).json({tasks : tasks});
  }catch(err){
    console.log('Error occurred : ', err);
    res.status(500).json({msg : "ISE"});
  }
}