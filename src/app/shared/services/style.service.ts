import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  private apiUrl: any = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public saveStyle(styleName: any, layerName: any) {
    return this.http.post(`${this.apiUrl}styleGeoserver/${styleName}/${layerName}`, { observe: 'response' });
  }
}
