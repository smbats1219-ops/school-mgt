import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../../shared/guards/auth.guards';
import { RolesGuard } from '../../shared/guards/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;

  const serviceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const user = {
    id: 'user-1',
    username: 'ahmed',
    email: 'ahmed@example.com',
    fullName: 'Ahmed Khan',
    status: 'APPROVED',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: serviceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users with query', async () => {
    const result = { data: [user], meta: { total: 1, page: 1, limit: 10 } };
    serviceMock.findAll.mockResolvedValue(result);

    await expect(controller.findAll({ page: 1, limit: 10 })).resolves.toEqual(
      result,
    );
    expect(serviceMock.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('should return one user by id', async () => {
    serviceMock.findOne.mockResolvedValue(user);

    await expect(controller.findOne(user.id)).resolves.toEqual(user);
    expect(serviceMock.findOne).toHaveBeenCalledWith(user.id);
  });

  it('should create a user', async () => {
    const dto = {
      username: 'ahmed',
      email: 'ahmed@example.com',
      fullName: 'Ahmed Khan',
      password: 'StrongP@ss123',
    };
    serviceMock.create.mockResolvedValue(user);

    await expect(controller.create(dto)).resolves.toEqual(user);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });
});
