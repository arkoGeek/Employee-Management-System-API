import { ManyToMany, Column, PrimaryGeneratedColumn, Entity } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Meeting{
  @PrimaryGeneratedColumn("uuid")
  id : string

  @Column()
  zoomURL : string 

  @Column()
  agenda : string

  @ManyToMany(() => Employee, employee => employee.meetings)
  attendees : Employee[]
}