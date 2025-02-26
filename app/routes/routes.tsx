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
import BecomeAutonomo from "../screens/opcoesConfig/BecomeAutonomo";
import ChangePassword from "../screens/opcoesConfig/ChangePassword";
import DadosPessoais from "../screens/DadosPessoais";
import ChangeCity from "../screens/ChangeCity";
import FreelancerDetails from "../screens/FreelancerDetails";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import ChatList from "../screens/ChatList";
import ChatScreen from "../screens/ChatScreen";
import { supabase } from "../../lib/supabase";
import { Alert, Dimensions, Text, View } from "react-native";
import FreelancerProfile from "../screens/FreelancerProfile";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const screenWidth = Dimensions.get("window").width;
const drawerWidth = Math.min(310, screenWidth * 0.85);

const DrawerContent = (props: any) => {
  const [loading, setLoading] = React.useState(false);
  const handleLogout = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      Alert.alert("Erro ao sair.", "Verifique sua conexão.");
    }

    setLoading(false);
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={loading ? "Saindo..." : "Sair"}
        labelStyle={{ color: "#FFF" }}
        activeTintColor="white"
        inactiveTintColor="white"
        activeBackgroundColor="#FFC88d"
        icon={({ color, size }) => (
          <Ionicon name="exit-outline" color={color} size={size} />
        )}
        onPress={handleLogout}
        style={{
          borderWidth: 2,
          borderColor: "#FFC88d",
          borderRadius: 0,
        }}
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
      }
    };

    checkFreelancerState();
  }, [session?.user.id]);

  return (
    <Stack.Navigator
      initialRouteName={session ? "HomeScreen" : "Login"} // Redirect based on session
      screenOptions={{ headerShown: false, animation: "fade" }}
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
                header: () => <Header title={route.name} />,
                drawerStyle: { backgroundColor: "#2d47f0", width: drawerWidth },
                headerStyle: { height: 80, backgroundColor: "#2d47f0" },
                headerTitleStyle: { color: "#f27e26" },
                drawerActiveBackgroundColor: "#FFC88d",
                drawerInactiveTintColor: "white",
                drawerActiveTintColor: "white",
                drawerItemStyle: {
                  borderWidth: 2,
                  borderColor: "#FFC88d",
                  borderRadius: 0,
                  marginBottom: 8,
                },
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
                  name="Perfil de Prestador"
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
      <Stack.Screen name="FreelancerDetails" component={FreelancerDetails} />
      {session && (
        <Stack.Screen name="ChatList">
          {(props) => <ChatList {...props} userId={session.user.id} />}
        </Stack.Screen>
      )}
      <Stack.Screen
        name="ChatScreen"
        children={(props: any) => <ChatScreen {...props} />}
      />
    </Stack.Navigator>
  );
};

export default Routes;
