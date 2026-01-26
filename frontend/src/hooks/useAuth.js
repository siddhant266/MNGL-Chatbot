import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  signup as signupAction,
  login as loginAction,
  logout as logoutAction,
  updateProfile as updateProfileAction,
  clearError,
} from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleSignup = useCallback(
    (userData) => dispatch(signupAction(userData)),
    [dispatch]
  );

  const handleLogin = useCallback(
    (credentials) => dispatch(loginAction(credentials)),
    [dispatch]
  );

  const handleLogout = useCallback(
    () => dispatch(logoutAction()),
    [dispatch]
  );

  const handleUpdateProfile = useCallback(
    (updates) => dispatch(updateProfileAction(updates)),
    [dispatch]
  );

  const handleClearError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  return {
    ...authState,
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    clearError: handleClearError,
  };
};