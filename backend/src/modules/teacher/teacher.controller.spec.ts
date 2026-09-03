import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { AuthGuard } from '../../shared/guards/auth.guards';
import { RolesGuard } from '../../shared/guards/roles.guard';

describe('TeacherController', () => {
  let controller: TeacherController;

  const serviceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const teacher = {
    id: 'teacher-1',
    firstName: 'Sara',
    lastName: 'Ali',
    email: 'sara.ali@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherService,
          useValue: serviceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get(TeacherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all teachers with query', async () => {
    const result = { data: [teacher], meta: { total: 1, page: 1, limit: 10 } };
    serviceMock.findAll.mockResolvedValue(result);

    await expect(controller.findAll({ page: 1, limit: 10 })).resolves.toEqual(
      result,
    );
    expect(serviceMock.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('should return one teacher by id', async () => {
    serviceMock.findOne.mockResolvedValue(teacher);

    await expect(controller.findOne(teacher.id)).resolves.toEqual(teacher);
    expect(serviceMock.findOne).toHaveBeenCalledWith(teacher.id);
  });

  it('should create a teacher', async () => {
    const dto = {
      firstName: 'Sara',
      lastName: 'Ali',
      email: 'sara.ali@example.com',
    };
    serviceMock.create.mockResolvedValue(teacher);

    await expect(controller.create(dto)).resolves.toEqual(teacher);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('should update a teacher', async () => {
    const updated = { ...teacher, firstName: 'Ayesha' };
    serviceMock.update.mockResolvedValue(updated);

    await expect(
      controller.update(teacher.id, { firstName: 'Ayesha' }),
    ).resolves.toEqual(updated);
    expect(serviceMock.update).toHaveBeenCalledWith(teacher.id, {
      firstName: 'Ayesha',
    });
  });

  it('should delete a teacher', async () => {
    serviceMock.remove.mockResolvedValue({
      message: 'Teacher deleted successfully',
    });

    await expect(controller.remove(teacher.id)).resolves.toEqual({
      message: 'Teacher deleted successfully',
    });
    expect(serviceMock.remove).toHaveBeenCalledWith(teacher.id);
  });
});
