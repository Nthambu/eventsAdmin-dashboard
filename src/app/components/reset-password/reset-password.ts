import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReactFooterWrapperComponent } from '../../shared/react-div/react-div-wrapper.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UpdatePasswordDto } from '../../data/auth.dto';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, ReactFooterWrapperComponent],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit {
  forgotPasswordForm!: FormGroup;
  otpSent = signal(false);
  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private readonly fb: FormBuilder, private toastService: ToastrService, private router: Router, private authService: Auth) {}
ngOnInit(){
  this.initializeForm();
}
initializeForm(){
  this.forgotPasswordForm=this.fb.group({
    email:['',[Validators.required,Validators.pattern(this.emailPattern)]],
    newPassword:['',Validators.required],
    confirmPassword:['',Validators.required],
    otp:['',Validators.required],
  })
}
verifyEmailAndsendOtp():void{
  this.forgotPasswordForm.markAllAsTouched();
    const email=this.forgotPasswordForm.get('email');

  if(email?.invalid){
    this.toastService.error('Invalid Email!');
    return;
  }
const payload = { email: email?.value };
this.authService.verifyEmail(payload).subscribe({
  next:(res)=>{
    this.toastService.success(res?.message ?? 'OTP has been sent successfully!');
    this.otpSent.set(true);
  },
  error:(err)=>{
    this.otpSent.set(false);
    this.toastService.error(err.error?.message ?? 'Failed to verify email. Try again later!');
  }
})
 
}
updatePassword():void{
  this.forgotPasswordForm.markAllAsTouched();
  if(this.forgotPasswordForm.invalid){
    this.toastService.error('','Please fill the required fields');
  }
  const formValues=this.forgotPasswordForm.value;
  if(formValues.newPassword !== formValues.confirmPassword){
    this.toastService.error('the passwords does not match!');
    return;
  }
 const payload: UpdatePasswordDto={
  email:formValues.email,
  password:formValues.newPassword,
  otp:formValues.otp
 }
  this.authService.updatePassword(payload).subscribe({
    next:(res)=>{
      this.toastService.success(res?.message ?? 'password updated successfully');
      this.routeToLogin();
    },
    error:(err)=>{
      this.toastService.error(err.error.message || 'failed to update password')
    }
  })
}
routeToLogin():void{
  this.router.navigate(['/login']);
}
}
