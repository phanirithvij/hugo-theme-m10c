import * as params from '@params';

var utter = document.querySelector(".utterances");
const commentsBox = document.querySelector(".comments");
const commentBtn = document.querySelector("#show-comments");
commentBtn.onclick = (ev) => toggleComments(ev);
var showing = false;
const comments = `<script
  src="https://utteranc.es/client.js"
  repo="phanirithvij/phanirithvij.github.io"
  issue-term="pathname"
  label="comment"
  id="utter-script"
  theme="${
    params.theme === "preferred-color-scheme" ? params.theme :
    (params.theme === "dark" ? params.dark : params.light)
  }"
  crossorigin="anonymous"/>`;

function toggleComments(ev) {
  if (showing) hideComments();
  else showComments();
  showing = !showing;
  // onclick outside svg icon but on button(div)
  if (ev.target.id === "show-comments") {
    // https://stackoverflow.com/a/49835939/8608146
    // svg has no click method
    commentBtn.querySelector("svg").dispatchEvent(new Event("click"));
  }
}

function showComments() {
  if (utter != null) {
    toggleCommentVisibility();
    return;
  }
  // https://stackoverflow.com/a/62641523/8608146
  const scriptEl = document.createRange().createContextualFragment(comments);
  commentsBox.appendChild(scriptEl);
  // using arrive.js to trigger onload for .utterances div
  // which will be created by 3rd party utterances.js
  document.arrive(".utterances", function () {
    // can be useful if doing a loading icon
    utter = document.querySelector(".utterances");
  });
  toggleCommentVisibility();
}

function toggleCommentVisibility() {
  if (utter != null) {
    if (utter.classList.contains("hide")) {
      utter.classList.remove("hide");
      utter.classList.add("show");
    } else {
      utter.classList.remove("show");
      utter.classList.add("hide");
    }
  }
  if (commentsBox.classList.contains("show")) {
    commentsBox.classList.remove("show");
    commentsBox.classList.add("hide");
  } else {
    commentsBox.classList.remove("hide");
    commentsBox.classList.add("show");
  }
}

function hideComments() {
  console.log("hide comments");
  toggleCommentVisibility();
}

// THEME changes listener

const autoTheme = "preferred-color-scheme";
const lightThemes = ["github-light", "boxy-light"];
const darkThemes = [
  "github-dark",
  "github-dark-orange",
  "icy-dark",
  "dark-blue",
  "photon-dark",
];
// https://github.com/utterance/utterances/issues/170
function reloadTheme(e) {
  const message = {
    type: "set-theme",
    theme: e == "dark" ? params.dark : params.light,
  };
  var utterances = document.querySelector("iframe");
  // can be null because it didn't load yet
  utterances?.contentWindow.postMessage(message, "https://utteranc.es");
}
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => e.matches && reloadTheme("dark"));
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", (e) => e.matches && reloadTheme("light"));
