export class LoginResponseDto {
  message: string;
  token: string;
  user: {
    username: string;
    permissions: string[];
  };
}
