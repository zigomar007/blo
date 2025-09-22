(function() {
  var addMessageListener = function (callback, customListenerKey) {
  if (window.eventListeners == undefined) {
    window.eventListeners = [];
  }

  var listenerKey = null;
  if (customListenerKey) {
    listenerKey = customListenerKey;
  } else {
    listenerKey = iframeId;
  }

  window.eventListeners[listenerKey] = callback;

  // Add a listener for a response
  window.addEventListener('message', function (event) {
    var responseListenerKey = null
    if (event.data.type) {
      responseListenerKey = event.data.type;
    } else if (event.data.sender) {
      responseListenerKey = event.data.sender
    }
    if (responseListenerKey) {
      if (window.eventListeners[responseListenerKey]) {
        window.eventListeners[responseListenerKey](event);
      } else {
        log('event was not handled by the first attempt with the key ' + responseListenerKey, event)
        setTimeout(function() {
          if (window.eventListeners[responseListenerKey]) {
            window.eventListeners[responseListenerKey](event);
          } else {
            log('event was not handled by the second attempt with the key ' + responseListenerKey, event)
            setTimeout(function() {
              if (window.eventListeners[responseListenerKey]) {
                window.eventListeners[responseListenerKey](event);
              } else {
                log('event was not handled by the third attempt with the key ' + responseListenerKey, event)
              }
            }, 2000)
          }
        }, 2000)
      }
    }
  });
};

var getHighestZIndex = function () {
  var highest = 0;
  var elements = document.body.getElementsByTagName("*");
  for (var i = 0; i < elements.length; i++) {
    var zindex = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue("z-index");
    if ((zindex > highest) && (zindex != 'auto')) {
      highest = parseInt(zindex);
    }
  }
  log(highest)
  return highest;
};

var setCookie = function (name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
};

var getCookie = function (name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

if (typeof onLoadStack == 'undefined') {
  onLoadStack = [];
  if (typeof window.onload == 'function') {
    onLoadStack['default'] = {"function": window.onload, "param": ""};
  }
}

var addWindowOnLoadFunction = function (newOnLoad, param) {
  onLoadStack[param] = {"function": newOnLoad, "param": param};

  window.onload = function () {
    for (var key in onLoadStack) {
      onLoadStack[key]['function'](onLoadStack[key]['param']);
    }
  };
};

function getParameterByName(name) {
  url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getAffiliateIdFromUrl() {
  return getParameterByName('sa');
}

function getUserTimezone() {
  // difference between UTC and user timezone. E.g. for Moscow it will be -3
  var timezoneOffset = (new Date().getTimezoneOffset()) / 60;
  return 'GMT' + ((timezoneOffset < 0) ? '+' : '-') + Math.abs(timezoneOffset);
}

function addParameterToLink(link, paramName, paramValue) {
  return link + (link.indexOf('?') == -1 ? '?' : '&') + paramName + '=' + encodeURIComponent(paramValue);
}

function log(message) {
  if (getParameterByName('s.io_debug')) {
    console.log(message)
  }
}
              
  var isPopupOpenOnExit = '' === '1'
  var isPopupOpenAutomatically = '1' === '1'
  var isPopupOpenAutomaticallyMobile = '' === '1'
  var onLoadPopupDelay = '4'
  var onLoadPopupMobileDelay = '0'
  var popupWasClosed = false
  var scrollWasDisabled = false
  var funnelStepId = '3241648'
  var previousBodyProperties = {}

  var isMobileOrTablet = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  var buildIframe = function(src, iframeId) {
    var iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.style.display = 'block';
    iframe.style.position = 'absolute';
    iframe.style.left = '50%';
    iframe.style.top = '50%';
    iframe.style.transform = 'translate(-50%, -50%)';
    iframe.style.border = 0;
    iframe.style.overflow = 'hidden';
    // don't put scrolling attr here, scrolling take place in the overlay
    // iframe content need to detect width for media queries
    iframe.width = '100%';
    iframe.src = src;

    return iframe;
  }

  var buildModalWindow = function(iframe) {
    var modalWindow = document.createElement('div');
    modalWindow.style.width = '100%';
    modalWindow.style.position = 'absolute';
    modalWindow.style.top = 0;
    modalWindow.style.bottom = 0;
    modalWindow.style.left = 0;
    modalWindow.style.right = 0;
    modalWindow.style['z-index'] = getHighestZIndex() + 2;
    modalWindow.appendChild(iframe);

    return modalWindow;
  }

  var buildOverlay = function(modalWindow) {
    var overlay = document.createElement('div');
    overlay.style.background = 'rgba(0, 0, 0, 0.5)';
    overlay.style.position = 'fixed';
    overlay.style.overflowY = 'scroll';
    overlay.style.webkitOverflowScrolling = 'touch';
    overlay.style.top = '0';
    overlay.style.bottom = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.width = '100%';
    overlay.style['z-index'] = getHighestZIndex() + 1;
    overlay.style.visibility = 'hidden';
    overlay.appendChild(modalWindow);

    return overlay;
  }

  var preparePageSource = function() {
    var pageSource = 'https\u003A\/\/systeme.io\/public\/46482129b6bc4dce4bd5ba578485f01727a96b1\/show\u003Fhostname\u003Ddevenir\u002Decrivain.systeme.io';

      var affiliateId = getAffiliateIdFromUrl()
    if (!!affiliateId) {
      pageSource += '?sa=' + affiliateId;
    }
    var preview = getParameterByName('remote-preview')
    if (!!preview) {
      pageSource += '?preview=' + preview;
    }
    var queryExists = affiliateId || preview
    var email = getParameterByName('email')
    if (!!email) {
      pageSource += (queryExists ? '&' : '?') + 'email=' + email;
    }
    var referer = window.location.href;
    referer = referer.split("#")[0]; // clear from anchors
    queryExists = queryExists || email
    pageSource += (queryExists ? '&' : '?') + 'source=' + referer

    return pageSource;
  }

  var disableScroll = function() {
    log('disable scroll')
    if (!scrollWasDisabled) {
      var scrollTop = 0
      if (document.documentElement.scrollTop > 0) {
        scrollTop = document.documentElement.scrollTop
        previousBodyProperties.documentScrollTop = scrollTop
      } else if (document.body.scrollTop > 0) {
        scrollTop = document.body.scrollTop
        previousBodyProperties.bodyScrollTop = scrollTop
      }

      previousBodyProperties.top = document.body.style.getPropertyValue('top')
      previousBodyProperties.position = document.body.style.getPropertyValue('position')
      previousBodyProperties.width = document.body.style.getPropertyValue('width')
      previousBodyProperties.overflowY = document.body.style.getPropertyValue('overflowY')
      log('previous body properties' + JSON.stringify(previousBodyProperties))

      // it will send postMessage second time with scrollTop = 0
      document.body.style.setProperty('top', -scrollTop + 'px', 'important');
      document.body.style.setProperty('position', 'fixed', 'important');
      document.body.style.setProperty('width', '100%', 'important');
      document.body.style.setProperty('overflowY', 'scroll', 'important');
      scrollWasDisabled = true
    }
  }

  var enableScroll = function() {
    log('enable scroll')
    document.body.style.setProperty('top', previousBodyProperties.top)
    document.body.style.setProperty('position', previousBodyProperties.position)
    document.body.style.setProperty('width', previousBodyProperties.width)
    document.body.style.setProperty('overflowY', previousBodyProperties.overflowY)

    if (previousBodyProperties.bodyScrollTop) {
      document.body.scrollTop = previousBodyProperties.bodyScrollTop
    } else if (previousBodyProperties.documentScrollTop) {
      document.documentElement.scrollTop = previousBodyProperties.documentScrollTop
    }
  }

  var buildPopup = function(iframeId) {
    var iframe = document.getElementById(iframeId)
    if (iframe) {
      return iframe.parentNode.parentNode
    }

    var pageSource = preparePageSource()
    var iframeSrc = pageSource + '#' + iframeId;
    iframe = buildIframe(iframeSrc, iframeId)
    var modalWindow = buildModalWindow(iframe)
    var overlay = buildOverlay(modalWindow)
    document.body.appendChild(overlay);

    return overlay;
  }

  var showPopup = function(popup) {
    // Check whether it was closed
    if (!popupWasClosed) {
      disableScroll();
      // case when max z-index changed after onload event
      popup.style['z-index'] = getHighestZIndex() + 1;
      popup.children[0].style['z-index'] = getHighestZIndex() + 2;
      popup.style.visibility = 'visible';
    }
  }

  var initPopupEventHandler = function(event) {
    var iframe = document.getElementById(event.data.sender);
    // let scroll in iframe
    var iframeHeight;
    if (window.innerHeight < event.data.height) {
      iframeHeight = window.innerHeight;
      iframe.style.top = 'initial';
      iframe.style.transform = 'translate(-50%)';
    } else {
      iframeHeight = event.data.height;
    }

    var iframeHeightPx = parseInt(iframeHeight, 0) + 4 + 'px'
    // +4px need to prevent scroll (detected only on windows browsers)
    // experimentally understood, that the extra height pixels added with html, body, #app { display: inline-block }
    // but this styles need to calculate the height of an iframe
    iframe.height = iframeHeightPx;
    iframe.style.height = iframeHeightPx;
  }

  var showPopupWithDelayEventHandler = function(delay, popup) {
    return function (event) {
      initPopupEventHandler(event)

      setTimeout(function() {
        return showPopup(popup)
      }, delay * 1000)
    }
  }

  var submitEventHandler = function(popup) {
    return function (event) {
      setCookie('hide_systeme_popup_3241648', "", {"expires": 3600*24*1000, "path":"/"});
      setTimeout(function() {
        document.body.removeChild(popup);
        enableScroll();
      }, 1000)
    }
  }

  var closeEventHandler = function(popup) {
    return function (event) {
      if (event.data.expires) {
        setCookie('hide_systeme_popup_3241648', "", {"expires": +event.data.expires * 24 * 3600, "path":"/"});
      }
      document.body.removeChild(popup);
      popupWasClosed = true
      enableScroll();
    }
  }

  var linkClickEventHandler = function(popup, linkClass) {
    var links = document.getElementsByClassName(linkClass)
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function(event) {
        // it may be detached by closeHandler
        if (!document.body.contains(popup)) {
          document.body.appendChild(popup)
        }
        event.preventDefault();
        showPopup(popup)
      })
    }
  }

  do {
    var linkClass = 'systeme-show-popup-' + funnelStepId;
    var uid = new Date().getTime();
    var scriptId = 'systeme-script-' + uid;
    var iframeId = 'systemeio-iframe-' + uid;
  } while (document.getElementById(scriptId) !== null);
  document.currentScript.setAttribute('id', scriptId);
  var links = document.getElementsByClassName(linkClass)
  if (getCookie('hide_systeme_popup_3241648') == undefined || links.length > 0) {
    // We should generate uid for script. User could paste two forms on one page.
    var popupCloseListenerKey = 'funnel_step_' + funnelStepId + '_popup_close'
    var formSubmitListenerKey = 'funnel_step_' + funnelStepId + '_form_submit_success'

    var onLinkClick = function() {
      var popup = buildPopup(iframeId);

      addMessageListener(initPopupEventHandler, iframeId)
      linkClickEventHandler(popup, linkClass)
    }

    // we use onLoad function to get max z-index after whole page will be loaded
    var onload = function(delay) {
      log('onload')
      var popup = buildPopup(iframeId);
      addMessageListener(submitEventHandler(popup), formSubmitListenerKey);
      addMessageListener(closeEventHandler(popup), popupCloseListenerKey);
      addMessageListener(showPopupWithDelayEventHandler(delay, popup), iframeId);
    };

    var onExitListener = function() {
      log('onExitListener')
      var popup = buildPopup(iframeId);
      addMessageListener(submitEventHandler(popup), formSubmitListenerKey);
      addMessageListener(closeEventHandler(popup), popupCloseListenerKey);
      // because we may override onload showPopupWithDelayEventHandler
      window.addEventListener('message', function (event) {
        if (event.data.sender && event.data.sender === iframeId) {
          initPopupEventHandler(event)
        }
      });
      log('init exit popup')

      var showPopupListener = function(e) {
        var from = e.relatedTarget || e.toElement
        if (!from || from.nodeName == "HTML") {
          log('show exit popup')
          showPopup(popup);
          document.removeEventListener('mouseout', showPopupListener)
        }
      }

      return showPopupListener
    }
    if (isMobileOrTablet()) {
      if (isPopupOpenAutomaticallyMobile) {
        addWindowOnLoadFunction(function() {
          return onload(onLoadPopupMobileDelay)
        }, 'onload_popup_mobile' + funnelStepId);
      } else if (isPopupOpenAutomatically) { // mobile fallback
        addWindowOnLoadFunction(function() {
          return onload(onLoadPopupDelay)
        }, 'onload_popup_mobile_fallback' + funnelStepId);
      }
    } else {
      // desktop handlers
      if (isPopupOpenAutomatically) {
        addWindowOnLoadFunction(function() {
          return onload(onLoadPopupDelay)
        }, 'desktop_on_load_' + funnelStepId);
      }

      if (isPopupOpenOnExit) {
        addWindowOnLoadFunction(function() {
          document.addEventListener('mouseout', onExitListener())
        }, 'desktop_on_exit_' + funnelStepId)
      }
    }

    if (links.length > 0) {
      var popup = buildPopup(iframeId);
      addMessageListener(closeEventHandler(popup), popupCloseListenerKey);
      addWindowOnLoadFunction(onLinkClick, 'open_by_click' + funnelStepId);
    }
  }
})();