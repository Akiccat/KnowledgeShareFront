import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class StarNoteService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 登录
   *
   * @return {*}  {Observable<HttpResult>}
   * @memberof StarNoteService
   */
  public getStarNotes(userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getStarNotes, {
      userId: userId
    });
  }

  public searchStarNotes(searchContent: string, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.searchStarNotes, {
      userId: userId,
      searchContent: searchContent
    })
  }
}
