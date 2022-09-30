import { DataSource } from "typeorm";
import { ContactInfo } from "./models/ContactInfo";
import { Employee } from "./models/Employee";
import { Meeting } from "./models/Meeting";
import { Task } from "./models/Task";
import * as dotenv from "dotenv";
dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: process.env.PASSWORD?.toString(),
  database: "manageDB",
  entities: [ContactInfo, Meeting, Employee, Task],
  migrations : [
    "src/migration/**.ts"
  ],
  synchronize: false,
  logging: false,
})

AppDataSource.initialize()
.then(() => {
  console.log("Connected SQL using TypeORM");
}).catch((err) => {
  console.log("Error encountered on connecting to SQL : ", err)
})

export default  AppDataSource;