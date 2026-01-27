import { InfoStore, EmployeeStore } from "./src/stores/Stores.js";
import { v4 as uuid4 } from "uuid";
import { format } from 'date-fns-tz';

let statusData = [];
let employeeData = [];

InfoStore.subscribe(data => {
  statusData = data;
});

EmployeeStore.subscribe(data => {
  employeeData = data;
})

export const postPunch = async ({ displayname, status, password}) => {
  const emp = employeeData.find(e => e.displayname.toLowerCase() === displayname.toLowerCase());

  if (!emp) throw new Error("Employee not found");

  const now = new Date();

  // Local date string in YYYY-MM-DD
  const date = format(now, "yyyy-M-dd");

  // Local time in seconds since midnight
  const time = `${now.getHours()}:${now.getMinutes() < 10 ? `0${now.getMinutes()}`: now.getMinutes()}`;

  if (password === emp.password) {
    let updated = false;
    statusData.map(e => {
      if (e.displayname.toLowerCase() === emp.displayname.toLowerCase()) {
        e.status = status;
        e.time = time;
        e.date = date;
        updated = true;
      }
    });
    if (!updated) {
      statusData.unshift({
        id: uuid4(),
        fullname: emp.fullname,
        displayname: emp.displayname,
        status,
        time,
        date,
        office: emp.office,
        groups: emp.groups
      })
    }
    InfoStore.set(statusData);
    return statusData;
  } else {
    throw new Error("Invalid password");
  }
}