import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl: any = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getRegion(): Observable<any> {
    return this.http.get(`${this.apiUrl}api/file/getRegion`, { observe: 'response' });
  }

  public saveRegion(regionForm: any): Observable<any> {
    const formData = new FormData();
    formData.append('regionName', regionForm.regionName);
    formData.append('regionZipFile', regionForm.regionZipFile);
    return this.http.post(`${this.apiUrl}api/file/saveRegion`, formData, { observe: 'response' });
  }
}
