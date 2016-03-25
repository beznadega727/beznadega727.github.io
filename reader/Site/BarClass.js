var doc = document;
var BarClassRe;
(function (BarClassRe) {
    var BarClass = (function () {
        function BarClass(type, obj, pda_state, callback, spanInfo, data, dataCurrent, progressSticky, drawStickyPointState, invertData) {
            this.type = type;
            this.obj = obj;
            this.pda_state = pda_state;
            this.callback = callback;
            this.spanInfo = spanInfo;
            this.data = data;
            this.dataCurrent = dataCurrent;
            this.progressSticky = progressSticky;
            this.drawStickyPointState = drawStickyPointState;
            this.invertData = invertData;
            this.eventType = null;
            this.barState = true;
            this.debug = false;
            this.mouseMoveState = true;
            this.progressCurrentLeft = 0;
            this.progressLeft = 0;
            this.swipeState = false;
            if (this.type == 'setting') {
                this.dataMax = this.data.length - 1;
            }
            this.initObjects();
            if (this.type == 'setting') {
                this.setValue();
            }
            this.setHandlers();
        }
        BarClass.prototype.initObjects = function () {
            this.obj = doc.querySelector(this.obj);
            if (this.type == 'setting' && this.drawStickyPointState) {
                this.drawStickyPoint();
            }
            this.progress = this.obj.querySelector('.progress');
            this.dot = this.obj.querySelector('.dot');
        };
        BarClass.prototype.setHandlers = function () {
            var _this = this;
            this.obj.onclick = function (e) { return _this.barClickHandler(e); };
            if (this.pda_state) {
                this.dot.ontouchstart = function (e) { return _this.dotClickHandler(e); };
                this.dot.ontouchend = function (e) { return _this.swipeDone(e); };
            }
            else {
                this.dot.onmousedown = function (e) { return _this.dotClickHandler(e); };
                this.dot.onmouseup = function (e) { return _this.swipeDone(e); };
            }
            var left = this.obj.parentNode.querySelector('.minus');
            if (left) {
                left.onclick = function () { return _this.leftClick(); };
            }
            var right = this.obj.parentNode.querySelector('.plus');
            if (right) {
                right.onclick = function () { return _this.rightClick(); };
            }
        };
        BarClass.prototype.getPercent = function (val, min, max) {
            var p = 0;
            if (val <= min) {
                p = 0;
            }
            else if (val >= max) {
                p = 100;
            }
            else {
                p = val / (max / 100);
            }
            return p.toFixed(2);
        };
        BarClass.prototype.updateBar = function (val) {
            var x = parseFloat(this.getPercent(Math.abs(val), 0, this.obj.offsetWidth));
            this.progressWidth = x;
            this.debugLog('updateBar ' + x);
            switch (this.type) {
                case "progress":
                    this.dataCurrent = x;
                    break;
                case "setting":
                    var prev = 0;
                    for (var j = 0; j <= this.dataMax; j++) {
                        var current = parseFloat(this.getPercent(j, 0, this.dataMax));
                        if (current >= x) {
                            this.dataCurrent = j;
                            if (x + (current - prev) / 2 < current) {
                                this.dataCurrent--;
                            }
                            if (this.invertData) {
                                this.invertDataCurrent();
                            }
                            break;
                        }
                        prev = current;
                    }
                    break;
            }
            this.setValue(this.progressWidth);
            this.callAction();
        };
        BarClass.prototype.setValue = function (val) {
            switch (this.type) {
                case "progress":
                    this.updateBarWidth(val);
                    break;
                case "setting":
                    var per = "0";
                    // TODO: fix when last and first with this.progressSticky = true
                    if (!val || this.progressSticky) {
                        per = this.getPercent(this.dataCurrent, 0, this.dataMax);
                    }
                    else {
                        per = val.toString();
                    }
                    if (this.invertData && this.dataCurrent == this.dataMax && parseInt(per) == 100) {
                        per = "0";
                    }
                    if (this.spanInfo) {
                        this.obj.querySelector('span').textContent = this.data[this.dataCurrent];
                    }
                    this.updateBarWidth(per);
                    break;
            }
        };
        BarClass.prototype.invertDataCurrent = function () {
            if (this.dataCurrent == 0) {
                this.dataCurrent = this.dataMax;
            }
            else {
                this.dataCurrent = this.dataMax - this.dataCurrent;
            }
        };
        BarClass.prototype.updateBarWidth = function (val) {
            this.progress.setAttribute('style', 'width:' + val + '%;');
            if (this.progressSticky) {
                this.updateStickyPointState();
            }
        };
        BarClass.prototype.getX = function (e) {
            if (this.pda_state) {
                return this.getXPDA(e);
            }
            else {
                return this.getXNormal(e);
            }
        };
        BarClass.prototype.getXNormal = function (e) {
            this.progressLeft = this.progress.getBoundingClientRect().left;
            this.progressCurrentLeft = e.clientX - this.progressLeft;
            this.progressCurrentLeft = this.progressCurrentLeft < 0 ? 0 : this.progressCurrentLeft;
            return this.progressCurrentLeft;
        };
        BarClass.prototype.getXPDA = function (e) {
            if (e.type == 'click') {
                return this.getXNormal(e);
            }
            var touches = e.changedTouches || e.touches;
            return this.getXNormal(touches[0]);
        };
        BarClass.prototype.barClickHandler = function (e) {
            this.debugLog('barClickHandler');
            this.eventType = 'action_click';
            this.checkCurrentState();
            if (this.barState) {
                this.updateBar(this.getX(e));
            }
            e.stopPropagation();
        };
        BarClass.prototype.dotClickHandler = function (e) {
            var _this = this;
            this.debugLog('dotClickHandler');
            this.eventType = 'action_start';
            this.checkCurrentState();
            if (this.barState) {
                this.dotMouseClick = true;
                if (this.mouseMoveState) {
                    if (this.pda_state) {
                        this.obj.ontouchmove = function (e) { return _this.swipeHandler(e); };
                    }
                    else {
                        this.obj.onmousemove = function (e) { return _this.swipeHandler(e); };
                    }
                }
                doc.onmouseup = function (e) { return _this.swipeDone(e, true); };
                doc.ontouchend = function (e) { return _this.swipeDone(e, true); };
            }
            e.stopPropagation();
            return false;
        };
        BarClass.prototype.swipeHandler = function (e) {
            this.debugLog('swipeHandler');
            this.eventType = 'action_move';
            this.checkCurrentState();
            if (this.barState) {
                this.swipeState = true;
                this.updateBar(this.getX(e));
            }
            e.stopPropagation();
            return false;
        };
        BarClass.prototype.swipeDone = function (e, docState) {
            this.debugLog('swipeDone');
            this.eventType = 'action_end';
            this.checkCurrentState();
            if (this.barState) {
                if (this.swipeState) {
                    this.swipeState = false;
                }
                if (this.dotMouseClick) {
                    this.dotMouseClick = false;
                    if (!docState) {
                        this.updateBar(this.getX(e));
                    }
                    else {
                        this.eventType = 'action_end_doc';
                        if (this.type == 'progress') {
                            this.callAction();
                        }
                    }
                }
                doc.onmouseup = function () { };
                doc.ontouchend = function () { };
                this.obj.ontouchmove = function () { };
                this.obj.onmousemove = function () { };
            }
            e.stopPropagation();
        };
        BarClass.prototype.leftClick = function () {
            this.checkCurrentState();
            if (!this.barState || this.dataCurrent == 0) {
                return;
            }
            this.dataCurrent--;
            this.setValue();
            this.callAction();
        };
        BarClass.prototype.rightClick = function () {
            this.checkCurrentState();
            if (!this.barState || this.dataCurrent == this.dataMax) {
                return;
            }
            this.dataCurrent++;
            this.setValue();
            this.callAction();
        };
        BarClass.prototype.callAction = function () {
            if (this.callback) {
                this.callback(this.dataCurrent, this.eventType);
            }
        };
        BarClass.prototype.drawStickyPoint = function () {
            var track = this.obj.querySelector('.track');
            for (var j = 0; j <= this.dataMax; j++) {
                track.innerHTML += '<span data-pos="' + j + '" style="left:' +
                    parseFloat(this.getPercent(j, 0, this.dataMax)) + '%;"></span>';
            }
            this.stickyObjs = this.obj.querySelectorAll('.track span');
        };
        BarClass.prototype.updateStickyPointState = function () {
            for (var j = 0; j < this.stickyObjs.length; j++) {
                var span = this.stickyObjs[j];
                if (span.getAttribute('data-pos') <= this.dataCurrent) {
                    addClass(span, 'active');
                }
                else {
                    removeClass(span, 'active');
                }
            }
        };
        BarClass.prototype.checkCurrentState = function () {
            if (this.obj.getAttribute('disabled') == 'true') {
                this.barState = false;
            }
            else {
                this.barState = true;
            }
        };
        BarClass.prototype.debugLog = function (str) {
            if (this.debug) {
                console.log(str);
            }
        };
        return BarClass;
    })();
    BarClassRe.BarClass = BarClass;
})(BarClassRe || (BarClassRe = {}));
//# sourceMappingURL=BarClass.js.map