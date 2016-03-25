$(function () {
    try {
        $(document).on('blur', '.' + CustomUI.invalid_field_class, function (e) {
            $(this).removeClass(CustomUI.invalid_field_class);
            $(this).validationEngine('hide');
        });
        // перетаскивание форм за заголовок
        $('.popup-form').draggable({
            handle: '.popup-form-toolbox',
            containment: '#shadow',
            scroll: false
        });
    } catch (e) {
        // do nothing
    }
});

var CustomUI = {
    // класс невалидного поля
    invalid_field_class: 'invalid_field',
    // идентификаторы все открытых окон
    popup_form_opened_forms_id: [],
    popup_form_freezed_id: null,
    wait_url: null,
    wait_interval_id: null,
    wait_form_id: null,
    confirm_answer: null,
    shadow_id: '#shadow',
    // wait_image: '<img width="24" height="24" title="" alt="" src="data:image/gif;base64,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" />',
    wait_image: '<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>',
    addMoreFileFieldEx: function (target, name, max_input_count, class_name, accept) {
        if (max_input_count > 0) {
            if ($(target).find('input[type=file]').size() >= max_input_count) {
                // Нельзя загружать больше файлов чем указано
                return false;
            }
        }
        class_name = class_name || '';
        var accept_prop = accept || '';
        if (accept_prop) {
            accept_prop = 'accept="' + accept_prop + '"';
        }
        var f = '<input name="' + name + '" type="file" ' + accept_prop + ' class="gn-file-add ' + class_name + '" /><br />';
        $(target).append(f);
        CustomUI.centerForms();
        var inp = $(target).find('input[type=file]:last');
        inp.data('more_file_field_target', target);
        $(inp).on('change', function (e) {
            var target = $(e.target).data('more_file_field_target');
            if (target) {
                $(e.target).data('more_file_field_target', '');
                CustomUI.addMoreFileFieldEx(target, name, max_input_count, class_name, accept);
            }
            return false;
        });
        inp.styler({
            filePlaceholder: '',
            fileBrowse: 'Выбрать файл' // Текст кнопки у загрузчика файлов
        });
        return false;
    },
    round: function precise_round(num, decimals) {
        num = parseFloat(num);
        var t = Math.pow(10, decimals);
        // Math.sign(num) есть не во всех браузерах
        var sign = typeof num === 'number' ? num ? num < 0 ? -1 : 1 : num === num ? 0 : NaN : NaN;
        return (Math.round((num * t) + (decimals > 0 ? 1 : 0) * (sign * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
    },
    /**
     * Реализации функции print_r() из PHP
     * 
     * @param Array/Hashes/Objects
     * @param {Number} level
     
     * @returns {String}
     */
    dump: function (arr, level) {
        var dumped_text = '';
		if(!level) level = 0;
        var level_padding = '';
        for (var j = 0; j < level + 1; j++) {
            level_padding += '    ';
        }
        if (typeof (arr) == 'object') { // Array/Hashes/Objects 
            for (var item in arr) {
                var value = arr[item];
                if (typeof (value) == 'object') { //If it is an array,
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += CustomUI.dump(value, level + 1);
                } else {
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        } else {
            dumped_text = '===>' + arr + '<===(' + typeof (arr) + ')';
        }
        return dumped_text;
    },
    /**
     * Нажатие кнопки на панели инструментов диалоговых окон
     */
    setButtonHandlers: function () {
        $('.popup-form-button, .button-submit').unbind('click').click(function () {
            if (!$(this).hasClass('disabled')) {
                $(this).closest('form').submit();
            }
            return false;
        });
        $('.popup-form-button, .button-simple').unbind('click').click(function () {
            var dis = $(this).attr('disabled');
            if (dis != 'disabled') {
                // id - операция
                var id = $(this).attr('id');
                try {
                    var form = $('#form-' + id);
                    var func = form.data('before_show');
                    var ns = true;
                    if (func instanceof Function) {
                        var oc = form.data('_opencounter');
                        if (typeof oc == 'undefined') {
                            oc = 0;
                        } else {
                            oc++;
                        }
                        form.data('_opencounter', oc);
                        ns = func(this, oc);
                    }
                    if (ns) {
                        CustomUI.showForm('form-' + id, true, true, {});
                    }
                    return false;
                }
                catch (e) {
                    alert('Ошибка: ' + e)
                };
            }
            return false;
        });
        return false;
    },
    /**
     * Центрирование всех форм по центру сайта
     */
    centerForms: function () {
        for (i = 0; i < CustomUI.popup_form_opened_forms_id.length; i++) {
            var hide_id = CustomUI.popup_form_opened_forms_id[i];
            if ($('#' + hide_id).is(':visible')) {
                $('#' + hide_id).css({left: function () {
                        return $(window).width() * 0.5 - $(this).outerWidth() * 0.5;
                    }, top: function () {
                        return 30;//$(window).height() * 0.5 - $(this).outerHeight() * 0.5;
                    }});
            }
        }
        return false;
    },
    
    log: function (message) {
        // $('div#log').append(message + '<br />');
    },
    /**
     * Открытие формы
     */
    showForm: function (id, can_close, apply_class, options) {
        var form = $('#' + id);
        CustomUI.log('showForm(\'#' + id + '\');');
        if ((typeof apply_class == 'undefined') || apply_class) {
            var no_cap = form.hasClass('popup-nocaption');
            if (!no_cap) {
                var title = form.attr('title');
				if(title == undefined) {title = form.data('title');}
                if(title == undefined) {title = '';}
                form.data('title', title);
                if (form.find('.popup-form-toolbox').size() < 1) {
                    form.removeAttr('title').data('title', title);
                    var buttons = '';
                    if (can_close == null || can_close === true) {
                        buttons += '<a title="Закрыть окно" href="#" onclick="return CustomUI.hideForm();" class="popup-close-button popup-toolbox-button">&times;</a>';
                    }
                    form.prepend('<div class="popup-form-toolbox"><h2 id="' + id + '-title">' + title + '</h2>' + buttons + '</div>');
                } else {
                    var h2 = form.find('.popup-form-toolbox h2');
                    if (h2 != 'undefined') {
                        h2.empty().append(title);
                    }
                }
            }
        }
        form.css({margin: 0});
        var w = form.outerWidth();
        var h = form.outerHeight();
        var x = $(window).width() / 2 - w / 2;
        var y = $(window).height() / 2 - h / 2;
        CustomUI.hideForm();
        if (options) {
            form.data('options', options);
            if (options.wait_url) {
                CustomUI.wait_url = options.wait_url;
                if (CustomUI.wait_interval_id) {
                    clearInterval(CustomUI.wait_interval_id);
                }
                CustomUI.wait_interval_id = setInterval(function () {
                    $.getJSON(CustomUI.wait_url, function (data) {
                        var percent = ((data.value / data.total) * 100).toFixed(2);
                        var progress_bar = '<div class="progress"><div class="bar" style="width: ' + percent + '%;"></div></div>';
                        var message = data.message || options.wait_message;
                        var text = '<br>' + progress_bar + message;
                        $('#popup-form-wait_message').html(text);
                    });
                }, 500);
            }
        }
        CustomUI.popup_form_opened_forms_id.push(id);
        CustomUI.showShadow();
        form.data('shadow', $(CustomUI.shadow_id))
                .css({position: 'fixed', left: x, top: y, 'z-index': 3000})
                .show();
        var content_h = $(window).height() - 150;
        form.find('.popup-form-content').css({'max-height': content_h});
        // автофокус на первом элементе управления
        if (form.find('[data-first-focus]').size() > 0) {
            form.find('[data-first-focus]').eq(0).focus();
        } else {
            if (form.find('input[type=text]:visible').size() > 0) {
                form.find('input[type=text]:visible:first').focus();
            } else if (form.find('input[type=password]:visible').size() > 0) {
                form.find('input[type=password]:visible:first').focus();
            } else {
                if (form.find('textarea:visible:first').size() > 0) {
                    form.find('textarea:visible:first').focus();
                } else {
                    form.find('select:visible:first').focus();
                }
            }
        }
        // "колбэк" функция сразу после показа окна
        callback = form.data('after_show');
        if (callback instanceof Function) {
            callback(this);
        }
        return CustomUI.centerForms();
    },
    
    showShadow: function () {
        $(CustomUI.shadow_id).show();
    },
    
    hideShadow: function () {
        $(CustomUI.shadow_id).hide();
    },
    /**
     * Закрытие всех открытых форм с генерацией события "onclose"
     * @since 2011-10-12
     */
    hideForm: function (id) {
        // preloader.off();//fadeOut();
        var id_list = CustomUI.popup_form_opened_forms_id.slice(0);
        CustomUI.popup_form_opened_forms_id = [];
        while (hide_id = id_list.pop()) {
            if ($('#' + hide_id).is(':visible')) {
                var options = $('#' + hide_id).data('options');
                var defaults = {
                    can_close: true,
                    onclose: false
                };
                var options = $.extend(defaults, options);
                if (options.can_close) {
                    CustomUI.hideShadow();
                    $('#' + hide_id).hide();
                }
                var onclose = options['onclose'];
                if (onclose instanceof Function) {
                    var params = options['params'];
                    onclose(params);
                }
            }
        }
        return CustomUI.setButtonHandlers();
    },
    /**
     * Показ формы с сообщением
     * 
     * string message Текст сообщения
     * string title Заголовок окна
     * string icon стиль окна(info,error)
     * string options Массив с опциями окна (например событие "onclose")
     */
    showMessage: function (message, title, icon, options) {
        if (icon == 'error') {
            Materialize.toast(message, 4000);
            return false;
        }
        CustomUI.log('showMessage(\'' + $('<div/>').text(message).html() + '\');');
        if (typeof title == 'undefined') {
            title = '';
        }
        title = title.replace(/<\/?[^>]+(>|$)/g, '');
        $('#form-msg-popup-window').attr('title', title);
        $('#form-msg-popup-window')
                .removeClass('popup-window-error')
                .removeClass('popup-window-info')
                .removeClass('popup-window-wait');

        if (icon == 'info') {
            $('#form-msg-popup-window').addClass('popup-window-info');
        }
        if (icon == 'error') {
            $('#form-msg-popup-window').addClass('popup-window-error');
        }
        if (icon == 'wait') {
            $('#form-msg-popup-window').addClass('popup-window-wait');
        }
        $('#form-msg-popup-window .popup-form-content').html(message);
        return CustomUI.showForm('form-msg-popup-window', true, true, options);
    },
    showWait: function (text, caption, wait_url) {
        // preloader.on();//fadeIn();
        return false;
        /*
         CustomUI.log('showWait();');
         // why is need???
         if(typeof caption == 'undefined') {
         caption = '';
         }
         caption = caption.replace(/<\/?[^>]+(>|$)/g, '');
         //if(CustomUI.popup_form_opened_forms_id.length < 1) {
         text = text ? text : 'Пожалуйста подождите...';
         caption = caption ? caption : 'Получение данных';
         return CustomUI.showMessage('<div style="text-align: center;" id="popup-form-wait_message">' + this.wait_image + '<br />' + text + '</div>', caption, 'wait', {wait_url: wait_url});
         //}
         */
    }
}

$(function ($) {

    // добавление затемнения (фон для окон)
    $('body').prepend('<div id="shadow" style="display:none;"></div>');
    // добавление окна сообщений
    $('body').prepend('<form class="popup-form" id="form-msg-popup-window" title="" style="display: none;"><div class="popup-form-content"></div></form>');
    $('body').prepend('<form class="popup-form" id="form-msg-popup-confirm" title="" style="display: none;"><div class="popup-form-content"></div><div class="popup-form-footer"><input type="submit" value=" Да " class="btn btn-primary" title="Продолжить" onclick="CustomUI.confirm_answer = true; CustomUI.hideForm(); return false;" name="yes" /> <input type="submit" class="btn btn-default" value=" Отмена " title="Прекратить выполнение действия" onclick="CustomUI.confirm_answer = false; CustomUI.hideForm(); return false;" name="cancel" /></div></form>');
    CustomUI.setButtonHandlers();

    /**
     * Закрытие всех окон по нажатию на клавишу [Esc]
     */
    $(document).on('keyup', function (event) {
        try {
            if (event.keyCode == 27) { // 27 is keycode for [Esc] button on keyboard
                CustomUI.hideForm('');
                event.preventDefault();
            }
        } catch (e) {
            // do nothing
        }
    });

    /**
     * "Быстроссылка" из любого тега (например TR)
     */
    $('[data-href]').click(function (e) {
        if (e.target.tagName != 'A') {
            var url = $(this).attr('data-href');
            location.href = url;
            return false;
        }
    });

    /**
     * Обработка элементов с атрибутом data-sort
     */
    $('[data-sort]').unbind('click').click(function () {
        var dir = $(this).data('sort-dir');
        if (dir == 'asc') {
            dir = 'desc';
        } else {
            dir = 'asc';
        }
        var field = $(this).attr('data-sort');
        $(this).closest('form').find('.sort_field').val(field);
        $(this).closest('form').find('.sort_dir').val(dir);
        $(this).closest('form').submit();
    });

    /**
     * Обработка элементов с атрибутом data-ajax
     */
    $('[data-ajax]').click(function () {
        var params = $(this).attr('data-ajax');
        // результат
        try {
            var options = eval('(' + params + ')');
            // default configuration properties
            var defaults = {
                url: '',
                type: 'post',
                refresh: false,
                callback: false,
                go: ''
            };
            var options = $.extend(defaults, options);
            CustomUI.showForm('form-wait', false, true);
            $.post(options.url, function (data) {
                // результат
                try {
                    var obj = eval('(' + data + ')');
                    if (options.callback) {
                        CustomUI.hideForm();
                        var callback = eval(options.callback);
                        callback.call(obj);
                        return false;
                    }
                    if (obj.status == 'success' && (options.refresh || options.go)) {
                        window.location = options.go;
                    } else {
                        CustomUI.hideForm();
                        alert(obj.message);
                    }
                }
                catch (e) {
                    CustomUI.hideForm();
                    alert(e);
                }
            });
        }
        catch (e) {
            alert(e);
        }
        return false;
    });

    $.fn.customFileInput = function (options) {
        // default configuration properties
        var defaults = {
            name: false,
            max_count: 5,
            class_name: '',
            accept: ''
        };
        var options = $.extend(defaults, options);
        this.each(function () {
            CustomUI.addMoreFileFieldEx(this, options.name, options.max_count, options.class_name, options.accept);
        });
    };

    $.fn.customSubmit = function (in_options) {
        // default configuration properties
        var defaults = {
            success: false,
            onclose: false,
            error: false,
            caption: '',
            show_wait: true,
            confirm: false,
            ajax: true,
            json: false,
            validate_function: false,
            wait_message: 'Пожалуйста, подождите...',
            wait_url: ''
        };
        this.each(function () {
            var options = $.extend(defaults, in_options);
            // check if listeneer already installed
            if (typeof $(this).data('CustomUI_lai') == 'undefined') {
                $(this).data('CustomUI_lai', true);
            } else {
                var id = $(this).attr('id');
                return alert('CustomUI.customSubmit() already installed for\nform #' + id);
            }
            // Clone object
            $(this).data('_options', jQuery.extend(true, {}, options));
            $(this).submit(
                    function () {
                        $(this).find('.button-submit').addClass('disabled'); // .prop('disabled', 'disabled');
                        // Fix TinyMCE bug ("before ajax.submit()") http://blog.pavelb.ru/2012/07/tinymce-jquery-form-plugin.html
                        if (typeof tinymce === 'object') {
                            tinymce.triggerSave();
                        }
                        var options = $(this).data('_options');
                        options.target_form = $(this).attr('id');
                        try {
                            var freezed_form_id = $(this).hasClass('popup-form') ? $(this).attr('id') : false;
                            // show_wait
                            var sw = $(this).data('show_wait');
                            options.show_wait = (typeof sw != 'undefined') ? sw : options.show_wait;
                            // caption
                            options.caption = options.caption ? options.caption : $(this).data('title');
                            if (!options.caption) {
                                options.caption = $(this).attr('title');
                            }
                            // onclose
                            options.onclose = options.onclose ? options.onclose : $(this).data('onclose');
                            if (!options.onclose) {
                                options.onclose = defaults.onclose;
                            }
                            // success
                            options.success = options.success ? options.success : $(this).data('success');
                            if (!options.success) {
                                options.success = defaults.success;
                            }
                            // error
                            options.error = options.error ? options.error : $(this).data('error');
                            if (!options.error) {
                                options.error = defaults.error;
                            }
                            // confirm
                            options.confirm = options.confirm ? options.confirm : $(this).data('confirm');
                            if (!options.confirm) {
                                options.confirm = defaults.confirm;
                            }
                            // validate function
                            options.validate_function = options.validate_function ? options.validate_function : $(this).data('validate_function');
                            if (!options.validate_function) {
                                options.validate_function = defaults.validate_function;
                            }
                            $(this).data('options', options);
                            if (options.confirm) {
                                if (CustomUI.confirm_answer == null) {
                                    var object = this;
                                    $('#form-msg-popup-confirm .popup-form-content').html(options.confirm);
                                    $('#form-msg-popup-confirm').attr('title', options.caption);
                                    $('#form-msg-popup-confirm').data(
                                            'options',
                                            {
                                                onclose: function (e) {
                                                    if (CustomUI.confirm_answer) {
                                                        $(object).submit();
                                                    }
                                                    else {
                                                        CustomUI.confirm_answer = null;
                                                        return false;
                                                    }
                                                }
                                            }
                                    );
                                    return CustomUI.showForm('form-msg-popup-confirm', false, true);
                                }
                                if (!CustomUI.confirm_answer) {
                                    CustomUI.confirm_answer = null;
                                    return false;
                                }
                                CustomUI.confirm_answer = null;
                            }
                            if (options.validate_function instanceof Function) {
                                if (!options.validate_function(this)) {
                                    return false;
                                }
                            }
                            if (options.ajax) {
                                // вывод информирующей формы с предложением дождаться серверной обработки формы
                                if (options.show_wait instanceof Function) {
                                    options.show_wait(options);
                                } else if (options.show_wait) {
                                    CustomUI.showWait(options.wait_message, options.caption, options.wait_url);
                                }
                                var op = {
                                    // успешный HTTP ответ (статус 200)
                                    success: function (data) {
                                        if (options.json) {
                                            // если в ответ должен прийти json объект
                                            var obj;
                                            try {
                                                // раскодируем сериализованный объект
                                                if (data instanceof Object) {
                                                    obj = data;
                                                } else {
                                                    obj = eval('(' + data + ')');
                                                }
                                                // на сервере произошла ошибка
                                                if (obj.status == 'redirect') {
                                                    Materialize.toast(obj.message, 40000);
                                                    location.href = obj.uri;
                                                } else if (obj.status != 'success') {
                                                    // подсвечивание "плохо заполненных" полей
                                                    if (obj.error_field_list instanceof Object) {
                                                        CustomUI.hideForm('');
                                                        if (freezed_form_id) {
                                                            CustomUI.showForm(freezed_form_id, true, true, {});
                                                        }
                                                        var scroll = 0;
                                                        $.each(obj.error_field_list, function (key, value) {
                                                            var field = $('#' + options.target_form).find('[name^="form[' + key + ']"]')
                                                                    .removeClass(CustomUI.invalid_field_class)
                                                                    .addClass(CustomUI.invalid_field_class)
                                                                    .validationEngine('showPrompt', value ? value : 'Необходимо заполнить', 'error', 'bottomLeft', false);
                                                            if(scroll == 0) {
                                                                scroll = field.offset().top;
                                                            }
                                                        });
                                                        $('#' + options.target_form).find('.button-submit').removeClass('disabled');
                                                        if(scroll != 0) {
                                                            $('html,body').animate({scrollTop: scroll}, 600);
                                                            $(window).scrollTop(scroll);
                                                        }
                                                        return;
                                                    } else {
                                                        throw obj.message;
                                                    }
                                                }
                                                // если есть callback-функция для обработки статуса "успех"
                                                if (options.success instanceof Function) {
                                                    options.success(obj ? obj : data);
                                                } else {
                                                    // если в ответе отсутствует сообщение, присваиваем стандартное
                                                    if (!obj.message) {
                                                        obj.message = 'Действие успешно выполнено';
                                                    }
                                                    // вывод информирующей формы
                                                    CustomUI.hideForm('');
                                                    Materialize.toast(obj.message, 4000);
                                                    // CustomUI.showMessage(obj.message, options.caption, 'info', {onclose: options.success, params: data});
                                                }
                                            } catch (e) {
                                                $('#' + options.target_form).find('.button-submit').removeClass('disabled');
                                                // если есть callback-функция для обработки статуса "ошибка"
                                                if (options.error instanceof Function) {
                                                    return options.error(obj ? obj : data);
                                                } else {
                                                    // вывод информирующей формы
                                                    if ((typeof obj.code != 'undefined') && (obj.code == 211)) {
                                                        location.href = '/index/logout/';
                                                        return false;
                                                    }
                                                    CustomUI.hideForm();
                                                    Materialize.toast(e, 4000);
                                                    /*
                                                     return CustomUI.showMessage(e, options.caption, 'error', {onclose: function(data) {
                                                     if(freezed_form_id && $('#'+freezed_form_id+' .popup-form-content').length) {
                                                     return CustomUI.showForm(freezed_form_id, true, true, {});
                                                     }
                                                     }, params: data});
                                                     */
                                                }
                                            }
                                        } else {
                                            CustomUI.hideForm();
                                            // если есть callback-функция для обработки статуса "успех"
                                            if (options.success instanceof Function) {
                                                options.success(data);
                                            }
                                        }
                                    },
                                    headers: {
                                        'HTTP_X_REQUESTED_WITH': 'xmlhttprequest',
                                        'X-Requested-With': 'xmlhttprequest'
                                    },
                                    // ошибочный HTTP ответ
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        $('#' + options.target_form).find('.button-submit').removeClass('disabled');
                                        var e = 'Ошибка связи с сервером №' + jqXHR.status + ': ' + jqXHR.statusText;
                                        return CustomUI.showMessage(e, options.caption, 'error', {onclose: function (data) {
                                                if (freezed_form_id && $('#' + freezed_form_id + ' .popup-form-content').length) {
                                                    return CustomUI.showForm(freezed_form_id, true, true, {});
                                                }
                                            }, params: false});
                                    },
                                    beforeSend: function (xhr, a) {
                                        xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest');
                                        xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'xmlhttprequest');
                                    }
                                };
                                // отправка формы на сервер
                                $(this).ajaxSubmit(op);
                                return false;
                            } else {
                                CustomUI.hideForm();
                                return true;
                            }
                        } catch (e) {
                            alert('eee: ' + e);
                            return false;
                        }
                    }
            );
        });
    };

    /**
     * Treeview
     */
    $.fn.treeView = function (options) {
        // default configuration properties
        var defaults = {
            click: '',
            allow_collapse_expand: true,
            collapse_expand_animate: true,
            icon_folder_class: 'tree-icon-folder',
            icon_file_class: 'tree-icon-file'
        };
        var options = $.extend(defaults, options);
        this.each(function () {
            var obj = $(this);
            obj.addClass('ui-nice-treeview');
            $('li a', obj).click(function () {
                var id = $(this).parent().attr('id');
                var li = $(this).closest('li');
                if (options.allow_collapse_expand) {
                    // скрытие/раскрытие
                    if (options.collapse_expand_animate) {
                        $(this).parent().children('ul:first').slideToggle('fast', function () {
                            if ($(this).is(':visible')) {
                                $(li).addClass('expanded');
                            } else {
                                $(li).removeClass('expanded');
                            }
                        });
                    }
                    else {
                        $(this).parent().children('ul:first').toggle(0, function () {
                            if ($(this).is(':visible')) {
                                $(li).addClass('expanded');
                            } else {
                                $(li).removeClass('expanded');
                            }
                        });
                    }
                }
                if (options.click) {
                    options.click(this);
                }
            });
        });
    };

    $('.popup-ajax').customSubmit({
        json: true
    });

});

/**
 * Центрование открытых/видимых форм при ресайзе окна браузера
 */
$(window).resize(function () {
    CustomUI.centerForms();
});

function show_wait() {
    return CustomUI.showWait('Пожалуйста подождите...', 'Получение данных');
}

/**
 * Показ формы с сообщением
 */
function show_message(message, title, icon, options) {
    return CustomUI.showMessage(message, title, icon, options);
}

/**
 * Открытие формы
 */
function show_form(id, can_close, apply_class) {
    return CustomUI.showForm(id, can_close, apply_class, {can_close: can_close});
}

/**
 * Закрытие всех открытых форм с генерацией события "onclose"
 */
function hide_form(id) {
    return CustomUI.hideForm(id);
}

/**
 * Центрирование всех открытых форм
 */
function center_forms() {
    return CustomUI.centerForms();
}
