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
  Chat: undefined;
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

export type DrawerNavigationPropType = DrawerNavigationProp<DrawerParamList>;

export type NavigationPropType = DrawerNavigationPropType; // Adjust if needed
