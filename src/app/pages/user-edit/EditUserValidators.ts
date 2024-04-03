import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

export function editUserValidator(group: FormGroup): any {
  const userName: FormControl = group.get('userName') as FormControl;
  const email: FormControl = group.get('email') as FormControl;
  const birthday: FormControl = group.get('birthday') as FormControl;
  const gender: FormControl = group.get('gender') as FormControl;
  const grade: FormControl = group.get('grade') as FormControl;
  const interest: FormControl = group.get('interest') as FormControl;
  const introduction: FormControl = group.get('introduction') as FormControl;
  const isValid = (userName.value != '' || email.value != '' || birthday.value != '' || gender.value != '' || grade.value != '' || interest.value != '' || introduction.value != '');
  return isValid ? null : {mustOne: {descAlert: '请至少填写一个字段'}};
}
