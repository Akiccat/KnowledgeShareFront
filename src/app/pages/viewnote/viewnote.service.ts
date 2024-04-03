import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class ViewNoteService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 登录
   *
   * @return {*}  {Observable<HttpResult>}
   * @memberof ViewNoteService
   */
  public getNotes(): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getNotes, {});
  }

  public searchNotes(searchContent: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.searchNotes, {
      searchContent: searchContent
    })
  }
}
