import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private apiUrl: any = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createTable(formData: FormData) {
    return this.http.post(`${this.apiUrl}save_tlayer_source`, formData);
  }

  appendTable(formData: FormData) {
    return this.http.post(`${this.apiUrl}append_shapefile_data`, formData);
  }

  public getTables(): Observable<any> {
    return this.http.get(`${this.apiUrl}get_all_tlayer_source`, { observe: 'response' });
  }

  public getTablesByGroupId(id: any) {
    return this.http.get<any>(`${this.apiUrl}get_table_names/${id}`, { observe: 'response' });
  }

  public getVectorTypeByTableId(id: any) {
    return this.http.post<any>(`${this.apiUrl}get-vectorType-byTable-id/${id}`, { observe: 'response' })
  }

}
