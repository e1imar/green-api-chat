import React, { createContext, useContext, useReducer } from "react";

// `useReducer` is usually preferable to `useState` when you have complex state logic that involves
//      * multiple sub-values. It also lets you optimize performance for components that trigger deep
//      * updates because you can pass `dispatch` down instead of callbacks.
export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
