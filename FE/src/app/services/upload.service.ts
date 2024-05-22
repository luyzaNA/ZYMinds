import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileI} from '../shared/file';
import {Observable} from "rxjs";
import {environment} from "../shared/environment";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  uploadFile(file: File, fileData: FileI) {
    console.log('MERGE');
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fileData', JSON.stringify(fileData));

    return this.http.post<any>(environment.apiUrl + '/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getFile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/files?userId=${userId}`);
  }
}