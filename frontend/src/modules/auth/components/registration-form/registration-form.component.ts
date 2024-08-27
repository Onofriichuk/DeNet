import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {IAuth} from "../../../../common/interfaces/auth.interfaces";
import {BehaviorSubject, map, skip} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {validateLogin, validatePassword} from "../../../../common/utils/input-validators.utils";
import {InputComponent} from "../../../../common/components/input/input.component";
import {HttpClientModule} from "@angular/common/http";

@UntilDestroy()
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  standalone: true,
  imports: [
    HttpClientModule,
    InputComponent
  ]
})
export class RegistrationFormComponent implements OnInit {
  @Output() registration = new EventEmitter<IAuth>();
  @Output() switchOnLogin = new EventEmitter<void>();

  public login$: BehaviorSubject<string>;
  public password$: BehaviorSubject<string>;

  public loginError$: BehaviorSubject<string | null>;
  public passwordError$: BehaviorSubject<string | null>;

  constructor() {
    this.login$ = new BehaviorSubject<string>('');
    this.password$ = new BehaviorSubject<string>('');

    this.loginError$ = new BehaviorSubject<string | null>(null);
    this.passwordError$ = new BehaviorSubject<string | null>(null);
  }

  public ngOnInit(): void {
    this.initSearchingInputError();
  }

  private initSearchingInputError(): void {
    this.login$.pipe(
      untilDestroyed(this),
      skip(1),
      map(validateLogin)
    ).subscribe(error => this.loginError$.next(error));

    this.password$.pipe(
      untilDestroyed(this),
      skip(1),
      map(validatePassword),
    ).subscribe(error => this.passwordError$.next(error));
  }

  public isDisabled() {
    return !!this.passwordError$.getValue() ||
      !!this.loginError$.getValue() ||
      !this.login$.getValue() ||
      !this.password$.getValue();
  }


  public handleClickLogin(): void {
    this.registration.emit({
      login: this.login$.getValue(),
      password: this.password$.getValue(),
    });
  }
}
