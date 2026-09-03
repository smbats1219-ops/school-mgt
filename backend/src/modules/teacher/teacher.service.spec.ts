import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { PrismaService } from '../../db/prisma.service';

describe('TeacherService', () => {
  let service: TeacherService;
  let prismaService: {
    teacher: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const createDto = {
    firstName: 'Sara',
    lastName: 'Ali',
    email: 'sara.ali@example.com',
  };

  const createdTeacher = {
    id: 'teacher-1',
    firstName: 'Sara',
    lastName: 'Ali',
    email: 'sara.ali@example.com',
  };

  beforeEach(async () => {
    prismaService = {
      teacher: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get(TeacherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a teacher', async () => {
    prismaService.teacher.findUnique.mockResolvedValue(null);
    prismaService.teacher.create.mockResolvedValue(createdTeacher);

    await expect(service.create(createDto)).resolves.toEqual(createdTeacher);
    expect(prismaService.teacher.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          firstName: 'Sara',
          lastName: 'Ali',
          email: 'sara.ali@example.com',
        }),
      }),
    );
  });

  it('should reject duplicate email', async () => {
    prismaService.teacher.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(service.create(createDto)).rejects.toThrow(
      'Email already exists',
    );
    expect(prismaService.teacher.create).not.toHaveBeenCalled();
  });

  it('should return paginated teachers', async () => {
    const teachers = [createdTeacher];
    prismaService.$transaction.mockResolvedValue([teachers, 1]);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.data).toEqual(teachers);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('should find one teacher by id', async () => {
    prismaService.teacher.findUnique.mockResolvedValue(createdTeacher);

    await expect(service.findOne('teacher-1')).resolves.toEqual(createdTeacher);
  });

  it('should throw NotFoundException for missing teacher', async () => {
    prismaService.teacher.findUnique.mockResolvedValue(null);

    await expect(service.findOne('nonexistent')).rejects.toThrow(
      'Teacher with ID nonexistent not found',
    );
  });

  it('should update a teacher', async () => {
    prismaService.teacher.findUnique.mockResolvedValue(createdTeacher);
    prismaService.teacher.update.mockResolvedValue({
      ...createdTeacher,
      firstName: 'Ayesha',
    });

    await expect(
      service.update('teacher-1', { firstName: 'Ayesha' }),
    ).resolves.toEqual(expect.objectContaining({ firstName: 'Ayesha' }));
  });

  it('should delete a teacher', async () => {
    prismaService.teacher.findUnique.mockResolvedValue(createdTeacher);
    prismaService.teacher.delete.mockResolvedValue(createdTeacher);

    await expect(service.remove('teacher-1')).resolves.toEqual({
      message: 'Teacher deleted successfully',
    });
  });
});
