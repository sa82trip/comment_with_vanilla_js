let loggedInUser = "to write commnet please login";

document.getElementById("author-name").innerHTML = loggedInUser;

let isModifying = false;
let isLoggedIn;
if (loggedInUser === "to write commnet please login") isLoggedIn = false;
let comment_list = [
  {
    author: "gil",
    date: 1,
    like: 3,
    dislike: 1,
    number_of_shared: 0,
    content: "I am the King!!",
    id: Math.random(),
    updatedDate: null,
  },
  {
    author: "spider-man",
    date: 2,
    like: 3,
    dislike: 1,
    number_of_shared: 0,
    content: "Am I one of the Avengers?",
    id: Math.random(),
    updatedDate: null,
  },
  {
    author: "x-man",
    date: 3,
    like: 3,
    dislike: 1,
    number_of_shared: 0,
    content: "I'm not able to die!!",
    id: Math.random(),
    updatedDate: null,
  },
];

const comment_card = (comment_card) => {
  return {
    detail() {
      return `<div class="comment_card" id="${comment_card.id}">
		<div>
		<span class="comment-author">${
      comment_card.author ? comment_card.author : loggedInUser
    }</span>
		<span class="comment-date">${comment_card.date}</span>
		<p> ${comment_card.content} </p>
			<div>
				<button>like${comment_card.like}</button>
				<button>dislike${comment_card.dislike}</button>
			</div>
		<div>
			${loggedInUser === comment_card.author ? "<button>delete</button>" : ""} 
			${loggedInUser === comment_card.author ? "<button>modify</button>" : ""} 
		</div>
		</div>
		</div>
`;
    },
  };
};

function loginHandler() {
  loggedInUser = prompt("your name");
  if (loggedInUser) isLoggedIn = true;
  document.getElementById("author-name").innerHTML = loggedInUser;
  return;
}

function addComment() {
  if (!isLoggedIn) {
    loginHandler();
  }

  const comment_detail = document.querySelector("#comment-input");

  const comment = {
    author: loggedInUser,
    date: new Date(),
    id: new Date().valueOf(),
    like: 0,
    dislike: 0,
    number_of_shared: 0,
    content: comment_detail.value,
    updatedDate: null,
  };

  comment_list.push(comment);

  inject_comments();

  comment_detail.value = "";
}

function deleagateEventHandler() {
  //event delegate pattern
  document
    .querySelector("div.comment-container")
    .addEventListener("click", (event) => {
      if (event.target == "[object HTMLButtonElement]") {
        if (event.target.innerHTML === "modify") {
          modifyComment(event.target.parentNode.parentNode.parentNode.id);
        }
      }
      if (event.target == "[object HTMLButtonElement]") {
        if (event.target.innerHTML === "delete") {
          console.log("let's delete this comment");
          deleteComment(event.target.parentNode.parentNode.parentNode.id);
        }
      }
      if (event.target == "[object HTMLButtonElement]") {
        const regex = /dislike/;
        if (event.target.innerHTML.match(regex)) {
          console.log(regex);
          console.log("let's count up for dislike");
          dislikeHandler(event.target.parentNode.parentNode.parentNode.id);
        }
      }
      if (event.target == "[object HTMLButtonElement]") {
        const regex = /^like/;
        if (event.target.innerHTML.match(regex)) {
          console.log(regex);
          console.log("let's count up for like");
          likeHandler(event.target.parentNode.parentNode.parentNode.id);
        }
      }
    });
}

//put comments into html file
function inject_comments() {
  let comments = "";
  for (let i = 0; i < comment_list.length; i++) {
    comments += comment_card(comment_list[i]).detail();
    document.querySelector("div.comment-container").innerHTML = comment_card(
      comment_list[i].author
    ).detail();
  }
  document.querySelector("div.comment-container").innerHTML = comments;
}

function likeHandler(target_comment_id) {
  //like를 한 사람들을 따로 빼서 db화 하면 또 누르는걸 방지할 수 있지만 일단 지금은 안함
  console.log("likeHandler", target_comment_id);
  const filtered_comment_list = comment_list.filter(
    (one) => one.id !== +target_comment_id
  );
  const target_comment = comment_list.find(
    (one) => one.id === +target_comment_id
  );
  target_comment.like = target_comment.like + 1;
  filtered_comment_list.push(target_comment);
  comment_list = filtered_comment_list;
  console.log(comment_list);
  comment_list.sort((one, two) => one.date - two.date);
  console.log(comment_list);
  inject_comments();
}
function dislikeHandler(target_comment_id) {
  console.log("dislikeHandler", target_comment_id);
  const filtered_comment_list = comment_list.filter(
    (one) => one.id !== +target_comment_id
  );
  const target_comment = comment_list.find(
    (one) => one.id === +target_comment_id
  );
  target_comment.dislike = target_comment.dislike + 1;
  filtered_comment_list.push(target_comment);
  comment_list = filtered_comment_list;
  console.log(comment_list);
  comment_list.sort((one, two) => one.date - two.date);
  console.log(comment_list);
  inject_comments();
}

//modify comment
function modifyComment(target_comment_id) {
  if (isModifying) {
    return;
  }
  isModifying = true;
  console.log(target_comment_id);
  const target_comment = comment_list.filter(
    (one) => one.id === +target_comment_id
  )[0];

  const tartgetEl = document.getElementById(`${target_comment_id}`);
  const modify_box = document.createElement("div");
  modify_box.setAttribute("class", "modify_box");
  modify_box.setAttribute("id", `"${new Date().now}"`);
  const textArea = document.createElement("textarea");
  textArea.setAttribute("id", "modifying-text");
  textArea.value = target_comment.content;
  const confirmButton = document.createElement("button");
  confirmButton.setAttribute("class", "confirmButton");
  confirmButton.setAttribute(
    "onclick",
    `modificatoinConfirmHandler(${target_comment_id})`
  );
  confirmButton.innerHTML = "confirm";
  modify_box.appendChild(textArea);
  tartgetEl.appendChild(modify_box);
  tartgetEl.appendChild(confirmButton);
}

function modificatoinConfirmHandler(target_comment_id) {
  console.log(target_comment_id);
  const targetObj = comment_list.filter(
    (one) => one.id === +target_comment_id
  )[0];
  const editedText = document.getElementById(target_comment_id).children[1]
    .children[0].value;
  targetObj.content = editedText;
  targetObj.updatedDate = new Date();
  console.log(targetObj);
  comment_list.filter((one) => one.id !== +target_comment_id).push(targetObj);
  const targetContainer = document.getElementById(target_comment_id);
  targetContainer.removeChild(targetContainer.children[0]);
  inject_comments();
  console.log(comment_list);
  isModifying = false;
}

//delete comment
function deleteComment(target_comment_id) {
  if (!identifyAuthor(target_comment_id)) return;
  const filteredCommentList = comment_list.filter(
    (one) => one.id !== +target_comment_id
  );
  console.log(filteredCommentList);
  comment_list = filteredCommentList;
  inject_comments();
}

function identifyAuthor(target_comment_id) {
  console.log(target_comment_id, loggedInUser);
  const target_comment_author = comment_list.filter(
    (one) => one.id === +target_comment_id
  )[0].author;
  if (target_comment_author !== loggedInUser) return false;
  return true;
}

inject_comments();
deleagateEventHandler();
