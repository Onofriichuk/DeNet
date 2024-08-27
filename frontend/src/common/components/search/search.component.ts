import {Component, EventEmitter, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();

  public isFocused = false;
  public value: string = '';

  public onFocus(): void {
    this.isFocused = true;
  }

  public onBlur(): void {
    if (!this.value) {
      this.isFocused = false;
    }
  }
}
