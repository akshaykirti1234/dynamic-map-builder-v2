import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AreaOfInterestService {

  private apiUrl: any = environment.apiUrl;


  constructor(private http: HttpClient) { }

  public saveRegion(regionForm: any): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', regionForm.regionName);
    formData.append('layerType', String(true));
    formData.append('zipFile', regionForm.regionZipFile);
    return this.http.post(`${this.apiUrl}api/file/saveFile`, formData, { observe: 'response' });
  }

}
