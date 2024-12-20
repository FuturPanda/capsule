import { IsArray, IsString } from 'class-validator';

export class GroupByOptionsDto {
  @IsArray()
  @IsString({ each: true })
  fields: string[];
}
