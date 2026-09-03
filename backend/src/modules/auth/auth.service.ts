import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { BcryptService } from '../../shared/security/bcrypt.service';
import { JwtTokenService, JwtPayload } from '../../shared/security/jwt.service';
import { AuthenticatedUser } from '../../shared/interfaces/authenticated-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly bcryptService: BcryptService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByLogin(registerDto.username);

    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    const user = await this.usersService.create(registerDto);

    return {
      user,
      ...this.buildTokens(
        this.buildPayload(user.id, user.username, user.email),
      ),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByLogin(loginDto.identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.bcryptService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'APPROVED') {
      throw new UnauthorizedException(
        'Your account is not approved yet. Please contact the administrator.',
      );
    }

    await this.usersService.updateLastLogin(user.id);

    const roles = await this.usersService.findRoleKeysByUserId(user.id);

    const payload = this.buildPayload(user.id, user.username, user.email);
    payload.roles = roles;

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        roles,
      },
      ...this.buildTokens(payload),
    };
  }

  async me(authenticatedUser: AuthenticatedUser) {
    const user = await this.usersService.findOne(authenticatedUser.id);

    return {
      user,
      roles: authenticatedUser.roles ?? [],
    };
  }

  private buildPayload(
    sub: string,
    username: string,
    email: string | null,
  ): JwtPayload {
    return {
      sub,
      id: sub,
      email: email ?? undefined,
      username,
      roles: [],
    };
  }

  private buildTokens(payload: JwtPayload) {
    return {
      access_token: this.jwtTokenService.sign(payload),
    };
  }
}
