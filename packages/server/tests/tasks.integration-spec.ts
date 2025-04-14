import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../src/tasks/tasks.service';
import { TasksRepository } from '../src/tasks/tasks.repository';
import { TasksMapper } from '../src/tasks/tasks.mapper';
import { ChiselModule } from '../src/chisel/chisel.module';
import { Task } from '../src/_utils/models/root/task';
import { CreateTaskDto } from '../src/tasks/dto/request/create-task.dto';
import { UpdateTaskDto } from '../src/tasks/dto/request/update-task.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { DEFAULT_DB_PATH } from '../src/_utils/constants/database.constant';
import * as fs from 'fs';
import * as path from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { QueryOptionsDto } from '../src/dynamic-queries/_utils/dto/request/query-options.dto';
import {
  describe,
  it,
  beforeEach,
  expect,
  jest,
  beforeAll,
  afterAll,
} from '@jest/globals';

jest.mock('../src/tasks/tasks.module');

describe('TasksService Integration Test', () => {
  let tasksService: TasksService;
  let tasksRepository: TasksRepository;
  let eventEmitter: EventEmitter2;
  let moduleRef: TestingModule;
  const testDbPath = path.join(DEFAULT_DB_PATH, 'test');

  const mockTask = {
    id: 1,
    content: 'Test task',
    due_date: new Date().toISOString(),
    assignee: 'test.user@example.com',
    priority: 'medium',
    progress: 0,
    is_completed: false,
  };

  beforeAll(async () => {
    if (!fs.existsSync(testDbPath)) {
      fs.mkdirSync(testDbPath, { recursive: true });
    }

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ isGlobal: true }),
        ChiselModule.forRootAsync({
          uri: testDbPath,
          dbName: 'test_tasks',
          migrations: [],
        }),
        ChiselModule.forFeature(Task),
      ],
      providers: [
        TasksService,
        TasksRepository,
        TasksMapper,
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
            onAny: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    tasksRepository = moduleRef.get<TasksRepository>(TasksRepository);
    eventEmitter = moduleRef.get<EventEmitter2>(EventEmitter2);
  });

  afterAll(async () => {
    await moduleRef.close();
    fs.rmSync(testDbPath, { recursive: true, force: true });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTasks', () => {
    it('should return mapped tasks when tasks exist', async () => {
      jest
        .spyOn(tasksRepository, 'findAllTasks')
        .mockReturnValue([mockTask as Task]);

      const result = tasksService.listTasks(new QueryOptionsDto());

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].content).toEqual(mockTask.content);
      expect(tasksRepository.findAllTasks).toHaveBeenCalled();
    });

    it('should return undefined when no tasks exist', async () => {
      jest.spyOn(tasksRepository, 'findAllTasks').mockReturnValue(null);

      const result = tasksService.listTasks(new QueryOptionsDto());

      expect(result).toBeUndefined();
      expect(tasksRepository.findAllTasks).toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should create a task and emit an event', async () => {
      const createTaskDto: CreateTaskDto = {
        content: 'New test task',
        dueDate: new Date().toISOString(),
        priority: 'high',
      };

      jest
        .spyOn(tasksRepository, 'createTask')
        .mockReturnValue({ id: 1 } as any);
      jest.spyOn(tasksRepository, 'findTaskById').mockReturnValue({
        id: 1,
        content: createTaskDto.content,
        due_date: createTaskDto.dueDate,
        priority: createTaskDto.priority,
      } as Task);

      const result = await tasksService.createTask(createTaskDto);

      expect(result).toBeDefined();
      expect(result.content).toEqual(createTaskDto.content);
      expect(tasksRepository.createTask).toHaveBeenCalledWith(createTaskDto);
      expect(tasksRepository.findTaskById).toHaveBeenCalledWith(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'task.created',
        expect.any(Object),
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task and emit an event', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        content: 'Updated task content',
        isCompleted: true,
      };

      jest.spyOn(tasksRepository, 'updateTaskById').mockReturnValue(undefined);
      jest.spyOn(tasksRepository, 'findTaskById').mockReturnValue({
        id: taskId,
        content: updateTaskDto.content,
        is_completed: updateTaskDto.isCompleted,
        progress: 100,
      } as Task);

      const result = await tasksService.updateTask(taskId, updateTaskDto);

      expect(result).toBeDefined();
      expect(result.content).toEqual(updateTaskDto.content);
      expect(result.isCompleted).toEqual(updateTaskDto.isCompleted);
      expect(tasksRepository.updateTaskById).toHaveBeenCalledWith(
        taskId,
        updateTaskDto,
      );
      expect(tasksRepository.findTaskById).toHaveBeenCalledWith(taskId);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'task.updated',
        expect.any(Object),
      );
    });
  });

  // describe('deleteTask', () => {
  //   it('should delete a task and emit an event', async () => {
  //     const taskId = 1;

  //     jest.spyOn(tasksRepository, 'deleteTaskById').mockReturnValue(undefined);

  //     const result = await tasksService.deleteTask(taskId);

  //     expect(result).toEqual(taskId);
  //     expect(tasksRepository.deleteTaskById).toHaveBeenCalledWith(taskId);
  //     expect(eventEmitter.emit).toHaveBeenCalledWith(
  //       'task.deleted',
  //       expect.any(Object),
  //     );
  //   });
  // });

  // describe('getOneTask', () => {
  //   it('should throw a not implemented error', async () => {
  //     await expect(tasksService.getOneTask({ id: 1 })).rejects.toThrow(
  //       'Method not implemented.',
  //     );
  //   });
  // });

  // describe('getPaginatedTasks', () => {
  //   it('should return all tasks from repository', async () => {
  //     jest
  //       .spyOn(tasksRepository, 'findAllTasks')
  //       .mockReturnValue([mockTask as Task]);

  //     const result = await tasksService.getPaginatedTasks({});

  //     expect(result).toEqual([mockTask]);
  //     expect(tasksRepository.findAllTasks).toHaveBeenCalled();
  //   });
  // });
});
