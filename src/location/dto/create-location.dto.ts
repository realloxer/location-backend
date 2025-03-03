/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  building: string;

  @IsNotEmpty()
  locationName: string;

  @IsNotEmpty()
  locationNumber: string;

  @IsInt()
  @Min(0)
  area: number;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
