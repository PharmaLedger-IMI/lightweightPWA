import {saveFontZoom, setTextDirectionForLanguage, updateFontZoom} from "./utils/utils.js";
import constants from "./constants.js";

const supportedLanguageCodes = ["ar", "de", "en", "es", "es-419", "fr", "ko", "nl", "pt", "pt-br", "zh"];

/*
export function changeLanguage(newLang) {
  let languages = Object.keys(translations);
  if (languages.find(lang => lang === newLang)) {
    localStorage.setItem(constants.APP_LANG, newLang)
    translate();
  }
}
*/

const langSubtypesMap = {
  "es-ar": "es",
  "es-bo": "es",
  "es-cl": "es",
  "es-co": "es",
  "es-cr": "es",
  "es-do": "es",
  "es-ec": "es",
  "es-sv": "es",
  "es-gt": "es",
  "es-mx": "es",
  "es-ni": "es",
  "es-pa": "es",
  "es-py": "es",
  "es-pe": "es",
  "es-pr": "es",
  "es-uy": "es",
  "es-ve": "es",
  "es-us": "es",
  "es-es": "es",
  "es-419": "es",
  "pt-pt": "pt",
  "de-de": "de",
  "fr-fr": "fr",
  "fr-be": "fr",
  "fr-ca": "fr",
  "nl-nl": "nl",
  "ko-kr": "ko",
  "zh-cn": "zh",
  "zh-hans": "zh",
  "zh-hant": "zh",
  "zh-hk": "zh"
}

function transformToISOStandardLangCode(code) {
  //language codes on phones have "_" instead of "-" and for base languages ends with "_"
  let replaceValue = "-";
  if (code.slice(-1) === "_") {
    replaceValue = "";
  }
  return code.replace("_", replaceValue);
}

async function fetchTranslation(langCode) {
  const currentPath = window.location.pathname;
  const currentDirectory = currentPath.substring(0, currentPath.lastIndexOf('/'));

  const response = await fetch(` ${currentDirectory}/translations/${langCode}.json`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.status} on fetching translation for ${langCode}`;
    alert("Possible network issue!!! Check your network connection and try again");
    throw new Error(message);
  }
  const translation = await response.json();
  return translation;
}

let currentAppTranslation;

function setDefaultLanguage() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let appLang = urlParams.get("lang") || window.navigator.language.toLowerCase() || localStorage.getItem(constants.APP_LANG);
  appLang = transformToISOStandardLangCode(appLang);
  appLang = langSubtypesMap[appLang.toLowerCase()] || appLang;
  appLang = supportedLanguageCodes.includes(appLang) ? appLang : "en";
  localStorage.setItem(constants.APP_LANG, appLang);
  setTextDirectionForLanguage(appLang);
}

export async function translate() {
  saveFontZoom();
  updateFontZoom();
  setDefaultLanguage();
  let matches = document.querySelectorAll("[translate]");
  currentAppTranslation = await fetchTranslation(localStorage.getItem(constants.APP_LANG));
  matches.forEach((item) => {
    item.innerHTML = currentAppTranslation[item.getAttribute('translate')];
  });
}

export function getTranslation(key) {
  setDefaultLanguage();
  return currentAppTranslation[key];
}


