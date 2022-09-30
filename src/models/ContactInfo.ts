import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {Employee} from "./Employee"

@Entity()
export class ContactInfo {
  @PrimaryGeneratedColumn("uuid")
  id : string

  @Column()
  phone : string

  @Column()
  email : string 

  @Column()
  employeeId : number

  @Column({nullable : true})
  city : string

  @OneToOne(() => Employee, employee => employee.contactInfo, {onDelete : "CASCADE"})
  @JoinColumn()
  employee : Employee
}