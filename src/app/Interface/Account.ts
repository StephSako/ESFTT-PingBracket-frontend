export interface TokenPayloadLogin {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface UserInterface {
  _id: number;
  username: string;
  password: string;
  exp: number;
  iat: number;
}
