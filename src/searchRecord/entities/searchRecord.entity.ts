import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SearchRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  timestamp: number;

  @Column('float')
  longitude: number;

  @Column('float')
  latitude: number;

  @Column({ type: 'bigint' })
  search_time: number;

  @Column()
  count: number;
}
