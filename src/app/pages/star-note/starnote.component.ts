import {Component, signal} from '@angular/core';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StarNoteService} from "./starnote.service";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {Note} from "./note.model";
import {NgForOf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {HttpClient} from "@angular/common/http";
import {User} from "../login-auth/user.model";
import {STORAGE_KEY_USER} from "../../../shared/constants/common.constant";


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
  templateUrl: './starnote.component.html',
  styleUrl: './starnote.component.css'
})
export class StarNoteComponent {
  noteList: Array<Note> | undefined;
  canPost: boolean = true;
  noteSearch: string = '';
  protected readonly _currentUser!: User;

  constructor(private httpClient: HttpClient,
              private service: StarNoteService,
              private router: Router,
              private route: ActivatedRoute) {
    this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);
    if (this._currentUser == null) {
      alert("登录似乎过期了")
      this.router.navigate(['/loginauth'], {relativeTo: this.route})
    }
    this.service.getStarNotes(String(this._currentUser.userId)).subscribe((result: HttpResult) => {
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
      this.service.searchStarNotes(this.noteSearch, String(this._currentUser.userId)).subscribe((result: HttpResult) => {
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
