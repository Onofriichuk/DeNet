import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {IFile} from "../../../../common/interfaces/file.interfaces";
import {LetterSelectorPipe} from "../../../../common/pipes/letter-selector.pipe";
import {LoaderComponent} from "../../../../common/components/loader/loader.component";

@Component({
  selector: 'app-file',
  templateUrl: 'file.component.html',
  styleUrls: ['file.component.scss'],
  standalone: true,
  imports: [
    LetterSelectorPipe,
    LoaderComponent
  ]
})
export class FileComponent implements OnChanges {
  @Input() file!: IFile;
  @Input() searchLine = '';
  @Input() isLoading = false;

  @Output() delete = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  public fileSize!: string;

  public ngOnChanges(changes: SimpleChanges): void {
    this.fileSize = this.getFileSize(this.file.size);
  }

  private getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);

    return `${value.toFixed(2)} ${units[i]}`;
  }
}
