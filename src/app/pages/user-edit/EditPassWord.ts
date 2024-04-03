import {FormControl, FormGroup} from "@angular/forms";

export function EditPassWord(group: FormGroup): any {
  const password: FormControl = group.get('password') as FormControl;
  const confirmPassword: FormControl = group.get('confirmPassword') as FormControl;
  console.log(password.value, confirmPassword.value)

  const isValid = (password.value != '' && confirmPassword.value && password.value === confirmPassword.value);
  return isValid ? null : {mustOne: {descAlert: '密码和重复密码不一致'}};
}
