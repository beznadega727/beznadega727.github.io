$(function() {
    $("#fullPage").click(function() {
        $("#rightWrapper").toggleClass("full-page");
        $("#header").toggleClass("full-page");
    });
})

$(function() {
    $('.ajax_grid').on('click', function() {
        $(this).closest('.row').prev('.row').find('.hidden_ajax_grid').removeClass('hidden_ajax_grid');
        $(this).closest('.row').remove();
    });
    $('.search_bl button.submit, #search_bl button.submit').on('click', function() {
        window.location.href='/search.html';
    });
    $('.sample_page .carousel-inner h1').on('click', function() {
        window.location.href='/sample_page.html';
    });
    $('.btn_link_opt a.btn_slide_options span.opt_ico_1').on('click', function() {
        window.location.href='/reader/default.htm?baseurl=/reader/DataProvider/AjaxExample/11668997/';
    });
    $('.btn_link_opt a.btn_slide_options span.opt_ico_4').on('click', function() {
        window.location.href='/order.html';
    });
    $('.author_book').on('click', function() {
        window.location.href='/book.html';
    });
    $('.header_nav_mob .submit.buy_mobile').on('click', function() {
        window.location.href='/order.html';
    });
    $('#search_bl button').on('click', function() {
        window.location.href='/search.html';
    });
    $('.main_ctl_fullscreen').on('click', function() {
        if($(this).hasClass('fullscreen_zak')) {
            $(this).removeClass('fullscreen_zak').addClass('fullscreen_zak_off');
        }else{
            $(this).removeClass('fullscreen_zak_off').addClass('fullscreen_zak');
        }
    });
    $('.language_list li a').on('click', function() {
        $('#language_btn').click();
    });
    $('.tabs_list_literator li a').on('click', function() {
        var par = $('.view_list_book:visible');
        par.find('li').removeClass('active');
        par.find('li:eq(0) a').click();
    })
    $("#search_input").keyup(function(e){
        var val = $(this).val();
        var width = val.length*20;
        var maxlength = 47;
        $(this).val(val.substr(0, maxlength)); 
        if(width > 170) {
            $(this).stop().animate({
                width: val.length*20
            },100);
        }
    })
    $("#listView li").click(function () {
        if ( $("#listView li").hasClass("list-item-active") ) {
            $("#listView li").removeClass("list-item-active");
        }
        $(this).addClass("list-item-active");
    });
    $('#left_menu > ul > li > a').on('click', function() {
        var ul = $(this).find('ul');
        if(!ul.length) return;
        console.log(ul.is(':visible'));
        if(ul.is(':visible')) {
            ul.hide();
        }else{
            ul.show();
        }
    });
    $('.login_btn').on('click', function() {
        if($('#form-login').length) {
            show_form('form-login');
        }
    });
    $('.reg_btn').on('click', function() {
        if($('#form-registration').length) {
            show_form('form-registration');
        }
    });
    $('.start_review').on('click', function() {
        $('.review_active_edt').show();
        $('html,body').animate({
            scrollTop: $('.review_active_edt').offset().top
        }, 'slow');
    });
    $('.start_article').on('click', function() {
        $('.article_active_edit').show();
        $('html,body').animate({
            scrollTop: $('.article_active_edit').offset().top
        }, 'slow');
    });
    $(".add_file").on('click', function(e){
        e.preventDefault();
        $(this).closest('div').find('input[type=file]').trigger('click');
    });
});
function OpenMenu()
{

    if ($('#left_menu').css("marginLeft") == '0px') {
        //$('.content_bl .container').removeClass('padd_content');
        $('.btn_menu').removeClass('active');
        $('.left_menu_nav, #left_menu').removeClass('fix');
        $('.left_menu_nav > .btn_menu').removeClass('hidden');
        $('#left_menu').animate({
                marginLeft: "-300px"
            }, 100
        );
        $('#search_bl').animate({
                marginLeft: "-500px"
            }, 100
        );
    } else {
        $('.btn_menu').addClass('active');
        //$('.content_bl .container').addClass('padd_content');
        $('.left_menu_nav > .btn_menu').addClass('hidden');
        setTimeout(function(){
            $('.left_menu_nav, #left_menu').addClass('fix');
        }, 300);
        $('#left_menu').animate({
                marginLeft: "0px"
            }, 100
        );
    }
}

function OpenSearch()
{

    if ($('#search_bl').css("marginLeft") == '0px') {
        $('#search_bl').removeClass('active');
        $('#search_bl').animate({
                marginLeft: "-500px"
            }, 100
        );
    } else {
        if($('.menu_link').is(':visible')) {
            $('#mob_menu').click();
        }
        $('#search_bl').addClass('active');
        $('#search_input').focus();
        $('#search_bl').animate({
                marginLeft: "0px"
            }, 100
        );

    }
}
function checkParams() {
    var search = $('#search_input').val();

    if(search.length != 0) {
        $('#submit').removeAttr('disabled').addClass('active_btn');
    } else {
        $('#submit').attr('disabled', 'disabled').removeClass('active_btn');
    }
}
jQuery(document).ready(function($) {
    $('.quont-minus').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        return false;
    });
    $('.quont-plus').click(function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
    });
});
$(document).ready(function() {

//Sort random function
    function random(owlSelector){
        owlSelector.children().sort(function(){
            return Math.round(Math.random()) - 0.5;
        }).each(function(){
            $(this).appendTo(owlSelector);
        });
    }
    $(".carousel_scroll, #carousel_scroll").owlCarousel({
        itemsCustom: [
            [0, 1],
            [500, 2],
            [700, 3],
            [900, 4],
            [1200, 4],
            [1400, 5],
            [1600, 6]
        ],
        /*itemsDesktop : [1200,3], //3 items between 1000px and 901px
        itemsDesktopSmall : [900,2], // betweem 900px and 501px
        itemsTablet: [500,1], //1 items between 500 and 0
        itemsMobile : false, // itemsMobile disabled - inherit from itemsTablet option*/
        touchDrag: false,
        mouseDrag: false,
        loop:true,
        margin: 0,
//            nav:true,
        navigation: true,
        navigationText: [
            "<a class='btn_left'><img src='img/arrow_book_left.png'></a>",
            "<a class='btn_right'><img src='img/arrow_book_right.png'></a>"
        ],
        beforeInit : function(elem){
            //Parameter elem pointing to $("#owl-demo")
            random(elem);
        }

    });
    $('#language_btn').click(function(){
        $('.language_list').toggleClass('language_show');
    });
    $('#mob_menu, .left_btn_menu').click(function(){
        if ($('#navbar-mob').css("marginLeft") == '0px') {
            $('#navbar-mob').animate({
                    marginLeft: "-100%"
                }, 300
            );
            $('body,html').css("overflow","visible");
             $('.menu_link').fadeOut('100');
            $('body').css({'padding-right':'0'});
            $('#left_menu').removeClass('border_menu');
            $('.content_bl').removeClass('blur_effect');
            $('#mob_menu').css("float","left");
            $('.header_nav_mob').css('position', 'static');
        } else {
            $('#navbar-mob').animate({
                    marginLeft: "0px"
                }, 300
            );
            $('.menu_link').fadeIn('100');
            $('body,html').css("overflow","hidden");
            $('body').css({'padding-right':'17px'});
            $('#left_menu').addClass('border_menu');
            $('.language_list').removeClass('language_show');
            $('.content_bl').addClass('blur_effect');
            $('#mob_menu').css("float","right");
            $('.header_nav_mob').css('position', 'absolute');
        }
    });
    $('#ava_btn').click(function() {
        //$('.ava_setting').removeClass('fadeOut');
        //$('.ava_setting').addClass('fadeIn');
        $('.ava_setting').fadeIn('400');
    });

    $('#close_ava').click(function(){
        //$('.ava_setting').removeClass('fadeIn');
        //$('.ava_setting').addClass('fadeOut');
        $('.ava_setting').fadeOut('400');
    });
});

$(".carousel").carousel({
    swipe: 30, // percent-per-second, default is 50. Pass false to disable swipe
    interval : false
});

(function($){
    $(window).load(function(){
        $.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
        $.mCustomScrollbar.defaults.axis="yx"; //enable 2 axis scrollbars by default
        $("#carousel_scroll .owl-wrapper-outer, .carousel_scroll .owl-wrapper-outer").mCustomScrollbar({
            scrollInertia:400,
            scrollbarPosition: "outside",
            axis:"x", // horizontal scrollbar
            mouseWheel:{ enable: false },
        });
    });
})(jQuery);

$('[data-toggle="popover"]').popover({
    placement : 'right',
    trigger : 'hover'
});
//Аккордионовые пункты меню мобильной версии
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.sortable = factory(root.jQuery);
    }
}(this, function($) {
    'use strict';

    function transitionEnd() {
        var el = document.createElement('mm');

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                };
            }
        }
        return false;
    }

    $.fn.emulateTransitionEnd = function(duration) {
        var called = false;
        var $el = this;
        $(this).one('mmTransitionEnd', function() {
            called = true;
        });
        var callback = function() {
            if (!called) {
                $($el).trigger($transition.end);
            }
        };
        setTimeout(callback, duration);
        return this;
    };

    var $transition = transitionEnd();
    if (!!$transition) {
        $.event.special.mmTransitionEnd = {
            bindType: $transition.end,
            delegateType: $transition.end,
            handle: function(e) {
                if ($(e.target).is(this)) {
                    return e.
                    handleObj.
                    handler.
                    apply(this, arguments);
                }
            }
        };
    }

    var MetisMenu = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, MetisMenu.DEFAULTS, options);
        this.transitioning = null;

        this.init();
    };

    MetisMenu.TRANSITION_DURATION = 350;

    MetisMenu.DEFAULTS = {
        toggle: true,
        doubleTapToGo: false,
        preventDefault: true,
        activeClass: 'active',
        collapseClass: 'collapse',
        collapseInClass: 'in',
        collapsingClass: 'collapsing',
        onTransitionStart: false,
        onTransitionEnd: false
    };

    MetisMenu.prototype.init = function() {
        var $this = this;
        var activeClass = this.options.activeClass;
        var collapseClass = this.options.collapseClass;
        var collapseInClass = this.options.collapseInClass;

        this
            .$element
            .find('li.' + activeClass)
            .has('ul')
            .children('ul')
            .attr('aria-expanded', true)
            .addClass(collapseClass + ' ' + collapseInClass);

        this
            .$element
            .find('li')
            .not('.' + activeClass)
            .has('ul')
            .children('ul')
            .attr('aria-expanded', false)
            .addClass(collapseClass);

        //add the 'doubleTapToGo' class to active items if needed
        if (this.options.doubleTapToGo) {
            this
                .$element
                .find('li.' + activeClass)
                .has('ul')
                .children('a')
                .addClass('doubleTapToGo');
        }

        this
            .$element
            .find('li')
            .has('ul')
            .children('a')
            .on('click.metisMenu', function(e) {
                var self = $(this);
                var $parent = self.parent('li');
                var $list = $parent.children('ul');
                if($this.options.preventDefault){
                    e.preventDefault();
                }
                if(self.attr('aria-disabled') === 'true'){
                    return;
                }
                if ($parent.hasClass(activeClass) && !$this.options.doubleTapToGo) {
                    $this.hide($list);
                    self.attr('aria-expanded',false);
                } else {
                    $this.show($list);
                    self.attr('aria-expanded',true);
                }

                if($this.options.onTransitionStart) {
                    $this.options.onTransitionStart(e);
                }

                //Do we need to enable the double tap
                if ($this.options.doubleTapToGo) {
                    //if we hit a second time on the link and the href is valid, navigate to that url
                    if ($this.doubleTapToGo(self) && self.attr('href') !== '#' && self.attr('href') !== '') {
                        e.stopPropagation();
                        document.location = self.attr('href');
                        return;
                    }
                }
            });
    };

    MetisMenu.prototype.doubleTapToGo = function(elem) {
        var $this = this.$element;
        //if the class 'doubleTapToGo' exists, remove it and return
        if (elem.hasClass('doubleTapToGo')) {
            elem.removeClass('doubleTapToGo');
            return true;
        }
        //does not exists, add a new class and return false
        if (elem.parent().children('ul').length) {
            //first remove all other class
            $this
                .find('.doubleTapToGo')
                .removeClass('doubleTapToGo');
            //add the class on the current element
            elem.addClass('doubleTapToGo');
            return false;
        }
    };

    MetisMenu.prototype.show = function(el) {
        var activeClass = this.options.activeClass;
        var collapseClass = this.options.collapseClass;
        var collapseInClass = this.options.collapseInClass;
        var collapsingClass = this.options.collapsingClass;
        var $this = $(el);
        var $parent = $this.parent('li');
        if (this.transitioning || $this.hasClass(collapseInClass)) {
            return;
        }

        $parent.addClass(activeClass);

        if (this.options.toggle) {
            this.hide($parent.siblings().children('ul.' + collapseInClass).attr('aria-expanded', false));
        }

        $this
            .removeClass(collapseClass)
            .addClass(collapsingClass)
            .height(0);

        this.transitioning = 1;
        var complete = function() {
            if(this.transitioning && this.options.onTransitionEnd) {
                this.options.onTransitionEnd();
            }
            $this
                .removeClass(collapsingClass)
                .addClass(collapseClass + ' ' + collapseInClass)
                .height('')
                .attr('aria-expanded', true);
            this.transitioning = 0;
        };
        if (!$transition) {
            return complete.call(this);
        }
        $this
            .one('mmTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(MetisMenu.TRANSITION_DURATION)
            .height($this[0].scrollHeight);
    };

    MetisMenu.prototype.hide = function(el) {
        var activeClass = this.options.activeClass;
        var collapseClass = this.options.collapseClass;
        var collapseInClass = this.options.collapseInClass;
        var collapsingClass = this.options.collapsingClass;
        var $this = $(el);

        if (this.transitioning || !$this.hasClass(collapseInClass)) {
            return;
        }

        $this.parent('li').removeClass(activeClass);
        $this.height($this.height())[0].offsetHeight;

        $this
            .addClass(collapsingClass)
            .removeClass(collapseClass)
            .removeClass(collapseInClass);

        this.transitioning = 1;

        var complete = function() {
            if(this.transitioning && this.options.onTransitionEnd) {
                this.options.onTransitionEnd();
            }
            this.transitioning = 0;
            $this
                .removeClass(collapsingClass)
                .addClass(collapseClass)
                .attr('aria-expanded', false);
        };

        if (!$transition) {
            return complete.call(this);
        }
        $this
            .height(0)
            .one('mmTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(MetisMenu.TRANSITION_DURATION);
    };

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('mm');
            var options = $.extend({},
                MetisMenu.DEFAULTS,
                $this.data(),
                typeof option === 'object' && option
            );

            if (!data) {
                $this.data('mm', (data = new MetisMenu(this, options)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    }

    var old = $.fn.metisMenu;

    $.fn.metisMenu = Plugin;
    $.fn.metisMenu.Constructor = MetisMenu;

    $.fn.metisMenu.noConflict = function() {
        $.fn.metisMenu = old;
        return this;
    };
    $('#menu').metisMenu({

// auto collapse.
        toggle: true,

// double tap to go
        doubleTapToGo: false,

// prevents or allows dropdowns' onclick events after expanding/collapsing.
        preventDefault: true,

// CSS classes
        activeClass: 'active',
        collapseClass: 'collapse',
        collapseInClass: 'in',
        collapsingClass: 'collapsing',

// callbacks
        onTransitionStart: false,
        onTransitionEnd: false

    });
}));
//Аккордионовые пункты меню мобильной версии
$('.menu_style > div:eq(0) a[data-toggle]').on('click', function () {
    $('.menu_style > div:eq(2) div.tab-pane').removeClass('active');
})