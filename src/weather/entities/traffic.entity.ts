import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Traffic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_url: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({ type: 'date' })
  timestamp: Date;
}
