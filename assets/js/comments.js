import * as params from '@params';

var utter = document.querySelector(".utterances");
const commentsBox = document.querySelector(".comments");
const commentBtn = document.querySelector("#show-comments");
commentBtn.onclick = (ev) => toggleComments(ev);
var showing = false;

// getThemeFile return the exact theme we need to request from utterances
function getThemeFile() {
  const allowedThemes = ["preferred-color-scheme", "light", "dark"];
  const lightThemes = ["github-light", "boxy-light"];
  const darkThemes = [
    "github-dark",
    "github-dark-orange",
    "icy-dark",
    "dark-blue",
    "photon-dark",
  ];

  // handling prefered-color-scheme theme overrides ourselves

  var paramTheme = params.theme;
  var paramLight = params.light;
  var paramDark = params.dark;

  // check if theme is valid
  if (!allowedThemes.includes(paramTheme)) {
    paramDark = allowedThemes[1]; // fallback light
  }

  if (params.theme === "preferred-color-scheme") {
    if (params.dark == null && params.light == null) {
      return params.theme;
    }
    // set params theme to html content which we are setting in main.scss
    // a function to get current theme i.e. dark/light from system
    paramTheme = window.getComputedStyle(document.documentElement).content.replace(/\"/g, "");
  }

  // check if override values are valid
  if (!darkThemes.includes(params.dark)) {
    paramDark = darkThemes[0]; // fallback github-dark
  }
  if (!lightThemes.includes(params.light)) {
    paramLight = lightThemes[0]; // fallback github-light
  }

  return (paramTheme === "dark" ? paramDark : paramLight);
}

const comments = `<script
  src="https://utteranc.es/client.js"
  repo="phanirithvij/phanirithvij.github.io"
  issue-term="pathname"
  label="comment"
  id="utter-script"
  theme="${getThemeFile()}"
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

// THEME switching changes listener
// https://github.com/utterance/utterances/issues/170
function reloadTheme(e) {
  const message = {
    type: "set-theme",
    theme: e == "dark" ? params.dark : params.light,
  };
  var utterances = document.querySelector("iframe");
  // can be null because it didn't load yet
  utterances?.
  contentWindow.postMessage(message, "https://utteranc.es");
}
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => e.matches && reloadTheme("dark"));
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", (e) => e.matches && reloadTheme("light"));
