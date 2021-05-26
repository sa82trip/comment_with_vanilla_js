// mock data =======================================
const bannedWords = ["미친", "18", "쌍놈", "바보"];

let comment_list = [
  {
    author: "gil",
    date: new Date("2021-05-05"),
    like: 3,
    dislike: 1,
    number_of_shared: 0,
    content: "M1 MacBook Air 사고 싶네요!",
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

const loginMethods = {
  NAVER: "naver",
  FACEBOOK: "facebook",
  KAKAO: "kakao",
  GOOGLE: "google",
  TWITTER: "twitter",
  EMAIL: "email",
};

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
mockLoginMethods.forEach((loginButtonText) => {
  const method = document.createElement("button");
  method.innerHTML = loginButtonText;
  method.setAttribute("name", `via-${loginButtonText}`);
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
      comment_add_button.classList.toggle("display_none");
    }
    return false;
  }
}

function checkRapidCommenting() {
  if (
    loggedInUser == comment_list[comment_list.length - 1].author &&
    loggedInUser == comment_list[comment_list.length - 2].author
  ) {
    alert(
      `댓글을 너무 자주 달고 있습니다.
댓글은 2개 초과해서 달 수 없습니다.
3초간 댓글등록 버튼은 비활성화 됩니다.`
    );
    return false;
  } else return true;
}

function makeButtonDisabledTemp(target) {
  target.setAttribute("disabled", true);
  target.classList.toggle("disabled-button");
  setTimeout(() => {
    target.classList.toggle("disabled-button");
    target.removeAttribute("disabled");
  }, 3000);
}

function addComment(e) {
  const comment_detail = document.querySelector("#comment-input");
  if (!isLoggedIn) {
    return;
  }
  if (!checkRapidCommenting(e)) {
    makeButtonDisabledTemp(e.target);
    return;
  }

  if (!checkWordsOfComment(comment_detail.value)) {
    makeButtonDisabledTemp(e.target);
    return;
  }
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

function checkWordsOfComment(sentence) {
  if (bannedWords.some((word) => sentence.includes(word))) {
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
  modify_box.setAttribute("class", "modify-box");
  modify_box.setAttribute("id", `"${new Date().valueOf()}"`);
  const textArea = document.createElement("input");
  textArea.setAttribute("id", "modifying-text");
  textArea.setAttribute("class", "modifying-text");
  textArea.value = target_comment.content;
  const confirmButton = document.createElement("button");
  confirmButton.setAttribute("class", "confirm-button");
  confirmButton.setAttribute(
    "onclick",
    `modificatoinConfirmHandler(${target_comment_id})`
  );
  confirmButton.innerHTML = "confirm";
  modify_box.appendChild(textArea);
  modify_box.appendChild(confirmButton);
  tartgetEl.appendChild(modify_box);
}

function modificatoinConfirmHandler(target_comment_id) {
  const targetObj = comment_list.filter(
    (one) => one.id === +target_comment_id
  )[0];
  const editedText = document
    .getElementById(target_comment_id)
    .querySelector(".modifying-text").value;
  if (!checkWordsOfComment(editedText)) return;
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
  const wantToDelete = confirm("정말로 comment를 지우시겠습니까?");
  if (!identifyAuthor(target_comment_id)) return;
  if (!wantToDelete) return;
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
  if (e.target.name.includes("email")) {
    loginHandler();
    return;
  }
  for (const property in loginMethods) {
    if (e.target.name.includes(loginMethods[property])) {
      loggedInUser = `authenticated by ${loginMethods[property]}`;
    }
  }
  document.getElementById("author-name").innerHTML = loggedInUser;
  commnet_input_tag.removeAttribute("disabled");
  comment_add_button.classList.toggle("display_none");
  isLoggedIn = true;
  document.getElementById("comment-input").focus();
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
	<div class="first-row-comment-card">
		<div class="first-col">
				<span class="comment-author">${
          comment_card.author ? comment_card.author : loggedInUser
        }</span>
				<span class="comment-date">${formattedDate}</span>
			</div>
		<div class="second-col">
		<span id="option-button" class="option-button">${
      comment_card.author === loggedInUser ? "⌥" : ""
    }</span>
		</div>
		</div>
		<p> ${comment_card.content} </p>
			<div class="flex-button-box">
				 <button id="like">👍 ${comment_card.like}</button>
				 <button id="dislike">👎 ${comment_card.dislike}</button>
			</div>
		<div class="modifying-part-container">
			<div class="flex-editing-button-box display_none">
			${
        loggedInUser === comment_card.author
          ? "<button class='delete-button'>Delete</button>"
          : ""
      } 
		${
      loggedInUser === comment_card.author
        ? "<button class='modify-button'>Modify</button>"
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
      if (event.target.innerHTML === "Modify") {
        modifyComment(event.target.closest(".comment_card").id);
      }
      if (event.target.innerHTML === "Delete") {
        deleteComment(event.target.closest(".comment_card").id);
      }
      if (event.target.getAttribute("id") == "dislike") {
        dislikeHandler(event.target.closest(".comment_card").id);
      }
      if (event.target.getAttribute("id") == "like") {
        likeHandler(event.target.closest(".comment_card").id);
      }
      if (event.target.id === "option-button") {
        event.target
          .closest(".comment_card")
          .querySelector(".flex-editing-button-box")
          .classList.toggle("display_none");
      }
    });
}

inject_comments();
deleagateEventHandler();
document
  .querySelector(".comment-input-container")
  .addEventListener("keypress", function (e) {
    //Enter key
    if (e.which == 13) {
      return false;
    }
  });
