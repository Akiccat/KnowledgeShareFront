import {Component, OnInit} from '@angular/core';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserEditService} from "./useredit.service";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {HttpClient} from "@angular/common/http";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {STORAGE_KEY_USER} from "../../../shared/constants/common.constant";
import {User} from "../login-auth/user.model";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {editUserValidator} from "./EditUserValidators";
import {EditPassWord} from "./EditPassWord";


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
  ],
  templateUrl: './useredit.component.html',
  styleUrl: './useredit.component.css'
})
export class UserEditComponent {
  protected readonly _currentUser!: User;
  searchFlag: boolean = false;
  closeResult: string | undefined;
  modalOptions: NgbModalOptions | undefined;
  userGender: string;

  constructor(private httpClient: HttpClient,
              private service: UserEditService,
              private router: Router,
              private route: ActivatedRoute,
              private message: NzMessageService,
              private fb: FormBuilder,
              private modalService: NgbModal) {
    this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }
    if (this._currentUser.gender == 0) {
      this.userGender = "男"
    } else {
      this.userGender = "女"
    }
  }

  get currentUser(): User {
    return this._currentUser;
  }

  EditUserModel = this.fb.group({
    userName: [''],
    email: ['', [
      Validators.pattern('^[\\w\\.-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$')
    ]],
    birthday: ['', [
      Validators.pattern('\\d{4}-\\d{2}-\\d{2}')
    ]],
    gender: ['', [
      Validators.pattern('^[01]$')
    ]],
    grade: ['', [
      Validators.pattern('^[1234]$')
    ]],
    interest: [''],
    introduction: [''],
  }, {
    validators: editUserValidator
  });

  PassWordModel = this.fb.group({
    password: [''],
    confirmPassword: ['']
  }, {
    validators: EditPassWord
  });

  get userName(): any {
    return this.EditUserModel.get('userName');
  }

  get email(): any {
    return this.EditUserModel.get('email');
  }

  get birthday(): any {
    return this.EditUserModel.get('birthday');
  }

  get grade(): any {
    return this.EditUserModel.get('grade');
  }

  get interest(): any {
    return this.EditUserModel.get('interest');
  }

  get introduction(): any {
    return this.EditUserModel.get('introduction');
  }

  get gender(): any {
    return this.EditUserModel.get('gender');
  }

  onEdit() {
    if (this.birthday.value == "") {
      this.birthday.value = null
    }
    console.log(this._currentUser.userId)
    console.log(this.userName.value)
    console.log(this.grade.value)
    console.log(this.birthday.value)
    console.log(this.PassWordModel.value.password)
    console.log(this.PassWordModel.value.confirmPassword)
    console.log(this.email.value)
    console.log(this.interest.value)
    console.log(this.introduction.value)
    this.service.editUser(String(this._currentUser.userId), this.EditUserModel.value.userName, this.email.value, this.birthday.value, this.grade.value, this.interest.value, this.introduction.value, this.gender.value, this.PassWordModel.value.password, this.PassWordModel.value.confirmPassword).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        console.log(result)
        this.message.success("修改成功，5秒后将重新登陆")
        setTimeout(() => {
          this.router.navigate(['/loginauth'], {relativeTo: this.route})
        }, 5000);
      } else {
        this.message.error("修改失败")
      }
    })
  }

  open(content: any) {
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
}

