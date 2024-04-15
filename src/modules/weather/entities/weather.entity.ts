import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Geometry } from 'src/type';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id?: number;

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
  point: Geometry;

  @Column({ type: 'timestamptz' })
  date_time: Date;
}
