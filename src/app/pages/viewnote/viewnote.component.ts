import {Component, signal} from '@angular/core';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ViewNoteService} from "./viewnote.service";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {Note} from "./note.model";
import {NgForOf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-viewnote',
  standalone: true,
  imports: [
    NzGridModule,
    NzCardModule,
    NzAvatarModule,
    NzIconModule,
    NgForOf,
    ReactiveFormsModule,
    NzButtonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './viewnote.component.html',
  styleUrl: './viewnote.component.css'
})
export class ViewNoteComponent {
  noteList: Array<Note> | undefined;
  canPost: boolean = true;
  noteSearch: string = '';

  constructor(private httpClient: HttpClient,
              private service: ViewNoteService,
              private router: Router,
              private route: ActivatedRoute) {
    this.service.getNotes().subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.noteList = result.result
        console.log(this.noteList);
      } else {
        alert("服务器好像出了点问题，请稍后再试")
      }
    })
  }

  ifInput() {
    if (this.noteSearch != '') {
      this.canPost = false;
    } else {
      this.canPost = true;
    }
  }

  postSearch() {
    if (this.noteSearch != '') {
      this.service.searchNotes(this.noteSearch).subscribe((result: HttpResult) => {
        console.log(this.noteSearch)
        console.log(result);
        console.log(result.status == HttpResultStatus.SUCCESS && result.result != '')
        if (result.status == HttpResultStatus.SUCCESS && result.result != '') {
          this.noteList = result.result
        } else {
          alert("没有搜索到结果")
          this.router.navigate(['/mainpage/viewnote'], {relativeTo: this.route})
        }
      });
    }
  }

}
