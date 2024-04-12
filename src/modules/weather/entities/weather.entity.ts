import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  valid_period_start: Date;

  @Column()
  valid_period_end: Date;

  @Column()
  forecast: string;

  @Column('geography', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Column({ type: 'bigint' })
  timestamp: number;

  @Column({ type: 'timestamptz' }) // Recommended
  date_time_with_timezone: Date;
}
