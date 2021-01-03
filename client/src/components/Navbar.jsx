import React, { useState } from 'react';
import superuser from '../helpers/superuser.js';

export default function Navbar(props) {
  const navStyle = {
    backgroundColor: '#e3f2fd'
  }
  const signIn = (username, password) => {
    if (username === superuser.username && password === superuser.password) {
      props.setSignedIn(true);
    } else {
      alert('Username and/or password not found!');
    }
  }
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light" style={navStyle}>
        <a className="navbar-brand" href="#!">Recipe Calculator</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item" onClick={() => props.setPage('recipes')}>
              <a className="nav-link" href="#">Recipes</a>
            </li>
            <li className="nav-item" onClick={() => props.setPage('ingredientform')}>
              <a className="nav-link" href="#">Add Ingredients</a>
            </li>
            <li className="nav-item" onClick={() => props.setPage('recipeform')}>
              <a className="nav-link" href="#">Create Recipe</a>
            </li>
          </ul>
        </div>
        {/* Sign-In Form */}
        {props.signedIn ? <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => props.setSignedIn(false)}>Sign Out</button> :
          (<form className="form-inline">
            <input className="form-control mr-sm-2" type="text" value={username}placeholder="Username" onChange={() => setUsername(event.target.value)}/>
            <input className="form-control mr-sm-2" type="password" value={password}placeholder="Password" onChange={() => setPassword(event.target.value)}/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={() => signIn(username, password)}>Sign In</button>
          </form>)}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
    <br />
    </div>
)}
