import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private apiUrl: any = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public createTable(groupForm: any): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', groupForm.tableName);
    formData.append('zipFile', groupForm.shapeFile);
    return this.http.post(`${this.apiUrl}save_tlayer_source`, groupForm, { observe: 'response' });
  }

  public getTables(): Observable<any> {
    return this.http.get(`${this.apiUrl}get_all_tlayer_source`, { observe: 'response' });
  }

}
