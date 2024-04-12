import {Component, DoCheck, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {NzListModule} from "ng-zorro-antd/list";
import {NzFormModule} from "ng-zorro-antd/form";
import {formatDistance} from "date-fns";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {ActivatedRoute, Router} from "@angular/router";
import {STORAGE_KEY_USER, STORAGE_NOTE_DATA} from "../../../shared/constants/common.constant";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzCardModule} from "ng-zorro-antd/card";
import {WelcomeService} from "./welcome.service";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {User} from "../login-auth/user.model";
import {History} from "./History";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Template} from "./template";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [CommonModule, FormsModule, NzCommentModule, NzListModule, NzFormModule, NzButtonModule, NzInputModule, NzAvatarModule, NzTagModule, NzDrawerModule, NzCardModule, NzPopconfirmModule],
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements DoCheck {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] = [];
  submitting = false;
  user = {
    author: 'QuestionAndAnswer',
    // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  };
  inputValue = '';
  index = 0; // the index of the current character
  uuid = this.randomString(32); // the id of the sender
  contentId = "";
  prompt = ''; // the input content
  count = 0;
  protected receivedText: string = "AiResponse:  ";
  protected previousText: string = "";
  replying: boolean = false;
  replyDone: boolean = false;
  ifAsk: boolean = false;
  modalOptions: NgbModalOptions | undefined;
  listOfHistory: History[] = [];
  loading = true;
  handleSubmit(): void {
    this.submitting = true;
    const content = this.inputValue;
    this.inputValue = '';
    setTimeout(() => {
      this.submitting = false;
      this.data = [
        ...this.data,
        {
          ...this.user,
          content,
          datetime: new Date(),
          displayTime: formatDistance(new Date(), new Date())
        }
      ].map(e => ({
        ...e,
        displayTime: formatDistance(new Date(), e.datetime)
      }));
    }, 800);
  }


  onClickClean() {
    this.uuid = this.randomString(32);
    alert('清理完毕！');
  }
  sendPost() {
    this.ifAsk = true
    this.replying = true;
    this.replyDone = false;
    if (this.prompt === '') {
      this.message.error('请输入你的问题');
      return;
    }
    this.data = [];
    this.inputValue = "YourQuestion:  " + this.prompt;
    this.receivedText = "AiResponse:  ";
    this.handleSubmit();
    this.sseChat(this.prompt);
  }

  sseChat(prompt: string){
    // create the sse connection
    const source = new EventSource(`http://localhost:8080/chat/sse?id=${this.uuid}&key=&prompt=${prompt}`);
    source.onopen = () => {
      this.contentId = this.randomString(16);
    };
    // handle the sse message
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data != null){
        this.receivedText += data.content; //或者 if event.data 是单个字符的话  this.receivedText += event.data;
        setTimeout(() => {
          this.previousText = this.receivedText;
        }, 20);
      }
      if (this.receivedText != null){
        if (document.getElementById('aiResponse') != null){
          // @ts-ignore
          document.getElementById('aiResponse').innerText = this.receivedText;
        }
      }
      // console.log(this.receivedText);
    };
    // handle the sse error
    source.onerror = () => {
      console.log('server internal error');
      source.close()
    };
  }

  // generate a random string of given length

  randomString(length: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  ngDoCheck() {
    if (this.receivedText == this.previousText) {
      setTimeout(() => {
        this.replyDone = true;
        this.replying = false;
      }, 5000);
    } else {
      this.replying = true;
      this.replyDone = false;
    }
  }

  sendToEditor() {
    localStorage.setItem(STORAGE_NOTE_DATA, JSON.stringify(this.receivedText));
    this.router.navigate(['/mainpage/editnote'], {relativeTo: this.route})
  }
  visibleHistory = false;
  childrenVisibleHistory = false;
  loadingHistory = true;
  TemplateInputValue = '';
  closeResult: string | undefined;

  visible = false;
  childrenVisible = false;
  vegetables = ['asparagus', 'bamboo', 'potato', 'carrot', 'cilantro', 'potato', 'eggplant'];
  listOfTemplate: Template[] = [];
  private readonly _currentUser!: User;

constructor(
    private message: NzMessageService,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private service: WelcomeService,
    private modalService: NgbModal
  ) {
  this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);
  }

  sendToEditorHistory(content: string) {
    localStorage.setItem(STORAGE_NOTE_DATA, JSON.stringify(content));
    this.router.navigate(['/mainpage/editnote'], {relativeTo: this.route})
  }

  recordToService() {
    this.service.insertAiReply(String(this._currentUser.userId), this.receivedText).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("保存成功")
      }
    })
  }

  selectHistoryFromService() {
    this.service.selectAiReply(String(this._currentUser.userId)).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.listOfHistory = result.result
      }
    })
  }

  deleteHistory(historyId: any) {
    this.service.deleteAiReply(historyId, String(this._currentUser.userId)).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.selectHistoryFromService()
      }
    })
  }

  close(): void {
    this.visible = false;
  }

  open(): void {
    this.selectTemplateFromService();
    this.visible = true;
  }

  openHistory(): void {
    this.selectHistoryFromService();
    this.visibleHistory = true;
  }

  closeHistory(): void {
    this.visibleHistory = false;
  }

  selectTemplateFromService() {
    this.service.selectTemplate(String(this._currentUser.userId)).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.listOfTemplate = result.result
      }
    })
  }

  submitTemplate() {
    this.service.submitTemplate(this.TemplateInputValue, this._currentUser.userId).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("创建成功")
        this.selectTemplateFromService()
      } else {
        this.message.error("评论失败")
      }
    })
  }

  openModal(content: any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  cancel(): void {
  }

  deleteTemp(tempId: any) {
    this.service.deleteTemp(tempId, String(this._currentUser.userId)).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("删除成功")
        this.selectTemplateFromService()
      }
    })
  }

  useTemp(tempContent: any) {
    this.close()
    this.prompt = tempContent;
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
}
