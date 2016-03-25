/// <reference path="EventsHead.ts" />
var EventsModule;
(function (EventsModule) {
    var EventActions = (function () {
        function EventActions(ReaderBox, FooterBox) {
            this.ReaderBox = ReaderBox;
            this.FooterBox = FooterBox;
            // TODO: add globas
            // something
            this.NavArrowsInited = false;
            this.PreventDoubleClick = false;
            this.PreventTimerVlaue = 500;
            this.Mask = new MaskClass(this);
            this.WindowsCarry = new WindowsCarry(this);
            this.ZoomObj = new ZoomClass(this);
            this.ChapterObj = new ChapterClass(this);
        }
        EventActions.prototype.GetEvent = function (e) {
            return e || window.event;
        };
        EventActions.prototype.GetCoordinates = function (e, Coords) {
            var e = this.GetEvent(e);
            var X = 0;
            var Y = 0;
            var Button = e.which || e.button || null;
            var touches = e.changedTouches || e.touches;
            if (touches && touches.length) {
                X = touches[0].clientX;
                Y = touches[0].clientY;
            }
            else {
                X = e.clientX;
                Y = e.clientY;
            }
            if (Coords && Coords.X) {
                X = Coords.X;
            }
            if (Coords && Coords.Y) {
                Y = Coords.Y;
            }
            return {
                X: X,
                Y: Y,
                Button: Button
            };
        };
        EventActions.prototype.PageForward = function () {
            this.Reader.PageForward();
        };
        EventActions.prototype.PageBackward = function () {
            this.Reader.PageBackward();
        };
        EventActions.prototype.GoToBookmark = function (e) {
            var e = this.GetEvent(e);
            var target = (e.target || e.srcElement);
            LitresHistory.push(this.Bookmarks.Bookmarks[0].Range.From.slice(0));
            this.Reader.GoTO([parseInt(target.getAttribute('data-e'))]);
        };
        EventActions.prototype.RemoveSelection = function () {
            if (this.SelectionObj) {
                return this.SelectionObj.Remove();
            }
            return true;
        };
        EventActions.prototype.SetPreventDoubleCheck = function () {
            var _this = this;
            this.PreventDoubleClick = true;
            this.PreventDoubleClickTimer = setTimeout(function () { _this.PreventDoubleClick = false; }, this.PreventTimerVlaue);
        };
        EventActions.prototype.CheckDoubleClick = function () {
            return this.PreventDoubleClick;
        };
        EventActions.prototype.SkipOnElement = function (e) {
            var e = this.GetEvent(e);
            var target = (e.target || e.srcElement);
            if (target.className.match(/zoom_block/i) || target.tagName.match(/^a$/i)
                || target.parentElement.tagName.match(/^a$/i))
                return true;
            return false;
        };
        EventActions.prototype.Resize = function () {
            calcHeight();
            this.AddNavArrows();
        };
        EventActions.prototype.Refresh = function () {
            this.Reader.RedrawVisible();
        };
        EventActions.prototype.CheckProgressBar = function () {
            return progressBar.swipeState;
        };
        EventActions.prototype.GetTitleFromTOC = function (Range, TOC) {
            var TOC = TOC || this.Reader.TOC();
            for (var j = 0; j < TOC.length; j++) {
                var row = TOC[j];
                var xps = FB3Reader.PosCompare(Range.From, [row.s]);
                var xpe = FB3Reader.PosCompare(Range.To, [row.e]);
                if (xps >= 0 && xpe <= 1) {
                    var title = row.t;
                    if (row.c) {
                        var childTitle = this.GetTitleFromTOC(Range, row.c);
                        if (childTitle) {
                            title = childTitle;
                        }
                    }
                    if (title === undefined) {
                        return undefined;
                    }
                    return this.PrepareTitle(title);
                }
            }
        };
        EventActions.prototype.PrepareTitle = function (str) {
            return str.replace(/\[\d+\]|\{\d+\}/g, '');
        };
        EventActions.prototype.StopPropagation = function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.cancelBubble = true;
            return false;
        };
        EventActions.prototype.GetElement = function (Obj, Looking) {
            // TODO: add counter, return current when X
            if (Obj.tagName.toLowerCase() != Looking) {
                return this.GetElement(Obj.parentNode, Looking);
            }
            return Obj;
        };
        EventActions.prototype.AddNavArrows = function () {
            var _this = this;
            var arrowsBox = doc.querySelector('.bottom-arrows');
            var clickPaging = getSetting('enableClick');
            if ((!this.PDA.state && !clickPaging) ||
                aldebaran_or4 ||
                (this.PDA.state && this.PDA.form == 'tablet' && !LitresFullScreen.fullScreen)) {
                if (!this.NavArrowsInited && aldebaran_or4) {
                    setSetting(1, 'enableClick');
                }
                var forward = doc.querySelector('.bottom-right');
                arrowsBox.style.display = 'block';
                arrowsBox.style.top = Math.floor(this.ReaderBox.offsetHeight / 2 - forward.offsetHeight / 2) + 'px';
                forward.style.left = (this.ReaderBox.offsetWidth - forward.offsetWidth) + 'px';
                if (!this.NavArrowsInited) {
                    forward.addEventListener("click", function () { return _this.Reader.PageForward(); }, false);
                    doc.querySelector('.bottom-left')
                        .addEventListener("click", function () { return _this.Reader.PageBackward(); }, false);
                }
                this.NavArrowsInited = true;
            }
            else {
                arrowsBox.style.display = 'none';
            }
        };
        return EventActions;
    })();
    EventsModule.EventActions = EventActions;
    var KeydownClass = (function () {
        function KeydownClass(Owner) {
            var _this = this;
            this.Owner = Owner;
            this.KeysRules = {
                PageForward: {
                    keys: {
                        32: 'space',
                        39: 'arrow ->',
                        40: 'arrow down',
                        34: 'PgDn'
                    },
                    action: function () { return _this.Owner.PageForward(); }
                },
                PageBackward: {
                    keys: {
                        37: 'arrow <-',
                        38: 'arrow up',
                        33: 'PgUp'
                    },
                    action: function () { return _this.Owner.PageBackward(); }
                }
            };
            document.addEventListener('keydown', function (e) { return _this.OnKeydown(e); }, false);
        }
        KeydownClass.prototype.OnKeydown = function (e) {
            var e = this.Owner.GetEvent(e);
            var target = (e.target || e.srcElement);
            if (target.localName.toLowerCase() == 'textarea') {
                // skip any rules for textarea
                return;
            }
            this.Owner.WindowsCarry.HideAllWindows();
            for (var index in this.KeysRules) {
                if (this.KeysRules[index].keys[e.keyCode]) {
                    this.KeysRules[index].action();
                    break;
                }
            }
        };
        return KeydownClass;
    })();
    EventsModule.KeydownClass = KeydownClass;
    var MouseWheelClass = (function () {
        function MouseWheelClass(Owner) {
            var _this = this;
            this.Owner = Owner;
            this.Debug = false;
            this.Owner.ReaderBox.addEventListener("mousewheel", function (e) { return _this.MouseWheel(e); }, false);
            this.Owner.ReaderBox.addEventListener("DOMMouseScroll", function (e) { return _this.MouseWheel(e); }, false);
        }
        MouseWheelClass.prototype.MouseWheel = function (e) {
            var e = this.Owner.GetEvent(e);
            this.CheckNotesState(e);
            if (this.NotesState) {
                this.NotesState = false;
                this.DebugLog('notes scroll');
            }
            else {
                this.DebugLog('canvas scroll');
                if (!this.Owner.CheckDoubleClick()) {
                    // TODO: fix touchpad imac problem
                    this.Owner.SetPreventDoubleCheck();
                    var delta = e.wheelDelta || (e.detail * -1);
                    if (delta < 0) {
                        this.Owner.PageForward();
                    }
                    else {
                        this.Owner.PageBackward();
                    }
                }
            }
            this.Owner.WindowsCarry.HideAllWindows();
        };
        MouseWheelClass.prototype.CheckNotesState = function (e) {
            var target = (e.target || e.srcElement);
            target = this.Owner.GetElement(target, 'div');
            if (hasClass(target, 'footnote') && target.scrollHeight != target.offsetHeight) {
                this.NotesState = true;
            }
            this.DebugLog(target.scrollHeight + ' ' + target.offsetHeight);
        };
        MouseWheelClass.prototype.DebugLog = function (str) {
            if (this.Debug) {
                console.log('[MouseWheelClass] ' + str);
            }
        };
        return MouseWheelClass;
    })();
    EventsModule.MouseWheelClass = MouseWheelClass;
    var ResizeClass = (function () {
        function ResizeClass(Owner) {
            var _this = this;
            this.Owner = Owner;
            this.ResizeTimerValue = 200;
            window.addEventListener('resize', function (e) { return _this.Resize(e); }, false);
        }
        ResizeClass.prototype.Resize = function (e) {
            var _this = this;
            this.ClearTimer();
            this.ResizeTimer = setTimeout(function () {
                if (!_this.CheckShareWindow() && !_this.CheckZoomInState()) {
                    _this.Owner.WindowsCarry.HideAllWindows();
                }
                _this.Owner.Resize();
            }, this.ResizeTimerValue);
        };
        ResizeClass.prototype.ClearTimer = function () {
            clearTimeout(this.ResizeTimer);
            this.ResizeTimer = 0;
        };
        ResizeClass.prototype.CheckShareWindow = function () {
            var BookmarkWindow = this.Owner.WindowsCarry.GetWindow('menu-bookmark');
            var ShareObj = BookmarkWindow.obj.ShareListObj;
            if (ShareObj && ShareObj.ShareWindowObj && ShareObj.ShareWindowObj.ShowState) {
                return true;
            }
            return false;
        };
        ResizeClass.prototype.CheckZoomInState = function () {
            if (this.Owner.ZoomObj.ShowState && this.Owner.ZoomObj.ResizeState) {
                return true;
            }
            return false;
        };
        return ResizeClass;
    })();
    EventsModule.ResizeClass = ResizeClass;
    var MouseClickClass = (function () {
        function MouseClickClass(Owner) {
            this.Owner = Owner;
            this.AddHandlers();
        }
        MouseClickClass.prototype.AddHandlers = function () {
            var _this = this;
            if (!this.Owner.PDA.state && !getSetting('enableClick')) {
                // win tablet ie, firefox fix
                // some browsers cant use touchstart touchend in win7+ tablet version fired by touch
                // alternative click support to get
                this.Owner.ReaderBox.addEventListener('click', function (e) { return _this.AltClick(e); }, false);
                // win tablet chrome, opera, safari fix
                this.Owner.ReaderBox.addEventListener('touchend', function (e) { return _this.OnTouch(e); }, false);
            }
            else {
            }
        };
        MouseClickClass.prototype.RemoveHandlers = function () {
            this.Owner.ReaderBox.onclick = function () { };
            this.Owner.ReaderBox.ontouchend = function () { };
        };
        MouseClickClass.prototype.AltClick = function (e) {
            //			console.log('e.mozInputSource ' + e.mozInputSource + '; e.MOZ_SOURCE_TOUCH ' + e.MOZ_SOURCE_TOUCH);
            //			console.log('e.pointerType ' + e.pointerType);
            if (!ContextObj.ShowState && (this.CheckFirefoxTouchEvent(e) || this.CheckIETouchEvent(e))) {
                this.OnClickHandler(e, 'touch');
            }
        };
        MouseClickClass.prototype.CheckFirefoxTouchEvent = function (e) {
            if (e.mozInputSource && e.mozInputSource === e.MOZ_SOURCE_TOUCH) {
                return true;
            }
            else {
                return false;
            }
        };
        MouseClickClass.prototype.CheckIETouchEvent = function (e) {
            if (e.pointerType && e.pointerType === 'touch') {
                return true;
            }
            else {
                return false;
            }
        };
        MouseClickClass.prototype.OnTouch = function (e) {
            if (!ContextObj.ShowState) {
                this.OnClickHandler(e, 'touch');
            }
        };
        MouseClickClass.prototype.OnClickHandler = function (e, type) {
            if (type === void 0) { type = 'click'; }
            // console.log('OnClickHandler');
            if (this.Owner.SkipOnElement(e) || this.Owner.CheckProgressBar())
                return;
            if (!this.Owner.CheckDoubleClick() && this.Owner.RemoveSelection()) {
                if (!this.Owner.PDA.state && type == 'click' && !getSetting('enableClick')) {
                    return;
                }
                this.Owner.SetPreventDoubleCheck();
                var Coords = this.Owner.GetCoordinates(e);
                // alert(Coords.X + ' ' + Math.floor(readerBox.offsetWidth / 2) + ' ' + readerBox.offsetWidth);
                if (this.Owner.PDA.state && getSetting('pda_fullscreen')) {
                    var area_width = Math.floor(this.Owner.ReaderBox.offsetWidth / 3);
                    if (Coords.X > area_width * 2) {
                        this.Owner.PageForward();
                    }
                    else if (Coords.X < area_width) {
                        this.Owner.PageBackward();
                    }
                    else {
                        LitresFullScreen.showHiddenElements();
                    }
                }
                else {
                    if (Coords.X > Math.floor(this.Owner.ReaderBox.offsetWidth / 2)) {
                        this.Owner.PageForward();
                    }
                    else {
                        this.Owner.PageBackward();
                    }
                }
                this.Owner.WindowsCarry.HideAllWindows();
            }
        };
        return MouseClickClass;
    })();
    EventsModule.MouseClickClass = MouseClickClass;
    var MaskClass = (function () {
        function MaskClass(Owner) {
            this.Owner = Owner;
            this.MaskObj = document.querySelector('#mask');
            this.AddHandlers();
        }
        MaskClass.prototype.AddHandlers = function () {
            var _this = this;
            this.MaskObj.addEventListener('click', function (e) { return _this.MaskClick(e); }, false);
            this.MaskObj.addEventListener('contextmenu', function (e) { return _this.MaskOnMenu(e); }, false);
        };
        MaskClass.prototype.MaskClick = function (e) {
            var e = this.Owner.GetEvent(e);
            this.Owner.WindowsCarry.HideAllWindows(true);
            return this.Owner.StopPropagation(e);
        };
        MaskClass.prototype.MaskOnMenu = function (e) {
            var e = this.Owner.GetEvent(e);
            if (ContextObj.ShowState) {
                this.MaskClick(e);
                ContextObj.ShowWindow(e);
            }
            return this.Owner.StopPropagation(e);
        };
        MaskClass.prototype.Show = function (Opacity, Color) {
            var Opacity = Opacity || '0.3';
            var Color = Color || '0, 0, 0';
            this.MaskObj.setAttribute('style', 'background:rgba(' + Color + ', ' + Opacity + ');');
            this.Toggle('block');
        };
        MaskClass.prototype.Hide = function (Callback) {
            this.MaskObj.removeAttribute('style');
            this.Toggle('none');
            if (Callback) {
                Callback();
            }
        };
        MaskClass.prototype.Toggle = function (state) {
            this.MaskObj.style.display = state;
        };
        return MaskClass;
    })();
    EventsModule.MaskClass = MaskClass;
    var WindowsCarry = (function () {
        function WindowsCarry(Owner) {
            this.Owner = Owner;
            this.WindowsStack = [];
        }
        WindowsCarry.prototype.RegisterWindow = function (WindowObj) {
            this.WindowsStack.push({
                obj: WindowObj,
                button: WindowObj.ButtonClass
            });
        };
        WindowsCarry.prototype.ShowWindow = function (obj) {
            obj.ShowWindow();
        };
        WindowsCarry.prototype.HideWindow = function (obj) {
            if (obj.HideWindow) {
                obj.HideWindow();
            }
        };
        WindowsCarry.prototype.FireHandler = function (obj, e) {
            obj.ButtonHandler(e);
        };
        WindowsCarry.prototype.GetWindow = function (_class) {
            for (var j = 0; j < this.WindowsStack.length; j++) {
                for (var i = 0; i < this.WindowsStack[j].button.length; i++) {
                    if (this.WindowsStack[j].button[i] == _class) {
                        return this.WindowsStack[j];
                    }
                }
            }
            return null;
        };
        WindowsCarry.prototype.HideAllWindows = function (KeepSelection, Callback) {
            for (var j = 0; j < this.WindowsStack.length; j++) {
                this.HideWindow(this.WindowsStack[j].obj);
            }
            if (Callback) {
                Callback();
            }
            // TODO: fix this, hate globals, make private|public
            // this.Owner.Mask.Hide(); // if anyone forgot to hide Mask, dont think i need this
            if (!KeepSelection) {
                this.Owner.RemoveSelection();
            }
            TopMenuObj.RemoveActive();
            this.Owner.ZoomObj.ZoomOut(true);
            hideFontChangeList();
        };
        return WindowsCarry;
    })();
    EventsModule.WindowsCarry = WindowsCarry;
    var ZoomClass = (function () {
        function ZoomClass(Owner) {
            var _this = this;
            this.Owner = Owner;
            this.ResizeState = true;
            this.Obj = document.querySelector('#zoomedImg');
            this.ZoomWrap = this.Obj.querySelector('.readerStyles');
            this.ZoomOutHTML = '<a href="javascript:void(0);" class="zoom_block clicked"></a>';
            if (this.ResizeState) {
                window.addEventListener('resize', function () { return _this.ZoomResize(); }, false);
            }
        }
        ZoomClass.prototype.AddHandlers = function () {
            var _this = this;
            this.Obj.querySelector('.zoom_block').addEventListener('click', function () { return _this.ZoomOut(); }, false);
        };
        ZoomClass.prototype.GetDocumentSize = function () {
            // was thinking about to create new class attribute, but dont want to handle other events
            // thats why its function with obj return
            var Width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            Height -= document.querySelector('.top-box').offsetHeight;
            return {
                w: Width,
                h: Height
            };
        };
        ZoomClass.prototype.Image2Center = function () {
            this.ZoomObj.w = this.ZoomObj.w ? this.ZoomObj.w : this.ZoomObj.obj.offsetWidth;
            this.ZoomObj.h = this.ZoomObj.h ? this.ZoomObj.h : this.ZoomObj.obj.offsetHeight;
            var DocSize = this.GetDocumentSize();
            this.ZoomObj.obj.style.left = Math.floor(DocSize.w / 2 - this.ZoomObj.w / 2) + 'px';
            this.ZoomObj.obj.style.top = Math.floor(DocSize.h / 2 - this.ZoomObj.h / 2) + 'px';
        };
        ZoomClass.prototype.ZoomResize = function () {
            if (this.ShowState) {
                this.Image2Center();
            }
        };
        ZoomClass.prototype.SetZoomObj = function (obj, w, h) {
            this.ZoomObj = { obj: obj, w: w, h: h };
        };
        ZoomClass.prototype.ZoomOut = function (state) {
            if (!this.ShowState) {
                return;
            }
            if (!state) {
                this.Owner.WindowsCarry.HideAllWindows();
            }
            this.Obj.style.display = 'none';
            this.CleanObj();
            this.ShowState = false;
        };
        ZoomClass.prototype.CleanObj = function () {
            this.ZoomObj.obj.removeAttribute('style');
        };
        ZoomClass.prototype.ZoomIn = function (ZoomForeignObj) {
            if (!ZoomForeignObj) {
                this.PatchZoomObj();
            }
            this.Image2Center();
            this.ShowState = true;
            if (!ZoomForeignObj) {
                this.AddHandlers();
            }
        };
        ZoomClass.prototype.ZoomMask = function () {
            this.Owner.Mask.Show('0.8');
            this.Obj.style.display = 'block';
        };
        ZoomClass.prototype.ZoomAnything = function (Obj, w, h) {
            this.ZoomObj = { obj: Obj };
            if (w) {
                this.ZoomObj.w = w;
            }
            if (h) {
                this.ZoomObj.h = h;
            }
            this.ZoomIn(true);
        };
        ZoomClass.prototype.ZoomIMG = function (Path, W, H) {
            this.ZoomUpdateBox('<img src="' + Path + '" width="' + W + '" height="' + H + '" />');
            this.ZoomMask();
            this.SetZoomObj(this.Obj, W, H);
            this.ZoomIn();
        };
        ZoomClass.prototype.ZoomHTML = function (HTML) {
            this.ZoomUpdateBox(HTML);
            this.ZoomMask();
            this.SetZoomObj(this.Obj, this.Obj.clientWidth, this.Obj.clientHeight);
            this.ZoomIn();
        };
        ZoomClass.prototype.ZoomUpdateBox = function (Data) {
            this.ZoomWrap.innerHTML = this.ZoomOutHTML + Data;
        };
        ZoomClass.prototype.PatchZoomObj = function () {
            var DocSize = this.GetDocumentSize();
            if (!this.ZoomObj.w || DocSize.w <= this.ZoomObj.w) {
                this.Obj.style.width = DocSize.w + 'px';
                this.ZoomObj.w = 0;
            }
            else {
                this.Obj.style.width = 'auto';
            }
            if (!this.ZoomObj.h || DocSize.h <= this.ZoomObj.h) {
                this.Obj.style.height = DocSize.h + 'px';
                this.ZoomObj.h = 0;
            }
            else {
                this.Obj.style.height = 'auto';
            }
        };
        return ZoomClass;
    })();
    EventsModule.ZoomClass = ZoomClass;
    var ChapterClass = (function () {
        function ChapterClass(Owner) {
            this.Owner = Owner;
            this.WindowWidth = 340;
            this.HideTimeout = 0;
            this.HideTimeoutTimer = 1000;
            this.ChapterObj = document.querySelector('#footer .chapter-box');
            this.ChapterText = this.ChapterObj.querySelector('p');
        }
        ChapterClass.prototype.ShowWindow = function (Range) {
            this.SetChapterText(this.Owner.GetTitleFromTOC(Range));
            this.RepositionWindow();
            this.ToggleWindow('block');
        };
        ChapterClass.prototype.ClearWindow = function () {
            clearTimeout(this.HideTimeout);
            this.SetChapterText('&nbsp;');
        };
        ChapterClass.prototype.SetChapterText = function (text) {
            this.RepositionWindow();
            this.ChapterText.innerHTML = text;
            if (text == '&nbsp;') {
                this.ChapterText.removeAttribute('title');
                return;
            }
            this.ChapterText.setAttribute('title', text);
        };
        ChapterClass.prototype.HideWindowTimer = function () {
            var _this = this;
            clearTimeout(this.HideTimeout);
            this.HideTimeout = setTimeout(function () { return _this.HideWindow(); }, this.HideTimeoutTimer);
        };
        ChapterClass.prototype.HideWindow = function () {
            this.ToggleWindow('none');
        };
        ChapterClass.prototype.ToggleWindow = function (state) {
            this.ChapterObj.style.display = state;
        };
        ChapterClass.prototype.RepositionWindow = function () {
            var half = this.WindowWidth / 2;
            var left = progressBar.dot.offsetLeft - half;
            if (left < 0) {
                left = 0;
            }
            else {
                left += progressBar.dot.offsetWidth / 2;
            }
            if (left + this.WindowWidth > progressBar.obj.offsetWidth) {
                left = progressBar.obj.offsetWidth - this.WindowWidth;
            }
            this.ChapterObj.style.left = left + 'px';
        };
        return ChapterClass;
    })();
    EventsModule.ChapterClass = ChapterClass;
})(EventsModule || (EventsModule = {}));
//# sourceMappingURL=Events.js.map