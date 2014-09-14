/**
 * Copyright (C) 2014 yanni4night.com
 * index.js
 *
 * changelog
 * 2014-09-14[10:09:36]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

var EVT_TRANSITIONEND = 'webkitTransitionEnd mozTransitionEnd msTransitionEnd transitionend';

//we have to assume that all properties are done in a transition
function TransEntity(opt) {
    opt = this.opt = $.extend({
        $entity: null,
        init: $.noop,
        transClass: ['trans-on'],
        onComplete: $.noop
    }, opt || {});
    var transIndex = 0;
    var self = this;
    var endCache = {};

    if (!opt.$entity) {
        throw new Error('entity is required');
    }

    opt.init.call(this);

    opt.$entity.on(EVT_TRANSITIONEND, function(e) {
        if (!endCache[transIndex]) {
            opt.onComplete.call(self, transIndex);
            endCache[transIndex] = true;
        }
    });

    this.next = function() {
        var tclaz;
        if (!(tclaz = opt.transClass[transIndex])) {
            return;
        }
        opt.$entity.addClass(tclaz);
        ++transIndex;
    };

    this.prev = function() {

    };
}

setTimeout(function() {
    var $ = window.jQuery;

    var imgEntity = new TransEntity({
        $entity: $('.vcard img'),
        transClass: ['trans-up', 'trans-left'],
        onComplete: function(idx) {
            switch (idx) {
                case 1:
                    setTimeout((function() {
                        this.next()
                    }).bind(this), .2e3);
                    break;
                case 2:
                    startBtnEntity.next();
                default:
            }
        }
    });

    var vcardEntity = new TransEntity({
        $entity: $('.vcard'),
        transClass: ['trans-up', 'trans-corner'],
        onComplete: function(idx) {
            switch (idx) {
                case 1:
                    imgEntity.next();
                    break;
                case 2:

                    break;
                default:
            }

        }
    });


    var startBtnEntity = new TransEntity({
        $entity: $('a.start'),
        transClass: ['trans-show', 'trans-down'],
        init: function() {
            this.opt.$entity.click(function(e) {
                e.preventDefault();
                vcardEntity.next();
                ctrlEntity.next();
            });
        },
        onComplete: function(idx) {
            switch (idx) {
                case 1:
                    this.next();
                    break;
            }
        }
    });


    var ctrlEntity = new TransEntity({
        $entity: $('#ctrl-list'),
        transClass: ['trans-top', 'trans-left'],
        init: function() {
            var self = this;

            $("<form/>", {
                id: 'prop-form',
                action: '/loadconfig',
                target: 'prop-iframe',
                'class': 'hide'
            }).append($('<input/>', {
                id: 'f',
                name: 'f'
            })).appendTo($(document.body));

            self.opt.$entity.delegate('li', 'click', function(e) {

                if (!self.walked) {
                    self.walked = true;
                    self.next();
                    fieldsEntity.next();
                }

                self.opt.$entity.find('li').removeClass('hover');
                $(this).addClass('hover');

                var f = $(this).attr('data-file');
                $('#f').val(f);
                document.getElementById('prop-form').submit();
            });

        },
        onComplete: function(idx) {
            switch (idx) {
                case 1:
                    break;
                case 2:
                    break;
            }
        }
    });

    var fieldsEntity = new TransEntity({
        $entity: $('#ctrl-fields'),
        transClass: ['trans-top', 'trans-right'],
        init: function() {},
        onComplete: function(idx) {
            switch (idx) {
                case 1:
                    break;
                case 2:
                    break;
            }
        }
    });

    vcardEntity.next();

}, .5e3);

//Change bg
! function() {
    var startBgIndex = $(document.body).attr("data-bgindex") | 0;
    var getNextBg = function() {
        var url = '/images/desktop/' + ++startBgIndex + '.jpg';
        new Image().src = url;
        return url;
    };

    var img = getNextBg();
    setInterval(function() {
        $(document.body).css('background-image', 'url(' + img + ')');
        img = getNextBg();
    }, 1.2e5);
}();