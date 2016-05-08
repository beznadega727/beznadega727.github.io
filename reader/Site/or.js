/// <reference path="FB3ReaderSite.ts" />
/// <reference path="../Reader/FB3Reader.ts" />
/// <reference path="../DOM/FB3DOM.ts" />
/// <reference path="../DataProvider/FB3AjaxDataProvider.ts" />
/// <reference path="../Bookmarks/FB3Bookmarks.ts" />
/// <reference path="../PagesPositionsCache/PPCache.ts" />
/// <reference path="Settings.ts" />
/// <reference path="UrlParser.ts" />
/// <reference path="LocalBookmarks.ts" />
/// <reference path="BarClass.ts" />
/// <reference path="History.ts" />
/// <reference path="FullScreen.ts" />
/// <reference path="../../view/ts/SocialSharing.ts" />
/// <reference path="../../view/ts/BookmarksWindow.ts" />
/// <reference path="../../view/ts/HelpWindow.ts" />
/// <reference path="../../view/ts/ContentsWindow.ts" />
/// <reference path="../../view/ts/ContextMenu.ts" />
/// <reference path="../../view/ts/Selection.ts" />
/// <reference path="../../view/ts/Events.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//localStorage.clear();
//alert(navigator.userAgent);
//window.onerror = (e, url, line) => {
//	alert(e + ', ' + url + ', ' + line);
//};
var TopMenu;
(function (TopMenu) {
    var TopMenuClass = (function () {
        function TopMenuClass(Owner) {
            this.Owner = Owner;
            this.AddHandlers();
            this.CurrentButton = undefined;
            this.ActiveClass = 'active';
        }
        TopMenuClass.prototype.AddHandlers = function () {
            var _this = this;
            for (var j = 0; j < this.Owner.WindowsCarry.WindowsStack.length; j++) {
                var WinObj = this.Owner.WindowsCarry.WindowsStack[j];
                if (!WinObj.button.length) {
                    continue;
                }
                for (var i = 0; i < WinObj.button.length; i++) {
                    var _class = '.top-menu li span.' + WinObj.button[i];
                    document.querySelector(_class).parentNode
                        .addEventListener('click', function (e) { return _this.ButtonClick(e); }, false);
                }
            }
        };
        TopMenuClass.prototype.ButtonClick = function (e) {
            this.Owner.RemoveSelection(); // if we have any temporary notes, this will delete them
            var e = this.Owner.GetEvent(e);
            var ClickedButton = (e.target || e.srcElement);
            ClickedButton = this.Owner.GetElement(ClickedButton, 'li');
            if (hasClass(ClickedButton, this.ActiveClass)) {
                this.Owner.WindowsCarry.HideAllWindows(); // we clicked already opened window, just hide them all
                return;
            }
            if ((this.CurrentButton && hasClass(this.CurrentButton, this.ActiveClass)) ||
                this.Owner.ZoomObj.ShowState) {
                this.Owner.WindowsCarry.HideAllWindows(); // we have opened window or zoomIn, close all
            }
            this.CurrentButton = ClickedButton;
            addClass(this.CurrentButton, this.ActiveClass);
            this.Owner.WindowsCarry.GetWindow(this.GetIconClass(this.CurrentButton)).obj.ButtonHandler(e);
        };
        TopMenuClass.prototype.RemoveActive = function () {
            if (this.CurrentButton) {
                removeClass(this.CurrentButton, this.ActiveClass);
                this.CurrentButton = undefined;
            }
        };
        TopMenuClass.prototype.GetIconClass = function (Obj) {
            return Obj.querySelector('span').className;
        };
        return TopMenuClass;
    })();
    TopMenu.TopMenuClass = TopMenuClass;
})(TopMenu || (TopMenu = {}));
var pda = {
    state: false,
    platform: '',
    form: 'phone',
    version: '0',
    browser: '',
    orientation: 0,
    portrait: true,
    top_hidden: false,
    pixelRatio: 1,
    currentHeight: 0
};
var win = window, doc = document, readerBox = doc.querySelector('#reader'), footerBox = doc.querySelector('#footer'), dotMouseClick = false;
var AppVersion = '1.1.41';
var aldebaran_or4 = false; // stupid ugly workaround
if (window.location.href.match(/aldebaran|or_alt/i)) {
    aldebaran_or4 = true;
}
var AFB3Reader;
var AFB3PPCache;
var BookmarksProcessor;
var start = 0;
var LitresURLParser = new URLparser.URLparserClass();
var LitresLocalBookmarks = new LocalBookmarks.LocalBookmarksClass(LitresURLParser.ArtID);
var LitresHistory; // need proper interface
var LitresFullScreen;
var EventsSupport = new EventsModule.EventActions(readerBox, footerBox);
var MouseObj;
var TopMenuObj;
var ContextObj;
var LitresBookmarksWindow;
var LitresHelpWindow;
var LitresContentsWindow;
var LitresSettingsWindow; // dummy class, need refactoring
var FacebookSharing;
var TwitterSharing;
var VkontakteSharing;
var progressBar;
var fontsizeBar;
var themeBar;
var readerMarginBar;
var lineHeightBar;
var ResizeSupport = new EventsModule.ResizeClass(EventsSupport);
function addClass(obj, _class) {
    var list = [];
    if (obj.getAttribute('class')) {
        list = obj.getAttribute('class').split(' ');
    }
    if (!list || list.length == 0) {
        return obj.setAttribute('class', _class);
    }
    for (var j = 0; j < list.length; j++) {
        if (list[j] == _class) {
            return;
        }
    }
    list.push(_class);
    obj.setAttribute('class', list.join(' '));
}
function removeClass(obj, _class) {
    var list = [];
    if (obj.getAttribute('class')) {
        list = obj.getAttribute('class').split(' ');
    }
    if (!list || list.length == 0) {
        return;
    }
    for (var j = 0; j < list.length; j++) {
        if (list[j] == _class) {
            list.splice(j, 1);
            break;
        }
    }
    obj.setAttribute('class', list.join(' '));
}
function hasClass(obj, _class) {
    var list = [];
    if (obj.getAttribute('class')) {
        list = obj.getAttribute('class').split(' ');
    }
    if (!list || list.length == 0) {
        return false;
    }
    for (var j = 0; j < list.length; j++) {
        if (list[j] == _class) {
            return true;
        }
    }
    return false;
}
function changeCSS(theClass, element, value, add) {
    //Last Updated on July 4, 2011
    //documentation for this script at
    //http://www.shawnolson.net/a/503/altering-css-class-attributes-with-javascript.html
    var cssRules;
    var doc = document;
    var add = add || '';
    for (var s = 0; s < doc.styleSheets.length; s++) {
        try {
            doc.styleSheets[s].insertRule(theClass + ' { ' + element + ': ' + value + '' + add + '; }', doc.styleSheets[s][cssRules].length);
        }
        catch (err) {
            try {
                doc.styleSheets[s].addRule(theClass, element + ': ' + value + '' + add + ';');
            }
            catch (err) {
                try {
                    if (doc.styleSheets[s]['rules']) {
                        cssRules = 'rules';
                    }
                    else if (doc.styleSheets[s]['cssRules']) {
                        cssRules = 'cssRules';
                    }
                    else {
                    }
                    for (var r = 0; r < doc.styleSheets[s][cssRules].length; r++) {
                        if (doc.styleSheets[s][cssRules][r].selectorText == theClass) {
                            if (doc.styleSheets[s][cssRules][r].style[element]) {
                                doc.styleSheets[s][cssRules][r].style[element] = value + '' + add;
                                break;
                            }
                        }
                    }
                }
                catch (err) { }
            }
        }
    }
}
var relativeToViewport;
function isRelativeToViewport() {
    // https://github.com/moll/js-element-from-point/blob/master/index.js
    if (relativeToViewport != null) {
        return relativeToViewport;
    }
    var x = window.pageXOffset ? window.pageXOffset + window.innerWidth - 1 : 0;
    var y = window.pageYOffset ? window.pageYOffset + window.innerHeight - 1 : 0;
    if (!x && !y) {
        return true;
    }
    // Test with a point larger than the viewport. If it returns an element,
    // then that means elementFromPoint takes page coordinates.
    return relativeToViewport = !document.elementFromPoint(x, y);
}
/* left top flag */
var NativeNote;
var addBookmarkTouch = false; // webkit hack
var addBookmark = doc.querySelector('#add-bookmark');
addBookmark.addEventListener('touchstart', function () {
    // webkit browsers fire touch events at first
    addBookmarkTouch = true;
}, false);
addBookmark.addEventListener('click', BookmarkIconAction, false);
addBookmark.addEventListener('mouseenter', ToggleBookmarkIcon, false);
addBookmark.addEventListener('mouseleave', ToggleBookmarkIcon, false);
function ToggleBookmarkIcon(event) {
    if (MouseObj.CheckFirefoxTouchEvent(event) || MouseObj.CheckIETouchEvent(event) || addBookmarkTouch) {
        return;
    }
    var target = (event.target || event.srcElement);
    if (hasClass(target, 'hover')) {
        removeClass(target, 'hover');
    }
    else {
        addClass(target, 'hover');
    }
}
function BookmarkIconAction() {
    InitBookmark(this);
}
function InitBookmark(target) {
    if (!EventsSupport.CheckDoubleClick()) {
        EventsSupport.SetPreventDoubleCheck();
        if (target && hasClass(target, 'clicked')) {
            var BookmarksToDelete = LitresReaderSite.GetBookmarksOnPage();
            for (var j = 0; j < BookmarksToDelete.length; j++) {
                for (var i = 0; i < BookmarksProcessor.Bookmarks.length; i++) {
                    if (BookmarksToDelete[j].ID == BookmarksProcessor.Bookmarks[i].ID) {
                        BookmarksProcessor.Bookmarks[i].Detach();
                        break;
                    }
                }
            }
            removeClass(addBookmark, 'clicked');
        }
        else {
            if (NativeNote) {
                NativeNote.Detach();
            }
            if (!NativeNote) {
                NativeNote = new FB3Bookmarks.Bookmark(BookmarksProcessor);
            }
            var ObjectPos;
            // need fix for
            // LitresLocalBookmarks.GetCurrentPosition()
            // [71, 126]
            if (target) {
                var NoteRange = AFB3Reader.GetVisibleRange();
                if (!NoteRange) {
                    NoteRange = BookmarksProcessor.Bookmarks[0].Range;
                }
                else if (NoteRange.From.length > 1 && NoteRange.From[0] != NoteRange.To[0]) {
                    var NextEl = AFB3Reader.FB3DOM.GetElementByAddr([1 + NoteRange.From[0]]);
                    if (NextEl && NextEl.TagName != 'title') {
                        NoteRange.From = [1 + NoteRange.From[0]];
                    }
                    NoteRange.To = NoteRange.From;
                }
                ObjectPos = AFB3Reader.FB3DOM.GetElementByAddr(NoteRange.From).Position();
            }
            else {
                ObjectPos = AFB3Reader.ElementAtXY(ContextObj.Position.X, ContextObj.Position.Y);
            }
            if (!ObjectPos || ObjectPos.length < 1) {
                NativeNote = undefined;
                return undefined;
            }
            NativeNote.Range.From = ObjectPos.slice(0);
            NativeNote.Range.To = ObjectPos;
            NativeNote = NativeNote.RoundClone(true);
            if (target) {
                NativeNote = NoteCheckTag(NativeNote);
            }
            NativeNote.Group = 1;
            NativeNote.Title = EventsSupport.GetTitleFromTOC(NativeNote.Range).substr(0, 100);
            if (!NativeNote.Title) {
                NativeNote.Title = 'Закладка';
            }
            BookmarksProcessor.AddBookmark(NativeNote);
            NativeNote = undefined;
            addClass(addBookmark, 'clicked');
        }
        AFB3Reader.Redraw();
        AFB3Reader.Site.StoreBookmarksHandler(200);
    }
    if (target) {
        target.blur();
    }
}
function NoteCheckTag(Note) {
    var pos = Note.Range.From[0];
    while (Note.Owner.FB3DOM.Childs[pos].TagName == 'empty-line') {
        pos++;
        if (Note.Owner.FB3DOM.Childs[pos]) {
            Note.Range.From = pos.slice(0);
            Note.Range.To = pos;
        }
        else {
            break;
        }
    }
    return Note;
}
var LitresReaderSite;
(function (LitresReaderSite) {
    function CheckBookmarksOnPage(Range) {
        if (BookmarksProcessor.GetBookmarksInRange(1, Range).length) {
            return true;
        }
        else {
            return false;
        }
    }
    LitresReaderSite.CheckBookmarksOnPage = CheckBookmarksOnPage;
    function GetBookmarksOnPage() {
        return BookmarksProcessor.GetBookmarksInRange(1);
    }
    LitresReaderSite.GetBookmarksOnPage = GetBookmarksOnPage;
    function HidePagerBox() {
        footerBox.querySelector('.pager-box').style.visibility = 'hidden';
        footerBox.querySelector('#pager-max-box').style.display = 'none';
    }
    LitresReaderSite.HidePagerBox = HidePagerBox;
    function HistoryAfterUpdate() { }
    LitresReaderSite.HistoryAfterUpdate = HistoryAfterUpdate;
    function HistoryAfterLast() { }
    LitresReaderSite.HistoryAfterLast = HistoryAfterLast;
    function PatchLitresLink(link) {
        if (LitresURLParser.Lfrom) {
            link += (/\?/.test(link) ? '&' : '?') +
                'lfrom=' + LitresURLParser.Lfrom;
        }
        return link;
    }
    LitresReaderSite.PatchLitresLink = PatchLitresLink;
    var LitresSite = (function (_super) {
        __extends(LitresSite, _super);
        function LitresSite(canvas) {
            _super.call(this, canvas);
            this.StoreBookmarkTimer = 0;
            this.Canvas = canvas;
            this.IdleThreadProgressor = new LitresCacheProgress(doc.querySelector('.cache'));
        }
        LitresSite.prototype.HeadersLoaded = function (Meta) {
            var _this = this;
            var Author = Meta.Authors[0].First + ' ' + Meta.Authors[0].Last;
            var Title = Meta.Title;
            doc.title = Author + ' - ' + Title;
			doc.querySelector('.top-box').querySelector('#author').innerHTML = Title;
            // footerBox.querySelector('#author').innerHTML = Title;
            setTimeout(function () {
                _this.CanStoreBookmark = true;
                if (_this.NeedStoreBookmark)
                    _this.StoreBookmarksHandler(2000);
                _this.NeedStoreBookmark = false;
            }, 8000);
        };
        LitresSite.prototype.AfterTurnPageDone = function (Data) {
            if (Data.TurnByProgressBar) {
                EventsSupport.ChapterObj.ShowWindow(BookmarksProcessor.Bookmarks[0].Range);
            }
            this.UpdateCurPage(Data);
            //			console.log('from core ' + Data.Percent);
            progressBar.setValue(Data.Percent);
            LitresLocalBookmarks.SetCurrentPosition(Data.Pos);
            LitresLocalBookmarks.SetCurrentDateTime(BookmarksProcessor.Bookmarks[0].DateTime);
            if (pda.state && getSetting('pda_fullscreen') && pda.top_hidden) {
                LitresFullScreen.showHiddenElements();
            }
            this.StoreBookmarksHandler();
            //			this.SetScrollableNote();
        };
        LitresSite.prototype.BookCacheDone = function (Data) {
            this.UpdateCurPage(Data);
        };
        LitresSite.prototype.UpdateCurPage = function (Data) {
            if (Data.CurPage === undefined) {
                LitresReaderSite.HidePagerBox();
                return;
            }
            var maxPage = Data.MaxPage ? parseInt(Data.MaxPage.toFixed(0)) : 0;
            var CurPage = (Data.CurPage + 1) >= maxPage && maxPage ? maxPage : (Data.CurPage + 1);
            footerBox.querySelector('#pager-current').innerHTML = CurPage.toString();
            footerBox.querySelector('.pager-box').style.visibility = 'visible';
            if (maxPage) {
                footerBox.querySelector('#pager-max').innerHTML = maxPage.toString();
				doc.querySelector('.top-box').querySelector('#info_pages').innerHTML = '(1/'+maxPage.toString()+')';
                footerBox.querySelector('#pager-max-box').style.display = 'inline';
            }
        };
        LitresSite.prototype.StoreBookmarksHandler = function (timer) {
            if (timer === void 0) { timer = 10000; }
            BookmarksProcessor.MakeStoreXMLAsync(function (XML) {
                if (XML)
                    LitresLocalBookmarks.StoreBookmarks(XML);
            });
            if (!this.CanStoreBookmark) {
                this.NeedStoreBookmark = true;
                return;
            }
            if (this.StoreBookmarkTimer) {
                clearTimeout(this.StoreBookmarkTimer);
            }
            this.StoreBookmarkTimer = setTimeout(function () {
                BookmarksProcessor.Store();
            }, timer);
        };
        LitresSite.prototype.BeforeBookmarksAction = function () {
            if (LitresURLParser.User)
                return true;
            return false;
        };
        LitresSite.prototype.AfterStoreBookmarks = function () {
            this.CanStoreBookmark = true;
        };
        LitresSite.prototype.ZoomImg = function (obj) {
            EventsSupport.ZoomObj.ZoomIMG(obj.getAttribute('data-path'), obj.getAttribute('data-w'), obj.getAttribute('data-h'));
        };
        LitresSite.prototype.ZoomHTML = function (HTML) {
            EventsSupport.ZoomObj.ZoomHTML(HTML);
        };
        LitresSite.prototype.HistoryHandler = function (Pos) {
            LitresHistory.push(Pos);
        };
        //		public PatchNoteNode(Node: HTMLElement): HTMLElement {
        //			addClass(Node, 'scrollableNote');
        //			return Node;
        //		}
        LitresSite.prototype.SetScrollableNote = function () {
            var Reader = AFB3Reader;
            for (var I = Reader.CurVisiblePage; I < Reader.CurVisiblePage + Reader.NColumns; I++) {
                var items = Reader.Pages[I].ParentElement.querySelectorAll('.scrollableNote');
                for (var J = 0; J < items.length; J++) {
                    var scroll = new scrollbar(items[J], {});
                }
            }
        };
        LitresSite.prototype.showTrialEnd = function (ID) {
            if (LitresURLParser.PartID == 458582) {
                return '';
            }
            var text = 'Вы прочитали ознакомительный отрывок. ' +
                'Если книга вам понравилась, вы можете купить полную книгу и продолжить читать.';
            var buttonText = 'Купить и читать книгу';
            if (LitresURLParser.FreeBook) {
                text = 'Вы прочитали ознакомительный отрывок. Если книга вам понравилась, ' +
                    'вы можете взять полную версию книги и продолжить чтение.';
                buttonText = 'Взять себе';
            }
            else if (LitresURLParser.Biblio) {
                text = 'Вы прочитали ознакомительный отрывок. Если книга вам понравилась, ' +
                    'вы можете запросить у библиотекаря полную версию книги и продолжить чтение.';
                buttonText = 'Запросить книгу у библиотекаря';
            }
			// убрал кнопку trial
            return '<hr class="tag_empty-line" id="' + ID + '_0"/>' +
                '<div id="' + ID + '_1">' +
                '<p id="' + ID + '_1_0">' + text + '</p>' +
                '<hr class="tag_empty-line" id="' + ID + '_1_1"/>' +
                '<a id="' + ID + '_1_2" href="" class="litreslink noload trial-button1">' + buttonText + '</a>' +
                '</div>';
        };
        LitresSite.prototype.addTrialHandlers = function () {
            var TrialButton = document.querySelector('.trial-button');
            if (TrialButton) {
                var trial_url = 'http://www.litres.ru/' + LitresURLParser.ArtID;
                TrialButton.setAttribute('href', LitresReaderSite.PatchLitresLink(trial_url));
                if (LitresURLParser.Iframe) {
                    TrialButton.setAttribute('target', '_blank');
                }
                else {
                    TrialButton.addEventListener('click', function () {
                        if (LitresFullScreen.fullScreen) {
                            LitresFullScreen.ButtonHandler();
                        }
                    }, false);
                    LitRes.Widget.Start(); // omg this workaround
                }
            }
        };
        return LitresSite;
    })(FB3ReaderSite.ExampleSite);
    LitresReaderSite.LitresSite = LitresSite;
    var LitresCacheProgress = (function () {
        // dummy class for progressbar only
        function LitresCacheProgress(Obj) {
            this.Obj = Obj;
            this.Progresses = {};
        }
        LitresCacheProgress.prototype.Progress = function (Owner, Progress) {
            this.Progresses[Owner] = Progress;
            var N = 0;
            var OverallProgress = 0;
            for (var ProgressInst in this.Progresses) {
                N++;
                OverallProgress = this.Progresses[ProgressInst];
            }
            OverallProgress = OverallProgress / N;
            OverallProgress = OverallProgress.toFixed(1);
            // console.log(OverallProgress);
            if (OverallProgress >= 100) {
                this.Obj.style.display = 'none';
            }
            else {
                this.Obj.style.display = 'block';
            }
            this.Obj.style.width = OverallProgress + '%';
        };
        LitresCacheProgress.prototype.HourglassOn = function (Owner, LockUI, Message) { };
        LitresCacheProgress.prototype.HourglassOff = function (Owner) { };
        LitresCacheProgress.prototype.Alert = function (Message) { };
        LitresCacheProgress.prototype.Tick = function (Owner) {
            if (!this.Progresses[Owner]) {
                this.Progresses[Owner] = 1;
            }
            else if (this.Progresses[Owner] < 99) {
                this.Progresses[Owner] += 1;
            }
            this.Progress(Owner, this.Progresses[Owner]);
        };
        return LitresCacheProgress;
    })();
})(LitresReaderSite || (LitresReaderSite = {}));
function initEngine(Callback) {
    var Canvas = document.getElementById('reader');
    var AReaderSite = new LitresReaderSite.LitresSite(Canvas);
    AFB3PPCache = new FB3PPCache.PPCache();
    var DataProvider = new FB3DataProvider.AJAXDataProvider(LitresURLParser.BaseURL, LitresURLParser.ArtID2URL);
    var AReaderDOM = new FB3DOM.DOM(AReaderSite, AReaderSite.Progressor, DataProvider, AFB3PPCache);
    BookmarksProcessor = new FB3Bookmarks.LitResBookmarksProcessor(AReaderDOM, LitresURLParser.UUID, LitresURLParser.SID, LitresLocalBookmarks.GetCurrentArtBookmarks());
    BookmarksProcessor.aldebaran = aldebaran_or4;
    BookmarksProcessor.FB3DOM.Bookmarks.push(BookmarksProcessor);
    BookmarksProcessor.ReadyCallback = function () {
        var Range = AFB3Reader.GetVisibleRange();
        AFB3Reader.CanvasReadyCallback(Range);
        BookmarksProcessor.ReadyCallback = undefined;
    };
    AFB3Reader = new FB3Reader.Reader(LitresURLParser.UUID, true, AReaderSite, AReaderDOM, BookmarksProcessor, AppVersion, AFB3PPCache);
    EventsSupport.Reader = AFB3Reader;
    EventsSupport.Bookmarks = BookmarksProcessor;
    AFB3Reader.CanvasReadyCallback = function (Range) {
        if (LitresReaderSite.CheckBookmarksOnPage(Range)) {
            addClass(addBookmark, 'clicked');
        }
        else {
            removeClass(addBookmark, 'clicked');
        }
    };
    LitresHistory = new WebHistory.HistoryClass(AFB3Reader);
    if (Callback)
        Callback();
    if (AFB3Reader.HyphON) {
        AFB3Reader.HyphON = !(/Android [12]\./i.test(navigator.userAgent));
    }
    AFB3Reader.Init(LitresLocalBookmarks.GetCurrentPosition(), LitresLocalBookmarks.GetCurrentDateTime());
    window.addEventListener('resize', function () { return AFB3Reader.AfterCanvasResize(); });
    // social and windows
    FacebookSharing = new SocialSharing.FacebookSharing(LitresURLParser.ArtID, EventsSupport, LitresURLParser.FileID, doc.querySelector('#facebook .share-button'));
    TwitterSharing = new SocialSharing.TwitterSharing(LitresURLParser.ArtID, EventsSupport, LitresURLParser.FileID, false);
    VkontakteSharing = new SocialSharing.VkontakteSharing(LitresURLParser.ArtID, EventsSupport, LitresURLParser.FileID, false);
    LitresBookmarksWindow = new Bookmarks.BookmarksWindow(doc.querySelector('#bookmarks'), EventsSupport);
    LitresHelpWindow = new Help.HelpWindow(doc.querySelector('#tip'), EventsSupport);
    LitresContentsWindow = new Contents.ContentsWindow(doc.querySelector('#contents'), EventsSupport);
    LitresSettingsWindow = new Settings.SettingsWindow(doc.querySelector('#settings'), EventsSupport);
    TopMenuObj = new TopMenu.TopMenuClass(EventsSupport);
    if (LitresURLParser.Modal) {
        var CloseButton = document.querySelector('.menu-close').parentNode;
        CloseButton.removeAttribute('style');
        CloseButton.addEventListener('click', function () {
            if (LitresFullScreen.fullScreen) {
                LitresFullScreen.ButtonHandler();
            }
            AFB3Reader.Destroy = true;
            window.parent.CloseReadFrame();
        }, false);
        document.querySelector('#author').style.display = 'none';
        document.querySelector('.pager-box').style.textAlign = 'center';
    }
    start = new Date().getTime();
}
var LitRes = LitRes || {};
function setTrialLink() {
    var buyButton = doc.querySelector('#buy-book');
    if (LitresURLParser.PartID == 723763) {
        updateTrialButton(buyButton, 'Купить', 'Купите книгу и читайте полную версию.');
    }
    else if (LitresURLParser.FreeBook) {
        updateTrialButton(buyButton, 'Взять себе', 'Возьмите книгу и читайте полную версию.');
    }
    else if (LitresURLParser.Biblio) {
        updateTrialButton(buyButton, 'Взять в библиотеке', 'Возьмите книгу в библиотеке и читайте полную версию.');
    }
    if (LitresURLParser.Iframe) {
        buyButton.setAttribute('target', '_blank');
    }
    var trial_url = 'http://www.litres.ru/' + LitresURLParser.ArtID;
    buyButton.setAttribute('href', LitresReaderSite.PatchLitresLink(trial_url));
}
function updateTrialButton(button, value, text) {
    if (button.textContent) {
        button.textContent = value;
        button.previousElementSibling.textContent = text;
    }
    else {
        button.innerHTML = value; // for IE 8 and below
        button.previousElementSibling.innerHTML = text;
    }
}
function startView() {
    document.onselectstart = function () { return false; };
    if (LitresURLParser.Modal) {
        addClass(document.body, 'modal');
        window.focus();
    }
    if (LitresURLParser.PartID != 458582) {
        if (!aldebaran_or4 && !LitresURLParser.Modal) {
            /*var obj = doc.querySelector('.logo');
            obj.setAttribute('href', LitresReaderSite.PatchLitresLink('/' + LitresURLParser.ArtID));
            if (LitresURLParser.Iframe) {
                obj.setAttribute('target', '_blank');
            }*/
        }
        if (LitresURLParser.Trial) {
            if (!aldebaran_or4 && !LitresURLParser.Modal) {
                doc.querySelector('.buy-box').style.display = 'block';
                changeCSS('#settings', 'top', '-34px');
            }
            if (LitresURLParser.Iframe) {
            }
            else {
                LitRes.Setup = { or4: true };
                if (LitresURLParser.PartID == 723763) {
                    LitRes.Setup.width = '712px';
                    LitRes.Setup.height = '650px';
                }
                if (LitresURLParser.Lfrom) {
                    LitRes.Setup.lfrom = LitresURLParser.Lfrom;
                }
                (function () {
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = '//www.litres.ru/static/new/widget/js/widget.js?r=' + AppVersion;
                    var x = document.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                })();
            }
            setTrialLink();
        }
    }
    else {
        doc.querySelector('.top-box').style.display = 'none';
    }
    if (win.devicePixelRatio) {
        pda.pixelRatio = win.devicePixelRatio;
    }
    checkPDAstate();
    EventsSupport.PDA = pda;
    MouseObj = new EventsModule.MouseClickClass(EventsSupport);
    if (LitresURLParser.PartID != 458582) {
        EventsSupport.SelectionObj = new SelectionModule.SelectionClass(function (e) { return MouseObj.OnClickHandler(e, 'click'); }, EventsSupport);
    }
    checkFonts();
    loadSettings();
    if (LitresURLParser.PartID == 458582 && !pda.state) {
        // useless workaround
        EventsSupport.ReaderBox.addEventListener('mouseup', function (e) { return MouseObj.OnClickHandler(e, 'click'); }, false);
        setSetting(1, 'enableClick');
        MouseObj.RemoveHandlers();
    }
    checkOperaPrestoClick();
    applySettings();
    calcHeight();
    if (pda.state) {
        FB3PPCache.MaxCacheRecords = 5; // Локалсторадж маленький и работает медленно, ограничим свои аппетиты
        FB3ReaderPage.PrerenderBlocks = 3; // Для построения страницы сколько блоков нам пригодится? Страница маленькая, хватит 3-х
        LitresFullScreen = new FullScreenSupport.PDAFullScreenClass(function (state) {
            // TODO: little ugly code
            var obj = doc.body;
            if (state) {
                if (!LitresURLParser.Trial) {
                    addClass(obj, 'pda-top-hidden');
                }
                addClass(obj, 'pda-top-absolute');
            }
            else {
                if (!LitresURLParser.Trial) {
                    removeClass(obj, 'pda-top-hidden');
                }
                removeClass(obj, 'pda-top-absolute');
            }
            setSetting(state, 'pda_fullscreen');
            calcHeight(true);
        }, function (state) {
            pda.top_hidden = state;
        }, EventsSupport);
        if (getSetting('pda_fullscreen')) {
            LitresFullScreen.ButtonHandler();
        }
        if (LitresURLParser.Trial) {
            changeCSS('#settings', 'top', '0px');
        }
    }
    else {
        LitresFullScreen = new FullScreenSupport.FullScreenClass(function () { return TopMenuObj.RemoveActive(); }, footerBox, EventsSupport);
    }
    progressBar = new BarClassRe.BarClass('progress', '#footer .progressbar', pda.state, function (val, type) {
        // console.log(type);
        // console.log('to core ' + val);
        if (type == 'action_move' || type == 'action_start') {
            EventsSupport.ChapterObj.ClearWindow();
        }
        if (type != 'action_end_doc') {
            AFB3Reader.GoToPercent(val, true);
        }
        if (type == 'action_end' || type == 'action_click' || type == 'action_end_doc') {
            EventsSupport.ChapterObj.HideWindowTimer();
        }
    });
    // progressBar.setValue(50);
    fontsizeBar = new BarClassRe.BarClass('setting', '#fontsize-box .progressbar', pda.state, changeFontSizeHandler, false, fontSizeArray, getSetting('fontSize'));
    themeBar = new BarClassRe.BarClass('setting', '#theme-box .progressbar', pda.state, changeThemeHandler, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], getSetting('theme'));
    readerMarginBar = new BarClassRe.BarClass('setting', '#reader-margin .progressbar', pda.state, changeReaderMarginHandler, false, marginList, getSetting('readerMargin'), true, true);
    lineHeightBar = new BarClassRe.BarClass('setting', '#line-height .progressbar', pda.state, changeLineHeightHandler, false, lineHeightList, getSetting('lineHeight'), true, true);
    tpApiCall();
    initEngine(beforeInitApplySetting);
    ContextObj = new ContextMenu.ContextMenuClass(EventsSupport);
    EventsSupport.AddNavArrows();
    if (!aldebaran_or4 && pda.platform == '') {
        var MouseWheelSupport = new EventsModule.MouseWheelClass(EventsSupport);
    }
    var KeydownSupport = new EventsModule.KeydownClass(EventsSupport);
    setSettingsEvents();
}
function tpApiCall() {
    if (!window.hasOwnProperty('tpApi')) {
        return;
    }
    tpApi('shop', '1');
    if (aldebaran_or4) {
        tpApi('partner', '2');
    }
    else if (LitresURLParser.Lfrom) {
        tpApi('partner', LitresURLParser.Lfrom);
    }
    else {
    }
    tpApi(LitresURLParser.Trial ? 'read-part' : 'read-full', 'offer', LitresURLParser.ArtID);
}
startView();
//# sourceMappingURL=or.js.map