import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";
import {User} from "./user.model";

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 登录
   *
   * @param {string} userName
   * @param {string} password
   * @return {*}  {Observable<HttpResult>}
   * @memberof Login-MyService
   */
  public login(userName: string, password: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.login, {
      userName: userName,
      password: password,
    });
  }

  public register(userName: string, confirmPassword: string, password: string, email: string, birthday: Date, gender: number, grade: string, interest: string, introduction: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.register, {
      userName: userName,
      password: password,
      confirmPassword: confirmPassword,
      email: email,
      birthday: birthday,
      gender: gender,
      grade: grade,
      interest: interest,
      introduction: introduction
    });
  }
}
