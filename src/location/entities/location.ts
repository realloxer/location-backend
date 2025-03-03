import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'building' })
  building: string;

  @Column({ type: 'text', name: 'location_name' })
  locationName: string;

  @Column({ type: 'text', name: 'location_number', unique: true })
  locationNumber: string;

  @Column({ type: 'int' })
  area: number;

  // If the parent location is deleted, all child locations will be deleted also.
  @ManyToOne(() => Location, (location) => location.children, {
    onDelete: 'CASCADE',
  })
  parent: Location | null;

  @OneToMany(() => Location, (location) => location.parent)
  children: Location[];
}
