import {Component} from '@angular/core';
import {LoginAuthService} from "./login-auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpResult} from "../../../shared/models/http-result.model";
import {HttpResultStatus} from "../../../shared/constants/http-result-status.constant";
import {User} from "./user.model";
import {STORAGE_KEY_USER} from "../../../shared/constants/common.constant";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {confirmPassWordValidator} from "./RegisterValidators";
import {NgIf} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-login-my',
  templateUrl: './login-auth.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  styleUrls: ['./login-auth.component.css']
})
export class LoginAuthComponent {
  isRegister = false;
  interests = [{interest: "电影" }, { interest: "唱歌" }, { interest: "读书" }]
  checkBoxValue: string[] = [];
  constructor(private service: LoginAuthService,
              private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private message: NzMessageService) {
  }
  /**
   * 登录
   *
   * @param {string} userName
   * @param {string} password
   * @memberof LoginAuthComponent
   */
  public submit(userName: string, password: string): void {
    console.log(this.router.config);
    // this.errorMessage = null;
    this.service.login(userName, password).subscribe((result: HttpResult) => {
      console.log(result.status + HttpResultStatus.SUCCESS)
      console.log(result.status == HttpResultStatus.SUCCESS)
      if (result.status == HttpResultStatus.SUCCESS) {
        const user: User = result.result;
        //localStorage.setItem(key,value)：将value存储到key字段
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        if (user !== null && (user.accessCode == 0 || user.accessCode == 1 || user.accessCode == 2)) {
          // 管理员
          this.router.navigate(['/mainpage'], {relativeTo: this.route})
          this.message.success("登录成功")
        } else {
          alert("登录失败");
        }
      } else {
        // this.errorMessage = result.errors[0]?.message || '登录失败';
        alert("登录失败");
      }
    });
  }

  /**
   * 注册
   * @memberof LoginAuthComponent
   */
  public onRegister(): void {
    let userName = this.name.value
    let passwordGroup = this.password.value
    let email = this.email.value
    let birthday = this.birthday.value
    let gender = this.gender.value
    let grade = this.regGrade.value
    let interest: string = this.checkBoxValue.join(",")
    let introduction = this.regIntroduce.value
    this.service.register(userName, passwordGroup.confirmPassWord, passwordGroup.password, email, birthday, gender, grade, interest, introduction).subscribe(() => {
      this.isRegister = false
      alert("成功注册");
    })
    console.log(userName)
    console.log(passwordGroup.password)
    console.log(email)
    console.log(birthday)
    console.log(gender)
    console.log(grade)
    console.log(interest)
    console.log(introduction)
  }

  /**
   * 表单验证
   */
    RegisterFormModel = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      passwordsGroup: this.fb.group({
        password: ['',
        ],
        confirmPassWord: ['',
        ]
      }, {
        validator: confirmPassWordValidator
      }),
      email: ['', [
        Validators.required,
        Validators.pattern('^[\\w\\.-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$')
      ]],
      birthday: ['', [
        //Validators.required,
        //Validators.pattern('\\d{4}-\\d{2}-\\d{2}')
      ]],
      gender: [''],
      regGrade: [''],
      regIntroduce: ['']
    });

  /**
   * 表单参数获取
   */
  get name(): any {
    return this.RegisterFormModel.get('username');
  }
  get password (): any {
    return this.RegisterFormModel.get('passwordsGroup');
  }
  get email(): any {
    return this.RegisterFormModel.get('email');
  }
  get birthday(): any {
    return this.RegisterFormModel.get('birthday');
  }
  get gender(): any{
    return this.RegisterFormModel.get('gender');
  }
  get regGrade(): any{
    return this.RegisterFormModel.get('regGrade');
  }
  get regIntroduce(): any{
    return this.RegisterFormModel.get('regIntroduce');
  }

  /**
   * checkBox参数获取
   */
  termsChange(selected: any): void {
    let number;
    if (selected.target.checked) {
      this.checkBoxValue.push(selected.target.value)
    } else {
      number = this.checkBoxValue.lastIndexOf(selected.target.value)
      this.checkBoxValue.splice(number,1)
    }
  }


}
