import { createContext, useContext, useEffect } from 'react';
import useAuth from '@/hooks/api/use-auth';
import { UserType } from '@/types/api.type';

// Define the context shape
type AuthContextType = {
  user?: UserType;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetchAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    data: authData,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  const user = authData?.user;
  //const navigate = useNavigate();

  useEffect(() => {});

  return (
    <AuthContext.Provider
      value={{
        user,
        error: authError,
        isLoading,
        isFetching,
        refetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useCurrentUserContext must be used within a AuthProvider');
  }
  return context;
};

