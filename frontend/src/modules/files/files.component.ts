import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BehaviorSubject, firstValueFrom, merge} from "rxjs";
import {IFile} from "../../common/interfaces/file.interfaces";
import {FileRepository} from "../../common/repositories/file.repository";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {SearchComponent} from "../../common/components/search/search.component";
import {FileComponent} from "./components/file/file.component";
import {LogoComponent} from "../../common/components/logo/logo.component";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {LoaderComponent} from "../../common/components/loader/loader.component";

@UntilDestroy()
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  standalone: true,
  imports: [
    SearchComponent,
    FileComponent,
    LogoComponent,
    LoaderComponent,
  ]
})
export class FilesComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public searchLine$: BehaviorSubject<string>;
  public files$: BehaviorSubject<IFile[]>;
  public filteredFiles$: BehaviorSubject<IFile[]>;

  public isUploadingFiles: boolean;
  public isDownloadingFile: Record<string, boolean>;

  constructor(
    private _fileRepository: FileRepository,
    private _router: Router,
    private _cookieService: CookieService,
  ) {
    this.files$ = new BehaviorSubject<IFile[]>([]);
    this.filteredFiles$ = new BehaviorSubject<IFile[]>([]);
    this.searchLine$ = new BehaviorSubject<string>('');
    this.isUploadingFiles = false;
    this.isDownloadingFile = {};
  }

  public async ngOnInit(): Promise<void> {
    this.initFilteringFilesByName();
    await this.initFiles();
  }

  private async initFiles(): Promise<void> {
    const files$ = this._fileRepository.pullFiles();
    const files = await firstValueFrom(files$);

    this.files$.next(files);
  }

  private initFilteringFilesByName(): void {
    merge(this.files$, this.searchLine$)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const files = this.files$.getValue();
        const searLine = this.searchLine$.getValue().toLowerCase();

        if (!searLine) {
          this.filteredFiles$.next(files);
        } else {
          const filteredFiles = files.filter(({ filename }) => filename.toLowerCase().includes(searLine));

          this.filteredFiles$.next(filteredFiles);
        }
      });
  }

  public exit(): void {
    this._cookieService.set('x-access-token', '');
    this._router.navigate(['/auth']);
  }

  public async deleteFile({ id: fileId }: IFile): Promise<void> {
    try {
      const isDeleted$ = this._fileRepository.deleteFileById(fileId);
      const isDeleted = await firstValueFrom(isDeleted$);

      if (isDeleted) {
        const files = this.files$.getValue();
        const filteredFiles = files.filter(({ id }) => id !== fileId);

        this.files$.next(filteredFiles);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      }
    }
  }

  public onUploadButtonClick(): void {
    this.fileInput.nativeElement.click(); // Открываем проводник
  }

  public async uploadFiles(event: any): Promise<void> {
    const files: File[] = Array.from(event.target.files);

    if (!files.length) {
      return;
    }

    this.isUploadingFiles = true;

    try {
      const newFiles$ = this._fileRepository.uploadFiles(files);
      const newFiles = await firstValueFrom(newFiles$);
      const currentFiles = this.files$.getValue();

      this.files$.next([...currentFiles, ...newFiles]);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      }
    }

    this.isUploadingFiles = false;
  }

  public async downloadFile({ id: fileId, filename }: IFile): Promise<void> {
    this.isDownloadingFile[fileId] = true;

    try {
      const blob$ = this._fileRepository.downloadFileById(fileId);
      const blob = await firstValueFrom(blob$);

      this.downloadBlob(filename, blob);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      }
    }

    this.isDownloadingFile[fileId] = false;
  }

  private downloadBlob(filename: string, blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;

    a.click();

    window.URL.revokeObjectURL(url);
  }
}

