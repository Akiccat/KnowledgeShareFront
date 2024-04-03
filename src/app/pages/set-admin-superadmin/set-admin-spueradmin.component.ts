import {Component} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NzTableModule} from "ng-zorro-antd/table";
import {User} from "../user-edit/user.model";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {editUserValidator} from "../user-edit/EditUserValidators";
import {EditPassWord} from "../user-edit/EditPassWord";
import {STORAGE_KEY_USER} from "../../../shared/constants/common.constant";
import {SetAdminSuperAdminService} from "./set-admin-spueradmin.service";

@Component({
  selector: 'app-user-control-admin',
  standalone: true,
  imports: [
    NgForOf,
    NzTableModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzWaveModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './set-admin-spueradmin.component.html',
  styleUrl: './set-admin-spueradmin.component.css'
})
export class SetAdminSuperAdminComponent {
  listOfData: User[] = [];
  modalOptions: NgbModalOptions | undefined;
  closeResult: string | undefined;
  updateUserId: number | undefined;
  protected readonly _currentUser!: User;
  protected _editUser!: User;
  canPost: boolean = true;
  userSearch: string = '';

  constructor(private httpClient: HttpClient,
              private service: SetAdminSuperAdminService,
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
          if (listOfDatum.accessCode == "2") {
            listOfDatum.accessCode = "用户"
          } else if (listOfDatum.accessCode == "1") {
            listOfDatum.accessCode = "管理员"
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

  setAsAdmin(userid: number) {
    this.service.setAsAdmin(userid).subscribe((result: HttpResult) => {
      if (result.status == HttpResultStatus.SUCCESS) {
        this.message.warning("已设为管理")
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

  ifInput() {
    if (this.userSearch != '') {
      this.canPost = false;
    } else {
      this.canPost = true;
    }
  }

  postSearch() {
    if (this.userSearch != '') {
      this.service.searchUser(this.userSearch).subscribe((result: HttpResult) => {
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
