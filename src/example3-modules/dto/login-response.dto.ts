export class LoginResponseDto {
  message: string;
  token: string;
  user: {
    username: string;
    role: string;
    permissions: string[];
  };
}
