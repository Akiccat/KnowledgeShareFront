import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  constructor(private httpClient: HttpClient) {
  }

  public insertAiReply(userId: string, aiReply: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.addReplyHistory, {
      historyContent: aiReply,
      userId: userId
    })
  }

  selectAiReply(userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.selectReplyHistory, {
      userId: userId
    })
  }

  deleteAiReply(historyId: any, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.deleteReplyHistory, {
      userId: userId,
      historyId: historyId
    })
  }

  submitTemplate(TemplateInputValue: string, userId: number): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.addTempHistory, {
      userId: userId,
      tempContent: TemplateInputValue
    })
  }

  selectTemplate(userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getTemplate, {
      userId: userId,
    })
  }

  deleteTemp(tempId: any, userId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.deleteTemplate, {
      userId: userId,
      tempId: tempId
    })
  }
}
