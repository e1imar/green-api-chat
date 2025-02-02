import React, {useState} from "react";
import {Alert, Button, Stack, TextField} from "@mui/material";
import "./Login.css";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import {hostUrl} from "../api";

function Login() {
    const [{}, dispatch] = useStateValue();
    const [idInstance, setIdInstance] = useState('')
    const [apiTokenInstance, setApiTokenInstance] = useState('')
    const [error, setError] = useState('')

// dispatch updates the previous state
function auth(){
    setError('')

    fetch(`${hostUrl}/waInstance${idInstance}/getWaSettings/${apiTokenInstance}`)
        .then(resp => resp.json())
        .then((data) => {
            if (data?.stateInstance === 'authorized') {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: data?.phone,
                });
                dispatch({
                    type: actionTypes.SET_SESSION,
                    uid: idInstance,
                    displayName: data?.phone,
                    photoURL: data?.avatar,
                    idInstance,
                    apiTokenInstance,
                });
            }
    }).catch(() => setError('Not authorized'));
}

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/225px-WhatsApp.svg.png"
          alt="whatsapp"
        />
        <div className="login__text">
          <h1>Sign in to GREEN-API</h1>
        </div>
          <Stack spacing={2} m={2}>
              {!!error && <Alert severity="error">{error}</Alert>}
              <TextField
                  fullWidth
                  size="small"
                  type="text"
                  label="idInstance"
                  value={idInstance}
                  onChange={({target}) => setIdInstance(target.value)}
              />
              <TextField
                  fullWidth
                  size="small"
                  type="password"
                  label="apiTokenInstance"
                  value={apiTokenInstance}
                  onChange={({target}) => setApiTokenInstance(target.value)}
              />
          </Stack>
          <Button style={{background:"#0fb45c",color:"white",fontFamily:"Open sans",textTransform:"capitalize",marginTop:"20px"}} onClick={auth}>Sign In</Button>
      </div>
    </div>
  );
}

export default Login;
