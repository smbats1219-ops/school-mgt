import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { PrismaService } from '../../db/prisma.service';

describe('StudentService', () => {
  let service: StudentService;
  let prismaService: {
    student: {
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
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '2005-06-15',
  };

  const createdStudent = {
    id: 'student-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: new Date('2005-06-15'),
  };

  beforeEach(async () => {
    prismaService = {
      student: {
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
        StudentService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a student', async () => {
    prismaService.student.findUnique.mockResolvedValue(null);
    prismaService.student.create.mockResolvedValue(createdStudent);

    await expect(service.create(createDto)).resolves.toEqual(createdStudent);
    expect(prismaService.student.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        }),
      }),
    );
  });

  it('should reject duplicate email', async () => {
    prismaService.student.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(service.create(createDto)).rejects.toThrow(
      'Email already exists',
    );
    expect(prismaService.student.create).not.toHaveBeenCalled();
  });

  it('should return paginated students', async () => {
    const students = [createdStudent];
    prismaService.$transaction.mockResolvedValue([students, 1]);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.data).toEqual(students);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('should find one student by id', async () => {
    prismaService.student.findUnique.mockResolvedValue(createdStudent);

    await expect(service.findOne('student-1')).resolves.toEqual(createdStudent);
  });

  it('should throw NotFoundException for missing student', async () => {
    prismaService.student.findUnique.mockResolvedValue(null);

    await expect(service.findOne('nonexistent')).rejects.toThrow(
      'Student with ID nonexistent not found',
    );
  });

  it('should update a student', async () => {
    prismaService.student.findUnique.mockResolvedValue(createdStudent);
    prismaService.student.update.mockResolvedValue({
      ...createdStudent,
      firstName: 'Jane',
    });

    await expect(
      service.update('student-1', { firstName: 'Jane' }),
    ).resolves.toEqual(
      expect.objectContaining({ firstName: 'Jane' }),
    );
  });

  it('should delete a student', async () => {
    prismaService.student.findUnique.mockResolvedValue(createdStudent);
    prismaService.student.delete.mockResolvedValue(createdStudent);

    await expect(service.remove('student-1')).resolves.toEqual({
      message: 'Student deleted successfully',
    });
  });
});
