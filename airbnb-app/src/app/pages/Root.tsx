import { Outlet, useNavigation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { NavigationLoader } from '../components/shared/LoadingScreen';
import { ThemeProvider } from '../context/ThemeContext';

export function Root() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <ThemeProvider>
      <AnimatePresence>
        {isLoading && <NavigationLoader key="nav-loader" />}
      </AnimatePresence>
      <Outlet />
    </ThemeProvider>
  );
}