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
  id: number;
  user_id: string;
  roles: string[];
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  highlights: any;
  description: string;
  profile_picture: string;
  picture_folder: string;
};

export type Conversation = {
  id: string;
  user_id?: string;
  freelancer_id?: string;
  freelancer_name?: string;
  user_name?: string;
  freelancer_profile_id?: string;
};
