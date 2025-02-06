import React  from 'react'
import "./sidebarchat.css"
import { Link } from "react-router-dom";
import { Avatar } from '@mui/material';

function Sidebarchat ({name, id, avatar}) {
    return <Link to ={`/rooms/${id}`}  style={{textDecoration:"none"}}>
        <div className="Sidebarchat">
            <Avatar sx={{mr: 1}} src={avatar}/>
            <div className="SidebarChat_info">
                <h2 >{name}</h2>
            </div>
        </div>
    </Link>
}
export default Sidebarchat
