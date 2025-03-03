import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from './entities/location';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

const locationId = '10eec6f4-2e1d-4e4a-844f-95996dc43b6d';
const mockLocation: Location = {
  id: locationId,
  locationNumber: 'LOC-001',
  locationName: 'Warehouse A',
  building: 'Building A',
  area: 100,
  parent: null,
  children: [],
};

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('successfully create a new location', async () => {
      const dto: CreateLocationDto = {
        locationNumber: 'LOC-002',
        locationName: 'Warehouse B',
        building: 'Building A',
        area: 9,
      };

      mockRepository.find.mockResolvedValue([]);
      mockRepository.create.mockReturnValue(mockLocation);
      mockRepository.save.mockResolvedValue(mockLocation);

      const result = await service.create(dto);

      expect(result).toEqual(mockLocation);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Array),
        }),
      );
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('throw ConflictException if location number already exists', async () => {
      const dto: CreateLocationDto = {
        locationNumber: 'LOC-001',
        locationName: 'Duplicate Warehouse',
        building: 'Building A',
        area: 9,
      };

      mockRepository.find.mockResolvedValue([mockLocation]);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne()', () => {
    it('return the location by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockLocation);

      const result = await service.findOne(locationId);

      expect(result).toEqual(mockLocation);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: locationId },
        relations: ['parent', 'children'],
      });
    });

    it('throw BadRequestException if ID is invalid', async () => {
      await expect(service.findOne('invalid-uuid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update()', () => {
    it('successfully update a location', async () => {
      const dto: UpdateLocationDto = { locationName: 'Updated Name' };

      mockRepository.find.mockResolvedValue([mockLocation]);
      mockRepository.save.mockResolvedValue({
        ...mockLocation,
        ...dto,
      });

      const result = await service.update(locationId, dto);

      expect(result.locationName).toBe('Updated Name');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
