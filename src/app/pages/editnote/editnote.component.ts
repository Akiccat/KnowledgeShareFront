import {Component} from '@angular/core';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzIconModule} from "ng-zorro-antd/icon";
import {EditorComponent, TINYMCE_SCRIPT_SRC} from "@tinymce/tinymce-angular";
import {HttpClient} from "@angular/common/http";
import tinymce from 'tinymce';
import {FormsModule} from "@angular/forms";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {User} from "../login-auth/user.model";
import {STORAGE_KEY_USER, STORAGE_NOTE_DATA} from "../../../shared/constants/common.constant";
import {EditNoteUploadService} from "./editnote.service";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {Note} from "../viewnote/note.model";

@Component({
  selector: 'app-viewnote',
  standalone: true,
  imports: [
    NzGridModule,
    NzCardModule,
    NzAvatarModule,
    NzIconModule,
    EditorComponent,
    FormsModule,
    NzButtonModule
  ],
  providers: [
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.js'}
  ],
  templateUrl: './editnote.component.html',
  styleUrl: './editnote.component.css'
})
export class EditNoteComponent {
  title = 'tinymce-angular-upload';
  private readonly _currentUser!: User;
  private readonly _updateNoteData!: string;
  // 编辑器内容
  noteContent = '';
  noteTitle = '';
  noteSimpleContent = '';
  tag = '';

  canPost = true;

  // 编辑器配置
  editorConfig = {
    plugins: 'lists link image table code wordcount',
    toolbar: 'undo redo | link image | code',
    image_title: true,
    promotion: false,
    resize: false,
    file_picker_types: 'image',
    automatic_uploads: false,
    images_upload_url: 'http://localhost:8080/editor/image',
    paste_data_images: true,
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    height: 520
  }

  constructor(private httpClient: HttpClient,
              private service: EditNoteUploadService,
              private router: Router,
              private route: ActivatedRoute,
              private message: NzMessageService) {
    this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);
    this._updateNoteData = JSON.parse(localStorage.getItem(STORAGE_NOTE_DATA)!);
    if (this._currentUser == null) {
      alert("登录似乎过期了")
      this.router.navigate(['/loginauth'], {relativeTo: this.route})
    }
    if (this._updateNoteData != null) {
      this.noteContent = this._updateNoteData
    }
    localStorage.removeItem(STORAGE_NOTE_DATA)
  }

  get currentUser(): User {
    return this._currentUser;
  }

  postContent(): void {
    const editor = tinymce.get('002');
    console.log(editor);
    editor?.editorUpload.uploadImages().then(() => {
      // uploadImages方法执行完毕后，再执行uploadContent方法
      this.service.uploadContent(this.noteContent + "<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>", this.currentUser.userId, this.noteTitle, this.noteSimpleContent, this.tag).subscribe((result: HttpResult) => {
        console.log(this.noteContent)
        console.log(this.currentUser.userId)
        console.log(this.noteTitle)
        console.log(this.noteSimpleContent)
        console.log(this.tag)
        console.log(result);
        if (result.status == HttpResultStatus.SUCCESS) {
          this.message.success('上传成功');
          this.router.navigate(['/mainpage/viewnote'], {relativeTo: this.route})
        } else {
          this.message.error('上传失败');
        }
      });
    });
  }

  ifInput(): void {
    if (this.noteTitle != '' && this.noteSimpleContent != '' && this.noteContent != '') {
      this.canPost = false;
    } else {
      this.canPost = true;
    }
    console.log(this.canPost)
  }
}
