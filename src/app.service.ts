import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { UserRolesMapping } from './entities/User-Roles-Mapping';
import { Roles } from './entities/role.entity';

@Injectable()
export class AppService {
constructor(
    // 🔹 Attendance DB
    @InjectRepository(Attendance, 'attendance')
    private readonly attendanceRepo: Repository<Attendance>,

    // 🔹 Default DB
    @InjectRepository(UserRolesMapping)
    private readonly registrationTrackerRepo: Repository<UserRolesMapping>,

    @InjectRepository(Roles)
    private readonly rolesRepo: Repository<Roles>,
  ) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  async fetchAttendanceData(dates: string[]){
   return await this.attendanceRepo.query(
    `
    SELECT *
    FROM "Attendance"
    WHERE "attendanceDate" = ANY($1::date[])
    `,
    [dates], // ✅ MUST be wrapped
  );

  }
   
   // (Optional) role fetch remains if needed later
  async getUserRolesByUserIds(userIds:any) {
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
