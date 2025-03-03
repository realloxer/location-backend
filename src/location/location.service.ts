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
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto) {
    const { locationNumber, parentId, building } = dto;
    // Check for existing location number and valid parent in a single query
    const filteredLocations = await this.locationRepository.find({
      where: [{ locationNumber }, parentId ? { id: parentId } : {}],
    });

    // Validate location number unique
    const existingLocation = filteredLocations.find(
      (loc) => loc.locationNumber === locationNumber,
    );
    if (existingLocation) {
      throw new ConflictException('Location number already exists.');
    }

    // Validate parent existence
    const parentLocation = parentId
      ? filteredLocations.find((loc) => loc.id === parentId)
      : null;
    if (parentId && !parentLocation) {
      throw new NotFoundException(
        `Parent location with ID ${parentId} not found.`,
      );
    }

    // Validate parent and child have same building value
    if (parentLocation && parentLocation.building !== building) {
      throw new BadRequestException(
        'Parent and child location must be in the same building.',
      );
    }

    // Create and save the new location
    const location = this.locationRepository.create({
      ...dto,
      parent: parentLocation ?? null,
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

  async update(id: string, updateDto: UpdateLocationDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid location ID format.');
    }
    const { locationNumber, parentId, building, locationName, area } =
      updateDto;

    // Fetch current location and potential conflicts in a single query
    const filteredLocations = await this.locationRepository.find({
      where: [{ locationNumber }, { id: parentId }, { id }],
      relations: ['parent'],
    });

    // Find the current location
    const currentLocation = filteredLocations.find((loc) => loc.id === id);
    if (!currentLocation) {
      throw new NotFoundException(`Location with ID ${id} not found.`);
    }

    // Validate location number unique
    if (
      locationNumber &&
      filteredLocations.some(
        (loc) => loc.locationNumber === locationNumber && loc.id !== id,
      )
    ) {
      throw new ConflictException('Location number already exists.');
    }

    // Validate parent and child have same building value
    const parentLocation = parentId
      ? filteredLocations.find((loc) => loc.id === parentId)
      : null;

    if (parentId && !parentLocation) {
      throw new NotFoundException(
        `Parent location with ID ${parentId} not found.`,
      );
    }

    if (
      parentLocation &&
      (building ?? currentLocation.building) !== parentLocation.building
    ) {
      throw new BadRequestException(
        'Parent and child location must be in the same building.',
      );
    }

    // Update the location entity
    const updatedLocation = {
      ...currentLocation,
      locationNumber: locationNumber ?? currentLocation.locationNumber,
      locationName: locationName ?? currentLocation.locationName,
      building: building ?? currentLocation.building,
      area: area ?? currentLocation.area,
      parent: parentLocation ?? null,
    };

    return this.locationRepository.save(updatedLocation);
  }

  async remove(id: string) {
    await this.locationRepository.delete(id);
  }
}
