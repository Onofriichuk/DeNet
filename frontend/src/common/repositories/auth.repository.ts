import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SERVER_API_URL} from "../../configs/http.config";
import {IAuth, IUser} from "../interfaces/auth.interfaces";

@Injectable({providedIn: "root"})
export class AuthRepository {
  constructor(private _http: HttpClient) {
  }

  public registration(user: IAuth): Observable<IUser> {
    return this._http.post<IUser>(`${SERVER_API_URL}/auth/registration`, user);
  }

  public login(user: IAuth): Observable<IUser> {
    return this._http.post<IUser>(`${SERVER_API_URL}/auth/login`, user);
  }
}
