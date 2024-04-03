import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class UserControlAdminService {

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

  public editUser(userId: string, userName: string, email: string, birthday: string, grade: string, interest: string, introduction: string, gender: number, password: string, confirmPassword: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.editUser, {
      userId: userId,
      userName: userName,
      email: email,
      birthday: birthday,
      grade: grade,
      interest: interest,
      introduction: introduction,
      gender: gender,
      password: password,
      confirmPassword: confirmPassword
    });
  }

  public searchUser(searchContent: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.userSearch, {
      searchContent: searchContent
    })
  }

  public banUser(userId: number, deleteFlag: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.banUser, {
      deleteFlag: deleteFlag,
      userId: userId
    })
  }

  public unbanUser(userId: number, deleteFlag: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.banUser, {
      deleteFlag: deleteFlag,
      userId: userId
    })
  }
}
