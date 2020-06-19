let SERVER_NAME = "https://subtite.it:3000"
//let SERVER_NAME = "http://localhost:5000"

let userIdentity = null;

function ready() {
  init_router();
  init_signIn();
}

window.onload = ready;

async function callOnActiveTab(callback) {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        for (var tab of tabs) {
            callback(tab);
        }
    })
}

function init_router() {

  const authPopUp = document.querySelector('#popup-auth');
  const logInPopUp = document.querySelector('#popup-login');
  const landIngPopUp = document.querySelector('#popup-landing');
  const profilePopUp = document.querySelector('#popup-profile');
  const AuthPageLink = document.querySelector('.header__auth-link');
  const loginPageLink = document.querySelector('.header__login-link');
  const backHomePageLink = document.querySelector('.header__back-link');
  const backHome = document.querySelector('.back-link');


  logInPopUp.style.display = 'none';
  authPopUp.style.display = 'none';
  profilePopUp.style.display = "none";

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

  const profileTriggerEdit = document.querySelector('#popup-profile .triggerEdit');
  profileTriggerEdit.addEventListener('click', async () => {
    await callOnActiveTab(triggerEdit);
  });

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

async function triggerEdit(activeTab) {
  try {
    let sortedPhrases = await getAndPreparePhrases(activeTab.url)
    await browser.tabs.sendMessage(activeTab.id, {action: "triggerEdit", sortedPhrases: sortedPhrases});
  } catch(error) {
    console.log('Failed to get phrases:', error);
  }
}

async function onLogin() {
  document.querySelector('#popup-auth').style.display = "none";
  document.querySelector('#popup-login').style.display = "none";
  document.querySelector('#popup-landing').style.display = "none";
  document.querySelector('#popup-profile').style.display = "block";
  document.querySelector("#popup-profile .header__logo-title").innerHTML = "Hello, " + (userIdentity.full_name || userIdentity.username) + "!";
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
