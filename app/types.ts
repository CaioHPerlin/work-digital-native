// types.ts
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  PageInicial: undefined;
  RegisterAccount: undefined;
  Login: undefined;
  HomeScreen: undefined;
  PersonalInfo: undefined;
  FreelancerDetails: undefined;
  SliderDestaque: undefined;
  Slider: undefined;
  ChatList: undefined;
  ChatScreen: { conversationId: string };
};

export type DrawerParamList = {
  Home: undefined;
  Configurações: undefined;
  DadosPessoais: undefined;
  TornarSeAutonomo: undefined;
  AlterarCidade: undefined;
  AlterarSenha: undefined;
  Teste: undefined;
};

export type CustomStackNavigationProp = StackNavigationProp<RootStackParamList>;

export type Freelancer = {
  cpf: string;
  phone_number: string;
  birthdate: string;
  profile_picture_url: string | null;
  roles: string[];
};

export type Profile = {
  id: string;
  email: string;
  name: string;
  state: string;
  city: string;
  freelancers: Freelancer; // Freelancer is an object, not an array
};

export type FlattenedProfile = Profile & {
  cpf: any;
  phone_number: any;
  birthdate: any;
  profile_picture_url: any | null;
  roles: any[];
};

export type Conversation = {
  id: string;
  user_id?: string;
  freelancer_id?: string;
  freelancer_name?: string;
  user_name?: string;
  freelancer_profile_id?: string;
};
