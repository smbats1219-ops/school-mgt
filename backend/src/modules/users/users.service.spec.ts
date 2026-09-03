import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../db/prisma.service';
import { BcryptService } from '../../shared/security/bcrypt.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: {
    user: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    userRole: {
      findMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let bcryptService: { hash: jest.Mock; compare: jest.Mock };

  const createDto = {
    username: 'ahmed',
    email: 'ahmed@example.com',
    fullName: 'Ahmed Khan',
    password: 'StrongP@ss123',
  };

  const createdUser = {
    id: 'user-1',
    username: 'ahmed',
    email: 'ahmed@example.com',
    fullName: 'Ahmed Khan',
    status: 'PENDING',
  };

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      userRole: {
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    bcryptService = { hash: jest.fn(), compare: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaService },
        { provide: BcryptService, useValue: bcryptService },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with a hashed password', async () => {
    const hashedPassword = 'hashed-password';
    prismaService.user.findUnique.mockResolvedValue(null);
    bcryptService.hash.mockResolvedValue(hashedPassword);
    prismaService.user.create.mockResolvedValue(createdUser);

    await expect(service.create(createDto)).resolves.toEqual(createdUser);
    expect(bcryptService.hash).toHaveBeenCalledWith(createDto.password);
    expect(prismaService.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- jest `objectContaining` returns `any`
        data: expect.objectContaining({
          username: 'ahmed',
          email: 'ahmed@example.com',
          fullName: 'Ahmed Khan',
          passwordHash: hashedPassword,
        }),
      }),
    );
  });

  it('should reject duplicate username', async () => {
    prismaService.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(service.create(createDto)).rejects.toThrow(
      'Username already exists',
    );
    expect(prismaService.user.create).not.toHaveBeenCalled();
  });

  it('should return paginated users', async () => {
    const users = [createdUser];
    prismaService.$transaction.mockResolvedValue([users, 1]);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.data).toEqual(users);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('should find one user by id', async () => {
    prismaService.user.findUnique.mockResolvedValue(createdUser);

    await expect(service.findOne('user-1')).resolves.toEqual(createdUser);
  });

  it('should find one user by username or email', async () => {
    prismaService.user.findFirst.mockResolvedValue({
      id: 'user-1',
      passwordHash: 'hashed',
    });

    await expect(service.findByLogin('ahmed')).resolves.toEqual({
      id: 'user-1',
      passwordHash: 'hashed',
    });
  });

  it('should update a user', async () => {
    prismaService.user.findUnique.mockResolvedValue(createdUser);
    prismaService.user.update.mockResolvedValue({
      ...createdUser,
      fullName: 'Ahmed Updated',
    });

    await expect(
      service.update('user-1', { fullName: 'Ahmed Updated' }),
    ).resolves.toEqual(expect.objectContaining({ fullName: 'Ahmed Updated' }));
  });

  it('should delete a user', async () => {
    prismaService.user.findUnique.mockResolvedValue(createdUser);
    prismaService.user.delete.mockResolvedValue(createdUser);

    await expect(service.remove('user-1')).resolves.toEqual({
      message: 'User deleted successfully',
    });
  });
});
