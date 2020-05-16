window.addEventListener('load', ready);

function ready() {

  // Toggle Landing and LogIn PopUp Blocks;
  (function() {
    const authPopUp = document.querySelector('#popup-auth');
    const logInPopUp = document.querySelector('#popup-login');
    const landIngPopUp = document.querySelector('#popup-landing');
    const AuthPageLink = document.querySelector('.header__auth-link');
    const loginPageLink = document.querySelector('.header__login-link');
    const backHomePageLink = document.querySelector('.header__back-link');
    const backHome = document.querySelector('.back-link');

    logInPopUp.style.display = 'none';
    authPopUp.style.display = 'none';

    AuthPageLink.addEventListener('click', ()=>{
      landIngPopUp.style.display = 'none';
      authPopUp.style.display = 'block';
      logInPopUp.style.display = 'none';
    });

    loginPageLink.addEventListener('click', ()=>{
      landIngPopUp.style.display = 'none';
      authPopUp.style.display = 'none';
      logInPopUp.style.display = 'block';
    });

    backHomePageLink.addEventListener('click', ()=>{
      landIngPopUp.style.display = 'block';
      authPopUp.style.display = 'none';
      logInPopUp.style.display = 'none';
    });

    backHome.addEventListener('click', ()=>{
      landIngPopUp.style.display = 'block';
      authPopUp.style.display = 'none';
      logInPopUp.style.display = 'none';
    });

  })();


  // SignIn Logic:
  (function () {
    let signInData;
    document.querySelector('#signin-form').addEventListener('submit', () => {
      const username = document.querySelector('#useremail').value;
      const password = document.querySelector('#password').value;

      signInData = {
        username,
        password
      };

      browser.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        browser.tabs.sendMessage(activeTab.id, {"signInData": signInData});
      });
    });
  })();


}

