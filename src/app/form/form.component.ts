import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  userForm!: FormGroup;
  editIndex: number | null = null;

  constructor(public formBuilder: FormBuilder){ }
  
  ngOnInit(): void {
    this.createForm()
    this.showData();
  }

  createForm(){
    this.userForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/^[A-Z][a-zA-Z\s']*$/) 
      ]],
      email: ['',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\w+([-.]\w+)*$/)
        ]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$')
      ]],
      confPassword: ['',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$')
      ]]
    },{
      validators: this.checkPassword
    })
  }
  checkPassword(form: FormGroup) {
    const password = form.get('password')?.value;
    const confPassword = form.get('confPassword')?.value;
    return password === confPassword ? null : { passwordMismatch: true };
  }

  submitData(){
  if(this.userForm.valid){
    const data = this.userForm.value;
    const userData = localStorage.getItem('formdata') || '[]';
    const parsedData = JSON.parse(userData);

    if (this.editIndex !== null) {
      parsedData[this.editIndex] = data;
      this.editIndex = null;
    } else {
      parsedData.push(data);
    }

    localStorage.setItem('formdata', JSON.stringify(parsedData));
    this.userForm.reset();
    this.showData();
  }
}


  userListData: any[] = []
  showData(){
    const userData = localStorage.getItem('formdata') || '[]'
    this.userListData = JSON.parse(userData);
    console.log(this.userListData);
  }


  deleteData(index: number){
    const userData = localStorage.getItem('formdata') || '[]'
    this.userListData = JSON.parse(userData);
    this.userListData.splice(index, 1);
    localStorage.setItem('formdata', JSON.stringify(this.userListData));
    // console.log(this.userListData);
    this.showData();
  }
  editData(index: number) {
    const user = this.userListData[index];
    this.userForm.patchValue(user);
    this.editIndex = index;
  }
}
