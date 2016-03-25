/// <reference path="ContentsWindowHead.ts" />
var Contents;
(function (Contents) {
    var ContentsWindow = (function () {
        function ContentsWindow(Obj, Parent) {
            this.Obj = Obj;
            this.Parent = Parent;
            this.ButtonClass = ['menu-toc'];
            this.ShowState = false;
            this.SetObjectList();
            this.Parent.WindowsCarry.RegisterWindow(this);
        }
        ContentsWindow.prototype.ButtonHandler = function () {
            if (!this.ShowState) {
                this.ShowWindow();
            }
            else {
                this.HideWindow();
            }
        };
        ContentsWindow.prototype.SetObjectList = function () {
            this.ObjList = this.Obj.querySelector('#toc-wrap ul');
        };
        ContentsWindow.prototype.MakeContent = function () {
            this.PrepareData();
            this.ObjList.innerHTML = this.ParseWindowData();
            this.SetHandlers();
        };
        ContentsWindow.prototype.MakeTOCTree = function (TOC, deep) {
            if (deep === void 0) { deep = 1; }
            var out = '';
            for (var j = 0; j < TOC.length; j++) {
                var row = TOC[j], current = '', el = 'a', href = '', icons = '', bookmarkCount = 0;
                if (row.bookmarks) {
                    if (row.bookmarks.g0) {
                        current = ' current';
                        el = 'a class="current"';
                    }
                    icons += '<span class="toc-icons">';
                    if (row.bookmarks.g3) {
                        bookmarkCount += row.bookmarks.g3 * 1;
                    }
                    if (row.bookmarks.g5) {
                        bookmarkCount += row.bookmarks.g5 * 1;
                    }
                    if (bookmarkCount) {
                        icons += '<span class="icon-type icon-type-3"></span>' +
                            '<span class="icon-text">' + bookmarkCount + '</span>';
                    }
                    if (row.bookmarks.g1) {
                        icons += '<span class="icon-type icon-type-1"></span>' +
                            '<span class="icon-text">' + row.bookmarks.g1 + '</span>';
                    }
                    icons += '</span>';
                }
                if (row.t) {
                    out += '<li class="deep' + deep + current + '" data-e="' + row.s + '">' +
                        '<' + el + href + '>' + this.Parent.PrepareTitle(row.t) + icons + '</' + el + '>' + '</li>\r\n';
                }
                if (row.c) {
                    for (var i = 0; i < row.c.length; i++) {
                        out += this.MakeTOCTree([row.c[i]], deep + 1);
                    }
                }
            }
            return out;
        };
        ContentsWindow.prototype.ParseWindowData = function () {
            var html = this.MakeTOCTree(this.WindowData);
            return html;
        };
        ContentsWindow.prototype.ShowWindow = function () {
            this.ShowState = true;
            this.MakeContent();
            this.Parent.Mask.Show();
            this.ToggleWindow('block');
            if (!this.Parent.PDA.state) {
                this.Scroll = new scrollbar(this.Obj.querySelector('.scrollbar'), {});
            }
        };
        ContentsWindow.prototype.HideWindow = function () {
            this.Parent.Mask.Hide();
            this.ToggleWindow('none');
            this.ShowState = false;
        };
        ContentsWindow.prototype.ToggleWindow = function (state) {
            this.Obj.style.display = state;
        };
        ContentsWindow.prototype.PrepareData = function () {
            this.WindowData = this.Parent.Reader.TOC();
        };
        ContentsWindow.prototype.SetHandlers = function () {
            var _this = this;
            var buttons = this.Obj.querySelectorAll('li');
            for (var j = 0; j < buttons.length; j++) {
                buttons[j].addEventListener('click', function (e) { return _this.GoToTOCEntry(e); }, false);
            }
        };
        ContentsWindow.prototype.GoToTOCEntry = function (e) {
            var e = this.Parent.GetEvent(e);
            var target = (e.target || e.srcElement);
            target = this.Parent.GetElement(target, 'li');
            this.Parent.WindowsCarry.HideAllWindows();
            LitresHistory.push(this.Parent.Bookmarks.Bookmarks[0].Range.From.slice(0));
            this.Parent.Reader.GoTO([parseInt(target.getAttribute('data-e'))]);
        };
        return ContentsWindow;
    })();
    Contents.ContentsWindow = ContentsWindow;
})(Contents || (Contents = {}));
//# sourceMappingURL=ContentsWindow.js.map