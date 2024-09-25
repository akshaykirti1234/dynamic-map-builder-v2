import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private apiUrl: any = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getLayers(): Observable<any> {
    return this.http.get(`${this.apiUrl}api/file/getLayers`, { observe: 'events' });
  }

  public saveLayer(layerForm: any): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', layerForm.layerName);
    formData.append('layerType', String(false));
    formData.append('zipFile', layerForm.layerZipFile);
    return this.http.post(`${this.apiUrl}api/file/saveFile`, formData, {
      observe: 'response',
    });
  }

  // ----------------- Delete Layer-----------------------------
  public deleteLayer(id: Number, type: Boolean): Observable<any> {
    return this.http.delete(`${this.apiUrl}api/file/deleteLayer/${id}/${type}`, { observe: 'response' });
  }

}
