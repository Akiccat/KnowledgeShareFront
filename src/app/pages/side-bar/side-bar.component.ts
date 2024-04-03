import {Component, OnInit} from '@angular/core';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {ActivatedRoute, provideRouter, Router, RouterLink, RouterModule, RouterOutlet} from "@angular/router";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientModule} from "@angular/common/http";
import {routes} from "../../app.routes";
import {User} from "../login-auth/user.model";
import {STORAGE_KEY_USER} from "../../../shared/constants/common.constant";

@Component({
  selector: 'app-side-bar',
  standalone: true,
    imports: [
      CommonModule,
      RouterOutlet,
      NzIconModule,
      NzLayoutModule,
      NzMenuModule,
      FormsModule,
      ReactiveFormsModule,
      NgbModule,
      HttpClientModule,
      RouterModule,
      NgOptimizedImage,
    ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit{
  protected readonly _currentUser!: User;

  constructor(protected router: Router,
              private route: ActivatedRoute,) {
    this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);
    if (this._currentUser == null) {
      alert("登录似乎过期了")
      this.router.navigate(['/loginauth'], {relativeTo: this.route})
    }
  }

  isCollapsed: boolean = false;

  ngOnInit(): void {
    console.log(this.router.config)
  }
}
