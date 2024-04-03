import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpClient} from "@angular/common/http";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class NoteVisualizationService {

  constructor(private httpClient: HttpClient) {
  }

  getPublishCount(): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getPublishCount, {})
  }

  getUserFrom(): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getUserFrom, {})
  }

  getReplyCount(): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.getReplyCount, {})
  }

  getFavouriteCount() {
    return this.httpClient.post<HttpResult>(apiUrl.getFavouriteCount, {})
  }
}
