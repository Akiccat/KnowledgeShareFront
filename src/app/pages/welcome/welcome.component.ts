import {
  AfterViewInit,
  Component, DoCheck,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {NzListModule} from "ng-zorro-antd/list";
import {NzFormModule} from "ng-zorro-antd/form";
import {formatDistance} from "date-fns";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {Subject} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {EventSourcePolyfill} from "ng-event-source";
import {ActivatedRoute, Router} from "@angular/router";
import {STORAGE_NOTE_DATA} from "../../../shared/constants/common.constant";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [CommonModule, FormsModule, NzCommentModule, NzListModule, NzFormModule, NzButtonModule, NzInputModule, NzAvatarModule, NzTagModule, NzDrawerModule],
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

constructor(
    private message: NzMessageService,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }
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

  visible = false;
  childrenVisible = false;

  vegetables = ['asparagus', 'bamboo', 'potato', 'carrot', 'cilantro', 'potato', 'eggplant'];

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  openChildren(): void {
    this.childrenVisible = true;
  }

  closeChildren(): void {
    this.childrenVisible = false;
  }
}
