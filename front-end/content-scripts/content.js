window.setTimeout(() => {

  penPaperImgUrl = browser.extension.getURL("assets/img/pen-paper-dark.png");

  function showEditor() {
    document.querySelector('#info-contents').insertAdjacentHTML('beforebegin',
       `<div class="add-translation">
             <button class="add-translation__toggle-button"><img src="`+penPaperImgUrl+`" /></button>
        </div>`);
  }

  showEditor();

  const vid = document.querySelector('.video-stream');
  // if video is longer than 10 minutes - show popup 2 minutes before video ends
  // else - before 30 seconds
  function calcTimeLeft(video) {
    if (video.duration > 600) {
      return 120;
    } else {
      return 30;
    }
  }
  function showPopUp(video) {
    const timeToShow = video.duration - calcTimeLeft(video);

      const checkTimeToShow = setInterval(()=> {
          if (video.currentTime >= timeToShow) {
            // browser.runtime.openPopup();
            alert('Working!!!');
            clearInterval(checkTimeToShow);
          }
      }, 1000);
  }
  showPopUp(vid);


  browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "start" ) {
        start();
      }
    }
  );

  function start(){
    showEditorContent();
  }

  function showEditorContent() {
    document.querySelector(".add-translation").innerHTML = `
        <div class="add-translation__contents">
           <form class="add-translation__form">
              <p class="add-translation__text add-translation__prev-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut blanditiis debitis, dicta eaque enim et impedit mmodi consequuntur eligeprovident teue aut autem culpa dolorum ducimus.</p>
              <textarea class="add-translation__text add-translation__textarea">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut blanditiis debitis, dicta eaque enim et impedit mmodi consequuntur eligeprovident teue aut autem culpa dolorum ducimus.</textarea>
              <p class="add-translation__text add-translation__next-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut blanditiis debitis, dicta eaque enim et impedit mmodi consequuntur eligeprovident teue aut autem culpa dolorum ducimus.</p>
              <div class="add-translation__submit-button-container"><button class="add-translation__submit-button" type="submit">Submit</button></div>
          </form>
        </div>
      `

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



}, 2000);
