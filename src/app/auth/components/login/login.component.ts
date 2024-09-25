import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginForm: any;
  public errMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initloginForm();
  }

  public initloginForm(): void {
    this.loginForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public saveForm(): void {
    if (this.loginForm.valid) {
      if (this.loginForm.get("userEmail").value == "admin@csm.tech" && this.loginForm.get("password").value == "admin") {
        this.router.navigate(['/shared/dashboard']);
      }
      else {
        this.errMessage = 'Invalid Id or Password!'
      }
    }
  }
}
