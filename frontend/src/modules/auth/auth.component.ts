import { Component} from "@angular/core";
import {AuthRepository} from "../../common/repositories/auth.repository";
import {firstValueFrom, Observable} from "rxjs";
import {IAuth, IUser} from "../../common/interfaces/auth.interfaces";
import {Router} from "@angular/router";
import {RegistrationFormComponent} from "./components/registration-form/registration-form.component";
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {LogoComponent} from "../../common/components/logo/logo.component";
import {HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [
    RegistrationFormComponent,
    LoginFormComponent,
    LogoComponent,
    HttpClientModule
  ],
})
export class AuthComponent {
  public activeForm: 'login' | 'registration';

  constructor(
    private _authRepository: AuthRepository,
    private _router: Router,
    private _cookieService: CookieService,
  ) {
    this.activeForm = 'login';
  }

  public switchActiveForm() {
    this.activeForm = this.activeForm === 'login' ? 'registration' : 'login';
  }

  public login(form: IAuth): void {
    this.auth(form, (form) => this._authRepository.login(form)).then();
  }

  public async registration(form: IAuth): Promise<void> {
    this.auth(form, (form) => this._authRepository.registration(form)).then();
  }

  public async auth(form: IAuth, request: (form: IAuth) => Observable<IUser>): Promise<void> {
    try {
      const user$ = request(form);
      const user = await firstValueFrom(user$)

      this._cookieService.set('x-access-token', user.token);

      this._router.navigate(['/files']).then();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      }
    }
  }
}
