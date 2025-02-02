import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Alert, IconButton, Tooltip} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";
import {useState} from "react";
import {fetchUrl} from "./api";

export default function AddContactDialog({addContact}) {
    const [open, setOpen] = useState(false);

    const [invalidNumber, setInvalidNumber] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <IconButton>
                <Tooltip title="Add contact">
                    <AddCircleOutline  onClick={handleClickOpen} style={{color:"#B1B3B5"}}/>
                </Tooltip>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const number = formJson.number;

                        fetch(fetchUrl('checkWhatsapp'), {
                            method: 'post',
                            body: JSON.stringify(({phoneNumber: number}))
                        })
                            .then(resp => resp.json())
                            .then(resp => {
                                const exists = resp.existsWhatsapp
                                if (!exists) setInvalidNumber(true)
                                else {
                                    addContact(number)
                                    handleClose()
                                }
                            })
                    },
                    style: {backgroundColor: '#b1b3b5'}
                }}
            >
                <DialogTitle>Add contact</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter phone number
                    </DialogContentText>
                    {invalidNumber && <Alert severity="error">Invalid number</Alert>}
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="number"
                        label="Phone number"
                        type="number"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}