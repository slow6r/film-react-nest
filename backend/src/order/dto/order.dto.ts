import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDateString,
  Matches,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class TicketDetailsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(UUID_REGEX, { message: 'film must be a valid UUID' })
  film: string;

  @IsString()
  @IsNotEmpty()
  @Matches(UUID_REGEX, { message: 'session must be a valid UUID' })
  session: string;

  @IsDateString()
  @IsNotEmpty()
  daytime: string;

  @IsNumber()
  @IsNotEmpty()
  row: number;

  @IsNumber()
  @IsNotEmpty()
  seat: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  day?: string;

  @IsOptional()
  @IsString()
  time?: string;
}

export class CreateOrderRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDetailsDto)
  tickets: TicketDetailsDto[];
}

export class OrderConfirmationResponseDto {
  total: number;
  items: TicketDetailsDto[];
}
