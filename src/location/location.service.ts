import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  create(locationData: Partial<Location>) {
    const location = this.locationRepository.create(locationData);
    return this.locationRepository.save(location);
  }

  findAll() {
    return this.locationRepository.find({
      relations: ['parent', 'children'],
    });
  }

  findOne(id: string) {
    return this.locationRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
  }
}
