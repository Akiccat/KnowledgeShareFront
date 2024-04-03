import {Component, OnInit} from '@angular/core';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NoteDetailService} from "./notedetail.service";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {HttpClient} from "@angular/common/http";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {STORAGE_KEY_USER, STORAGE_NOTE_DATA} from "../../../shared/constants/common.constant";
import {User} from "../login-auth/user.model";
import {Note} from "../viewnote/note.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {NzInputModule} from "ng-zorro-antd/input";
import * as htmlToImage from 'html-to-image';
import {saveAs} from 'file-saver';

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
    EditorComponent,
    NgIf,
    NzPopconfirmModule,
    NgTemplateOutlet,
    NzCommentModule,
    NzInputModule,
  ],
  templateUrl: './notedetail.component.html',
  styleUrl: './notedetail.component.css'
})
export class NoteDetailComponent implements OnInit {
  private readonly _currentUser!: User;
  noteContent = '';
  noteTitle = '';
  noteTag = '';
  userName = '';
  noteUpdateData: Note | undefined;
  canEdit: boolean = false;
  ifAlreadyStart: boolean = false;
  routePath: string = '';
  submitting = false;
  replyInputValue = '';
  data: any[] = [];
  replyId: string = '';
  editorConfig = {
    plugins: '',
    toolbar: false,
    menubar: false,
    resize: false,
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    height: 550,
  }
  modalOptions: NgbModalOptions | undefined;
  closeResult: string | undefined;

  constructor(private httpClient: HttpClient,
              private service: NoteDetailService,
              private router: Router,
              private route: ActivatedRoute,
              private message: NzMessageService,
              private modalService: NgbModal) {
    this.ifAlreadyStart = false;
    this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);

  }

  submitReply() {
    //这里的replyId是作为fatherReplyId的
    this.service.reply(this.replyInputValue, this.replyId, this.noteUpdateData?.noteId, this._currentUser.userId).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("评论成功")
        this.ngOnInit()
      } else {
        this.message.error("评论失败")
      }
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const pageId = params["pageId"];
      if (pageId == 2) {
        this.routePath = '/mainpage/starnote'
      } else {
        this.routePath = '/mainpage/viewnote'
      }
      const noteId = params["noteId"];
      this.service.getReply(noteId).subscribe((result: HttpResult) => {
        if (result.status == HttpResultStatus.SUCCESS) {
          this.data = result.result
        }
      })
      //使用参数进行逻辑处理
      this.service.getNotes(noteId).subscribe((result: HttpResult) => {
        if (result.status == HttpResultStatus.SUCCESS) {
          this.noteContent = result.result.noteContent
          this.noteTag = result.result.noteTag
          this.noteTitle = result.result.noteTitle
          this.userName = result.result.userName
          this.noteUpdateData = result.result
          if (this._currentUser.userId == null) {
            this.message.error("登陆过期了，请重新登录")
            this.router.navigate(['/loginauth'], {relativeTo: this.route})
          } else {
            if (result.result.userId == this._currentUser.userId) {
              this.canEdit = true;
            }
          }
        }
      });
      this.service.ifStar(noteId, String(this._currentUser.userId)).subscribe((result: HttpResult) => {
        if (result.status == HttpResultStatus.SUCCESS) {
          if (result.result.noteId == this.noteUpdateData?.noteId) {
            this.ifAlreadyStart = true;
          } else {
            this.ifAlreadyStart = false;
          }
        }
      })
    });
  }

  open(content: any, replyId: string) {
    this.replyId = replyId;
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

  backToView() {
    this.router.navigate([this.routePath], {relativeTo: this.route})
  }

  updateNote() {
    localStorage.setItem(STORAGE_NOTE_DATA, JSON.stringify(this.noteUpdateData));
    this.router.navigate(['/mainpage/noteupdate', this.noteUpdateData?.noteId], {relativeTo: this.route})
  }

  starNote() {
    this.service.starNotes(String(this.noteUpdateData?.noteId), String(this._currentUser.userId)).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.ifAlreadyStart = true;
        this.message.success("收藏成功")
      } else {
        this.message.error("收藏失败")
      }
    })
  }

  unSubscribeNote() {
    if (this.ifAlreadyStart) {
      this.service.unSubscribeNote(String(this.noteUpdateData?.noteId), String(this._currentUser.userId)).subscribe((result: HttpResult) => {
        if (result.status == HttpResultStatus.SUCCESS) {
          this.ifAlreadyStart = false;
          this.message.success("取消收藏成功")
        } else {
          this.message.error("取消收藏失败")
        }
      })
    }
  }

  deleteNote() {
    this.service.deleteNote(String(this.noteUpdateData?.noteId), String(this._currentUser?.userId)).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.ifAlreadyStart = false;
        this.message.success("删除成功")
        this.router.navigate(['/mainpage/viewnote'], {relativeTo: this.route})
      } else {
        this.message.error("删除失败")
      }
    })
  }

  // public captureAndSaveImage() {
  //   const element : HTMLElement = document.getElementById('noteDetail') as HTMLElement; // 获取固定位置的元素
  //   htmlToImage
  //     .toJpeg(element)
  //     .then(imageDataUrl => {
  //       const img = new Image();
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         canvas.width = img.width;
  //         canvas.height = img.height / 2; // 将高度设置为原来的一半
  //
  //         // 在canvas上绘制截取后的图像
  //         const ctx = canvas.getContext('2d');
  //         ctx!.drawImage(img, 0, 0, img.width, img.height / 2, 0, 0, img.width, img.height / 2);
  //
  //         // 将截取后的图像显示在页面上
  //         document.body.appendChild(canvas);
  //
  //         // 将canvas转换为blob对象
  //         canvas.toBlob(blob => {
  //           console.log(blob);
  //           // 使用FileSaver.js保存并下载文件
  //           saveAs(blob!, 'share.jpeg');
  //         }, 'image/jpeg');
  //       };
  //       img.src = imageDataUrl;
  //     })
  //     .catch(error => {
  //       console.error('Error capturing and saving image:', error);
  //     });
  // }
  public captureAndSaveImage() {
    const element: HTMLElement = document.getElementById("noteContent") as HTMLElement; // 获取整个页面的元素
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    // 创建一个新的画布
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // 将元素绘制到画布上
    htmlToImage.toCanvas(element)
      .then((canvas) => {
        // 绘制完成后将画布转换为图像
        const image = new Image();
        image.src = canvas.toDataURL();

        console.log(image);

        // 使用FileSaver.js保存并下载文件
        saveAs(image.src, 'share.jpeg');
      })
      .catch(error => {
        console.error('Error capturing and saving image:', error);
      });
  }

}

