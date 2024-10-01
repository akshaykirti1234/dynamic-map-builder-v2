import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl: any = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public createGroup(groupForm: any): Observable<any> {
    return this.http.post(`${this.apiUrl}insert_tgroup`, groupForm, { observe: 'response' });
  }

  public getAllGroups(): Observable<any> {
    return this.http.get(`${this.apiUrl}get_all_groups`, { observe: 'response' });
  }

}
