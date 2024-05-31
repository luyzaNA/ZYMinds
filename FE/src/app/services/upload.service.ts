import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileI} from '../shared/file';
import {Observable} from "rxjs";
import {environment} from "../shared/environment";
import {User} from "../shared/user";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  uploadFile(file: File, fileData: FileI) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fileData', JSON.stringify(fileData));
    return this.http.post<any>(environment.apiUrl + '/upload', formData, {
      observe: 'events'
    });
  }
  getFiles(userId: string, context: string): Observable<FileI[]> {
    return this.http.get<FileI[]>(`${this.baseUrl}/files/${userId}/${context}`);
  }

  deleteFile(fileId: string): Observable<FileI> {
    return this.http.delete<FileI>(`${this.baseUrl}/files/${fileId}`);
  }

  updateFile(fileId: string, file: File, fileData: FileI): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fileData', JSON.stringify(fileData));
    return this.http.put<"any">(`${this.baseUrl}/files/update/${fileId}`, formData,
    {
      observe: 'events'
    })
  }

}
