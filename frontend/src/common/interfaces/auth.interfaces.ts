export interface IAuth {
  login: string;
  password: string;
}

export interface IUser {
  id: number;
  token: string;
  login: string;
}
