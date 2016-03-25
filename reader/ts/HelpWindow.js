/// <reference path="HelpWindowHead.ts" />
var Help;
(function (Help) {
    var HelpWindow = (function () {
        function HelpWindow(Obj, Parent) {
            this.Obj = Obj;
            this.Parent = Parent;
            this.ButtonClass = ['menu-help'];
            this.ShowState = false;
            this.AddHandlers();
            this.Parent.WindowsCarry.RegisterWindow(this);
        }
        HelpWindow.prototype.AddHandlers = function () {
            var _this = this;
            this.Obj.addEventListener('click', function () {
                _this.HideWindow();
                TopMenuObj.RemoveActive();
            }, false);
        };
        HelpWindow.prototype.ButtonHandler = function () {
            if (!this.ShowState) {
                this.ShowWindow();
            }
            else {
                this.HideWindow();
            }
        };
        HelpWindow.prototype.ShowWindow = function () {
            this.ShowState = true;
            this.Parent.Mask.Show('0.8');
            this.ToggleWindow('block');
            this.Parent.ZoomObj.ZoomAnything(this.Obj);
        };
        HelpWindow.prototype.HideWindow = function () {
            this.Parent.Mask.Hide();
            this.ToggleWindow('none');
            this.ShowState = false;
        };
        HelpWindow.prototype.ToggleWindow = function (state) {
            this.Obj.style.display = state;
        };
        return HelpWindow;
    })();
    Help.HelpWindow = HelpWindow;
})(Help || (Help = {}));
//# sourceMappingURL=HelpWindow.js.map