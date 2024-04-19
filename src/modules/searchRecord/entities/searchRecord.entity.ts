import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SearchRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  search_date_time: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ length: 255 })
  user_id: string;

  @Column({ length: 255, nullable: false })
  location: string;
}
