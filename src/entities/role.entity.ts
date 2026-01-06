import { Entity,  Column, PrimaryColumn } from 'typeorm';

@Entity('Roles')
export class Roles {
  
@PrimaryColumn('uuid', { name: 'roleId' })
    roleId: string;
    
 @Column({ name: 'name', type: 'varchar' })
  name: string;

 @Column({ name: 'code', type: 'varchar' })
  code: string;

  @Column({
      name: 'createdAt',
      type: 'timestamp',
      nullable: true,
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt?: Date;

    @Column({
        name: 'updatedAt',
        type: 'timestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
      })
      updatedAt?: Date;

        @Column({ name: 'createdBy', type: 'varchar', length: 100, nullable: true })
  createdBy?: string;

  @Column({ name: 'updatedBy', type: 'varchar', length: 100, nullable: true })
  updatedBy?: string;
}