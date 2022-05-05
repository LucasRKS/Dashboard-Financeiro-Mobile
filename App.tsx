import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

import AppProvider from './src/hooks';

import Routes from './src/routes';
import themes from './src/styles/themes';

const App: React.FC = () => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer>
        <ThemeProvider theme={themes.normal}>
          <StatusBar style="light" />
          <AppProvider>
            <Routes />
          </AppProvider>
        </ThemeProvider>
      </NavigationContainer>
    );
  }
};

export default App;
