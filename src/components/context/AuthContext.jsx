import {createContext,useContext,useState} from 'react'
import { parseJwt } from '../misc/Helpers'
const AuthContext = createContext()

function AuthProvider({children}) {
    const [user,setUser] = useState(()=>{
        const savedUser = localStorage.getItem('user')
        return savedUser? JSON.parse(savedUser) : null
    })

    const getUser =()=>{
        return user;
    }
    const userLogin = user=>{
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }
    const userLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
      };
    const contextValue = {
        user,
        getUser,
        userLogin,
        userLogout
    }
    
    return <AuthContext.Provider value = {contextValue}>
        {children}
    </AuthContext.Provider>
}
export default AuthContext

export function useAuth() {
    return useContext(AuthContext)
}

export {AuthProvider}