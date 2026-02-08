import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from '../application/games.service';
import { GameCategory } from '../domain/game-categories.entity';
import { GameOptions } from '../domain/game-options.entity';
import { DIFFICULTY_MODES } from '../domain/game.business-rules';
import { GetGameOptionsResponseDto } from './dto/get-game-options.dto';
import { GameStreamService } from '../application/game-stream.service';
import { GameDifficultyMode } from '../domain/game.business-rules';
import { EventEmitter } from 'events';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { Logger, MessageEvent, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GameStreamQueryDto } from './dto/game-stream-query.dto';

describe('GamesController', () => {
  let controller: GamesController;
  let gameService: jest.Mocked<GamesService>;
  let gameStreamService: jest.Mocked<GameStreamService>;

  beforeEach(async () => {
    const mockGameService = {
      getGameOptions: jest.fn(),
    };
    const mockGameStreamService = {
      validateGameStreamParams: jest.fn(),
      createGameStream: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGameService,
        },
        {
          provide: GameStreamService,
          useValue: mockGameStreamService,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    gameService = module.get(GamesService);
    gameStreamService = module.get(GameStreamService);
  });

  describe('getGameOptions', () => {
    it('게임옵션 정보를 정상적으로 응답한다.', async () => {
      const categories: GameCategory[] = [
        { id: 1, name: 'Git' },
        { id: 2, name: 'Linux' },
        { id: 3, name: 'Docker' },
      ];
      const gameOptions = GameOptions.from(categories);
      gameService.getGameOptions.mockResolvedValue(gameOptions);

      const result = await controller.getGameOptions();

      expect(result).toBeInstanceOf(GetGameOptionsResponseDto);
      expect(result).toEqual({
        categories,
        difficultyModes: DIFFICULTY_MODES,
      });
      expect(gameService.getGameOptions).toHaveBeenCalledTimes(1);
    });
  });

  describe('gameStream', () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
      mockResponse = {
        setHeader: jest.fn(),
        flushHeaders: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
      };
    });

    describe('✅ 성공 케이스', () => {
      it('유효한 카테고리와 난이도로 요청하면 게임 스트림을 반환한다.', async () => {
        const query = { categoryId: 1, difficultyMode: GameDifficultyMode.Easy };
        const mockRequest = new EventEmitter() as Request;

        const mockEvent: MessageEvent = { type: 'timer', data: { remainingSeconds: 60 } };
        gameStreamService.validateGameStreamParams.mockResolvedValue(undefined);
        gameStreamService.createGameStream.mockReturnValue(of(mockEvent));

        await controller.gameStream(query, mockRequest, mockResponse as Response);

        expect(gameStreamService.validateGameStreamParams).toHaveBeenCalledWith(query.categoryId);
        expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
        expect(mockResponse.flushHeaders).toHaveBeenCalled();
        expect(gameStreamService.createGameStream).toHaveBeenCalledWith(
          query.categoryId,
          query.difficultyMode,
          expect.any(Object),
        );
        expect(mockResponse.write).toHaveBeenCalledWith('event: timer\n');
        expect(mockResponse.write).toHaveBeenCalledWith(
          expect.stringContaining('"remainingSeconds":60'),
        );
        expect(mockResponse.end).toHaveBeenCalled();
      });
      it('게임 진행 중 연결이 종료되면 스트림을 중단하고 리소스를 정리한다.', async () => {
        const query = { categoryId: 1, difficultyMode: GameDifficultyMode.Easy };
        const mockRequest = new EventEmitter() as Request;

        const streamSubject = new Subject<MessageEvent>();
        gameStreamService.validateGameStreamParams.mockResolvedValue(undefined);
        gameStreamService.createGameStream.mockImplementation(
          (_categoryId, _difficultyMode, disconnectSignal$) => {
            return streamSubject.pipe(takeUntil(disconnectSignal$));
          },
        );

        await controller.gameStream(query, mockRequest, mockResponse as Response);

        // 스트림이 활성 상태에서 이벤트 정상 전송 확인
        streamSubject.next({ type: 'timer', data: { remainingSeconds: 60 } });
        expect(mockResponse.write).toHaveBeenCalledWith('event: timer\n');
        expect(mockResponse.end).not.toHaveBeenCalled();

        // 클라이언트 연결 종료 (브라우저 종료, 새로고침 등)
        mockRequest.emit('close');

        // 연결 종료 후 response.end() 호출되어 리소스 정리 확인
        expect(mockResponse.end).toHaveBeenCalled();

        // 연결 종료 후 추가 이벤트가 전송되지 않는지 확인
        (mockResponse.write as jest.Mock).mockClear();
        streamSubject.next({ type: 'timer', data: { remainingSeconds: 59 } });
        expect(mockResponse.write).not.toHaveBeenCalled();
      });
    });
    describe('❌ 실패 케이스', () => {
      it('categoryId를 누락하면 유효성 검증에 실패한다.', async () => {
        const dto = plainToInstance(GameStreamQueryDto, {
          difficultyMode: 'Easy',
        });

        const errors = await validate(dto);

        const categoryIdError = errors.find((e) => e.property === 'categoryId');
        expect(categoryIdError).toBeDefined();
        expect(categoryIdError!.constraints).toHaveProperty('isNotEmpty');
        expect(categoryIdError!.constraints!.isNotEmpty).toBe('categoryId 는 필수값입니다.');
      });

      it('difficultyMode를 누락하면 유효성 검증에 실패한다.', async () => {
        const dto = plainToInstance(GameStreamQueryDto, {
          categoryId: 1,
        });

        const errors = await validate(dto);

        const difficultyModeError = errors.find((e) => e.property === 'difficultyMode');
        expect(difficultyModeError).toBeDefined();
        expect(difficultyModeError!.constraints).toHaveProperty('isNotEmpty');
        expect(difficultyModeError!.constraints!.isNotEmpty).toBe(
          'difficultyMode 는 필수값입니다.',
        );
      });

      it('categoryId와 difficultyMode를 모두 누락하면 유효성 검증에 실패한다.', async () => {
        const dto = plainToInstance(GameStreamQueryDto, {});

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThanOrEqual(2);
        expect(errors.map((e) => e.property)).toEqual(
          expect.arrayContaining(['categoryId', 'difficultyMode']),
        );
      });

      it('존재하지 않는 카테고리로 요청하면 NotFoundException을 던진다.', async () => {
        const query = { categoryId: 999, difficultyMode: GameDifficultyMode.Easy };
        const mockRequest = new EventEmitter() as Request;

        gameStreamService.validateGameStreamParams.mockRejectedValue(
          new NotFoundException('존재하지 않은 카테고리 입니다.'),
        );

        await expect(
          controller.gameStream(query, mockRequest, mockResponse as Response),
        ).rejects.toThrow(NotFoundException);
        expect(mockResponse.flushHeaders).not.toHaveBeenCalled();
        expect(gameStreamService.createGameStream).not.toHaveBeenCalled();
      });
      it('스트림 도중 에러가 발생하면 Logger.error를 호출하고 연결을 종료한다.', async () => {
        const query = { categoryId: 1, difficultyMode: GameDifficultyMode.Easy };
        const mockRequest = new EventEmitter() as Request;
        const streamError = new Error('DB connection failed');

        gameStreamService.validateGameStreamParams.mockResolvedValue(undefined);
        gameStreamService.createGameStream.mockImplementation(() => {
          return new Subject<MessageEvent>().pipe((source) => {
            return new Observable((subscriber) => {
              source.subscribe(subscriber);
              subscriber.error(streamError);
            });
          });
        });

        const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

        await controller.gameStream(query, mockRequest, mockResponse as Response);

        expect(loggerSpy).toHaveBeenCalledWith(
          'Game stream error [categoryId=1, difficultyMode=Easy]',
          streamError.stack,
        );
        expect(mockResponse.end).toHaveBeenCalled();

        loggerSpy.mockRestore();
      });

      it('존재하지 않는 난이도로 요청하면 유효성 검증에 실패한다.', async () => {
        const dto = plainToInstance(GameStreamQueryDto, {
          categoryId: 1,
          difficultyMode: 'InvalidMode',
        });

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('difficultyMode');
        expect(errors[0].constraints).toHaveProperty('isEnum');
        expect(errors[0].constraints!.isEnum).toBe(
          'difficultyMode는 Easy, Normal, Hard, Random 중 하나여야 합니다.',
        );
      });
    });
  });
});
