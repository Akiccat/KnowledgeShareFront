import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class UserEditService {

  constructor(private httpClient: HttpClient) {
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
}
