import { TicketDetailsDto } from '../dto/order.dto';
import { ISchedule } from '../../films/interfaces/film.interface';

export function toTicketDetailsDto(
  filmId: string,
  schedule: ISchedule,
  row: number,
  seat: number,
): TicketDetailsDto {
  return {
    film: filmId,
    session: schedule.id,
    row: row,
    seat: seat,
  };
}
