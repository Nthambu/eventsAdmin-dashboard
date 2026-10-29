export interface EventDto {
  id: string;
  name: string;
  description: string;
  venue: string;
  city: string;
  state: string;
  event_date: string;
  ticket_types: TicketTypeDto[];
  facebook_url: string;
  image_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketTypeDto {
  name: string;
  price: number;
  available: number;
  description: string;
}
export interface UserLoginsDto{
  email:string;
  password:string
}
export interface UserLoginResponse{
message:string;
step2Required:boolean;
}
export interface VerifyOtpDto{
email:string;
otp:string;
}
export interface VerifyOtpResponse{
  accessToken:string;
}
export interface AdminRegisterDto{
  email:string;
  password:string;
  username:string;
  role:string;
}