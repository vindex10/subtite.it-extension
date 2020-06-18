let SERVER_NAME = "https://subtite.it"
//let SERVER_NAME = "http://localhost:5000"

let userIdentity = null;

function ready() {
  init_router();
  init_signIn();
}

window.onload = ready;

function init_router() {

  const authPopUp = document.querySelector('#popup-auth');
  const logInPopUp = document.querySelector('#popup-login');
  const landIngPopUp = document.querySelector('#popup-landing');
  const AuthPageLink = document.querySelector('.header__auth-link');
  const loginPageLink = document.querySelector('.header__login-link');
  const backHomePageLink = document.querySelector('.header__back-link');
  const backHome = document.querySelector('.back-link');


  logInPopUp.style.display = 'none';
  authPopUp.style.display = 'none';

  AuthPageLink.addEventListener('click', () => {
    landIngPopUp.style.display = 'none';
    authPopUp.style.display = 'block';
    logInPopUp.style.display = 'none';
  });

  loginPageLink.addEventListener('click', () => {
    landIngPopUp.style.display = 'none';
    authPopUp.style.display = 'none';
    logInPopUp.style.display = 'block';
  });

  const clickHandler = () => {  
    landIngPopUp.style.display = 'block';
    authPopUp.style.display = 'none';
    logInPopUp.style.display = 'none'; 
  }

  backHomePageLink.addEventListener('click', () => clickHandler());
  backHome.addEventListener('click', () => clickHandler());

}

function init_signIn () {
  getData(SERVER_NAME + '/profile').then( async (res) => {
    if (res["username"]) {
      userIdentity = res;
      await onLogin();
    }
  }).catch(() => {
    let signInData;
    // TODO: trigger and intercept submit instead
    document.querySelector('#signin-form-submit').addEventListener('click', (event) => {
      const username = document.querySelector('#useremail').value;
      const password = document.querySelector('#password').value;

      signInData = {
        username,
        password
      };

      postData(SERVER_NAME + '/auth', signInData).then( async (res) => {
        if (res["username"]) {
          userIdentity = res;
          await onLogin();
        }
      });
    });
  });
}

async function getAndPreparePhrases(uri) {
    const phrases = await getVideoData(SERVER_NAME + '/phrase', uri);

    const phrasesExtended = [...phrases];
    phrasesExtended.unshift({data: "Script starts here:", ref: 9000});
    phrasesExtended.push({data: "The end of the script.",  ref: 9000});

    const sortedPhrases= [];
    for (let i = 0; i < phrases.length; i++) {
      if (phrases[i].hasOwnProperty('editable')) {
        sortedPhrases.push({...phrasesExtended[i-1]});
        sortedPhrases.push({...phrasesExtended[i]});
        sortedPhrases.push({...phrasesExtended[i+1]})
      }
    }
  return sortedPhrases;
}

async function onLogin() {
  document.querySelector("#popup-landing .welcome").innerHTML = "Hello, " + (userIdentity.full_name || userIdentity.username) + "!";
  try {
    sortedPhrases = await getAndPreparePhrases('https://www.youtube.com/watch?v=F9ei40nxKDc')
    await browser.tabs.sendMessage(browser.tabs.activeTab.id, {action: "triggerEdit", sortedPhrases: sortedPhrases});
  } catch(error) {
    console.log('Failed to get phrases:', error);
  }
}

async function submitPhrase(translationData) {
    await postData(SERVER_NAME + '/phrase', translationData);
}

browser.runtime.onMessage.addListener(async (data, sender) => {
  if (data.action == "submitPhrase") {
    await submitPhrase(data.translationData);
  }
});

async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

async function getData(url) {
  const response = await fetch(url, {
    method: 'GET'
  });
  return await response.json();
}

async function getVideoData(url, videoLink) {
  const videoLinkFormatted = videoLink.replace(/&.*/, '');
  const response = await fetch(url + `?url=${videoLinkFormatted}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return await response.json();
}
