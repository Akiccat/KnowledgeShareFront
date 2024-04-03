import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class UserTagControlService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 登录
   *
   * @return {*}  {Observable<HttpResult>}
   * @memberof ViewNoteService
   */
  public getTags(userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.userOwnTag, {
      userId: userId
    });
  }

  public searchTags(searchContent: string, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.searchUserOwnTag, {
      searchContent: searchContent,
      userId: userId
    })
  }

  public getNoteById(noteId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getDetail, {
      noteId: noteId
    });
  }

  public updateTag(noteTag: string, userId: string, noteId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.userOwnTagUpdate, {
      noteTag: noteTag,
      userId: userId,
      noteId: noteId
    });
  }

  public deleteTage(noteTag: string, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.userOwnTagDelete, {
      noteTag: noteTag,
      userId: userId
    })
  }
}
