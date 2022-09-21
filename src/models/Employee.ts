import { Column, Entity, OneToOne, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import "reflect-metadata"
import { ContactInfo } from "./ContactInfo";
import { Meeting } from "./Meeting";
import { Task } from "./Task";

@Entity()
export class Employee{
  @PrimaryGeneratedColumn("uuid")
  id : string

  @Column()
  name : string

  @Column()
  role : string 


  @ManyToOne(() => Employee, employee => employee.directReports, {onDelete : "SET NULL"})
  manager : Employee;

  @OneToMany(() => Employee, employee => employee.manager)
  directReports : Employee[];

  @OneToOne(() => ContactInfo, contactInfo => contactInfo.employee)
  contactInfo : ContactInfo

  @OneToMany(() => Task, task => task.employee) 
  tasks : Task[]

  @ManyToMany(() => Meeting, meeting => meeting.attendees)
  @JoinTable()
  meetings : Meeting[]
}