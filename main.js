let comments = [];
loadCommentsFromStorage();

document.querySelector('.news__comment_add button').addEventListener('click', addCommentButtonClick);

function addCommentButtonClick(event) {
  let textarea = document.querySelector('.news__comment_add textarea');
  if(textarea.value) {
    htmlAppendComment(textarea.value);
    comments.push(textarea.value);
    saveToStorage();
    updateCommentsInfo();
  }
}

function htmlAppendComment(commentText) {
  let commentsSection = document.querySelector('.news__comments_wrapper');
  commentsSection.insertAdjacentHTML('afterbegin', `<div class="news__comment">${commentText}</div>`);
}

function saveToStorage() {
  sessionStorage.setItem('comments', JSON.stringify(comments));
}

function loadCommentsFromStorage() {
  let loadedComments = sessionStorage.getItem('comments');
  if(loadedComments != null) {
    comments = JSON.parse(loadedComments);
    comments.forEach(comment => htmlAppendComment(comment));
    updateCommentsInfo();
  }
}

function updateCommentsInfo() {
  if(comments.length > 0) {
    let commentsInfoEmpty = document.querySelector('.comments__info_empty');
    commentsInfoEmpty.classList.add('hidden');
    let commentsInfo = document.querySelector('.comments__info');
    commentsInfo.classList.remove('hidden');
    
    //Определяем правильное окончание слова для количества комментариев (1 комментарИЙ, 12 комментариЕВ, 24 комментарИЯ...)
    let wordRelations = [
      {word: 'комментарий', numbers: [1]}, 
      {word: 'комментария', numbers: [2, 3, 4]}, 
      {word: 'комментариев', numbers: [5, 6, 7, 8, 9, 0]}
    ];

    let wordToUse = 'undefined';
    let commentsNumber = comments.length;

    let endsWithOneOf = (numberToCheck, numbers) => {return numbers.some(n => numberToCheck.toString().endsWith(n.toString()))} 

    if(commentsNumber.toString().length >= 2 && commentsNumber.toString().charAt(commentsNumber.toString().length - 2) == '1') {
      wordToUse = 'комментариев';
    } else {
      for(relation of wordRelations) {
        if(endsWithOneOf(commentsNumber, relation.numbers)) {
          wordToUse = relation.word;
          break;
        }
      }
    }

    commentsInfo.textContent = `${commentsNumber} ${wordToUse}`;
  }
}