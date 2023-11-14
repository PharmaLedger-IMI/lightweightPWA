import constants from "../constants.js"


function convertToLastMonthDay(date) {
  let expireDateConverted = date.replace("00", "01");
  expireDateConverted = new Date(expireDateConverted.replaceAll(' ', ''));
  expireDateConverted.setFullYear(expireDateConverted.getFullYear(), expireDateConverted.getMonth() + 1, 0);
  expireDateConverted = expireDateConverted.getTime();
  return expireDateConverted;
}

function getDateForDisplay(date) {
  if (date.slice(0, 2) === "00") {
    return date.slice(5);
  }
  return date;
}


function getExpiryTime(expiry) {
  let normalizedExpiryDate;
  let expiryTime;
  try {
    if (expiry.slice(0, 2) === "00") {
      normalizedExpiryDate = convertToLastMonthDay(expiry);
    } else {
      let expiryForDisplay = getDateForDisplay(expiry);
      normalizedExpiryDate = expiryForDisplay.replace(/\s/g, '')
    }

    //set expiry to the end of the day
    expiryTime = new Date(normalizedExpiryDate).setHours(23, 59, 59, 999);
    if (expiryTime > 0) {
      return expiryTime
    }
  } catch (err) {
    return null;
  }

  return null;

}

function isExpired(expiry) {
  let expiryTime = getExpiryTime(expiry);
  if (!expiryTime) {
    //expiry is incorrect date format, can not determine if is expired so it will be treated as not expired  
    return false;
  }
  return !expiryTime || expiryTime <= Date.now()
}


function convertFromISOtoYYYY_HM(dateString, useFullMonthName, separator) {
  const splitDate = dateString.split('-');
  const month = parseInt(splitDate[1]);
  let separatorString = "-";
  if (typeof separator !== "undefined") {
    separatorString = separator;
  }
  if (useFullMonthName) {
    return `${splitDate[2]} ${separatorString} ${constants.monthNames[month - 1]} ${separatorString} ${splitDate[0]}`;
  }
  return `${splitDate[2]} ${separatorString} ${constants.monthNames[month - 1].slice(0, 3)} ${separatorString} ${splitDate[0]}`;
}

function validateGTIN(gtinValue) {
  const gtinMultiplicationArray = [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];

  if (!gtinValue || isNaN(gtinValue)) {
    return {
      isValid: false, message: "GTIN should be a numeric value", errorCode: constants.errorCodes.gtin_wrong_chars
    };
  }
  let gtinDigits = gtinValue.split("");

  // TO DO this check is to cover all types of gtin. For the moment we support just 14 digits length. TO update also in leaflet-ssapp
  /*
  if (gtinDigits.length !== 8 && gtinDigits.length !== 12 && gtinDigits.length !== 13 && gtinDigits.length !== 14) {

    return {isValid: false, message: "GTIN length should be 8, 12, 13 or 14"};
  }
  */

  if (gtinDigits.length !== 14) {
    return {isValid: false, message: "GTIN length should be 14", errorCode: constants.errorCodes.gtin_wrong_length};
  }
  let j = gtinMultiplicationArray.length - 1;
  let reszultSum = 0;
  for (let i = gtinDigits.length - 2; i >= 0; i--) {
    reszultSum = reszultSum + gtinDigits[i] * gtinMultiplicationArray[j];
    j--;
  }
  let validDigit = Math.floor((reszultSum + 10) / 10) * 10 - reszultSum;
  if (validDigit === 10) {
    validDigit = 0;
  }
  if (gtinDigits[gtinDigits.length - 1] != validDigit) {
    return {
      isValid: false,
      message: "Invalid GTIN. Last digit should be " + validDigit,
      errorCode: constants.errorCodes.gtin_wrong_digit
    };
  }

  return {isValid: true, message: "GTIN is valid"};
}

function goToPage(pageName) {

  if (!pageName || typeof pageName !== "string" || pageName[0] !== "/" || window.location.hash) {
    pageName = `/error.html?errorCode=${constants.errorCodes.url_redirect_error}`
  }
  let pagePath = window.location.pathname.replace(/\/[^\/]*$/, pageName)
  window.location.href = (window.location.origin + pagePath);
}

function goToErrorPage(errorCode, error) {
  let errCode = errorCode || "010";
  if (!error) {
    error = new Error("goToErrorPage called with partial args!")
  }
  console.log(JSON.stringify(error, Object.getOwnPropertyNames(error)));
  window.history.pushState({}, "", "index.html");

  goToPage(`/error.html?errorCode=${errCode}`)
}

function setTextDirectionForLanguage(lang) {
  if (constants.rtlLangCodes.find((rtlLAng) => rtlLAng === lang)) {
    document.querySelector("body").setAttribute("dir", "RTL")
  }
}

function isQuotaExceededError(err) {
  return (err instanceof DOMException && (err.name === "QuotaExceededError" || // Firefox
    err.name === "NS_ERROR_DOM_QUOTA_REACHED"));
}

function updateLocalStorage(consoleArgs, nrToKeep = 20) {
  try {
    let devConsoleDebug = JSON.parse(localStorage.getItem(constants.DEV_DEBUG));
    devConsoleDebug.push({tabId: sessionStorage.tabID, ...consoleArgs});
    localStorage.setItem(constants.DEV_DEBUG, JSON.stringify(devConsoleDebug));

  } catch (e) {
    if (isQuotaExceededError(e) && nrToKeep > 1) {
      let devConsoleDebug = JSON.parse(localStorage.getItem(constants.DEV_DEBUG));
      devConsoleDebug = devConsoleDebug.slice(-1 * nrToKeep);
      localStorage.setItem(constants.DEV_DEBUG, JSON.stringify(devConsoleDebug));
      updateLocalStorage(consoleArgs, nrToKeep - 1);
    } else {
      console.log("Couldn't update localStorage", JSON.stringify(e, Object.getOwnPropertyNames(e)));
    }
  }
}

function enableConsolePersistence() {
  console.originalLogFnc = console.log;
  console.originalErrorFnc = console.error;
  console.originalWarnFnc = console.warn;

  sessionStorage.tabID ? sessionStorage.tabID : sessionStorage.tabID = Math.random();

  if (!JSON.parse(localStorage.getItem(constants.DEV_DEBUG))) {
    localStorage.setItem(constants.DEV_DEBUG, JSON.stringify([]))
  }

  console.log = function () {
    // default &  console.log()
    console.originalLogFnc.apply(console, arguments);
    // new & array data
    updateLocalStorage(arguments);
  }
  console.error = function () {
    // default &  console.error()
    console.originalErrorFnc.apply(console, arguments);
    // new & array data
    updateLocalStorage(arguments);

  }
  console.warn = function () {
    // default &  console.warn()
    console.originalWarnFnc.apply(console, arguments);
    // new & array data
    updateLocalStorage(arguments);
  }

}

function getFontSizeInMillimeters(element) {
  // Obțineți stilul computat pentru elementul dat
  const style = window.getComputedStyle(element);

  // Extrageți dimensiunea fontului în pixeli și convertiți-o într-un număr
  const fontSizeInPixels = parseFloat(style.fontSize);

  // Definiți conversia de la inch la milimetri
  const mmPerInch = 25.4;

  // Convertiți pixelii în puncte (1 punct = 1/72 inch), apoi în milimetri
  const fontSizeInMillimeters = fontSizeInPixels * (1 / 72) * mmPerInch;

  return fontSizeInMillimeters;
}

function updateFontScale() {

  let userAgent = navigator.userAgent;
  let h;
  if (userAgent.match(/chrome|chromium|crios/i)) {
    h = Math.round(parseFloat(getComputedStyle(document.querySelector(".font-control")).height) / 0.14)

    // h = Math.round(getFontSizeInMillimeters(document.querySelector(".font-control")) / 5) * 100;
  } else if (userAgent.match(/firefox|fxios/i)) {
    //TO DO
  } else if (userAgent.match(/safari/i)) {
    window.visualViewport.addEventListener("resize", (e) => {
      console.log(e);
      if (h < 100) {
        h = 100;
      }

      if (h > 100 && h <= 130) {
        h = 130;
      }
      if (h > 130 && h <= 150) {
        h = 150;
      }

      if (h > 150 && h < 200) {
        h = 175;
      }
      document.documentElement.style.setProperty('--font-size--basic', constants.fontScaleMap.basic_font[h]);
      document.documentElement.style.setProperty('--font-size--L', constants.fontScaleMap.l_font[h]);
      document.documentElement.style.setProperty('--font-size--XL', constants.fontScaleMap.xl_font[h]);
    })
    h = window.visualViewport.scale * 100;
  } else if (userAgent.match(/opr/i)) {
    //TO DO
  }

  console.log(`Scale factor = ${h}%`);

}

export {
  convertFromISOtoYYYY_HM,
  convertToLastMonthDay,
  getDateForDisplay,
  isExpired,
  getExpiryTime,
  goToPage,
  validateGTIN,
  goToErrorPage,
  setTextDirectionForLanguage,
  enableConsolePersistence,
  updateFontScale,
  getFontSizeInMillimeters
}
