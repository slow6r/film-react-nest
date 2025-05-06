import { Controller, Get, Param, Logger } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsListResponseDto, ScheduleListResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  private readonly logger = new Logger(FilmsController.name);

  constructor(private readonly filmsService: FilmsService) {
    this.logger.log('FilmsController instantiated');
  }

  @Get()
  async getAllFilms(): Promise<FilmsListResponseDto> {
    this.logger.log('getAllFilms method called');
    return this.filmsService.getAllFilms();
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<ScheduleListResponseDto> {
    return this.filmsService.getFilmSchedule(id);
  }
}
