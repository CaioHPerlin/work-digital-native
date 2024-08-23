import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = "https://rifxrmtuciujxukicvkn.supabase.co";
// É seguro compartilhar a chave de API abaixo uma vez que temos os mecanismos de segurança habilitados na supabase
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpZnhybXR1Y2l1anh1a2ljdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyMDQ1NTAsImV4cCI6MjAzOTc4MDU1MH0.8vMQUMCuIPnnCw4s2Ht9Q5C53zIy9YryPord9DfHgvI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
