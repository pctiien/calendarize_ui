import {createContext,useContext,useState} from 'react'

const AuthContext = createContext()

function AuthProvider({children}) {
    const [user,setUser] = useState(null)

    const getUser =()=>{
        return user;
    }
    const userLogin = user=>{
        setUser(user);
    }
    const contextValue = {
        user,
        getUser,
        userLogin
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