import {Pipe} from "@angular/core";

@Pipe({
  standalone: true,
  name: 'letterSelector'
})
export class LetterSelectorPipe {
  public transform(value: string, predicate: string): string {
    return value.replace(new RegExp(predicate, 'gi'), `<mark>${predicate}</mark>`);
  }
}
