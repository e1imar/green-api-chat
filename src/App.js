import './App.css';
import Chat from './chat/Chat';
import React from 'react';
import Login from "./login/Login";
import Sidebar from './sidebar/Sidebar';
import { BrowserRouter , Routes, Route } from "react-router-dom";
import { useStateValue } from "./login/StateProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export const queryClient = new QueryClient()

function App() {
  const [{user}] = useStateValue();
  const uid = localStorage.getItem("uid") !== undefined ? localStorage.getItem("uid") : null;

  return <QueryClientProvider client={queryClient}>
    <div className="chat">
      {uid ? <div className="chat__body">
        <BrowserRouter>
          <Sidebar />
          <Routes>
            <Route  path="/rooms/:chatId" element={<Chat />}/>
          </Routes>
        </BrowserRouter>
      </div> : <Login/>}
    </div>
  </QueryClientProvider>
}

export default App;
