import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, checkUser } from '../redux/slices/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const loginUser = (email, password) => dispatch(login({ email, password })).unwrap();
    const registerUser = (name, email, password) => dispatch(register({ name, email, password })).unwrap();
    const logoutUser = () => dispatch(logout());

    return {
        user,
        loading,
        error,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        checkUser: () => dispatch(checkUser())
    };
};
