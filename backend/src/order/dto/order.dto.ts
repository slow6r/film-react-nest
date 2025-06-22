import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateOrderRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDetailsDto)
  tickets: TicketDetailsDto[];
}

export class TicketDetailsDto {
  @IsString()
  @IsNotEmpty()
  film: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsNotEmpty()
  row: number;

  @IsNotEmpty()
  seat: number;
}

export class OrderConfirmationResponseDto {
  total: number;
  items: TicketDetailsDto[];
}
