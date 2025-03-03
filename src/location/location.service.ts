/* eslint-disable @typescript-eslint/no-unsafe-call */
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
    const { locationNumber, parentId } = dto;

    // Ensure parentId (if provided) is a valid UUID
    if (parentId && !isUUID(parentId)) {
      throw new BadRequestException('Invalid parent ID format.');
    }

    // Check for existing location number and valid parent in a single query
    const filteredLocations = await this.locationRepository.find({
      where: [{ locationNumber }, parentId ? { id: parentId } : {}],
    });

    const existingLocation = filteredLocations.find(
      (loc) => loc.locationNumber === locationNumber,
    );
    if (existingLocation) {
      throw new ConflictException('Location number already exists.');
    }

    const parent = parentId
      ? filteredLocations.find((loc) => loc.id === parentId)
      : null;
    if (parentId && !parent) {
      throw new NotFoundException(
        `Parent location with ID ${parentId} not found.`,
      );
    }

    // Create and save the new location
    const location = this.locationRepository.create({
      ...dto,
      parent: parent ?? null,
    });

    return this.locationRepository.save(location);
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
