/// <reference path="../DataProvider/FB3AjaxDataProvider.ts" />
var URLparser;
(function (URLparser) {
    var URLparserClass = (function () {
        function URLparserClass() {
            this.href = decodeURIComponent(window.location.href);
            this.CheckTrial();
            this.CheckBiblio();
            this.GetUUID();
            this.GetArtID();
            this.GetBaseURL();
            this.GetSID();
            this.GetUser();
            this.GetFileID();
            this.CheckFreeBook();
            this.GetLfrom();
            this.GetPartId();
            this.GetIframe();
            this.GetModal();
        }
        URLparserClass.prototype.ArtID2URL = function (Chunk) {
            var OutURL = this.BaseURL + 'json/' ;
			// var OutURL = '/DataProvider/AjaxExample/' + this.ArtID + '.';
            if (Chunk == null) {
                OutURL += 'toc.js';
            }
            else if (Chunk.match(/\./)) {
                OutURL += Chunk;
            }
            else {
                OutURL += FB3DataProvider.zeroPad(Chunk, 3) + '.js';
            }
            return OutURL;
        };
        URLparserClass.prototype.CheckURLVal = function (index) {
            if (this.href.match(index)) {
                return true;
            }
            return false;
        };
        URLparserClass.prototype.CheckBiblio = function () {
            this.Biblio = this.CheckURLVal('buser');
        };
        URLparserClass.prototype.CheckTrial = function () {
            this.Trial = this.GetURLVal('trials=([0-1])');
        };
        URLparserClass.prototype.GetURLVal = function (regexpStr) {
            var tmp = this.href.match(new RegExp('\\b' + regexpStr + '', 'i'));
            if (tmp == null || !tmp.length) {
                return '';
            }
            return tmp[1];
        };
        URLparserClass.prototype.GetUUID = function () {
            this.UUID = this.GetURLVal('uuid=([-0-9a-z]+)');
        };
        URLparserClass.prototype.GetArtID = function () {
            this.ArtID = this.GetURLVal('art=([0-9]+)');
        };
        URLparserClass.prototype.GetBaseURL = function () {
            this.BaseURL = this.GetURLVal('baseurl=([0-9\/a-z\:\._]+)');
        };
        URLparserClass.prototype.GetUser = function () {
            this.User = 0;
            var UserTmp = this.GetURLVal('user=([0-9]+)');
            if (UserTmp != '') {
                this.User = parseInt(UserTmp);
            }
        };
        URLparserClass.prototype.GetSID = function () {
            this.SID = this.GetURLVal('sid=([0-9a-zA-Z]+)');
            if (this.SID == '') {
                var Cookies = document.cookie.match(/(?:(?:^|.*;\s*)SID\s*\=\s*([^;]*).*$)|^.*$/);
                if (Cookies.length) {
                    this.SID = Cookies[1];
                }
            }
        };
        URLparserClass.prototype.GetFileID = function () {
            this.FileID = this.GetURLVal('file=([0-9]+)');
            if (this.FileID == '') {
                if (this.BaseURL == '') {
                    return undefined;
                }
                var urlData = this.BaseURL.split('/');
                this.FileID = urlData[urlData.length - 2].replace('.', '');
            }
            this.FileID = this.lpad(this.FileID, '0', 8);
        };
        URLparserClass.prototype.lpad = function (str, padString, length) {
            while (str.length < length)
                str = padString + str;
            return str;
        };
        URLparserClass.prototype.CheckFreeBook = function () {
            this.FreeBook = this.CheckURLVal('free');
        };
        URLparserClass.prototype.GetLfrom = function () {
            this.Lfrom = 0;
            var LfromTmp = this.GetURLVal('lfrom=([0-9]+)');
            if (LfromTmp != '') {
                this.Lfrom = parseInt(LfromTmp);
            }
        };
        URLparserClass.prototype.GetPartId = function () {
            this.PartID = 0;
            var PartIDTmp = this.GetURLVal('scecpartid=([0-9]+)');
            if (PartIDTmp != '') {
                this.PartID = parseInt(PartIDTmp);
            }
        };
        URLparserClass.prototype.GetIframe = function () {
            this.Iframe = this.CheckURLVal('iframe');
        };
        URLparserClass.prototype.GetModal = function () {
            this.Modal = this.CheckURLVal('modal');
        };
        return URLparserClass;
    })();
    URLparser.URLparserClass = URLparserClass;
})(URLparser || (URLparser = {}));
//# sourceMappingURL=UrlParser.js.map