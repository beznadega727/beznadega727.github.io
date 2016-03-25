/// <reference path="BookmarksWindowHead.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bookmarks;
(function (Bookmarks) {
    var BookmarksWindow = (function () {
        function BookmarksWindow(Obj, Parent) {
            this.Obj = Obj;
            this.Parent = Parent;
            this.ButtonClass = ['menu-bookmark'];
            this.CreateBookmarkState = false;
            this.ShowState = false;
            this.RegisteredWindows = [];
            this.CommentObj = new CommentWindow(this);
            this.ShareListObj = new ShareList(this);
            this.MakeHTML();
            this.SetObjectList();
            this.Parent.WindowsCarry.RegisterWindow(this);
        }
        BookmarksWindow.prototype.ButtonHandler = function () {
            if (!this.ShowState) {
                this.ShowWindow();
            }
            else {
                this.HideWindow();
            }
        };
        BookmarksWindow.prototype.SetObjectList = function () {
            this.ObjList = this.Obj.querySelector('#bookmarks-list ul');
        };
        BookmarksWindow.prototype.MakeHTML = function () {
            var content = this.Obj.querySelector('#bookmarks-list');
            content.outerHTML = this.ShareListObj.HTML + this.CommentObj.HTML + content.outerHTML;
        };
        BookmarksWindow.prototype.MakeContent = function () {
            this.PrepareData();
            this.ObjList.innerHTML = this.ParseWindowData();
            this.SetHandlers();
        };
        BookmarksWindow.prototype.ParseWindowData = function () {
            var html = '';
            if (!this.WindowData.length) {
                return '<li><div class="bookmark-top">Нет заметок/закладок</div></li>';
            }
            var title = '';
            for (var j = 0; j < this.WindowData.length; j++) {
                if (this.WindowData[j].TemporaryState == 1) {
                    continue;
                }
                var bookmark = this.WindowData[j];
                var text = bookmark.MakePreviewFromNote();
                html += '<li data-n="' + bookmark.N + '" ' +
                    'data-id="' + bookmark.ID + '" ' +
                    (bookmark.Group == 3 || bookmark.Group == 5 ? 'class="' + bookmark.Class + '" ' : '') +
                    '>';
                if (title != bookmark.Title) {
                    html += '<div class="bookmark-top">' + bookmark.Title + '</div>';
                }
                title = bookmark.Title;
                html += '<div class="bookmark-body">';
                html += '<div class="bookmark-text">' +
                    '<span class="icon-type icon-type-' + bookmark.Group + '"></span>' +
                    '<a href="javascript:void(0);" data-e="' + bookmark.Range.From + '">' + text + '</a></div>';
                if (bookmark.Group == 3 || bookmark.Group == 5) {
                    html += this.CommentObj.MakeComment(bookmark.Note[1]);
                }
                html += '<div class="bookmark-buttons">' +
                    '<a class="drop-bookmark action-icon" title="Удалить" ' +
                    'data-id="' + bookmark.ID + '" href="javascript:void(0);">x</a>';
                if (bookmark.Group == 3) {
                    html += this.CommentObj.MakeButton(bookmark.N);
                }
                html += this.ShareListObj.MakeButton(bookmark.N);
                html += '</div>' +
                    '</div>' +
                    '</li>';
            }
            return html;
        };
        BookmarksWindow.prototype.ShowWindow = function () {
            this.ShowState = true;
            this.MakeContent();
            this.Parent.Mask.Show();
            this.ToggleWindow('block');
            if (!this.Parent.PDA.state) {
                this.Scroll = new scrollbar(this.Obj.querySelector('.scrollbar'), {});
            }
        };
        BookmarksWindow.prototype.HideWindow = function () {
            this.Parent.Mask.Hide();
            this.ToggleWindow('none');
            // TODO: clear data
            this.WindowData = null;
            this.ShowState = false;
        };
        BookmarksWindow.prototype.ToggleWindow = function (state) {
            this.Obj.style.display = state;
        };
        BookmarksWindow.prototype.PrepareData = function () {
            this.WindowData = this.Parent.Bookmarks.Bookmarks.slice(0);
            this.WindowData.splice(0, 1);
            this.WindowData.sort(this.SortData);
        };
        BookmarksWindow.prototype.SortData = function (a, b) {
            var xps = FB3Reader.PosCompare(a.Range.From, b.Range.From);
            if (xps > 0)
                return 1;
            else if (xps < 0)
                return -1;
            return 0;
        };
        BookmarksWindow.prototype.GetObj = function (N) {
            return this.Obj.querySelector('#bookmarks-list li[data-n="' + N + '"]');
        };
        BookmarksWindow.prototype.RegisterWindow = function (obj) {
            this.RegisteredWindows.push(obj);
        };
        BookmarksWindow.prototype.HideRegisteredWindows = function () {
            for (var j = 0; j < this.RegisteredWindows.length; j++) {
                if (this.RegisteredWindows[j].CurrentObj) {
                    this.RegisteredWindows[j].HideWindow();
                }
            }
        };
        BookmarksWindow.prototype.SetHandlers = function () {
            var _this = this;
            // set button actions in list
            var buttons = this.Obj.querySelectorAll('.bookmark-text > a');
            for (var j = 0; j < buttons.length; j++) {
                buttons[j].addEventListener('click', function (e) { return _this.Parent.GoToBookmark(e); }, false);
            }
            buttons = this.Obj.querySelectorAll('.drop-bookmark');
            for (var j = 0; j < buttons.length; j++) {
                buttons[j].addEventListener('click', function (e) { return _this.DropBookmark(e); }, false);
            }
            this.CommentObj.SetHandlers();
            this.ShareListObj.SetHandlers();
        };
        BookmarksWindow.prototype.DropBookmark = function (event) {
            this.HideRegisteredWindows();
            if (!this.Parent.CheckDoubleClick()) {
                this.Parent.SetPreventDoubleCheck();
                var target = (event.target || event.srcElement);
                var BookmarkID = target.getAttribute('data-id');
                for (var j = 0; j < this.Parent.Bookmarks.Bookmarks.length; j++) {
                    if (this.Parent.Bookmarks.Bookmarks[j].ID == BookmarkID) {
                        this.Parent.Bookmarks.Bookmarks[j].Detach();
                        break;
                    }
                }
                this.Parent.Reader.Redraw();
                this.Parent.Reader.Site.StoreBookmarksHandler(200);
                this.MakeContent();
            }
        };
        BookmarksWindow.prototype.GetBookmark = function (ID) {
            for (var j = 0; j < this.WindowData.length; j++) {
                if (this.WindowData[j].ID == ID) {
                    return this.WindowData[j];
                }
            }
            return null;
        };
        return BookmarksWindow;
    })();
    Bookmarks.BookmarksWindow = BookmarksWindow;
    var CommentWindow = (function () {
        function CommentWindow(Owner) {
            this.Owner = Owner;
            this.MinHeight = 165;
            this.Owner.RegisterWindow(this);
            this.UpdateCommentState = true;
            this.ShowCommentButton = true;
            this.ShowCommentBox = true;
            this.Placeholder = 'Ваш комментарий';
            this.MakeHTML();
        }
        CommentWindow.prototype.MakeHTML = function () {
            this.HTML = '<div class="comment-box">' +
                '<textarea>' + this.Placeholder + '</textarea>' +
                '<div class="comment-buttons">' +
                '<a class="comment-button comment-save">Сохранить</a>' +
                '<a class="comment-button comment-cancel">Отмена</a>' +
                '</div>' +
                '</div>';
        };
        CommentWindow.prototype.Init = function () {
            var _this = this;
            if (!this.Obj) {
                this.Obj = this.Owner.Obj.querySelector('.comment-box');
                this.TextObj = this.Obj.querySelector('textarea');
                var button = this.Obj.querySelector('.comment-cancel');
                if (button) {
                    button.addEventListener('click', function () { return _this.TextCancel(); }, false);
                }
                button = this.Obj.querySelector('.comment-save');
                if (button) {
                    button.addEventListener('click', function () { return _this.TextSave(); }, false);
                }
                var placeholder = new PlaceholderClass(this.TextObj, function (text) { return _this.SetText(text); }, this.Placeholder);
            }
            if (this.CurrentObj) {
                this.CancelButton = true;
                this.Owner.HideRegisteredWindows();
            }
        };
        CommentWindow.prototype.ReplaceHTML = function (bookmark) {
            var text = bookmark.Note[1].replace(/<\/?p>/ig, '');
            this.OriginalText = text;
            if (text != '') {
                this.TextObj.value = text;
            }
            else {
                this.TextObj.value = this.Placeholder;
            }
            if (this.BookmarkButtonsObj) {
                this.CurrentObj.querySelector('.bookmark-body').insertBefore(this.Obj, this.BookmarkButtonsObj);
            }
        };
        CommentWindow.prototype.TextCancel = function () {
            this.CancelButton = true;
            this.HideWindow();
        };
        CommentWindow.prototype.TextSave = function () {
            this.SaveButton = true;
            this.TextObj.blur();
            var BookmarkID = this.CurrentObj.getAttribute('data-id');
            for (var j = 0; j < this.Owner.Parent.Bookmarks.Bookmarks.length; j++) {
                if (this.Owner.Parent.Bookmarks.Bookmarks[j].ID == BookmarkID) {
                    this.SetBookmarkNote(this.Owner.Parent.Bookmarks.Bookmarks[j]);
                    break;
                }
            }
            this.Owner.Parent.Reader.Site.StoreBookmarksHandler(200);
            this.HideWindow();
        };
        CommentWindow.prototype.SetBookmarkNote = function (Bookmark) {
            if (this.TextObj.value == '' || this.TextObj.value == this.Placeholder) {
            }
            else {
                Bookmark.Note[1] = '<p>' + this.TextObj.value + '</p>';
                Bookmark.DateTime = moment().unix();
            }
        };
        CommentWindow.prototype.ShowWindow = function () {
            this.ShowButton = true;
            this.ToggleWindow('block');
            this.Owner.ShareListObj.HideWindow();
            this.HideOwnerButtons();
        };
        CommentWindow.prototype.HideWindow = function () {
            if (!this.Obj) {
                return;
            }
            this.ToggleWindow('none');
            if (this.BookmarkButtonsObj) {
                this.ShowOwnerButtons();
            }
        };
        CommentWindow.prototype.ToggleWindow = function (state) {
            this.Obj.style.display = state;
            this.UpdateComment();
        };
        CommentWindow.prototype.ShowTextBox = function (event) {
            this.Init();
            if (event) {
                var target = (event.target || event.event.srcElement);
                this.CurrentObj = this.Owner.GetObj(target.getAttribute('data-n'));
                this.BookmarkButtonsObj = this.CurrentObj.querySelector('.bookmark-buttons');
                var commentHeight = this.CurrentObj.querySelector('.bookmark-comment').offsetHeight;
                if (this.MinHeight < commentHeight) {
                    this.TextObj.setAttribute('style', 'height:' + commentHeight + 'px');
                }
                else {
                    this.TextObj.removeAttribute('style');
                }
            }
            var BookmarkID = this.CurrentObj.getAttribute('data-id');
            this.ReplaceHTML(this.Owner.GetBookmark(BookmarkID));
            this.ShowWindow();
        };
        CommentWindow.prototype.SetHandlers = function () {
            var _this = this;
            var buttons = this.Owner.Obj.querySelectorAll('.comment-bookmark');
            for (var j = 0; j < buttons.length; j++) {
                buttons[j].addEventListener('click', function (event) { return _this.ShowTextBox(event); }, false);
            }
        };
        CommentWindow.prototype.UpdateComment = function () {
            if (this.UpdateCommentState) {
                var commentBox = this.CurrentObj.querySelector('.bookmark-comment');
                var comment = this.TextObj.value;
                if (this.SaveButton && comment != '' && comment != this.Placeholder) {
                    // save, we have new comment, set owner comment in box
                    commentBox.innerHTML = comment.replace(/\n/ig, '<br />');
                }
                var commentNotEpmty = comment != '' && comment != this.Placeholder;
                if ((!this.ShowButton && !this.SaveButton && !this.CancelButton && commentNotEpmty) ||
                    (this.SaveButton && commentNotEpmty) ||
                    (this.CancelButton && (this.OriginalText != '' || commentNotEpmty))) {
                    // save|close we have, show comment owner box
                    this.ShowOwnerComment(commentBox);
                }
                else {
                    // any other actions, hide comment owner box
                    this.HideOwnerComment(commentBox);
                }
                this.SaveButton = false;
                this.CancelButton = false;
                this.ShowButton = false;
            }
        };
        CommentWindow.prototype.SetText = function (text) {
            this.TextObj.value = text;
        };
        CommentWindow.prototype.HideOwnerButtons = function () {
            if (this.BookmarkButtonsObj) {
                this.BookmarkButtonsObj.style.display = 'none';
            }
        };
        CommentWindow.prototype.ShowOwnerButtons = function () {
            if (this.BookmarkButtonsObj) {
                this.BookmarkButtonsObj.style.display = 'block';
            }
        };
        CommentWindow.prototype.HideOwnerComment = function (Obj) {
            Obj.style.display = 'none';
        };
        CommentWindow.prototype.ShowOwnerComment = function (Obj) {
            Obj.style.display = 'block';
        };
        CommentWindow.prototype.MakeButton = function (N) {
            if (!this.ShowCommentButton) {
                return '';
            }
            return '<a class="comment-bookmark action-icon" title="Комментировать" data-n="' + N + '"' +
                'href="javascript:void(0);">&nbsp;</a>';
        };
        CommentWindow.prototype.MakeComment = function (text) {
            if (!this.ShowCommentBox) {
                return '';
            }
            return '<div class="bookmark-comment"' +
                (text.replace(/<\/?p>/ig, '') != '' ? ' style="display:block;"' : '') + '>' +
                text.replace(/\n/ig, '<br />') + '</div>';
        };
        return CommentWindow;
    })();
    var ShareList = (function () {
        function ShareList(Owner) {
            this.Owner = Owner;
            this.Owner.RegisterWindow(this);
            this.ShowShareButton = true;
            this.ShowState = false;
            this.ShareOptions = [
                {
                    name: 'Вконтакте',
                    buttonClass: 'vk',
                    buttonName: 'Вконтакте',
                    state: true,
                    obj: VkontakteSharing
                },
                {
                    name: 'Facebook',
                    buttonClass: 'fb',
                    buttonName: 'Facebook',
                    state: true,
                    obj: FacebookSharing
                },
                {
                    name: 'Twitter',
                    buttonClass: 'tw',
                    buttonName: 'Twitter',
                    state: true,
                    obj: TwitterSharing
                }
            ];
            this.MakeHTML();
        }
        ShareList.prototype.GetOption = function (val) {
            for (var j = 0; j < this.ShareOptions.length; j++) {
                if (this.ShareOptions[j].buttonClass == val) {
                    return this.ShareOptions[j];
                }
            }
        };
        ShareList.prototype.MakeHTML = function () {
            this.HTML = '<ul class="sharebookmark-list">';
            for (var j = 0; j < this.ShareOptions.length; j++) {
                if (this.ShareOptions[j].state) {
                    this.HTML += '<li class="' + this.ShareOptions[j].buttonClass + '">' +
                        this.ShareOptions[j].buttonName + '</li>';
                }
            }
            this.HTML += '</ul>';
        };
        ShareList.prototype.Init = function () {
            var _this = this;
            if (!this.Obj) {
                this.Obj = this.Owner.Obj.querySelector('.sharebookmark-list');
                var buttons = this.Obj.querySelectorAll('.sharebookmark-list li');
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].addEventListener('click', function (event) { return _this.ShareWindowInit(event); }, false);
                }
            }
            this.Owner.HideRegisteredWindows();
        };
        ShareList.prototype.ReplaceHTML = function () {
            this.CurrentObj.querySelector('.bookmark-buttons').appendChild(this.Obj);
        };
        ShareList.prototype.ShowWindow = function () {
            this.ShowState = true;
            removeClass(this.Obj, 'topList');
            this.ToggleWindow('block');
            var offsetTop = this.Obj.getBoundingClientRect().top;
            if (offsetTop + this.Obj.offsetHeight > window.innerHeight) {
                addClass(this.Obj, 'topList');
            }
        };
        ShareList.prototype.HideWindow = function () {
            if (!this.Obj || !this.ShowState) {
                return;
            }
            this.ShowState = false;
            this.ToggleWindow('none');
        };
        ShareList.prototype.ToggleWindow = function (state) {
            this.Obj.style.display = state;
        };
        ShareList.prototype.ShowListBox = function (event) {
            if (!this.ShowState) {
                this.Init();
                if (event) {
                    var target = (event.target || event.event.srcElement);
                    this.CurrentObj = this.Owner.GetObj(target.getAttribute('data-n'));
                    this.ReplaceHTML();
                }
                this.ShowWindow();
            }
            else {
                this.HideWindow();
            }
        };
        ShareList.prototype.ShareWindowInit = function (event) {
            if (this.Owner.CreateBookmarkState) {
                this.Owner.ToggleWindow('none');
            }
            this.Owner.ShareListObj.HideWindow();
            var target = (event.target || event.srcElement);
            this.ShareWindowObj = new ShareWindow(this.Owner, this.GetOption(target.className), this);
        };
        ShareList.prototype.MakeButton = function (N) {
            if (!this.ShowShareButton) {
                return '';
            }
            return '<a class="share-bookmark" data-n="' + N + '"' +
                'href="javascript:void(0);"><span class="action-icon"></span>Поделиться</a>';
        };
        ShareList.prototype.SetHandlers = function () {
            var _this = this;
            var buttons = this.Owner.Obj.querySelectorAll('.share-bookmark');
            for (var j = 0; j < buttons.length; j++) {
                buttons[j].addEventListener('click', function (event) { return _this.ShowListBox(event); }, false);
            }
        };
        return ShareList;
    })();
    var ShareWindow = (function () {
        function ShareWindow(Owner, ShareObj, Parent) {
            var _this = this;
            this.Owner = Owner;
            this.ShareObj = ShareObj;
            this.Parent = Parent;
            this.ButtonClass = null;
            this.ShowState = false;
            this.Placeholder = 'Текст, который вы хотите пошарить';
            this.Text = '';
            this.Comment = '';
            this.Owner.RegisterWindow(this);
            this.Obj = document.querySelector('#facebook');
            this.TextObj = this.Obj.querySelector('textarea');
            this.ShowWindow();
            this.Obj.querySelector('.share-cancel-button').onclick = function () { return _this.ShareCancel(); };
            this.Obj.querySelector('.share-button').onclick = function () { return _this.ShareInit(); };
            var placeholder = new PlaceholderClass(this.TextObj, function (text) { return _this.TextAreaCallback(text); }, this.Placeholder);
            this.Owner.Parent.WindowsCarry.RegisterWindow(this);
        }
        ShareWindow.prototype.ShowWindow = function () {
            this.ToggleWindow('block');
            this.FillShareWindow();
            this.ShowState = true;
        };
        ShareWindow.prototype.HideWindow = function () {
            this.ShowState = false;
            if (!this.Obj) {
                return;
            }
            this.ToggleWindow('none');
            if (this.Owner.CreateBookmarkState) {
                this.Owner.CreateBookmarkState = false;
                this.Owner.Parent.Mask.Hide();
            }
        };
        ShareWindow.prototype.ToggleWindow = function (state) {
            this.Obj.style.display = state;
        };
        ShareWindow.prototype.FillShareWindow = function () {
            var _this = this;
            var bookmark = this.Owner.GetBookmark(this.Parent.CurrentObj.getAttribute('data-id'));
            var CurrentNote = bookmark.RoundClone(false);
            this.Text = this.ShareObj.obj.CookText(CurrentNote.RawText);
            this.Comment = this.ShareObj.obj.CookComment(bookmark.Note[1]);
            this.TextObj.value = this.Text + '\r\n' + this.Comment;
            this.Obj.querySelector('.facebook-title span:last-child').innerHTML = this.ShareObj.name;
            this.Obj.querySelector('.share-book-title').innerHTML = this.ShareObj.obj.Name;
            this.Obj.querySelector('.share-book-author').innerHTML = this.ShareObj.obj.Caption;
            var url = this.Obj.querySelector('.share-book-cover a');
            url.setAttribute('href', this.ShareObj.obj.URL);
            var shareImage = this.Obj.querySelector('.share-book-cover img');
            var image = new Image();
            image.onload = function () {
                shareImage.setAttribute('src', this.src);
                shareImage.setAttribute('height', Math.round(parseInt(shareImage.getAttribute('width')) / (this.width / this.height)).toString());
            };
            image.src = this.ShareObj.obj.Image;
            this.TextObj.scrollTop = this.TextObj.scrollHeight;
            this.TextObj.onkeyup = this.TextObj.onkeydown = this.TextObj.onchange =
                this.TextObj.oninput = this.TextObj.onpropertychange = function (event) {
                    var target = (event.target || event.srcElement);
                    _this.setCurrentTextLen(target.value.length);
                };
            this.setCaretToPos(this.TextObj, this.Text.length);
            this.Obj.querySelector('.quote-comment .len-max').innerHTML =
                this.ShareObj.obj.TextLimit.toString();
            this.setCurrentTextLen(this.Text.length, this.ShareObj.obj.TextLimit);
            this.Owner.Parent.ZoomObj.ZoomAnything(this.Obj, this.Obj.offsetWidth, this.Obj.offsetHeight);
        };
        ShareWindow.prototype.ShareInit = function () {
            this.Comment = this.TextObj.value;
            this.ShareObj.obj.FillData('', this.Comment);
            this.ShareObj.obj.ShareInit();
        };
        ShareWindow.prototype.ShareCancel = function () {
            this.HideWindow();
        };
        ShareWindow.prototype.TextAreaCallback = function (text) {
            this.Text = text;
        };
        ShareWindow.prototype.setCurrentTextLen = function (num, max) {
            var comment = this.Obj.querySelector('.quote-comment');
            var button = this.Obj.querySelector('.share-button');
            comment.querySelector('.len-current').innerHTML = num.toString();
            if (!max) {
                max = parseInt(comment.querySelector('.len-max').innerHTML);
            }
            if (num == 0 || num > max) {
                addClass(comment, 'red');
                button.setAttribute('disabled', 'disabled');
            }
            else {
                removeClass(comment, 'red');
                button.removeAttribute('disabled');
            }
        };
        ShareWindow.prototype.setSelectionRange = function (input, selectionStart, selectionEnd) {
            if (input.setSelectionRange) {
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            }
            else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        };
        ShareWindow.prototype.setCaretToPos = function (input, pos) {
            this.setSelectionRange(input, pos, pos);
        };
        return ShareWindow;
    })();
    var PlaceholderClass = (function () {
        function PlaceholderClass(Obj, Callback, Placeholder) {
            var _this = this;
            this.Obj = Obj;
            this.Callback = Callback;
            this.Placeholder = Placeholder;
            this.Obj.addEventListener('focus', function (event) { return _this.focusCommentTextarea(event); }, false);
            this.Obj.addEventListener('blur', function (event) { return _this.blurCommentTextarea(event); }, false);
        }
        PlaceholderClass.prototype.focusCommentTextarea = function (event) {
            var target = (event.target || event.srcElement);
            if (target.value == this.Placeholder)
                return this.toggleCommentPlaceholder('');
        };
        PlaceholderClass.prototype.blurCommentTextarea = function (event) {
            var target = (event.target || event.srcElement);
            if (target.value == '') {
                return this.toggleCommentPlaceholder(this.Placeholder);
            }
        };
        PlaceholderClass.prototype.toggleCommentPlaceholder = function (text) {
            this.Callback(text);
        };
        return PlaceholderClass;
    })();
    Bookmarks.PlaceholderClass = PlaceholderClass;
    var BookmarkCreateWindow = (function (_super) {
        __extends(BookmarkCreateWindow, _super);
        function BookmarkCreateWindow(Obj, Parent) {
            this.Colors = [
                { id: 1, rgb: '90a8a8', name: 'basic' },
                { id: 2, rgb: '8c9194', name: 'tiny' },
                { id: 3, rgb: '5fb142', name: 'interesting' },
                { id: 4, rgb: 'e1a400', name: 'important' },
                { id: 5, rgb: 'ff9d00', name: 'cool' },
                { id: 6, rgb: '0099df', name: 'hot' },
                { id: 7, rgb: 'd261c3', name: 'funny' },
                { id: 8, rgb: '1e3c50', name: 'awesome' }
            ];
            this.Placeholder = 'Ваш комментарий';
            _super.call(this, Obj, Parent);
            this.CommentObj.UpdateCommentState = false;
        }
        BookmarkCreateWindow.prototype.SetObjectList = function () {
            this.ButtonClass = null;
        };
        BookmarkCreateWindow.prototype.MakeHTML = function () {
            this.HTML = '<div class="comment-text"></div>' +
                '<ul class="color-pick"></ul>' +
                '<div class="comment-box">' +
                '<textarea>' + this.Placeholder + '</textarea>' +
                '</div>' +
                '<div class="share-box">' +
                '<div class="share-top">Поделиться:</div>' +
                '<ul class="sharebookmark-list">' + this.ShareListObj.HTML + '</ul>' +
                '</div>';
        };
        BookmarkCreateWindow.prototype.GetCurrentColor = function () {
            this.CurrentColor = 1;
            for (var j = 0; j < this.Colors.length; j++) {
                if (this.Colors[j].name == this.Owner.FoundedBookmark.Class) {
                    this.CurrentColor = this.Colors[j].id;
                    break;
                }
            }
        };
        BookmarkCreateWindow.prototype.SetCurrentColor = function () {
            for (var j = 0; j < this.ColorsButtons.length; j++) {
                removeClass(this.ColorsButtons[j], 'current');
            }
            addClass(this.ColorPickerObj.querySelector('li[data-id="' + this.CurrentColor + '"]'), 'current');
        };
        BookmarkCreateWindow.prototype.MakeColorPicker = function () {
            var output = '';
            for (var j = 0; j < this.Colors.length; j++) {
                output += '<li data-id="' + this.Colors[j].id + '"' +
                    (this.Colors[j].id == this.CurrentColor ? ' class="current"' : '') +
                    ' style="background:#' + this.Colors[j].rgb + '"></li>';
            }
            this.ColorPickerObj.innerHTML = output;
            this.SetColorHandlers();
        };
        BookmarkCreateWindow.prototype.SetColorHandlers = function () {
            var _this = this;
            this.ColorsButtons = this.ColorPickerObj.querySelectorAll('li');
            for (var j = 0; j < this.ColorsButtons.length; j++) {
                this.ColorsButtons[j].addEventListener('click', function (e) { return _this.ColorPickCallback(e); }, false);
            }
        };
        BookmarkCreateWindow.prototype.ColorPickCallback = function (event) {
            var target = (event.target || event.srcElement);
            for (var j = 0; j < this.Colors.length; j++) {
                if (this.Colors[j].id == target.getAttribute('data-id')) {
                    this.CurrentColor = this.Colors[j].id;
                    this.SetCurrentColor();
                    this.Owner.FoundedBookmark.Class = this.Colors[j].name;
                    this.Owner.FoundedBookmark.DateTime = moment().unix();
                    this.Parent.Reader.Redraw();
                    this.Parent.Reader.Site.StoreBookmarksHandler(200);
                    break;
                }
            }
        };
        BookmarkCreateWindow.prototype.Init = function () {
            var _this = this;
            if (!this.Obj) {
                this.Obj = document.querySelector('#createBookmark');
                this.Obj.querySelector('.overlay-wrap').innerHTML = this.HTML;
                this.ColorPickerObj = this.Obj.querySelector('.color-pick');
                this.MakeColorPicker();
                this.ShareListObj.CurrentObj = this.Obj;
                this.ShareListObj.ShowListBox(false);
                this.ShareListObj.SetHandlers();
                this.CommentObj.CurrentObj = this.Obj;
                this.Obj.querySelector('.create-bookmark-cancel').addEventListener('click', function () { return _this.BookmarkCancel(); }, false);
                this.Obj.querySelector('.create-bookmark-save').addEventListener('click', function () { return _this.BookmarkSave(); }, false);
            }
        };
        BookmarkCreateWindow.prototype.ShowWindow = function (Owner) {
            this.Owner = Owner;
            this.GetCurrentColor();
            this.CreateBookmarkState = true;
            this.Parent.Mask.Show();
            this.PrepareData();
            this.Init();
            this.SetCurrentColor();
            this.CommentObj.ShowTextBox(false);
            this.ShareListObj.ToggleWindow('block');
            this.ToggleWindow('block');
            this.Owner.RepositionMenu(this.Obj);
        };
        BookmarkCreateWindow.prototype.HideWindow = function () {
            this.CreateBookmarkState = false;
            if (!this.Obj) {
                return;
            }
            this.Parent.Mask.Hide();
            this.ToggleWindow('none');
        };
        BookmarkCreateWindow.prototype.BookmarkCancel = function () {
            this.Parent.WindowsCarry.HideAllWindows(true); // TODO: keep? no? yes?
        };
        BookmarkCreateWindow.prototype.BookmarkSave = function () {
            this.CommentObj.SetBookmarkNote(this.Owner.FoundedBookmark);
            if (this.Owner.FoundedBookmark.TemporaryState) {
                this.Owner.CreateBookmarkFromTemporary(this.Owner.FoundedBookmark.Group.toString());
            }
            this.Parent.WindowsCarry.HideAllWindows();
        };
        return BookmarkCreateWindow;
    })(BookmarksWindow);
    Bookmarks.BookmarkCreateWindow = BookmarkCreateWindow;
})(Bookmarks || (Bookmarks = {}));
//# sourceMappingURL=BookmarksWindow.js.map