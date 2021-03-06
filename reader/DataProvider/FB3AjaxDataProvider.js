/// <reference path="FB3DataProviderHead.ts" />
var FB3DataProvider;
(function (FB3DataProvider) {
    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
    FB3DataProvider.zeroPad = zeroPad;
    var AJAXDataProvider = (function () {
        function AJAXDataProvider(LitresURL, ArtID2URL) {
            this.LitresURL = LitresURL;
            this.ArtID2URL = ArtID2URL;
            this.BaseURL = LitresURL;
            this.CurrentRequestID = 0;
            this.ActiveRequests = {};
        }
        AJAXDataProvider.prototype.Request = function (URL, Callback, Progressor, CustomData) {
            var _this = this;
            this.CurrentRequestID++;
            this.ActiveRequests['req' + this.CurrentRequestID] = Callback;
            new AjaxLoader(URL, function (ID, Data, CustomData) { return _this.CallbackWrap(ID, Data, CustomData); }, Progressor, this.CurrentRequestID, CustomData);
        };
        AJAXDataProvider.prototype.CallbackWrap = function (ID, Data, CustomData) {
            var Func = this.ActiveRequests['req' + this.CurrentRequestID];
            if (Func) {
                this.ActiveRequests['req' + this.CurrentRequestID](Data, CustomData);
            }
        };
        AJAXDataProvider.prototype.Reset = function () {
            this.ActiveRequests = {};
        };
        return AJAXDataProvider;
    })();
    FB3DataProvider.AJAXDataProvider = AJAXDataProvider;
    var AjaxLoader = (function () {
        function AjaxLoader(URL, Callback, Progressor, ID, CustomData) {
            var _this = this;
            this.URL = URL;
            this.Callback = Callback;
            this.Progressor = Progressor;
            this.ID = ID;
            this.CustomData = CustomData;
            this.xhrIE9 = false;
            this.Progressor.HourglassOn(this, false, 'Loading ' + this.URL);
            this.Req = this.HttpRequest();
            try {
                this.Req.addEventListener("progress", function (e) { return _this.onUpdateProgress(e); }, false);
                this.Req.addEventListener("error", function (e) { return _this.onTransferFailed(e); }, false);
                this.Req.addEventListener("abort", function (e) { return _this.onTransferAborted(e); }, false);
            }
            catch (e) {
                this.Req.onprogress = function () { };
                this.Req.onerror = function (e) { return _this.onTransferFailed(e); };
                this.Req.ontimeout = function (e) { return _this.onTransferAborted(e); };
            }
            this.Req.open('GET', this.URL, true);
            if (this.xhrIE9) {
                this.Req.timeout = 0;
                this.Req.onload = function () { return _this.onTransferIE9Complete(); };
                setTimeout(function () { return _this.Req.send(null); }, '200');
            }
            else {
                this.Req.onreadystatechange = function () { return _this.onTransferComplete(); };
                this.Req.send(null);
            }
        }
        AjaxLoader.prototype.onTransferComplete = function () {
            //			try {
            if (this.Req.readyState != 4) {
                this.Progressor.Tick(this);
            }
            else {
                this.Progressor.HourglassOff(this);
                if (this.Req.status == 200) {
                    this.ParseData(this.Req.responseText);
                }
                else {
                    this.Progressor.Alert('Failed to load "' + this.URL + '", server returned error "' + this.Req.status + '"');
                }
            }
            //} catch (err) {
            //	this.Progressor.HourglassOff(this);
            //	this.Progressor.Alert('Failed to load "' + this.URL + '" (unknown error "' + err.description+'")');
            //}
        };
        AjaxLoader.prototype.onTransferIE9Complete = function () {
            if (this.Req.responseText && this.Req.responseText != '') {
                this.ParseData(this.Req.responseText);
            }
            else {
                this.Progressor.Alert('Failed to load "' + this.URL + '", server returned error "NO STATUS FOR IE9"');
            }
        };
        AjaxLoader.prototype.ParseData = function (Result) {
            var _this = this;
            var Data = this.parseJSON(Result);
            var URL = this.FindRedirectInJSON(Data);
            if (URL) {
                new AjaxLoader(URL, function (ID, Data, CustomData) { return _this.Callback(ID, Data, CustomData); }, this.Progressor, this.ID, this.CustomData);
            }
            else {
                this.Callback(this.ID, Data, this.CustomData);
            }
        };
        AjaxLoader.prototype.onUpdateProgress = function (e) {
            this.Progressor.Progress(this, e.loaded / e.total * 100);
        };
        AjaxLoader.prototype.onTransferFailed = function (e) {
            this.Progressor.HourglassOff(this);
            this.Progressor.Alert('Failed to load "' + this.URL + '"');
        };
        AjaxLoader.prototype.onTransferAborted = function (e) {
            this.Progressor.HourglassOff(this);
            this.Progressor.Alert('Failed to load "' + this.URL + '" (interrupted)');
        };
        AjaxLoader.prototype.HttpRequest = function () {
            var ref = null;
            if (document.all && !window.atob && window.XDomainRequest && aldebaran_or4) {
                ref = new window.XDomainRequest(); // IE9 =< fix
                this.xhrIE9 = true;
            }
            else if (window.XMLHttpRequest) {
                ref = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
                ref = new ActiveXObject("MSXML2.XMLHTTP.3.0");
            }
            return ref;
        };
        AjaxLoader.prototype.FindRedirectInJSON = function (data) {
            if (data && data.url) {
                return data.url;
            }
            return undefined;
        };
        AjaxLoader.prototype.parseJSON = function (data) {
            data = data.replace(/^\n/, ''); // aldebaran json workaround
            // Borrowed bits from JQuery & http://json.org/json2.js
            if (data === undefined || data == '') {
                return null;
            }
            // trim for IE
            //data = data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            // Attempt to parse using the native JSON parser first
            //if (window.JSON && window.JSON.parse) {
            //	return window.JSON.parse(data);
            //}
            // Make sure the incoming data is actual JSON
            //if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            //	.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
            //	.replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            //	return (new Function("return " + data))();
            //}
            //this.Progressor.Alert("Invalid JSON");
            // all shis safe and pretty stuff is nice, but I stick to simple
            var Data = (new Function("return " + data))();
            return Data;
        };
        return AjaxLoader;
    })();
})(FB3DataProvider || (FB3DataProvider = {}));
//# sourceMappingURL=FB3AjaxDataProvider.js.map