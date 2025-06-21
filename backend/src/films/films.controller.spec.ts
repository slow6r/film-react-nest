import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsListResponseDto, ScheduleListResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    getAllFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  const mockFilmsResponse: FilmsListResponseDto = {
    total: 2,
    items: [
      {
        id: '1',
        title: 'Test Film 1',
        rating: 8.5,
        director: 'Test Director',
        tags: ['action', 'drama'],
        about: 'Test about',
        description: 'Test description',
        image: 'test-image.jpg',
        cover: 'test-cover.jpg',
      },
      {
        id: '2',
        title: 'Test Film 2',
        rating: 7.8,
        director: 'Another Director',
        tags: ['comedy'],
        about: 'Another about',
        description: 'Another description',
        image: 'test-image-2.jpg',
        cover: 'test-cover-2.jpg',
      },
    ],
  };

  const mockScheduleResponse: ScheduleListResponseDto = {
    total: 3,
    items: [
      {
        id: 'schedule1',
        daytime: '10:00',
        hall: 1,
        rows: 10,
        seats: 100,
        price: 500,
        taken: ['A1', 'A2'],
      },
      {
        id: 'schedule2',
        daytime: '14:00',
        hall: 2,
        rows: 12,
        seats: 120,
        price: 600,
        taken: ['B5'],
      },
      {
        id: 'schedule3',
        daytime: '18:00',
        hall: 1,
        rows: 10,
        seats: 100,
        price: 700,
        taken: [],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFilms', () => {
    it('should return all films', async () => {
      // Arrange
      mockFilmsService.getAllFilms.mockResolvedValue(mockFilmsResponse);

      // Act
      const result = await controller.getAllFilms();

      // Assert
      expect(service.getAllFilms).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFilmsResponse);
      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].title).toBe('Test Film 1');
      expect(result.items[1].title).toBe('Test Film 2');
    });

    it('should return empty films list when no films exist', async () => {
      // Arrange
      const emptyResponse: FilmsListResponseDto = {
        total: 0,
        items: [],
      };
      mockFilmsService.getAllFilms.mockResolvedValue(emptyResponse);

      // Act
      const result = await controller.getAllFilms();

      // Assert
      expect(service.getAllFilms).toHaveBeenCalledTimes(1);
      expect(result).toEqual(emptyResponse);
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('should handle service errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockFilmsService.getAllFilms.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getAllFilms()).rejects.toThrow(
        'Database connection failed',
      );
      expect(service.getAllFilms).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFilmSchedule', () => {
    it('should return film schedule for valid film ID', async () => {
      // Arrange
      const filmId = '1';
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockScheduleResponse);

      // Act
      const result = await controller.getFilmSchedule(filmId);

      // Assert
      expect(service.getFilmSchedule).toHaveBeenCalledWith(filmId);
      expect(service.getFilmSchedule).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockScheduleResponse);
      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(3);
      expect(result.items[0].daytime).toBe('10:00');
      expect(result.items[1].daytime).toBe('14:00');
      expect(result.items[2].daytime).toBe('18:00');
    });

    it('should return empty schedule when film has no schedules', async () => {
      // Arrange
      const filmId = '999';
      const emptySchedule: ScheduleListResponseDto = {
        total: 0,
        items: [],
      };
      mockFilmsService.getFilmSchedule.mockResolvedValue(emptySchedule);

      // Act
      const result = await controller.getFilmSchedule(filmId);

      // Assert
      expect(service.getFilmSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(emptySchedule);
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('should handle film not found error', async () => {
      // Arrange
      const filmId = 'nonexistent';
      const error = new Error(`Film with id ${filmId} not found`);
      mockFilmsService.getFilmSchedule.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getFilmSchedule(filmId)).rejects.toThrow(
        `Film with id ${filmId} not found`,
      );
      expect(service.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });

    it('should handle service errors', async () => {
      // Arrange
      const filmId = '1';
      const error = new Error('Database error');
      mockFilmsService.getFilmSchedule.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getFilmSchedule(filmId)).rejects.toThrow(
        'Database error',
      );
      expect(service.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });

    it('should validate schedule data structure', async () => {
      // Arrange
      const filmId = '1';
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockScheduleResponse);

      // Act
      const result = await controller.getFilmSchedule(filmId);

      // Assert
      expect(result.items[0]).toHaveProperty('id');
      expect(result.items[0]).toHaveProperty('daytime');
      expect(result.items[0]).toHaveProperty('hall');
      expect(result.items[0]).toHaveProperty('rows');
      expect(result.items[0]).toHaveProperty('seats');
      expect(result.items[0]).toHaveProperty('price');
      expect(result.items[0]).toHaveProperty('taken');
      expect(Array.isArray(result.items[0].taken)).toBe(true);
    });
  });

  describe('Controller integration', () => {
    it('should handle multiple concurrent requests', async () => {
      // Arrange
      mockFilmsService.getAllFilms.mockResolvedValue(mockFilmsResponse);
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockScheduleResponse);

      // Act
      const [filmsResult, scheduleResult] = await Promise.all([
        controller.getAllFilms(),
        controller.getFilmSchedule('1'),
      ]);

      // Assert
      expect(filmsResult).toEqual(mockFilmsResponse);
      expect(scheduleResult).toEqual(mockScheduleResponse);
      expect(service.getAllFilms).toHaveBeenCalledTimes(1);
      expect(service.getFilmSchedule).toHaveBeenCalledTimes(1);
    });
  });
});
