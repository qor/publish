(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function ($) {

  'use strict';

  var NAMESPACE = 'qor.publish';
  var EVENT_CLICK = 'click.' + NAMESPACE;

  function replaceText(str, data) {
    if (typeof str === 'string') {
      if (typeof data === 'object') {
        $.each(data, function (key, val) {
          str = str.replace('${' + String(key).toLowerCase() + '}', val);
        });
      }
    }

    return str;
  }

  function Publish(element, options) {
    this.$element = $(element);
    this.options = $.extend(true, {}, Publish.DEFAULTS, $.isPlainObject(options) && options);
    this.loading = false;
    this.init();
  }

  Publish.prototype = {
    constructor: Publish,

    init: function () {
      this.$modal = $(replaceText(Publish.MODAL, this.options.text)).appendTo('body');
      this.bind();
    },

    bind: function () {
      this.$element.on(EVENT_CLICK, $.proxy(this.click, this));
    },

    unbind: function () {
      this.$element.off(EVENT_CLICK, this.click);
    },

    click: function (e) {
      var options = this.options;
      var $target = $(e.target);
      var data;
      var $scheduleInput;
      var scheduleTime;


      if ($target.is(options.scheduleSetButton)) {
        e.preventDefault();
        scheduleTime = $(options.scheduleTime).val();
        if (scheduleTime){
          $('.publish-schedule-time').val(scheduleTime);
          $(options.submit).closest('form').submit();
        }
      }

      if ($target.is(options.schedulePopoverButton)) {
        data = $target.data();

        if (this.$scheduleModal){
          this.$scheduleModal.remove();
        }

        this.$scheduleModal = $(window.Mustache.render(Publish.SCHEDULE, data)).appendTo('body');
        this.$scheduleModal.qorModal('show');
        $scheduleInput = $(options.scheduleTime);

        $scheduleInput.materialDatePicker({ format : 'YYYY-MM-DD HH:mm' });

      }

      if ($target.is(options.toggleView)) {
        e.preventDefault();

        if (this.loading) {
          return;
        }

        this.loading = true;
        this.$modal.find('.mdl-card__supporting-text').empty().load($target.data('url'), $.proxy(this.show, this));
      } else if ($target.is(options.toggleCheck)) {
        if (!$target.prop('disabled')) {
          $target.closest('table').find('tbody :checkbox').click();
        }
      }
    },

    show: function () {
      this.loading = false;
      this.$modal.qorModal('show');
    },

    destroy: function () {
      this.unbind();
      this.$element.removeData(NAMESPACE);
    }
  };

  Publish.DEFAULTS = {
    toggleView: '.qor-js-view',
    toggleCheck: '.qor-js-check-all',
    schedulePopoverButton: '.qor-publish__button-popover',
    scheduleSetButton: '.qor-publish__button-schedule',
    scheduleTime: '.qor-publish__time',
    submit: '.qor-publish__submit',
    text: {
      title: 'Changes',
      close: 'Close'
    }
  };

  Publish.SCHEDULE = (
    '<div class="qor-modal qor-modal-mini fade" tabindex="-1" role="dialog" aria-hidden="true">' +
      '<div class="mdl-card mdl-shadow--4dp" role="document">' +
        '<div class="mdl-card__title">' +
          '<h2 class="mdl-card__title-text">[[modalTitle]]</h2>' +
        '</div>' +
        '<div class="mdl-card__supporting-text"><p class="hint">[[modalHint]]</p><input class="mdl-textfield__input qor-publish__time" type="text" /></div>' +
        '<div class="mdl-card__actions">' +
          '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect qor-publish__button-schedule">[[modalSet]]</a>' +
          '<a class="mdl-button mdl-js-button mdl-js-ripple-effect" data-dismiss="modal">[[modalCancel]]</a>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  Publish.MODAL = (
    '<div class="qor-modal fade" tabindex="-1" role="dialog" aria-hidden="true">' +
      '<div class="mdl-card mdl-shadow--4dp" role="document">' +
        '<div class="mdl-card__title">' +
          '<h2 class="mdl-card__title-text">${title}</h2>' +
        '</div>' +
        '<div class="mdl-card__supporting-text"></div>' +
        '<div class="mdl-card__actions">' +
          '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" data-dismiss="modal">${close}</a>' +
        '</div>' +
        '<div class="mdl-card__menu">' +
          '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-dismiss="modal" aria-label="close">' +
            '<i class="material-icons">close</i>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>'
  );

  Publish.plugin = function (option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data(NAMESPACE);
      var options;
      var fn;

      if (!data) {
        if (/destroy/.test(option)) {
          return;
        }

        options = $.extend(true, {
          text: $this.data('text')
        }, typeof option === 'object' && option);

        $this.data(NAMESPACE, (data = new Publish(this, options)));
      }

      if (typeof option === 'string' && $.isFunction(fn = data[option])) {
        fn.apply(data);
      }
    });
  };

  $(function () {
    Publish.plugin.call($('.qor-theme-publish'));
  });

});
