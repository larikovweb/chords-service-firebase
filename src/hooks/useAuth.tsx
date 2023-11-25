import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { TRACKS_ROUTE } from '../utils/consts';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate(TRACKS_ROUTE);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Отписка при размонтировании компонента
    return () => unsubscribe();
  }, []);

  return {
    isAuth: !!user?.email,
    email: user?.email,
    token: user?.getIdToken(),
    id: user?.uid,
    logout,
  };
};
