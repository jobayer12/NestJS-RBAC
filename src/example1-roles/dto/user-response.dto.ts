import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';

export class UserData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'Admin', enum: Role })
  role: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  createdAt?: string;

  @ApiProperty({ example: '2024-12-24', required: false })
  lastLogin?: string;

  @ApiProperty({ example: '2024-12-24T10:30:00Z', required: false })
  updatedAt?: Date;
}

export class UserWithRoles {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: [Role.ADMIN, Role.READ], enum: Role, isArray: true })
  roles: Role[];
}

export class LoginResponseDto {
  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ example: 'token-admin' })
  token: string;

  @ApiProperty({ type: () => UserWithRoles })
  user: UserWithRoles;
}

export class UserResponseDto {
  @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ example: 'admin', required: false })
  createdBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  updatedBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  deletedBy?: string;

  @ApiProperty({ example: 'admin', required: false })
  requestedBy?: string;

  @ApiProperty({ example: [Role.ADMIN, Role.READ], enum: Role, isArray: true, required: false })
  userRoles?: Role[];

  @ApiProperty({ type: UserData })
  data: UserData;
}

export class UsersListResponseDto {
  @ApiProperty({ example: 'List of all users' })
  message: string;

  @ApiProperty({ example: 'admin' })
  requestedBy: string;

  @ApiProperty({ example: [Role.ADMIN, Role.READ], enum: Role, isArray: true })
  userRoles: Role[];

  @ApiProperty({ type: [UserData] })
  data: UserData[];
}

export class DeleteUserResponseDto {
  @ApiProperty({ example: 'User 1 deleted successfully' })
  message: string;

  @ApiProperty({ example: 'admin' })
  deletedBy: string;
}

export class DashboardStatsDto {
  @ApiProperty({ example: 150 })
  totalUsers: number;

  @ApiProperty({ example: 120 })
  activeUsers: number;

  @ApiProperty({ example: 30 })
  inactiveUsers: number;

  @ApiProperty({ example: 15 })
  newThisMonth: number;
}

export class DashboardResponseDto {
  @ApiProperty({ example: 'Admin dashboard' })
  message: string;

  @ApiProperty({ example: 'admin' })
  viewedBy: string;

  @ApiProperty({ type: DashboardStatsDto })
  stats: DashboardStatsDto;
}
