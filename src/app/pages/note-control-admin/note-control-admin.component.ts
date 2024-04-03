import {Component, OnInit} from '@angular/core';
import {NzTableModule} from "ng-zorro-antd/table";
import {NgForOf, NgIf} from "@angular/common";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NoteControlAdminService} from "./note-control-admin.service";
import {Note} from "../viewnote/note.model";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {STORAGE_KEY_USER, STORAGE_NOTE_DATA} from "../../../shared/constants/common.constant";
import {User} from "../login-auth/user.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-note-control-admin',
  standalone: true,
  imports: [
    NzTableModule,
    NgForOf,
    NgIf,
    NzButtonModule,
    NzPopconfirmModule,
    NzWaveModule,
    FormsModule
  ],
  templateUrl: './note-control-admin.component.html',
  styleUrl: './note-control-admin.component.css'
})
export class NoteControlAdminComponent implements OnInit {
  listOfData: Note[] = [];
  private readonly _currentUser!: User;

  constructor(private httpClient: HttpClient,
              private service: NoteControlAdminService,
              private router: Router,
              private route: ActivatedRoute,
              private message: NzMessageService) {
    this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);
  }

  canPost: boolean = true;
  noteSearch: string = '';

  ngOnInit(): void {
    this.service.getNotes().subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.listOfData = result.result
        console.log(this.listOfData);
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

  deleteNote(noteId: string) {
    this.service.deleteNote(noteId, String(this._currentUser?.userId)).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("删除成功")
        this.ngOnInit()
      } else {
        this.message.error("删除失败")
      }
    })
  }

  updateNote(noteId: string) {
    this.service.getNoteById(noteId).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        const noteUpdateData: Note = result.result
        localStorage.setItem(STORAGE_NOTE_DATA, JSON.stringify(noteUpdateData));
        this.router.navigate(['/mainpage/noteupdate', noteUpdateData?.noteId], {relativeTo: this.route})
      }
    })
  }

  postSearch() {
    if (this.noteSearch != '') {
      this.service.searchNotes(this.noteSearch).subscribe((result: HttpResult) => {
        console.log(this.noteSearch)
        console.log(result);
        console.log(result.status == HttpResultStatus.SUCCESS && result.result != '')
        if (result.status == HttpResultStatus.SUCCESS && result.result != '') {
          this.listOfData = result.result
        } else {
          alert("没有搜索到结果")
          this.router.navigate(['/mainpage/note-control'], {relativeTo: this.route})
        }
      });
    }
  }
}

