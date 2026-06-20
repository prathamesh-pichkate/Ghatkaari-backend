export interface SignupDTO { // DTO is data transfer object used for passing data between layers of an application, such as the client and server. It is a plain object that contains only the data that is needed for the specific operation.
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
}

export interface LoginDTO {
  email: string;
  password?: string; // ?- means optional
  otp?: string;
}

export interface OtpVerificationDTO { // interface - interface used for defining the shape of an object and for type checking. It is a blueprint for creating objects.
  email?: string;
  mobile?: string;
  otp: string;
}
