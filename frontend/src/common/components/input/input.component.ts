import { Component, EventEmitter, Input, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class InputComponent {
  @Input() placeholder!: string;
  @Input() error!: string | null;

  @Output() inputChange = new EventEmitter<string>();

  public isFocused: boolean;
  public value: string;

  constructor() {
    this.isFocused = false;
    this.value = '';
  }

  public onFocus(): void {
    this.isFocused = true;
  }

  public onBlur(): void {
    if (!this.value) {
      this.isFocused = false;
    }
  }
}
