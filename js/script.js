/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),

    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch = "ontouchstart" in window,

    plugins = {
      pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
      rdNavbar: $(".rd-navbar"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]")
    };

/**
 * Initialize All Scripts
 */
$document.ready(function () {
  /**
   * attachFormValidator
   * @description  attach form validation to elements
   */
  function attachFormValidator(elements) {
    for (var i = 0; i < elements.length; i++) {
      var o = $(elements[i]), v;
      o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
      v = o.parent().find(".form-validation");
      if (v.is(":last-child")) {
        o.addClass("form-control-last-child");
      }
    }

    elements
        .on('input change propertychange blur', function (e) {
          var $this = $(this), results;

          if (e.type != "blur") {
            if (!$this.parent().hasClass("has-error")) {
              return;
            }
          }

          if ($this.parents('.rd-mailform').hasClass('success')){
            return;
          }

          if ((results = $this.regula('validate')).length) {
            for (i = 0; i < results.length; i++) {
              $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
            }
          } else {
            $this.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        })
        .regula('bind');
  }
  /**
   * IE Polyfills
   * @description  Adds some loosing functionality to IE browsers
   */
  if (isIE) {
    if (isIE < 10) {
      $html.addClass("lt-ie-10");
    }

    if (isIE < 11) {
      if (plugins.pointerEvents) {
        $.getScript(plugins.pointerEvents)
            .done(function () {
              $html.addClass("ie-10");
              PointerEventsPolyfill.initialize({});
            });
      }
    }

    if (isIE === 11) {
      $("html").addClass("ie-11");
    }

    if (isIE === 12) {
      $("html").addClass("ie-edge");
    }
  }
  /**
   * RD Navbar
   * @description Enables RD Navbar plugin
   */
  if (plugins.rdNavbar.length) {
    plugins.rdNavbar.RDNavbar({
      stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone")) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
      anchorNavSpeed: 1000,
      anchorNavOffset: -60
    });
    if (plugins.rdNavbar.attr("data-body-class")) {
      document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
    }
  }
  /**
   * RD Input Label
   * @description Enables RD Input Label Plugin
   */
  if (plugins.rdInputLabel.length) {
    plugins.rdInputLabel.RDInputLabel();
  }

  /**
   * Regula
   * @description Enables Regula plugin
   */
  if (plugins.regula.length) {
    attachFormValidator(plugins.regula);
  }

});
