import React, {useState} from 'react'
import "./Chat.css";
import { Avatar } from '@mui/material';
import Divider from '@mui/material/Divider';
import { useParams } from "react-router-dom";
import {useGetChat, useGetNotifications, useSendMessage} from "../api";
import useChatScroll from "../useChatScroll";

function Chat() {
    const[message, setMessage]=useState("");
    const { chatId } = useParams();

    const {data: messages} = useGetChat({variables: chatId})

    const sendMessage = useSendMessage()
    useGetNotifications()

    const ref = useChatScroll(messages)

function SendMessage(e){
    e.preventDefault();
    if (message.length > 0) {
        sendMessage.mutate({chatId, message})
        setMessage('');
      }
}

    return <div className="Chat">
        <div className="Chat__header">
            <Avatar src=''/>

            <div className="Chat__headerinfo">
            </div>
        </div>
        <Divider/>
        <div className="Chat__body" ref={ref}>
            {messages?.toReversed().map(({senderName, textMessage, idMessage, type})=>(
                <p key={idMessage} className={`Chat__Messages  ${type === 'outgoing' && "Chat__Reciver"}`}>
                    <span className='Chat__Name'>{senderName}</span>
                    <br></br>
                    {textMessage}
                </p>
            ))}
        </div>

        <div className="Chat__footer">
            <form>
                <input type="text" value={message} onChange={(e)=> setMessage(e.target.value)}
                       placeholder='Send a message'/>
                <button type="submit" onClick={SendMessage}>Send Messages</button>
            </form>
        </div>
    </div>
}

export default Chat
