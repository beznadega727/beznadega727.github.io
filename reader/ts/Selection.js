/// <reference path="SelectionHead.ts" />
var SelectionModule;
(function (SelectionModule) {
    var SelectionClass = (function () {
        function SelectionClass(Callback, Owner) {
            this.Callback = Callback;
            this.Owner = Owner;
            this.StartElPos = [];
            this.ClearCoordinates();
            this.SelectedTextState = false;
            this.SelectionState = false;
            this.SelectionTimerValue = 50;
            this.TouchState = false;
            this.TouchTimerValue = 10;
            this.AddHandlers();
            this.Debug = false;
        }
        SelectionClass.prototype.ClearCoordinates = function () {
            this.Coordinates = { X: 0, Y: 0, Button: null };
        };
        SelectionClass.prototype.AddHandlers = function () {
            var _this = this;
            if (this.Owner.PDA.state) {
                this.Owner.ReaderBox.addEventListener('touchstart', function (e) { return _this.OnStart(e); }, false);
                this.Owner.ReaderBox.addEventListener('touchend', function (e) { return _this.OnTouchEnd(e); }, false);
                window.addEventListener('scroll', function (e) { return _this.OnTouchScroll(); }, false);
            }
            else {
                this.Owner.ReaderBox.addEventListener('mousedown', function (e) { return _this.OnStart(e); }, false);
                this.Owner.ReaderBox.addEventListener('mouseup', function (e) { return _this.OnEnd(e); }, false);
            }
        };
        SelectionClass.prototype.AddMoveHandlers = function () {
            var _this = this;
            this.DebugLog('AddMoveHandlers');
            if (!getSetting('enableClick') && !this.Owner.PDA.state) {
                this.Owner.ReaderBox.ontouchmove = function (e) { return _this.OnMove(e); };
            }
            if (!this.Owner.PDA.state) {
                this.Owner.ReaderBox.onmousemove = function (e) { return _this.OnMove(e); };
            }
            else {
                window.ontouchmove = function (e) { return _this.OnTouchMove(e); };
            }
        };
        SelectionClass.prototype.RemoveMoveHandlers = function () {
            this.DebugLog('RemoveMoveHandlers');
            if (!this.Owner.PDA.state) {
                this.Owner.ReaderBox.ontouchmove = function () { };
            }
            else {
                window.ontouchmove = function () { };
            }
            this.Owner.ReaderBox.onmousemove = function () { };
        };
        SelectionClass.prototype.ClearTimer = function () {
            clearTimeout(this.SelectionMoveTimer);
            this.SelectionMoveTimer = 0;
        };
        SelectionClass.prototype.SetTimer = function () {
            var _this = this;
            this.SelectionMoveTimer = setTimeout(function () { return _this.MakeNewTemporary(); }, this.SelectionTimerValue);
        };
        SelectionClass.prototype.MakeNewTemporary = function () {
            if (this.TemporaryNote) {
                this.TemporaryNote.Detach();
            }
            if (!this.TemporaryNote) {
                this.TemporaryNote = new FB3Bookmarks.Bookmark(this.Owner.Bookmarks);
            }
            this.TemporaryNote.Group = 3;
            this.TemporaryNote.TemporaryState = 1;
            this.SelectionState = true;
        };
        SelectionClass.prototype.OnStart = function (e) {
            this.DebugLog('OnStart');
            var Coords = this.Owner.GetCoordinates(e);
            if (this.CheckEventButton(e, Coords)) {
                if (!this.SelectionState) {
                    this.Coordinates = Coords;
                }
                this.AddMoveHandlers();
            }
        };
        SelectionClass.prototype.OnEnd = function (e) {
            this.DebugLog('OnEnd');
            this.ClearTimer();
            this.RemoveMoveHandlers();
            this.ClearCoordinates();
            if (this.SelectedTextState || (!this.SelectedTextState && this.SelectionState) ||
                (!this.Owner.PDA.state && this.SelectionState)) {
                // we have selected text
                // we have selection ON, but didnt selected text (to skip double fire)
                // we have selection and its not PDA, why? some sort of fix
                this.SelectedTextState = false;
                this.SelectionState = false;
                return;
            }
            this.SelectionState = false;
            if (this.CheckEventButton(e)) {
                this.Callback(e);
            }
        };
        SelectionClass.prototype.CheckEventButton = function (e, Coords) {
            var Coords = Coords || this.Owner.GetCoordinates(e);
            return Coords.Button <= 1 || this.Owner.PDA.state;
        };
        SelectionClass.prototype.OnMove = function (e) {
            this.DebugLog('OnMove');
            if (this.SelectionState) {
                var FailInit = false;
                // if we dont have any Temp notes, just ignor anything
                if (this.TemporaryNote && this.TemporaryNote.Group == 3) {
                    var Coords = this.Owner.GetCoordinates(e, this.Coordinates);
                    this.ClearCoordinates();
                    Coords.X = this.HackCanvasCoordinateX(Coords.X);
                    if (!isRelativeToViewport()) {
                        Coords.X += window.pageXOffset;
                        Coords.Y += window.pageYOffset;
                    }
                    var CurrentElPos = this.Owner.Reader.ElementAtXY(Coords.X, Coords.Y);
                    if (!this.SelectedTextState) {
                        this.StartElPos = CurrentElPos;
                    }
                    if (CurrentElPos && CurrentElPos.length && this.StartElPos && this.StartElPos.length) {
                        if (FB3Reader.PosCompare(CurrentElPos, this.StartElPos) < 0) {
                            this.UpdateRange(CurrentElPos, this.StartElPos);
                        }
                        else {
                            this.UpdateRange(this.StartElPos, CurrentElPos);
                        }
                        this.UpdateTemporaryNote();
                    }
                }
            }
            else {
                this.DebugLog('OnMove new note');
                this.SetTimer();
            }
        };
        SelectionClass.prototype.UpdateRange = function (StartPos, EndPos) {
            this.TemporaryNote.Range.From = StartPos;
            this.TemporaryNote.Range.To = EndPos;
        };
        SelectionClass.prototype.UpdateTemporaryNote = function () {
            this.SelectedTextState = true;
            // logic - remove old one, create new, add new
            var NewNote = this.TemporaryNote.RoundClone(false);
            NewNote.TemporaryState = 1;
            this.TemporaryNote.Detach();
            this.TemporaryNote = NewNote;
            this.Owner.Bookmarks.AddBookmark(this.TemporaryNote);
            this.Refresh();
        };
        SelectionClass.prototype.HackCanvasCoordinateX = function (X) {
            var sideMargin = calcReaderMargin();
            var readerWidth = this.Owner.ReaderBox.offsetWidth - sideMargin;
            if (X < sideMargin) {
                X = sideMargin + 1;
            }
            else if (X > readerWidth + sideMargin) {
                X = readerWidth + sideMargin - 1;
            }
            return Math.floor(X);
        };
        SelectionClass.prototype.Refresh = function () {
            this.Owner.Refresh();
        };
        SelectionClass.prototype.Remove = function () {
            if (this.TemporaryNote) {
                this.TemporaryNote.Detach();
                this.TemporaryNote = undefined;
                this.Refresh();
                return false;
            }
            return true;
        };
        SelectionClass.prototype.ClearTouchTimer = function () {
            clearTimeout(this.TouchMoveTimer);
            this.TouchMoveTimer = 0;
        };
        SelectionClass.prototype.OnTouchStart = function (e) {
            this.DebugLog('OnTouchStart');
        };
        SelectionClass.prototype.OnTouchEnd = function (e) {
            this.DebugLog('OnTouchEnd');
            this.ClearTouchTimer();
            if (this.TouchState) {
                this.TouchState = false;
                return;
            }
            this.TouchState = false;
            return this.OnEnd(e);
        };
        SelectionClass.prototype.OnTouchMove = function (e) {
            var _this = this;
            this.DebugLog('OnTouchMove');
            this.TouchMoveTimer = setTimeout(function () {
                _this.TouchState = true;
            }, this.TouchTimerValue);
            return;
        };
        SelectionClass.prototype.OnTouchScroll = function () {
            this.DebugLog('OnTouchScroll');
            // skip any scroll actions, like mousemove/touchmove
            this.TouchState = true;
        };
        SelectionClass.prototype.DebugLog = function (str) {
            if (this.Debug) {
                console.log('[SelectionObj] ' + str);
            }
        };
        return SelectionClass;
    })();
    SelectionModule.SelectionClass = SelectionClass;
})(SelectionModule || (SelectionModule = {}));
//# sourceMappingURL=Selection.js.map