import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(),
    marginLeft: 'auto', // ajustar la posición del icono a la izquierda
    fontSize: '3rem', // cambiar el tamaño del icono
    width: 'auto'/* Ajusta este valor según tu preferencia */
  },
  list: {
    width: 250,
  },
}));
const Navigation = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const drawerList = () => (
    <div
      role="presentation"
      onClick={handleDrawerClose}
      onKeyDown={handleDrawerClose}
    >
      <List>
        <ListItem button component={Link} to="/home">
          <ListItemText primary="Inicio" />
        </ListItem>
        <ListItem button component={Link} to="/contact">
          <ListItemText primary="Contacto" />
        </ListItem>
        <ListItem button component={Link} to="/about">
          <ListItemText primary="Acerca" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h2" style={{ justifyContent: 'left' }}>
            Reactse App
          </Typography>
        </div>
        <div  style={{ flexGrow: 1, justifyContent: 'center', display: 'flex',marginRight: '30rem' }}>
          <Button color="inherit" component={Link} to="/home" style={{ fontSize: '2rem' }}>
            Inicio
          </Button>
          <Button color="inherit" component={Link} to="/contact" style={{ fontSize: '2rem' }}>
            Contacto
          </Button>
          <Button color="inherit" component={Link} to="/about" style={{ fontSize: '2rem' }}>
            Acerca
          </Button>
        </div>
        <Drawer anchor="left"  open={open} onClose={handleDrawerClose}>
          {drawerList()}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
