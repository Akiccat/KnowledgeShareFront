import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class NoteDetailService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * 登录
   *
   * @return {*}  {Observable<HttpResult>}
   * @memberof ViewNoteService
   */
  public getNotes(noteId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getDetail, {
      noteId: noteId
    });
  }

  public starNotes(noteId: string, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.starNotes, {
      noteId: noteId,
      userId: userId
    })
  }

  public unSubscribeNote(noteId: string, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.unStarNotes, {
      noteId: noteId,
      userId: userId
    })
  }

  public ifStar(noteId: string, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.ifStart, {
      noteId: noteId,
      userId: userId
    })
  }

  public deleteNote(noteId: string, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.deleteNote, {
      noteId: noteId,
      userId: userId
    })
  }

  public getReply(noteId: string | undefined): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getReply, {
      noteId: noteId,
    })
  }

  public reply(replyInputValue: string, replyId: string, noteId: string | undefined, userId: number): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.sentReply, {
      replyInputValue: replyInputValue,
      replyId: replyId,
      noteId: noteId,
      userId: userId
    })
  }
}
