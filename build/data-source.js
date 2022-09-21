"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const ContactInfo_1 = require("./models/ContactInfo");
const Employee_1 = require("./models/Employee");
const Meeting_1 = require("./models/Meeting");
const Task_1 = require("./models/Task");
const AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "arkomda1",
    database: "manageDB",
    entities: [ContactInfo_1.ContactInfo, Meeting_1.Meeting, Employee_1.Employee, Task_1.Task],
    synchronize: false,
    logging: false,
});
AppDataSource.initialize()
    .then(() => {
    console.log("Connected SQL using TypeORM");
}).catch((err) => {
    console.log("Error encountered on connecting to SQL : ", err);
});
exports.default = AppDataSource;
