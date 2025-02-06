import React,{useState} from 'react'
import "./sidebar.css"
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { ExitToAppOutlined } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Sidebarchat from './Sidebarchat';
import AddContactDialog from "../AddContactDialog";
import {useGetContact} from "../api";
import {useNavigate} from "react-router-dom";

function Sidebar() {
    const[contacts, setContacts]= useState({});
    const navigate = useNavigate()

function logout () {
    localStorage.removeItem("uid");
    localStorage.removeItem("displayName");
    localStorage.removeItem("photoURL");
    localStorage.removeItem("idInstance");
    localStorage.removeItem("apiTokenInstance");
    navigate('/')
    window.location.reload();
}

 const addContact = number => {
    const chatId = number + '@c.us'

     if (!Object.hasOwn(contacts, chatId)) useGetContact.mutationFn(chatId)
         .then(contact => {
             setContacts(prev => ({[contact.chatId || chatId]: {chatId, name: number, ...contact}, ...prev}))
             navigate(`/rooms/${chatId}`)
         })
 }

    const photoURL = localStorage.getItem("photoURL") !== "" ? localStorage.getItem("photoURL") : null;
    const displayName = localStorage.getItem("displayName");

    return <div className="Sidebar">
        <div className="Sidebar__header">
            <Avatar style={{marginLeft:"15px"}} src={photoURL}/>
            <b className="TEXT">{displayName}</b>
            <div className="Sidebar__headerRight">
                <AddContactDialog addContact={addContact}/>
                <IconButton onClick={logout}>
                    <Tooltip title="Logout">
                        <ExitToAppOutlined   style={{color:"#B1B3B5"}}/>
                    </Tooltip>
                </IconButton>
            </div>
        </div>
        <Divider/>
        <div className="Sidebar__chats">
            {Object.keys(contacts).map(chatId => (
                <Sidebarchat key={chatId} id={chatId} name={contacts[chatId].name} avatar={contacts[chatId].avatar} />
            ))}
        </div>
    </div>
}

export default Sidebar;
