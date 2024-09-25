import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Session } from "@supabase/supabase-js"; // Import Session type

import RegisterAccount from "../screens/RegisterAccount";
import Login from "../screens/Login";
import HomeScreen from "../screens/HomeScreen";
import PersonalInfo from "../screens/PersonalInfo";
import BecomeAutonomo from "../screens/opcoesConfig/BecomeAutonomo";
import ChangePassword from "../screens/opcoesConfig/ChangePassword";
import DadosPessoais from "../screens/DadosPessoais";
import ChangeCity from "../screens/ChangeCity";
import FreelancerDetails from "../screens/FreelancerDetails";
import SliderDestaque from "../components/SliderDestaque";
import Slider from "../components/Slider";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import ChatList from "../screens/ChatList";
import { useNavigation } from "@react-navigation/native";
import { CustomStackNavigationProp } from "../types";
import ChatScreen from "../screens/ChatScreen";
import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";
import FreelancerProfile from "../screens/FreelancerProfile";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerContent = (props: any) => {
  const navigation = useNavigation<CustomStackNavigationProp>();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      Alert.alert("Erro ao sair.", error.message);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sair"
        labelStyle={{ color: "#FFF" }}
        activeTintColor="white"
        inactiveTintColor="white"
        activeBackgroundColor="#FFC88d"
        icon={({ color, size }) => (
          <Ionicon name="exit-outline" color={color} size={size} />
        )}
        onPress={handleLogout}
        style={{ borderWidth: 2, borderColor: "#FFC88d" }}
      />
    </DrawerContentScrollView>
  );
};

interface RoutesProps {
  session: Session | null;
}

const Routes: React.FC<RoutesProps> = ({ session }) => {
  const [isFreelancer, setIsFreelancer] = React.useState(false);

  React.useEffect(() => {
    const checkFreelancerState = async () => {
      if (!session) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("is_freelancer")
        .eq("id", session?.user.id);

      if (error) {
        return;
      }

      if (data && data.length > 0) {
        setIsFreelancer(data[0].is_freelancer);
        console.log(data[0].is_freelancer);
      } else {
        setIsFreelancer(false);
        console.log(false);
      }
    };

    checkFreelancerState();
  }, [session?.user.id]);

  return (
    <Stack.Navigator
      initialRouteName={session ? "HomeScreen" : "Login"} // Redirect based on session
      screenOptions={{ headerShown: false }}
    >
      {!session ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="RegisterAccount" component={RegisterAccount} />
        </>
      ) : (
        <Stack.Screen name="HomeScreen">
          {() => (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              screenOptions={({ route }) => ({
                header: () => (
                  <Header title={route.name} userId={session.user.id} />
                ),
                drawerStyle: { backgroundColor: "#2d47f0", width: 310 },
                headerStyle: { height: 80, backgroundColor: "#2d47f0" },
                headerTitleStyle: { color: "#f27e26" },
                drawerActiveBackgroundColor: "#FFC88d",
                drawerInactiveTintColor: "white",
                drawerActiveTintColor: "white",
                drawerItemStyle: { borderWidth: 2, borderColor: "#FFC88d" },
              })}
            >
              <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  drawerIcon: ({ color, size }) => (
                    <Icon name="home" color={color} size={size} />
                  ),
                }}
              />
              {!isFreelancer && (
                <Drawer.Screen
                  name="Dados Pessoais"
                  options={{
                    drawerIcon: ({ color, size }) => (
                      <Icon name="user" color={color} size={size} />
                    ),
                  }}
                >
                  {(props) => (
                    <DadosPessoais {...props} userId={session.user.id} />
                  )}
                </Drawer.Screen>
              )}
              <Drawer.Screen
                name="Alterar Cidade"
                options={{
                  drawerIcon: ({ color, size }) => (
                    <Icon name="map-marker" color={color} size={size} />
                  ),
                }}
              >
                {(props) => <ChangeCity {...props} userId={session.user.id} />}
              </Drawer.Screen>
              <Drawer.Screen
                name="Alterar Senha"
                options={{
                  drawerIcon: ({ color, size }) => (
                    <Icon name="lock" color={color} size={size} />
                  ),
                }}
              >
                {(props) => (
                  <ChangePassword {...props} userId={session.user.id} />
                )}
              </Drawer.Screen>
              {!isFreelancer ? (
                <Drawer.Screen
                  name="Prestar Serviços"
                  component={BecomeAutonomo}
                  options={{
                    drawerIcon: ({ color, size }) => (
                      <Icon name="briefcase" color={color} size={size} />
                    ),
                  }}
                />
              ) : (
                <Drawer.Screen
                  name="Meu Perfil de Prestador"
                  options={{
                    drawerIcon: ({ color, size }) => (
                      <Icon name="briefcase" color={color} size={size} />
                    ),
                  }}
                >
                  {(props) => (
                    <FreelancerProfile {...props} userId={session.user.id} />
                  )}
                </Drawer.Screen>
              )}
            </Drawer.Navigator>
          )}
        </Stack.Screen>
      )}
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
      <Stack.Screen name="FreelancerDetails" component={FreelancerDetails} />
      <Stack.Screen name="SliderDestaque" component={SliderDestaque} />
      <Stack.Screen name="Slider" component={Slider} />
      {session && (
        <Stack.Screen
          name="ChatList"
          options={{ animation: "slide_from_right" }}
        >
          {(props) => <ChatList {...props} userId={session.user.id} />}
        </Stack.Screen>
      )}
      <Stack.Screen
        name="ChatScreen"
        children={(props: any) => <ChatScreen {...props} />}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
};

export default Routes;
