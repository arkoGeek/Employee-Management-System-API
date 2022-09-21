import { Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Entity } from "typeorm";
import {Employee} from "./Employee"

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id : string

  @Column()
  name : string

  @ManyToOne(() => Employee, employee => employee.tasks, {onDelete : "SET NULL"})
  @JoinColumn()
  employee : Employee
}