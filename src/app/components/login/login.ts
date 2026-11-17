import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule,NgIf } from '@angular/common';
import { ReactFooterWrapperComponent } from '../../shared/react-div/react-div-wrapper.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, NgIf, ReactFooterWrapperComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  signInForm!: FormGroup;
  isOtpRequired:boolean=false;
  forgotPassword:boolean=false;
  forgotPasswordForm!: FormGroup;
  isEmailRequired:boolean=false;
  constructor(private readonly fb: FormBuilder,private readonly toastService:ToastrService,private authService:Auth,private router:Router) {}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  initializeForm(): void {
    this.signInForm = this.fb.group({
      email:['',Validators.required],
      password: ['', Validators.required],
      otp:[''],
      newPassword:[''],
      confirmPassword:['']
    });
    this.forgotPasswordForm = this.fb.group({
      email:['',Validators.required],
      password: ['', Validators.required],
      otp:[''],
      newPassword:[''],
      confirmPassword:['']
    });
  }
  onLogin():void{
    if(this.isOtpRequired ===false){
this.login();
    }else{
      this.verifyandRedirect();
    }
  }
  login():void{
if(this.signInForm.invalid){
   this.toastService.error('Please fill out all required fields!')
}
const formValues=this.signInForm.value;
const payload ={
  email:formValues.email,
  password:formValues.password
}
this.authService.login(payload).subscribe({
  next:(res)=>{
    this.toastService.success(res?.message || 'please enter the Otp sent to your email!');
    this.isOtpRequired=true;
    this.signInForm.get('otp')?.setValidators(Validators.required);
    this.signInForm.get('otp')?.updateValueAndValidity();
  },
  error:(err)=>{
    this.toastService.error(err.error.message);
    this.isOtpRequired=false;
  }
})
  }

  verifyandRedirect():void{
    const formValues=this.signInForm.value;
    const payload={
      email:formValues.email,
      otp:formValues.otp
    }
    this.authService.verifyOtp(payload).subscribe({
      next:(res)=>{
        this.authService.setToken(res?.accessToken);
        this.toastService.success('Success!','redirecting to homepage');
        this.isOtpRequired=false;
        this.signInForm.get('otp')?.clearValidators();
        this.signInForm.get('otp')?.updateValueAndValidity();
        this.router.navigate(['/dashboard']);
      },
      error:(err)=>{
        this.toastService.error(err.error?.message);
        this.isOtpRequired=true;
      }
    })
  }
  onForgotPassword():void{
   this.router.navigate(['/reset-password']);
  }
}
