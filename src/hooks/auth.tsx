import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../services/api';

interface AuthState {
  clients: [object];
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  clients: [object];
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [clients] = await AsyncStorage.multiGet(['@AppSeconds:clients']);

      if (clients[1]) {
        setData({ clients: JSON.parse(clients[1]) });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.get(
      `Seconds/GetClientInfo?email=${email}&password=${password}`,
    );

    const { clients } = response.data;

    if (response.data.error && response.data.error !== null) {
      return { error: response.data.error };
    }

    await AsyncStorage.multiSet([
      ['@AppSeconds:clients', JSON.stringify(clients)],
    ]);

    setData({ clients });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@AppSeconds:clients']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ clients: data.clients, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
