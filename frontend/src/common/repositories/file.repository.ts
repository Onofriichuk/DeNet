import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {SERVER_API_URL} from "../../configs/http.config";
import {IFile} from "../interfaces/file.interfaces";

@Injectable({providedIn: "root"})
export class FileRepository {
  constructor(private _http: HttpClient) {}

  public pullFiles(): Observable<IFile[]> {
    return this._http.get<IFile[]>(`${SERVER_API_URL}/files`);
  }

  public deleteFileById(id: number): Observable<boolean> {
    return this._http.delete<boolean>(`${SERVER_API_URL}/files/${id}/delete`);
  }

  public uploadFiles(files: File[]): Observable<IFile[]> {
    const formData = new FormData();

    files.forEach((file: File) => formData.append('file', file));

    return this._http.post<IFile[]>(
      `${SERVER_API_URL}/files/upload`,
      formData,
    );
  }

  public downloadFileById(id: number): Observable<Blob> {
    return this._http.get(
      `${SERVER_API_URL}/files/${id}/download`,
      {
        responseType: 'blob',
        observe: 'body',
      }
    );
  }
}
