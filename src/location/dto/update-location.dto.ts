/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsUUID, IsString, IsInt, Min } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  locationNumber?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  building?: string;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  area?: number;
}
