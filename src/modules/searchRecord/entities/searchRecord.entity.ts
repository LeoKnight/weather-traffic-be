import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SearchRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  date_time: Date;

  @Column('float')
  longitude: number;

  @Column('float')
  latitude: number;

  @Column({ type: 'timestamptz' })
  search_time: Date;

  @Column()
  count: number;
}
