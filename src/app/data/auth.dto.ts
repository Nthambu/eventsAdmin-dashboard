export interface UpdatePasswordDto{
    email:string;
    password:string;
    otp:string;
}
export interface VerifyEmailResponse{
    message:string;
    step2Required:boolean;
}