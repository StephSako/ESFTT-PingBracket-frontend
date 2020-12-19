export interface TokenPayloadLogin {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  success: boolean;
  message: string;
}

export interface UserInterface {
  _id: number;
  username: string;
  password: string;
  exp: number;
  iat: number;
}
