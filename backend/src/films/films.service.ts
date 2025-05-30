import { Injectable } from '@nestjs/common';
import { FilmRepository } from '../repository/film.repository';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';
import { sprintf } from 'sprintf-js';
import {
  toFilmsListResponseDto,
  toScheduleListResponseDto,
} from './converters/film.converter';
import { FilmsListResponseDto, ScheduleListResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async getAllFilms(): Promise<FilmsListResponseDto> {
    const films = await this.filmRepository.findAll();
    return toFilmsListResponseDto(films);
  }

  async getFilmSchedule(filmId: string): Promise<ScheduleListResponseDto> {
    const film = await this.filmRepository.findById(filmId);
    if (!film) {
      throw new Error(sprintf(ERROR_MESSAGES.FILM_NOT_FOUND, filmId));
    }
    return toScheduleListResponseDto(film.schedule);
  }
}
