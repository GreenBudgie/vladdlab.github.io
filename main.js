let comments = [];
loadCommentsFromStorage();

document.querySelector('.news__comment_add button').addEventListener('click', addCommentButtonClick);

function addCommentButtonClick(event) {
  let textarea = document.querySelector('.news__comment_add textarea');
  if(textarea.value) {
    htmlAppendComment(textarea.value);
    comments.push(textarea.value);
    saveToStorage();
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
  }
}