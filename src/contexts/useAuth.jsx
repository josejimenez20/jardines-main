import { createContext, useState,useContext } from "react";
import api from "../shared/api";
// import { config } from "../config";

const AuthContext = createContext(undefined);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/users/me");
      const data = response.data;
      if (data.error) {
        throw new Error("Failed to fetch user data");
      }
      setUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (error) {
      console.error("Fetch user data error:", error);
    }
  }

  const login = async (userData) => {
    try {
      const response = await api.post("/auth/login", userData);
      const data = response.data;

      if (data.message !== "Login successful") {
        throw new Error("Login failed");
      }

      const userResponse = await api.get("/users/me");
      const userDataResponse = userResponse.data;
      if (userDataResponse.error) {
        throw new Error("Failed to fetch user data");
      }
      setUser(userDataResponse);
      localStorage.setItem("currentUser", JSON.stringify(userDataResponse));
      return userDataResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/users", userData);
      const data = response.data;
      setUser(data);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };


  const changePassword = async (userData) => {
    try{
      const response = await api.post('/auth/change-password',userData);
      const data = response.data;
      return data;
    }catch(e){
      console.error("Error al cambiar password", e);
      throw e;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, fetchUserData, changePassword}}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};