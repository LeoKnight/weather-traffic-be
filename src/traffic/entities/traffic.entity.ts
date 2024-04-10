import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Geometry } from '../../type';

@Entity()
export class Traffic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  image_url: string;

  @Column('geography', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Index({ spatial: true })
  point: Geometry;

  @Column({ type: 'bigint' })
  timestamp: number;

  @Column({ type: 'timestamptz' }) // Recommended
  date_time_with_timezone: Date;
}
