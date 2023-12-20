import { createContext, useReducer, useEffect } from 'react'
import { LOGIN_ACTION, LOGOUT_ACTION } from './Actions'
// import { Cookies, useCookies}  from 'react-cookie'


export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_ACTION:
      return { ...state, user: action.payload }
    case LOGOUT_ACTION:
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  // useEffect(() => {
    
  //   const user = Cookies.authToken;

  //   if (user) {
  //     dispatch({ type: LOGIN_ACTION, payload: user })
  //   }

  // }, [])

  console.log('AuthContext state:', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )

}