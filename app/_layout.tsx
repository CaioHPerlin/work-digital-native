import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
      options={{
        title: '',
        headerShown: false
        
      }}
      name="index" />
    </Stack>
  );
}
