import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
      options={{
        title: '',
        headerShown: false,
        
        
      }}
      name="index" />
    </Stack>
  );
}
