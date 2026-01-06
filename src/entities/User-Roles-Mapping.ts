import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('UserRolesMapping')
export class UserRolesMapping {
  @PrimaryGeneratedColumn({ name: 'userRoleId' })
  userRolesId: number;

  @Column({ name: 'UserID', type: 'uuid' })
  userId: string;

  @Column({ name: 'RoleID', type: 'uuid' })
  roleId: string;

  @Column({ name: 'TenantID', type: 'uuid', nullable: true })
  tenantId: string;

 
  @Column({
    name: 'CreatedAt',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    name: 'UpdatedAt',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

   @Column({ name: 'CreatedBy', type: 'varchar', length: 100, nullable: true })
  createdBy?: string;

  @Column({ name: 'UpdatedBy', type: 'varchar', length: 100, nullable: true })
  updatedBy?: string;

}