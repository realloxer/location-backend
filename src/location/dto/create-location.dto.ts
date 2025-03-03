import { IsNotEmpty, IsUUID, IsOptional, IsInt } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  building: string;

  @IsNotEmpty()
  locationName: string;

  @IsNotEmpty()
  locationNumber: string;

  @IsInt()
  area: number;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
