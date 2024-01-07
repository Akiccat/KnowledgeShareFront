import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

export function confirmPassWordValidator(group: FormGroup): any {
  const password: FormControl = group.get('password') as FormControl;
  const confirmPassWord: FormControl = group.get('confirmPassWord') as FormControl;
  const valid: boolean = (password.value === confirmPassWord.value);
  // console.log('密码校验结果：' + valid);
  return valid ? null : {equal: {descAlert: '密码和确认密码不匹配'}};
}
