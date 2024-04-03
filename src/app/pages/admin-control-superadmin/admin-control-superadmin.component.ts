import {Component} from '@angular/core';
import {NzTableModule} from "ng-zorro-antd/table";
import {NgForOf, NgIf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../user-edit/user.model";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {STORAGE_KEY_USER} from "../../../shared/constants/common.constant";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {editUserValidator} from "../user-edit/EditUserValidators";
import {EditPassWord} from "../user-edit/EditPassWord";
import {AdminControlSuperadminService} from "./admin-control-superadmin.service";

@Component({
  selector: 'app-admin-control-superadmin',
  standalone: true,
  imports: [
    NzTableModule,
    NgForOf,
    NzButtonModule,
    NzPopconfirmModule,
    NzWaveModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './admin-control-superadmin.component.html',
  styleUrl: './admin-control-superadmin.component.css'
})
export class AdminControlSuperadminComponent {
  listOfData: User[] = [];
  modalOptions: NgbModalOptions | undefined;
  closeResult: string | undefined;
  updateUserId: number | undefined;
  protected readonly _currentUser!: User;
  protected _editUser!: User;
  canPost: boolean = true;
  userSearch: string = '';

  constructor(private httpClient: HttpClient,
              private service: AdminControlSuperadminService,
              private router: Router,
              private route: ActivatedRoute,
              private message: NzMessageService,
              private fb: FormBuilder,
              private modalService: NgbModal) {
    this._currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY_USER)!);
  }

  ngOnInit(): void {
    this.service.getAllUser().subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.listOfData = result.result
        for (let listOfDatum of this.listOfData) {
          if (listOfDatum.gender == "0") {
            listOfDatum.gender = "男"
          } else if (listOfDatum.gender == "1") {
            listOfDatum.gender = "女"
          } else {
            listOfDatum.gender = "未填写性别"
          }
        }
      }
    })
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
    this.service.editUser(String(this.updateUserId), this.EditUserModel.value.userName, this.email.value, this.birthday.value, this.grade.value, this.interest.value, this.introduction.value, this.gender.value, this.PassWordModel.value.password, this.PassWordModel.value.confirmPassword).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("修改成功")
        this.ngOnInit();
      } else {
        this.message.error("修改失败")
      }
    })
  }

  banUser(userid: number) {
    this.service.banUser(userid, "1").subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.warning("已封禁用户")
        this.ngOnInit()
      }
    })
  }

  unbanUser(userid: number) {
    this.service.unbanUser(userid, "0").subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.warning("已封禁用户")
        this.ngOnInit()
      }
    })
  }

  open(content: any, userId: number) {
    this.updateUserId = userId;
    this.service.getUserById(String(userId)).subscribe((result: HttpResult) => {
      this._editUser = result.result
      if (this._editUser.gender == "0") {
        this._editUser.gender = "男"
      } else {
        this._editUser.gender = "女"
      }
    })
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

  setAsUser(userId: number) {
    this.service.setAsUser(userId).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.success("成功设置为用户")
        this.ngOnInit()
      } else {
        this.message.error("设置失败")
      }
    })
  }

  ifInput() {
    if (this.userSearch != '') {
      this.canPost = false;
    } else {
      this.canPost = true;
    }
  }

  postSearch() {
    if (this.userSearch != '') {
      this.service.searchAdmin(this.userSearch).subscribe((result: HttpResult) => {
        console.log(this.userSearch)
        console.log(result);
        console.log(result.status == HttpResultStatus.SUCCESS && result.result != '')
        if (result.status == HttpResultStatus.SUCCESS && result.result != '') {
          this.listOfData = result.result
        } else {
          this.message.error("未搜索到结果")
        }
      });
    }
  }
}
