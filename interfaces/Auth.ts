export interface SignUpUser {
  name: string;
  email: string;
  password: string;
  state: string;
  city: string;
  isFreelancer: boolean;
}

export interface SignUpFreelancer extends SignUpUser {
  cpf: string;
  phoneNumber: string;
  birthDate: string;
  profilePhoto?: string;
}
