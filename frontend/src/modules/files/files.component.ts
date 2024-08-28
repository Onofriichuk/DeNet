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
  public isLoadingFile: Record<string, boolean>;
  public enoughSizeForLoading = 100000000;

  constructor(
    private _fileRepository: FileRepository,
    private _router: Router,
    private _cookieService: CookieService,
  ) {
    this.files$ = new BehaviorSubject<IFile[]>([]);
    this.filteredFiles$ = new BehaviorSubject<IFile[]>([]);
    this.searchLine$ = new BehaviorSubject<string>('');
    this.isUploadingFiles = false;
    this.isLoadingFile = {};
  }

  public async ngOnInit(): Promise<void> {
    this.initFilteringFilesByName();
    await this.initFiles();
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

  private async initFiles(): Promise<void> {
    const files$ = this._fileRepository.pullFiles();
    const files = await firstValueFrom(files$);

    this.files$.next(files);
  }

  public exit(): void {
    this._cookieService.set('x-access-token', '');
    this._router.navigate(['/auth']);
  }

  public async deleteFile(file: IFile): Promise<void> {
    this.setLoadingForFile(file, true);

    try {
      const isDeleted$ = this._fileRepository.deleteFileById(file.id);
      const isDeleted = await firstValueFrom(isDeleted$);

      if (isDeleted) {
        const files = this.files$.getValue();
        const filteredFiles = files.filter(({ id }) => id !== file.id);

        this.files$.next(filteredFiles);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      }
    }

    this.setLoadingForFile(file, false);
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

  public async downloadFile(file: IFile): Promise<void> {
    this.setLoadingForFile(file, true);

    try {
      const blob$ = this._fileRepository.downloadFileById(file.id);
      const blob = await firstValueFrom(blob$);

      this.downloadBlob(file.filename, blob);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      }
    }

    this.setLoadingForFile(file, false);
  }

  public onUploadButtonClick(): void {
    this.fileInput.nativeElement.click(); // Открываем проводник
  }

  private setLoadingForFile(file: IFile, value: boolean): void {
    if (file.size > this.enoughSizeForLoading) {
      this.isLoadingFile[file.id] = value;
    }
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

