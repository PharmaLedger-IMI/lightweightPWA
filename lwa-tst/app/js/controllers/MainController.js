import {goToPage, setFontSize} from "../../../utils.js"
import {getTranslation, translate} from "../translationUtils.js";
import environment from "../../../environment.js";
import constants from "../../../constants.js";


function MainController() {

  let getCookie = function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    exdays = exdays || 365;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  this.toggleMenu = function () {
    let menuButton = document.getElementById("hamburger-menu-button");
    let menuExpanded = menuButton.getAttribute("aria-expanded") != "true";
    menuButton.setAttribute("aria-expanded", menuExpanded);
    let menuContainer = document.querySelector(".app-menu-container");
    menuContainer.classList.toggle("hidden");
  }

  this.checkOnboarding = function () {
    let usrAgreedTerms = getCookie("usr_agreed_terms");
    if (!usrAgreedTerms) {
      document.querySelector(".welcome-container #onbording-text").classList.remove("hiddenElement")
      document.querySelector(".content-container").classList.add("hiddenElement");
      document.querySelector(".explain-container").classList.add("hiddenElement");
      document.querySelector(".scan-button-container").classList.add("hiddenElement");
    } else {
      document.querySelector(".terms-content-container").classList.add("hiddenElement");
      document.querySelector(".welcome-container #welcome-text").classList.remove("hiddenElement");
    }
    document.querySelector("#app_version_number").innerHTML = `${environment.appBuildVersion}`;
  }

  this.submitTerms = function (status) {
    if (status) {
      setCookie("usr_agreed_terms", true);
    }
    location.reload();
  }
  this.scanHandler = async function () {
    goToPage("/scan.html")
  }

  this.goHome = function () {
    goToPage("/main.html")
  }

  this.closeModal = function () {
    document.querySelector("#settings-modal").setAttribute('style', 'display:none !important');
    document.querySelector(".page-container").setAttribute('style', 'display:flex !important');
  }

  this.showModal = function (key) {
    this.toggleMenu();
    /*    if (key === "about") {
          window.open("https://Pharmaledger.eu").focus();
          return;
        }*/

    let modal = document.querySelector("#settings-modal");

    modal.setAttribute('style', 'display:flex;');
    document.querySelector(".page-container").setAttribute('style', 'display:none !important');
    let titleKey = key + "_modal_title";
    let subtitleKey = key + "_modal_subtitle";
    let contentKey = key + "_content";
    modal.querySelector(".modal-title").innerHTML = getTranslation(titleKey);
    modal.querySelector(".modal-subtitle").innerHTML = getTranslation(subtitleKey);
    let contentElement = modal.querySelector(".modal-content");
    contentElement.className = "modal-content";
    contentElement.classList.add(key);
    contentElement.innerHTML = getTranslation(contentKey);
  }

  let addEventListeners = () => {
    let menuContainer = document.querySelector(".app-menu-container");
    let menuButton = document.getElementById("hamburger-menu-button");

    const focusableElements = document.querySelectorAll('.app-menu-container li');

    // Add event listener to the menu to capture the Tab key press
    menuContainer.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault(); // Prevent the default tab behavior

        for (let i = 0; i < focusableElements.length; i++) {
          if (focusableElements[i] === document.activeElement) {
            let nextIndex = (i + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
            break;
          }
        }
      }
    });


    let liElements = menuContainer.querySelectorAll('li.forward-to-page');
    liElements.forEach(function (li) {
      li.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          li.click();
        }
      });
    });

    document.getElementById("hamburger-menu-button").addEventListener("click", this.toggleMenu);
    document.addEventListener('keydown', evt => {
      if (evt.key === 'Escape') {
        if (!menuContainer.classList.contains("hidden")) {
          menuContainer.classList.add("hidden");
        }
      }
    });
    document.querySelector("body").addEventListener("click", (event) => {
      if (event.target != menuContainer && event.target != menuButton) {
        menuContainer.classList.add("hidden");
      }
    })
    document.querySelectorAll(".app-menu-container li.forward-to-page").forEach(item => {
      item.addEventListener("click", (event) => {
        this.showModal(event.currentTarget.getAttribute("modal-name"))
      })
    })
    document.getElementById("disagree-button").addEventListener("click", () => {
      this.submitTerms(false)
    })
    document.getElementById("agree-button").addEventListener("click", () => {
      this.submitTerms(true)
    })
    document.getElementById("scan-button").addEventListener("click", this.scanHandler)
    document.getElementById("close-modal-button").addEventListener("click", this.closeModal)
    document.getElementById("go-home-button").addEventListener("click", this.goHome)


  }
  addEventListeners();
}


const mainController = new MainController();

window.onload = async (event) => {
  await translate();
  mainController.checkOnboarding();
  //document.querySelector(".page-container").classList.remove("hiddenElement");
 // document.querySelector(".loader-container").setAttribute('style', 'display:none');
//  setTimeout(setFontSize, 0);
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let epiDomain = urlParams.get("setdomain") || localStorage.getItem(constants.EPI_DOMAIN) || environment.epiDomain;
localStorage.setItem(constants.EPI_DOMAIN, epiDomain);


window.mainController = mainController;

