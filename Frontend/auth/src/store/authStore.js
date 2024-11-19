import {create} from "zustand"
import axiosInstance from "../Config/axiosConfig";


export const useAuthStore = create((set) => ({
    user : null,
    isAuthenticated : false,
    error : null,
    isLoading : false,
    isCheckingAuth : true,

    signup : async (email, password, name) => {
        set({isLoading:true, error : null});
        try {
            const response = await axiosInstance.post("/signup", {email, password, name});
            set({user : response.data.user, isAuthenticated : true, isLoading : false});
        } catch (error) {
            set({error : error.response.data.message || "Error signing up", isLoading : false });
            throw error;
        }
    },

    login : async(email, password) => {
        set({isLoading:true, error : null});
        try {
            const response = await axiosInstance.post("/login", {email, password});
            set({user : response.data.user, isAuthenticated : true, error : null , isLoading : false});
        } catch (error) {
            set({error : error.response.data.message || "Error logi", isLoading : false });
            throw error;
        }
    },



    verifyEmail : async (verificationCode) => {
        set({isLoading : true, error : null});
        try {

            const response = await axiosInstance.post('/verify-email', { verificationCode });
            set({ user : response.data.user, isAuthenticated : true, isLoading : false });
            return response.data;
        } catch (error) {
            console.log(error);
            set({error : error.response.data.message || "Error verifying email", isLoading : false});
            throw error;
        }
    },

    checkAuth : async () => {
        set({isCheckingAuth : true, error : null});
        try {
            const response = await axiosInstance.get("/check-auth");
            set({user : response.data.user, isAuthenticated : true, isCheckingAuth : false});
        } catch (error) {
            set({error : null, isCheckingAuth : false, isAuthenticated : false});
        }
    }
}));






