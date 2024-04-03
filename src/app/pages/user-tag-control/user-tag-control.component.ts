import {Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzTransitionPatchModule} from "ng-zorro-antd/core/transition-patch/transition-patch.module";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Note} from "../viewnote/note.model";
import {User} from "../login-auth/user.model";
import {HttpClient} from "@angular/common/http";
import {UserNoteControlService} from "../user-note-control/user-note-control.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {STORAGE_KEY_USER, STORAGE_NOTE_DATA} from "../../../shared/constants/common.constant";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {UserTagControlService} from "./user-tag-control.service";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-user-tag-control',
  standalone: true,
  imports: [
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzPopconfirmModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './user-tag-control.component.html',
  styleUrl: './user-tag-control.component.css'
})
export class UserTagControlComponent {
  listOfData: Note[] = [];
  private readonly _currentUser!: User;
  closeResult: string | undefined;
  modalOptions: NgbModalOptions | undefined;
  private noteTagId!: string;

  constructor(private httpClient: HttpClient,
              private service: UserTagControlService,
              private router: Router,
              private route: ActivatedRoute,
              private message: NzMessageService,
              private modalService: NgbModal) {
    this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);
  }

  canPost: boolean = true;
  noteSearch: string = '';
  newTagName: any;

  ngOnInit(): void {
    this.service.getTags(String(this._currentUser?.userId)).subscribe((result: HttpResult) => {
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

  deleteNote(noteTag: string) {
    this.service.deleteTage(noteTag, String(this._currentUser?.userId)).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("删除成功")
        this.ngOnInit()
      } else {
        this.message.error("删除失败")
      }
    })
  }

  updateTag(noteTag: string, userId: string, noteId: string) {
    this.service.updateTag(noteTag, userId, noteId).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("更新成功")
        this.ngOnInit()
      } else {
        this.message.error("更新失败")
      }
    })
  }

  postSearch() {
    if (this.noteSearch != '') {
      this.service.searchTags(this.noteSearch, String(this._currentUser?.userId)).subscribe((result: HttpResult) => {
        console.log(this.noteSearch)
        console.log(result);
        console.log(result.status == HttpResultStatus.SUCCESS && result.result != '')
        if (result.status == HttpResultStatus.SUCCESS && result.result != '') {
          this.listOfData = result.result
        } else {
          this.message.info("没有搜索到结果")
          this.router.navigate(['/mainpage/usertag'], {relativeTo: this.route})
        }
      });
    }
  }

  open(content: any, noteId: string) {
    this.noteTagId = noteId;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onEdit() {
    if (this.newTagName == null) {
      this.message.error("请输入NewTag")
    } else {
      this.updateTag(this.newTagName, String(this._currentUser?.userId), this.noteTagId);
    }
  }
}
