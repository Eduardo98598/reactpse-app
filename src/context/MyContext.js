import React, { createContext, useReducer } from 'react';

// estado inicial del contexto
const initialState = {
  data: []
};

// función reductora que actualiza el estado del contexto
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

// crea el contexto y su proveedor
export const MyContext = createContext(initialState);
export const MyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      {children}
    </MyContext.Provider>
  );
};
