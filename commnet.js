// mock data =======================================
const bannedWords = ["미친", "18", "쌍놈", "바보"];

let comment_list = [
  {
    author: "gil",
    date: new Date("2021-05-05"),
    like: 3,
    dislike: 1,
    number_of_shared: 0,
    content: "I am the King!!",
    id: new Date("2021-05-05"),
    updatedDate: null,
  },
  {
    author: "spider-man",
    date: new Date("2021-05-06"),
    like: 3,
    dislike: 1,
    number_of_shared: 0,
    content: "Am I one of the Avengers?",
    id: new Date("2021-05-06"),
    updatedDate: null,
  },
  {
    author: "x-man",
    date: new Date("2021-05-07"),
    like: 3,
    dislike: 1,
    number_of_shared: 0,
    content: "I'm not able to die!!",
    id: new Date("2021-05-07"),
    updatedDate: null,
  },
];

const mockLoginMethods = [
  "naver",
  "facebook",
  "kakao",
  "google",
  "twitter",
  "email",
];

// mock data end ================================

// initialization =================================================
let loggedInUser = "click here to write a comment";
const userName = document.getElementById("author-name");
userName.innerHTML = loggedInUser;
const commnet_input_tag = document.getElementById("comment-input");
commnet_input_tag.setAttribute("disabled", "true");
let isModifying = false;
let isLoggedIn;
if (loggedInUser === "to write commnet please login") isLoggedIn = false;

const loginContainer = document.querySelector(".login-container");
mockLoginMethods.forEach((one) => {
  const method = document.createElement("button");
  method.innerHTML = one;
  loginContainer.appendChild(method);
});
let visibleFlg = false;

const login_buttons_container = document.querySelector(".login-container");
const comment_add_button = document.querySelector(".adding-comment");
comment_add_button.classList.toggle("display_none");
// initialization end =================================================

// funcitons ==========================================================
const toggleLoginModal = (flg) => {
  if (!flg) {
    document.querySelector(".login-container").classList.remove("visible");
    visibleFlg = false;
  } else {
    document.querySelector(".login-container").classList.add("visible");
    visibleFlg = true;
  }
};

function loginHandler() {
  if (!isLoggedIn) {
    const tempUserName = prompt("your email");
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (!regExp.test(tempUserName)) {
      alert("please enter valid email");
      return false;
    } else {
      loggedInUser = tempUserName;
      isLoggedIn = true;
      commnet_input_tag.removeAttribute("disabled");
      userName.innerHTML = loggedInUser;
    }
    return false;
  }
}

function checkRapidCommenting() {
  if (
    loggedInUser == comment_list[comment_list.length - 1].author &&
    loggedInUser == comment_list[comment_list.length - 2].author
  ) {
    alert("You are commeing too rapidly wait!");
    return false;
  } else return true;
}

function makeButtonDisabledTemp(target) {
  target.setAttribute("disabled", true);
  setTimeout(() => target.removeAttribute("disabled"), 3000);
}

function addComment(e) {
  if (!isLoggedIn) {
    return;
  }
  if (!checkRapidCommenting(e)) {
    makeButtonDisabledTemp(e.target);
    return;
  }

  if (!checkWordsOfComment()) {
    makeButtonDisabledTemp(e.target);
    return;
  }
  const comment_detail = document.querySelector("#comment-input");
  if (comment_detail.value === "") {
    alert("nothing is written!");
    return;
  }
  document.querySelector(".adding-comment").setAttribute("disabled", true);
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

  document.querySelector(".adding-comment").removeAttribute("disabled");
}

//put comments into html file
function inject_comments() {
  let comments = "";
  for (let i = 0; i < comment_list.length; i++) {
    comments += comment_card(comment_list[i]).detail();
  }
  document.querySelector("div.comment-container").innerHTML = comments;
}

function checkWordsOfComment() {
  const inputtedText = document.querySelector(".input-box").value;
  if (bannedWords.some((word) => inputtedText.includes(word))) {
    alert("금칙어를 제거하고 다시 시도해주세요");
    return false;
  } else {
    return true;
  }
}

function likeHandler(target_comment_id) {
  //like를 한 사람들을 따로 빼서 db화 하면 또 누르는걸 방지할 수 있지만 일단 지금은 안함
  const filtered_comment_list = comment_list.filter(
    (one) => one.id != target_comment_id
  );
  const target_comment = comment_list.find((one) => {
    return one.id == target_comment_id;
  });
  target_comment.like = target_comment.like + 1;
  filtered_comment_list.push(target_comment);
  comment_list = filtered_comment_list;
  comment_list.sort((one, two) => one.date - two.date);
  inject_comments();
}
function dislikeHandler(target_comment_id) {
  const filtered_comment_list = comment_list.filter(
    (one) => one.id != target_comment_id
  );
  const target_comment = comment_list.find(
    (one) => one.id == target_comment_id
  );
  target_comment.dislike = target_comment.dislike + 1;
  filtered_comment_list.push(target_comment);
  comment_list = filtered_comment_list;
  comment_list.sort((one, two) => one.date - two.date);
  inject_comments();
}

//modify comment
function modifyComment(target_comment_id) {
  if (isModifying) {
    return;
  }
  isModifying = true;
  const target_comment = comment_list.filter(
    (one) => one.id === +target_comment_id
  )[0];

  const tartgetEl = document.getElementById(`${target_comment_id}`);
  const modify_box = document.createElement("div");
  modify_box.setAttribute("class", "modify_box");
  modify_box.setAttribute("id", `"${new Date().now}"`);
  const textArea = document.createElement("input");
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
  const targetObj = comment_list.filter(
    (one) => one.id === +target_comment_id
  )[0];
  const editedText = document.getElementById(target_comment_id).children[1]
    .children[0].value;
  targetObj.content = editedText;
  targetObj.updatedDate = new Date();
  comment_list.filter((one) => one.id !== +target_comment_id).push(targetObj);
  const targetContainer = document.getElementById(target_comment_id);
  targetContainer.removeChild(targetContainer.children[0]);
  inject_comments();
  isModifying = false;
}

//delete comment
function deleteComment(target_comment_id) {
  if (!identifyAuthor(target_comment_id)) return;
  const filteredCommentList = comment_list.filter(
    (one) => one.id !== +target_comment_id
  );
  comment_list = filteredCommentList;
  inject_comments();
}

function identifyAuthor(target_comment_id) {
  const target_comment_author = comment_list.filter(
    (one) => one.id === +target_comment_id
  )[0].author;
  if (target_comment_author !== loggedInUser) return false;
  return true;
}
// funcitons end ==========================================================

// attach eventlistener ================================================
window.addEventListener("click", (e) => {
  if (
    e.target === document.querySelector(".adding-comment") ||
    e.target === document.querySelector(".input-box")
  ) {
    if (loggedInUser == "click here to write a comment") toggleLoginModal(true);
  } else if (e.target !== document.querySelector(".input-box")) {
    toggleLoginModal(false);
  }
});

login_buttons_container.addEventListener("click", (e) => {
  if (e.target.innerHTML === "facebook") {
    loggedInUser = "authenticated by facebook";
  }
  if (e.target.innerHTML === "naver") {
    loggedInUser = "authenticated by naver";
  }
  if (e.target.innerHTML === "kakao") {
    loggedInUser = "authenticated by kakao";
  }
  if (e.target.innerHTML === "google") {
    loggedInUser = "authenticated by google";
  }
  if (e.target.innerHTML === "twitter") {
    loggedInUser = "authenticated by twitter";
  }
  if (e.target.innerHTML === "email") {
    loginHandler();
    return;
  }
  document.getElementById("author-name").innerHTML = loggedInUser;
  commnet_input_tag.removeAttribute("disabled");
  comment_add_button.classList.toggle("display_none");
  isLoggedIn = true;
});

// attach eventlistener end ================================================

// make each comment ===================================================
const comment_card = (comment_card) => {
  let formattedDate;
  formattedDate = `${comment_card.date.getFullYear()}-${
    comment_card.date.getMonth() + 1
  }-${
    comment_card.date.getDay() + 2
  }  ${comment_card.date.getHours()}:${comment_card.date.getMinutes()}`;
  return {
    detail() {
      return `<div class="comment_card" id="${comment_card.id}">
		<div>
		<span class="comment-author">${
      comment_card.author ? comment_card.author : loggedInUser
    }</span>
		<span class="comment-date">${formattedDate}</span>
		<p> ${comment_card.content} </p>
			<div class="flex-button-box">
				 <button id="like">👍 ${comment_card.like}</button>
				 <button id="dislike">👎 ${comment_card.dislike}</button>
			</div>
		<div class="flex-editing-button-box">
			${
        loggedInUser === comment_card.author
          ? "<button class='red-button'>Delete</button>"
          : ""
      } 
			${
        loggedInUser === comment_card.author
          ? "<button class='green-button'>Modify</button>"
          : ""
      } 
		</div>
		</div>
		</div>
`;
    },
  };
};

// make each comment end ===================================================

function deleagateEventHandler() {
  //event delegate pattern
  document
    .querySelector("div.comment-container")
    .addEventListener("click", (event) => {
      if (event.target == "[object HTMLButtonElement]") {
        if (event.target.innerHTML === "Modify") {
          modifyComment(event.target.parentNode.parentNode.parentNode.id);
        }
      }
      if (event.target == "[object HTMLButtonElement]") {
        if (event.target.innerHTML === "Delete") {
          deleteComment(event.target.parentNode.parentNode.parentNode.id);
        }
      }
      if (event.target.getAttribute("id") == "dislike") {
        dislikeHandler(event.target.parentNode.parentNode.parentNode.id);
      }
      if (event.target.getAttribute("id") == "like") {
        likeHandler(event.target.parentNode.parentNode.parentNode.id);
      }
    });
}

inject_comments();
deleagateEventHandler();
