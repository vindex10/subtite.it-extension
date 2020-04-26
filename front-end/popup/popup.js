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


  function confirmedToTranslate() {
    // First we need to receive video link
    // GET REQUEST FOR PHRASE with link + check if signedIn
    // If all good:
    // Change PopUp content
    // sent received phrases object via message

    browser.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      browser.tabs.sendMessage(activeTab.id, {"message": "start"});
    });
  }

  let disableConfirmationButton = false;
  document.querySelector('.main__button-confirm').addEventListener('click', () => {
      if(!disableConfirmationButton) {
        confirmedToTranslate();
        disableConfirmationButton = true;
      }

  });


  // SignIn Logic:
  (function () {
    let signInData;
    document.querySelector('.main__form').addEventListener('submit', () => {
      const username = document.querySelector('#useremail').value;
      const password = document.querySelector('#password').value;

      signInData = {
        username,
        password
      };

      postData('https://batterystaple.de/auth', signInData)
        .then((dataToken) => {
          console.log(dataToken);
          // browser.storage.local.set('jwt_token', dataToken);
        })
        // .then(()=> {
        //   // get link to current video from web page. Splice till & if necessary:
        //   //GET REQUEST ('subtitle.it/phrase')- Headers jwt_token, https://www.youtube.com/watch?v=Nm8GpLCAgwk  https://www.youtube.com/watch?v=YJVj4XNASDk &t=1s
        //   // getData('batterystaple.de\n/phrase', 'https://www.youtube.com/watch?v=Nm8GpLCAgwk')
        //   //   .then((result) => {
        //   //     console.log(result);
        //   //     // receiving phrases and put into form on web page.
        //   //   })
        //   //   .catch((error)=> {
        //   //     console.log('Error:', error)
        //   //   })
        //
        // })
        .catch((error)=> {
          console.log('Error:', error)
        })

    });
  })();

  //  Phrase Submission Logic (Should be in Content Script):
  // (function () {
  //   let phraseData;
  //   document.querySelector('.add-translation__form').addEventListener('submit', () => {
  //     const phrase = document.querySelector('#phrase').value;
  //     const jwt_token = localStorage.getItem('jwt_token');
  //     phraseData = {
  //       phrase,
  //       jwt_token
  //     };
  //
  //     postData('subtite.it/phrase', phraseData)
  //       .then((result) => {
  //         console.log(result);
  //       })
  //       .catch((error)=> {
  //         console.log('Error:', error)
  //       })
  //   });
  // })();


  async function postData(url = '', data = {}) {

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  // Probably Should be in content script:
  async function getData(url = '', data = '') {

    const jwt_token = localStorage.getItem('jwt_token');

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.stringify(jwt_token),
        'Videolink': data
      },
    });
    return await response.json();
  }



}

