import { group } from '@angular/animations';
import { HttpClient, HttpResponse } from '@angular/common/http';
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
    console.log(groupForm);

    return this.http.post(`${this.apiUrl}insert_tgroup`, groupForm, { observe: 'response' });
  }

  // public getAllGroups(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}get_all_groups`, { observe: 'response' });
  // }

  public getAllGroups(): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.apiUrl}get_all_groups`, { observe: 'response' });
  }

  public updateGroups(id: any, groupData: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.apiUrl}get_all_groups/${id}`, `${groupData}`, { observe: 'response' });
  }

  public deleteGroups(groupId: any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.apiUrl}delete_group/${groupId}`, { observe: 'response' })
  }

  public getAllLayers(): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this, this.apiUrl}layers`, { observe: 'response' })
  }

}