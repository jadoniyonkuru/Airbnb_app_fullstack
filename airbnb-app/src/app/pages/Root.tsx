import { Outlet, useNavigation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { NavigationLoader } from '../components/shared/LoadingScreen';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthModalProvider } from '../context/AuthModalContext';

export function Root() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <ThemeProvider>
      <AuthModalProvider>
        <AnimatePresence>
          {isLoading && <NavigationLoader key="nav-loader" />}
        </AnimatePresence>
        <Outlet />
      </AuthModalProvider>
    </ThemeProvider>
  );
}