import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto) {
    const existingLocation = await this.locationRepository.findOne({
      where: { locationNumber: dto.locationNumber },
    });
    if (existingLocation) {
      throw new ConflictException('Location number already exists.');
    }
    return this.locationRepository.save(dto);
  }

  findAll() {
    return this.locationRepository.find({
      relations: ['parent', 'children'],
    });
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid location ID format.');
    }
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found.`);
    }
    return location;
  }

  async update(id: string, updateData: Partial<Location>) {
    await this.locationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.locationRepository.delete(id);
  }
}
