import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .dx-textbox': {
            width: '100%',
            marginBottom: theme.spacing(2),
            borderRadius: theme.spacing(1),
            border: '1px solid #ccc',
            padding: theme.spacing(1),
            fontSize: '2rem',
        },
        '& .dx-button': {
            background: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            letterSpacing: '1px',
            borderRadius: theme.spacing(1),
            padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
            textTransform: 'uppercase',
            '&:hover': {
                background: '#0069d9',
            },
        },
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        width: '100%',// Modificado para hacer más grande el formulario
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    button: {
        margin: theme.spacing(2),
        color: '#fff',
        backgroundColor: '#4CAF50',
        '&:hover': {
            backgroundColor: '#388E3C',
        },
    },
    icon: {
        marginRight: theme.spacing(1),
    },
}));

function Contact() {
    const classes = useStyles();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        const encodedTitle = encodeURIComponent(title);
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?phone=9851161077&text=${encodedTitle}%0A${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className={classes.container}>
            <h2>Contáctame</h2>
            <form className={classes.form}>
                <TextField id="title" label="Título" variant="outlined" value={title} onChange={handleTitleChange} />
                <TextField id="message" label="Mensaje" variant="outlined" multiline rows={4} value={message} onChange={handleMessageChange} />
                <Button variant="contained" className={classes.button} onClick={handleSendMessage}>
                    <WhatsAppIcon className={classes.icon} />
                    Enviar mensaje de WhatsApp
                </Button>
            </form>
        </div>
    );
}

export default Contact;
