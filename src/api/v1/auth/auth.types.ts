export interface SignupDTO {
  fullName: string;
  email: string;
  mobile: string;
  password?: string; // Optional for admin creation
}

export interface LoginDTO {
  email: string;
  password?: string;
  otp?: string;
}

export interface OtpVerificationDTO {
  email?: string;
  mobile?: string;
  otp: string;
}
