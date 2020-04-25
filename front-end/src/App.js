import React from 'react';

import logo from './logo-96.png';
import './App.css';

function App() {

  return (
    <div id="popup-content">
      <header className="header">
        <div className="header__logo">
          <img className="header__logo-image" src={logo} alt='Subtite logo'/>
          <span className="header__logo-title">Subtite.it</span>
        </div>
        <div className="header__auth">
          <a className="header__auth-link" href="#">Sign In</a>
        </div>
      </header>
      <main className="main">
        <span className="main__content">
          Do you want to contribute to the world community and translate a short sample of this video?
        </span>
      </main>
    </div>

    // <div id="popup-content">
    //   <header className="header">
    //     <img className="header__image" src={logo} alt='Subtite logo'/>
    //     <div className="header__auth">
    //       {/*<a className="header__auth-link" href="#">Back</a>*/}
    //     </div>
    //   </header>
    //   <main className="main">
    //     <h4 className="main__form-title">Sign In</h4>
    //     <form className="main__form" autoComplete="on">
    //         <input
    //           name="username"
    //           className="main__form-input"
    //           type="text" placeholder="Name"
    //           required={true}
    //           autoFocus={true}/>
    //         <input
    //           required={true}
    //           name="password"
    //           className="main__form-input"
    //           type="password"
    //           placeholder="Password"
    //         />
    //         <button
    //           className="main__form-submit"
    //           type="submit">Sign In</button>
    //     </form>
    //   </main>
    // </div>

  );
}

export default App;
