import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { AuthGuard } from '../../shared/guards/auth.guards';
import { RolesGuard } from '../../shared/guards/roles.guard';

describe('StudentController', () => {
  let controller: StudentController;

  const serviceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const student = {
    id: 'student-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '2005-06-15T00:00:00.000Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: serviceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get(StudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all students with query', async () => {
    const result = { data: [student], meta: { total: 1, page: 1, limit: 10 } };
    serviceMock.findAll.mockResolvedValue(result);

    await expect(controller.findAll({ page: 1, limit: 10 })).resolves.toEqual(
      result,
    );
    expect(serviceMock.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('should return one student by id', async () => {
    serviceMock.findOne.mockResolvedValue(student);

    await expect(controller.findOne(student.id)).resolves.toEqual(student);
    expect(serviceMock.findOne).toHaveBeenCalledWith(student.id);
  });

  it('should create a student', async () => {
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '2005-06-15',
    };
    serviceMock.create.mockResolvedValue(student);

    await expect(controller.create(dto)).resolves.toEqual(student);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should update a student', async () => {
    const updated = { ...student, firstName: 'Jane' };
    serviceMock.update.mockResolvedValue(updated);

    await expect(
      controller.update(student.id, { firstName: 'Jane' }),
    ).resolves.toEqual(updated);
    expect(serviceMock.update).toHaveBeenCalledWith(student.id, {
      firstName: 'Jane',
    });
  });

  it('should delete a student', async () => {
    serviceMock.remove.mockResolvedValue({
      message: 'Student deleted successfully',
    });

    await expect(controller.remove(student.id)).resolves.toEqual({
      message: 'Student deleted successfully',
    });
    expect(serviceMock.remove).toHaveBeenCalledWith(student.id);
  });
});
