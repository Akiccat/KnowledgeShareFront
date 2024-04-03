import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpResult} from "../../../shared/models/http-result.model";
import {apiUrl} from "../../../shared/constants/api-url.constant";

@Injectable({
  providedIn: 'root'
})
export class NoteUploadService {

  constructor(private httpClient: HttpClient) {
  }

  public updateContent(content: string, userId: number, noteTitle: string, noteSimpleContent: string, noteTag: string, noteId: string): Observable<HttpResult> {
    return this.httpClient.post<HttpResult>(apiUrl.updateContent, {
      userId: userId,
      noteTitle: noteTitle,
      noteSimpleContent: noteSimpleContent,
      noteContent: content,
      noteTag: noteTag,
      noteId: noteId
    });
  }
}
