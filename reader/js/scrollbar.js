/* [37228] Стилизованный кроссбраузерный скроллбар */
var scrollbar = function(node, settings){
	var self = this;
	self.node = node;
	self.config = {
		wrapper: 'scrollwrapper',
		scroller: 'scroller',
		scrollarea: 'scrollarea',
		content: 'scrollbar',
		show: false,
		scrollbar_parent: 'scrollbar_parent',
		scrollPage: false
	}
	self.extend = function(a,b) {
		for(var key in b)
		if (b.hasOwnProperty(key))
			a[key] = b[key];
		return a;
	}
	self.classList = (function () {
		 if ("classList" in document.createElement("div")) {
			return {
				add: function (el, el_class) {
					el.classList.add(el_class);
				},
				remove: function (el, el_class) {
					el.classList.remove(el_class);
				}
			}
		} else {
			return {
				add: function (el, el_class) {
					el.className += ' ' + el_class;
				},
				remove: function (el, el_class) {
					el.className = (' ' + el.className + ' ').replace(' ' + el_class + ' ', ' ');
				}
			};
		}
	})();
	self.addEvent = function(el, e, f){
		if (el.attachEvent) {
			return el.attachEvent('on'+e, f);
		} else {
			return el.addEventListener(e, f, false);
		}
	}
	self.config = self.extend(self.config,settings);
	self.init();
	
}

scrollbar.prototype = {
	init: function(){
		var self = this;
		self.render();
		self.refresh();
		
		/* init events */
		self.canDrag = false,
		self.scrollshow = false,
		self.scrollHover = false;
		
		self.node.onmouseover = function(event){self.refresh()};
		self.addEvent(self.scroller, 'mousedown', function(event){self.drag(event)});
		self.addEvent(window, 'mousemove', function(event){self.move(event)});
		self.addEvent(window, 'mouseup', function(event){self.drop(event)});
		self.addEvent(self.node, 'touchmove', function(event){self.touchmove(event)});
		self.addEvent(self.node, 'touchstart', function(event){self.touchstart(event)});
		
		/* mouse wheel */
		if (self.wrapper.addEventListener) // ff
			self.wrapper.addEventListener('DOMMouseScroll', function(event){self.wheel(event)}, false);
		// other
		self.wrapper.onmousewheel = function(event){self.wheel(event)};
		
		self.addEvent(self.scrollarea, 'mousedown', function(event){self.areaclick(event)});
		
		// fadein fadeout
		if (!self.config.show) {
			self.addEvent(self.scrollarea, 'mouseover', function(event){self.fadeIn(true)});
			self.addEvent(self.scroller, 'mouseover', function() {self.fadeIn(true)});
			self.addEvent(self.scrollarea, 'mouseout', function(){self.ScrollFade(true)});
			self.addEvent(self.scroller, 'mouseout', function(){self.ScrollFade(true)});
			self.addEvent(window, 'mouseout', function(){self.ScrollFade(true)});
		}
	},
	getNode: function(){
		var self = this;
		return self.node;
	},
	render: function(){
		var self = this,
			wrapper, scroller, scrollarea;
		if (!(self.node.parentNode.className.split(' ').indexOf(self.config.wrapper) != -1)) {
			wrapper = document.createElement('div');
			scroller = document.createElement('div');
			scrollarea = document.createElement('div');
			self.classList.add(self.node, self.config.content);
			wrapper.className = self.config.wrapper;
			self.node.parentNode.insertBefore(wrapper, self.node.nextSibling);
			wrapper.appendChild(self.node);
			scrollarea.className = self.config.scrollarea;
			scroller.className = self.config.scroller;
			wrapper.appendChild(scrollarea).appendChild(scroller);
			wrapper.style.width = self.node.offsetWidth + 'px';
			wrapper.style.height = (self.node.className.split(' ').indexOf(self.config.scrollbar_parent) != -1) ? '100%' :  self.node.offsetHeight+ 'px' ;
			self.node.style.width = self.node.style.height = 'auto';
		} else {
			wrapper = self.node.parentNode;
			scrollarea = self.node.nextSibling;
			scroller = scrollarea.firstChild;
		}
		if (!self.config.show) self.scrollOpacity = scrollarea.style.opacity = 0;
		self.wrapper = wrapper;
		self.scroller = scroller;
		self.scrollarea = scrollarea;
		self.fadeInterval = null;
	},
	refresh: function(){
		var self = this;
		self.scroller.style.height = (self.scrollarea.offsetHeight > self.node.offsetHeight) ? self.scrollarea.offsetHeight : Math.round( (self.scrollarea.offsetHeight * self.scrollarea.offsetHeight) / self.node.offsetHeight ) + 'px';
		self.delta = self.node.offsetHeight / self.scrollarea.offsetHeight;
		if (self.wrapper.offsetHeight >= self.node.offsetHeight) {
			self.scrollarea.style.display = 'none';
			self.node.style.top = 0;
		} else {
			self.scrollarea.style.display = 'block';
		}
	},
	drop: function(event){
		var self = this;
		event = event || window.event;
		self.canDrag = false;
		if (!self.config.show) self.ScrollFade(false);
	},
	move: function(event){
		var self = this;
		event = event || window.event;
		self.refresh();
		if (self.canDrag) {
			self.setPosition(event.clientY - self.shift_y);
			self.blockEvent(event);
			self.scrollshow = true;
		}
		return false;
	},
	setPosition: function(newPosition) {
		var self = this;
		if ( (newPosition <= self.scrollarea.offsetHeight - self.scroller.offsetHeight) && (newPosition >= 0) )
			self.scroller.style.top = newPosition + "px";
		else if (newPosition > self.scrollarea.offsetHeight - self.scroller.offsetHeight)
			self.scroller.style.top = self.scrollarea.offsetHeight - self.scroller.offsetHeight + "px";
		else
			self.scroller.style.top = 0 + "px";
		self.node.style.top = Math.round( parseInt(self.scroller.style.top)  * self.delta * (-1) ) + "px";
		return false;
	},
	setPositionForce: function (state) {
		var self = this;
		var top = 0;
		switch (state) {
			case "top":
				top = 0;
				break;
			case "bottom":
				top = 0;
				break;
		}
		self.scroller.style.top = top + "px";
		self.node.style.top = top + "px";
		return false;
	},
	blockEvent: function(event) {
		var self = this;
		event = event || window.event;
		if(event.stopPropagation) event.stopPropagation();
		else event.cancelBubble = true;
		if(event.preventDefault) event.preventDefault();
		else event.returnValue = false;
	},
	drag: function(event) {
		var self = this;
		event = event || window.event;
		self.canDrag = true;
		self.shift_y = event.clientY - parseInt(self.scroller.offsetTop);
		if (!self.config.show) self.fadeIn(false);
		self.blockEvent(event);
		return false;
	},
	touchmove: function(event) {
		var self = this;
		self.refresh();
		event = event || window.event;
		var touch = event.touches[0].pageY,
			newPosition = self.ts + (self.ts_y - touch)/self.delta;
		self.setPosition(newPosition);
		if (!self.config.show) self.fadeIn(false);
		self.blockEvent(event);
		return false;
	},
	touchstart: function(event) {
		var self = this;
		event = event || window.event;
		self.ts = parseInt(self.scroller.offsetTop);
		self.ts_y = event.touches[0].pageY;
		if (event.type == "touchstart") {
		   return true; 
		} else {
			event.preventDefault();
		}
	},
	wheel: function(event) {
		var self = this;
		self.refresh();
		event = event || window.event;
		var wheelDelta = 0;
		var step = 15;
		if (event.wheelDelta)
			wheelDelta = event.wheelDelta/120;
		else if (event.detail)
			wheelDelta = -event.detail/3;
		if (wheelDelta) {
			var currentPosition = parseInt(self.scroller.style.top);
			var newPosition = currentPosition - wheelDelta*step;
			self.setPosition(newPosition);
		}
		if (!self.config.show) self.fadeIn(false);
		if (!((self.scroller.offsetTop == 0 || self.scroller.offsetTop  == self.scrollarea.offsetHeight - self.scroller.offsetHeight) && self.config.scrollPage)) {
			if (event.preventDefault)
			event.preventDefault();
			event.returnValue = false;
			self.blockEvent(event);
		}
	},
	areaclick: function(event) {
		var self = this;
		event = event || window.event;
		self.shift_y = event.clientY - self.scrollarea.getBoundingClientRect().top - self.scroller.offsetHeight/2;
		self.setPosition(self.shift_y);
		if (!self.config.show) self.ScrollFade(false);
		self.blockEvent(event);
		return false;
	},
	fadeIn: function(scrollhover) {
		var self = this;
		self.scrollshow = true;
		if (scrollhover) self.scrollHover = true;
		self.scrollOpacity += 0.1;
		self.scrollarea.style.opacity = self.scrollOpacity;
		if(self.scrollOpacity > 0.9) {
			self.scrollarea.style.opacity = 1;
			if (!self.scrollHover) setTimeout(function(){self.ScrollFade(false)},500);
		} else {
			setTimeout(function(){self.fadeIn(false)}, 50);
		}
	},
	fadeOut: function() {
		var self = this;
		if (!self.scrollshow) {
			self.scrollOpacity -= 0.1;
			self.scrollarea.style.opacity = self.scrollOpacity;
			if(self.scrollOpacity < 0.2) {
				self.scrollarea.style.opacity = 0.0;
			} else {
				setTimeout(function(){self.fadeOut()}, 100);
			}
		}
	},
	ScrollFade: function(scrollhover) {
		var self = this;
		self.scrollshow = false;
		if (scrollhover) self.scrollHover = false;
		if (!self.scrollHover) {
			clearInterval(self.fadeInterval);
			self.fadeInterval = setTimeout(function(){self.fadeOut()}, 3000);
		}
	},
	Destroy: function(self) {
		self = self || this;
		if ((self.node.className.split(' ').indexOf(self.config.scrollbar_parent) != -1) && (self.node.parentNode.className.split(' ').indexOf(self.config.wrapper) != -1)) {
			self.classList.remove(self.node, self.config.content);
			self.node.parentNode.removeChild(self.node.parentNode.querySelector('.'+self.config.scrollarea));
			var fragment = document.createDocumentFragment();
			var cont = self.node.parentNode.parentNode;
			fragment.appendChild(self.node);
			cont.replaceChild(fragment, self.wrapper);
		}
	}
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}