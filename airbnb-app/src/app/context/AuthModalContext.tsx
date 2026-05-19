import { createContext, useContext, useState, type ReactNode } from 'react';
import { LoginModal } from '../components/shared/LoginModal';
import { SignupModal } from '../components/shared/SignupModal';

interface AuthModalContextType {
  openLoginModal: (redirectAfterLogin?: string) => void;
  openSignupModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  openLoginModal: () => {},
  openSignupModal: () => {},
});

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [showLogin,  setShowLogin]  = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState<string | undefined>(undefined);

  return (
    <AuthModalContext.Provider
      value={{
        openLoginModal: (redirectAfterLogin?: string) => {
          setLoginRedirect(redirectAfterLogin);
          setShowLogin(true);
        },
        openSignupModal: () => setShowSignup(true),
      }}
    >
      {children}
      <LoginModal
        isOpen={showLogin}
        onClose={() => { setShowLogin(false); setLoginRedirect(undefined); }}
        onSwitchToRegister={() => { setShowLogin(false); setShowSignup(true); }}
        redirectAfterLogin={loginRedirect}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
      />
    </AuthModalContext.Provider>
  );
}
