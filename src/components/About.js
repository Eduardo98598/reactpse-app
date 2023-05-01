import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
  paragraph: {
    color: '#333',
    fontSize: '20px',
    lineHeight: '1.5',
    marginBottom: '16px',
    maxWidth : '600px',
    textAlign: 'justify',
    [theme.breakpoints.up('sm')]: {
      fontSize: '18px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '20px',
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
function About() {
  const classes = useStyles();

  return (<div className={classes.container}>
    <h2>Acerca de</h2>
    <form className={classes.form}>
      <p className={classes.paragraph}>
        ReactSe App  es una herramienta WebService para la consulta de información de las empresas dados de alta en la plataforma de
        Repse con el fin de validar o cotejar de acuerdo a sus necesidades.
      </p>
      <p className={classes.paragraph}>
        La licencia mensual tiene un costo bajo, ir a seccion de <a href='/contact'>Contacto</a> para más información
      </p>
    </form>
  </div>
  );
}

export default About;
