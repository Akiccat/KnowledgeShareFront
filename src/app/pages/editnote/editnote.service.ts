import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class EditNoteUploadService {

  constructor(private httpClient: HttpClient) {
  }

  public uploadContent(content: string, userId: number, noteTitle: string, noteSimpleContent: string, noteTag: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.uploadContent, {
      userId: userId,
      noteTitle: noteTitle,
      noteSimpleContent: noteSimpleContent,
      noteContent: content,
      noteTag: noteTag
    });
  }
}
