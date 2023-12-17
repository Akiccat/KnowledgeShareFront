import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {HttpClient} from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import { EventSourcePolyfill } from 'event-source-polyfill';
import {ajax} from "rxjs/internal/ajax/ajax";
@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [CommonModule,FormsModule],
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  title = 'typing-effect';
  contextArray: any[] = []; // the array to store the sse results
  index = 0; // the index of the current character
  id = this.randomString(32); // the id of the sender
  prompt = ''; // the input content

  constructor() {

  }
  onClickClean() {
    this.contextArray = [];
    this.id = this.randomString(32);
    alert('清理完毕！');
  }
  sendPost() {
    if (this.prompt === '') {
      alert('请输入你的问题');
      return;
    }
    const loading = true; // Replace with actual loading logic
    this.sseChat(this.prompt, loading);
  }
  sseChat(prompt: string, loading: boolean){
    // create the sse connection
    const source = new EventSource(`http://localhost:8080/chat/sse?id=${this.id}&key=&prompt=${prompt}`);
    // handle the sse message
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.id = data.id; // get the id of the sender
      this.contextArray.push(data); // add the data to the array
      this.index = 0; // reset the index
    };
    // handle the sse open
    source.onopen = (event) => {
      console.log('server connect successed');
    };
    // handle the sse error
    source.onerror = (event) => {
      console.log('server internal error');
      source.close();
    };
    // create the typing effect animation
    setInterval(() => {
      if (this.index < this.contextArray[this.contextArray.length - 1].content.length) {
        this.index++;
      }
    }, 100);
  }
  // send the input content and a random id to the server

  // generate a random string of given length
  randomString(length: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}
