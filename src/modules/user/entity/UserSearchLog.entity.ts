import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('idx_created_date', ['created_date'])
@Index('idx_location', ['location'])
@Index('idx_userid', ['user_id'])
@Entity()
export class UserSearchLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  search_date_time: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ length: 255 })
  user_id: string;

  @Column({ length: 255, nullable: true })
  location: string;
}
