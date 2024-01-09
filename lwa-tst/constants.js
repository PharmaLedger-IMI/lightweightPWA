const constants = {
  DEV_DEBUG: "_epiLog_",
  EPI_DOMAIN: "_epiDomain_",
  FONT_ZOOM: "_fontZoom_",
  APP_LANG: "_appLang_",
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  FONT_SCALE_MAP: {
    /*body, h4*/
    basic_font: {
      100: {
        "safari": "calc(1.6rem + 0.1vmin)",
        "chrome": "calc(1.6rem + 0.1vmin)"
      }, //16px
      110: {
        "safari": "calc(1.6rem + 0.2vmin)",
        "chrome": "calc(1.6rem + 0.2vmin)"
      }, //16.5px
      130: {
        "safari": "calc(1.6rem + 0.4vmin)",
        "chrome": "calc(1.6rem + 0.4vmin)"
      }, //17.5px
      150: {
        "safari": "calc(1.6rem + 0.6vmin)",
        "chrome": "calc(1.6rem + 0.6vmin)"
      }, //18px
      175: {
        "safari": "calc(1.6rem + 0.8vmin)",
        "chrome": "calc(1.6rem + 0.8vmin)"
      }, //20px
      200: {
        "safari": "calc(1.6rem + 1.1vmin)",
        "chrome": "calc(1.6rem + 1.1vmin)"
      }, //22px
      250: {
        "safari": "calc(1.6rem + 1.5vmin)",
        "chrome": "calc(1.6rem + 1.5vmin)"
      }, //24px
      300: {
        "safari": "calc(1.6rem + 1.8vmin)",
        "chrome": "calc(1.6rem + 1.8vmin)"
      }  //26px
    }, /*H3*/
    m_font: {
      100: {
        "safari": "calc(1.6rem + 1vmin)",
        "chrome": "calc(1.6rem + 1vmin)"
      }, //18px
      110: {
        "safari": "calc(1.6rem + 1.1vmin)",
        "chrome": "calc(1.6rem + 1.1vmin)"
      }, //18.5px
      130: {
        "safari": "calc(1.6rem + 1.3vmin)",
        "chrome": "calc(1.6rem + 1.3vmin)"
      }, //19px
      150: {
        "safari": "calc(1.6rem + 1.5vmin)",
        "chrome": "calc(1.6rem + 1.5vmin)"
      }, //20px
      175: {
        "safari": "calc(1.6rem + 1.7vmin)",
        "chrome": "calc(1.6rem + 1.7vmin)"
      }, //22px
      200: {
        "safari": "calc(1.6rem + 2vmin)",
        "chrome": "calc(1.6rem + 2vmin)"
      }, //24px
      250: {
        "safari": "calc(1.6rem + 2.3vmin)",
        "chrome": "calc(1.6rem + 2.3vmin)"
      }, //26px
      300: {
        "safari": "calc(1.6rem + 2.5vmin)",
        "chrome": "calc(1.6rem + 2.5vmin)"
      } //28px
    },
    l_font: {
      100: {
        "safari": "calc(1.6rem + 1.2vmin)",
        "chrome": "calc(1.6rem + 1.2vmin)"
      }, //22px
      110: {
        "safari": "calc(1.6rem + 1.3vmin)",
        "chrome": "calc(1.6rem + 1.3vmin)"
      }, //22.5px
      130: {
        "safari": "calc(1.6rem + 1.5vmin)",
        "chrome": "calc(1.6rem + 1.5vmin)"
      }, //23px
      150: {
        "safari": "calc(1.6rem + 1.7vmin)",
        "chrome": "calc(1.6rem + 1.7vmin)"
      }, //24px
      175: {
        "safari": "calc(1.6rem + 1.9vmin)",
        "chrome": "calc(1.6rem + 1.9vmin)"
      }, //27px
      200: {
        "safari": "calc(1.6rem + 2.1vmin)",
        "chrome": "calc(1.6rem + 2.1vmin)"
      }, //30px
      250: {
        "safari": "calc(1.6rem + 2.3vmin)",
        "chrome": "calc(1.6rem + 2.3vmin)"
      }, //33px
      300: {
        "safari": "calc(1.6rem + 2.5vmin)",
        "chrome": "calc(1.6rem + 2.5vmin)"
      } //35px
    },
    xl_font: {
      100: {
        "safari": "calc(1.6rem + 1.4vmin)",
        "chrome": "calc(1.6rem + 1.4vmin)"
      }, //24px
      110: {
        "safari": "calc(1.6rem + 1.5vmin)",
        "chrome": "calc(1.6rem + 1.5vmin)"
      }, //24.5px
      130: {
        "safari": "calc(1.6rem + 1.7vmin)",
        "chrome": "calc(1.6rem + 1.7vmin)"
      }, //25px
      150: {
        "safari": "calc(1.6rem + 1.9vmin)",
        "chrome": "calc(1.6rem + 1.9vmin)"
      }, //27px
      175: {
        "safari": "calc(1.6rem + 2.1vmin)",
        "chrome": "calc(1.6rem + 2.1vmin)"
      },//30px
      200: {
        "safari": "calc(1.6rem + 2.3vmin)",
        "chrome": "calc(1.6rem + 2.3vmin)"
      },//33px
      250: {
        "safari": "calc(1.6rem + 2.6vmin)",
        "chrome": "calc(1.6rem + 2.6vmin)"
      },//36px
      300: {
        "safari": "calc(1.6rem + 2.9vmin)",
        "chrome": "calc(1.6rem + 2.9vmin)"
      },//38px
    }
  }, /*error code value matches with a key in translations. Adding a new code should sync with translations*/
  errorCodes: {
    "gtin_not_created": "001",
    "gtin_wrong_length": "002",
    "gtin_wrong_digit": "003",
    "gto_timeout": "004",
    "xml_parse_error": "005",
    "xsl_parse_error": "006",
    "leaflet_timeout": "007",
    "url_redirect_error": "008",
    "gtin_wrong_chars": "009",
    "unknown_error": "010",
    "no_uploaded_epi": "011",
    "get_dsu_timeout": "012",
    "unsupported_response": "013",
    "misconfiguration": "099"
  },
  rtlLangCodes: ["ar", "he"]
  //other rtl language codes to be used for later:  "arc", "arz", "ckb", "dv", "fa", "ha", "he", "khw", "ks", "ps", "sd", "ur", "uz_AF", "yi"
}
export default constants;
