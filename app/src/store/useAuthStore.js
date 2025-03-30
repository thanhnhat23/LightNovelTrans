import { create } from 'zustand';
import { axiosInstanace } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingBackground: false,
    isUpdatingInfo: false,
    isForgotPassword: false,
    isResetPassword: false,
    isCheckingAuth: true,

    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstanace.get('/auth/check');
            set({authUser: res.data});

            get().connectSocket();
        } catch (error) {
            console.log('Error in checkAuth: ', error)
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstanace.post('/auth/signup', data);
            toast.success('Account created successfully');
            set({authUser: res.data});

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false});
        }
    },

    login: async (data) => {
      set({isLoggingIn: true});
      try {
        const res = await axiosInstanace.post('/auth/login', data);
        toast.success('Logged in successfully');
        set({authUser: res.data});
        get().connectSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({isLoggingIn: false});
      }
    },

    logout: async () => {
        try {
            await axiosInstanace.post('/auth/logout');
            set({authUser: null});
            toast.success('Logged out successfully');

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    forgotPassword: async (data, navigate) => {
        set({isForgotPassword: true});
        try {
            await axiosInstanace.post('/auth/forgot-password', data);
            toast.success('Password reset email sent successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isForgotPassword: false});
        }
    },

    resetPassword: async (data, navigate) => {
        set({isResetPassword: true});
        try {
            const res = await axiosInstanace.post(`/auth/reset-password/${data.resetPasswordToken}`, data);
            toast.success('Password reset successfully');
            set({authUser: res.data});
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isResetPassword: false});
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstanace.put('/auth/update-profile', data);
            toast.success('Profile updated successfully');
            set({authUser: res.data});
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingProfile: false});
        }
    },

    updateBackground: async (data) => {
        set({isUpdatingBackground: true});
        try {
            const res = await axiosInstanace.put('/auth/update-background', data);
            toast.success('Background updated successfully');
            set({authUser: res.data});
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingBackground: false});
        }
    },

    updateInfo: async (data) => {
        set({isUpdatingInfo: true});
        try {
            const res = await axiosInstanace.put('/auth/update-info', data);
            toast.success('Info updated successfully');
            set({authUser: res.data});
        }
        catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isUpdatingInfo: false});
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();

        set({socket: socket});
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
        });
    },
    
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}))