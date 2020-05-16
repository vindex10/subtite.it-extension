window.setTimeout(() => {


  browser.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
      if (request.signInData) {

        try {
          const dataToken = await postData('https://subtite.it/auth', request.signInData);
          localStorage.setItem('jwt_token', dataToken.access_token);

          try {
            const phrases = await getData('https://subtite.it/phrase', 'https://www.youtube.com/watch?v=F9ei40nxKDc');

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
            document.querySelector('.video-stream').currentTime = sortedPhrases[1].start / 1000;

            start();

            document.querySelector('.add-translation__prev-text').innerText = sortedPhrases[0].data;
            document.querySelector('.add-translation__textarea').innerText = sortedPhrases[1].data;
            document.querySelector('.add-translation__textarea').setAttribute('edition_id', `${sortedPhrases[1].edition_id}`);
            document.querySelector('.add-translation__next-text').innerText = sortedPhrases[2].data;


          } catch(error) {
            console.log('Failed to get phrases:', error);
          }
        } catch(error) {
          console.log('Failed to sign in:', error);
        }

          document.querySelector('.add-translation__form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = document.querySelector('#phrase-translation').value;
            const edition_id = document.querySelector('#phrase-translation').getAttribute('edition_id');

            const translationData = {
              edition_id,
              data
            };

            try {
              await authorizedPostData('https://subtite.it/phrase', translationData);

              document.querySelector('.add-translation__toggle-button').innerText = 'Show';
              document.querySelector('.add-translation__form').classList.add('hide-add-translation');
            } catch(error) {
              console.log('Translation cannot be saved: ', error)
            }
          });
      }
    }
  );

  function start(){
    showEditor();
  }

  function showEditor() {
    document.querySelector('#info-contents').insertAdjacentHTML('beforebegin', `<div class="add-translation">
            <button class="add-translation__toggle-button">Hide</button>
            <form class="add-translation__form">
              <p class="add-translation__text add-translation__prev-text"></p>
              <textarea class="add-translation__text add-translation__textarea" id="phrase-translation"> </textarea>
              <p class="add-translation__text add-translation__next-text"></p>
              <div class="add-translation__submit-button-container">
                <button class="add-translation__download-button">Download Script</button>
                <button class="add-translation__submit-button" type="submit">Submit</button>
              </div>
          </form>
        </div>`);

      document.querySelector('.add-translation__toggle-button').addEventListener('click', (event)=> {

        if(!document.querySelector('.add-translation__form').classList.contains('hide-add-translation')) {
          event.target.innerText = 'Show';
          document.querySelector('.add-translation__form').classList.add('hide-add-translation');
        } else {
          event.target.innerText = 'Hide';
          document.querySelector('.add-translation__form').classList.remove('hide-add-translation');
        }
      })
  }

  async function postData(url, data) {

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

  async function authorizedPostData(url, data) {

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify(data)
    });
    return await response;
  }

  async function getData(url, videoLink) {
    const videoLinkFormatted = videoLink.replace(/&.*/, '');
    const response = await fetch(url + `?url=${videoLinkFormatted}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('jwt_token')}`,
      },
    });
    return await response.json();
  }



}, 2000);