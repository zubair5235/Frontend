import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../api/ApiClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [userid, setUserid] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useState(null);


    useEffect(() => {
        if (user) {
            addAuthorization();
            setIsLoggedIn(true);
        }
    }, [user]);


    const login = (userDetails, passwordValue) => {
        sessionStorage.setItem(`token`, ("Basic " + window.btoa(userDetails.username + ":" + passwordValue)));
        setUserid(userid);
        setUser({...userDetails, password: passwordValue});
    };

    const addAuthorization = () => {
        apiClient.interceptors.request.use(config => {
            // Use the latest value of the username and password
            if (user) {
                console.log(`Username : ${user.username}, Token : ${sessionStorage.getItem(`token`)}`)
                config.headers.Authorization = sessionStorage.getItem(`token`);
            }
            return config;
        });


    }


    const changeCredentials = (usernameValue, emailValue, passwordValue) => {
        sessionStorage.setItem(`token`, ("Basic " + window.btoa(usernameValue + ":" + passwordValue)));
        setUser((oldValue) => {
            return { ...oldValue, username: usernameValue, email: emailValue, password: passwordValue }
        });
    }

    const logout = () => {

        console.log("I am called ")
        const role = user.role;
        sessionStorage.removeItem(`token`);
        setUser(null);
        setIsLoggedIn(false);
        
        if (role === "USER")
            navigate("/home");
        else
            navigate("/admin/login")
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, changeCredentials }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;