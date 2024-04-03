import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class SetAdminSuperAdminService {

  constructor(private httpClient: HttpClient) {
  }

  public getAllUser(): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getAllUser, {})
  }

  public getUserById(userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getUserById, {
      userId: userId
    })
  }

  public searchUser(searchContent: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.userSearch, {
      searchContent: searchContent
    })
  }

  public setAsAdmin(userId: number): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.setAsAdmin, {
      userId: userId
    })
  }
}
