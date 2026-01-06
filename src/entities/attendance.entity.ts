import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'Attendance' })
export class Attendance{
  @PrimaryColumn('uuid')
  attendanceId: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;


  @Column({ type: 'uuid', nullable: true })
  tenantId?: string;

  @Column({ type: 'uuid', nullable: true })
  contextId?: string;

  @Column({ type: 'varchar', nullable: true })
  context?: string;

  @Column({ type: 'date', nullable: true })
  attendanceDate?: Date;


  @Column({ type: 'varchar', nullable: true })
  latitude?: string;
  
  @Column({ type: 'varchar', nullable: true })
  longitude?: string;

  
  @Column({ name: 'attendance' })
  attendance: 'present' | 'absent';
  

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'varchar', nullable: true })
  metaData?: string;

  @Column({ type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  scope?: string;

  @Column({ type: 'varchar', nullable: true })
  lateMark?: string;
  
  @Column({ type: 'varchar', nullable: true })
  syncTime?: string;
  
  @Column({ type: 'varchar', nullable: true })
  session?: string;

  @Column({ type: 'varchar', nullable: true })
  absentReason?: string;

  @Column({ type: 'boolean', nullable: true })
  validLocation?: boolean;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;
}
