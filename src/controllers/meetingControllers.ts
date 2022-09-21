import { Request, Response } from "express";
import {validationResult} from "express-validator";
import AppDataSource from "../data-source";

import { ContactInfo } from "../models/ContactInfo";
import { Employee } from "../models/Employee";
import { Meeting } from "../models/Meeting";
import { Task } from "../models/Task";

const employeeRepo = AppDataSource.getRepository(Employee);
const contactInfoRepo = AppDataSource.getRepository(ContactInfo);
const meetingRepo = AppDataSource.getRepository(Meeting);
const taskRepo = AppDataSource.getRepository(Task);

exports.createMeeting = async(req : Request, res : Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors : errors.array()});
  }
  const availableMeeting = await meetingRepo.findOneBy({zoomURL : req.body.zoomURL});
  if(availableMeeting){
    return res.status(422).json({msg : "Meeting record cannot be created, as it already exists!"})
  }
  const employeeArr : Employee[] = [];
  const meeting = new Meeting();
  meeting.zoomURL = req.body.zoomURL;
  meeting.agenda = req.body.agenda;
  const attendees : string[] = req.body.attendees.split(", ");
  const empPromiseArr = attendees.map( async(attendee : string) => {
    try{
      const emp = await employeeRepo.createQueryBuilder("employee")
      .leftJoinAndSelect("employee.contactInfo", "contactInfo")
      .leftJoinAndSelect("employee.meetings", "meetings")
      .where("contactInfo.email = :email", {email : attendee})
      .getOne();
      if(!emp){
        return res.status(422).json({msg : "Attendee does not exist"});
      }
      employeeArr.push(emp);
      if(!emp.meetings){
        emp.meetings = [meeting];
      }else{
        emp.meetings = [...emp.meetings, meeting];
      }
      return await employeeRepo.save(emp);
    }catch(err){
      console.log(err);
    }
   });

   meeting.attendees = employeeArr;
   
   try{
     await Promise.all(empPromiseArr)
     await meetingRepo.save(meeting);
     
     res.status(201).json({msg : "Meeting created successfully!"})
  }catch(err){
    console.log("Error occurred : ", err);
    res.status(500).json({msg : "ISE"});
  }
}

exports.getAllMeetings = async(req : Request, res : Response) => {
  try{
    const meetings = await meetingRepo.createQueryBuilder("meetings")
    .leftJoinAndSelect("meetings.attendees", "attendees")
    .getMany();
    res.status(200).json({meetings : meetings});
  }catch(err){
    console.log("Error occurred : ", err);
    res.status(500).json({msg : "ISE"});
  }
}

exports.removeMeeting = async(req : Request, res : Response) => {
  try{
    const meeting = await meetingRepo.createQueryBuilder("meeting")
    .leftJoinAndSelect("meeting.attendees", "attendees")
    .where("meeting.id = :id", {id : req.query.meetid})
    .getOne();
    if(!meeting){
      return res.status(404).json({msg : "Meeting record not found"})
    }
    const meetingPromiseArr = meeting.attendees.map(async(attendee) => {
      const employee = await employeeRepo.createQueryBuilder("employee")
      .leftJoinAndSelect("employee.meetings", "meetings")
      .where("employee.id = :id", {id : attendee.id})
      .getOne();
      if(!employee){
        return res.status(404).json({msg : "Meeting of employee not found"})
      }
      let count = 0;
      for(let i = 0; i < employee.meetings.length; i++){
        if (employee.meetings[i].id === req.query.meetid){
          break;
        }
        count++;
      }
      employee.meetings.splice(count, 1);
      await employeeRepo.save(employee);
    })
    await Promise.all(meetingPromiseArr);
    await meetingRepo.remove(meeting);
    res.status(201).json({msg : "Removed meeting"});
  }catch(err){
    console.log(err);
  }
}