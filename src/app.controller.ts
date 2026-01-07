import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { AppService } from './app.service';
import { Attendance } from './entities/attendance.entity';
import { Roles } from './entities/role.entity';
import { UserRolesMapping } from './entities/User-Roles-Mapping';
import { Users } from './entities/user.entity';

@Controller()
export class AppController {
  constructor( 
  private readonly appService: AppService,

   // 🔹 Attendance DB
      @InjectRepository(Attendance, 'attendance')
      private readonly attendanceRepo: Repository<Attendance>,
  
      @InjectRepository(Users)
      private readonly userRepo: Repository<Users>,
      
      // 🔹 Default DB
      @InjectRepository(UserRolesMapping)
      private readonly registrationTrackerRepo: Repository<UserRolesMapping>,
  
      @InjectRepository(Roles)
      private readonly rolesRepo: Repository<Roles>,
) {}


 private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


@Post('/attendance/by-dates')
async getAttendanceByDates(@Body() data: any) {
  console.log('Request body:', data);

  const dates: string[] = (
    Array.isArray(data.attendanceDate)
      ? data.attendanceDate
      : [data.attendanceDate]
  ).filter((d): d is string => Boolean(d));

  if (!dates.length) return [];

  // 2️⃣ Fetch attendance data
   const attendanceData = await this.appService.fetchAttendanceData(dates);

   console.log(attendanceData);
   
    const userDateMap = new Map<
      string,
      { userId: string; date: Date; present: number; absent: number }
    >();

    for (const record of attendanceData) {
      const key = `${record.userId}|${record.attendanceDate}`;

      if (!userDateMap.has(key)) {
        userDateMap.set(key, {
          userId: record.userId,
          date: record.attendanceDate,
          present: 0,
          absent: 0,
        });
      }

      if (record.attendance === 'present') {
        userDateMap.get(key)!.present++;
      }

      if (record.attendance === 'absent') {
        userDateMap.get(key)!.absent++;
      }
    }

    const userIds = [...new Set(attendanceData.map(a => a.userId))];

    const userRoles =
      await this.appService.getUserRolesByUserIds(userIds);

    const userRoleMap = new Map<string, string>();
    for (const row of userRoles) {
      userRoleMap.set(row.userId, row.name);
    }

    const roleDateMap = new Map<
      string,
      { role: string; date: Date; present: number; absent: number }
    >();

    for (const entry of userDateMap.values()) {
      const role = userRoleMap.get(entry.userId);
      if (!role) continue;

      const key = `${role}|${entry.date}`;

      if (!roleDateMap.has(key)) {
        roleDateMap.set(key, {
          role,
          date: entry.date,
          present: 0,
          absent: 0,
        });
      }
      roleDateMap.get(key)!.present += entry.present;
      roleDateMap.get(key)!.absent += entry.absent;
    }

   const response = Array.from(roleDateMap.values()).map(item => ({
  role: item.role,
  date: this.formatDate(item.date), 
  present: item.present,
  absent: item.absent,
}));

console.log(response);

return response;
}


@Post('/user-attendance/by-dates')
async getUsersAttendanceByDates(@Body() data: any) {
  // 1️⃣ Normalize dates
  const dates: string[] = (
    Array.isArray(data.attendanceDate)
      ? data.attendanceDate
      : [data.attendanceDate]
  ).filter((d): d is string => Boolean(d));

  if (!dates.length) return [];

  // 2️⃣ Fetch attendance data (attendance DB)
  const attendanceData = await this.attendanceRepo.query(
    `
    SELECT
      "userId",
      "attendance",
      "attendanceDate"
    FROM "Attendance"
    WHERE "attendanceDate" = ANY($1::date[])
    `,
    [dates],
  );

  if (!attendanceData.length) return [];

  // 3️⃣ Extract unique userIds
 const userIds = [...new Set(attendanceData.map(a => a.userId))];


  // 4️⃣ Fetch users (default DB)
 const users = await this.userRepo.query(
  `
  SELECT
    "userId",
    "username"
  FROM "Users"
  WHERE "userId" = ANY($1::uuid[])
  `,
  [userIds],
);

  const userMap = new Map<string, string>();
  users.forEach(u => userMap.set(u.userId, u.username));

  // 5️⃣ Fetch roles (default DB)
  const userRoles = await this.getUserRolesByUserIds(userIds);

  const roleMap = new Map<string, string>();
  userRoles.forEach(r =>
    roleMap.set(r.userId, r.name),
  );
const ALLOWED_ROLES = ['Staff', 'Teacher', 'Supervisor'];

  // 6️⃣ Build final response
  return attendanceData
    .map(record => ({
      username: userMap.get(record.userId),
      rolename: roleMap.get(record.userId),
      status: record.attendance,
      date: this.formatDate(record.attendanceDate),
    }))
    .filter(
      row =>
        row.username &&
        row.rolename &&
        ALLOWED_ROLES.includes(row.rolename),
    );
}

async getUserRolesByUserIds(userIds: any) {
  return this.registrationTrackerRepo.query(
    `
    SELECT
      rg."userId",
      r."name"
    FROM "UserRolesMapping" rg
    JOIN "Roles" r
      ON r."roleId" = rg."roleId"
    WHERE rg."userId" = ANY($1::uuid[])
    `,
    [userIds],
  );
}


}
