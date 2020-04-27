window.addEventListener('load', ready);

function ready() {

  // Toggle Landing and LogIn PopUp Blocks;
  (function() {
    const logInPopUp = document.querySelector('#popup-login');
    const landIngPopUp = document.querySelector('#popup-landing');
    const logInPageLink = document.querySelector('.header__auth-link');
    const backHomePageLink = document.querySelector('.header__back-link');

    logInPopUp.style.display = 'none';

    logInPageLink.addEventListener('click', ()=>{
      landIngPopUp.style.display = 'none';
      logInPopUp.style.display = 'block';
    });

    backHomePageLink.addEventListener('click', ()=>{
      landIngPopUp.style.display = 'block';
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

