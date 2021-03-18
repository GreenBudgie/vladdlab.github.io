class NewsComment {

  constructor(author, text) {
    this.author = author;
    this.text = text;
    this.date = Date.now();
    this.id = currentId++;
  }

  getCreationDateFormatted() {
    let options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: false
    };
    return new Intl.DateTimeFormat('en-US', options).format(this.date);
  }

  toHTML() {
    return `
    <div class="news__comment" commentId="${this.id}">
      <div class="news__comment_header_wrapper">
          <p class="news__comment_author">${this.author}</p>
          <button class="news__comment_delete"></button>
      </div>
      <p class="news__comment_text">${this.text}</p>
      <p class="news__comment_date">${this.getCreationDateFormatted()}</p>
    </div>`;
  }

}

let currentId = 0;
let comments = [];

document.querySelector('.news__comment_add button').addEventListener('click', addCommentButtonClick);

function addCommentButtonClick(event) {
  let textarea = document.querySelector('.news__comment_add textarea');
  let author = document.querySelector('.news__comment_add input');
  if(textarea.value && author.value) {
    let comment = new NewsComment(author.value, textarea.value);
    htmlAppendComment(comment);
    comments.push(comment);
    updateCommentsInfo();
  }
}

function deleteCommentButtonClick(event) {
  let commentId = event.target.parentNode.parentNode.getAttribute("commentId");
  deleteComment(commentId);
}

function deleteComment(commentId) {
  comments = comments.filter(comment => comment.id != commentId);

  let htmlComments = document.getElementsByClassName("news__comment");
  for(let comment of htmlComments) {
    if(comment.getAttribute("commentId") == commentId) {
      comment.parentNode.removeChild(comment);
      break;
    }
  }

  updateCommentsInfo();
}

function htmlAppendComment(comment) {
  let commentsSection = document.querySelector('.news__comments_wrapper');
  commentsSection.insertAdjacentHTML('afterbegin', comment.toHTML());
  document.querySelector('.news__comment_delete').addEventListener('click', deleteCommentButtonClick);
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
  } else {
    let commentsInfoEmpty = document.querySelector('.comments__info_empty');
    commentsInfoEmpty.classList.remove('hidden');
    let commentsInfo = document.querySelector('.comments__info');
    commentsInfo.classList.add('hidden');
  }
}