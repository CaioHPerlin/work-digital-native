import React from "react";
import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import Routes from "./routes/routes";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ChatNotificationsProvider } from "../hooks/ChatNotificationsContext";
import { useNetInfo } from "@react-native-community/netinfo";
import { View } from "react-native-animatable";
import { Dimensions, Text } from "react-native";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();
  const [loaded, error] = useFonts({
    "TitanOne-Regular": require("../assets/fonts/TitanOne-Regular.ttf"),
  });

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if (!session) {
    return (
      <>
        {netInfo.isConnected ? (
          <Routes session={session} />
        ) : (
          <View style={[styles.fullScreen, { paddingTop: insets.top }]}>
            <View style={styles.shadowBackground}>
              <Text style={styles.errorText}>
                Conexão de internet não detectada.
              </Text>
            </View>
          </View>
        )}
      </>
    );
  }

  return (
    <ChatNotificationsProvider userId={session.user.id}>
      {netInfo.isConnected ? (
        <Routes session={session} />
      ) : (
        <View style={[styles.fullScreen, { paddingTop: insets.top }]}>
          <View style={styles.shadowBackground}>
            <Text style={styles.errorText}>
              Conexão de internet não detectada.
            </Text>
          </View>
        </View>
      )}
    </ChatNotificationsProvider>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  shadowBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Shadowy background
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
