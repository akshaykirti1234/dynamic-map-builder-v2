import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LayerService {
  private apiUrl: any = environment.apiUrl;
  constructor(private http: HttpClient) { }


  public saveLayer(layerInfo: any) {
    return this.http.post(`${this.apiUrl}save-layer`, layerInfo, { observe: 'response' });
  }

  public getTableData() {
    return this.http.get(`${this.apiUrl}fetch-all-layer-data`, { observe: 'response' });
  }


  public publishLayer(id: any) {
    alert(id)
    return this.http.post(`${this.apiUrl}publish-layer/${id}`, { observ: 'response' })
  }

  public fetchStyles() {
    return this.http.get<{ styles: string[] }>('http://localhost:8000/geoserver/styles')
  }

  public deleteLayer(layerId: any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.apiUrl}deleteLayerData/${layerId}`, { observe: 'response' })
  }

  getLayerColumns(layerName: string) {
    //const url = `http://localhost:8000/geoserver/layers/${layerName}`; 
    return this.http.get<any>(`${this.apiUrl}layers/${layerName}`);
  }

}
