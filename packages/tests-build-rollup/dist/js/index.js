(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}(function () { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var mithril = createCommonjsModule(function (module) {
	(function() {
	function Vnode(tag, key, attrs0, children, text, dom) {
		return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
	}
	Vnode.normalize = function(node) {
		if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
		if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
		return node
	};
	Vnode.normalizeChildren = function normalizeChildren(children) {
		for (var i = 0; i < children.length; i++) {
			children[i] = Vnode.normalize(children[i]);
		}
		return children
	};
	var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
	var selectorCache = {};
	var hasOwn = {}.hasOwnProperty;
	function isEmpty(object) {
		for (var key in object) if (hasOwn.call(object, key)) return false
		return true
	}
	function compileSelector(selector) {
		var match, tag = "div", classes = [], attrs = {};
		while (match = selectorParser.exec(selector)) {
			var type = match[1], value = match[2];
			if (type === "" && value !== "") tag = value;
			else if (type === "#") attrs.id = value;
			else if (type === ".") classes.push(value);
			else if (match[3][0] === "[") {
				var attrValue = match[6];
				if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
				if (match[4] === "class") classes.push(attrValue);
				else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true;
			}
		}
		if (classes.length > 0) attrs.className = classes.join(" ");
		return selectorCache[selector] = {tag: tag, attrs: attrs}
	}
	function execSelector(state, attrs, children) {
		var hasAttrs = false, childList, text;
		var className = attrs.className || attrs.class;
		if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
			var newAttrs = {};
			for(var key in attrs) {
				if (hasOwn.call(attrs, key)) {
					newAttrs[key] = attrs[key];
				}
			}
			attrs = newAttrs;
		}
		for (var key in state.attrs) {
			if (hasOwn.call(state.attrs, key)) {
				attrs[key] = state.attrs[key];
			}
		}
		if (className !== undefined) {
			if (attrs.class !== undefined) {
				attrs.class = undefined;
				attrs.className = className;
			}
			if (state.attrs.className != null) {
				attrs.className = state.attrs.className + " " + className;
			}
		}
		for (var key in attrs) {
			if (hasOwn.call(attrs, key) && key !== "key") {
				hasAttrs = true;
				break
			}
		}
		if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
			text = children[0].children;
		} else {
			childList = children;
		}
		return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
	}
	function hyperscript(selector) {
		// Because sloppy mode sucks
		var attrs = arguments[1], start = 2, children;
		if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
			throw Error("The selector must be either a string or a component.");
		}
		if (typeof selector === "string") {
			var cached = selectorCache[selector] || compileSelector(selector);
		}
		if (attrs == null) {
			attrs = {};
		} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
			attrs = {};
			start = 1;
		}
		if (arguments.length === start + 1) {
			children = arguments[start];
			if (!Array.isArray(children)) children = [children];
		} else {
			children = [];
			while (start < arguments.length) children.push(arguments[start++]);
		}
		var normalized = Vnode.normalizeChildren(children);
		if (typeof selector === "string") {
			return execSelector(cached, attrs, normalized)
		} else {
			return Vnode(selector, attrs.key, attrs, normalized)
		}
	}
	hyperscript.trust = function(html) {
		if (html == null) html = "";
		return Vnode("<", undefined, undefined, html, undefined, undefined)
	};
	hyperscript.fragment = function(attrs1, children) {
		return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
	};
	var m = hyperscript;
	/** @constructor */
	var PromisePolyfill = function(executor) {
		if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
		if (typeof executor !== "function") throw new TypeError("executor must be a function")
		var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false);
		var instance = self._instance = {resolvers: resolvers, rejectors: rejectors};
		var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
		function handler(list, shouldAbsorb) {
			return function execute(value) {
				var then;
				try {
					if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
						if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
						executeOnce(then.bind(value));
					}
					else {
						callAsync(function() {
							if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value);
							for (var i = 0; i < list.length; i++) list[i](value);
							resolvers.length = 0, rejectors.length = 0;
							instance.state = shouldAbsorb;
							instance.retry = function() {execute(value);};
						});
					}
				}
				catch (e) {
					rejectCurrent(e);
				}
			}
		}
		function executeOnce(then) {
			var runs = 0;
			function run(fn) {
				return function(value) {
					if (runs++ > 0) return
					fn(value);
				}
			}
			var onerror = run(rejectCurrent);
			try {then(run(resolveCurrent), onerror);} catch (e) {onerror(e);}
		}
		executeOnce(executor);
	};
	PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
		var self = this, instance = self._instance;
		function handle(callback, list, next, state) {
			list.push(function(value) {
				if (typeof callback !== "function") next(value);
				else try {resolveNext(callback(value));} catch (e) {if (rejectNext) rejectNext(e);}
			});
			if (typeof instance.retry === "function" && state === instance.state) instance.retry();
		}
		var resolveNext, rejectNext;
		var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject;});
		handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
		return promise
	};
	PromisePolyfill.prototype.catch = function(onRejection) {
		return this.then(null, onRejection)
	};
	PromisePolyfill.resolve = function(value) {
		if (value instanceof PromisePolyfill) return value
		return new PromisePolyfill(function(resolve) {resolve(value);})
	};
	PromisePolyfill.reject = function(value) {
		return new PromisePolyfill(function(resolve, reject) {reject(value);})
	};
	PromisePolyfill.all = function(list) {
		return new PromisePolyfill(function(resolve, reject) {
			var total = list.length, count = 0, values = [];
			if (list.length === 0) resolve([]);
			else for (var i = 0; i < list.length; i++) {
				(function(i) {
					function consume(value) {
						count++;
						values[i] = value;
						if (count === total) resolve(values);
					}
					if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
						list[i].then(consume, reject);
					}
					else consume(list[i]);
				})(i);
			}
		})
	};
	PromisePolyfill.race = function(list) {
		return new PromisePolyfill(function(resolve, reject) {
			for (var i = 0; i < list.length; i++) {
				list[i].then(resolve, reject);
			}
		})
	};
	if (typeof window !== "undefined") {
		if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill;
		var PromisePolyfill = window.Promise;
	} else if (typeof commonjsGlobal !== "undefined") {
		if (typeof commonjsGlobal.Promise === "undefined") commonjsGlobal.Promise = PromisePolyfill;
		var PromisePolyfill = commonjsGlobal.Promise;
	}
	var buildQueryString = function(object) {
		if (Object.prototype.toString.call(object) !== "[object Object]") return ""
		var args = [];
		for (var key0 in object) {
			destructure(key0, object[key0]);
		}
		return args.join("&")
		function destructure(key0, value) {
			if (Array.isArray(value)) {
				for (var i = 0; i < value.length; i++) {
					destructure(key0 + "[" + i + "]", value[i]);
				}
			}
			else if (Object.prototype.toString.call(value) === "[object Object]") {
				for (var i in value) {
					destructure(key0 + "[" + i + "]", value[i]);
				}
			}
			else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""));
		}
	};
	var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i");
	var _8 = function($window, Promise) {
		var callbackCount = 0;
		var oncompletion;
		function setCompletionCallback(callback) {oncompletion = callback;}
		function finalizer() {
			var count = 0;
			function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion();}
			return function finalize(promise0) {
				var then0 = promise0.then;
				promise0.then = function() {
					count++;
					var next = then0.apply(promise0, arguments);
					next.then(complete, function(e) {
						complete();
						if (count === 0) throw e
					});
					return finalize(next)
				};
				return promise0
			}
		}
		function normalize(args, extra) {
			if (typeof args === "string") {
				var url = args;
				args = extra || {};
				if (args.url == null) args.url = url;
			}
			return args
		}
		function request(args, extra) {
			var finalize = finalizer();
			args = normalize(args, extra);
			var promise0 = new Promise(function(resolve, reject) {
				if (args.method == null) args.method = "GET";
				args.method = args.method.toUpperCase();
				var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true);
				if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify;
				if (typeof args.deserialize !== "function") args.deserialize = deserialize;
				if (typeof args.extract !== "function") args.extract = extract;
				args.url = interpolate(args.url, args.data);
				if (useBody) args.data = args.serialize(args.data);
				else args.url = assemble(args.url, args.data);
				var xhr = new $window.XMLHttpRequest(),
					aborted = false,
					_abort = xhr.abort;
				xhr.abort = function abort() {
					aborted = true;
					_abort.call(xhr);
				};
				xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined);
				if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				}
				if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
					xhr.setRequestHeader("Accept", "application/json, text/*");
				}
				if (args.withCredentials) xhr.withCredentials = args.withCredentials;
				for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
					xhr.setRequestHeader(key, args.headers[key]);
				}
				if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr;
				xhr.onreadystatechange = function() {
					// Don't throw errors on xhr.abort().
					if(aborted) return
					if (xhr.readyState === 4) {
						try {
							var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args));
							if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
								resolve(cast(args.type, response));
							}
							else {
								var error = new Error(xhr.responseText);
								for (var key in response) error[key] = response[key];
								reject(error);
							}
						}
						catch (e) {
							reject(e);
						}
					}
				};
				if (useBody && (args.data != null)) xhr.send(args.data);
				else xhr.send();
			});
			return args.background === true ? promise0 : finalize(promise0)
		}
		function jsonp(args, extra) {
			var finalize = finalizer();
			args = normalize(args, extra);
			var promise0 = new Promise(function(resolve, reject) {
				var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++;
				var script = $window.document.createElement("script");
				$window[callbackName] = function(data) {
					script.parentNode.removeChild(script);
					resolve(cast(args.type, data));
					delete $window[callbackName];
				};
				script.onerror = function() {
					script.parentNode.removeChild(script);
					reject(new Error("JSONP request failed"));
					delete $window[callbackName];
				};
				if (args.data == null) args.data = {};
				args.url = interpolate(args.url, args.data);
				args.data[args.callbackKey || "callback"] = callbackName;
				script.src = assemble(args.url, args.data);
				$window.document.documentElement.appendChild(script);
			});
			return args.background === true? promise0 : finalize(promise0)
		}
		function interpolate(url, data) {
			if (data == null) return url
			var tokens = url.match(/:[^\/]+/gi) || [];
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				if (data[key] != null) {
					url = url.replace(tokens[i], data[key]);
				}
			}
			return url
		}
		function assemble(url, data) {
			var querystring = buildQueryString(data);
			if (querystring !== "") {
				var prefix = url.indexOf("?") < 0 ? "?" : "&";
				url += prefix + querystring;
			}
			return url
		}
		function deserialize(data) {
			try {return data !== "" ? JSON.parse(data) : null}
			catch (e) {throw new Error(data)}
		}
		function extract(xhr) {return xhr.responseText}
		function cast(type0, data) {
			if (typeof type0 === "function") {
				if (Array.isArray(data)) {
					for (var i = 0; i < data.length; i++) {
						data[i] = new type0(data[i]);
					}
				}
				else return new type0(data)
			}
			return data
		}
		return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
	};
	var requestService = _8(window, PromisePolyfill);
	var coreRenderer = function($window) {
		var $doc = $window.document;
		var $emptyFragment = $doc.createDocumentFragment();
		var nameSpace = {
			svg: "http://www.w3.org/2000/svg",
			math: "http://www.w3.org/1998/Math/MathML"
		};
		var onevent;
		function setEventCallback(callback) {return onevent = callback}
		function getNameSpace(vnode) {
			return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
		}
		//create
		function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
			for (var i = start; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					createNode(parent, vnode, hooks, ns, nextSibling);
				}
			}
		}
		function createNode(parent, vnode, hooks, ns, nextSibling) {
			var tag = vnode.tag;
			if (typeof tag === "string") {
				vnode.state = {};
				if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
				switch (tag) {
					case "#": return createText(parent, vnode, nextSibling)
					case "<": return createHTML(parent, vnode, nextSibling)
					case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
					default: return createElement(parent, vnode, hooks, ns, nextSibling)
				}
			}
			else return createComponent(parent, vnode, hooks, ns, nextSibling)
		}
		function createText(parent, vnode, nextSibling) {
			vnode.dom = $doc.createTextNode(vnode.children);
			insertNode(parent, vnode.dom, nextSibling);
			return vnode.dom
		}
		function createHTML(parent, vnode, nextSibling) {
			var match1 = vnode.children.match(/^\s*?<(\w+)/im) || [];
			var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div";
			var temp = $doc.createElement(parent1);
			temp.innerHTML = vnode.children;
			vnode.dom = temp.firstChild;
			vnode.domSize = temp.childNodes.length;
			var fragment = $doc.createDocumentFragment();
			var child;
			while (child = temp.firstChild) {
				fragment.appendChild(child);
			}
			insertNode(parent, fragment, nextSibling);
			return fragment
		}
		function createFragment(parent, vnode, hooks, ns, nextSibling) {
			var fragment = $doc.createDocumentFragment();
			if (vnode.children != null) {
				var children = vnode.children;
				createNodes(fragment, children, 0, children.length, hooks, null, ns);
			}
			vnode.dom = fragment.firstChild;
			vnode.domSize = fragment.childNodes.length;
			insertNode(parent, fragment, nextSibling);
			return fragment
		}
		function createElement(parent, vnode, hooks, ns, nextSibling) {
			var tag = vnode.tag;
			var attrs2 = vnode.attrs;
			var is = attrs2 && attrs2.is;
			ns = getNameSpace(vnode) || ns;
			var element = ns ?
				is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
				is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag);
			vnode.dom = element;
			if (attrs2 != null) {
				setAttrs(vnode, attrs2, ns);
			}
			insertNode(parent, element, nextSibling);
			if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
				setContentEditable(vnode);
			}
			else {
				if (vnode.text != null) {
					if (vnode.text !== "") element.textContent = vnode.text;
					else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)];
				}
				if (vnode.children != null) {
					var children = vnode.children;
					createNodes(element, children, 0, children.length, hooks, null, ns);
					setLateAttrs(vnode);
				}
			}
			return element
		}
		function initComponent(vnode, hooks) {
			var sentinel;
			if (typeof vnode.tag.view === "function") {
				vnode.state = Object.create(vnode.tag);
				sentinel = vnode.state.view;
				if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
				sentinel.$$reentrantLock$$ = true;
			} else {
				vnode.state = void 0;
				sentinel = vnode.tag;
				if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
				sentinel.$$reentrantLock$$ = true;
				vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode);
			}
			vnode._state = vnode.state;
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
			initLifecycle(vnode._state, vnode, hooks);
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode));
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			sentinel.$$reentrantLock$$ = null;
		}
		function createComponent(parent, vnode, hooks, ns, nextSibling) {
			initComponent(vnode, hooks);
			if (vnode.instance != null) {
				var element = createNode(parent, vnode.instance, hooks, ns, nextSibling);
				vnode.dom = vnode.instance.dom;
				vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0;
				insertNode(parent, element, nextSibling);
				return element
			}
			else {
				vnode.domSize = 0;
				return $emptyFragment
			}
		}
		//update
		function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
			if (old === vnodes || old == null && vnodes == null) return
			else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns);
			else if (vnodes == null) removeNodes(old, 0, old.length, vnodes);
			else {
				if (old.length === vnodes.length) {
					var isUnkeyed = false;
					for (var i = 0; i < vnodes.length; i++) {
						if (vnodes[i] != null && old[i] != null) {
							isUnkeyed = vnodes[i].key == null && old[i].key == null;
							break
						}
					}
					if (isUnkeyed) {
						for (var i = 0; i < old.length; i++) {
							if (old[i] === vnodes[i]) continue
							else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling));
							else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes);
							else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns);
						}
						return
					}
				}
				recycling = recycling || isRecyclable(old, vnodes);
				if (recycling) {
					var pool = old.pool;
					old = old.concat(old.pool);
				}
				var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map;
				while (oldEnd >= oldStart && end >= start) {
					var o = old[oldStart], v = vnodes[start];
					if (o === v && !recycling) oldStart++, start++;
					else if (o == null) oldStart++;
					else if (v == null) start++;
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling);
						oldStart++, start++;
						updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns);
						if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling);
					}
					else {
						var o = old[oldEnd];
						if (o === v && !recycling) oldEnd--, start++;
						else if (o == null) oldEnd--;
						else if (v == null) start++;
						else if (o.key === v.key) {
							var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling);
							updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns);
							if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling));
							oldEnd--, start++;
						}
						else break
					}
				}
				while (oldEnd >= oldStart && end >= start) {
					var o = old[oldEnd], v = vnodes[end];
					if (o === v && !recycling) oldEnd--, end--;
					else if (o == null) oldEnd--;
					else if (v == null) end--;
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling);
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns);
						if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling);
						if (o.dom != null) nextSibling = o.dom;
						oldEnd--, end--;
					}
					else {
						if (!map) map = getKeyMap(old, oldEnd);
						if (v != null) {
							var oldIndex = map[v.key];
							if (oldIndex != null) {
								var movable = old[oldIndex];
								var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling);
								updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns);
								insertNode(parent, toFragment(movable), nextSibling);
								old[oldIndex].skip = true;
								if (movable.dom != null) nextSibling = movable.dom;
							}
							else {
								var dom = createNode(parent, v, hooks, ns, nextSibling);
								nextSibling = dom;
							}
						}
						end--;
					}
					if (end < start) break
				}
				createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
				removeNodes(old, oldStart, oldEnd + 1, vnodes);
			}
		}
		function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
			var oldTag = old.tag, tag = vnode.tag;
			if (oldTag === tag) {
				vnode.state = old.state;
				vnode._state = old._state;
				vnode.events = old.events;
				if (!recycling && shouldNotUpdate(vnode, old)) return
				if (typeof oldTag === "string") {
					if (vnode.attrs != null) {
						if (recycling) {
							vnode.state = {};
							initLifecycle(vnode.attrs, vnode, hooks);
						}
						else updateLifecycle(vnode.attrs, vnode, hooks);
					}
					switch (oldTag) {
						case "#": updateText(old, vnode); break
						case "<": updateHTML(parent, old, vnode, nextSibling); break
						case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
						default: updateElement(old, vnode, recycling, hooks, ns);
					}
				}
				else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns);
			}
			else {
				removeNode(old, null);
				createNode(parent, vnode, hooks, ns, nextSibling);
			}
		}
		function updateText(old, vnode) {
			if (old.children.toString() !== vnode.children.toString()) {
				old.dom.nodeValue = vnode.children;
			}
			vnode.dom = old.dom;
		}
		function updateHTML(parent, old, vnode, nextSibling) {
			if (old.children !== vnode.children) {
				toFragment(old);
				createHTML(parent, vnode, nextSibling);
			}
			else vnode.dom = old.dom, vnode.domSize = old.domSize;
		}
		function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
			updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns);
			var domSize = 0, children = vnode.children;
			vnode.dom = null;
			if (children != null) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					if (child != null && child.dom != null) {
						if (vnode.dom == null) vnode.dom = child.dom;
						domSize += child.domSize || 1;
					}
				}
				if (domSize !== 1) vnode.domSize = domSize;
			}
		}
		function updateElement(old, vnode, recycling, hooks, ns) {
			var element = vnode.dom = old.dom;
			ns = getNameSpace(vnode) || ns;
			if (vnode.tag === "textarea") {
				if (vnode.attrs == null) vnode.attrs = {};
				if (vnode.text != null) {
					vnode.attrs.value = vnode.text; //FIXME handle0 multiple children
					vnode.text = undefined;
				}
			}
			updateAttrs(vnode, old.attrs, vnode.attrs, ns);
			if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
				setContentEditable(vnode);
			}
			else if (old.text != null && vnode.text != null && vnode.text !== "") {
				if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text;
			}
			else {
				if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)];
				if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)];
				updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns);
			}
		}
		function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
			if (recycling) {
				initComponent(vnode, hooks);
			} else {
				vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode));
				if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
				if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks);
				updateLifecycle(vnode._state, vnode, hooks);
			}
			if (vnode.instance != null) {
				if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling);
				else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns);
				vnode.dom = vnode.instance.dom;
				vnode.domSize = vnode.instance.domSize;
			}
			else if (old.instance != null) {
				removeNode(old.instance, null);
				vnode.dom = undefined;
				vnode.domSize = 0;
			}
			else {
				vnode.dom = old.dom;
				vnode.domSize = old.domSize;
			}
		}
		function isRecyclable(old, vnodes) {
			if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
				var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0;
				var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0;
				var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0;
				if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
					return true
				}
			}
			return false
		}
		function getKeyMap(vnodes, end) {
			var map = {}, i = 0;
			for (var i = 0; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					var key2 = vnode.key;
					if (key2 != null) map[key2] = i;
				}
			}
			return map
		}
		function toFragment(vnode) {
			var count0 = vnode.domSize;
			if (count0 != null || vnode.dom == null) {
				var fragment = $doc.createDocumentFragment();
				if (count0 > 0) {
					var dom = vnode.dom;
					while (--count0) fragment.appendChild(dom.nextSibling);
					fragment.insertBefore(dom, fragment.firstChild);
				}
				return fragment
			}
			else return vnode.dom
		}
		function getNextSibling(vnodes, i, nextSibling) {
			for (; i < vnodes.length; i++) {
				if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
			}
			return nextSibling
		}
		function insertNode(parent, dom, nextSibling) {
			if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling);
			else parent.appendChild(dom);
		}
		function setContentEditable(vnode) {
			var children = vnode.children;
			if (children != null && children.length === 1 && children[0].tag === "<") {
				var content = children[0].children;
				if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content;
			}
			else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
		}
		//remove
		function removeNodes(vnodes, start, end, context) {
			for (var i = start; i < end; i++) {
				var vnode = vnodes[i];
				if (vnode != null) {
					if (vnode.skip) vnode.skip = false;
					else removeNode(vnode, context);
				}
			}
		}
		function removeNode(vnode, context) {
			var expected = 1, called = 0;
			if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
				var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode);
				if (result != null && typeof result.then === "function") {
					expected++;
					result.then(continuation, continuation);
				}
			}
			if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
				var result = vnode._state.onbeforeremove.call(vnode.state, vnode);
				if (result != null && typeof result.then === "function") {
					expected++;
					result.then(continuation, continuation);
				}
			}
			continuation();
			function continuation() {
				if (++called === expected) {
					onremove(vnode);
					if (vnode.dom) {
						var count0 = vnode.domSize || 1;
						if (count0 > 1) {
							var dom = vnode.dom;
							while (--count0) {
								removeNodeFromDOM(dom.nextSibling);
							}
						}
						removeNodeFromDOM(vnode.dom);
						if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
							if (!context.pool) context.pool = [vnode];
							else context.pool.push(vnode);
						}
					}
				}
			}
		}
		function removeNodeFromDOM(node) {
			var parent = node.parentNode;
			if (parent != null) parent.removeChild(node);
		}
		function onremove(vnode) {
			if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode);
			if (typeof vnode.tag !== "string") {
				if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode);
				if (vnode.instance != null) onremove(vnode.instance);
			} else {
				var children = vnode.children;
				if (Array.isArray(children)) {
					for (var i = 0; i < children.length; i++) {
						var child = children[i];
						if (child != null) onremove(child);
					}
				}
			}
		}
		//attrs2
		function setAttrs(vnode, attrs2, ns) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, null, attrs2[key2], ns);
			}
		}
		function setAttr(vnode, key2, old, value, ns) {
			var element = vnode.dom;
			if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
			var nsLastIndex = key2.indexOf(":");
			if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
				element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value);
			}
			else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value);
			else if (key2 === "style") updateStyle(element, old, value);
			else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
				if (key2 === "value") {
					var normalized0 = "" + value; // eslint-disable-line no-implicit-coercion
					//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
					if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					//setting select[value] to same value while having select open blinks select dropdown in Chrome
					if (vnode.tag === "select") {
						if (value === null) {
							if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
						} else {
							if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
						}
					}
					//setting option[value] to same value while having select open blinks select dropdown in Chrome
					if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
				}
				// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
				if (vnode.tag === "input" && key2 === "type") {
					element.setAttribute(key2, value);
					return
				}
				element[key2] = value;
			}
			else {
				if (typeof value === "boolean") {
					if (value) element.setAttribute(key2, "");
					else element.removeAttribute(key2);
				}
				else element.setAttribute(key2 === "className" ? "class" : key2, value);
			}
		}
		function setLateAttrs(vnode) {
			var attrs2 = vnode.attrs;
			if (vnode.tag === "select" && attrs2 != null) {
				if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined);
				if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined);
			}
		}
		function updateAttrs(vnode, old, attrs2, ns) {
			if (attrs2 != null) {
				for (var key2 in attrs2) {
					setAttr(vnode, key2, old && old[key2], attrs2[key2], ns);
				}
			}
			if (old != null) {
				for (var key2 in old) {
					if (attrs2 == null || !(key2 in attrs2)) {
						if (key2 === "className") key2 = "class";
						if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined);
						else if (key2 !== "key") vnode.dom.removeAttribute(key2);
					}
				}
			}
		}
		function isFormAttribute(vnode, attr) {
			return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
		}
		function isLifecycleMethod(attr) {
			return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
		}
		function isAttribute(attr) {
			return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
		}
		function isCustomElement(vnode){
			return vnode.attrs.is || vnode.tag.indexOf("-") > -1
		}
		function hasIntegrationMethods(source) {
			return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
		}
		//style
		function updateStyle(element, old, style) {
			if (old === style) element.style.cssText = "", old = null;
			if (style == null) element.style.cssText = "";
			else if (typeof style === "string") element.style.cssText = style;
			else {
				if (typeof old === "string") element.style.cssText = "";
				for (var key2 in style) {
					element.style[key2] = style[key2];
				}
				if (old != null && typeof old !== "string") {
					for (var key2 in old) {
						if (!(key2 in style)) element.style[key2] = "";
					}
				}
			}
		}
		//event
		function updateEvent(vnode, key2, value) {
			var element = vnode.dom;
			var callback = typeof onevent !== "function" ? value : function(e) {
				var result = value.call(element, e);
				onevent.call(element, e);
				return result
			};
			if (key2 in element) element[key2] = typeof value === "function" ? callback : null;
			else {
				var eventName = key2.slice(2);
				if (vnode.events === undefined) vnode.events = {};
				if (vnode.events[key2] === callback) return
				if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false);
				if (typeof value === "function") {
					vnode.events[key2] = callback;
					element.addEventListener(eventName, vnode.events[key2], false);
				}
			}
		}
		//lifecycle
		function initLifecycle(source, vnode, hooks) {
			if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode);
			if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode));
		}
		function updateLifecycle(source, vnode, hooks) {
			if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode));
		}
		function shouldNotUpdate(vnode, old) {
			var forceVnodeUpdate, forceComponentUpdate;
			if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old);
			if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old);
			if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
				vnode.dom = old.dom;
				vnode.domSize = old.domSize;
				vnode.instance = old.instance;
				return true
			}
			return false
		}
		function render(dom, vnodes) {
			if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
			var hooks = [];
			var active = $doc.activeElement;
			var namespace = dom.namespaceURI;
			// First time0 rendering into a node clears it out
			if (dom.vnodes == null) dom.textContent = "";
			if (!Array.isArray(vnodes)) vnodes = [vnodes];
			updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace);
			dom.vnodes = vnodes;
			// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
			if (active != null && $doc.activeElement !== active) active.focus();
			for (var i = 0; i < hooks.length; i++) hooks[i]();
		}
		return {render: render, setEventCallback: setEventCallback}
	};
	function throttle(callback) {
		//60fps translates to 16.6ms, round it down since setTimeout requires int
		var time = 16;
		var last = 0, pending = null;
		var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout;
		return function() {
			var now = Date.now();
			if (last === 0 || now - last >= time) {
				last = now;
				callback();
			}
			else if (pending === null) {
				pending = timeout(function() {
					pending = null;
					callback();
					last = Date.now();
				}, time - (now - last));
			}
		}
	}
	var _11 = function($window) {
		var renderService = coreRenderer($window);
		renderService.setEventCallback(function(e) {
			if (e.redraw === false) e.redraw = undefined;
			else redraw();
		});
		var callbacks = [];
		function subscribe(key1, callback) {
			unsubscribe(key1);
			callbacks.push(key1, throttle(callback));
		}
		function unsubscribe(key1) {
			var index = callbacks.indexOf(key1);
			if (index > -1) callbacks.splice(index, 2);
		}
		function redraw() {
			for (var i = 1; i < callbacks.length; i += 2) {
				callbacks[i]();
			}
		}
		return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
	};
	var redrawService = _11(window);
	requestService.setCompletionCallback(redrawService.redraw);
	var _16 = function(redrawService0) {
		return function(root, component) {
			if (component === null) {
				redrawService0.render(root, []);
				redrawService0.unsubscribe(root);
				return
			}
			
			if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
			
			var run0 = function() {
				redrawService0.render(root, Vnode(component));
			};
			redrawService0.subscribe(root, run0);
			redrawService0.redraw();
		}
	};
	m.mount = _16(redrawService);
	var Promise = PromisePolyfill;
	var parseQueryString = function(string) {
		if (string === "" || string == null) return {}
		if (string.charAt(0) === "?") string = string.slice(1);
		var entries = string.split("&"), data0 = {}, counters = {};
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i].split("=");
			var key5 = decodeURIComponent(entry[0]);
			var value = entry.length === 2 ? decodeURIComponent(entry[1]) : "";
			if (value === "true") value = true;
			else if (value === "false") value = false;
			var levels = key5.split(/\]\[?|\[/);
			var cursor = data0;
			if (key5.indexOf("[") > -1) levels.pop();
			for (var j = 0; j < levels.length; j++) {
				var level = levels[j], nextLevel = levels[j + 1];
				var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
				var isValue = j === levels.length - 1;
				if (level === "") {
					var key5 = levels.slice(0, j).join();
					if (counters[key5] == null) counters[key5] = 0;
					level = counters[key5]++;
				}
				if (cursor[level] == null) {
					cursor[level] = isValue ? value : isNumber ? [] : {};
				}
				cursor = cursor[level];
			}
		}
		return data0
	};
	var coreRouter = function($window) {
		var supportsPushState = typeof $window.history.pushState === "function";
		var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout;
		function normalize1(fragment0) {
			var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent);
			if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data;
			return data
		}
		var asyncId;
		function debounceAsync(callback0) {
			return function() {
				if (asyncId != null) return
				asyncId = callAsync0(function() {
					asyncId = null;
					callback0();
				});
			}
		}
		function parsePath(path, queryData, hashData) {
			var queryIndex = path.indexOf("?");
			var hashIndex = path.indexOf("#");
			var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length;
			if (queryIndex > -1) {
				var queryEnd = hashIndex > -1 ? hashIndex : path.length;
				var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd));
				for (var key4 in queryParams) queryData[key4] = queryParams[key4];
			}
			if (hashIndex > -1) {
				var hashParams = parseQueryString(path.slice(hashIndex + 1));
				for (var key4 in hashParams) hashData[key4] = hashParams[key4];
			}
			return path.slice(0, pathEnd)
		}
		var router = {prefix: "#!"};
		router.getPath = function() {
			var type2 = router.prefix.charAt(0);
			switch (type2) {
				case "#": return normalize1("hash").slice(router.prefix.length)
				case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
				default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
			}
		};
		router.setPath = function(path, data, options) {
			var queryData = {}, hashData = {};
			path = parsePath(path, queryData, hashData);
			if (data != null) {
				for (var key4 in data) queryData[key4] = data[key4];
				path = path.replace(/:([^\/]+)/g, function(match2, token) {
					delete queryData[token];
					return data[token]
				});
			}
			var query = buildQueryString(queryData);
			if (query) path += "?" + query;
			var hash = buildQueryString(hashData);
			if (hash) path += "#" + hash;
			if (supportsPushState) {
				var state = options ? options.state : null;
				var title = options ? options.title : null;
				$window.onpopstate();
				if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path);
				else $window.history.pushState(state, title, router.prefix + path);
			}
			else $window.location.href = router.prefix + path;
		};
		router.defineRoutes = function(routes, resolve, reject) {
			function resolveRoute() {
				var path = router.getPath();
				var params = {};
				var pathname = parsePath(path, params, params);
				var state = $window.history.state;
				if (state != null) {
					for (var k in state) params[k] = state[k];
				}
				for (var route0 in routes) {
					var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");
					if (matcher.test(pathname)) {
						pathname.replace(matcher, function() {
							var keys = route0.match(/:[^\/]+/g) || [];
							var values = [].slice.call(arguments, 1, -2);
							for (var i = 0; i < keys.length; i++) {
								params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i]);
							}
							resolve(routes[route0], params, path, route0);
						});
						return
					}
				}
				reject(path, params);
			}
			if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute);
			else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute;
			resolveRoute();
		};
		return router
	};
	var _20 = function($window, redrawService0) {
		var routeService = coreRouter($window);
		var identity = function(v) {return v};
		var render1, component, attrs3, currentPath, lastUpdate;
		var route = function(root, defaultRoute, routes) {
			if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
			var run1 = function() {
				if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)));
			};
			var bail = function(path) {
				if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true});
				else throw new Error("Could not resolve default route " + defaultRoute)
			};
			routeService.defineRoutes(routes, function(payload, params, path) {
				var update = lastUpdate = function(routeResolver, comp) {
					if (update !== lastUpdate) return
					component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div";
					attrs3 = params, currentPath = path, lastUpdate = null;
					render1 = (routeResolver.render || identity).bind(routeResolver);
					run1();
				};
				if (payload.view || typeof payload === "function") update({}, payload);
				else {
					if (payload.onmatch) {
						Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
							update(payload, resolved);
						}, bail);
					}
					else update(payload, "div");
				}
			}, bail);
			redrawService0.subscribe(root, run1);
		};
		route.set = function(path, data, options) {
			if (lastUpdate != null) {
				options = options || {};
				options.replace = true;
			}
			lastUpdate = null;
			routeService.setPath(path, data, options);
		};
		route.get = function() {return currentPath};
		route.prefix = function(prefix0) {routeService.prefix = prefix0;};
		route.link = function(vnode1) {
			vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href);
			vnode1.dom.onclick = function(e) {
				if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
				e.preventDefault();
				e.redraw = false;
				var href = this.getAttribute("href");
				if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length);
				route.set(href, undefined, undefined);
			};
		};
		route.param = function(key3) {
			if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
			return attrs3
		};
		return route
	};
	m.route = _20(window, redrawService);
	m.withAttr = function(attrName, callback1, context) {
		return function(e) {
			callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName));
		}
	};
	var _28 = coreRenderer(window);
	m.render = _28.render;
	m.redraw = redrawService.redraw;
	m.request = requestService.request;
	m.jsonp = requestService.jsonp;
	m.parseQueryString = parseQueryString;
	m.buildQueryString = buildQueryString;
	m.version = "1.1.6";
	m.vnode = Vnode;
	module["exports"] = m;
	}());
	});

	var keys = {
	  autocomplete: "autocomplete",
	  autofocus: "autofocus",
	  class: "class",
	  className: "class",
	  enctype: "enctype",
	  formaction: "formaction",
	  frameborder: "frameborder",
	  maxlength: "maxlength",
	  minlength: "minlength",
	  onblur: "onblur",
	  onchange: "onchange",
	  onclick: "onclick",
	  onfocus: "onfocus",
	  oninput: "oninput",
	  onkeydown: "onkeydown",
	  onkeyup: "onkeyup",
	  onmousedown: "onmousedown",
	  onmouseout: "onmouseout",
	  onmouseover: "onmouseover",
	  onmouseup: "onmouseup",
	  onscroll: "onscroll",
	  onsubmit: "onsubmit",
	  ontouchend: "ontouchend",
	  ontouchmove: "ontouchmove",
	  ontouchstart: "ontouchstart",
	  readonly: "readonly",
	  tabindex: "tabindex"
	};
	var renderer = mithril;
	renderer["displayName"] = "mithril";

	function _extends() {
	  _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	function createCommonjsModule$1(fn, module) {
	  return module = {
	    exports: {}
	  }, fn(module, module.exports), module.exports;
	}

	var stream = createCommonjsModule$1(function (module) {
	  (function () {
	    /* eslint-enable */
	    var guid = 0,
	        HALT = {};

	    function createStream() {
	      function stream() {
	        if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0]);
	        return stream._state.value;
	      }

	      initStream(stream);
	      if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0]);
	      return stream;
	    }

	    function initStream(stream) {
	      stream.constructor = createStream;
	      stream._state = {
	        id: guid++,
	        value: undefined,
	        state: 0,
	        derive: undefined,
	        recover: undefined,
	        deps: {},
	        parents: [],
	        endStream: undefined,
	        unregister: undefined
	      };
	      stream.map = stream["fantasy-land/map"] = map, stream["fantasy-land/ap"] = ap, stream["fantasy-land/of"] = createStream;
	      stream.valueOf = valueOf, stream.toJSON = toJSON, stream.toString = valueOf;
	      Object.defineProperties(stream, {
	        end: {
	          get: function get() {
	            if (!stream._state.endStream) {
	              var endStream = createStream();
	              endStream.map(function (value) {
	                if (value === true) {
	                  unregisterStream(stream);

	                  endStream._state.unregister = function () {
	                    unregisterStream(endStream);
	                  };
	                }

	                return value;
	              });
	              stream._state.endStream = endStream;
	            }

	            return stream._state.endStream;
	          }
	        }
	      });
	    }

	    function updateStream(stream, value) {
	      updateState(stream, value);

	      for (var id in stream._state.deps) {
	        updateDependency(stream._state.deps[id], false);
	      }

	      if (stream._state.unregister != null) stream._state.unregister();
	      finalize(stream);
	    }

	    function updateState(stream, value) {
	      stream._state.value = value;
	      stream._state.changed = true;
	      if (stream._state.state !== 2) stream._state.state = 1;
	    }

	    function updateDependency(stream, mustSync) {
	      var state = stream._state,
	          parents = state.parents;

	      if (parents.length > 0 && parents.every(active) && (mustSync || parents.some(changed))) {
	        var value = stream._state.derive();

	        if (value === HALT) return false;
	        updateState(stream, value);
	      }
	    }

	    function finalize(stream) {
	      stream._state.changed = false;

	      for (var id in stream._state.deps) {
	        stream._state.deps[id]._state.changed = false;
	      }
	    }

	    function combine(fn, streams) {
	      if (!streams.every(valid)) throw new Error("Ensure that each item passed to stream.combine/stream.merge is a stream");
	      return initDependency(createStream(), streams, function () {
	        return fn.apply(this, streams.concat([streams.filter(changed)]));
	      });
	    }

	    function initDependency(dep, streams, derive) {
	      var state = dep._state;
	      state.derive = derive;
	      state.parents = streams.filter(notEnded);
	      registerDependency(dep, state.parents);
	      updateDependency(dep, true);
	      return dep;
	    }

	    function registerDependency(stream, parents) {
	      for (var i = 0; i < parents.length; i++) {
	        parents[i]._state.deps[stream._state.id] = stream;
	        registerDependency(stream, parents[i]._state.parents);
	      }
	    }

	    function unregisterStream(stream) {
	      for (var i = 0; i < stream._state.parents.length; i++) {
	        var parent = stream._state.parents[i];
	        delete parent._state.deps[stream._state.id];
	      }

	      for (var id in stream._state.deps) {
	        var dependent = stream._state.deps[id];

	        var index = dependent._state.parents.indexOf(stream);

	        if (index > -1) dependent._state.parents.splice(index, 1);
	      }

	      stream._state.state = 2; //ended

	      stream._state.deps = {};
	    }

	    function map(fn) {
	      return combine(function (stream) {
	        return fn(stream());
	      }, [this]);
	    }

	    function ap(stream) {
	      return combine(function (s1, s2) {
	        return s1()(s2());
	      }, [stream, this]);
	    }

	    function valueOf() {
	      return this._state.value;
	    }

	    function toJSON() {
	      return this._state.value != null && typeof this._state.value.toJSON === "function" ? this._state.value.toJSON() : this._state.value;
	    }

	    function valid(stream) {
	      return stream._state;
	    }

	    function active(stream) {
	      return stream._state.state === 1;
	    }

	    function changed(stream) {
	      return stream._state.changed;
	    }

	    function notEnded(stream) {
	      return stream._state.state !== 2;
	    }

	    function merge(streams) {
	      return combine(function () {
	        return streams.map(function (s) {
	          return s();
	        });
	      }, streams);
	    }

	    function scan(reducer, seed, stream) {
	      var newStream = combine(function (s) {
	        return seed = reducer(seed, s._state.value);
	      }, [stream]);
	      if (newStream._state.state === 0) newStream(seed);
	      return newStream;
	    }

	    function scanMerge(tuples, seed) {
	      var streams = tuples.map(function (tuple) {
	        var stream = tuple[0];
	        if (stream._state.state === 0) stream(undefined);
	        return stream;
	      });
	      var newStream = combine(function () {
	        var changed = arguments[arguments.length - 1];
	        streams.forEach(function (stream, idx) {
	          if (changed.indexOf(stream) > -1) {
	            seed = tuples[idx][1](seed, stream._state.value);
	          }
	        });
	        return seed;
	      }, streams);
	      return newStream;
	    }

	    createStream["fantasy-land/of"] = createStream;
	    createStream.merge = merge;
	    createStream.combine = combine;
	    createStream.scan = scan;
	    createStream.scanMerge = scanMerge;
	    createStream.HALT = HALT;
	    module["exports"] = createStream;
	  })();
	});
	var stream$1 = stream;
	var requiresKeys = false;
	/**
	 * @param {ComponentCreatorOptions} params
	 */

	var ComponentCreator = function ComponentCreator(_ref) {
	  var _ref$createContent = _ref.createContent,
	      createContent = _ref$createContent === void 0 ? function () {
	    return null;
	  } : _ref$createContent,
	      _ref$createProps = _ref.createProps,
	      createProps = _ref$createProps === void 0 ? function () {
	    return {};
	  } : _ref$createProps,
	      _ref$component = _ref.component,
	      component = _ref$component === void 0 ? null : _ref$component,
	      _ref$getElement = _ref.getElement,
	      getElement = _ref$getElement === void 0 ? function () {
	    return "div";
	  } : _ref$getElement,
	      _ref$getInitialState = _ref.getInitialState,
	      getInitialState = _ref$getInitialState === void 0 ? function () {
	    return {};
	  } : _ref$getInitialState,
	      _ref$onMount = _ref.onMount,
	      onMount = _ref$onMount === void 0 ? function () {
	    return null;
	  } : _ref$onMount,
	      _ref$onUnMount = _ref.onUnMount,
	      onUnMount = _ref$onUnMount === void 0 ? function () {
	    return null;
	  } : _ref$onUnMount,
	      _ref$onUpdate = _ref.onUpdate,
	      onUpdate = _ref$onUpdate === void 0 ? function () {
	    return null;
	  } : _ref$onUpdate,
	      _ref$view = _ref.view,
	      view = _ref$view === void 0 ? null : _ref$view;
	  var localState = {
	    mounted: false
	  };
	  /**
	   * @param {Vnode} vnode 
	   */

	  var oninit = function oninit(vnode) {
	    /**
	     * @type {{ redrawOnUpdate?: Array<function>, _?: any }} initialState
	     */
	    var initialState = getInitialState(vnode, stream$1, {
	      keys: keys
	    });

	    _extends(vnode.state, initialState);

	    initialState.redrawOnUpdate !== undefined ? initialState.redrawOnUpdate.map(function () {
	      return localState && setTimeout(renderer.redraw);
	    }) : undefined;
	  };
	  /**
	   * @param {Vnode} vnode 
	   */


	  var oncreate = function oncreate(vnode) {
	    localState.mounted = true;
	    onMount(vnode, {
	      keys: keys
	    });
	  };
	  /**
	   * @param {Vnode} vnode 
	   */


	  var render = function render(vnode) {
	    return renderer(component || getElement(vnode), createProps(vnode, {
	      renderer: renderer,
	      requiresKeys: requiresKeys,
	      keys: keys
	    }), [vnode.attrs.before, createContent(vnode, {
	      renderer: renderer,
	      requiresKeys: requiresKeys,
	      keys: keys
	    }), vnode.attrs.after]);
	  };

	  return {
	    view: view ?
	    /**
	     * @param {Vnode} vnode
	     */
	    function (vnode) {
	      return view(vnode, {
	        render: render,
	        renderer: renderer
	      });
	    } :
	    /**
	     * @param {Vnode} vnode
	     */
	    function (vnode) {
	      return render(vnode);
	    },
	    oninit: oninit,
	    oncreate: oncreate,
	    onremove: onUnMount,
	    onupdate: onUpdate
	  };
	};

	function _typeof(obj) {
	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _defineProperty$1(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$1(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$1(target, key, source[key]);
	    });
	  }

	  return target;
	} // @ts-check


	var modes = {
	  hidden: "hidden",
	  visible: "visible",
	  exposing: "exposing",
	  hiding: "hiding"
	};
	var Conditional = {
	  /**
	   * @param {object} vnode
	   * @param {object} createStream
	   */
	  getInitialState: function getInitialState(vnode, createStream) {
	    var attrs = vnode.attrs;

	    if (!attrs.didHide) {
	      return {};
	    }

	    var visible = attrs.permanent || attrs.show;
	    var mode = createStream(attrs.permanent ? modes.visible : visible ? modes.visible : modes.hidden);
	    return {
	      mode: mode,
	      redrawOnUpdate: createStream.merge([mode])
	    };
	  },

	  /**
	   * @param {object} params
	   * @param {object} params.state
	   * @param {object} params.attrs
	   */
	  onUpdate: function onUpdate(_ref) {
	    var state = _ref.state,
	        attrs = _ref.attrs;

	    if (!attrs.didHide) {
	      return;
	    }

	    var mode = state.mode();

	    if (attrs.permanent) {
	      if (mode === modes.visible && attrs.show) {
	        state.mode(modes.exposing);
	      } else if (mode === modes.exposing && !attrs.show) {
	        state.mode(modes.hiding);
	      }
	    } else {
	      // "normal" type
	      if (mode === modes.hidden && attrs.show) {
	        state.mode(modes.visible);
	      } else if (mode === modes.visible && !attrs.show) {
	        state.mode(modes.hiding);
	      }
	    }
	  },

	  /**
	   * @param {object} params
	   * @param {object} params.state
	   * @param {object} params.attrs
	   * @param {object} attrs
	   * @param {function} attrs.renderer
	   */
	  view: function view(_ref2, _ref3) {
	    var state = _ref2.state,
	        attrs = _ref2.attrs;
	    var h = _ref3.renderer;
	    var placeholder = h("span", {
	      className: attrs.placeholderClassName
	    }); // No didHide callback passed: use normal visibility evaluation

	    if (!attrs.didHide) {
	      return attrs.permanent || attrs.inactive || attrs.show ? h(attrs.instance, attrs) : placeholder;
	    } // else: use didHide to reset the state after hiding


	    var mode = state.mode();
	    var visible = mode !== modes.hidden;
	    return visible ? h(attrs.instance, _objectSpread$1({}, attrs, {
	      didHide:
	      /**
	       * @param {any} args
	       */
	      function didHide(args) {
	        return attrs.didHide(args), state.mode(attrs.permanent ? modes.visible : modes.hidden);
	      }
	    }, mode === modes.hiding ? {
	      show: true,
	      hide: true
	    } : undefined)) : placeholder;
	  },
	  displayName: "Conditional"
	}; // @ts-check

	/**
	 * 
	 * @param {string} component 
	 * @param {object} params
	 * @param {string} [params.option]
	 * @param {string} [params.newOption]
	 * @param {string} [params.newOption]
	 * @param {string} [params.newComponent]
	 * @param {string} [params.since]
	 */

	var deprecation = function deprecation(component, _ref) {
	  var option = _ref.option,
	      newOption = _ref.newOption,
	      newComponent = _ref.newComponent,
	      since = _ref.since;
	  var version = since ? "Since version ".concat(since, ".") : "";
	  return option && console.warn("".concat(component, ": option '").concat(option, "' is deprecated and will be removed in later versions. Use '").concat(newOption, "' instead. ").concat(version)), // eslint-disable-line no-console
	  newComponent && !newOption && console.warn("".concat(component, ": this component is deprecated and will be removed in later versions. Use component '").concat(newComponent, "' instead. ").concat(version)), // eslint-disable-line no-console
	  newComponent && newOption && console.warn("".concat(component, ": this component is deprecated and will be removed in later versions. Use component '").concat(newComponent, "' with option '").concat(newOption, "' instead. ").concat(version)) // eslint-disable-line no-console
	  ;
	}; // @ts-check

	/**
	 * Reducer helper function.
	 * @param {object} acc 
	 * @param {string} p 
	 * @returns {object}
	 */


	var r = function r(acc, p) {
	  return acc[p] = 1, acc;
	};
	/**
	 * List of default attributes.
	 * Separately handled:
	 * - class
	 * - element
	 * @type Array<string> defaultAttrs
	 */


	var defaultAttrs = [// Universal
	"key", "style", "href", "id", // React
	"tabIndex", // Mithril
	"tabindex", "oninit", "oncreate", "onupdate", "onbeforeremove", "onremove", "onbeforeupdate"];
	/**
	 * 
	 * @param {{[s: string]: string}} attrs 
	 * @param {object} [modifications] 
	 * @param {Array<string>} [modifications.add]
	 * @param {Array<string>} [modifications.remove]
	 * @returns {object}
	 */

	var filterSupportedAttributes = function filterSupportedAttributes(attrs) {
	  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	      add = _ref.add,
	      remove = _ref.remove;
	  /**
	   * @type {{[s: string]: string}} removeLookup 
	   */


	  var removeLookup = remove ? remove.reduce(r, {}) : {};
	  /**
	   * @type {Array<string>} attrsList 
	   */

	  var attrsList = add ? defaultAttrs.concat(add) : defaultAttrs;
	  var supported = attrsList.filter(function (item) {
	    return !removeLookup[item];
	  }).reduce(r, {});
	  return Object.keys(attrs).reduce(
	  /**
	   * @param {object} acc
	   * @param {string} key
	   */
	  function (acc, key) {
	    return supported[key] ? acc[key] = attrs[key] : null, acc;
	  }, {});
	};
	/**
	 * 
	 * @param {object|function} attrs 
	 * @returns {object}
	 */


	var unpackAttrs = function unpackAttrs(attrs) {
	  return typeof attrs === "function" ? attrs() : attrs;
	};
	/**
	 * 
	 * @param {{[s: string]: string}} classes 
	 * @returns {{[s: string]: string}}
	 */


	var sizeClasses = function sizeClasses(classes) {
	  return {
	    small: classes.small,
	    regular: classes.regular,
	    medium: classes.medium,
	    large: classes.large,
	    fab: classes.fab
	  };
	};
	/**
	 * 
	 * @param {{[s: string]: string}} classes 
	 * @param {string} [size] 
	 * @returns {object}
	 */


	var classForSize = function classForSize(classes) {
	  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "regular";
	  return sizeClasses(classes)[size];
	};

	var isClient = typeof document !== "undefined";
	var isServer = !isClient; // @ts-check

	/**
	 * @type {{[s: string]: string}} evts
	 */

	var evts = {
	  "animation": "animationend",
	  "OAnimation": "oAnimationEnd",
	  "MozAnimation": "animationend",
	  "WebkitAnimation": "webkitAnimationEnd"
	};

	var getAnimationEndEvent = function getAnimationEndEvent() {
	  if (isClient) {
	    var el = document.createElement("fakeelement");
	    /**
	     * @type {string} a
	     */

	    for (var a in evts) {
	      /**
	       * @type {object} style
	       */
	      var style = el.style;

	      if (style[a] !== undefined) {
	        return evts[a];
	      }
	    }
	  }
	}; // @ts-check

	/**
	 * @param {object} params
	 * @param {object} params.element
	 * @param {string} [params.selector]
	 * @param {string} [params.pseudoSelector]
	 * @param {string} params.prop
	 * @returns {object|undefined}
	 */


	var getStyle = function getStyle(_ref) {
	  var element = _ref.element,
	      selector = _ref.selector,
	      pseudoSelector = _ref.pseudoSelector,
	      prop = _ref.prop;
	  var el = selector ? element.querySelector(selector) : element;

	  if (!el) {
	    return undefined;
	  }

	  if (el.currentStyle) {
	    return el.currentStyle;
	  }

	  if (window.getComputedStyle) {
	    var defaultView = document.defaultView;

	    if (defaultView) {
	      var style = defaultView.getComputedStyle(el, pseudoSelector);

	      if (style) {
	        return style.getPropertyValue(prop);
	      }
	    }
	  }

	  return undefined;
	};
	/**
	 * 
	 * @param {object} params
	 * @param {object} params.element
	 * @param {string} [params.selector]
	 * @param {string} [params.pseudoSelector]
	 * @param {string} params.prop
	 * @param {string} [params.equals]
	 * @param {string} [params.contains]
	 * @returns {boolean}
	 */


	var stylePropCompare = function stylePropCompare(_ref2) {
	  var element = _ref2.element,
	      selector = _ref2.selector,
	      pseudoSelector = _ref2.pseudoSelector,
	      prop = _ref2.prop,
	      equals = _ref2.equals,
	      contains = _ref2.contains;
	  var el = selector ? element.querySelector(selector) : element;

	  if (!el) {
	    return false;
	  }

	  var defaultView = document.defaultView;

	  if (defaultView) {
	    if (equals !== undefined) {
	      return equals === defaultView.getComputedStyle(el, pseudoSelector).getPropertyValue(prop);
	    }

	    if (contains !== undefined) {
	      return defaultView.getComputedStyle(el, pseudoSelector).getPropertyValue(prop).indexOf(contains) !== -1;
	    }
	  }

	  return false;
	};
	/**
	 * 
	 * @param {object} params
	 * @param {object} params.element
	 * @param {string} params.selector
	 * @returns {boolean}
	 */


	var isRTL = function isRTL(_ref3) {
	  var _ref3$element = _ref3.element,
	      element = _ref3$element === void 0 ? document : _ref3$element,
	      selector = _ref3.selector;
	  return stylePropCompare({
	    element: element,
	    selector: selector,
	    prop: "direction",
	    equals: "rtl"
	  });
	};
	/**
	 * 
	 * @param {string} durationStr 
	 * @returns {number}
	 */


	var styleDurationToMs = function styleDurationToMs(durationStr) {
	  var parsed = parseFloat(durationStr) * (durationStr.indexOf("ms") === -1 ? 1000 : 1);
	  return isNaN(parsed) ? 0 : parsed;
	};
	var iconDropdownDown = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"dd-down-svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>"; // @ts-check

	var isTouch = isServer ? false : "ontouchstart" in document.documentElement;
	var pointerEndEvent = isTouch ? ["click", "mouseup"] : ["mouseup"];
	var pointerStartMoveEvent = isTouch ? ["touchstart", "mousedown"] : ["mousedown"];
	var pointerMoveEvent = isTouch ? ["touchmove", "mousemove"] : ["mousemove"];
	var pointerEndMoveEvent = isTouch ? ["touchend", "mouseup"] : ["mouseup"];

	if (isClient) {
	  var htmlElement = document.querySelector("html");

	  if (htmlElement) {
	    htmlElement.classList.add(isTouch ? "pe-touch" : "pe-no-touch");
	  }
	} // @ts-check

	/**
	 * @type {{[s: string]: Array<function>}} listeners
	 */


	var listeners = {};
	/**
	 * @param {function} func
	 * @param {number} [s]
	 * @param {object} [context]
	 * @returns {function}
	 * @see https://gist.github.com/Eartz/fe651f2fadcc11444549
	 */

	var throttle = function throttle(func) {
	  var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.05;
	  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isClient ? window : {};
	  var wait = false;
	  return function () {
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var later = function later() {
	      return func.apply(context, args);
	    };

	    if (!wait) {
	      later();
	      wait = true;
	      setTimeout(function () {
	        return wait = false;
	      }, s);
	    }
	  };
	};
	/**
	 * 
	 * @param {string} eventName 
	 * @param {object} listener 
	 * @param {number} [delay] 
	 */


	var subscribe = function subscribe(eventName, listener, delay) {
	  listeners[eventName] = listeners[eventName] || [];
	  listeners[eventName].push(delay ? throttle(listener, delay) : listener);
	};
	/**
	 * 
	 * @param {string} eventName 
	 * @param {object} listener 
	 */


	var unsubscribe = function unsubscribe(eventName, listener) {
	  if (!listeners[eventName]) {
	    return;
	  }

	  var index = listeners[eventName].indexOf(listener);

	  if (index > -1) {
	    listeners[eventName].splice(index, 1);
	  }
	};
	/**
	 * 
	 * @param {string} eventName 
	 * @param {object} event 
	 */


	var emit = function emit(eventName, event) {
	  if (!listeners[eventName]) {
	    return;
	  }

	  listeners[eventName].forEach(function (listener) {
	    return listener(event);
	  });
	};

	if (isClient) {
	  window.addEventListener("resize", function (e) {
	    return emit("resize", e);
	  });
	  window.addEventListener("scroll", function (e) {
	    return emit("scroll", e);
	  });
	  window.addEventListener("keydown", function (e) {
	    return emit("keydown", e);
	  });
	  pointerEndEvent.forEach(function (eventName) {
	    return window.addEventListener(eventName, function (e) {
	      return emit(eventName, e);
	    });
	  });
	}
	/**
	 * @typedef {object} Item 
	 */

	/**
	 * 
	 * @param {object} params
	 * @param {object} params.options
	 * @param {function} params.renderer
	 */


	var Multi = function Multi(_ref) {
	  var mOptions = _ref.options,
	      renderer = _ref.renderer;
	  /**
	   * @type {Array<Item>} items
	   */

	  var items = []; // This is shared between all instances of a type (Dialog, Notification, ...)

	  var current;

	  var getInitialState = function getInitialState(vnode, createStream) {
	    current = createStream(null);
	    return {
	      current: current,
	      redrawOnUpdate: createStream.merge([current])
	    };
	  };
	  /*
	  @param e: { id, eventName }
	  */


	  var onChange = function onChange(e) {
	    if (!current) {
	      console.error("Cannot set state. Did you set a root element like Dialog to show instances?"); // eslint-disable-line no-console
	    }

	    current(e.id);
	    emit(mOptions.name, e);
	  };

	  var itemIndex = function itemIndex(id) {
	    var item = findItem(id);
	    return items.indexOf(item);
	  };

	  var removeItem = function removeItem(id) {
	    var index = itemIndex(id);

	    if (index !== -1) {
	      items.splice(index, 1);
	      onChange({
	        id: id,
	        name: "removeItem"
	      });
	    }
	  };

	  var replaceItem = function replaceItem(id, newItem) {
	    var index = itemIndex(id);

	    if (index !== -1) {
	      items[index] = newItem;
	    }
	  };

	  var findItem = function findItem(id) {
	    // traditional for loop for IE10
	    for (var i = 0; i < items.length; i++) {
	      if (items[i].instanceId === id) {
	        return items[i];
	      }
	    }
	  };

	  var next = function next() {
	    if (items.length) {
	      items[0].show = true;
	    }

	    onChange({
	      id: items.length ? items[0].instanceId : null,
	      name: "next"
	    });
	  };

	  var remove = function remove() {
	    var instanceId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mOptions.defaultId;

	    if (mOptions.queue) {
	      items.shift();
	      next();
	    } else {
	      removeItem(instanceId);
	    }
	  };

	  var removeAll = function removeAll() {
	    items.length = 0;
	    onChange({
	      id: null,
	      name: "removeAll"
	    });
	  };

	  var setPauseState = function setPauseState(pause, instanceId) {
	    var item = findItem(instanceId);

	    if (item) {
	      item.pause = pause;
	      item.unpause = !pause;
	      onChange({
	        id: instanceId,
	        name: pause ? "pause" : "unpause"
	      });
	    }
	  };

	  var createItem = function createItem(itemAttrs, instanceId, spawn) {
	    var resolveShow;
	    var resolveHide;
	    var attrs = unpackAttrs(itemAttrs);

	    var didShow = function didShow() {
	      if (attrs.didShow) {
	        attrs.didShow(instanceId);
	      }

	      onChange({
	        id: instanceId,
	        name: "didShow"
	      });
	      return resolveShow(instanceId);
	    };

	    var showPromise = new Promise(function (resolve) {
	      return resolveShow = resolve;
	    });

	    var didHide = function didHide() {
	      if (attrs.didHide) {
	        attrs.didHide(instanceId);
	      }

	      onChange({
	        id: instanceId,
	        name: "didHide"
	      });
	      remove(instanceId);
	      return resolveHide(instanceId);
	    };

	    var hidePromise = new Promise(function (resolve) {
	      return resolveHide = resolve;
	    });
	    return _objectSpread$1({}, mOptions, {
	      instanceId: instanceId,
	      spawn: spawn,
	      attrs: itemAttrs,
	      show: mOptions.queue ? false : true,
	      showPromise: showPromise,
	      hidePromise: hidePromise,
	      didShow: didShow,
	      didHide: didHide
	    });
	  };

	  var count = function count() {
	    return items.length;
	  };

	  var pause = function pause() {
	    var instanceId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mOptions.defaultId;
	    return setPauseState(true, instanceId);
	  };

	  var unpause = function unpause() {
	    var instanceId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mOptions.defaultId;
	    return setPauseState(false, instanceId);
	  };

	  var show = function show() {
	    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var spawnOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    var instanceId = spawnOpts.id || mOptions.defaultId;
	    var spawn = spawnOpts.spawn || mOptions.defaultId;
	    var item = createItem(attrs, instanceId, spawn);
	    onChange({
	      id: instanceId,
	      name: "show"
	    });

	    if (mOptions.queue) {
	      items.push(item);

	      if (items.length === 1) {
	        next();
	      }
	    } else {
	      var storedItem = findItem(instanceId);

	      if (!storedItem) {
	        items.push(item);
	      } else {
	        replaceItem(instanceId, item);
	      }
	    }

	    return item.showPromise;
	  };

	  var hide = function hide() {
	    var spawnOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var instanceId = spawnOpts.id || mOptions.defaultId;
	    var item = mOptions.queue && items.length ? items[0] : findItem(instanceId);

	    if (item) {
	      item.hide = true;
	    }

	    onChange({
	      id: instanceId,
	      name: "hide"
	    });
	    return item ? item.hidePromise : Promise.resolve(instanceId);
	  };

	  var clear = removeAll;

	  var view = function view(_ref2) {
	    var attrs = _ref2.attrs;
	    var spawn = attrs.spawn || mOptions.defaultId;
	    var candidates = items.filter(function (item) {
	      return item.show && item.spawn === spawn;
	    });

	    if (mOptions.htmlShowClass && isClient && document.documentElement) {
	      document.documentElement.classList[candidates.length ? "add" : "remove"](mOptions.htmlShowClass);
	    }

	    return !candidates.length ? renderer(mOptions.placeholder) // placeholder because we cannot return null
	    : renderer(mOptions.holderSelector, {
	      className: attrs.position === "container" ? "pe-multiple--container" : "pe-multiple--screen"
	    }, candidates.map(function (itemData) {
	      return renderer(mOptions.instance, _objectSpread$1({}, unpackAttrs(attrs), {
	        fromMultipleClear: clear,
	        spawnId: spawn,
	        // from mOptions:
	        fromMultipleClassName: mOptions.className,
	        holderSelector: mOptions.holderSelector,
	        transitions: mOptions.transitions,
	        // from itemData:
	        fromMultipleDidHide: itemData.didHide,
	        fromMultipleDidShow: itemData.didShow,
	        hide: itemData.hide,
	        instanceId: itemData.instanceId,
	        key: itemData.key,
	        pause: itemData.pause,
	        show: itemData.show,
	        unpause: itemData.unpause
	      }, unpackAttrs(itemData.attrs)));
	    }));
	  };

	  return {
	    clear: clear,
	    count: count,
	    getInitialState: getInitialState,
	    hide: hide,
	    pause: pause,
	    remove: remove,
	    show: show,
	    unpause: unpause,
	    view: view
	  };
	};

	Multi["displayName"] = "Multi";
	/**
	 * 
	 * @typedef {{ el?: HTMLElement, duration?: number, hasDuration?: boolean, delay?: number, hasDelay?: boolean, timingFunction?: string, transitionClass?: string, transitionClassElement?: HTMLElement, before?: () => void, after?: () => void, transition?: () => void, showClass?: string, showClassElement?: HTMLElement  }} TransitionOpts
	 */

	var DEFAULT_DURATION = .240;
	var DEFAULT_DELAY = 0;
	/**
	 * 
	 * @param {TransitionOpts} opts 
	 * @returns {Promise}
	 */

	var show = function show(opts) {
	  return transition(opts, "show");
	};
	/**
	 * 
	 * @param {TransitionOpts} opts
	 * @returns {Promise} 
	 */


	var hide = function hide(opts) {
	  return transition(opts, "hide");
	};
	/**
	 * 
	 * @param {TransitionOpts} opts 
	 * @param {"show"|"hide"} state 
	 * @returns {Promise}
	 */


	var transition = function transition(opts, state) {
	  var el = opts.el;

	  if (!el) {
	    return Promise.resolve();
	  } else {
	    return new Promise(function (resolve) {
	      var style = el.style;
	      /**
	       * @type {object} computedStyle
	       */

	      var computedStyle = isClient ? window.getComputedStyle(el) : {};
	      var duration = opts.hasDuration && opts.duration !== undefined ? opts.duration * 1000.0 : styleDurationToMs(computedStyle.transitionDuration);
	      var delay = opts.hasDelay && opts.delay !== undefined ? opts.delay * 1000.0 : styleDurationToMs(computedStyle.transitionDelay);
	      var timingFunction = opts.timingFunction || computedStyle.transitionTimingFunction;

	      if (opts.transitionClass) {
	        var transitionClassElement = opts.transitionClassElement || el;
	        transitionClassElement.classList.add(opts.transitionClass);
	      }

	      var before = function before() {
	        style.transitionDuration = "0ms";
	        style.transitionDelay = "0ms";

	        if (opts.before && typeof opts.before === "function") {
	          opts.before();
	        }
	      };

	      var maybeBefore = opts.before && state === "show" ? before : opts.before && state === "hide" ? before : null;

	      var after = function after() {
	        if (opts.after && typeof opts.after === "function") {
	          opts.after();
	        }
	      };

	      var applyTransition = function applyTransition() {
	        style.transitionDuration = duration + "ms";
	        style.transitionDelay = delay + "ms";

	        if (timingFunction) {
	          style.transitionTimingFunction = timingFunction;
	        }

	        if (opts.showClass) {
	          var showClassElement = opts.showClassElement || el;
	          showClassElement.classList[state === "show" ? "add" : "remove"](opts.showClass);
	        }

	        if (opts.transition) {
	          opts.transition();
	        }
	      };

	      var doTransition = function doTransition() {
	        applyTransition();
	        setTimeout(function () {
	          if (after) {
	            after();
	          }

	          if (opts.transitionClass) {
	            var _transitionClassElement = opts.transitionClassElement || el;

	            _transitionClassElement.classList.remove(opts.transitionClass);

	            el.offsetHeight; // force reflow
	          }

	          resolve();
	        }, duration + delay);
	      };

	      var maybeDelayTransition = function maybeDelayTransition() {
	        if (duration === 0) {
	          doTransition();
	        } else {
	          setTimeout(doTransition, 0);
	        }
	      };

	      if (maybeBefore) {
	        maybeBefore();
	        el.offsetHeight; // force reflow

	        setTimeout(function () {
	          maybeDelayTransition();
	        }, 0);
	      } else {
	        maybeDelayTransition();
	      }
	    });
	  }
	};
	/**
	 * 
	 * @param {object} params
	 * @param {boolean} [params.isShow]
	 * @param {object} [params.state]
	 * @param {object} [params.attrs]
	 * @param {Array<HTMLElement>} [params.domElements]
	 * @param {() => void} [params.beforeTransition]
	 * @param {() => void} [params.afterTransition]
	 * @param {string} [params.showClass]
	 * @param {string} [params.transitionClass]
	 * @returns {Promise}
	 */


	var transitionComponent = function transitionComponent(_ref) {
	  var isShow = _ref.isShow,
	      state = _ref.state,
	      attrs = _ref.attrs,
	      domElements = _ref.domElements,
	      beforeTransition = _ref.beforeTransition,
	      afterTransition = _ref.afterTransition,
	      showClass = _ref.showClass,
	      transitionClass = _ref.transitionClass;

	  if (state.transitioning()) {
	    return Promise.resolve();
	  }

	  state.transitioning(true);
	  state.visible(isShow ? true : false);

	  if (beforeTransition) {
	    beforeTransition();
	  }

	  var duration = attrs[isShow ? "showDuration" : "hideDuration"];
	  var delay = attrs[isShow ? "showDelay" : "hideDelay"];
	  var timingFunction = attrs[isShow ? "showTimingFunction" : "hideTimingFunction"];
	  var transitions = attrs.transitions;
	  var fn = isShow ? show : hide;

	  var opts1 = _objectSpread$1({}, attrs, domElements, {
	    showClass: showClass,
	    transitionClass: transitionClass,
	    duration: duration,
	    delay: delay,
	    timingFunction: timingFunction
	  });

	  var opts2 = _objectSpread$1({}, opts1, transitions ? transitions[isShow ? "show" : "hide"](opts1) : undefined);

	  var opts3 = _objectSpread$1({}, opts2, {
	    duration: opts2.duration !== undefined ? opts2.duration : DEFAULT_DURATION,
	    hasDuration: opts2.duration !== undefined,
	    delay: opts2.delay !== undefined ? opts2.delay : DEFAULT_DELAY,
	    hasDelay: opts2.delay !== undefined
	  });

	  return fn(opts3).then(function () {
	    var id = state.instanceId;

	    if (attrs[isShow ? "fromMultipleDidShow" : "fromMultipleDidHide"]) {
	      attrs[isShow ? "fromMultipleDidShow" : "fromMultipleDidHide"](id); // when used with Multiple; this will call attrs.didShow / attrs.didHide
	    } else if (attrs[isShow ? "didShow" : "didHide"]) {
	      attrs[isShow ? "didShow" : "didHide"](id); // when used directly
	    }

	    if (afterTransition) {
	      afterTransition();
	    }

	    state.transitioning(false);
	  });
	};

	function _typeof$1(obj) {
	  if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
	    _typeof$1 = function _typeof$$1(obj) {
	      return _typeof(obj);
	    };
	  } else {
	    _typeof$1 = function _typeof$$1(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
	    };
	  }

	  return _typeof$1(obj);
	}

	function _defineProperty$2(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$2() {
	  _extends$2 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$2.apply(this, arguments);
	}

	function _objectSpread$2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$2(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var classes = {
	  component: "pe-text-button",
	  super: "pe-button",
	  row: "pe-button-row",
	  // elements      
	  content: "pe-button__content",
	  label: "pe-button__label",
	  textLabel: "pe-button__text-label",
	  wash: "pe-button__wash",
	  dropdown: "pe-button__dropdown",
	  // states      
	  border: "pe-button--border",
	  contained: "pe-button--contained",
	  disabled: "pe-button--disabled",
	  dropdownClosed: "pe-button--dropdown-closed",
	  dropdownOpen: "pe-button--dropdown-open",
	  extraWide: "pe-button--extra-wide",
	  hasDropdown: "pe-button--dropdown",
	  highLabel: "pe-button--high-label",
	  inactive: "pe-button--inactive",
	  raised: "pe-button--raised",
	  selected: "pe-button--selected",
	  separatorAtStart: "pe-button--separator-start"
	};

	var getElement = function getElement(vnode) {
	  return vnode.attrs.element || "a";
	};

	var getInitialState = function getInitialState(vnode, createStream) {
	  var dom = createStream(null);
	  var focus = createStream(false);
	  var inactive = createStream(false);
	  var mouseover = createStream(false);
	  return {
	    dom: dom,
	    focus: focus,
	    inactive: inactive,
	    mouseover: mouseover,
	    redrawOnUpdate: createStream.merge([dom, focus, inactive])
	  };
	};

	var onMount = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (attrs.borders !== undefined) {
	    deprecation("Button", {
	      option: "borders",
	      newOption: "border"
	    });
	  }

	  state.dom(vnode.dom);

	  if (isClient) {
	    var handleInactivate = function handleInactivate() {
	      return state.inactive(true), setTimeout(function () {
	        return state.inactive(false);
	      }, attrs.inactivate * 1000);
	    };

	    var onFocus = function onFocus() {
	      return state.focus(!state.mouseover());
	    };

	    var onBlur = function onBlur() {
	      return state.focus(false);
	    };

	    var onMouseOver = function onMouseOver() {
	      return state.mouseover(true);
	    };

	    var onMouseOut = function onMouseOut() {
	      return state.mouseover(false);
	    };

	    var onClick = handleInactivate;
	    vnode.dom.addEventListener("focus", onFocus, false);
	    vnode.dom.addEventListener("blur", onBlur, false);
	    vnode.dom.addEventListener("mouseover", onMouseOver, false);
	    vnode.dom.addEventListener("mouseout", onMouseOut, false);
	    vnode.dom.addEventListener("click", onClick, false);

	    state.removeEventListeners = function () {
	      return vnode.dom.removeEventListener("focus", onFocus, false), vnode.dom.removeEventListener("blur", onBlur, false), vnode.dom.removeEventListener("mouseover", onBlur, false), vnode.dom.removeEventListener("mouseout", onMouseOut, false), vnode.dom.removeEventListener("click", onClick, false);
	    };
	  }
	};

	var onUnMount = function onUnMount(vnode) {
	  return vnode.state.removeEventListeners && vnode.state.removeEventListeners();
	};

	var createProps = function createProps(vnode, _ref) {
	  var _ref2;

	  var k = _ref.keys;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var disabled = attrs.disabled;
	  var inactive = attrs.inactive || state.inactive();
	  var onClickHandler = attrs.events && attrs.events[k.onclick];
	  var onKeyUpHandler = attrs.events && attrs.events[k.onkeyup] || onClickHandler;
	  return _extends$2({}, filterSupportedAttributes(attrs, {
	    add: [k.formaction, "type"],
	    remove: ["style"]
	  }), // Set style on content, not on component
	  {
	    className: [classes.super, attrs.parentClassName || classes.component, attrs.contained ? classes.contained : null, attrs.raised ? classes.contained : null, attrs.raised ? classes.raised : null, attrs.selected ? classes.selected : null, attrs.highLabel ? classes.highLabel : null, attrs.extraWide ? classes.extraWide : null, disabled ? classes.disabled : null, inactive ? classes.inactive : null, attrs.separatorAtStart ? classes.separatorAtStart : null, attrs.border || attrs.borders ? classes.border : null, attrs.dropdown ? classes.hasDropdown : null, attrs.dropdown ? attrs.dropdown.open ? classes.dropdownOpen : classes.dropdownClosed : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events, inactive ? null : (_ref2 = {}, _defineProperty$2(_ref2, k.tabindex, disabled || inactive ? -1 : attrs[k.tabindex] || 0), _defineProperty$2(_ref2, k.onclick, onClickHandler), _defineProperty$2(_ref2, k.onkeyup, function (e) {
	    if (e.keyCode === 13 && state.focus()) {
	      state.focus(false);

	      if (onKeyUpHandler) {
	        onKeyUpHandler(e);
	      }
	    }
	  }), _ref2), attrs.url, disabled ? {
	    disabled: true
	  } : null);
	};

	var createContent = function createContent(vnode, _ref3) {
	  var _h;

	  var h = _ref3.renderer,
	      k = _ref3.keys,
	      Ripple = _ref3.Ripple,
	      Icon = _ref3.Icon,
	      Shadow = _ref3.Shadow;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var noink = attrs.ink !== undefined && attrs.ink === false;
	  var disabled = attrs.disabled;
	  var children = attrs.children || vnode.children;
	  var label = attrs.content ? attrs.content : attrs.label !== undefined ? _typeof$1(attrs.label) === "object" ? attrs.label : h("div", {
	    className: classes.label
	  }, h("div", {
	    className: classes.textLabel,
	    style: attrs.textStyle
	  }, attrs.label)) : children ? children : null;
	  var noWash = disabled || attrs.wash !== undefined && !attrs.wash;
	  return h("div", (_h = {}, _defineProperty$2(_h, k.class, classes.content), _defineProperty$2(_h, "style", attrs.style), _h), [h(Shadow, {
	    key: "shadow",
	    shadowDepth: attrs.shadowDepth !== undefined ? attrs.shadowDepth : 0,
	    animated: true
	  }), // Ripple
	  disabled || noink || !Ripple || (h["displayName"] === "react" ? !state.dom() : false) // somehow Mithril does not update when the dom stream is updated
	  ? null : h(Ripple, _extends$2({}, {
	    key: "ripple",
	    target: state.dom()
	  }, attrs.ripple)), // hover
	  noWash ? null : h("div", {
	    key: "wash",
	    className: classes.wash
	  }), label, attrs.dropdown ? h(Icon, {
	    className: classes.dropdown,
	    key: "dropdown",
	    svg: {
	      content: h.trust(iconDropdownDown)
	    }
	  }) : null]);
	};

	var button =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement,
	  getInitialState: getInitialState,
	  onMount: onMount,
	  onUnMount: onUnMount,
	  createProps: createProps,
	  createContent: createContent
	});
	var MAX_SHADOW_DEPTH = 5;

	var tapStart,
	    tapEndAll = function tapEndAll() {},
	    downButtons = [];

	var animateZ = function animateZ(which, vnode) {
	  var shadowDepthBase = vnode.state.shadowDepthBase;
	  var increase = vnode.attrs.increase || 1;
	  var shadowDepth = vnode.state.shadowDepth();
	  var newShadowDepth = which === "down" && shadowDepthBase < MAX_SHADOW_DEPTH ? Math.min(shadowDepthBase + increase, MAX_SHADOW_DEPTH) : which === "up" ? Math.max(shadowDepth - increase, shadowDepthBase) : shadowDepth;

	  if (newShadowDepth !== shadowDepth) {
	    vnode.state.shadowDepth(newShadowDepth);
	  }
	};

	var tapHandler = function tapHandler(which, vnode) {
	  if (which === "down") {
	    downButtons.push(_extends$2({}, vnode));
	  }

	  var animateOnTap = vnode.attrs.animateOnTap !== false ? true : false;

	  if (animateOnTap) {
	    animateZ(which, vnode);
	  }
	};

	var initTapEvents = function initTapEvents(vnode) {
	  if (isServer) return;

	  tapStart = function tapStart() {
	    return tapHandler("down", vnode);
	  };

	  tapEndAll = function tapEndAll() {
	    downButtons.map(function (buttonVnode) {
	      return tapHandler("up", buttonVnode);
	    });
	    downButtons = [];
	  };

	  pointerStartMoveEvent.forEach(function (evt) {
	    return vnode.dom.addEventListener(evt, tapStart);
	  });
	  pointerEndMoveEvent.forEach(function (evt) {
	    return document.addEventListener(evt, tapEndAll);
	  });
	};

	var clearTapEvents = function clearTapEvents(vnode) {
	  pointerStartMoveEvent.forEach(function (evt) {
	    return vnode.dom.removeEventListener(evt, tapStart);
	  });
	  pointerEndMoveEvent.forEach(function (evt) {
	    return document.removeEventListener(evt, tapEndAll);
	  });
	};

	var getInitialState$1 = function getInitialState(vnode, createStream) {
	  var attrs = vnode.attrs;
	  var shadowDepthBase = attrs.shadowDepth !== undefined ? attrs.shadowDepth : attrs.z !== undefined // deprecated
	  ? attrs.z : 1;
	  var shadowDepth = createStream(shadowDepthBase);
	  var tapEventsInited = createStream(false);
	  return {
	    shadowDepthBase: shadowDepthBase,
	    shadowDepth: shadowDepth,
	    tapEventsInited: tapEventsInited,
	    redrawOnUpdate: createStream.merge([shadowDepth])
	  };
	};

	var onMount$1 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (attrs.z !== undefined) {
	    deprecation("RaisedButton", {
	      option: "z",
	      newOption: "shadowDepth"
	    });
	  }

	  if (!state.tapEventsInited()) {
	    initTapEvents(vnode);
	    state.tapEventsInited(true);
	  }
	};

	var onUnMount$1 = function onUnMount(vnode) {
	  if (vnode.state.tapEventsInited()) {
	    clearTapEvents(vnode);
	  }
	};

	var createProps$1 = function createProps(vnode) {
	  var attrs = vnode.attrs;
	  var state = vnode.state;
	  var children = attrs.children || vnode.children || [];
	  return _objectSpread$2({
	    raised: true,
	    animateOnTap: false,
	    wash: attrs.wash !== undefined ? attrs.wash : false,
	    children: children
	  }, attrs, {
	    shadowDepth: attrs.disabled ? 0 : state.shadowDepth()
	  });
	};

	var createContent$1 = function createContent(vnode) {
	  return vnode.children;
	};

	var raisedButton =
	/*#__PURE__*/
	Object.freeze({
	  getInitialState: getInitialState$1,
	  onMount: onMount$1,
	  onUnMount: onUnMount$1,
	  createProps: createProps$1,
	  createContent: createContent$1
	});

	// @ts-check
	// Global style variables
	var grid_unit = 4;
	var grid_unit_component = 8;
	var increment = 7 * grid_unit_component; // 7 * 8 = 56

	var increment_large = 8 * grid_unit_component; // 8 * 8 = 64

	var vars = {
	  // grid
	  grid_unit: grid_unit,
	  grid_unit_component: grid_unit_component,
	  increment: increment,
	  increment_large: increment_large,
	  grid_unit_menu: 56,
	  grid_unit_icon_button: 6 * grid_unit_component,
	  // 48
	  // common sizes
	  unit_block_border_radius: 4,
	  unit_item_border_radius: 4,
	  unit_indent: 72,
	  unit_indent_large: 80,
	  unit_side_padding: 16,
	  // buttons
	  unit_touch_height: 48,
	  unit_icon_size_small: 2 * grid_unit_component,
	  // 16
	  unit_icon_size: 3 * grid_unit_component,
	  // 24
	  unit_icon_size_medium: 4 * grid_unit_component,
	  // 32
	  unit_icon_size_large: 5 * grid_unit_component,
	  // 40
	  // screen dimensions
	  unit_screen_size_extra_large: 1280,
	  unit_screen_size_large: 960,
	  unit_screen_size_medium: 480,
	  unit_screen_size_small: 320,
	  // transitions
	  animation_duration: ".18s",
	  animation_curve_slow_in_fast_out: "cubic-bezier(.4, 0, .2, 1)",
	  animation_curve_slow_in_linear_out: "cubic-bezier(0, 0, .2, 1)",
	  animation_curve_linear_in_fast_out: "cubic-bezier(.4, 0, 1, 1)",
	  animation_curve_default: "ease-out",
	  // font
	  font_weight_light: 300,
	  font_weight_normal: 400,
	  font_weight_medium: 500,
	  font_weight_bold: 700,
	  font_size_title: 20,
	  line_height: 1.5,
	  // base colors
	  color_primary: "33, 150, 243",
	  // blue 500
	  color_primary_active: "30, 136, 229",
	  // blue 600
	  color_primary_dark: "25, 118, 210",
	  // blue 700
	  color_primary_faded: "100, 181, 249",
	  // blue 300
	  color_primary_foreground: "255, 255, 255",
	  color_light_background: "255, 255, 255",
	  color_light_foreground: "0, 0, 0",
	  color_dark_background: "34, 34, 34",
	  color_dark_foreground: "255, 255, 255",
	  // blends
	  blend_light_text_primary: .87,
	  blend_light_text_regular: .73,
	  blend_light_text_secondary: .54,
	  blend_light_text_tertiary: .40,
	  blend_light_text_disabled: .26,
	  blend_light_border_medium: .24,
	  blend_light_border_light: .11,
	  blend_light_background_active: .14,
	  blend_light_background_hover: .06,
	  blend_light_background_hover_medium: .12,
	  // for the lighter tinted icon buttons
	  blend_light_background_disabled: .09,
	  blend_light_overlay_background: .3,
	  blend_dark_text_primary: 1,
	  blend_dark_text_regular: .87,
	  blend_dark_text_secondary: .70,
	  blend_dark_text_tertiary: .40,
	  blend_dark_text_disabled: .26,
	  blend_dark_border_medium: .22,
	  blend_dark_border_light: .10,
	  blend_dark_background_active: .14,
	  blend_dark_background_hover: .08,
	  blend_dark_background_hoverMedium: .12,
	  // for the lighter tinted icon buttons
	  blend_dark_background_disabled: .12,
	  blend_dark_overlay_background: .3,

	  /*
	  Breakpoints
	  Specs: https://material.io/guidelines/layout/responsive-ui.html#responsive-ui-breakpoints
	  Breakbpoint naming: inspiration from
	  https://medium.freecodecamp.org/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862
	  */
	  breakpoint_for_phone_only: 599,
	  // set max-width  cols: 4,  gutter: 16
	  breakpoint_for_tablet_portrait_up: 600,
	  // set min-width  cols: 8,  gutter: 24
	  breakpoint_for_tablet_landscape_up: 840,
	  // etc.           cols: 12, gutter: 24
	  breakpoint_for_desktop_up: 1280,
	  breakpoint_for_big_desktop_up: 1600,
	  breakpoint_for_tv_up: 1920,
	  // z-index
	  z_toolbar: 100,
	  z_menu: 1000,
	  z_app_bar: 2000,
	  z_drawer: 3000,
	  z_notification: 5000,
	  z_dialog: 7000
	}; // @ts-check

	function _defineProperty$3(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$3(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$3(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var ANIMATION_END_EVENT = getAnimationEndEvent();
	var DEFAULT_START_OPACITY = 0.2;
	var DEFAULT_END_OPACITY = 0.0;
	var DEFAULT_START_SCALE = 0.1;
	var DEFAULT_END_SCALE = 2.0;
	var OPACITY_DECAY_VELOCITY = 0.35;

	var addStyleToHead = function addStyleToHead(id, stylesheet) {
	  if (isServer) return;
	  var documentRef = window.document;
	  var styleEl = documentRef.createElement("style");
	  styleEl.setAttribute("id", id);
	  styleEl.appendChild(documentRef.createTextNode(stylesheet));
	  documentRef.head.appendChild(styleEl);
	};

	var removeStyleFromHead = function removeStyleFromHead(id) {
	  if (isServer) return;
	  var el = document.getElementById(id);

	  if (el && el.parentNode) {
	    el.parentNode.removeChild(el);
	  }
	};

	var animation = function animation(_ref) {
	  var e = _ref.e,
	      id = _ref.id,
	      el = _ref.el,
	      attrs = _ref.attrs,
	      classes = _ref.classes;
	  return new Promise(function (resolve) {
	    var container = document.createElement("div");
	    container.setAttribute("class", classes.mask);
	    el.appendChild(container);
	    var waves = document.createElement("div");
	    waves.setAttribute("class", classes.waves);
	    container.appendChild(waves);
	    var rect = el.getBoundingClientRect();
	    var x = isTouch && e.touches ? e.touches[0].pageX : e.clientX;
	    var y = isTouch && e.touches ? e.touches[0].pageY : e.clientY;
	    var w = el.offsetWidth;
	    var h = el.offsetHeight;
	    var waveRadius = Math.sqrt(w * w + h * h);
	    var mx = attrs.center ? rect.left + rect.width / 2 : x;
	    var my = attrs.center ? rect.top + rect.height / 2 : y;
	    var rx = mx - rect.left - waveRadius / 2;
	    var ry = my - rect.top - waveRadius / 2;
	    var startOpacity = attrs.startOpacity !== undefined ? attrs.startOpacity : DEFAULT_START_OPACITY;
	    var opacityDecayVelocity = attrs.opacityDecayVelocity !== undefined ? attrs.opacityDecayVelocity : OPACITY_DECAY_VELOCITY;
	    var endOpacity = attrs.endOpacity || DEFAULT_END_OPACITY;
	    var startScale = attrs.startScale || DEFAULT_START_SCALE;
	    var endScale = attrs.endScale || DEFAULT_END_SCALE;
	    var duration = attrs.duration ? attrs.duration : 1 / opacityDecayVelocity * 0.2;
	    var color = window.getComputedStyle(el).color;
	    var style = waves.style;
	    style.width = style.height = waveRadius + "px";
	    style.top = ry + "px";
	    style.left = rx + "px";
	    style["animation-duration"] = style["-webkit-animation-duration"] = style["-moz-animation-duration"] = style["-o-animation-duration"] = duration + "s";
	    style.backgroundColor = color;
	    style.opacity = startOpacity;
	    style.animationName = id;
	    style.animationTimingFunction = attrs.animationTimingFunction || vars.animation_curve_default;
	    var rippleStyleSheet = "@keyframes ".concat(id, " {\n      0% {\n        transform:scale(").concat(startScale, ");\n        opacity: ").concat(startOpacity, "\n      }\n      100% {\n        transform:scale(").concat(endScale, ");\n        opacity: ").concat(endOpacity, ";\n      }\n    }");
	    addStyleToHead(id, rippleStyleSheet);

	    var animationDone = function animationDone(evt) {
	      removeStyleFromHead(id);
	      waves.removeEventListener(ANIMATION_END_EVENT, animationDone, false);

	      if (attrs.persistent) {
	        style.opacity = endOpacity;
	        style.transform = "scale(" + endScale + ")";
	      } else {
	        waves.classList.remove(classes.wavesAnimating);
	        container.removeChild(waves);
	        el.removeChild(container);
	      }

	      resolve(evt);
	    };

	    waves.addEventListener(ANIMATION_END_EVENT, animationDone, false);
	    waves.classList.add(classes.wavesAnimating);
	  });
	};

	var classes$1 = {
	  component: "pe-ripple",
	  // elements
	  mask: "pe-ripple__mask",
	  waves: "pe-ripple__waves",
	  // states
	  unconstrained: "pe-ripple--unconstrained",
	  wavesAnimating: "pe-ripple__waves--animating"
	};

	var getElement$1 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var getInitialState$2 = function getInitialState() {
	  return {
	    animations: {},
	    animating: false,
	    cleanUp: undefined
	  };
	};

	var createProps$2 = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _objectSpread$3({}, filterSupportedAttributes(attrs), {
	    className: [classes$1.component, attrs.unconstrained ? classes$1.unconstrained : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var updateAnimationState = function updateAnimationState(state) {
	  return state.animating = Object.keys(state.animations).length > 0;
	};

	var onMount$2 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  if (isServer) {
	    return;
	  }

	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  var tap = function tap(e) {
	    if (attrs.disabled || !attrs.multi && state.animating) {
	      return;
	    }

	    if (attrs.start) {
	      attrs.start(e);
	    }

	    var id = "ripple_animation_".concat(new Date().getTime());
	    state.animations[id] = animation({
	      e: e,
	      id: id,
	      el: vnode.dom,
	      attrs: attrs,
	      classes: classes$1
	    }).then(function (evt) {
	      if (attrs.end) {
	        attrs.end(evt);
	      }

	      delete state.animations[id];
	      updateAnimationState(state);
	    });
	    updateAnimationState(state);
	  };

	  var triggerEl = attrs.target ? attrs.target : vnode.dom && vnode.dom.parentElement;

	  if (triggerEl) {
	    pointerEndEvent.forEach(function (evt) {
	      return triggerEl.addEventListener(evt, tap, false);
	    });
	  }

	  state.cleanUp = function () {
	    if (triggerEl) {
	      pointerEndEvent.forEach(function (evt) {
	        return triggerEl.removeEventListener(evt, tap, false);
	      });
	    }
	  };
	};

	var onUnMount$2 = function onUnMount(_ref2) {
	  var state = _ref2.state;
	  return state.cleanUp && state.cleanUp();
	};

	var ripple =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$1,
	  getInitialState: getInitialState$2,
	  createProps: createProps$2,
	  onMount: onMount$2,
	  onUnMount: onUnMount$2
	});

	var Ripple = ComponentCreator(ripple);
	Ripple["displayName"] = "Ripple";

	function _extends$3() {
	  _extends$3 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$3.apply(this, arguments);
	}

	var classes$2 = {
	  component: "pe-icon",
	  // states
	  avatar: "pe-icon--avatar",
	  large: "pe-icon--large",
	  medium: "pe-icon--medium",
	  regular: "pe-icon--regular",
	  small: "pe-icon--small"
	};

	var getElement$2 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var createProps$3 = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _extends$3({}, filterSupportedAttributes(attrs), {
	    className: [classes$2.component, classForSize(classes$2, attrs.size), attrs.avatar ? classes$2.avatar : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events);
	};

	var createContent$2 = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer,
	      SVG = _ref2.SVG;
	  var attrs = vnode.attrs;
	  return attrs.content ? attrs.content : attrs.svg ? h(SVG, attrs.svg) : attrs.src ? h("img", {
	    src: attrs.src
	  }) : attrs.children || vnode.children;
	};

	var icon =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$2,
	  createProps: createProps$3,
	  createContent: createContent$2
	});

	function _extends$4() {
	  _extends$4 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$4.apply(this, arguments);
	}

	var classes$3 = {
	  component: "pe-svg"
	};

	var getElement$3 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var onMount$3 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  } // Prevent that SVG gets keyboard focus


	  var elem = vnode.dom.querySelector("svg");

	  if (elem) {
	    elem.setAttribute("focusable", "false");
	  }
	};

	var createProps$4 = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _extends$4({}, filterSupportedAttributes(attrs), {
	    className: [classes$3.component, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$3 = function createContent(vnode) {
	  var attrs = vnode.attrs;
	  return attrs.content ? attrs.content : attrs.children || vnode.children || attrs;
	};

	var svg =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$3,
	  onMount: onMount$3,
	  createProps: createProps$4,
	  createContent: createContent$3
	});

	var SVG = ComponentCreator(svg);
	SVG["displayName"] = "SVG";

	function _defineProperty$4(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$4(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$4(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var Icon = ComponentCreator(_objectSpread$4({}, icon, {
	  createProps: function createProps(vnode, args) {
	    return icon.createProps(vnode, _objectSpread$4({}, args, {
	      SVG: SVG
	    }));
	  },
	  createContent: function createContent(vnode, args) {
	    return icon.createContent(vnode, _objectSpread$4({}, args, {
	      SVG: SVG
	    }));
	  }
	}));
	Icon["displayName"] = "Icon";

	function _extends$5() {
	  _extends$5 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$5.apply(this, arguments);
	}

	var classes$4 = {
	  component: "pe-shadow",
	  // elements
	  bottomShadow: "pe-shadow__bottom",
	  topShadow: "pe-shadow__top",
	  // states
	  animated: "pe-shadow--animated",
	  depth_n: "pe-shadow--depth-"
	};

	var getElement$4 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var onMount$4 = function onMount(_ref) {
	  var attrs = _ref.attrs;

	  if (attrs.z !== undefined) {
	    deprecation("Shadow", {
	      option: "z",
	      newOption: "shadowDepth"
	    });
	  }
	};

	var createProps$5 = function createProps(vnode, _ref2) {
	  var k = _ref2.keys;
	  var attrs = vnode.attrs;
	  return _extends$5({}, filterSupportedAttributes(attrs), {
	    className: [classes$4.component, attrs.animated && classes$4.animated, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$4 = function createContent(vnode, _ref3) {
	  var h = _ref3.renderer;
	  var attrs = vnode.attrs;
	  var content = attrs.content ? attrs.content : attrs.children || vnode.children;
	  var shadowDepth = attrs.shadowDepth !== undefined ? attrs.shadowDepth : attrs.z; // deprecated

	  var depthClass = shadowDepth !== undefined ? "".concat(classes$4.depth_n).concat(Math.min(5, shadowDepth)) : null;
	  return [content, h("div", {
	    key: "bottom",
	    className: [classes$4.bottomShadow, depthClass].join(" ")
	  }), h("div", {
	    key: "top",
	    className: [classes$4.topShadow, depthClass].join(" ")
	  })];
	};

	var shadow =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$4,
	  onMount: onMount$4,
	  createProps: createProps$5,
	  createContent: createContent$4
	});

	var Shadow = ComponentCreator(shadow);
	Shadow["displayName"] = "Shadow";

	function _defineProperty$5(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$5(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$5(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var TextButton = ComponentCreator(_objectSpread$5({}, button, {
	  createProps: function createProps(vnode, args) {
	    return button.createProps(vnode, _objectSpread$5({}, args, {
	      Ripple: Ripple,
	      Icon: Icon,
	      Shadow: Shadow
	    }));
	  },
	  createContent: function createContent(vnode, args) {
	    return button.createContent(vnode, _objectSpread$5({}, args, {
	      Ripple: Ripple,
	      Icon: Icon,
	      Shadow: Shadow
	    }));
	  }
	}));
	TextButton["displayName"] = "TextButton";
	var RaisedButton = ComponentCreator(_objectSpread$5({}, raisedButton, {
	  createProps: function createProps(vnode, args) {
	    return raisedButton.createProps(vnode, _objectSpread$5({}, args, {
	      Shadow: Shadow
	    }));
	  },
	  createContent: function createContent(vnode, args) {
	    return raisedButton.createContent(vnode, _objectSpread$5({}, args, {
	      Shadow: Shadow
	    }));
	  },
	  component: TextButton
	}));
	RaisedButton["displayName"] = "RaisedButton"; // @ts-check

	var Button = ComponentCreator({
	  /**
	   * @param {Vnode} vnode
	   */
	  view: function view(vnode) {
	    return renderer(vnode.attrs.raised ? RaisedButton : TextButton, vnode.attrs, vnode.children);
	  }
	});
	Button["displayName"] = "Button";

	function _extends$6() {
	  _extends$6 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$6.apply(this, arguments);
	}

	var classes$5 = {
	  component: "pe-button-group"
	};

	var createProps$6 = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _extends$6({}, {
	    className: [classes$5.component, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$5 = function createContent(vnode) {
	  return vnode.children;
	};

	var buttonGroup =
	/*#__PURE__*/
	Object.freeze({
	  createProps: createProps$6,
	  createContent: createContent$5
	});

	var ButtonGroup = ComponentCreator(buttonGroup);
	ButtonGroup["displayName"] = "ButtonGroup";

	function _extends$7() {
	  _extends$7 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$7.apply(this, arguments);
	}

	var classes$6 = {
	  component: "pe-card",
	  // elements
	  actions: "pe-card__actions",
	  any: "pe-card__any",
	  content: "pe-card__content",
	  header: "pe-card__header",
	  headerTitle: "pe-card__header-title",
	  media: "pe-card__media",
	  mediaDimmer: "pe-card__media__dimmer",
	  overlay: "pe-card__overlay",
	  overlayContent: "pe-card__overlay__content",
	  primary: "pe-card__primary",
	  primaryMedia: "pe-card__primary-media",
	  subtitle: "pe-card__subtitle",
	  text: "pe-card__text",
	  title: "pe-card__title",
	  // states
	  actionsBorder: "pe-card__actions--border",
	  actionsHorizontal: "pe-card__actions--horizontal",
	  actionsJustified: "pe-card__actions--justified",
	  actionsTight: "pe-card__actions--tight",
	  actionsVertical: "pe-card__actions--vertical",
	  mediaCropX: "pe-card__media--crop-x",
	  mediaCropY: "pe-card__media--crop-y",
	  mediaOriginStart: "pe-card__media--origin-start",
	  mediaOriginCenter: "pe-card__media--origin-center",
	  mediaOriginEnd: "pe-card__media--origin-end",
	  mediaLarge: "pe-card__media--large",
	  mediaMedium: "pe-card__media--medium",
	  mediaRatioLandscape: "pe-card__media--landscape",
	  mediaRatioSquare: "pe-card__media--square",
	  mediaRegular: "pe-card__media--regular",
	  mediaSmall: "pe-card__media--small",
	  overlaySheet: "pe-card__overlay--sheet",
	  primaryHasMedia: "pe-card__primary--media",
	  primaryTight: "pe-card__primary--tight",
	  textTight: "pe-card__text--tight"
	};

	var createOverlay = function createOverlay(_ref) {
	  var dispatcher = _ref.dispatcher,
	      attrs = _ref.attrs,
	      h = _ref.h,
	      k = _ref.k;
	  var element = attrs.element || "div";
	  var content = attrs.content.map(dispatcher);
	  return h("div", {
	    key: attrs.key || "card-overlay",
	    style: attrs.style,
	    className: [classes$6.overlay, attrs.sheet ? classes$6.overlaySheet : null, attrs.tone === "light" ? null : "pe-dark-tone", // default dark tone
	    attrs.tone === "light" ? "pe-light-tone" : null].join(" ")
	  }, [h(element, {
	    key: "content",
	    className: [classes$6.overlayContent, attrs.className || attrs[k.class]].join(" ")
	  }, content), h("div", {
	    key: "dimmer",
	    className: classes$6.mediaDimmer
	  })]);
	};

	var createAny = function createAny(_ref2) {
	  var attrs = _ref2.attrs,
	      h = _ref2.h,
	      k = _ref2.k;
	  var element = attrs.element || "div";
	  return h(element, _extends$7({}, filterSupportedAttributes(attrs), {
	    key: attrs.key || "card-any",
	    className: [classes$6.any, attrs.tight ? classes$6.textTight : null, attrs.className || attrs[k.class]].join(" ")
	  }), attrs.content);
	};

	var createText = function createText(_ref3) {
	  var attrs = _ref3.attrs,
	      h = _ref3.h,
	      k = _ref3.k;
	  var element = attrs.element || "div";
	  return h(element, _extends$7({}, filterSupportedAttributes(attrs), {
	    key: attrs.key || "card-text",
	    className: [classes$6.text, attrs.tight ? classes$6.textTight : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events), attrs.content);
	};

	var createHeader = function createHeader(_ref4) {
	  var attrs = _ref4.attrs,
	      h = _ref4.h,
	      k = _ref4.k,
	      Icon = _ref4.Icon,
	      ListTile = _ref4.ListTile;
	  return h(ListTile, _extends$7({}, attrs, {
	    key: attrs.key || "card-header",
	    className: [classes$6.header, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.icon ? {
	    front: h(Icon, attrs.icon)
	  } : null));
	};

	var getElement$5 = function getElement(vnode) {
	  return vnode.attrs.element || vnode.attrs.url ? "a" : "div";
	};

	var onMount$5 = function onMount(_ref5) {
	  var attrs = _ref5.attrs;

	  if (attrs.z !== undefined) {
	    deprecation("Card", {
	      option: "z",
	      newOption: "shadowDepth"
	    });
	  }

	  if (attrs.content && !Array.isArray(attrs.content)) {
	    deprecation("Card", {
	      message: "option 'content' is restricted to contain only the list of option objects for distinct card areas. To pass other content, use 'children'."
	    });
	  }
	};

	var createProps$7 = function createProps(vnode, _ref6) {
	  var k = _ref6.keys;
	  var attrs = vnode.attrs;
	  return _extends$7({}, filterSupportedAttributes(attrs), {
	    className: [classes$6.component, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.url, attrs.events);
	};

	var createContent$6 = function createContent(vnode, _ref7) {
	  var h = _ref7.renderer,
	      k = _ref7.keys,
	      CardActions = _ref7.CardActions,
	      CardMedia = _ref7.CardMedia,
	      CardPrimary = _ref7.CardPrimary,
	      Icon = _ref7.Icon,
	      Shadow = _ref7.Shadow,
	      ListTile = _ref7.ListTile;

	  var dispatcher = function dispatcher(block) {
	    var key = Object.keys(block)[0];

	    var attrs = _extends$7({}, block[key], {
	      dispatcher: dispatcher,
	      key: key
	    });

	    switch (key) {
	      case "actions":
	        return h(CardActions, attrs);

	      case "header":
	        return createHeader({
	          attrs: attrs,
	          h: h,
	          k: k,
	          Icon: Icon,
	          ListTile: ListTile
	        });

	      case "media":
	        return h(CardMedia, attrs);

	      case "overlay":
	        return createOverlay({
	          dispatcher: dispatcher,
	          attrs: attrs,
	          h: h,
	          k: k
	        });

	      case "primary":
	        return h(CardPrimary, attrs);

	      case "text":
	        return createText({
	          attrs: attrs,
	          h: h,
	          k: k
	        });

	      case "any":
	        return createAny({
	          attrs: attrs,
	          h: h,
	          k: k
	        });

	      default:
	        throw "Content type \"".concat(key, "\" does not exist");
	    }
	  };

	  var attrs = vnode.attrs;
	  var contents = Array.isArray(attrs.content) ? attrs.content.map(dispatcher) : attrs.content; // deprecated

	  var shadowDepth = attrs.shadowDepth !== undefined ? attrs.shadowDepth : attrs.z; // deprecated

	  var children = attrs.children || vnode.children;
	  return [h(Shadow, {
	    shadowDepth: shadowDepth !== undefined ? shadowDepth : 1,
	    animated: true,
	    key: "shadow"
	  }), h("div", {
	    className: classes$6.content,
	    key: "content"
	  }, contents), children];
	};

	var card =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$5,
	  onMount: onMount$5,
	  createProps: createProps$7,
	  createContent: createContent$6
	});
	var buttonClasses = {
	  component: "pe-text-button",
	  super: "pe-button",
	  row: "pe-button-row",
	  // elements      
	  content: "pe-button__content",
	  label: "pe-button__label",
	  textLabel: "pe-button__text-label",
	  wash: "pe-button__wash",
	  dropdown: "pe-button__dropdown",
	  // states      
	  border: "pe-button--border",
	  contained: "pe-button--contained",
	  disabled: "pe-button--disabled",
	  dropdownClosed: "pe-button--dropdown-closed",
	  dropdownOpen: "pe-button--dropdown-open",
	  extraWide: "pe-button--extra-wide",
	  hasDropdown: "pe-button--dropdown",
	  highLabel: "pe-button--high-label",
	  inactive: "pe-button--inactive",
	  raised: "pe-button--raised",
	  selected: "pe-button--selected",
	  separatorAtStart: "pe-button--separator-start"
	};

	var getElement$1$1 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var actionLayoutClasses = {
	  horizontal: classes$6.actionsHorizontal,
	  vertical: classes$6.actionsVertical,
	  justified: classes$6.actionsJustified
	};

	var onMount$1$1 = function onMount(_ref) {
	  var attrs = _ref.attrs;

	  if (attrs.bordered !== undefined) {
	    deprecation("Card", {
	      option: "bordered",
	      newOption: "border"
	    });
	  }
	};

	var actionClassForLayout = function actionClassForLayout() {
	  var layout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "horizontal";
	  return actionLayoutClasses[layout];
	};

	var createProps$1$1 = function createProps(vnode, _ref2) {
	  var k = _ref2.keys;
	  var attrs = vnode.attrs;
	  return _extends$7({}, filterSupportedAttributes(attrs), {
	    key: "card-actions",
	    className: [classes$6.actions, attrs.layout !== "vertical" ? buttonClasses.row : null, actionClassForLayout(attrs.layout), attrs.border || attrs.bordered ? classes$6.actionsBorder : null, attrs.tight ? classes$6.actionsTight : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events);
	};

	var createContent$1$1 = function createContent(vnode) {
	  return vnode.attrs.content || vnode.children;
	};

	var cardActions =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$1$1,
	  onMount: onMount$1$1,
	  createProps: createProps$1$1,
	  createContent: createContent$1$1
	});

	var getElement$2$1 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var imageRatios = {
	  landscape: 16 / 9,
	  square: 1
	};
	var mediaSizeClasses = {
	  small: classes$6.mediaSmall,
	  regular: classes$6.mediaRegular,
	  medium: classes$6.mediaMedium,
	  large: classes$6.mediaLarge
	};

	var mediaSizeClass = function mediaSizeClass() {
	  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "regular";
	  return mediaSizeClasses[size];
	};

	var initImage = function initImage(_ref) {
	  var dom = _ref.dom,
	      img = _ref.img,
	      ratio = _ref.ratio,
	      origin = _ref.origin;

	  img.onload = function () {
	    // use a background image on the image container
	    if (img.tagName === "IMG") {
	      dom.style.backgroundImage = "url(".concat(img.src, ")");
	    }

	    var naturalRatio = this.naturalWidth / this.naturalHeight; // crop-x: crop over x axis
	    // crop-y: crop over y axis

	    var cropClass = naturalRatio < imageRatios[ratio] ? classes$6.mediaCropX : classes$6.mediaCropY;
	    dom.classList.add(cropClass);
	    var originClass = origin === "start" ? classes$6.mediaOriginStart : origin === "end" ? classes$6.mediaOriginEnd : classes$6.mediaOriginCenter;
	    dom.classList.add(originClass);
	  };
	};

	var onMount$2$1 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var attrs = vnode.attrs;
	  var ratio = attrs.ratio || "landscape";
	  var origin = attrs.origin || "center";
	  var dom = vnode.dom;
	  var img = dom.querySelector("img") || dom.querySelector("iframe");
	  initImage({
	    dom: dom,
	    img: img,
	    ratio: ratio,
	    origin: origin
	  });
	};

	var createProps$2$1 = function createProps(vnode, _ref2) {
	  var k = _ref2.keys;
	  var attrs = vnode.attrs;
	  var ratio = attrs.ratio || "landscape";
	  return _extends$7({}, filterSupportedAttributes(attrs), {
	    key: "card-media",
	    className: [classes$6.media, mediaSizeClass(attrs.size), ratio === "landscape" ? classes$6.mediaRatioLandscape : classes$6.mediaRatioSquare, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events);
	};

	var createContent$2$1 = function createContent(vnode, _ref3) {
	  var h = _ref3.renderer;
	  var attrs = vnode.attrs;
	  var dispatcher = attrs.dispatcher;
	  return [_extends$7({}, attrs.content, {
	    key: "content"
	  }), attrs.overlay ? dispatcher({
	    overlay: attrs.overlay,
	    key: "overlay"
	  }) : attrs.showDimmer && h("div", {
	    className: classes$6.mediaDimmer,
	    key: "dimmer"
	  })];
	};

	var cardMedia =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$2$1,
	  onMount: onMount$2$1,
	  createProps: createProps$2$1,
	  createContent: createContent$2$1
	});

	var getElement$3$1 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var createProps$3$1 = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  var primaryHasMedia = Array.isArray(attrs.content) ? attrs.content.reduce(function (total, current) {
	    return Object.keys(current)[0] === "media" ? true : total;
	  }, false) : attrs.media || false;
	  return _extends$7({}, filterSupportedAttributes(attrs), {
	    key: "card-primary",
	    className: [classes$6.primary, attrs.tight ? classes$6.primaryTight : null, primaryHasMedia ? classes$6.primaryHasMedia : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events);
	};

	var createContent$3$1 = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer;
	  var attrs = vnode.attrs;
	  var dispatcher = attrs.dispatcher;
	  var primaryDispatch = {
	    title: function title(pAttrs) {
	      return pAttrs.attrs || pAttrs.props ? pAttrs || pAttrs.props : h("div", {
	        className: classes$6.title,
	        key: "title",
	        style: pAttrs.style
	      }, [pAttrs.title, pAttrs.subtitle ? h("div", {
	        className: classes$6.subtitle,
	        key: "subtitle"
	      }, pAttrs.subtitle) : null]);
	    },
	    media: function media(pAttrs) {
	      return h("div", {
	        className: classes$6.primaryMedia,
	        key: "media",
	        style: pAttrs.style
	      }, dispatcher({
	        media: pAttrs
	      }));
	    },
	    actions: function actions(pAttrs) {
	      return dispatcher({
	        actions: pAttrs
	      });
	    }
	  };
	  return Array.isArray(attrs.content) ? attrs.content.map(function (block) {
	    var key = Object.keys(block)[0];
	    var pAttrs = block[key];
	    return primaryDispatch[key] ? primaryDispatch[key](pAttrs) : block;
	  }) : [attrs.title ? primaryDispatch.title({
	    title: attrs.title,
	    subtitle: attrs.subtitle,
	    key: "title"
	  }) : null, attrs.media ? primaryDispatch.media(attrs.media) : null, attrs.actions ? primaryDispatch.actions(attrs.actions) : null, attrs.content];
	};

	var cardPrimary =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$3$1,
	  createProps: createProps$3$1,
	  createContent: createContent$3$1
	});

	function _defineProperty$6(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$8() {
	  _extends$8 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$8.apply(this, arguments);
	}

	var classes$7 = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};

	var getElement$6 = function getElement() {
	  return "div";
	}; // because primary or secondary content can be an "a", the container is always defined as "div", and option `element` is passed to primary content


	var primaryContent = function primaryContent(h, k, requiresKeys, attrs, children) {
	  var url = attrs.keyboardControl ? null : attrs.url;
	  var element = attrs.element ? attrs.element : url ? "a" : "div";
	  var contentFrontClass = [classes$7.content, classes$7.contentFront, attrs.compactFront ? classes$7.compactFront : null].join(" ");
	  var frontComp = attrs.front ? h("div", _extends$8({}, requiresKeys ? {
	    key: "front"
	  } : null, {
	    className: contentFrontClass
	  }), attrs.front) : attrs.indent ? h("div", _extends$8({}, requiresKeys ? {
	    key: "front"
	  } : null, {
	    className: contentFrontClass
	  })) : null;
	  var hasTabIndex = !attrs.header && attrs.url;

	  var props = _extends$8({}, filterSupportedAttributes(attrs), attrs.events, requiresKeys ? {
	    key: "primary"
	  } : null, {
	    className: classes$7.primary,
	    style: null
	  }, hasTabIndex && _defineProperty$6({}, k.tabindex, attrs[k.tabindex] || 0), url);

	  var content = attrs.content ? attrs.content : [frontComp, h("div", {
	    className: classes$7.content,
	    style: attrs.style
	  }, [attrs.title && !attrs.content ? h("div", _extends$8({}, requiresKeys ? {
	    key: "title"
	  } : null, {
	    className: classes$7.title
	  }), attrs.title) : null, attrs.subtitle ? h("div", _extends$8({}, requiresKeys ? {
	    key: "subtitle"
	  } : null, {
	    className: classes$7.subtitle
	  }), attrs.subtitle) : null, attrs.highSubtitle ? h("div", _extends$8({}, requiresKeys ? {
	    key: "highSubtitle"
	  } : null, {
	    className: classes$7.subtitle + " " + classes$7.highSubtitle
	  }), attrs.highSubtitle) : null, attrs.subContent ? h("div", _extends$8({}, requiresKeys ? {
	    key: "subContent"
	  } : null, {
	    className: classes$7.subContent
	  }), attrs.subContent) : null, children])];
	  return h(element, props, content);
	};

	var secondaryContent = function secondaryContent(h, k, requiresKeys, Icon) {
	  var attrs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
	  var url = attrs.keyboardControl ? null : attrs.url;
	  var element = attrs.element ? attrs.element : url ? "a" : "div";
	  var hasTabIndex = attrs.url;
	  return h(element, _extends$8({}, url, {
	    className: classes$7.secondary
	  }, attrs.events, requiresKeys ? {
	    key: "secondary"
	  } : null, filterSupportedAttributes(attrs), hasTabIndex && _defineProperty$6({}, k.tabindex, attrs[k.tabindex] || 0)), h("div", {
	    className: classes$7.content
	  }, [attrs.icon ? h(Icon, attrs.icon) : null, attrs.content ? attrs.content : null]));
	};

	var createProps$8 = function createProps(vnode, _ref3) {
	  var k = _ref3.keys;
	  var attrs = vnode.attrs;
	  var hasTabIndex = !attrs.header && !attrs.url && !(attrs.secondary && attrs.secondary.url);
	  var heightClass = attrs.subtitle ? classes$7.hasSubtitle : attrs.highSubtitle ? classes$7.hasHighSubtitle : attrs.front || attrs.indent ? classes$7.hasFront : null;
	  return _extends$8({}, filterSupportedAttributes(attrs, {
	    remove: ["tabindex", "tabIndex"]
	  }), // tabindex is set elsewhere
	  {
	    className: [classes$7.component, attrs.selected ? classes$7.selected : null, attrs.disabled ? classes$7.disabled : null, attrs.sticky ? classes$7.sticky : null, attrs.compact ? classes$7.compact : null, attrs.hoverable ? classes$7.hoverable : null, attrs.selectable ? classes$7.selectable : null, attrs.highlight ? classes$7.highlight : null, attrs.rounded ? classes$7.rounded : null, attrs.header ? classes$7.header : null, attrs.inset || attrs.insetH ? classes$7.insetH : null, attrs.inset || attrs.insetV ? classes$7.insetV : null, attrs.navigation ? classes$7.navigation : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, heightClass, attrs.className || attrs[k.class]].join(" ")
	  }, hasTabIndex && _defineProperty$6({}, k.tabindex, attrs[k.tabindex] || 0) // events and url are attached to primary content to not interfere with controls
	  );
	};

	var createContent$7 = function createContent(vnode, _ref5) {
	  var h = _ref5.renderer,
	      requiresKeys = _ref5.requiresKeys,
	      k = _ref5.keys,
	      Ripple = _ref5.Ripple,
	      Icon = _ref5.Icon;
	  var attrs = vnode.attrs;

	  var primaryAttrs = _extends$8({}, requiresKeys ? {
	    key: "primary"
	  } : null, attrs);

	  delete primaryAttrs.id;
	  delete primaryAttrs[k.class];
	  return [attrs.ink && !attrs.disabled ? h(Ripple, _extends$8({}, attrs.ripple, requiresKeys ? {
	    key: "ripple"
	  } : null)) : null, primaryContent(h, k, requiresKeys, primaryAttrs, attrs.children || vnode.children), attrs.secondary ? secondaryContent(h, k, requiresKeys, Icon, attrs.secondary) : null];
	};

	var listTile =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$6,
	  createProps: createProps$8,
	  createContent: createContent$7
	});

	function _defineProperty$7(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$6(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$7(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var ListTile = ComponentCreator(_objectSpread$6({}, listTile, {
	  createProps: function createProps(vnode, args) {
	    return listTile.createProps(vnode, _objectSpread$6({}, args, {
	      Icon: Icon,
	      Ripple: Ripple
	    }));
	  },
	  createContent: function createContent(vnode, args) {
	    return listTile.createContent(vnode, _objectSpread$6({}, args, {
	      Icon: Icon,
	      Ripple: Ripple
	    }));
	  }
	}));
	ListTile["displayName"] = "ListTile";

	function _defineProperty$8(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$7(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$8(target, key, source[key]);
	    });
	  }

	  return target;
	} // @ts-check


	var CardActions = ComponentCreator(cardActions);
	CardActions["displayName"] = "CardActions"; // @ts-check

	var CardMedia = ComponentCreator(cardMedia);
	CardMedia["displayName"] = "CardMedia"; // @ts-check

	var CardPrimary = ComponentCreator(cardPrimary);
	CardPrimary["displayName"] = "CardPrimary";
	var Card = ComponentCreator(_objectSpread$7({}, card, {
	  createContent: function createContent(vnode, args) {
	    return card.createContent(vnode, _objectSpread$7({}, args, {
	      CardActions: CardActions,
	      CardMedia: CardMedia,
	      CardPrimary: CardPrimary,
	      Icon: Icon,
	      ListTile: ListTile,
	      Shadow: Shadow
	    }));
	  }
	}));
	Card["displayName"] = "Card";

	function _extends$9() {
	  _extends$9 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$9.apply(this, arguments);
	}

	var classes$8 = {
	  component: "pe-checkbox-control"
	};
	var iconOn = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\"/></svg>";
	var iconOff = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z\"/></svg>";
	var icons = {
	  iconOff: iconOff,
	  iconOn: iconOn
	}; // Props to be passed to a selection control

	var createProps$9 = function createProps(vnode) {
	  var attrs = vnode.attrs;
	  return _extends$9({}, attrs, {
	    icons: icons,
	    selectable: attrs.selectable || function () {
	      return true;
	    },
	    // default: always selectable, regardless the checked state
	    instanceClass: classes$8.component,
	    type: "checkbox"
	  });
	};

	var checkbox =
	/*#__PURE__*/
	Object.freeze({
	  createProps: createProps$9
	});

	function _defineProperty$9(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$a() {
	  _extends$a = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$a.apply(this, arguments);
	}

	var classes$9 = {
	  component: "pe-control",
	  // elements
	  formLabel: "pe-control__form-label",
	  input: "pe-control__input",
	  label: "pe-control__label",
	  // states
	  disabled: "pe-control--disabled",
	  inactive: "pe-control--inactive",
	  large: "pe-control--large",
	  medium: "pe-control--medium",
	  off: "pe-control--off",
	  on: "pe-control--on",
	  regular: "pe-control--regular",
	  small: "pe-control--small",
	  // control view elements
	  box: "pe-control__box",
	  button: "pe-control__button",
	  // control view states
	  buttonOff: "pe-control__button--off",
	  buttonOn: "pe-control__button--on"
	};

	var getElement$7 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var currentState = function currentState(attrs, state) {
	  var checked = attrs.checked !== undefined ? attrs.checked : state.checked();
	  var selectable = attrs.selectable !== undefined ? attrs.selectable(checked) : false;
	  var inactive = attrs.disabled || !selectable;
	  return {
	    checked: checked,
	    inactive: inactive
	  };
	};

	var getInitialState$3 = function getInitialState(vnode, createStream, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  var isChecked = attrs.defaultChecked !== undefined ? attrs.defaultChecked : attrs.checked || false;
	  var checked = createStream(isChecked);

	  var notifyChange = function notifyChange(e, isChecked) {
	    if (attrs.onChange) {
	      attrs.onChange({
	        event: e,
	        checked: isChecked,
	        value: attrs.value
	      });
	    }
	  };

	  var onChange = function onChange(e) {
	    var isChecked = e.currentTarget.checked;
	    if (attrs.type === "radio") ;else {
	      checked(isChecked);
	    }
	    notifyChange(e, isChecked);
	  };

	  var toggle = function toggle(e) {
	    var newChecked = !checked();
	    checked(newChecked);
	    notifyChange(e, newChecked);
	  };

	  var viewControlClickHandler = attrs.events && attrs.events[k.onclick];
	  var viewControlKeyDownHandler = attrs.events && attrs.events[k.onkeydown] ? attrs.events[k.onkeydown] : function (e) {
	    if (e.key === "Enter" || e.keyCode === 32) {
	      e.preventDefault();

	      if (viewControlClickHandler) {
	        viewControlClickHandler(e);
	      } else {
	        toggle(e);
	      }
	    }
	  };
	  return {
	    checked: checked,
	    toggle: toggle,
	    onChange: onChange,
	    viewControlClickHandler: viewControlClickHandler,
	    viewControlKeyDownHandler: viewControlKeyDownHandler,
	    redrawOnUpdate: createStream.merge([checked])
	  };
	};

	var createProps$a = function createProps(vnode, _ref2) {
	  var k = _ref2.keys;
	  var attrs = vnode.attrs;
	  var state = vnode.state;

	  var _currentState = currentState(attrs, state),
	      checked = _currentState.checked,
	      inactive = _currentState.inactive;

	  return _extends$a({}, filterSupportedAttributes(attrs), {
	    className: [classes$9.component, attrs.instanceClass, // for instance pe-checkbox-control
	    checked ? classes$9.on : classes$9.off, attrs.disabled ? classes$9.disabled : null, inactive ? classes$9.inactive : null, classForSize(classes$9, attrs.size), attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$8 = function createContent(vnode, _ref3) {
	  var h = _ref3.renderer,
	      k = _ref3.keys,
	      ViewControl = _ref3.ViewControl;
	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  var _currentState2 = currentState(attrs, state),
	      checked = _currentState2.checked,
	      inactive = _currentState2.inactive;

	  return h("label", _extends$a({}, {
	    className: classes$9.formLabel
	  }, state.viewControlClickHandler && _defineProperty$9({}, k.onclick, function (e) {
	    return e.preventDefault(), state.viewControlClickHandler(e);
	  })), [h(ViewControl, _extends$a({}, attrs, {
	    inactive: inactive,
	    checked: checked,
	    key: "control",
	    events: _defineProperty$9({}, k.onkeydown, state.viewControlKeyDownHandler)
	  })), attrs.label ? h(".".concat(classes$9.label), {
	    key: "label"
	  }, attrs.label) : null, h("input", _extends$a({}, attrs.events, {
	    name: attrs.name,
	    type: attrs.type,
	    value: attrs.value,
	    checked: checked
	  }, attrs.disabled || inactive ? {
	    disabled: "disabled"
	  } : _defineProperty$9({}, k.onchange, state.onChange)))]);
	};

	var selectionControl =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$7,
	  getInitialState: getInitialState$3,
	  createProps: createProps$a,
	  createContent: createContent$8
	});
	var CONTENT = [{
	  iconType: "iconOn",
	  className: classes$9.buttonOn
	}, {
	  iconType: "iconOff",
	  className: classes$9.buttonOff
	}];

	var getElement$1$2 = function getElement(vnode) {
	  return vnode.attrs.element || ".".concat(classes$9.box);
	};

	var createIcon = function createIcon(h, iconType, attrs, className) {
	  return (// if attrs.iconOn/attrs.iconOff is passed, use that icon options object and ignore size
	    // otherwise create a new object
	    _extends$a({}, {
	      className: className,
	      key: iconType
	    }, attrs[iconType] ? attrs[iconType] : {
	      svg: {
	        content: h.trust(attrs.icons[iconType])
	      }
	    }, attrs.icon, attrs.size ? {
	      size: attrs.size
	    } : null)
	  );
	};

	var createContent$1$2 = function createContent(vnode, _ref) {
	  var h = _ref.renderer,
	      Icon = _ref.Icon,
	      IconButton = _ref.IconButton;
	  var attrs = vnode.attrs;
	  return h(IconButton, _extends$a({}, {
	    element: "div",
	    className: classes$9.button,
	    content: CONTENT.map(function (o) {
	      return h(Icon, createIcon(h, o.iconType, attrs, o.className));
	    }),
	    ripple: {
	      center: true
	    },
	    disabled: attrs.disabled,
	    events: attrs.events,
	    inactive: attrs.inactive
	  }, attrs.iconButton // for example for hover behaviour
	  ));
	};

	var viewControl =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$1$2,
	  createContent: createContent$1$2
	});

	function _extends$b() {
	  _extends$b = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$b.apply(this, arguments);
	}

	var classes$a = {
	  component: "pe-button pe-icon-button",
	  // elements
	  content: "pe-icon-button__content",
	  label: "pe-icon-button__label",
	  // states
	  compact: "pe-icon-button--compact"
	}; // Props to be passed to a button, including 'content'

	var createProps$b = function createProps(vnode, _ref) {
	  var h = _ref.renderer,
	      Icon = _ref.Icon;
	  var attrs = vnode.attrs;
	  var content = attrs.content ? attrs.content : attrs.icon ? h(Icon, attrs.icon) : attrs.children || vnode.children;
	  return _extends$b({}, {
	    content: h("div", {
	      className: classes$a.content
	    }, content),
	    after: attrs.label && h("div", {
	      className: classes$a.label
	    }, attrs.label),
	    parentClassName: [attrs.parentClassName || classes$a.component, attrs.compact ? classes$a.compact : null].join(" "),
	    // defaults
	    wash: false,
	    animateOnTap: false
	  }, attrs);
	};

	var createContent$9 = function createContent(vnode) {
	  return vnode.children;
	};

	var iconButton =
	/*#__PURE__*/
	Object.freeze({
	  createProps: createProps$b,
	  createContent: createContent$9
	});

	function _defineProperty$a(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$8(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$a(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var IconButton = ComponentCreator(_objectSpread$8({}, iconButton, {
	  createProps: function createProps(vnode, args) {
	    return iconButton.createProps(vnode, _objectSpread$8({}, args, {
	      Icon: Icon
	    }));
	  },
	  createContent: function createContent(vnode, args) {
	    return iconButton.createContent(vnode, _objectSpread$8({}, args, {
	      Icon: Icon
	    }));
	  },
	  component: Button
	}));
	IconButton["displayName"] = "IconButton";

	function _defineProperty$b(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$9(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$b(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var ViewControl = ComponentCreator(_objectSpread$9({}, viewControl, {
	  createContent: function createContent(vnode, args) {
	    return viewControl.createContent(vnode, _objectSpread$9({}, args, {
	      Icon: Icon,
	      IconButton: IconButton
	    }));
	  }
	}));
	ViewControl["displayName"] = "ViewControl";
	var SelectionControl = ComponentCreator(_objectSpread$9({}, selectionControl, {
	  createContent: function createContent(vnode, args) {
	    return selectionControl.createContent(vnode, _objectSpread$9({}, args, {
	      ViewControl: ViewControl
	    }));
	  }
	}));
	SelectionControl["displayName"] = "SelectionControl";
	var Checkbox = ComponentCreator(_objectSpread$9({}, checkbox, {
	  component: SelectionControl
	}));
	Checkbox["displayName"] = "Checkbox";

	function _defineProperty$c(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$c() {
	  _extends$c = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$c.apply(this, arguments);
	}

	var listTileClasses = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};
	var menuClasses = {
	  component: "pe-menu",
	  // elements
	  panel: "pe-menu__panel",
	  content: "pe-menu__content",
	  placeholder: "pe-menu__placeholder",
	  backdrop: "pe-menu__backdrop",
	  // states
	  floating: "pe-menu--floating",
	  origin: "pe-menu--origin",
	  permanent: "pe-menu--permanent",
	  showBackdrop: "pe-menu--backdrop",
	  visible: "pe-menu--visible",
	  width_auto: "pe-menu--width-auto",
	  width_n: "pe-menu--width-",
	  isTopMenu: "pe-menu--top-menu",
	  // lookup
	  listTile: listTileClasses.component,
	  selectedListTile: listTileClasses.selected
	};
	var classes$b = {
	  component: "pe-dialog",
	  // elements
	  placeholder: "pe-dialog__placeholder",
	  holder: "pe-dialog__holder",
	  content: "pe-dialog__content",
	  backdrop: "pe-dialog__backdrop",
	  touch: "pe-dialog__touch",
	  // states
	  fullScreen: "pe-dialog--full-screen",
	  modal: "pe-dialog--modal",
	  open: "pe-dialog--open",
	  // class set to html element
	  visible: "pe-dialog--visible",
	  // class set to dialog element
	  showBackdrop: "pe-dialog--backdrop",
	  transition: "pe-dialog--transition",
	  // lookup
	  menuContent: menuClasses.content
	};
	var DEFAULT_SHADOW_DEPTH = 3;

	var getElement$8 = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var isFullScreen = function isFullScreen(_ref) {
	  var state = _ref.state,
	      attrs = _ref.attrs;
	  return attrs.fullScreen || stylePropCompare({
	    element: state.el,
	    pseudoSelector: ":before",
	    prop: "content",
	    contains: "\"".concat("full_screen", "\"")
	  });
	};

	var isModal = function isModal(_ref2) {
	  var state = _ref2.state,
	      attrs = _ref2.attrs;
	  return attrs.modal || stylePropCompare({
	    element: state.el,
	    pseudoSelector: ":before",
	    prop: "content",
	    contains: "\"".concat("modal", "\"")
	  });
	};

	var transitionOptions = function transitionOptions(state, attrs, isShow) {
	  return {
	    state: state,
	    attrs: attrs,
	    isShow: isShow,
	    domElements: {
	      el: state.el,
	      contentEl: state.contentEl,
	      backdropEl: state.backdropEl
	    },
	    showClass: classes$b.visible,
	    transitionClass: classes$b.transition
	  };
	};

	var showDialog = function showDialog(state, attrs) {
	  return transitionComponent(transitionOptions(state, attrs, true));
	};

	var hideDialog = function hideDialog(state, attrs) {
	  return transitionComponent(transitionOptions(state, attrs, false));
	};

	var getInitialState$4 = function getInitialState(vnode, createStream) {
	  var transitioning = createStream(false);
	  var visible = createStream(false);
	  return {
	    backdropEl: undefined,
	    touchEl: undefined,
	    cleanUp: undefined,
	    el: undefined,
	    contentEl: undefined,
	    transitioning: transitioning,
	    visible: visible,
	    redrawOnUpdate: createStream.merge([transitioning])
	  };
	};

	var onMount$6 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (attrs.z !== undefined) {
	    deprecation("Dialog", {
	      option: "z",
	      newOption: "shadowDepth"
	    });
	  }

	  var dom = vnode.dom;
	  state.el = dom;
	  state.backdropEl = dom.querySelector(".".concat(classes$b.backdrop));
	  state.touchEl = dom.querySelector(".".concat(classes$b.touch));
	  state.contentEl = dom.querySelector(".".concat(classes$b.content));

	  if (!attrs.inactive) {
	    // used by Drawer
	    var handleEscape = function handleEscape(e) {
	      if (isFullScreen(vnode) || isModal(vnode)) return;

	      if (e.key === "Escape" || e.key === "Esc") {
	        // "Esc" for IE11
	        var openDialogs = document.querySelectorAll(".".concat(classes$b.component));

	        if (openDialogs[openDialogs.length - 1] === state.el) {
	          hideDialog(state, _extends$c({}, attrs, {
	            hideDelay: 0
	          }));
	        }
	      }
	    };

	    state.cleanUp = function () {
	      return unsubscribe("keydown", handleEscape);
	    };

	    subscribe("keydown", handleEscape);

	    if (attrs.show) {
	      showDialog(state, attrs);
	    }
	  }
	};

	var onUnMount$3 = function onUnMount(vnode) {
	  return vnode.state.cleanUp && vnode.state.cleanUp();
	};

	var createProps$c = function createProps(vnode, _ref3) {
	  var k = _ref3.keys;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  return _extends$c({}, filterSupportedAttributes(attrs, {
	    remove: ["style"]
	  }), // style set in content, and set by show/hide transition
	  _defineProperty$c({
	    className: [attrs.parentClassName || classes$b.component, attrs.fromMultipleClassName, attrs.fullScreen ? classes$b.fullScreen : null, attrs.modal ? classes$b.modal : null, attrs.backdrop ? classes$b.showBackdrop : null, // classes.visible is set in showDialog though transition
	    attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" "),
	    "data-spawn-id": attrs.spawnId,
	    // received from Multi
	    "data-instance-id": attrs.instanceId
	  }, k.onclick, function (e) {
	    if (e.target !== state.el && e.target !== state.backdropEl && e.target !== state.touchEl) {
	      return;
	    }

	    if (isModal(vnode)) {
	      // not allowed
	      return;
	    }

	    hideDialog(state, attrs);
	  }));
	};

	var createPane = function createPane(vnode, _ref4) {
	  var h = _ref4.renderer,
	      Pane = _ref4.Pane;
	  var attrs = vnode.attrs;
	  return h(Pane, {
	    body: attrs.content || attrs.body || attrs.menu || vnode.children,
	    borders: attrs.borders,
	    className: attrs.className,
	    footer: attrs.footer,
	    footerButtons: attrs.footerButtons,
	    formOptions: attrs.formOptions,
	    fullBleed: attrs.fullBleed,
	    header: attrs.header,
	    style: attrs.style,
	    title: attrs.title
	  });
	};

	var createContent$a = function createContent(vnode, _ref5) {
	  var renderer = _ref5.renderer,
	      Shadow = _ref5.Shadow,
	      createPane = _ref5.createPane,
	      Pane = _ref5.Pane;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var h = renderer;

	  if (state.el) {
	    var visible = state.visible();
	    var transitioning = state.transitioning();

	    if (!transitioning) {
	      if (attrs.hide && visible) {
	        // Use setTimeout to play nice with React's lifecycle functions
	        setTimeout(function () {
	          return hideDialog(state, attrs);
	        }, 0);
	      } else if (attrs.show && !visible) {
	        setTimeout(function () {
	          return showDialog(state, attrs);
	        }, 0);
	      }
	    }
	  }

	  var pane = attrs.panesOptions && attrs.panesOptions.length ? h(Pane, attrs.panesOptions[0]) : attrs.panes && attrs.panes.length ? attrs.panes[0] : createPane(vnode, {
	    renderer: renderer,
	    Pane: Pane
	  });
	  var shadowDepth = attrs.shadowDepth !== undefined ? attrs.shadowDepth : attrs.z; // deprecated

	  return [h("div", {
	    key: "backdrop",
	    className: classes$b.backdrop
	  }), h("div", {
	    key: "touch",
	    className: classes$b.touch
	  }), h("div", {
	    className: [classes$b.content, attrs.menu ? classes$b.menuContent : null].join(" "),
	    key: "content"
	  }, [attrs.fullScreen ? null : h(Shadow, {
	    shadowDepth: shadowDepth !== undefined ? shadowDepth : DEFAULT_SHADOW_DEPTH,
	    animated: true,
	    key: "shadow"
	  }), pane])];
	};

	var dialog =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$8,
	  getInitialState: getInitialState$4,
	  onMount: onMount$6,
	  onUnMount: onUnMount$3,
	  createProps: createProps$c,
	  createPane: createPane,
	  createContent: createContent$a
	});

	function _defineProperty$d(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$d() {
	  _extends$d = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$d.apply(this, arguments);
	}

	var classes$c = {
	  component: "pe-dialog-pane",
	  // elements
	  actions: "pe-dialog-pane__actions",
	  body: "pe-dialog-pane__body",
	  content: "pe-dialog-pane__content",
	  footer: "pe-dialog-pane__footer",
	  header: "pe-dialog-pane__header",
	  title: "pe-dialog-pane__title",
	  // states
	  withHeader: "pe-dialog-pane--header",
	  withFooter: "pe-dialog-pane--footer",
	  headerWithTitle: "pe-dialog-pane__header--title",
	  footerWithButtons: "pe-dialog-pane__footer--buttons",
	  footerHigh: "pe-dialog-pane__footer--high",
	  borderBottom: "pe-dialog-pane--border-bottom",
	  borderTop: "pe-dialog-pane--border-top",
	  fullBleed: "pe-dialog-pane--body-full-bleed"
	};
	var buttonClasses$1 = {
	  component: "pe-text-button",
	  super: "pe-button",
	  row: "pe-button-row",
	  // elements      
	  content: "pe-button__content",
	  label: "pe-button__label",
	  textLabel: "pe-button__text-label",
	  wash: "pe-button__wash",
	  dropdown: "pe-button__dropdown",
	  // states      
	  border: "pe-button--border",
	  contained: "pe-button--contained",
	  disabled: "pe-button--disabled",
	  dropdownClosed: "pe-button--dropdown-closed",
	  dropdownOpen: "pe-button--dropdown-open",
	  extraWide: "pe-button--extra-wide",
	  hasDropdown: "pe-button--dropdown",
	  highLabel: "pe-button--high-label",
	  inactive: "pe-button--inactive",
	  raised: "pe-button--raised",
	  selected: "pe-button--selected",
	  separatorAtStart: "pe-button--separator-start"
	};

	var getElement$9 = function getElement(vnode) {
	  return vnode.attrs.element || "form";
	};

	var SCROLL_WATCH_END_TIMER = 150;

	var updateScrollOverflowState = function updateScrollOverflowState(vnode) {
	  var state = vnode.state;
	  var scroller = state.scrollEl();

	  if (!scroller) {
	    return;
	  }

	  state.topOverflow(scroller.scrollTop > 0);
	  state.bottomOverflow(scroller.scrollHeight - (scroller.scrollTop + scroller.getBoundingClientRect().height) > 0);
	};

	var getInitialState$5 = function getInitialState(vnode, createStream) {
	  var bottomOverflow = createStream(false);
	  var footerEl = createStream(null);
	  var headerEl = createStream(null);
	  var isScrolling = createStream(false);
	  var scrollEl = createStream(null);
	  var topOverflow = createStream(false);
	  var el = createStream(null);
	  return {
	    cleanUp: undefined,
	    bottomOverflow: bottomOverflow,
	    el: el,
	    footerEl: footerEl,
	    headerEl: headerEl,
	    isScrolling: isScrolling,
	    scrollEl: scrollEl,
	    scrollWatchId: undefined,
	    topOverflow: topOverflow,
	    redrawOnUpdate: createStream.merge([topOverflow, bottomOverflow, isScrolling])
	  };
	};

	var onMount$7 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var dom = vnode.dom;
	  var state = vnode.state;
	  state.el(dom);
	  state.scrollEl(dom.querySelector(".".concat(classes$c.body)));
	  state.footerEl(dom.querySelector(".".concat(classes$c.footer)));
	  state.headerEl(dom.querySelector(".".concat(classes$c.header)));
	  state.isScrolling.map(function () {
	    return updateScrollOverflowState(vnode);
	  });

	  var update = function update() {
	    updateScrollOverflowState(vnode);
	  };

	  state.cleanUp = function () {
	    return unsubscribe("resize", update);
	  }; // resize: update scroll state ("overflow" borders)


	  subscribe("resize", update);
	  update();
	};

	var onUnMount$4 = function onUnMount(vnode) {
	  return vnode.state.cleanUp();
	};

	var createProps$d = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var state = vnode.state;
	  var attrs = unpackAttrs(vnode.attrs);
	  var withHeader = attrs.header !== undefined || attrs.title !== undefined;
	  var withFooter = attrs.footer !== undefined || attrs.footerButtons !== undefined;
	  var borders = attrs.borders || "overflow";
	  var showTopBorder = borders === "always" || withHeader && borders === "overflow" && state.topOverflow();
	  var showBottomBorder = borders === "always" || withFooter && borders === "overflow" && state.bottomOverflow();
	  return _extends$d({}, filterSupportedAttributes(attrs, {
	    remove: ["style"]
	  }), // style set in content, and set by show/hide transition
	  {
	    className: [classes$c.component, attrs.fullBleed ? classes$c.fullBleed : null, showTopBorder ? classes$c.borderTop : null, showBottomBorder ? classes$c.borderBottom : null, withHeader ? classes$c.withHeader : null, withFooter ? classes$c.withFooter : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.formOptions);
	};

	var createContent$b = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer,
	      k = _ref2.keys;
	  var state = vnode.state;
	  var attrs = unpackAttrs(vnode.attrs);
	  return h("div", {
	    className: [classes$c.content, attrs.menu ? classes$c.menuContent : null].join(" "),
	    style: attrs.style
	  }, [attrs.header ? attrs.header : attrs.title ? h("div", {
	    className: [classes$c.header, classes$c.headerWithTitle].join(" "),
	    key: "title"
	  }, h("div", {
	    className: classes$c.title
	  }, attrs.title)) : null, h("div", _defineProperty$d({
	    className: classes$c.body,
	    key: "body"
	  }, k.onscroll, function () {
	    state.isScrolling(true);
	    clearTimeout(state.scrollWatchId);
	    state.scrollWatchId = setTimeout(function () {
	      state.isScrolling(false);
	    }, SCROLL_WATCH_END_TIMER);
	  }), attrs.content || attrs.body || attrs.menu), attrs.footer ? h("div", {
	    className: classes$c.footer,
	    key: "footer"
	  }, attrs.footer) : attrs.footerButtons ? h("div", {
	    className: [classes$c.footer, classes$c.footerWithButtons, buttonClasses$1.row].join(" "),
	    key: "footer"
	  }, h("div", {
	    className: classes$c.actions
	  }, attrs.footerButtons)) : null]);
	};

	var dialogPane =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$9,
	  getInitialState: getInitialState$5,
	  onMount: onMount$7,
	  onUnMount: onUnMount$4,
	  createProps: createProps$d,
	  createContent: createContent$b
	});

	var DialogPane = ComponentCreator(dialogPane);
	DialogPane["displayName"] = "DialogPane";

	function _defineProperty$e(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$a(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$e(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var listTileClasses$1 = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};
	var menuClasses$1 = {
	  component: "pe-menu",
	  // elements
	  panel: "pe-menu__panel",
	  content: "pe-menu__content",
	  placeholder: "pe-menu__placeholder",
	  backdrop: "pe-menu__backdrop",
	  // states
	  floating: "pe-menu--floating",
	  origin: "pe-menu--origin",
	  permanent: "pe-menu--permanent",
	  showBackdrop: "pe-menu--backdrop",
	  visible: "pe-menu--visible",
	  width_auto: "pe-menu--width-auto",
	  width_n: "pe-menu--width-",
	  isTopMenu: "pe-menu--top-menu",
	  // lookup
	  listTile: listTileClasses$1.component,
	  selectedListTile: listTileClasses$1.selected
	};
	var classes$d = {
	  component: "pe-dialog",
	  // elements
	  placeholder: "pe-dialog__placeholder",
	  holder: "pe-dialog__holder",
	  content: "pe-dialog__content",
	  backdrop: "pe-dialog__backdrop",
	  touch: "pe-dialog__touch",
	  // states
	  fullScreen: "pe-dialog--full-screen",
	  modal: "pe-dialog--modal",
	  open: "pe-dialog--open",
	  // class set to html element
	  visible: "pe-dialog--visible",
	  // class set to dialog element
	  showBackdrop: "pe-dialog--backdrop",
	  transition: "pe-dialog--transition",
	  // lookup
	  menuContent: menuClasses$1.content
	};
	var DialogInstance = ComponentCreator(_objectSpread$a({}, dialog, {
	  createContent: function createContent(vnode, args) {
	    return dialog.createContent(vnode, _objectSpread$a({}, args, {
	      Shadow: Shadow,
	      Pane: DialogPane,
	      createPane: dialog.createPane
	    }));
	  }
	}));
	DialogInstance["displayName"] = "DialogInstance";
	var options = {
	  name: "dialog",
	  htmlShowClass: classes$d.open,
	  defaultId: "default_dialog",
	  holderSelector: "div.".concat(classes$d.holder),
	  instance: DialogInstance,
	  placeholder: "span.".concat(classes$d.placeholder)
	};
	var Multiple = Multi({
	  options: options,
	  renderer: renderer
	});
	var Dialog = ComponentCreator(Multiple);
	Object.getOwnPropertyNames(Multiple).forEach(function (p) {
	  return Dialog[p] = Multiple[p];
	});
	Dialog["displayName"] = "Dialog";

	function _extends$e() {
	  _extends$e = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$e.apply(this, arguments);
	}

	var classes$e = {
	  component: "pe-dialog pe-drawer",
	  // states
	  cover: "pe-drawer--cover",
	  push: "pe-drawer--push",
	  mini: "pe-drawer--mini",
	  permanent: "pe-drawer--permanent",
	  border: "pe-drawer--border",
	  floating: "pe-drawer--floating",
	  fixed: "pe-drawer--fixed",
	  anchorEnd: "pe-drawer--anchor-end"
	};

	var getElement$a = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	}; // Props to be passed to Dialog


	var createProps$e = function createProps(vnode) {
	  var attrs = vnode.attrs;
	  var isCover = !(attrs.push || attrs.permanent || attrs.mini);
	  return _extends$e({}, attrs, {
	    fullBleed: true,
	    className: null,
	    parentClassName: [attrs.className, classes$e.component, isCover ? classes$e.cover : null, attrs.push ? classes$e.push : null, attrs.permanent ? classes$e.permanent : null, attrs.border ? classes$e.border : null, attrs.mini ? classes$e.mini : null, attrs.floating ? classes$e.floating : null, attrs.fixed ? classes$e.fixed : null, attrs.anchor === "end" ? classes$e.anchorEnd : null].join(" "),
	    inactive: attrs.permanent && !attrs.mini,
	    shadowDepth: attrs.shadowDepth !== undefined ? attrs.shadowDepth : 0,
	    // deprecated:
	    z: attrs.z !== undefined ? attrs.z : undefined
	  });
	};

	var createContent$c = function createContent(vnode) {
	  return vnode.children;
	};

	var drawer =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$a,
	  createProps: createProps$e,
	  createContent: createContent$c
	});

	function _defineProperty$f(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$b(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$f(target, key, source[key]);
	    });
	  }

	  return target;
	}
	var DrawerInstance = ComponentCreator(_objectSpread$b({}, drawer, {
	  component: DialogInstance
	}));
	var DrawerToggle = ComponentCreator(Conditional);
	DrawerToggle["displayName"] = "DrawerToggle";

	function _extends$f() {
	  _extends$f = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$f.apply(this, arguments);
	}

	var classes$g = {
	  component: "pe-fab",
	  // elements
	  content: "pe-fab__content",
	  // states
	  mini: "pe-fab--mini"
	}; // Props to be passed to a Button, including 'content'

	var createProps$f = function createProps(vnode, _ref) {
	  var k = _ref.keys,
	      h = _ref.renderer,
	      Icon = _ref.Icon;
	  var attrs = vnode.attrs;
	  var content = attrs.content ? attrs.content : attrs.icon ? h(Icon, attrs.icon) : attrs.children || vnode.children;
	  return _extends$f({}, attrs, {
	    content: h("div", {
	      className: classes$g.content
	    }, content),
	    parentClassName: [classes$g.component, attrs.mini ? classes$g.mini : null, attrs.className || attrs[k.class]].join(" "),
	    className: null,
	    // defaults
	    ripple: {
	      center: true,
	      opacityDecayVelocity: 0.24
	    },
	    shadow: {
	      increase: 5
	    },
	    ink: true,
	    wash: true,
	    raised: true,
	    animateOnTap: attrs.animateOnTap !== undefined ? attrs.animateOnTap : true
	  });
	};

	var createContent$d = function createContent(vnode) {
	  return vnode.children;
	};

	var fab =
	/*#__PURE__*/
	Object.freeze({
	  createProps: createProps$f,
	  createContent: createContent$d
	});

	function _defineProperty$g(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$c(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$g(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var FAB = ComponentCreator(_objectSpread$c({}, fab, {
	  createProps: function createProps(vnode, args) {
	    return fab.createProps(vnode, _objectSpread$c({}, args, {
	      Icon: Icon
	    }));
	  },
	  createContent: function createContent(vnode, args) {
	    return fab.createContent(vnode, _objectSpread$c({}, args, {
	      Icon: Icon
	    }));
	  },
	  component: Button
	}));
	FAB["displayName"] = "FAB";

	function _extends$g() {
	  _extends$g = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$g.apply(this, arguments);
	}

	var classes$h = {
	  component: "pe-ios-spinner",
	  // elements
	  blades: "pe-ios-spinner__blades",
	  blade: "pe-ios-spinner__blade"
	};

	var blade = function blade(num, h) {
	  return h("div", {
	    key: "blade-".concat(num),
	    className: classes$h.blade
	  });
	};

	var createProps$g = function createProps(vnode, _ref) {
	  var h = _ref.renderer;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  state.content = state.content || h("div", {
	    key: "content",
	    className: classes$h.blades
	  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (num) {
	    return blade(num, h);
	  }));
	  return _extends$g({}, attrs, {
	    className: [classes$h.component, attrs.className].join(" "),
	    content: state.content
	  });
	};

	var spinner =
	/*#__PURE__*/
	Object.freeze({
	  createProps: createProps$g
	});

	function _extends$h() {
	  _extends$h = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$h.apply(this, arguments);
	}

	var classes$i = {
	  component: "pe-spinner",
	  // elements
	  animation: "pe-spinner__animation",
	  placeholder: "pe-spinner__placeholder",
	  // states
	  animated: "pe-spinner--animated",
	  fab: "pe-spinner--fab",
	  large: "pe-spinner--large",
	  medium: "pe-spinner--medium",
	  permanent: "pe-spinner--permanent",
	  raised: "pe-spinner--raised",
	  regular: "pe-spinner--regular",
	  singleColor: "pe-spinner--single-color",
	  small: "pe-spinner--small",
	  visible: "pe-spinner--visible"
	};

	var transitionOptions$1 = function transitionOptions(state, attrs, isShow) {
	  return {
	    state: state,
	    attrs: attrs,
	    isShow: isShow,
	    domElements: {
	      el: state.dom()
	    },
	    showClass: classes$i.visible
	  };
	};

	var showSpinner = function showSpinner(state, attrs) {
	  return transitionComponent(transitionOptions$1(state, attrs, true));
	};

	var hideSpinner = function hideSpinner(state, attrs) {
	  return transitionComponent(transitionOptions$1(state, attrs, false));
	};

	var getInitialState$6 = function getInitialState(vnode, createStream) {
	  var transitioning = createStream(false);
	  var visible = createStream(false);
	  var dom = createStream(null);
	  return {
	    dom: dom,
	    visible: visible,
	    transitioning: transitioning,
	    redrawOnUpdate: createStream.merge([transitioning])
	  };
	};

	var onMount$8 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (attrs.z !== undefined) {
	    deprecation("Spinner", {
	      option: "z",
	      newOption: "shadowDepth"
	    });
	  }

	  state.dom(vnode.dom);

	  if (!attrs.permanent) {
	    showSpinner(state, attrs);
	  }
	};

	var createProps$h = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _extends$h({}, filterSupportedAttributes(attrs), {
	    className: [classes$i.component, attrs.instanceClass, classForSize(classes$i, attrs.size), attrs.singleColor ? classes$i.singleColor : null, attrs.raised ? classes$i.raised : null, attrs.animated ? classes$i.animated : null, attrs.permanent ? classes$i.permanent : null, attrs.permanent ? classes$i.visible : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events);
	};

	var createContent$e = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer,
	      Shadow = _ref2.Shadow;
	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (state.hide) {
	    setTimeout(function () {
	      hideSpinner(state, attrs);
	    }, 0);
	  }

	  var shadowDepth = attrs.shadowDepth !== undefined ? attrs.shadowDepth : attrs.z; // deprecated

	  return [attrs.raised && attrs.content ? h(Shadow, {
	    key: "shadow",
	    shadowDepth: shadowDepth
	  }) : null, attrs.content];
	};

	var spinner$1 =
	/*#__PURE__*/
	Object.freeze({
	  getInitialState: getInitialState$6,
	  onMount: onMount$8,
	  createProps: createProps$h,
	  createContent: createContent$e
	});

	function _defineProperty$h(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$d(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$h(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var classes$j = {
	  component: "pe-spinner",
	  // elements
	  animation: "pe-spinner__animation",
	  placeholder: "pe-spinner__placeholder",
	  // states
	  animated: "pe-spinner--animated",
	  fab: "pe-spinner--fab",
	  large: "pe-spinner--large",
	  medium: "pe-spinner--medium",
	  permanent: "pe-spinner--permanent",
	  raised: "pe-spinner--raised",
	  regular: "pe-spinner--regular",
	  singleColor: "pe-spinner--single-color",
	  small: "pe-spinner--small",
	  visible: "pe-spinner--visible"
	};
	var BaseSpinner = ComponentCreator(_objectSpread$d({}, spinner$1, {
	  createContent: function createContent(vnode, args) {
	    return spinner$1.createContent(vnode, _objectSpread$d({}, args, {
	      Shadow: Shadow
	    }));
	  }
	}));
	BaseSpinner["classes"] = classes$j;
	BaseSpinner["displayName"] = "BaseSpinner";

	function _defineProperty$i(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$e(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$i(target, key, source[key]);
	    });
	  }

	  return target;
	}
	var SpinnerInstance = ComponentCreator(_objectSpread$e({}, spinner, {
	  component: BaseSpinner
	}));
	var SpinnerToggle = ComponentCreator(Conditional);
	SpinnerToggle["displayName"] = "IOSSpinnerToggle";

	function _defineProperty$j(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$i() {
	  _extends$i = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$i.apply(this, arguments);
	}

	function _objectSpread$f(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$j(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var listTileClasses$2 = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};
	var classes$l = {
	  component: "pe-list",
	  // states
	  border: "pe-list--border",
	  compact: "pe-list--compact",
	  hasHeader: "pe-list--header",
	  indentedBorder: "pe-list--indented-border",
	  padding: "pe-list--padding",
	  paddingTop: "pe-list--padding-top",
	  paddingBottom: "pe-list--padding-bottom",
	  // lookup
	  header: listTileClasses$2.header
	};

	var getElement$b = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var paddingClasses = {
	  both: classes$l.padding,
	  bottom: classes$l.paddingBottom,
	  top: classes$l.paddingTop,
	  none: null
	};

	var paddingClass = function paddingClass() {
	  var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "both";
	  return paddingClasses[attr];
	};

	var onMount$9 = function onMount(vnode) {
	  var attrs = vnode.attrs;

	  if (attrs.borders !== undefined) {
	    deprecation("List", {
	      option: "borders",
	      newOption: "border"
	    });
	  }

	  if (attrs.indentedBorders !== undefined) {
	    deprecation("List", {
	      option: "indentedBorders",
	      newOption: "indentedBorder"
	    });
	  }
	};

	var createProps$i = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _extends$i({}, filterSupportedAttributes(attrs), {
	    className: [classes$l.component, attrs.border || attrs.borders ? classes$l.border : null, attrs.indentedBorder || attrs.indentedBorders ? classes$l.indentedBorder : null, attrs.header ? classes$l.hasHeader : null, attrs.compact ? classes$l.compact : null, paddingClass(attrs.padding), attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$f = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer,
	      requiresKeys = _ref2.requiresKeys,
	      k = _ref2.keys,
	      ListTile = _ref2.ListTile;
	  var attrs = vnode.attrs;
	  var headerOpts;

	  if (attrs.header) {
	    headerOpts = _extends$i({}, attrs.header);
	    headerOpts[k.class] = [classes$l.header, headerOpts[k.class] || null].join(" ");
	  }

	  var tiles = attrs.tiles ? attrs.tiles : attrs.content ? attrs.content : attrs.children || vnode.children;
	  return [headerOpts ? h(ListTile, _objectSpread$f({}, requiresKeys ? {
	    key: "header"
	  } : undefined, attrs.all, headerOpts, {
	    header: true
	  })) : undefined, attrs.all ? tiles.map(function (tileOpts) {
	    return h(ListTile, _objectSpread$f({}, attrs.all, tileOpts));
	  }) : tiles];
	};

	var list =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$b,
	  onMount: onMount$9,
	  createProps: createProps$i,
	  createContent: createContent$f
	});

	function _defineProperty$k(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$g(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$k(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var List = ComponentCreator(_objectSpread$g({}, list, {
	  createProps: function createProps(vnode, args) {
	    return list.createProps(vnode, _objectSpread$g({}, args, {
	      ListTile: ListTile
	    }));
	  },
	  createContent: function createContent(vnode, args) {
	    return list.createContent(vnode, _objectSpread$g({}, args, {
	      ListTile: ListTile
	    }));
	  }
	}));
	List["displayName"] = "List";

	function _extends$j() {
	  _extends$j = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$j.apply(this, arguments);
	}

	var addWebFont = function addWebFont(vendor, config) {
	  if (isServer) return;

	  if (!window["WebFontConfig"]) {
	    /**
	     * @param {object} params
	     * @param {string} [params.name]
	     * @param {string} [params.familyName]
	     * @param {any} [params.fvd]
	     */
	    var emitEvent = function emitEvent(_ref) {
	      var name = _ref.name,
	          familyName = _ref.familyName,
	          fvd = _ref.fvd;
	      return emit("webfontloader", {
	        name: name,
	        familyName: familyName,
	        fvd: fvd,
	        vendor: vendor,
	        config: config
	      });
	    };

	    window["WebFontConfig"] = {
	      loading: function loading() {
	        return emitEvent({
	          name: "loading"
	        });
	      },
	      active: function active() {
	        return emitEvent({
	          name: "active"
	        });
	      },
	      inactive: function inactive() {
	        return emitEvent({
	          name: "inactive"
	        });
	      },
	      fontloading: function fontloading(familyName, fvd) {
	        return emitEvent({
	          name: "fontloading",
	          familyName: familyName,
	          fvd: fvd
	        });
	      },
	      fontactive: function fontactive(familyName, fvd) {
	        return emitEvent({
	          name: "fontactive",
	          familyName: familyName,
	          fvd: fvd
	        });
	      },
	      fontinactive: function fontinactive(familyName, fvd) {
	        return emitEvent({
	          name: "fontinactive",
	          familyName: familyName,
	          fvd: fvd
	        });
	      }
	    };

	    (function () {
	      var wf = document.createElement("script");
	      wf.src = (document.location.protocol === "https:" ? "https" : "http") + "://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
	      wf.type = "text/javascript";
	      wf.async = true;
	      var s = document.getElementsByTagName("script")[0];

	      if (s && s.parentNode) {
	        s.parentNode.insertBefore(wf, s);
	      }
	    })();
	  }

	  var vendorCfg = window["WebFontConfig"][vendor] || {};

	  if (config) {
	    _extends$j(vendorCfg, config);
	  }

	  window["WebFontConfig"][vendor] = vendorCfg;
	};
	/*
	https://gist.github.com/gre/1650294
	Easing Functions - inspired from http://gizma.com/easing/
	Only considering the t value for the range [0, 1] => [0, 1]
	*/


	var easing = {
	  // no easing, no acceleration
	  linear: function linear(t) {
	    return t;
	  },
	  // accelerating from zero velocity
	  easeInQuad: function easeInQuad(t) {
	    return t * t;
	  },
	  // decelerating to zero velocity
	  easeOutQuad: function easeOutQuad(t) {
	    return t * (2 - t);
	  },
	  // acceleration until halfway, then deceleration
	  easeInOutQuad: function easeInOutQuad(t) {
	    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	  },
	  // accelerating from zero velocity
	  easeInCubic: function easeInCubic(t) {
	    return t * t * t;
	  },
	  // decelerating to zero velocity
	  easeOutCubic: function easeOutCubic(t) {
	    return --t * t * t + 1;
	  },
	  // acceleration until halfway, then deceleration
	  easeInOutCubic: function easeInOutCubic(t) {
	    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	  },
	  // accelerating from zero velocity
	  easeInQuart: function easeInQuart(t) {
	    return t * t * t * t;
	  },
	  // decelerating to zero velocity
	  easeOutQuart: function easeOutQuart(t) {
	    return 1 - --t * t * t * t;
	  },
	  // acceleration until halfway, then deceleration
	  easeInOutQuart: function easeInOutQuart(t) {
	    return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
	  },
	  // accelerating from zero velocity
	  easeInQuint: function easeInQuint(t) {
	    return t * t * t * t * t;
	  },
	  // decelerating to zero velocity
	  easeOutQuint: function easeOutQuint(t) {
	    return 1 + --t * t * t * t * t;
	  },
	  // acceleration until halfway, then deceleration
	  easeInOutQuint: function easeInOutQuint(t) {
	    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
	  }
	};
	/*
	 Animated scroll to a position.
	 Derived from https://github.com/madebysource/animated-scrollto
	 Adapted to Mithril and rewritten to es6.
	*/

	var scrollTo = function scrollTo(opts) {
	  if (isServer) {
	    return;
	  }

	  var element = opts.element;
	  var which = opts.direction === "horizontal" ? "scrollLeft" : "scrollTop";
	  var to = opts.to;
	  var duration = opts.duration * 1000;
	  var easingFn = opts.easing || easing.easeInOutCubic;
	  var start = element[which];
	  var change = to - start;
	  var animationStart = new Date().getTime();
	  var animating = true;
	  return new Promise(function (resolve) {
	    var animateScroll = function animateScroll() {
	      if (!animating) {
	        return;
	      }

	      requestAnimFrame(animateScroll);
	      var now = new Date().getTime();
	      var percentage = (now - animationStart) / duration;
	      var val = start + change * easingFn(percentage);
	      element[which] = val;

	      if (percentage >= 1) {
	        element[which] = to;
	        animating = false;
	        resolve();
	      }
	    };

	    requestAnimFrame(animateScroll);
	  });
	};

	var requestAnimFrame = isServer ? function () {} : function () {
	  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window["mozRequestAnimationFrame"] || function (callback) {
	    return window.setTimeout(callback, 1000 / 60);
	  };
	}(); // @ts-check

	var Timer = function Timer() {
	  /** @type {number} */
	  var timerId;
	  /** @type {number} */

	  var startTime;
	  /** @type {number} */

	  var remaining;
	  /** @type {() => any} */

	  var cb;

	  var stop = function stop() {
	    if (isClient) {
	      window.clearTimeout(timerId);
	    }
	  };

	  var pause = function pause() {
	    return stop(), remaining -= new Date().getTime() - startTime;
	  };

	  var startTimer = function startTimer() {
	    if (isClient) {
	      stop();
	      startTime = new Date().getTime();
	      timerId = window.setTimeout(cb, remaining);
	    }
	  };

	  var start = function start(callback, duration) {
	    return cb = callback, remaining = duration * 1000, startTimer();
	  };

	  var resume = function resume() {
	    return startTimer();
	  };

	  return {
	    start: start,
	    pause: pause,
	    resume: resume,
	    stop: stop
	  };
	};

	function _extends$k() {
	  _extends$k = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$k.apply(this, arguments);
	}

	var classes$m = {
	  component: "pe-md-progress-spinner",
	  // elements
	  animation: "pe-md-progress-spinner__animation",
	  circle: "pe-md-progress-spinner__circle",
	  circleRight: "pe-md-progress-spinner__circle-right",
	  circleLeft: "pe-md-progress-spinner__circle-left"
	};

	var percentageValue = function percentageValue(min, max) {
	  var percentage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	  return min + (max - min) * percentage;
	};

	var rotateCircle = function rotateCircle(el, min, max, percentage) {
	  var style = el.style;
	  style["transform"] = style["-webkit-transform"] = style["-moz-transform"] = style["-ms-transform"] = style["-o-transform"] = "rotate(" + percentageValue(min, max, percentage) + "deg)";
	};

	var animate = function animate(stateEl, size, percentage) {
	  var animationEl = stateEl.querySelector("." + classes$m.animation);
	  var animationElStyle = animationEl.style;

	  if (percentage < 0.5) {
	    animationElStyle.clip = "rect(0px, " + size + "px, " + size + "px, " + size / 2 + "px)";
	  } else {
	    animationElStyle.clip = "rect(auto, auto, auto, auto)";
	  }

	  var leftCircle = stateEl.querySelector("." + classes$m.circleLeft);
	  var rightCircle = stateEl.querySelector("." + classes$m.circleRight);
	  leftCircle.style.clip = rightCircle.style.clip = "rect(0px, " + size / 2 + "px, " + size + "px, " + "0px)";
	  rotateCircle(rightCircle, 0, 180, Math.min(1, percentage * 2));
	  rotateCircle(leftCircle, 0, 360, percentage);
	};

	var updateWithPercentage = function updateWithPercentage(_ref) {
	  var state = _ref.state,
	      attrs = _ref.attrs,
	      size = _ref.size;

	  if (!state.dom) {
	    return;
	  }

	  if (state.animating()) {
	    return;
	  }

	  if (attrs.percentage === undefined) {
	    return;
	  }

	  var percentage = unpackAttrs(attrs.percentage);
	  var previousPercentage = state.percentage();
	  var easingFn = attrs.animated ? easing.easeInOutQuad : function (v) {
	    return v;
	  };

	  if (attrs.animated && previousPercentage !== percentage) {
	    var el = state.dom;
	    var animationDuration = attrs.updateDuration !== undefined ? attrs.updateDuration * 1000 : styleDurationToMs(getStyle({
	      element: el.querySelector(".".concat(classes$m.animation)),
	      prop: "animation-duration"
	    }));
	    var start = null;

	    var step = function step(timestamp) {
	      if (!start) start = timestamp;
	      var progress = timestamp - start;
	      var stepPercentage = 1.0 / animationDuration * progress;
	      var newPercentage = previousPercentage + stepPercentage * (percentage - previousPercentage);
	      animate(el, size, easingFn(newPercentage));

	      if (start && progress < animationDuration) {
	        window.requestAnimationFrame(step);
	      } else {
	        start = null;
	        state.percentage(percentage);
	        state.animating(false);
	      }
	    };

	    state.animating(true);
	    window.requestAnimationFrame(step);
	  } else {
	    animate(state.dom, size, easingFn(percentage));
	    state.percentage(percentage);
	  }
	};

	var getSize = function getSize(element) {
	  return Math.round(element ? parseFloat(getStyle({
	    element: element,
	    prop: "height"
	  })) - 2 * parseFloat(getStyle({
	    element: element,
	    prop: "padding"
	  })) : 0);
	};

	var getInitialState$7 = function getInitialState(vnode, createStream) {
	  var percentage = createStream(0);
	  var animating = createStream(false);
	  return {
	    animating: animating,
	    dom: undefined,
	    percentage: percentage,
	    redrawOnUpdate: createStream.merge([animating])
	  };
	};

	var onMount$a = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  state.dom = vnode.dom;
	  var size = getSize(state.dom);
	  updateWithPercentage({
	    state: state,
	    attrs: attrs,
	    size: size
	  });
	};

	var createProps$j = function createProps(vnode, _ref2) {
	  var h = _ref2.renderer;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var size = getSize(state.dom);
	  updateWithPercentage({
	    state: state,
	    attrs: attrs,
	    size: size
	  });
	  var content = h("div", {
	    key: "content",
	    className: classes$m.animation,
	    style: {
	      width: size + "px",
	      height: size + "px"
	    }
	  }, [h("div", {
	    key: "left",
	    className: [classes$m.circle, classes$m.circleLeft].join(" ")
	  }), h("div", {
	    key: "right",
	    className: [classes$m.circle, classes$m.circleRight].join(" ")
	  })]);
	  return _extends$k({}, attrs, {
	    className: [classes$m.component, attrs.className].join(" "),
	    content: content
	  });
	};

	var spinner$2 =
	/*#__PURE__*/
	Object.freeze({
	  getInitialState: getInitialState$7,
	  onMount: onMount$a,
	  createProps: createProps$j
	});

	function _defineProperty$l(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$h(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$l(target, key, source[key]);
	    });
	  }

	  return target;
	}
	var SpinnerInstance$1 = ComponentCreator(_objectSpread$h({}, spinner$2, {
	  component: BaseSpinner
	}));
	var SpinnerToggle$1 = ComponentCreator(Conditional);
	SpinnerToggle$1["displayName"] = "MaterialDesignProgressSpinnerToggle";

	function _extends$l() {
	  _extends$l = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$l.apply(this, arguments);
	}

	var classes$o = {
	  component: "pe-md-spinner",
	  // elements
	  animation: "pe-md-spinner__animation",
	  circle: "pe-md-spinner__circle",
	  circleClipper: "pe-md-spinner__circle-clipper",
	  circleClipperLeft: "pe-md-spinner__circle-clipper-left",
	  circleClipperRight: "pe-md-spinner__circle-clipper-right",
	  gapPatch: "pe-md-spinner__gap-patch",
	  layer: "pe-md-spinner__layer",
	  layerN: "pe-md-spinner__layer-"
	};

	var layer = function layer(num, h) {
	  return h("div", {
	    key: num,
	    className: [classes$o.layer, classes$o.layerN + num].join(" ")
	  }, [h("div", {
	    key: "clipper-left",
	    className: [classes$o.circleClipper, classes$o.circleClipperLeft].join(" ")
	  }, h("div", {
	    key: "circle",
	    className: classes$o.circle
	  })), h("div", {
	    key: "gap-patch",
	    className: classes$o.gapPatch
	  }, h("div", {
	    className: classes$o.circle
	  })), h("div", {
	    key: "clipper-right",
	    className: [classes$o.circleClipper, classes$o.circleClipperRight].join(" ")
	  }, h("div", {
	    className: classes$o.circle
	  }))]);
	};

	var createProps$k = function createProps(vnode, _ref) {
	  var h = _ref.renderer;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  state.content = state.content || h("div", {
	    key: "content",
	    className: classes$o.animation
	  }, [1, 2, 3, 4].map(function (num) {
	    return layer(num, h);
	  }));
	  return _extends$l({}, attrs, {
	    className: [classes$o.component, attrs.className].join(" "),
	    content: state.content
	  });
	};

	var spinner$3 =
	/*#__PURE__*/
	Object.freeze({
	  createProps: createProps$k
	});

	function _defineProperty$m(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$i(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$m(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var classes$p = {
	  component: "pe-md-spinner",
	  // elements
	  animation: "pe-md-spinner__animation",
	  circle: "pe-md-spinner__circle",
	  circleClipper: "pe-md-spinner__circle-clipper",
	  circleClipperLeft: "pe-md-spinner__circle-clipper-left",
	  circleClipperRight: "pe-md-spinner__circle-clipper-right",
	  gapPatch: "pe-md-spinner__gap-patch",
	  layer: "pe-md-spinner__layer",
	  layerN: "pe-md-spinner__layer-"
	};
	var baseSpinnerClasses$2 = {
	  component: "pe-spinner",
	  // elements
	  animation: "pe-spinner__animation",
	  placeholder: "pe-spinner__placeholder",
	  // states
	  animated: "pe-spinner--animated",
	  fab: "pe-spinner--fab",
	  large: "pe-spinner--large",
	  medium: "pe-spinner--medium",
	  permanent: "pe-spinner--permanent",
	  raised: "pe-spinner--raised",
	  regular: "pe-spinner--regular",
	  singleColor: "pe-spinner--single-color",
	  small: "pe-spinner--small",
	  visible: "pe-spinner--visible"
	};
	var SpinnerInstance$2 = ComponentCreator(_objectSpread$i({}, spinner$3, {
	  component: BaseSpinner
	}));
	var SpinnerToggle$2 = ComponentCreator(Conditional);
	SpinnerToggle$2["displayName"] = "MaterialDesignSpinnerToggle";
	var MaterialDesignSpinner = {
	  /**
	   * @param {Vnode} vnode
	   */
	  view: function view(vnode) {
	    return renderer(SpinnerToggle$2, _objectSpread$i({}, vnode.attrs, {
	      placeholderClassName: baseSpinnerClasses$2.placeholder,
	      instance: SpinnerInstance$2
	    }));
	  }
	};
	MaterialDesignSpinner["classes"] = classes$p;
	MaterialDesignSpinner["displayName"] = "MaterialDesignSpinner";

	function _extends$m() {
	  _extends$m = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$m.apply(this, arguments);
	}

	var listTileClasses$3 = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};
	var classes$q = {
	  component: "pe-menu",
	  // elements
	  panel: "pe-menu__panel",
	  content: "pe-menu__content",
	  placeholder: "pe-menu__placeholder",
	  backdrop: "pe-menu__backdrop",
	  // states
	  floating: "pe-menu--floating",
	  origin: "pe-menu--origin",
	  permanent: "pe-menu--permanent",
	  showBackdrop: "pe-menu--backdrop",
	  visible: "pe-menu--visible",
	  width_auto: "pe-menu--width-auto",
	  width_n: "pe-menu--width-",
	  isTopMenu: "pe-menu--top-menu",
	  // lookup
	  listTile: listTileClasses$3.component,
	  selectedListTile: listTileClasses$3.selected
	};

	var getElement$c = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var DEFAULT_OFFSET_H = 0;
	var DEFAULT_OFFSET_V = "79%";
	var DEFAULT_TYPE = "floating";
	var MIN_WIDTH = 1.5;
	var DEFAULT_SHADOW_DEPTH$1 = 1;

	var isTopMenu = function isTopMenu(_ref) {
	  var state = _ref.state,
	      attrs = _ref.attrs;
	  return attrs.topMenu || stylePropCompare({
	    element: state.dom(),
	    pseudoSelector: ":before",
	    prop: "content",
	    contains: "\"".concat("top_menu", "\"")
	  });
	};

	var positionMenu = function positionMenu(state, attrs) {
	  if (isServer) {
	    return;
	  }

	  if (!attrs.target) {
	    return;
	  }

	  var targetEl = document.querySelector(attrs.target);

	  if (!targetEl) {
	    return;
	  }

	  var panelEl = state.panelEl;

	  if (!panelEl) {
	    return;
	  } // Don't set the position or top offset if the menu position is fixed


	  var hasStylePositionFixed = stylePropCompare({
	    element: panelEl,
	    prop: "position",
	    equals: "fixed"
	  });

	  if (hasStylePositionFixed && !isTopMenu({
	    state: state,
	    attrs: attrs
	  })) {
	    _extends$m(panelEl.style, {});

	    panelEl.offsetHeight; // force reflow

	    return;
	  }

	  var contentEl = state.contentEl;
	  var parentRect = panelEl.parentNode.getBoundingClientRect();
	  var targetRect = targetEl.getBoundingClientRect();
	  var attrsOffsetH = attrs.offsetH !== undefined ? attrs.offsetH : attrs.offset !== undefined ? attrs.offset // deprecated
	  : DEFAULT_OFFSET_H;
	  var attrsOffsetV = attrs.offsetV !== undefined ? attrs.offsetV : DEFAULT_OFFSET_V;
	  var offsetH = attrsOffsetH.toString().indexOf("%") !== -1 ? Math.round(parseFloat(attrsOffsetH) * 0.01 * targetRect.width) : Math.round(parseFloat(attrsOffsetH));
	  var offsetV = attrsOffsetV.toString().indexOf("%") !== -1 ? Math.round(parseFloat(attrsOffsetV) * 0.01 * targetRect.height) : Math.round(parseFloat(attrsOffsetV));
	  var positionOffsetV = offsetV;
	  var attrsOrigin = attrs.origin || "top";
	  var origin = attrsOrigin.split(/\W+/).reduce(function (acc, curr) {
	    return acc[curr] = true, acc;
	  }, {});
	  var firstItem = contentEl.querySelectorAll("." + classes$q.listTile)[0];

	  if (attrs.reposition) {
	    // get the first List Tile to calculate the top position  
	    var selectedItem = contentEl.querySelector("." + classes$q.selectedListTile);

	    if (firstItem && selectedItem) {
	      // calculate v position: menu should shift upward relative to the first item
	      var firstItemRect = firstItem.getBoundingClientRect();
	      var selectedItemRect = selectedItem.getBoundingClientRect();
	      positionOffsetV = firstItemRect.top - selectedItemRect.top;
	    } // align to middle of target


	    var alignEl = selectedItem || firstItem;
	    var alignRect = alignEl.getBoundingClientRect();

	    var _targetRect = targetEl.getBoundingClientRect();

	    var heightDiff = _targetRect.height - alignRect.height;
	    positionOffsetV += Math.abs(heightDiff) / 2;
	  } else if (attrs.origin && !hasStylePositionFixed) {
	    if (origin.top) {
	      positionOffsetV += targetRect.top - parentRect.top;
	    } else if (origin.bottom) {
	      positionOffsetV += targetRect.top - parentRect.bottom;
	    }
	  }

	  if (attrs.height) {
	    var firstItemHeight = firstItem ? firstItem.clientHeight : 48; // default List Tile height

	    if (attrs.height === "max") {
	      var topMargin = positionOffsetV;
	      var bottomMargin = firstItemHeight;
	      panelEl.style.height = "calc(100% - ".concat(topMargin + bottomMargin, "px)");
	    } else {
	      var height = /^\d+$/.test(attrs.height.toString()) ? "".concat(attrs.height, "px") : attrs.height;
	      panelEl.style.height = height;
	    }
	  } // prevent animated changes


	  var transitionDuration = panelEl.style.transitionDuration;
	  panelEl.style.transitionDuration = "0ms";

	  if (panelEl.parentNode && !hasStylePositionFixed) {
	    if (origin.right) {
	      panelEl.style.right = targetRect.right - parentRect.right + offsetH + "px";
	    } else {
	      panelEl.style.left = targetRect.left - parentRect.left + offsetH + "px";
	    }

	    if (origin.bottom) {
	      panelEl.style.bottom = positionOffsetV + "px";
	    } else {
	      panelEl.style.top = positionOffsetV + "px";
	    }

	    panelEl.style.transformOrigin = attrsOrigin.split(/\W+/).join(" ");
	  }

	  panelEl.offsetHeight; // force reflow

	  panelEl.style.transitionDuration = transitionDuration;
	};

	var scrollContent = function scrollContent(state, attrs) {
	  if (isServer) {
	    return;
	  }

	  if (!attrs.scrollTarget) {
	    return;
	  }

	  var scrollTargetEl = document.querySelector(attrs.scrollTarget);

	  if (!scrollTargetEl) {
	    return;
	  }

	  state.contentEl.scrollTop = scrollTargetEl.offsetTop;
	};

	var transitionOptions$2 = function transitionOptions(state, attrs, isShow) {
	  return {
	    state: state,
	    attrs: attrs,
	    isShow: isShow,
	    beforeTransition: isShow ? function () {
	      return state.update();
	    } : null,
	    domElements: {
	      el: state.panelEl,
	      showClassElement: state.dom()
	    },
	    showClass: classes$q.visible
	  };
	};

	var showMenu = function showMenu(state, attrs) {
	  return transitionComponent(transitionOptions$2(state, attrs, true));
	};

	var hideMenu = function hideMenu(state, attrs) {
	  return transitionComponent(transitionOptions$2(state, attrs, false));
	};

	var unifyWidth = function unifyWidth(width) {
	  return width < MIN_WIDTH ? MIN_WIDTH : width;
	};

	var widthClass = function widthClass(size) {
	  return classes$q.width_n + size.toString().replace(".", "-");
	};

	var handleSubscriptions = function handleSubscriptions(vnode, which) {
	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (which === "mount") {
	    subscribe("resize", state.update);
	    subscribe("keydown", state.handleEscape);
	    setTimeout(function () {
	      state.activateDismissTap();
	      showMenu(state, attrs);
	    }, 0);
	  } else {
	    unsubscribe("resize", state.update);
	    unsubscribe("keydown", state.handleEscape);
	    state.deActivateDismissTap();
	  }
	};

	var getInitialState$8 = function getInitialState(vnode, createStream) {
	  var dom = createStream(null);
	  var attrs = vnode.attrs;

	  if (attrs.offset !== undefined) {
	    deprecation("Menu", {
	      option: "offset",
	      newOption: "offsetH"
	    });
	  }

	  if (attrs.size !== undefined) {
	    deprecation("Menu", {
	      option: "size",
	      newOption: "width"
	    });
	  }

	  var visible = createStream(false);
	  var transitioning = createStream(false);
	  return {
	    dom: dom,
	    visible: visible,
	    transitioning: transitioning,
	    activateDismissTap: undefined,
	    // set in onMount
	    contentEl: undefined,
	    // set in onMount
	    deActivateDismissTap: undefined,
	    // set in onMount
	    handleDismissTap: undefined,
	    // set in onMount
	    handleEscape: undefined,
	    // set in onMount
	    panelEl: undefined,
	    // set in onMount
	    update: undefined,
	    // set in onMount
	    redrawOnUpdate: createStream.merge([transitioning])
	  };
	};

	var onMount$b = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  state.dom(vnode.dom);
	  state.panelEl = vnode.dom.querySelector(".".concat(classes$q.panel));

	  _extends$m(state.panelEl.style, attrs.style);

	  state.contentEl = vnode.dom.querySelector(".".concat(classes$q.content));

	  if (!attrs.permanent) {
	    state.handleDismissTap = function (e) {
	      if (e.target === state.panelEl) {
	        return;
	      }

	      hideMenu(state, attrs);
	    };

	    state.update = function () {
	      positionMenu(state, attrs);
	      scrollContent(state, attrs);
	    };

	    state.activateDismissTap = function () {
	      pointerEndMoveEvent.forEach(function (evt) {
	        return document.addEventListener(evt, state.handleDismissTap);
	      });
	    };

	    state.deActivateDismissTap = function () {
	      pointerEndMoveEvent.forEach(function (evt) {
	        return document.removeEventListener(evt, state.handleDismissTap);
	      });
	    };

	    state.handleEscape = function (e) {
	      if (e.key === "Escape" || e.key === "Esc") {
	        hideMenu(state, _extends$m({}, attrs, {
	          hideDelay: 0
	        }));
	      }
	    };

	    handleSubscriptions(vnode, "mount");
	  }
	};

	var onUnMount$5 = function onUnMount(vnode) {
	  var attrs = vnode.attrs;

	  if (!attrs.permanent) {
	    handleSubscriptions(vnode, "unmount");
	  }
	};

	var createProps$l = function createProps(vnode, _ref2) {
	  var k = _ref2.keys;
	  var attrs = vnode.attrs;
	  var type = attrs.type || DEFAULT_TYPE;
	  return _extends$m({}, filterSupportedAttributes(attrs, {
	    remove: ["style"]
	  }), {
	    className: [classes$q.component, attrs.permanent ? classes$q.permanent : null, attrs.origin ? classes$q.origin : null, attrs.backdrop ? classes$q.showBackdrop : null, attrs.topMenu ? classes$q.isTopMenu : null, type === "floating" && !attrs.permanent ? classes$q.floating : null, attrs.width || attrs.size ? widthClass(unifyWidth(attrs.width || attrs.size)) : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$g = function createContent(vnode, _ref3) {
	  var h = _ref3.renderer,
	      Shadow = _ref3.Shadow;
	  var attrs = vnode.attrs;
	  var shadowDepth = attrs.shadowDepth !== undefined ? attrs.shadowDepth : attrs.z !== undefined ? attrs.z // deprecated
	  : DEFAULT_SHADOW_DEPTH$1;
	  return [h("div", {
	    key: "backdrop",
	    className: classes$q.backdrop
	  }), h("div", {
	    className: classes$q.panel,
	    key: "panel"
	  }, [h(Shadow, {
	    shadowDepth: shadowDepth,
	    animated: true,
	    key: "shadow"
	  }), h("div", {
	    className: classes$q.content,
	    key: "content"
	  }, attrs.content ? attrs.content : vnode.children)])];
	};

	var menu =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$c,
	  getInitialState: getInitialState$8,
	  onMount: onMount$b,
	  onUnMount: onUnMount$5,
	  createProps: createProps$l,
	  createContent: createContent$g
	});

	function _defineProperty$n(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$j(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$n(target, key, source[key]);
	    });
	  }

	  return target;
	}
	var MenuInstance = ComponentCreator(_objectSpread$j({}, menu, {
	  createContent: function createContent(vnode, args) {
	    return menu.createContent(vnode, _objectSpread$j({}, args, {
	      Shadow: Shadow
	    }));
	  }
	}));
	var MenuToggle = ComponentCreator(Conditional);
	MenuToggle["displayName"] = "MenuToggle";

	function _defineProperty$o(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$n() {
	  _extends$n = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$n.apply(this, arguments);
	}

	var classes$s = {
	  component: "pe-notification",
	  // elements
	  action: "pe-notification__action",
	  content: "pe-notification__content",
	  holder: "pe-notification__holder",
	  placeholder: "pe-notification__placeholder",
	  title: "pe-notification__title",
	  // states
	  hasContainer: "pe-notification--container",
	  horizontal: "pe-notification--horizontal",
	  multilineTitle: "pe-notification__title--multi-line",
	  vertical: "pe-notification--vertical",
	  visible: "pe-notification--visible"
	};
	var DEFAULT_TIME_OUT = 3;

	var getElement$d = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var pause = function pause(state) {
	  state.paused(true);

	  if (state.timer) {
	    state.timer.pause();
	  }
	};

	var unpause = function unpause(state) {
	  state.paused(false);

	  if (state.timer) {
	    state.timer.resume();
	  }
	};

	var stopTimer = function stopTimer(state) {
	  if (state.timer) {
	    state.timer.stop();
	  }
	};

	var transitionOptions$3 = function transitionOptions(state, attrs, isShow) {
	  return {
	    state: state,
	    attrs: attrs,
	    isShow: isShow,
	    beforeTransition: isShow ? function () {
	      return stopTimer(state);
	    } : function () {
	      return stopTimer(state);
	    },
	    afterTransition: isShow ? function () {
	      // set timer to hide in a few seconds
	      var timeout = attrs.timeout;
	      if (timeout === 0) ;else {
	        var timeoutSeconds = timeout !== undefined ? timeout : DEFAULT_TIME_OUT;
	        state.timer.start(function () {
	          hideNotification(state, attrs);
	        }, timeoutSeconds);
	      }
	    } : null,
	    domElements: {
	      el: state.el,
	      containerEl: state.containerEl
	    },
	    showClass: classes$s.visible
	  };
	};

	var showNotification = function showNotification(state, attrs) {
	  return transitionComponent(transitionOptions$3(state, attrs, true));
	};

	var hideNotification = function hideNotification(state, attrs) {
	  return transitionComponent(transitionOptions$3(state, attrs, false));
	};

	var setTitleStyles = function setTitleStyles(titleEl) {
	  if (isServer) return;
	  var height = titleEl.getBoundingClientRect().height;
	  var lineHeight = parseInt(window.getComputedStyle(titleEl).lineHeight, 10);
	  var paddingTop = parseInt(window.getComputedStyle(titleEl).paddingTop, 10);
	  var paddingBottom = parseInt(window.getComputedStyle(titleEl).paddingBottom, 10);

	  if (height > lineHeight + paddingTop + paddingBottom) {
	    titleEl.classList.add(classes$s.multilineTitle);
	  }
	};

	var getInitialState$9 = function getInitialState(vnode, createStream) {
	  var transitioning = createStream(false);
	  var paused = createStream(false);
	  var mounted = createStream(false);
	  var visible = createStream(false);
	  return {
	    cleanUp: undefined,
	    containerEl: undefined,
	    dismissEl: undefined,
	    el: undefined,
	    timer: new Timer(),
	    paused: paused,
	    transitioning: transitioning,
	    visible: visible,
	    mounted: mounted,
	    redrawOnUpdate: createStream.merge([visible])
	  };
	};

	var onMount$c = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var dom = vnode.dom;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  state.el = dom;
	  var titleEl = state.el.querySelector(".".concat(classes$s.title));

	  if (titleEl) {
	    setTitleStyles(titleEl);
	  }

	  if (!state.containerEl && isClient) {
	    // attrs.holderSelector is passed as option to Multiple
	    state.containerEl = document.querySelector(attrs.containerSelector || attrs.holderSelector);
	  }

	  if (!state.containerEl && isClient) {
	    console.error("No container element found"); // eslint-disable-line no-console
	  }

	  if (attrs.containerSelector && state.containerEl) {
	    state.containerEl.classList.add(classes$s.hasContainer);
	  }

	  if (attrs.show && !state.visible()) {
	    showNotification(state, attrs);
	  }

	  state.mounted(true);
	};

	var onUnMount$6 = function onUnMount(vnode) {
	  return vnode.state.mounted(false);
	};

	var createProps$m = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _extends$n({}, filterSupportedAttributes(attrs, {
	    remove: ["style"]
	  }), // style set in content, and set by show/hide transition
	  _defineProperty$o({
	    className: [classes$s.component, attrs.fromMultipleClassName, // classes.visible is set in showNotification though transition
	    attrs.tone === "light" ? null : "pe-dark-tone", // default dark tone
	    attrs.containerSelector ? classes$s.hasContainer : null, attrs.layout === "vertical" ? classes$s.vertical : classes$s.horizontal, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  }, k.onclick, function (e) {
	    return e.preventDefault();
	  }));
	};

	var createContent$h = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer;
	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (state.mounted() && !state.transitioning()) {
	    if (attrs.hide && state.visible()) {
	      hideNotification(state, attrs);
	    } else if (attrs.show && !state.visible()) {
	      showNotification(state, attrs);
	    }
	  }

	  if (attrs.pause && !state.paused()) {
	    pause(state, attrs);
	  } else if (attrs.unpause && state.paused()) {
	    unpause(state, attrs);
	  }

	  return h("div", {
	    className: classes$s.content,
	    style: attrs.style
	  }, attrs.content || [attrs.title ? h("div", {
	    className: classes$s.title
	  }, attrs.title) : null, attrs.action ? h("div", {
	    className: classes$s.action
	  }, attrs.action) : null]);
	};

	var notification =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$d,
	  getInitialState: getInitialState$9,
	  onMount: onMount$c,
	  onUnMount: onUnMount$6,
	  createProps: createProps$m,
	  createContent: createContent$h
	});

	var classes$t = {
	  component: "pe-notification",
	  // elements
	  action: "pe-notification__action",
	  content: "pe-notification__content",
	  holder: "pe-notification__holder",
	  placeholder: "pe-notification__placeholder",
	  title: "pe-notification__title",
	  // states
	  hasContainer: "pe-notification--container",
	  horizontal: "pe-notification--horizontal",
	  multilineTitle: "pe-notification__title--multi-line",
	  vertical: "pe-notification--vertical",
	  visible: "pe-notification--visible"
	}; // @ts-check

	var NotificationInstance = ComponentCreator(notification);
	NotificationInstance["displayName"] = "NotificationInstance";
	var options$1 = {
	  name: "notification",
	  className: classes$t.component,
	  htmlShowClass: classes$t.open,
	  defaultId: "default_notification",
	  holderSelector: ".".concat(classes$t.holder),
	  instance: NotificationInstance,
	  placeholder: "span.".concat(classes$t.placeholder),
	  queue: true
	};
	var Multiple$1 = Multi({
	  options: options$1,
	  renderer: renderer
	});
	var Notification = ComponentCreator(Multiple$1);
	Object.getOwnPropertyNames(Multiple$1).forEach(function (p) {
	  return Notification[p] = Multiple$1[p];
	});
	Notification["displayName"] = "Notification";

	function _extends$o() {
	  _extends$o = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$o.apply(this, arguments);
	}

	var classes$u = {
	  component: "pe-radio-control"
	};
	var iconOn$1 = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z\"/></svg>";
	var iconOff$1 = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z\"/></svg>";
	var icons$1 = {
	  iconOff: iconOff$1,
	  iconOn: iconOn$1
	}; // Props to be passed to a selection control

	var createProps$n = function createProps(vnode) {
	  var attrs = vnode.attrs;
	  return _extends$o({}, attrs, {
	    icons: icons$1,
	    selectable: attrs.selectable || function (selected) {
	      return !selected;
	    },
	    // default: only selectable when not checked
	    instanceClass: classes$u.component,
	    type: "radio"
	  });
	};

	var radioButton =
	/*#__PURE__*/
	Object.freeze({
	  createProps: createProps$n
	});

	function _defineProperty$p(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$p() {
	  _extends$p = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$p.apply(this, arguments);
	}

	function _objectSpread$k(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$p(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var ViewControl$1 = ComponentCreator(_objectSpread$k({}, viewControl, {
	  createContent: function createContent(vnode, args) {
	    return viewControl.createContent(vnode, _objectSpread$k({}, args, {
	      Icon: Icon,
	      IconButton: IconButton
	    }));
	  }
	}));
	ViewControl$1["displayName"] = "ViewControl";
	var SelectionControl$1 = ComponentCreator(_objectSpread$k({}, selectionControl, {
	  createContent: function createContent(vnode, args) {
	    return selectionControl.createContent(vnode, _extends$p(args, {
	      ViewControl: ViewControl$1
	    }));
	  }
	}));
	SelectionControl$1["displayName"] = "SelectionControl";
	var RadioButton = ComponentCreator(_objectSpread$k({}, radioButton, {
	  component: SelectionControl$1
	}));
	RadioButton["displayName"] = "RadioButton";

	function _extends$q() {
	  _extends$q = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$q.apply(this, arguments);
	}

	var classes$v = {
	  component: "pe-radio-group"
	};

	var getButtons = function getButtons(vnode) {
	  var attrs = vnode.attrs;
	  return attrs.content ? attrs.content : attrs.buttons ? attrs.buttons : attrs.children || vnode.children || [];
	};

	var getElement$e = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var getInitialState$a = function getInitialState(vnode, createStream) {
	  var attrs = vnode.attrs;

	  if (attrs.defaultSelectedValue !== undefined) {
	    deprecation("RadioGroup", {
	      option: "defaultSelectedValue",
	      newOption: "defaultCheckedValue",
	      since: "1.4.2"
	    });
	  }

	  var buttons = getButtons(vnode);
	  var checkedIdx = buttons.reduce(function (acc, buttonOpts, index) {
	    if (buttonOpts.value === undefined) {
	      console.error("Option 'value' not set for radio button"); // eslint-disable-line no-console
	    }

	    return acc !== null ? acc : buttonOpts.defaultChecked !== undefined || attrs.defaultCheckedValue !== undefined && buttonOpts.value === attrs.defaultCheckedValue || attrs.defaultSelectedValue !== undefined && buttonOpts.value === attrs.defaultSelectedValue // deprecated
	    ? index : acc;
	  }, null);
	  var checkedIndex = createStream(checkedIdx);
	  return {
	    checkedIndex: checkedIndex,
	    redrawOnUpdate: createStream.merge([checkedIndex])
	  };
	};

	var createProps$o = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _extends$q({}, filterSupportedAttributes(attrs), {
	    className: [classes$v.component, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$i = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer,
	      RadioButton = _ref2.RadioButton;
	  var attrs = vnode.attrs;
	  var state = vnode.state;
	  var checkedIndex = state.checkedIndex();
	  var buttons = getButtons(vnode);
	  var groupCheckedValue = attrs.checkedValue;
	  return buttons.length ? buttons.map(function (buttonOpts, index) {
	    if (!buttonOpts) {
	      return null;
	    }

	    var isChecked = buttonOpts.checked !== undefined ? buttonOpts.checked : groupCheckedValue !== undefined ? buttonOpts.value === groupCheckedValue : checkedIndex === index;
	    return h(RadioButton, _extends$q({}, {
	      /* group attributes that may be overwritten by individual buttons */
	      name: attrs.name,
	      key: buttonOpts.value
	    }, attrs.all,
	    /* individual button options */
	    buttonOpts, {
	      /* this component's options */
	      onChange: function onChange(_ref3) {
	        var value = _ref3.value;
	        return state.checkedIndex(index), attrs.onChange && attrs.onChange({
	          value: value
	        });
	      },
	      checked: isChecked
	    }));
	  }) : null;
	};

	var radioGroup =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$e,
	  getInitialState: getInitialState$a,
	  createProps: createProps$o,
	  createContent: createContent$i
	});

	function _defineProperty$q(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$r() {
	  _extends$r = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$r.apply(this, arguments);
	}

	function _objectSpread$l(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$q(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var RadioGroup = ComponentCreator(_objectSpread$l({}, radioGroup, {
	  createContent: function createContent(vnode, args) {
	    return radioGroup.createContent(vnode, _extends$r(args, {
	      RadioButton: RadioButton
	    }));
	  }
	}));
	RadioGroup["displayName"] = "RadioGroup";

	function _defineProperty$r(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$m(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$r(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var RaisedButton$1 = ComponentCreator({
	  onMount: function onMount() {
	    deprecation("RaisedButton", {
	      newComponent: "Button",
	      newOption: "raised: true"
	    });
	  },
	  view: function view(vnode) {
	    return renderer(Button, _objectSpread$m({
	      raised: true
	    }, vnode.attrs), vnode.children);
	  }
	});
	RaisedButton$1["displayName"] = "RaisedButton";

	function _extends$s() {
	  _extends$s = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$s.apply(this, arguments);
	}

	var classes$w = {
	  component: "pe-search",
	  // elements
	  content: "pe-search__content",
	  // states
	  searchFullWidth: "pe-search--full-width",
	  searchInset: "pe-search--inset"
	};

	var getElement$f = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var getNameOfState = function getNameOfState(state) {
	  return state.focus && state.dirty ? "focus_dirty" : state.focus ? "focus" : state.dirty ? "dirty" : "none";
	};

	var getInitialState$b = function getInitialState(vnode, createStream) {
	  var searchState = createStream({});
	  return {
	    searchState: searchState
	  };
	};

	var createProps$p = function createProps(vnode, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  return _extends$s({}, filterSupportedAttributes(attrs), {
	    className: [classes$w.component, attrs.fullWidth ? classes$w.searchFullWidth : classes$w.searchInset, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events);
	};

	var createContent$j = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer,
	      TextField = _ref2.TextField;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var searchState = getNameOfState(state.searchState());
	  var buttons = (attrs.buttons || {})[searchState] || {};
	  var textfieldAttrs = attrs.textfield || {};
	  return h("div", {
	    className: classes$w.content
	  }, [buttons.before, h(TextField, _extends$s({}, textfieldAttrs, {
	    key: "input",
	    onChange: function onChange(newState) {
	      state.searchState(newState);

	      if (textfieldAttrs.onChange) {
	        textfieldAttrs.onChange(newState);
	      }
	    }
	  })), buttons.after]);
	};

	var search =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$f,
	  getInitialState: getInitialState$b,
	  createProps: createProps$p,
	  createContent: createContent$j
	});

	function _defineProperty$s(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$t() {
	  _extends$t = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$t.apply(this, arguments);
	}

	function _objectSpread$n(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$s(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var classes$x = {
	  component: "pe-textfield",
	  // elements
	  counter: "pe-textfield__counter",
	  error: "pe-textfield__error",
	  errorPlaceholder: "pe-textfield__error-placeholder",
	  focusHelp: "pe-textfield__help-focus",
	  help: "pe-textfield__help",
	  input: "pe-textfield__input",
	  inputArea: "pe-textfield__input-area",
	  label: "pe-textfield__label",
	  optionalIndicator: "pe-textfield__optional-indicator",
	  requiredIndicator: "pe-textfield__required-indicator",
	  // states
	  hasCounter: "pe-textfield--counter",
	  hasFloatingLabel: "pe-textfield--floating-label",
	  hasFullWidth: "pe-textfield--full-width",
	  hideClear: "pe-textfield--hide-clear",
	  hideSpinner: "pe-textfield--hide-spinner",
	  hideValidation: "pe-textfield--hide-validation",
	  isDense: "pe-textfield--dense",
	  isRequired: "pe-textfield--required",
	  stateDirty: "pe-textfield--dirty",
	  stateDisabled: "pe-textfield--disabled",
	  stateFocused: "pe-textfield--focused",
	  stateInvalid: "pe-textfield--invalid",
	  stateReadonly: "pe-textfield--readonly"
	};

	var getElement$g = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var DEFAULT_VALID_STATE = {
	  invalid: false,
	  message: undefined
	};

	var validateCustom = function validateCustom(state, attrs) {
	  var el = state.inputEl();

	  if (!el) {
	    return DEFAULT_VALID_STATE;
	  }

	  var validState = attrs.validate(state.inputEl().value);
	  return {
	    invalid: validState && !validState.valid,
	    message: validState && validState.error
	  };
	};

	var validateCounter = function validateCounter(state, attrs) {
	  return {
	    invalid: state.inputEl().value.length > attrs.counter,
	    message: attrs.error
	  };
	};

	var validateHTML = function validateHTML(state, attrs) {
	  return {
	    invalid: !state.inputEl().checkValidity(),
	    message: attrs.error
	  };
	};

	var getValidStatus = function getValidStatus(state, attrs) {
	  var status = DEFAULT_VALID_STATE; // attrs.validateResetOnClear: reset validation when field is cleared

	  if (state.isTouched() && state.isInvalid() && state.inputEl().value.length === 0 && attrs.validateResetOnClear) {
	    state.isTouched(false);
	    state.isInvalid(false);
	    state.error(undefined);
	  }

	  if (!status.invalid && attrs.counter) {
	    status = validateCounter(state, attrs);
	  }

	  if (!status.invalid && state.inputEl() && state.inputEl().checkValidity) {
	    status = validateHTML(state, attrs);
	  }

	  if (!status.invalid && attrs.validate) {
	    status = validateCustom(state, attrs);
	  }

	  return status;
	};

	var checkValidity = function checkValidity(vnode) {
	  var state = vnode.state;
	  var attrs = vnode.attrs; // default

	  var status = attrs.valid !== undefined ? {
	    invalid: !attrs.valid,
	    message: attrs.error
	  } : !state.isTouched() && !attrs.validateAtStart ? DEFAULT_VALID_STATE : getValidStatus(state, attrs);
	  var previousInvalid = state.isInvalid();
	  state.error(status.message);

	  if (status.invalid !== previousInvalid) {
	    state.isInvalid(status.invalid);
	  }

	  if (!status.invalid) {
	    state.error(undefined);
	  }
	};

	var notifyState = function notifyState(vnode) {
	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (attrs.onChange) {
	    var status = getValidStatus(state, attrs);
	    attrs.onChange({
	      focus: state.hasFocus(),
	      dirty: state.isDirty(),
	      el: state.inputEl(),
	      invalid: status.invalid,
	      error: status.error,
	      value: state.inputEl().value,
	      setInputState: function setInputState(newState) {
	        var hasNewValue = newState.value !== undefined && newState.value !== state.inputEl().value;
	        var hasNewFocus = newState.focus !== undefined && newState.focus !== state.hasFocus();

	        if (hasNewValue || hasNewFocus) {
	          state.setInputState(_extends$t({}, newState, {
	            vnode: vnode
	          }));
	        }
	      }
	    });
	  }
	};

	var ignoreEvent = function ignoreEvent(attrs, name) {
	  return attrs.ignoreEvents && attrs.ignoreEvents.indexOf(name) !== -1;
	};

	var getInitialState$c = function getInitialState(vnode, createStream, _ref) {
	  var k = _ref.keys;
	  var attrs = vnode.attrs;
	  var defaultValue = attrs.defaultValue !== undefined && attrs.defaultValue !== null ? attrs.defaultValue.toString() : attrs.value !== undefined && attrs.value !== null ? attrs.value.toString() : "";
	  var el = createStream(null);
	  var inputEl = createStream(null);
	  var setInputState = createStream({});
	  var error = createStream(attrs.error);
	  var hasFocus = createStream(false);
	  var isTouched = createStream(false); // true when any change is made

	  var isDirty = createStream(defaultValue !== ""); // true for any input

	  var isInvalid = createStream(false);
	  var previousValue = createStream(undefined);
	  var didSetFocusTime = 0;
	  var showErrorPlaceholder = !!(attrs.valid !== undefined || attrs.validate || attrs.min || attrs.max || attrs[k.minlength] || attrs[k.maxlength] || attrs.required || attrs.pattern);
	  return {
	    defaultValue: defaultValue,
	    didSetFocusTime: didSetFocusTime,
	    el: el,
	    error: error,
	    hasFocus: hasFocus,
	    inputEl: inputEl,
	    isDirty: isDirty,
	    isInvalid: isInvalid,
	    isTouched: isTouched,
	    previousValue: previousValue,
	    setInputState: setInputState,
	    showErrorPlaceholder: showErrorPlaceholder,
	    redrawOnUpdate: createStream.merge([inputEl, isInvalid, isDirty])
	  };
	};

	var onMount$d = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var dom = vnode.dom;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  state.el(dom);
	  var inputType = attrs.multiLine ? "textarea" : "input";
	  var inputEl = dom.querySelector(inputType);
	  vnode.state.inputEl(inputEl);
	  state.inputEl().value = state.defaultValue;
	  state.setInputState.map(function (_ref2) {
	    var vnode = _ref2.vnode,
	        type = _ref2.type,
	        focus = _ref2.focus,
	        value = _ref2.value;

	    if (vnode) {
	      value !== undefined ? state.inputEl().value = value : null;
	      focus !== undefined && (state.hasFocus(focus), focus ? state.inputEl().focus() : state.inputEl().blur());
	      type === "input" && (attrs.validateOnInput || attrs.counter) && state.isTouched(state.inputEl().value !== state.defaultValue);
	      type !== "input" && state.isTouched(state.inputEl().value !== state.defaultValue);
	      type === "onblur" && state.isTouched(true);
	      state.isDirty(state.inputEl().value !== "");
	      checkValidity(vnode);
	      notifyState(vnode);
	      state.previousValue(state.inputEl().value);
	    }
	  });
	  notifyState(vnode);
	};

	var onUpdate = function onUpdate(vnode) {
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  checkValidity(vnode);
	  var inputEl = state.inputEl();
	  var value = attrs.value !== undefined && attrs.value !== null ? attrs.value : inputEl ? inputEl.value : state.previousValue();
	  var valueStr = value === undefined || value === null ? "" : value.toString();

	  if (inputEl && state.previousValue() !== valueStr) {
	    inputEl.value = valueStr;
	    state.previousValue(valueStr);
	    state.setInputState({
	      vnode: vnode,
	      type: "input"
	    });
	  }
	};

	var createProps$q = function createProps(vnode, _ref3) {
	  var k = _ref3.keys;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var isInvalid = state.isInvalid();
	  return _extends$t({}, filterSupportedAttributes(attrs), {
	    className: [classes$x.component, isInvalid ? classes$x.stateInvalid : "", state.hasFocus() ? classes$x.stateFocused : "", state.isDirty() ? classes$x.stateDirty : "", attrs.floatingLabel ? classes$x.hasFloatingLabel : "", attrs.disabled ? classes$x.stateDisabled : "", attrs.readonly ? classes$x.stateReadonly : "", attrs.dense ? classes$x.isDense : "", attrs.required ? classes$x.isRequired : "", attrs.fullWidth ? classes$x.hasFullWidth : "", attrs.counter ? classes$x.hasCounter : "", attrs.hideSpinner !== false && attrs.hideSpinner !== undefined ? classes$x.hideSpinner : "", attrs.hideClear !== false && attrs.hideClear !== undefined ? classes$x.hideClear : "", attrs.hideValidation ? classes$x.hideValidation : "", attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$k = function createContent(vnode, _ref4) {
	  var h = _ref4.renderer,
	      k = _ref4.keys;
	  var state = vnode.state;

	  var attrs = _objectSpread$n({}, vnode.attrs, vnode.attrs.domAttributes);

	  var inputEl = state.inputEl();
	  var error = attrs.error || state.error();
	  var isInvalid = state.isInvalid();
	  var inputType = attrs.multiLine ? "textarea" : "input";
	  var type = attrs.multiLine ? null : !attrs.type || attrs.type === "submit" || attrs.type === "search" ? "text" : attrs.type;
	  var showError = isInvalid && error !== undefined;
	  var inactive = attrs.disabled || attrs[k.readonly];
	  var requiredIndicator = attrs.required && attrs.requiredIndicator !== "" ? h("span", {
	    key: "required",
	    className: classes$x.requiredIndicator
	  }, attrs.requiredIndicator || "*") : null;
	  var optionalIndicator = !attrs.required && attrs.optionalIndicator ? h("span", {
	    key: "optional",
	    className: classes$x.optionalIndicator
	  }, attrs.optionalIndicator) : null;
	  var label = attrs.label ? [attrs.label, requiredIndicator, optionalIndicator] : null;
	  return [h("div", {
	    className: classes$x.inputArea,
	    key: "input-area"
	  }, [label ? h("label", {
	    key: "label",
	    className: classes$x.label
	  }, label) : null, h(inputType, _extends$t({}, {
	    key: "input",
	    className: classes$x.input,
	    disabled: attrs.disabled
	  }, type ? {
	    type: type
	  } : null, attrs.name ? {
	    name: attrs.name
	  } : null, !ignoreEvent(attrs, k.onclick) ? _defineProperty$s({}, k.onclick, function () {
	    if (inactive) {
	      return;
	    } // in case the browser does not give the field focus,
	    // for instance when the user tapped to the current field off screen


	    state.setInputState({
	      vnode: vnode,
	      focus: true
	    });
	    notifyState(vnode);
	  }) : null, !ignoreEvent(attrs, k.onfocus) ? _defineProperty$s({}, k.onfocus, function () {
	    if (inactive) {
	      return;
	    }

	    state.setInputState({
	      vnode: vnode,
	      focus: true
	    }); // set CSS class manually in case field gets focus but is off screen
	    // and no redraw is triggered
	    // at the next redraw state.hasFocus() will be read and the focus class be set
	    // in the props.class statement

	    if (state.el()) {
	      state.el().classList.add(classes$x.stateFocused);
	    }

	    notifyState(vnode);
	  }) : null, !ignoreEvent(attrs, k.onblur) ? _defineProperty$s({}, k.onblur, function () {
	    state.setInputState({
	      vnode: vnode,
	      type: "onblur",
	      focus: false
	    }); // same principle as onfocus

	    state.el().classList.remove(classes$x.stateFocused);
	  }) : null, !ignoreEvent(attrs, k.oninput) ? _defineProperty$s({}, k.oninput, function () {
	    // default input event
	    // may be overwritten by attrs.events
	    state.setInputState({
	      vnode: vnode,
	      type: "input"
	    });
	  }) : null, !ignoreEvent(attrs, k.onkeydown) ? _defineProperty$s({}, k.onkeydown, function (e) {
	    if (e.key === "Enter") {
	      state.isTouched(true);
	    } else if (e.key === "Escape" || e.key === "Esc") {
	      state.setInputState({
	        vnode: vnode,
	        focus: false
	      });
	    }
	  }) : null, attrs.events ? attrs.events : null, // NOTE: may overwrite oninput
	  attrs.required !== undefined && !!attrs.required ? {
	    required: true
	  } : null, attrs[k.readonly] !== undefined && !!attrs[k.readonly] ? _defineProperty$s({}, k.readonly, true) : null, attrs.pattern !== undefined ? {
	    pattern: attrs.pattern
	  } : null, attrs[k.maxlength] !== undefined ? _defineProperty$s({}, k.maxlength, attrs[k.maxlength]) : null, attrs[k.minlength] !== undefined ? _defineProperty$s({}, k.minlength, attrs[k.minlength]) : null, attrs.max !== undefined ? {
	    max: attrs.max
	  } : null, attrs.min !== undefined ? {
	    min: attrs.min
	  } : null, attrs[k.autofocus] !== undefined ? _defineProperty$s({}, k.autofocus, attrs[k.autofocus]) : null, attrs[k.tabindex] !== undefined ? _defineProperty$s({}, k.tabindex, attrs[k.tabindex]) : null, attrs.rows !== undefined ? {
	    rows: attrs.rows
	  } : null, attrs.placeholder !== undefined ? {
	    placeholder: attrs.placeholder
	  } : null, attrs.domAttributes !== undefined ? _objectSpread$n({}, attrs.domAttributes) : null))]), attrs.counter ? h("div", {
	    key: "counter",
	    className: classes$x.counter
	  }, (inputEl && inputEl.value.length || 0) + " / " + attrs.counter) : null, attrs.help && !showError ? h("div", {
	    key: "help",
	    className: [classes$x.help, attrs.focusHelp ? classes$x.focusHelp : null].join(" ")
	  }, attrs.help) : null, showError ? h("div", {
	    key: "error",
	    className: classes$x.error
	  }, error) : state.showErrorPlaceholder && !attrs.help ? h("div", {
	    key: "error-placeholder",
	    className: classes$x.errorPlaceholder
	  }) : null];
	};

	var textfield =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$g,
	  getInitialState: getInitialState$c,
	  onMount: onMount$d,
	  onUpdate: onUpdate,
	  createProps: createProps$q,
	  createContent: createContent$k
	});

	var TextField = ComponentCreator(textfield);
	TextField["displayName"] = "TextField";

	function _defineProperty$t(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$u() {
	  _extends$u = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$u.apply(this, arguments);
	}

	function _objectSpread$o(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$t(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var Search = ComponentCreator(_objectSpread$o({}, search, {
	  createContent: function createContent(vnode, args) {
	    return search.createContent(vnode, _extends$u(args, {
	      TextField: TextField
	    }));
	  }
	}));
	Search["displayName"] = "Search";

	function _defineProperty$u(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$v() {
	  _extends$v = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$v.apply(this, arguments);
	}

	var classes$y = {
	  component: "pe-slider",
	  // elements
	  control: "pe-slider__control",
	  label: "pe-slider__label",
	  pin: "pe-slider__pin",
	  thumb: "pe-slider__thumb",
	  tick: "pe-slider__tick",
	  ticks: "pe-slider__ticks",
	  track: "pe-slider__track",
	  trackBar: "pe-slider__track-bar",
	  trackBarValue: "pe-slider__track-bar-value",
	  trackPart: "pe-slider__track-part",
	  trackPartRest: "pe-slider__track-rest",
	  trackPartValue: "pe-slider__track-value",
	  // states
	  hasFocus: "pe-slider--focus",
	  hasPin: "pe-slider--pin",
	  hasTicks: "pe-slider--ticks",
	  hasTrack: "pe-slider--track",
	  isActive: "pe-slider--active",
	  isAtMin: "pe-slider--min",
	  isDisabled: "pe-slider--disabled",
	  tickValue: "pe-slider__tick--value"
	};
	var MAX_TICKS = 100;
	var focusElement;

	var deFocus = function deFocus(state) {
	  if (focusElement) {
	    focusElement.blur();
	  }

	  focusElement = undefined;
	  state.hasFocus(false);
	};

	var focus = function focus(state, el) {
	  deFocus(state);
	  focusElement = el;
	  state.hasFocus(true);
	};

	var positionFromEvent = function positionFromEvent(e, isVertical) {
	  return (// isVertical not yet implemented
	    isTouch && e.touches ? isVertical ? e.touches[0].pageY : e.touches[0].pageX : isVertical ? e.pageY : e.pageX
	  );
	};

	var updatePinPosition = function updatePinPosition(state) {
	  if (state.controlEl && state.pinEl) {
	    var left = state.fraction() * state.rangeWidth;
	    state.pinEl.style.left = left + "px";
	  }
	};

	var updateValue = function updateValue(state, value) {
	  state.setValue(value, true);
	  updatePinPosition(state);
	};

	var generateTickMarks = function generateTickMarks(h, stepCount, stepSize, value) {
	  var items = [];
	  var stepWithValue = value / stepSize;
	  var s = 0;

	  while (s < stepCount + 1) {
	    items.push(h("div", {
	      className: s <= stepWithValue ? [classes$y.tick, classes$y.tickValue].join(" ") : classes$y.tick,
	      key: "tick-".concat(s)
	    }));
	    s++;
	  }

	  return items;
	};

	var readRangeData = function readRangeData(state) {
	  if (state.controlEl && isClient) {
	    // range is from the far left to the far right minus the thumb width (max x is at the left side of the thumb)
	    state.controlWidth = parseFloat(getStyle({
	      element: state.controlEl,
	      prop: "width"
	    }));
	    state.rangeWidth = state.trackEl.getBoundingClientRect().width - state.controlWidth;
	    var styles = window.getComputedStyle(state.trackEl);
	    state.rangeOffset = parseFloat(styles.marginLeft);
	  }
	};

	var calculateClickOffset = function calculateClickOffset(state) {
	  var controlOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	  state.clickOffset = state.trackEl.getBoundingClientRect().left - (state.rangeOffset - state.controlWidth / 2) + controlOffset;
	};

	var initControlEvent = function initControlEvent(state, e) {
	  var controlPos = state.controlEl.getBoundingClientRect().left;
	  var eventPos = positionFromEvent(e);
	  var controlOffset = eventPos - controlPos - state.controlWidth / 2;
	  calculateClickOffset(state, controlOffset);
	};

	var initTrackEvent = function initTrackEvent(state) {
	  return calculateClickOffset(state, 0);
	};

	var handlePosEvent = function handlePosEvent(state, e) {
	  var pos = positionFromEvent(e) - state.clickOffset;
	  var value = state.min + (pos - state.rangeOffset) / state.rangeWidth * (state.max - state.min);
	  updateValue(state, value);
	};

	var startDrag = function startDrag(state, attrs, e) {
	  if (state.isDragging()) return;
	  e.preventDefault();
	  state.isDragging(true);
	  state.isActive(true);
	  deFocus(state);

	  var drag = function drag(e) {
	    if (!state.isDragging()) return;
	    handlePosEvent(state, e);
	  };

	  var endDrag = function endDrag() {
	    if (!state.isDragging()) return;
	    deFocus(state);

	    if (isClient) {
	      pointerMoveEvent.forEach(function (evt) {
	        return window.removeEventListener(evt, drag);
	      });
	      pointerEndMoveEvent.forEach(function (evt) {
	        return window.removeEventListener(evt, endDrag);
	      });
	    }

	    state.isDragging(false);
	    state.isActive(false);
	  };

	  if (isClient) {
	    pointerMoveEvent.forEach(function (evt) {
	      return window.addEventListener(evt, drag);
	    });
	    pointerEndMoveEvent.forEach(function (evt) {
	      return window.addEventListener(evt, endDrag);
	    });
	  }

	  readRangeData(state);

	  if (attrs.pin) {
	    updatePinPosition(state);
	  }
	};

	var startTrack = function startTrack(state, attrs, e) {
	  e.preventDefault();

	  if (state.isDragging()) {
	    return;
	  }

	  readRangeData(state);
	  initTrackEvent(state);
	  handlePosEvent(state, e);
	  startDrag(state, attrs, e);
	};

	var createSlider = function createSlider(vnode, _ref) {
	  var _ref2;

	  var h = _ref.h,
	      k = _ref.k,
	      hasTicks = _ref.hasTicks,
	      interactiveTrack = _ref.interactiveTrack;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var fraction = state.fraction();
	  var range = state.max - state.min;
	  var stepCount = Math.min(MAX_TICKS, parseInt(range / state.stepSize, 10));

	  var onStartTrack = function onStartTrack(e) {
	    return startTrack(state, attrs, e);
	  };

	  var onInitDrag = function onInitDrag(e) {
	    readRangeData(state);
	    initControlEvent(state, e);
	    startDrag(state, attrs, e);
	  };

	  var flexValueCss = fraction + " 1 0%";
	  var flexRestValue = 1 - fraction;
	  var flexRestCss = flexRestValue + " 1 0%";
	  return h("div", _extends$v({}, {
	    className: classes$y.track
	  }, interactiveTrack && !attrs.disabled && pointerStartMoveEvent.reduce(function (acc, evt) {
	    return acc[k["on".concat(evt)]] = onStartTrack, acc;
	  }, {})), [h("div", {
	    className: classes$y.trackPart + " " + classes$y.trackPartValue,
	    key: "trackPartValue",
	    style: {
	      flex: flexValueCss,
	      msFlex: flexValueCss,
	      WebkitFlex: flexValueCss
	    }
	  }, h("div", {
	    className: classes$y.trackBar
	  }, h("div", {
	    className: classes$y.trackBarValue
	  }))), h("div", _extends$v({}, {
	    className: classes$y.control,
	    key: "control"
	  }, attrs.disabled ? {
	    disabled: true
	  } : (_ref2 = {}, _defineProperty$u(_ref2, k.tabindex, attrs[k.tabindex] || 0), _defineProperty$u(_ref2, k.onfocus, function () {
	    return focus(state, state.controlEl);
	  }), _defineProperty$u(_ref2, k.onblur, function () {
	    return deFocus(state);
	  }), _defineProperty$u(_ref2, k.onkeydown, function (e) {
	    if (e.key !== "Tab") {
	      e.preventDefault();
	    }

	    if (e.key === "Escape" || e.key === "Esc") {
	      state.controlEl.blur(e);
	    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "Left" || e.key === "Down") {
	      state.decrement(state, e.shiftKey);
	    } else if (e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "Right" || e.key === "Up") {
	      state.increment(state, e.shiftKey);
	    } else if (e.key === "Home") {
	      updateValue(state, state.min);
	    } else if (e.key === "End") {
	      updateValue(state, state.max);
	    } else if (e.key === "PageDown") {
	      state.decrement(state, true);
	    } else if (e.key === "PageUp") {
	      state.increment(state, true);
	    }

	    readRangeData(state);
	    updatePinPosition(state);
	  }), _ref2), !attrs.disabled && pointerStartMoveEvent.reduce(function (acc, evt) {
	    return acc[k["on".concat(evt)]] = onInitDrag, acc;
	  }, {}), attrs.events ? attrs.events : null, hasTicks ? {
	    step: stepCount
	  } : null), attrs.icon ? h("div", {
	    className: classes$y.thumb,
	    key: "icon"
	  }, attrs.icon) : null), h("div", {
	    className: classes$y.trackPart + " " + classes$y.trackPartRest,
	    key: "trackPartRest",
	    style: {
	      flex: flexRestCss,
	      msFlex: flexRestCss,
	      WebkitFlex: flexRestCss,
	      maxWidth: flexRestValue * 100 + "%" // for IE Edge

	    }
	  }, h("div", {
	    className: classes$y.trackBar
	  }, h("div", {
	    className: classes$y.trackBarValue
	  }))), hasTicks && !attrs.disabled ? h("div", {
	    className: classes$y.ticks,
	    key: "ticks"
	  }, generateTickMarks(h, stepCount, state.stepSize, state.value())) : null, hasTicks && attrs.pin && !attrs.disabled ? h("div", {
	    className: classes$y.pin,
	    key: "pin",
	    value: state.value()
	  }) : null]);
	};

	var getInitialState$d = function getInitialState(vnode, createStream) {
	  var attrs = vnode.attrs;
	  var min = attrs.min !== undefined ? attrs.min : 0;
	  var max = attrs.max !== undefined ? attrs.max : 100;
	  var range = max - min;
	  var stepSize = attrs.stepSize !== undefined ? attrs.stepSize : 1;
	  var defaultValue = attrs.defaultValue !== undefined ? attrs.defaultValue : attrs.value !== undefined ? attrs.value : 0;
	  var previousValue = createStream(undefined);
	  var isActive = createStream(false);
	  var hasFocus = createStream(false);
	  var isDragging = createStream(false);
	  var fraction = createStream(min);
	  var value = createStream(0);
	  var normalizeFactor = 1 / stepSize;

	  var setValue = function setValue(v) {
	    var shouldNotify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	    if (v < min) v = min;
	    if (v > max) v = max;
	    value(stepSize ? Math.round(v * normalizeFactor) / normalizeFactor : v);
	    fraction((value() - min) / range);

	    if (shouldNotify && attrs.onChange) {
	      attrs.onChange({
	        value: value()
	      });
	    }

	    previousValue(v);
	  };

	  var increment = function increment(state, useLargeStep) {
	    return updateValue(state, value() + (useLargeStep ? 10 : 1) * (stepSize || 1));
	  };

	  var decrement = function decrement(state, useLargeStep) {
	    return updateValue(state, value() - (useLargeStep ? 10 : 1) * (stepSize || 1));
	  };

	  setValue(defaultValue);
	  return {
	    min: min,
	    max: max,
	    stepSize: stepSize,
	    fraction: fraction,
	    // DOM elements
	    trackEl: null,
	    controlEl: null,
	    pinEl: null,
	    // functions
	    setValue: setValue,
	    increment: increment,
	    decrement: decrement,
	    // streams
	    isDragging: isDragging,
	    isActive: isActive,
	    value: value,
	    previousValue: previousValue,
	    hasFocus: hasFocus,
	    // coordinates
	    controlWidth: 0,
	    rangeWidth: 0,
	    rangeOffset: 0,
	    clickOffset: 0,
	    redrawOnUpdate: createStream.merge([isActive, value])
	  };
	};

	var onMount$e = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var dom = vnode.dom;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  state.trackEl = dom.querySelector(".".concat(classes$y.track));
	  state.controlEl = dom.querySelector(".".concat(classes$y.control));
	  state.pinEl = dom.querySelector(".".concat(classes$y.pin));
	  readRangeData(state);

	  if (attrs.pin) {
	    setTimeout(function () {
	      updateValue(state, state.value());
	    }, 0);
	  }
	};

	var createProps$r = function createProps(vnode, _ref3) {
	  var k = _ref3.keys;
	  var state = vnode.state;
	  var attrs = vnode.attrs;

	  if (attrs.value !== undefined) {
	    if (state.previousValue() !== attrs.value) {
	      state.previousValue(attrs.value);
	      setTimeout(function () {
	        return state.setValue(state.previousValue());
	      }, 0); // perform in next tick to play nice with React
	    }
	  }

	  var hasTicks = attrs.ticks !== undefined && attrs.ticks !== false;
	  var interactiveTrack = attrs.interactiveTrack !== undefined ? attrs.interactiveTrack : true;
	  return _extends$v({}, filterSupportedAttributes(attrs), {
	    className: [classes$y.component, attrs.disabled ? classes$y.isDisabled : null, attrs.pin ? classes$y.hasPin : null, interactiveTrack ? classes$y.hasTrack : null, state.isActive() ? classes$y.isActive : null, state.hasFocus() ? classes$y.hasFocus : null, state.fraction() === 0 ? classes$y.isAtMin : null, hasTicks ? classes$y.hasTicks : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$l = function createContent(vnode, _ref4) {
	  var h = _ref4.renderer,
	      k = _ref4.keys;
	  var attrs = vnode.attrs;
	  var hasTicks = attrs.ticks !== undefined && attrs.ticks !== false;
	  var interactiveTrack = attrs.interactiveTrack !== undefined ? attrs.interactiveTrack : true;
	  return createSlider(vnode, {
	    h: h,
	    k: k,
	    hasTicks: hasTicks,
	    interactiveTrack: interactiveTrack
	  });
	};

	var slider =
	/*#__PURE__*/
	Object.freeze({
	  getInitialState: getInitialState$d,
	  onMount: onMount$e,
	  createProps: createProps$r,
	  createContent: createContent$l
	});

	var Slider = ComponentCreator(slider);
	Slider["displayName"] = "Slider";

	var DEFAULT_DURATION$1 = 0.4;

	var show$1 = function show(_ref) {
	  var containerEl = _ref.containerEl,
	      el = _ref.el,
	      duration = _ref.duration,
	      delay = _ref.delay;
	  return {
	    el: containerEl,
	    duration: duration || DEFAULT_DURATION$1,
	    delay: delay || 0,
	    before: function before() {
	      el.style.display = "block";
	      var height = el.getBoundingClientRect().height;
	      containerEl.style.transform = "translate3d(0, ".concat(height, "px, 0)");
	    },
	    transition: function transition() {
	      return containerEl.style.transform = "translate3d(0, 0px, 0)";
	    }
	  };
	};

	var hide$1 = function hide(_ref2) {
	  var containerEl = _ref2.containerEl,
	      el = _ref2.el,
	      duration = _ref2.duration,
	      delay = _ref2.delay;
	  return {
	    el: containerEl,
	    duration: duration || DEFAULT_DURATION$1,
	    delay: delay || 0,
	    transition: function transition() {
	      var height = el.getBoundingClientRect().height;
	      containerEl.style.transform = "translate3d(0, ".concat(height, "px, 0)");
	    },
	    // reset to original position to counter the removal of the snackbar instance
	    after: function after() {
	      // prevent a "bounce back"
	      el.style.display = "none";
	      containerEl.style.transitionDuration = "0ms";
	      containerEl.style.transform = "translate3d(0, 0px, 0)";
	    }
	  };
	};

	var transitions = {
	  show: show$1,
	  hide: hide$1
	};

	function _defineProperty$v(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$p(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$v(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var notificationClasses = {
	  component: "pe-notification",
	  // elements
	  action: "pe-notification__action",
	  content: "pe-notification__content",
	  holder: "pe-notification__holder",
	  placeholder: "pe-notification__placeholder",
	  title: "pe-notification__title",
	  // states
	  hasContainer: "pe-notification--container",
	  horizontal: "pe-notification--horizontal",
	  multilineTitle: "pe-notification__title--multi-line",
	  vertical: "pe-notification--vertical",
	  visible: "pe-notification--visible"
	};

	var classes$z = _objectSpread$p({}, notificationClasses, {
	  component: "pe-notification pe-snackbar",
	  // elements
	  holder: "pe-snackbar__holder",
	  placeholder: "pe-snackbar__placeholder",
	  // states
	  open: "pe-snackbar--open"
	}); // @ts-check


	var SnackbarInstance = ComponentCreator(notification);
	SnackbarInstance["displayName"] = "SnackbarInstance";
	var options$2 = {
	  name: "snackbar",
	  className: classes$z.component,
	  htmlShowClass: classes$z.open,
	  defaultId: "default_snackbar",
	  holderSelector: ".".concat(classes$z.holder),
	  instance: SnackbarInstance,
	  placeholder: "span.".concat(classes$z.placeholder),
	  queue: true,
	  transitions: transitions
	};
	var Multiple$2 = Multi({
	  options: options$2,
	  renderer: renderer
	});
	var Snackbar = ComponentCreator(Multiple$2);
	Object.getOwnPropertyNames(Multiple$2).forEach(function (p) {
	  return Snackbar[p] = Multiple$2[p];
	});
	Snackbar["displayName"] = "Snackbar";

	function _extends$w() {
	  _extends$w = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$w.apply(this, arguments);
	}

	var classes$A = {
	  component: "pe-switch-control",
	  // elements
	  knob: "pe-switch-control__knob",
	  thumb: "pe-switch-control__thumb",
	  track: "pe-switch-control__track"
	}; // Props to be passed to a selection control

	var createProps$s = function createProps(vnode) {
	  var attrs = vnode.attrs;
	  return _extends$w({}, attrs, {
	    selectable: attrs.selectable || function () {
	      return true;
	    },
	    // default: always selectable, regardless of the checked state
	    instanceClass: classes$A.component,
	    type: "checkbox"
	  });
	};

	var _switch =
	/*#__PURE__*/
	Object.freeze({
	  createProps: createProps$s
	});

	var getElement$h = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var onMount$f = function onMount(_ref) {
	  var attrs = _ref.attrs;

	  if (attrs.zOn !== undefined) {
	    deprecation("Switch", {
	      option: "zOn",
	      newOption: "shadowDepthOn"
	    });
	  }

	  if (attrs.zOff !== undefined) {
	    deprecation("Switch", {
	      option: "zOff",
	      newOption: "shadowDepthOff"
	    });
	  }
	};

	var createContent$m = function createContent(vnode, _ref2) {
	  var h = _ref2.renderer,
	      Shadow = _ref2.Shadow,
	      IconButton = _ref2.IconButton;
	  var attrs = vnode.attrs;
	  var shadowDepthOff = attrs.shadowDepthOff !== undefined ? attrs.shadowDepthOff : attrs.zOff !== undefined ? attrs.zOff // deprecated
	  : 1;
	  var shadowDepthOn = attrs.shadowDepthOn !== undefined ? attrs.shadowDepthOn : attrs.zOn !== undefined ? attrs.zOn // deprecated
	  : 2;
	  var shadowDepth = attrs.checked ? shadowDepthOn : shadowDepthOff;
	  var raised = attrs.raised !== undefined ? attrs.raised : true;
	  return [h("div", {
	    className: classes$A.track,
	    key: "track"
	  }), h(IconButton, _extends$w({}, {
	    className: classes$A.thumb,
	    key: "button",
	    content: h("div", {
	      className: classes$A.knob
	    }, [attrs.icon ? attrs.icon : null, raised ? h(Shadow, {
	      shadowDepth: shadowDepth,
	      animated: true
	    }) : null]),
	    style: attrs.style,
	    disabled: attrs.disabled,
	    events: attrs.events,
	    ink: attrs.ink || false,
	    inactive: attrs.inactive
	  }, attrs.iconButton))];
	};

	var viewControl$1 =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$h,
	  onMount: onMount$f,
	  createContent: createContent$m
	});

	function _defineProperty$w(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$x() {
	  _extends$x = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$x.apply(this, arguments);
	}

	function _objectSpread$q(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$w(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var ViewControl$2 = ComponentCreator(_objectSpread$q({}, viewControl$1, {
	  createContent: function createContent(vnode, args) {
	    return viewControl$1.createContent(vnode, _extends$x(args, {
	      Shadow: Shadow,
	      IconButton: IconButton
	    }));
	  }
	}));
	ViewControl$2["displayName"] = "ViewControl";
	var SelectionControl$2 = ComponentCreator(_objectSpread$q({}, selectionControl, {
	  createContent: function createContent(vnode, args) {
	    return selectionControl.createContent(vnode, _objectSpread$q({}, args, {
	      ViewControl: ViewControl$2
	    }));
	  }
	}));
	SelectionControl$2["displayName"] = "SelectionControl";
	var Switch = ComponentCreator(_objectSpread$q({}, _switch, {
	  component: SelectionControl$2
	}));
	Switch["displayName"] = "Switch";

	function _defineProperty$x(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$y() {
	  _extends$y = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$y.apply(this, arguments);
	}

	var buttonClasses$2 = {
	  component: "pe-text-button",
	  super: "pe-button",
	  row: "pe-button-row",
	  // elements      
	  content: "pe-button__content",
	  label: "pe-button__label",
	  textLabel: "pe-button__text-label",
	  wash: "pe-button__wash",
	  dropdown: "pe-button__dropdown",
	  // states      
	  border: "pe-button--border",
	  contained: "pe-button--contained",
	  disabled: "pe-button--disabled",
	  dropdownClosed: "pe-button--dropdown-closed",
	  dropdownOpen: "pe-button--dropdown-open",
	  extraWide: "pe-button--extra-wide",
	  hasDropdown: "pe-button--dropdown",
	  highLabel: "pe-button--high-label",
	  inactive: "pe-button--inactive",
	  raised: "pe-button--raised",
	  selected: "pe-button--selected",
	  separatorAtStart: "pe-button--separator-start"
	};
	var classes$B = {
	  component: "pe-tabs",
	  // elements
	  indicator: "pe-tabs__indicator",
	  scrollButton: "pe-tabs__scroll-button",
	  scrollButtonAtEnd: "pe-tabs__scroll-button-end",
	  scrollButtonAtStart: "pe-tabs__scroll-button-start",
	  tab: "pe-tab",
	  tabContent: "pe-tabs__tab-content",
	  tabRow: "pe-tabs__row",
	  // states
	  activeSelectable: "pe-tabs__active--selectable",
	  isAtEnd: "pe-tabs--end",
	  isAtStart: "pe-tabs--start",
	  isAutofit: "pe-tabs--autofit",
	  isMenu: "pe-tabs--menu",
	  scrollable: "pe-tabs--scrollable",
	  compactTabs: "pe-tabs--compact",
	  tabHasIcon: "pe-tabs__tab--icon",
	  tabRowCentered: "pe-tabs__row--centered",
	  tabRowIndent: "pe-tabs__row--indent",
	  // lookup
	  label: buttonClasses$2.label
	};
	var SCROLL_SPEED = 600; // px per second

	var SCROLL_DELAY = .15; // seconds

	var SCROLL_MIN_DURATION = .5; // seconds

	var INDICATOR_SLIDE_MIN_DURATION = .25; // seconds

	var whenCreateDone = function whenCreateDone() {
	  return Promise.resolve();
	};

	var getButtons$1 = function getButtons(vnode) {
	  var attrs = vnode.attrs;
	  return attrs.content ? attrs.content : attrs.tabs ? attrs.tabs : attrs.children || vnode.children || [];
	};

	var getIndex = function getIndex(vnode) {
	  var buttons = getButtons$1(vnode);
	  var attrs = vnode.attrs;
	  var selectedIndex = Array.isArray(buttons) ? buttons.reduce(function (acc, tab, index) {
	    return acc === undefined && !tab.disabled && tab.selected ? index : acc;
	  }, undefined) : undefined;

	  if (selectedIndex !== undefined) {
	    return selectedIndex;
	  }

	  var attrsSelectedTabIndex = attrs.selectedTabIndex !== undefined ? attrs.selectedTabIndex : attrs.selectedTab !== undefined // deprecated
	  ? attrs.selectedTab : undefined;
	  return attrsSelectedTabIndex !== undefined ? attrsSelectedTabIndex : 0;
	};

	var scrollButtonGetNewIndex = function scrollButtonGetNewIndex(index, tabs) {
	  var minTabIndex = 0;
	  var maxTabIndex = tabs.length - 1;
	  return {
	    backward: Math.max(index - 1, minTabIndex),
	    forward: Math.min(index + 1, maxTabIndex)
	  };
	};

	var handleScrollButtonClick = function handleScrollButtonClick(state, attrs, e, direction) {
	  e.stopPropagation();
	  e.preventDefault();
	  var currentTabIndex = state.selectedTabIndex();
	  var newIndex = scrollButtonGetNewIndex(currentTabIndex, state.tabs)[direction];

	  if (newIndex !== currentTabIndex) {
	    setSelectedTab(state, attrs, newIndex, true);
	  } else {
	    scrollToTab(state, newIndex);
	  }
	};

	var scrollToTab = function scrollToTab(state, tabIndex) {
	  var tabs = state.tabs;
	  var scroller = state.tabRowEl; // Scroll to position of selected tab

	  var tabLeft = tabs.slice(0, tabIndex).reduce(function (totalWidth, tabData) {
	    return totalWidth + tabData.dom.getBoundingClientRect().width;
	  }, 0); // Tabs at the far right will not fully move to the left
	  // because the scrollable row will stick to the right 
	  // to get the max scroll left, we subtract the visible viewport from the scroll width

	  var scrollerWidth = scroller.getBoundingClientRect().width; // frame width

	  var scrollingWidth = scroller.scrollWidth;
	  var maxScroll = scrollingWidth - scrollerWidth;
	  var left = state.isRTL ? -1 * Math.min(tabLeft, maxScroll) : Math.min(tabLeft, maxScroll);
	  var currentLeft = scroller.scrollLeft;

	  if (currentLeft !== left) {
	    var duration = Math.abs(currentLeft - left) / SCROLL_SPEED;
	    var delaySeconds = SCROLL_DELAY;
	    setTimeout(function () {
	      scrollTo({
	        element: scroller,
	        to: left,
	        duration: Math.max(SCROLL_MIN_DURATION, duration),
	        direction: "horizontal"
	      }).then(function () {
	        return updateScrollButtons(state);
	      });
	    }, delaySeconds * 1000);
	  }
	};

	var updateScrollButtons = function updateScrollButtons(state) {
	  var tabRowEl = state.tabRowEl;
	  var scrollLeft = tabRowEl.scrollLeft;
	  var currentTabIndex = state.selectedTabIndex();
	  var tabsEl = state.tabsEl;
	  var minTabIndex = 0;
	  var maxTabIndex = state.tabs.length - 1;
	  var isAtStart = tabRowEl.scrollLeft === 0 && currentTabIndex === minTabIndex;
	  var isAtEnd = scrollLeft >= tabRowEl.scrollWidth - tabsEl.getBoundingClientRect().width - 1 && currentTabIndex === maxTabIndex;
	  state.scrollButtonAtStart(isAtStart);
	  state.scrollButtonAtEnd(isAtEnd);
	};

	var animateIndicator = function animateIndicator(selectedTabEl, animate, state) {
	  var parentRect = state.tabsEl.getBoundingClientRect();
	  var rect = selectedTabEl.getBoundingClientRect();
	  var buttonSize = state.managesScroll ? rect.height : 0;
	  var translateX = state.isRTL ? rect.right - parentRect.right + state.tabRowEl.scrollLeft + buttonSize : rect.left - parentRect.left + state.tabRowEl.scrollLeft - buttonSize;
	  var scaleX = 1 / (parentRect.width - 2 * buttonSize) * rect.width;
	  var transformCmd = "translate(".concat(translateX, "px, 0) scaleX(").concat(scaleX, ")");
	  var duration = animate ? INDICATOR_SLIDE_MIN_DURATION : 0;
	  var style = state.tabIndicatorEl.style;
	  style["transition-duration"] = duration + "s";
	  style.transform = transformCmd;
	};

	var setSelectedTab = function setSelectedTab(state, attrs, index, animate) {
	  state.selectedTabIndex(index);
	  if (!state.tabs.length) return;
	  var selectedTabEl = state.tabs[index].dom;

	  if (selectedTabEl && state.tabIndicatorEl && state.tabsEl) {
	    animateIndicator(selectedTabEl, animate, state);
	  }

	  if (state.managesScroll) {
	    updateScrollButtons(state);
	  }

	  scrollToTab(state, index);

	  if (attrs.onChange) {
	    attrs.onChange({
	      index: index,
	      options: state.tabs[index].attrs,
	      el: selectedTabEl
	    });
	  }
	};

	var sortByLargestWidth = function sortByLargestWidth(a, b) {
	  return a < b ? 1 : a > b ? -1 : 0;
	};

	var getInitialState$e = function getInitialState(vnode, createStream) {
	  var attrs = vnode.attrs;

	  if (attrs.selectedTab !== undefined) {
	    deprecation("Tabs", {
	      option: "selectedTab",
	      newOption: "selectedTabIndex"
	    });
	  }

	  var tabIndex = getIndex(vnode) || 0;
	  var selectedTabIndex = createStream(tabIndex);
	  var scrollButtonAtStart = createStream(true);
	  var scrollButtonAtEnd = createStream(true);

	  var registerTabButton = function registerTabButton(state) {
	    return function (index, data) {
	      return state.tabs[index] = data;
	    };
	  };

	  var registerScrollButton = function registerScrollButton(state) {
	    return function (position, dom) {
	      return state.scrollButtons[position] = dom;
	    };
	  };

	  return {
	    tabsEl: undefined,
	    tabRowEl: undefined,
	    tabs: [],
	    // {data, el}
	    tabRow: undefined,
	    tabIndicatorEl: undefined,
	    selectedTabIndex: selectedTabIndex,
	    previousSelectedTabIndex: undefined,
	    managesScroll: attrs.scrollable && !isTouch,
	    scrollButtonAtStart: scrollButtonAtStart,
	    scrollButtonAtEnd: scrollButtonAtEnd,
	    scrollButtons: {
	      start: undefined,
	      end: undefined
	    },
	    registerTabButton: registerTabButton,
	    registerScrollButton: registerScrollButton,
	    isRTL: false,
	    cleanUp: undefined,
	    // set in onMount
	    redrawOnUpdate: createStream.merge([selectedTabIndex, scrollButtonAtStart, scrollButtonAtEnd])
	  };
	};

	var onMount$g = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var dom = vnode.dom;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  state.tabsEl = dom;
	  state.isRTL = isRTL({
	    element: dom
	  });

	  if (!attrs.hideIndicator) {
	    state.tabIndicatorEl = dom.querySelector(".".concat(classes$B.indicator));
	  }

	  state.tabRowEl = dom.querySelector(".".concat(classes$B.tabRow));

	  var redrawLargestWidth = function redrawLargestWidth() {
	    if (state.tabs && attrs.largestWidth) {
	      var widths = state.tabs.map(function (tabData) {
	        return tabData.dom.getBoundingClientRect().width;
	      });
	      var largest = widths.sort(sortByLargestWidth)[0];
	      state.tabs.forEach(function (tabData) {
	        return tabData.dom.style.width = largest + "px";
	      });
	    }
	  };

	  var redraw = function redraw() {
	    return redrawLargestWidth(), setSelectedTab(state, attrs, state.selectedTabIndex(), false);
	  };

	  var handleFontEvent = function handleFontEvent(_ref) {
	    var name = _ref.name;
	    return name === "active" || name === "inactive" ? redraw() : null;
	  };

	  subscribe("resize", redraw);
	  subscribe("webfontloader", handleFontEvent);

	  state.cleanUp = function () {
	    return unsubscribe("resize", redraw), unsubscribe("webfontloader", handleFontEvent);
	  }; // A promise can't resolve during the oncreate loop
	  // The Mithril draw loop is synchronous - there is no delay between one this oncreate and the tab button's oncreate


	  whenCreateDone().then(redraw);
	};

	var onUnMount$7 = function onUnMount(_ref2) {
	  var state = _ref2.state;
	  return state.cleanUp();
	};

	var createProps$t = function createProps(vnode, _ref3) {
	  var k = _ref3.keys;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var autofit = attrs.scrollable || attrs.centered ? false : attrs.autofit ? true : false; // Keep selected tab up to date

	  var index = getIndex(vnode);

	  if (index !== undefined && state.previousSelectedTabIndex !== index) {
	    setSelectedTab(state, attrs, index, true);
	  }

	  state.previousSelectedTabIndex = index;
	  return _extends$y({}, filterSupportedAttributes(attrs), {
	    className: [classes$B.component, attrs.scrollable ? classes$B.scrollable : null, state.scrollButtonAtStart() ? classes$B.isAtStart : null, state.scrollButtonAtEnd() ? classes$B.isAtEnd : null, attrs.activeSelected ? classes$B.activeSelectable : null, autofit ? classes$B.isAutofit : null, attrs.compact ? classes$B.compactTabs : null, attrs.menu ? classes$B.isMenu : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  });
	};

	var createContent$n = function createContent(vnode, _ref4) {
	  var h = _ref4.renderer,
	      k = _ref4.keys,
	      Tab = _ref4.Tab,
	      ScrollButton = _ref4.ScrollButton;
	  var state = vnode.state;
	  var attrs = vnode.attrs;
	  var buttons = getButtons$1(vnode);

	  if (buttons.length === 0) {
	    console.error("No tabs specified"); // eslint-disable-line no-console
	  }

	  var tabRow = buttons.map(function () {
	    var buttonOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var index = arguments.length > 1 ? arguments[1] : undefined;

	    var buttonOptsCombined = _extends$y({}, buttonOpts, {
	      // These options can be overridden by `all`
	      selected: index === state.selectedTabIndex(),
	      animateOnTap: attrs.animateOnTap !== false ? true : false
	    }, attrs.all, {
	      // Internal options, should not get overridden
	      index: index,
	      key: buttonOpts.key || "tab-".concat(index),
	      register: state.registerTabButton(state),
	      onSelect: function onSelect() {
	        return setSelectedTab(state, attrs, index, attrs.noIndicatorSlide ? false : true);
	      }
	    });

	    return h(Tab, buttonOptsCombined);
	  });
	  var scrollButtonAtStart, scrollButtonAtEnd;

	  if (attrs.scrollable) {
	    scrollButtonAtStart = h(ScrollButton, _extends$y({}, {
	      key: "backward",
	      icon: attrs.scrollIconBackward,
	      className: classes$B.scrollButtonAtStart,
	      position: "start",
	      register: state.registerScrollButton(state),
	      events: _defineProperty$x({}, k.onclick, function (e) {
	        return handleScrollButtonClick(state, attrs, e, "backward");
	      }),
	      isRTL: state.isRTL
	    }));
	    scrollButtonAtEnd = h(ScrollButton, _extends$y({}, {
	      key: "forward",
	      icon: attrs.scrollIconForward,
	      className: classes$B.scrollButtonAtEnd,
	      position: "end",
	      register: state.registerScrollButton(state),
	      events: _defineProperty$x({}, k.onclick, function (e) {
	        return handleScrollButtonClick(state, attrs, e, "forward");
	      }),
	      isRTL: state.isRTL
	    }));
	  }

	  var tabIndicator = attrs.hideIndicator ? null : h("div", {
	    key: "indicator",
	    className: classes$B.indicator
	  });
	  return [attrs.scrollable ? scrollButtonAtStart : null, h("div", {
	    key: "tabrow",
	    className: [classes$B.tabRow, attrs.centered ? classes$B.tabRowCentered : null, attrs.scrollable ? classes$B.tabRowIndent : null].join(" ")
	  }, [tabRow, tabIndicator]), attrs.scrollable ? scrollButtonAtEnd : null];
	};

	var tabs =
	/*#__PURE__*/
	Object.freeze({
	  getInitialState: getInitialState$e,
	  onMount: onMount$g,
	  onUnMount: onUnMount$7,
	  createProps: createProps$t,
	  createContent: createContent$n
	});

	var onMount$1$2 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var dom = vnode.dom;
	  var attrs = vnode.attrs;
	  attrs.register(attrs.index, {
	    attrs: attrs,
	    dom: dom
	  });
	};

	var createProps$1$2 = function createProps(vnode, _ref) {
	  var h = _ref.renderer,
	      k = _ref.keys,
	      Icon = _ref.Icon;
	  var attrs = vnode.attrs; // Let internal onclick function co-exist with passed button option

	  var events = attrs.events || {};

	  events[k.onclick] = events[k.onclick] || function () {};

	  return _extends$y({}, attrs, {
	    content: h("div", {
	      className: classes$B.tabContent
	    }, [attrs.icon ? h(Icon, attrs.icon) : null, attrs.label ? h("div", {
	      className: classes$B.label
	    }, h("span", attrs.label)) : null]),
	    className: [classes$B.tab, attrs.icon && attrs.label ? classes$B.tabHasIcon : null, attrs.className || attrs[k.class]].join(" "),
	    selected: attrs.selected,
	    wash: false,
	    ripple: true,
	    events: _extends$y({}, events, _defineProperty$x({}, k.onclick, function (e) {
	      attrs.onSelect();
	      events[k.onclick](e);
	    }))
	  });
	};

	var createContent$1$3 = function createContent(vnode) {
	  return vnode.children;
	};

	var tab =
	/*#__PURE__*/
	Object.freeze({
	  onMount: onMount$1$2,
	  createProps: createProps$1$2,
	  createContent: createContent$1$3
	});
	var arrowBackward = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/></svg>";
	var arrowForward = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/></svg>";

	var onMount$2$2 = function onMount(vnode) {
	  if (!vnode.dom) {
	    return;
	  }

	  var dom = vnode.dom;
	  var attrs = vnode.attrs;
	  attrs.register(attrs.position, dom);
	};

	var createProps$2$2 = function createProps(vnode, _ref) {
	  var h = _ref.renderer,
	      k = _ref.keys;
	  var attrs = vnode.attrs;
	  var icon = attrs.position === "start" ? attrs.icon || {
	    svg: {
	      content: h.trust(attrs.isRTL ? arrowForward : arrowBackward)
	    }
	  } : attrs.icon || {
	    svg: {
	      content: h.trust(attrs.isRTL ? arrowBackward : arrowForward)
	    }
	  };
	  return {
	    className: [classes$B.scrollButton, attrs.className || attrs[k.class]].join(" "),
	    icon: icon,
	    ripple: {
	      center: true
	    },
	    events: attrs.events
	  };
	};

	var scrollButton =
	/*#__PURE__*/
	Object.freeze({
	  onMount: onMount$2$2,
	  createProps: createProps$2$2
	});

	function _defineProperty$y(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$z() {
	  _extends$z = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$z.apply(this, arguments);
	}

	function _objectSpread$r(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$y(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var Tab = ComponentCreator(_objectSpread$r({}, tab, {
	  createProps: function createProps(vnode, args) {
	    return tab.createProps(vnode, _extends$z(args, {
	      Icon: Icon
	    }));
	  },
	  component: Button
	}));
	Tab["displayName"] = "Tab";
	var ScrollButton = ComponentCreator(_objectSpread$r({}, scrollButton, {
	  component: IconButton
	}));
	ScrollButton["displayName"] = "ScrollButton";
	var Tabs = ComponentCreator(_objectSpread$r({}, tabs, {
	  createContent: function createContent(vnode, args) {
	    return tabs.createContent(vnode, _extends$z(args, {
	      Tab: Tab,
	      ScrollButton: ScrollButton
	    }));
	  }
	}));
	Tabs["displayName"] = "Tabs";

	function _extends$A() {
	  _extends$A = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$A.apply(this, arguments);
	}

	var classes$C = {
	  // Toolbar
	  component: "pe-toolbar",
	  // states
	  compact: "pe-toolbar--compact",
	  appBar: "pe-toolbar--app-bar",
	  // Toolbar title
	  // elements
	  title: "pe-toolbar__title",
	  // states
	  centeredTitle: "pe-toolbar__title--center",
	  indentedTitle: "pe-toolbar__title--indent",
	  fullbleed: "pe-toolbar--fullbleed",
	  border: "pe-toolbar--border"
	};

	var getElement$i = function getElement(vnode) {
	  return vnode.attrs.element || "div";
	};

	var onMount$h = function onMount(_ref) {
	  var attrs = _ref.attrs;

	  if (attrs.z !== undefined) {
	    deprecation("Toolbar", {
	      option: "z",
	      newOption: "shadowDepth"
	    });
	  }
	};

	var createProps$u = function createProps(vnode, _ref2) {
	  var k = _ref2.keys;
	  var attrs = vnode.attrs;
	  return _extends$A({}, filterSupportedAttributes(attrs), {
	    className: [classes$C.component, attrs.compact ? classes$C.compact : null, attrs.fullbleed ? classes$C.fullbleed : null, attrs.border ? classes$C.border : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events);
	};

	var createContent$o = function createContent(vnode, _ref3) {
	  var renderer = _ref3.renderer,
	      Shadow = _ref3.Shadow;
	  var attrs = vnode.attrs;
	  var content = attrs.content ? attrs.content : attrs.children || vnode.children;
	  var shadowDepth = attrs.shadowDepth !== undefined ? attrs.shadowDepth : attrs.z; // deprecated

	  var shadow = shadowDepth !== undefined ? renderer(Shadow, {
	    shadowDepth: shadowDepth,
	    animated: true,
	    key: "shadow"
	  }) : null;
	  return [content, shadow];
	};

	var toolbar =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$i,
	  onMount: onMount$h,
	  createProps: createProps$u,
	  createContent: createContent$o
	});

	var getElement$1$3 = function getElement(_ref) {
	  var attrs = _ref.attrs;
	  return attrs.element ? attrs.element : attrs.url ? "a" : "div";
	};

	var createProps$1$3 = function createProps(vnode, _ref2) {
	  var k = _ref2.keys;
	  var attrs = vnode.attrs;
	  return _extends$A({}, filterSupportedAttributes(attrs), {
	    className: [classes$C.title, attrs.indent ? classes$C.indentedTitle : null, attrs.center ? classes$C.centeredTitle : null, attrs.tone === "dark" ? "pe-dark-tone" : null, attrs.tone === "light" ? "pe-light-tone" : null, attrs.className || attrs[k.class]].join(" ")
	  }, attrs.events, attrs.url);
	};

	var createContent$1$4 = function createContent(vnode) {
	  var attrs = vnode.attrs;
	  return attrs.text ? attrs.text : attrs.content ? attrs.content : attrs.children || vnode.children || attrs;
	};

	var toolbarTitle =
	/*#__PURE__*/
	Object.freeze({
	  getElement: getElement$1$3,
	  createProps: createProps$1$3,
	  createContent: createContent$1$4
	});

	function _defineProperty$z(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$B() {
	  _extends$B = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$B.apply(this, arguments);
	}

	function _objectSpread$s(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$z(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var Toolbar = ComponentCreator(_objectSpread$s({}, toolbar, {
	  createContent: function createContent(vnode, args) {
	    return toolbar.createContent(vnode, _extends$B(args, {
	      Shadow: Shadow
	    }));
	  }
	}));
	Toolbar["displayName"] = "Toolbar"; // @ts-check

	var ToolbarTitle = ComponentCreator(toolbarTitle);
	ToolbarTitle["displayName"] = "ToolbarTitle"; // @ts-check

	var emptyArray = [];
	var emptyObject = {};
	var type = emptyObject.toString;
	var ARRAY = type.call(emptyArray);
	var OBJECT = type.call(emptyObject);
	var STRING = type.call('');
	var FUNCTION = type.call(type);
	var own = emptyObject.hasOwnProperty;

	var freeze = Object.freeze || function (o) {
	  return o;
	};

	function defaults(target, source) {
	  for (var k in source) {
	    if (own.call(source, k)) {
	      if (k.indexOf('$') && !(k in target)) target[k] = source[k];
	    }
	  }

	  return target;
	}

	function cartesian(a, b) {
	  var res = [],
	      i,
	      j;

	  for (j in b) {
	    if (own.call(b, j)) for (i in a) {
	      if (own.call(a, i)) res.push(a[i] + b[j]);
	    }
	  }

	  return res;
	} // "Tokenizes" the selectors into parts relevant for the next function.
	// Strings and comments are matched, but ignored afterwards.
	// This is not a full tokenizers. It only recognizes comas, parentheses,
	// strings and comments.
	// regexp generated by scripts/regexps.js then trimmed by hand


	var selectorTokenizer = /[(),]|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\//g;
	/**
	 * This will split a coma-separated selector list into individual selectors,
	 * ignoring comas in strings, comments and in :pseudo-selectors(parameter, lists).
	 *
	 * @param {string} selector
	 * @return {string[]}
	 */

	function splitSelector(selector) {
	  var indices = [],
	      res = [],
	      inParen = 0,
	      o;
	  /*eslint-disable no-cond-assign*/

	  while (o = selectorTokenizer.exec(selector)) {
	    /*eslint-enable no-cond-assign*/
	    switch (o[0]) {
	      case '(':
	        inParen++;
	        break;

	      case ')':
	        inParen--;
	        break;

	      case ',':
	        if (inParen) break;
	        indices.push(o.index);
	    }
	  }

	  for (o = indices.length; o--;) {
	    res.unshift(selector.slice(indices[o] + 1));
	    selector = selector.slice(0, indices[o]);
	  }

	  res.unshift(selector);
	  return res;
	} // Like the `selectorTokenizer`, but for the `&` operator


	var ampersandTokenizer = /&|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\//g;

	function ampersand(selector, parents) {
	  var indices = [],
	      split = [],
	      res,
	      o;
	  /*eslint-disable no-cond-assign*/

	  while (o = ampersandTokenizer.exec(selector)) {
	    /*eslint-enable no-cond-assign*/
	    if (o[0] == '&') indices.push(o.index);
	  }

	  for (o = indices.length; o--;) {
	    split.unshift(selector.slice(indices[o] + 1));
	    selector = selector.slice(0, indices[o]);
	  }

	  split.unshift(selector);
	  if (split.length === 1) split.unshift('');
	  res = [split[0]];

	  for (o = 1; o < split.length; o++) {
	    res = cartesian(res, cartesian(parents, [split[o]]));
	  }

	  return res.join(',');
	}

	function flatIter(f) {
	  return function iter(arg) {
	    if (type.call(arg) === ARRAY) for (var i = 0; i < arg.length; i++) {
	      iter(arg[i]);
	    } else f(arg);
	  };
	}

	function decamelize(match) {
	  return '-' + match.toLowerCase();
	}
	/**
	 * Handles the property:value; pairs.
	 *
	 * @param {object} state - holds the localizer- and walker-related methods
	 *                         and state
	 * @param {object} emit - the contextual emitters to the final buffer
	 * @param {string} prefix - the current property or a prefix in case of nested
	 *                          sub-properties.
	 * @param {array|object|string} o - the declarations.
	 * @param {boolean} local - are we in @local or in @global scope.
	 */


	function declarations(state, emit, prefix, o, local) {
	  var k, v, kk;
	  if (o == null) return;

	  switch (type.call(o = o.valueOf())) {
	    case ARRAY:
	      for (k = 0; k < o.length; k++) {
	        declarations(state, emit, prefix, o[k], local);
	      }

	      break;

	    case OBJECT:
	      // prefix is falsy iif it is the empty string, which means we're at the root
	      // of the declarations list.
	      prefix = prefix && prefix + '-';

	      for (k in o) {
	        if (own.call(o, k)) {
	          v = o[k];

	          if (/\$/.test(k)) {
	            for (kk in k = k.split('$')) {
	              if (own.call(k, kk)) {
	                declarations(state, emit, prefix + k[kk], v, local);
	              }
	            }
	          } else {
	            declarations(state, emit, prefix + k, v, local);
	          }
	        }
	      }

	      break;

	    default:
	      // prefix is falsy when it is "", which means that we're
	      // at the top level.
	      // `o` is then treated as a `property:value` pair, or a
	      // semi-colon-separated list thereof.
	      // Otherwise, `prefix` is the property name, and
	      // `o` is the value.
	      // restore the dashes
	      k = prefix.replace(/_/g, '-').replace(/[A-Z]/g, decamelize);

	      if (local && (k == 'animation-name' || k == 'animation' || k == 'list-style')) {
	        // no need to tokenize here a plain `.split(',')` has all bases covered.
	        // We may 'localize' a comment, but it's not a big deal.
	        o = o.split(',').map(function (o) {
	          return o.replace(/^\s*(?:(var\([^)]+\))|:?global\(\s*([_A-Za-z][-\w]*)\s*\)|()(-?[_A-Za-z][-\w]*))/, state.localizeReplacer);
	        }).join(',');
	      }

	      emit.decl(k, o);
	  }
	}
	/**
	 * Handles a single at-rules
	 *
	 * @param {object} state - holds the localizer- and walker-related methods
	 *                         and state
	 * @param {object} emit - the contextual emitters to the final buffer
	 * @param {array} k - The parsed at-rule, including the parameters,
	 *                    if takes both parameters and a block.
	 *                    k == [match, fullAtRule, atRuleType, params?]
	 *                    So in `@-webkit-keyframes foo`, we have
	 *                     - match = "@-webkit-keyframes foo"
	 *                     - fullAtRule = "@-webkit-keyframes"
	 *                     - atRuleType = "keyframes"
	 *                     - params = "foo"
	 * @param {string|string[]|object|object[]} v - Either parameters for
	 *                                              block-less rules or
	 *                                              their block
	 *                                              for the others.
	 * @param {string} prefix - the current selector or the selector prefix
	 *                          in case of nested rules
	 * @param {boolean} local - are we in @local or in @global scope?
	 * @param {string} nestingDepth - are we nested in an at-rule or a selector?
	 */


	function atRules(state, emit, k, v, prefix, local, nestingDepth) {
	  // First iterate over user-provided at-rules and return if one of them corresponds to the current one
	  for (var i = 0; i < state.$atHandlers.length; i++) {
	    if (state.$atHandlers[i](state, emit, k, v, prefix, local, nestingDepth)) return;
	  } // using `/^global$/.test(k[2])` rather that 'global' == k[2] gzips
	  // slightly better thanks to the regexps tests further down.
	  // It is slightly less efficient but this isn't a critical path.


	  if (!k[3] && /^global$/.test(k[2])) {
	    rules(state, emit, prefix, v, 0, nestingDepth);
	  } else if (!k[3] && /^local$/.test(k[2])) {
	    rules(state, emit, prefix, v, 1, nestingDepth);
	  } else if (k[3] && /^adopt$/.test(k[2])) {
	    if (!local || nestingDepth) return emit.err('@adopt global or nested: ' + k[0]);
	    if (!/^\.?[_A-Za-z][-\w]*$/.test(k[3])) return emit.err('bad adopter ' + JSON.stringify(k[3]) + ' in ' + k[0]);
	    i = [];
	    flatIter(function (adoptee, asString) {
	      if (adoptee == null || !/^\.?[_A-Za-z][-\w]*(?:\s+\.?[_A-Za-z][-\w]*)*$/.test(asString = adoptee + '')) emit.err('bad adoptee ' + JSON.stringify(adoptee) + ' in ' + k[0]);else i.push(asString.replace(/\./g, ''));
	    })(v); // we may end up with duplicate classes but AFAIK it has no consequences on specificity.

	    if (i.length) {
	      state.localize(k[3] = k[3].replace(/\./g, ''));
	      state.names[k[3]] += ' ' + i.join(' ');
	    }
	  } else if (!k[3] && /^(?:namespace|import|charset)$/.test(k[2])) {
	    flatIter(function (v) {
	      emit.atrule(k[1], k[2], v);
	    })(v);
	  } else if (!k[3] && /^(?:font-face|viewport)$/.test(k[2])) {
	    flatIter(function (v) {
	      emit.atrule(k[1], k[2], k[3], 1);
	      declarations(state, emit, '', v, local);

	      emit._atrule();
	    })(v);
	  } else if (k[3] && /^(?:media|supports|page|keyframes)$/.test(k[2])) {
	    if (local && 'keyframes' == k[2]) {
	      k[3] = k[3].replace( // generated by script/regexps.js
	      /(var\([^)]+\))|:?global\(\s*([_A-Za-z][-\w]*)\s*\)|()(-?[_A-Za-z][-\w]*)/, state.localizeReplacer);
	    }

	    emit.atrule(k[1], k[2], k[3], 1);

	    if ('page' == k[2]) {
	      declarations(state, emit, '', v, local);
	    } else {
	      rules(state, emit, 'keyframes' == k[2] ? '' : prefix, v, local, nestingDepth + 1);
	    }

	    emit._atrule();
	  } else {
	    emit.err('Unsupported at-rule: ' + k[0]);
	  }
	}
	/**
	 * Add rulesets and other CSS tree to the sheet.
	 *
	 * @param {object} state - holds the localizer- and walker-related methods
	 *                         and state
	 * @param {object} emit - the contextual emitters to the final buffer
	 * @param {string} prefix - the current selector or a prefix in case of nested rules
	 * @param {array|string|object} tree - a source object or sub-object.
	 * @param {string} nestingDepth - are we nested in an at-rule?
	 * @param {boolean} local - are we in @local or in @global scope?
	 */


	function rules(state, emit, prefix, tree, local, nestingDepth) {
	  var k, v, inDeclaration, kk;

	  switch (type.call(tree)) {
	    case OBJECT:
	      for (k in tree) {
	        if (own.call(tree, k)) {
	          v = tree[k];

	          if (prefix.length > 0 && /^[-\w$]+$/.test(k)) {
	            if (!inDeclaration) {
	              inDeclaration = 1;
	              emit.rule(prefix);
	            }

	            if (/\$/.test(k)) {
	              for (kk in k = k.split('$')) {
	                if (own.call(k, kk)) {
	                  declarations(state, emit, k[kk], v, local);
	                }
	              }
	            } else {
	              declarations(state, emit, k, v, local);
	            }
	          } else if (/^@/.test(k)) {
	            // Handle At-rules
	            inDeclaration = 0;
	            atRules(state, emit, /^(.(?:-[\w]+-)?([_A-Za-z][-\w]*))\b\s*(.*?)\s*$/.exec(k) || [k, '@', '', ''], v, prefix, local, nestingDepth);
	          } else {
	            // selector or nested sub-selectors
	            inDeclaration = 0;
	            rules(state, emit, // build the selector `prefix` for the next iteration.
	            // ugly and full of redundant bits but so far the fastest/shortest.gz

	            /*0 if*/
	            prefix.length > 0 && (/,/.test(prefix) || /,/.test(k)) ? (
	            /*0 then*/
	            kk = splitSelector(prefix), splitSelector(local ? k.replace(/("(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\/)|:global\(\s*(\.-?[_A-Za-z][-\w]*)\s*\)|(\.)(-?[_A-Za-z][-\w]*)/g, state.localizeReplacer) : k).map(function (k) {
	              return /&/.test(k) ? ampersand(k, kk) : kk.map(function (kk) {
	                return kk + k;
	              }).join(',');
	            }).join(',')) :
	            /*0 else*/

	            /*1 if*/
	            /&/.test(k) ?
	            /*1 then*/
	            ampersand(local ? k.replace(/("(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\/)|:global\(\s*(\.-?[_A-Za-z][-\w]*)\s*\)|(\.)(-?[_A-Za-z][-\w]*)/g, state.localizeReplacer) : k, [prefix]) :
	            /*1 else*/
	            prefix + (local ? k.replace(/("(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\/)|:global\(\s*(\.-?[_A-Za-z][-\w]*)\s*\)|(\.)(-?[_A-Za-z][-\w]*)/g, state.localizeReplacer) : k), v, local, nestingDepth + 1);
	          }
	        }
	      }

	      break;

	    case ARRAY:
	      for (k = 0; k < tree.length; k++) {
	        rules(state, emit, prefix, tree[k], local, nestingDepth);
	      }

	      break;

	    case STRING:
	      // CSS hacks or ouptut of `j2c.inline`.
	      if (!prefix.length) emit.err('No selector');
	      emit.rule(prefix || ' ');
	      declarations(state, emit, '', tree, local);
	  }
	} // This is the first entry in the filters array, which is
	// actually the last step of the compiler. It inserts
	// closing braces to close normal (non at-) rules (those
	// that start with a selector). Doing it earlier is
	// impossible without passing state around in unrelated code
	// or ending up with duplicated selectors when the source tree
	// contains arrays.
	// There's no `_rule` handler, because the core compiler never
	// calls it.


	function closeSelectors(next, inline) {
	  var lastSelector;
	  return inline ? next : {
	    init: function init() {
	      lastSelector = 0;
	      next.init();
	    },
	    done: function done(raw) {
	      if (lastSelector) {
	        next._rule();

	        lastSelector = 0;
	      }

	      return next.done(raw);
	    },
	    atrule: function atrule(rule, kind, param, takesBlock) {
	      if (lastSelector) {
	        next._rule();

	        lastSelector = 0;
	      }

	      next.atrule(rule, kind, param, takesBlock);
	    },
	    _atrule: function _atrule(rule) {
	      if (lastSelector) {
	        next._rule();

	        lastSelector = 0;
	      }

	      next._atrule(rule);
	    },
	    rule: function rule(selector) {
	      if (selector !== lastSelector) {
	        if (lastSelector) next._rule();
	        next.rule(selector);
	        lastSelector = selector;
	      }
	    }
	  };
	}

	function global$1(x) {
	  return ':global(' + x + ')';
	}

	function kv(k, v, o) {
	  o = {};
	  o[k] = v;
	  return o;
	}

	function at(rule, params, block) {
	  if (arguments.length < 3) {
	    // inner curry!
	    var _at = at.bind.apply(at, [null].concat([].slice.call(arguments, 0))); // So that it can be used as a key in an ES6 object literal.


	    _at.toString = function () {
	      return '@' + rule + ' ' + params;
	    };

	    return _at;
	  } else return kv('@' + rule + ' ' + params, block);
	}

	function j2c() {
	  // the buffer that accumulates the output. Initialized in `$sink.i()`
	  var buf, _err; // the bottom of the 'codegen' stream. Mirrors the `$filter` plugin API.


	  var $sink = {
	    init: function init() {
	      buf = [], _err = [];
	    },
	    done: function done(raw) {
	      if (_err.length != 0) throw new Error('j2c error(s): ' + JSON.stringify(_err, null, 2) + 'in context:\n' + buf.join(''));
	      return raw ? buf : buf.join('');
	    },
	    err: function err(msg) {
	      _err.push(msg);

	      buf.push('/* +++ ERROR +++ ' + msg + ' */\n');
	    },
	    atrule: function atrule(rule, kind, param, takesBlock) {
	      buf.push(rule, param && ' ', param, takesBlock ? ' {' : ';', _instance.endline);
	    },
	    // close atrule
	    _atrule: function _atrule() {
	      buf.push('}', _instance.endline);
	    },
	    rule: function rule(selector) {
	      buf.push(selector, ' {', _instance.endline);
	    },
	    // close rule
	    _rule: function _rule() {
	      buf.push('}', _instance.endline);
	    },
	    decl: function decl(prop, value) {
	      buf.push(prop, prop && ':', value, ';', _instance.endline);
	    }
	  }; // holds the `$filter` and `$at` handlers

	  var $filters = [closeSelectors];
	  var $atHandlers = []; // the public API (see the main docs)

	  var _instance = {
	    at: at,
	    global: global$1,
	    kv: kv,
	    names: {},
	    endline: '\n',
	    suffix: '__j2c-' + // 128 bits of randomness
	    Math.floor(Math.random() * 0x100000000).toString(36) + '-' + Math.floor(Math.random() * 0x100000000).toString(36) + '-' + Math.floor(Math.random() * 0x100000000).toString(36) + '-' + Math.floor(Math.random() * 0x100000000).toString(36),
	    $plugins: [],
	    sheet: function sheet(tree) {
	      var emit = _createOrRetrieveStream(0);

	      emit.init();
	      rules(_walkers[0], emit, '', // prefix
	      tree, 1, // local, by default
	      0 // nesting depth
	      );
	      return emit.done();
	    },
	    inline: function inline(tree, options) {
	      var emit = _createOrRetrieveStream(1);

	      emit.init();
	      declarations(_walkers[1], emit, '', // prefix
	      tree, !(options && options.global) // local, by default
	      );
	      return emit.done();
	    }
	  }; // The `state` (for the core functions) / `walker` (for the plugins) tables.

	  var _walkers = [// for j2c.sheet
	  {
	    // helpers for locaizing class and animation names
	    localizeReplacer: _localizeReplacer,
	    // second argument to String.prototype.replace
	    localize: _localize,
	    // mangles local names
	    names: _instance.names,
	    // local => mangled mapping
	    $atHandlers: $atHandlers,
	    // extra at-rules
	    // The core walker methods, to be provided to plugins
	    atrule: atRules,
	    decl: declarations,
	    rule: rules
	  }, // likewise, for j2c.inline (idem with `$a`, `a` and `s` removed)
	  {
	    localizeReplacer: _localizeReplacer,
	    localize: _localize,
	    names: _instance.names,
	    decl: declarations
	  }]; // inner helpers

	  var _use = flatIter(function (plugin) {
	    // `~n` is falsy for `n === -1` and truthy otherwise.
	    // Works well to turn the  result of `a.indexOf(x)`
	    // into a value that reflects the presence of `x` in
	    // `a`.
	    if (~_instance.$plugins.indexOf(plugin)) return;

	    _instance.$plugins.push(plugin);

	    if (type.call(plugin) === FUNCTION) plugin = plugin(_instance);
	    if (!plugin) return;
	    flatIter(function (filter) {
	      $filters.push(filter);
	    })(plugin.$filter || emptyArray);
	    flatIter(function (handler) {
	      $atHandlers.push(handler);
	    })(plugin.$at || emptyArray);
	    defaults(_instance.names, plugin.$names || emptyObject);

	    _use(plugin.$plugins || emptyArray);

	    $sink = plugin.$sink || $sink;
	    defaults(_instance, plugin);
	  });

	  var _streams = [];
	  /**
	   * returns the codegen streams, creating them if necessary
	   * @param
	   */

	  function _createOrRetrieveStream(inline) {
	    // build the stream processors if needed
	    if (!_streams.length) {
	      // append the $sink as the ultimate filter
	      $filters.push(function (_, inline) {
	        return inline ? {
	          init: $sink.init,
	          decl: $sink.decl,
	          done: $sink.done,
	          err: $sink.err
	        } : $sink;
	      });

	      for (var i = 0; i < 2; i++) {
	        // 0 for j2c.sheet, 1 for j2c.inline
	        for (var j = $filters.length; j--;) {
	          _streams[i] = freeze(defaults($filters[j](_streams[i], !!i), _streams[i]));
	        }
	      }
	    }

	    return _streams[inline];
	  }
	  /**
	   * Returns a localized version of a given name.
	   * Registers the pair in `instnace.name` if needed.
	   *
	   * @param {string} name - the name to localize
	   * @return {string} - the localized version
	   */


	  function _localize(name) {
	    if (!_instance.names[name]) _instance.names[name] = name + _instance.suffix;
	    return _instance.names[name].match(/^\S+/);
	  }
	  /**
	   * Used as second argument for str.replace(localizeRegex, replacer)
	   * `ignore`, `global` and `(dot, name)` are mutually exclusive
	   *
	   * @param {string} match - the whole match (ignored)
	   * @param {string|null} ignore - a comment or a string literal
	   * @param {string|null} global - a global name
	   * @param {string|null} dot - either '.' for a local class name or the empty string otherwise
	   * @param {string|null} name - the name to localize
	   * @return {string}
	   */


	  function _localizeReplacer(match, ignore, global$$1, dot, name) {
	    return ignore || global$$1 || dot + _localize(name);
	  }

	  _use(emptyArray.slice.call(arguments));

	  return _instance;
	}

	var j2c_commonjs = j2c;

	/**
	 * @typedef {{[selector:string] : object}} Style
	 * @typedef {Array<Style> | Style} Styles
	 */

	/**
	 * @type {Styles} layout
	 */

	var layout = [{
	  "display": "-webkit-box"
	}, {
	  "display": "-moz-box"
	}, {
	  "display": "-ms-flexbox"
	}, {
	  "display": "-webkit-flex"
	}, {
	  "display": "flex"
	}];
	/**
	 * @type {Styles} layoutInline
	 */

	var layoutInline = [layout, {
	  "display": "-ms-inline-flexbox"
	}, {
	  "display": "-webkit-inline-flex"
	}, {
	  "display": "inline-flex"
	}];
	/**
	 * @type {Styles} layoutHorizontal
	 */

	var layoutHorizontal = [layout, {
	  "-ms-flex-direction": "row",
	  "-webkit-flex-direction": "row",
	  "flex-direction": "row"
	}];
	/**
	 * @type {Styles} layoutHorizontalReverse
	 */

	var layoutHorizontalReverse = [layout, {
	  "-ms-flex-direction": "row-reverse",
	  "-webkit-flex-direction": "row-reverse",
	  "flex-direction": "row-reverse"
	}];
	/**
	 * @type {Styles} layoutVertical
	 */

	var layoutVertical = [layout, {
	  "-ms-flex-direction": "column",
	  "-webkit-flex-direction": "column",
	  "flex-direction": "column"
	}];
	/**
	 * @type {Styles} layoutVerticalReverse
	 */

	var layoutVerticalReverse = [layout, {
	  "-ms-flex-direction": "column-reverse",
	  "-webkit-flex-direction": "column-reverse",
	  "flex-direction": "column-reverse"
	}];
	/**
	 * @type {Styles} layoutWrap
	 */

	var layoutWrap = [layout, {
	  "-ms-flex-wrap": "wrap",
	  "-webkit-flex-wrap": "wrap",
	  "flex-wrap": "wrap"
	}];
	/**
	 * @type {Styles} layoutWrapReverse
	 */

	var layoutWrapReverse = [layout, {
	  "-ms-flex-wrap": "wrap-reverse",
	  "-webkit-flex-wrap": "wrap-reverse",
	  "flex-wrap": "wrap-reverse"
	}];
	/**
	 * @type {Styles} layoutStart
	 */

	var layoutStart = [layout, {
	  "-ms-flex-align": "start",
	  "-webkit-align-items": "flex-start",
	  "align-items": "flex-start"
	}];
	/**
	 * @type {Styles} layoutCenter
	 */

	var layoutCenter = [layout, {
	  "-ms-flex-align": "center",
	  "-webkit-align-items": "center",
	  "align-items": "center"
	}];
	/**
	 * @type {Styles} layoutEnd
	 */

	var layoutEnd = [layout, {
	  "-ms-flex-align": "end",
	  "-webkit-align-items": "flex-end",
	  "align-items": "flex-end"
	}];
	/**
	 * @type {Styles} layoutJustified
	 */

	var layoutJustified = [layout, {
	  "-ms-flex-pack": "justify",
	  "-webkit-justify-content": "space-between",
	  "justify-content": "space-between"
	}];
	/**
	 * @type {Styles} layoutStartJustified
	 */

	var layoutStartJustified = [layout, {
	  "-ms-flex-pack": "start",
	  "-webkit-justify-content": "flex-start",
	  "justify-content": "flex-start"
	}];
	/**
	 * @type {Styles} layoutCenterJustified
	 */

	var layoutCenterJustified = [layout, {
	  "-ms-flex-pack": "center",
	  "-webkit-justify-content": "center",
	  "justify-content": "center"
	}];
	/**
	 * @type {Styles} layoutEndJustified
	 */

	var layoutEndJustified = [layout, {
	  "-ms-flex-pack": "end",
	  "-webkit-justify-content": "flex-end",
	  "justify-content": "flex-end"
	}];
	/**
	 * @type {Styles} layoutCenterCenter
	 */

	var layoutCenterCenter = [layoutCenterJustified, layoutCenter];
	/**
	 * @type {Styles} layoutAroundJustified
	 */

	var layoutAroundJustified = [layout, {
	  "-ms-flex-pack": "distribute",
	  "-webkit-justify-content": "space-around",
	  "justify-content": "space-around"
	}];
	/**
	 * @param {number} [num=1] 
	 * @returns {Styles}
	 */

	var flex = function flex() {
	  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	  return [{
	    "-webkit-box-flex": num
	  }, {
	    "-moz-box-flex": num
	  }, {
	    "-webkit-flex": num
	  }, {
	    "-ms-flex": num
	  }, {
	    "flex": num
	  }, num === 1 ? {
	    "-webkit-flex-basis": "0.000000001px"
	  } : {}, num === 1 ? {
	    "flex-basis": "0.000000001px"
	  } : {}];
	};
	/**
	 * @type {Styles} flexAuto
	 */


	var flexAuto = {
	  "-ms-flex": "1 1 auto",
	  "-webkit-flex-basis": "auto",
	  "flex-basis": "auto"
	};
	/**
	 * @type {Styles} flexAutoVertical
	 */

	var flexAutoVertical = {
	  "-ms-flex": "1 1 auto",
	  "-webkit-flex-basis": "auto",
	  "flex-basis": "auto"
	};
	/**
	 * 
	 * @param {number|"none"} index 
	 * @returns {Styles}
	 */

	var flexIndex = function flexIndex(index) {
	  return {
	    "-ms-flex": index,
	    "-webkit-flex": index,
	    "flex": index
	  };
	};
	/**
	 * 
	 * @param {number} value 
	 * @returns {Styles}
	 */


	var flexGrow = function flexGrow(value) {
	  return {
	    "-webkit-flex-grow": value,
	    "flex-grow": value
	  };
	};
	/**
	 * 
	 * @param {number} value 
	 * @returns {Styles}
	 */


	var flexShrink = function flexShrink(value) {
	  return {
	    "-webkit-flex-shrink": value,
	    "flex-shrink": value
	  };
	};
	/**
	 * @type {Styles} selfStart
	 */


	var selfStart = {
	  "-ms-align-self": "flex-start",
	  "-webkit-align-self": "flex-start",
	  "align-self": "flex-start"
	};
	/**
	 * @type {Styles} selfCenter
	 */

	var selfCenter = {
	  "-ms-align-self": "center",
	  "-webkit-align-self": "center",
	  "align-self": "center"
	};
	/**
	 * @type {Styles} selfEnd
	 */

	var selfEnd = {
	  "-ms-align-self": "flex-end",
	  "-webkit-align-self": "flex-end",
	  "align-self": "flex-end"
	};
	/**
	 * @type {Styles} selfStretch
	 */

	var selfStretch = {
	  "-ms-align-self": "stretch",
	  "-webkit-align-self": "stretch",
	  "align-self": "stretch"
	};
	var flex$1 = {
	  flex: flex,
	  flexAuto: flexAuto,
	  flexAutoVertical: flexAutoVertical,
	  flexIndex: flexIndex,
	  flexGrow: flexGrow,
	  flexShrink: flexShrink,
	  layout: layout,
	  layoutAroundJustified: layoutAroundJustified,
	  layoutCenter: layoutCenter,
	  layoutCenterCenter: layoutCenterCenter,
	  layoutCenterJustified: layoutCenterJustified,
	  layoutEnd: layoutEnd,
	  layoutEndJustified: layoutEndJustified,
	  layoutHorizontal: layoutHorizontal,
	  layoutHorizontalReverse: layoutHorizontalReverse,
	  layoutInline: layoutInline,
	  layoutJustified: layoutJustified,
	  layoutStart: layoutStart,
	  layoutStartJustified: layoutStartJustified,
	  layoutVertical: layoutVertical,
	  layoutVerticalReverse: layoutVerticalReverse,
	  layoutWrap: layoutWrap,
	  layoutWrapReverse: layoutWrapReverse,
	  selfCenter: selfCenter,
	  selfEnd: selfEnd,
	  selfStart: selfStart,
	  selfStretch: selfStretch
	};

	function _defineProperty$A(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$t(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$A(target, key, source[key]);
	    });
	  }

	  return target;
	}

	function _objectWithoutPropertiesLoose$1(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	function _objectWithoutProperties$1(source, excluded) {
	  if (source == null) return {};

	  var target = _objectWithoutPropertiesLoose$1(source, excluded);

	  var key, i;

	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }

	  return target;
	} // @ts-check

	/**
	 * @typedef {object} StyleObject 
	 */

	/**
	 * Centers an item absolutely within relative parent.
	 * @param {number} [offset=0] 
	 * @returns {StyleObject}
	 */


	var fit = function fit() {
	  var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	  var offsetPx = offset + "px";
	  return {
	    position: "absolute",
	    top: offsetPx,
	    right: offsetPx,
	    bottom: offsetPx,
	    left: offsetPx
	  };
	};
	/**
	 * Breaks off a line with ... unless lines is "none"
	 * @param {number|"none"} lines 
	 * @param {number} lineHeight 
	 * @param {string} [unit=px]
	 * @example
	 * // max 1 line, 16px high
	 * mixin.ellipsis(1, 16)
	 * @example 
	 * // max 2 lines, 2.6em high
	 * mixin.ellipsis(2, 1.3, "em")
	 * @returns {StyleObject} 
	 */


	var ellipsis = function ellipsis(lines, lineHeight) {
	  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "px";

	  if (lines === "none") {
	    return {
	      textOverflow: "initial",
	      overflow: "initial",
	      display: "block",
	      height: "auto",
	      maxHeight: "none",
	      whiteSpace: "normal"
	    };
	  }

	  return [{
	    "@supports (-webkit-line-clamp: 2)": lines !== undefined ? {
	      "-webkit-line-clamp": lines,
	      "-webkit-box-orient": "vertical",
	      display: "-webkit-box",
	      wordBreak: "break-word"
	    } : undefined
	  }, _objectSpread$t({
	    overflow: "hidden",
	    textOverflow: "ellipsis",
	    textRendering: "auto"
	  }, lineHeight !== undefined ? {
	    maxHeight: lines * lineHeight + unit
	  } : undefined, lineHeight === 1 ? {
	    wordWrap: "nowrap"
	  } : undefined)];
	};
	/**
	 * Clears float.
	 * @returns {StyleObject} 
	 */


	var clearfix = function clearfix() {
	  return {
	    "&:after": {
	      content: "\"\"",
	      display: "table",
	      clear: "both"
	    }
	  };
	};
	/**
	 * Creates sticky headers in a scrollable list.
	 * Does not work in IE 11, Edge < 16.
	 * @param {number} [zIndex=1] 
	 * @returns {StyleObject} 
	 */


	var sticky = function sticky() {
	  var zIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	  return {
	    position: "sticky",
	    top: 0,
	    zIndex: zIndex
	  };
	};
	/**
	 * Creates a transition with presets
	 * @param {string} [properties=all]
	 * @param {string} [duration=".18s"] 
	 * @param {string} [curve=ease-out] 
	 * @example
	 * mixin.defaultTransition("opacity", vars.animation_duration)
	 * @returns {StyleObject} 
	 */


	var defaultTransition = function defaultTransition() {
	  var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "all";
	  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".18s";
	  var curve = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "ease-out";
	  return {
	    transitionDelay: "0ms",
	    transitionDuration: duration,
	    transitionTimingFunction: curve,
	    transitionProperty: properties
	  };
	};

	var mixin = {
	  clearfix: clearfix,
	  defaultTransition: defaultTransition,
	  ellipsis: ellipsis,
	  fit: fit,
	  sticky: sticky
	};

	function unwrapExports$1(x) {
	  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule$2(fn, module) {
	  return module = {
	    exports: {}
	  }, fn(module, module.exports), module.exports;
	}

	var j2cPluginPrefixBrowser_commonjs = createCommonjsModule$2(function (module, exports) {
	  Object.defineProperty(exports, '__esModule', {
	    value: true
	  }); // Derived from Lea Verou's PrefixFree

	  var allStyles;
	  var styleAttr;
	  var styleElement;
	  var supportedProperty;
	  var supportedDecl;

	  function init() {
	    allStyles = getComputedStyle(document.documentElement, null);
	    styleAttr = document.createElement('div').style;
	    styleElement = document.documentElement.appendChild(document.createElement('style'));
	    supportedDecl = _supportedDecl;
	    supportedProperty = _supportedProperty;

	    if ('zIndex' in styleAttr && !('z-index' in styleAttr)) {
	      // Some browsers like it dash-cased, some camelCased, most like both.
	      supportedDecl = function supportedDecl(property, value) {
	        return _supportedDecl(camelCase(property), value);
	      };

	      supportedProperty = function supportedProperty(property) {
	        return _supportedProperty(camelCase(property));
	      };
	    }
	  }

	  function finalize() {
	    if (typeof document !== 'undefined') document.documentElement.removeChild(styleElement); // `styleAttr` is used at run time via `supportedProperty()`
	    // `allStyles` and `styleElement` can be displosed of after initialization.

	    allStyles = styleElement = null;
	  } // Helpers, in alphabetic order


	  function camelCase(str) {
	    return str.replace(/-([a-z])/g, function ($0, $1) {
	      return $1.toUpperCase();
	    }).replace('-', '');
	  }

	  function deCamelCase(str) {
	    return str.replace(/[A-Z]/g, function ($0) {
	      return '-' + $0.toLowerCase();
	    });
	  }

	  function _supportedDecl(property, value) {
	    styleAttr[property] = '';
	    styleAttr[property] = value;
	    return !!styleAttr[property];
	  }

	  function supportedMedia(property, value) {
	    styleElement.textContent = '@media (' + property + ':' + value + '){}'; // The !!~indexOf trick. False for -1, true otherwise.

	    return !!~styleElement.sheet.cssRules[0].cssText.indexOf(value);
	  }

	  function _supportedProperty(property) {
	    return property in styleAttr;
	  }

	  function supportedRule(selector) {
	    styleElement.textContent = selector + '{}';
	    return !!styleElement.sheet.cssRules.length;
	  } // Derived from Lea Verou's PrefixFree
	  // TODO: http://caniuse.com/#feat=css-media-resolution


	  function detectAtrules(fixers) {
	    if (fixers.prefix === '') return;
	    var atrules = {
	      'keyframes': 'name',
	      'viewport': null,
	      'document': 'regexp(".")'
	    }; // build a map of {'@ruleX': '@-prefix-ruleX'}

	    for (var atrule in atrules) {
	      var test = atrule + ' ' + (atrules[atrule] || '');

	      for (var i = fixers.prefixes.length; i--;) {
	        if (!supportedRule('@' + test) && supportedRule('@' + fixers.prefixes[i] + test)) {
	          fixers.hasAtrules = true;
	          fixers.atrules['@' + atrule] = '@' + fixers.prefixes[i] + atrule;
	        }
	      }
	    } // Standard


	    fixers.hasDppx = supportedMedia('resolution', '1dppx'); // Webkit

	    fixers.hasPixelRatio = supportedMedia(fixers.prefix + 'device-pixel-ratio', '1'); // Opera

	    fixers.hasPixelRatioFraction = supportedMedia(fixers.prefix + 'device-pixel-ratio', '1/1');

	    if (fixers.hasPixelRatio || fixers.hasPixelRatioFraction) {
	      fixers.properties['resolution'] = fixers.prefix + 'device-pixel-ratio';
	      fixers.properties['min-resolution'] = fixers.prefix + 'min-device-pixel-ratio';
	      fixers.properties['max-resolution'] = fixers.prefix + 'max-device-pixel-ratio';

	      if (supportedMedia('min-' + fixers.prefix + 'device-pixel-ratio', '1')) {
	        // Mozilla/Firefox tunred a vendor prefix into a vendor infix
	        fixers.properties['min-resolution'] = 'min-' + fixers.prefix + 'device-pixel-ratio';
	        fixers.properties['max-resolution'] = 'max-' + fixers.prefix + 'device-pixel-ratio';
	      }
	    }
	  } // Derived from Lea Verou's PrefixFree


	  function detectFunctions(fixers) {
	    // Values that might need prefixing
	    if (fixers.prefix === '') return;
	    var functions = {
	      'linear-gradient': {
	        property: 'background-image',
	        params: 'red, teal'
	      },
	      'calc': {
	        property: 'width',
	        params: '1px + 5%'
	      },
	      'element': {
	        property: 'background-image',
	        params: '#foo'
	      },
	      'cross-fade': {
	        property: 'backgroundImage',
	        params: 'url(a.png), url(b.png), 50%'
	      }
	    };
	    functions['repeating-linear-gradient'] = functions['repeating-radial-gradient'] = functions['radial-gradient'] = functions['linear-gradient']; // build an array of prefixable functions

	    for (var func in functions) {
	      var test = functions[func],
	          property = test.property,
	          value = func + '(' + test.params + ')';

	      if (!supportedDecl(property, value) && supportedDecl(property, fixers.prefix + value)) {
	        // It's only supported with a prefix
	        fixers.functions.push(func);
	      }
	    }
	  } // Derived from Lea Verou's PrefixFree and Robin Frischmann's Inline Style Prefixer
	  // TODO: http://caniuse.com/#feat=css-writing-mode
	  // db of prop/value pairs whose values may need treatment.


	  var keywords = [// `initial` applies to all properties and is thus handled separately.
	  {
	    props: ['cursor'],
	    values: ['grab', 'grabbing', 'zoom-in', 'zoom-out']
	  }, {
	    props: ['display'],
	    values: ['box', 'inline-box', 'flexbox', 'inline-flexbox', 'flex', 'inline-flex', 'grid', 'inline-grid']
	  }, {
	    props: ['position'],
	    values: ['sticky']
	  }, {
	    props: ['width', 'column-width', 'height', 'max-height', 'max-width', 'min-height', 'min-width'],
	    values: ['contain-floats', 'fill-available', 'fit-content', 'max-content', 'min-content']
	  }]; // The flexbox zoo
	  //
	  // ## Specs:
	  // - box     (2009/old):  https://www.w3.org/TR/2009/WD-css3-flexbox-20090723/
	  // - flexbox (2012/ie10): https://www.w3.org/TR/2012/WD-css3-flexbox-20120322/
	  // - flex    (final):     https://www.w3.org/TR/css-flexbox-1/

	  var flex2009Props = {
	    // ?align-content =>
	    // ?align-self =>
	    'align-items': 'box-align',
	    'flex': 'box-flex',
	    // https://css-tricks.com/snippets/css/a-guide-to-flexbox/#comment-371025,
	    // ?flex-basis =>
	    // !!flex-direction => box-direction + box-orient, covered in `plugin.js`
	    'box-direction': 'box-direction',
	    // we prepopulate the cache for the above case.
	    'box-orient': 'box-orient',
	    // !!flex-flow => flex-direction and/or flex-wrap, covered in `plugin.js`
	    'flex-grow': 'box-flex',
	    // https://compat.spec.whatwg.org/#propdef--webkit-box-flex
	    // ?flex-shrink =>
	    'flex-wrap': 'box-lines',
	    'justify-content': 'box-pack',
	    'order': 'box-ordinal-group' // https://css-tricks.com/snippets/css/a-guide-to-flexbox/#comment-371025

	  };
	  var flex2009Values = {
	    // flex => box || only for display? handled in the code
	    'flex-end': 'end',
	    'flex-start': 'start',
	    // inline-flex => inline-box || see flex
	    'nowrap': 'single',
	    'space-around': 'justify',
	    'space-between': 'justify',
	    'wrap': 'multiple',
	    'wrap-reverse': 'multiple'
	  };
	  var flex2012Props = {
	    'align-content': '-ms-flex-line-pack',
	    'align-items': '-ms-flex-align',
	    'align-self': '-ms-flex-item-align',
	    // flex => -ms-flex
	    'flex-basis': '-ms-preferred-size',
	    // flex-direction => -ms-flex-direction
	    // flex-flow => -ms-flex-flow
	    'flex-grow': '-ms-flex-positive',
	    'flex-shrink': '-ms-flex-negative',
	    // flex-wrap => -ms-flex-wrap
	    'justify-content': '-ms-flex-pack',
	    'order': '-ms-flex-order'
	  };
	  var flex2012Values = {
	    // flex => flexbox || only for display? handled in the code
	    'flex-end': 'end',
	    'flex-start': 'start',
	    // inline-flex => inline-flexbox || see 'flex'
	    // nowrap => nowrap
	    'space-around': 'distribute',
	    'space-between': 'justify' // wrap => wrap
	    // wrap-reverse => wrap-reverse

	  };

	  function detectKeywords(fixers) {
	    if (fixers.prefixes.length === 0) return; // build a map of {propertyI: {keywordJ: previxedKeywordJ, ...}, ...}

	    for (var i = 0; i < keywords.length; i++) {
	      var map = {},
	          property = keywords[i].props[0]; // eslint-disable-next-line

	      for (var j = 0, keyword; keyword = keywords[i].values[j]; j++) {
	        for (var k = fixers.prefixes.length; k--;) {
	          if (!supportedDecl(property, keyword) && supportedDecl(property, fixers.prefixes[k] + keyword)) {
	            fixers.hasKeywords = true;
	            map[keyword] = fixers.prefixes[k] + keyword;
	          }
	        }
	      } // eslint-disable-next-line


	      for (j = 0; property = keywords[i].props[j]; j++) {
	        fixers.keywords[property] = map;
	      }
	    }

	    if (fixers.keywords.display && fixers.keywords.display.flexbox && !supportedDecl('display', 'flex')) {
	      // IE 10, Flexbox 2012
	      fixers.keywords.display.flex = fixers.keywords.display.flexbox;
	      fixers.keywords.display['inline-flex'] = fixers.keywords.display['inline-flexbox'];
	      fixers.flexbox2012 = true;

	      for (k in flex2012Props) {
	        fixers.properties[k] = flex2012Props[k];
	        fixers.keywords[k] = flex2012Values;
	      }
	    } else if (fixers.keywords.display && fixers.keywords.display.box && !supportedDecl('display', 'flex') && !supportedDecl('display', fixers.prefix + 'flex')) {
	      // old flexbox spec
	      fixers.keywords.display.flex = fixers.keywords.display.box;
	      fixers.keywords.display['inline-flex'] = fixers.keywords.display['inline-box'];
	      fixers.flexbox2009 = true;

	      for (k in flex2009Props) {
	        fixers.properties[k] = fixers.prefix + flex2009Props[k];
	        fixers.keywords[k] = flex2009Values;
	      }
	    } else if (fixers.keywords.display && !fixers.keywords.display.box && !fixers.keywords.display.flex && !fixers.keywords.display.flexbox && !supportedDecl('display', 'flex')) {
	      fixers.jsFlex = true;
	    }

	    if (!supportedDecl('color', 'initial') && supportedDecl('color', fixers.prefix + 'initial')) {
	      // `initial` does not use the `hasKeywords` branch, no need to set it to true.
	      fixers.initial = fixers.prefix + 'initial';
	    }
	  } // Derived from Lea Verou's PrefixFree


	  function detectPrefix(fixers) {
	    var prefixCounters = {}; // Why are we doing this instead of iterating over properties in a .style object? Because Webkit.
	    // 1. Older Webkit won't iterate over those.
	    // 2. Recent Webkit will, but the 'Webkit'-prefixed properties are not enumerable. The 'webkit'
	    //    (lower case 'w') ones are, but they don't `deCamelCase()` into a prefix that we can detect.

	    function iteration(property) {
	      if (property.charAt(0) === '-') {
	        var prefix = property.split('-')[1]; // Count prefix uses

	        prefixCounters[prefix] = ++prefixCounters[prefix] || 1;
	      }
	    } // Some browsers have numerical indices for the properties, some don't


	    if (allStyles && allStyles.length > 0) {
	      for (var i = 0; i < allStyles.length; i++) {
	        iteration(allStyles[i]);
	      }
	    } else {
	      for (var property in allStyles) {
	        iteration(deCamelCase(property));
	      }
	    }

	    var prefixes = [];

	    for (var p in prefixCounters) {
	      prefixes.push(p);
	    }

	    prefixes.sort(function (a, b) {
	      return prefixCounters[b] - prefixCounters[a];
	    });
	    fixers.prefixes = prefixes.map(function (p) {
	      return '-' + p + '-';
	    });
	    fixers.prefix = fixers.prefixes[0] || ''; // Edge supports both `webkit` and `ms` prefixes, but `ms` isn't detected with the method above.
	    // the selector comes from http://browserstrangeness.com/css_hacks.html

	    if (supportedRule('_:-ms-lang(x), _:-webkit-full-screen')) fixers.prefixes.push('-ms-');
	    fixers.Prefix = camelCase(fixers.prefix);
	  } // Derived from Lea Verou's PrefixFree


	  function detectSelectors(fixers) {
	    var selector, prefixed;

	    function prefixSelector(selector) {
	      return selector.replace(/^::?/, function ($0) {
	        return $0 + fixers.prefix;
	      });
	    }

	    if (fixers.prefix === '') return;
	    var selectors = {
	      ':any-link': null,
	      '::backdrop': null,
	      ':fullscreen': null,
	      //TODO sort out what changed between specs
	      ':full-screen': ':fullscreen',
	      //sigh
	      '::placeholder': null,
	      ':placeholder': '::placeholder',
	      '::input-placeholder': '::placeholder',
	      ':input-placeholder': '::placeholder',
	      ':read-only': null,
	      ':read-write': null,
	      '::selection': null
	    }; // builds an array of selectors that need a prefix.

	    for (selector in selectors) {
	      prefixed = prefixSelector(selector);

	      if (!supportedRule(selectors[selector] || selector) && supportedRule(prefixed)) {
	        fixers.hasSelectors = true;
	        fixers.selectorList.push(selectors[selector] || selector);
	        fixers.selectorMap[selectors[selector] || selector] = prefixed;
	      }
	    }
	  }

	  function detectWebkitCompat(fixers) {
	    if (!supportedDecl('background-clip', 'text') && supportedDecl('-webkit-background-clip', 'text')) fixers.WkBCTxt = true;
	    ['background-clip', 'text-fill-color', 'text-stroke-color', 'text-stroke-width', 'text-stroke'].forEach(function (prop) {
	      if (!supportedProperty(prop) && supportedProperty('-webkit-' + prop)) fixers.properties[prop] = '-webkit-' + prop;
	    });
	  }

	  function blankFixers() {
	    return {
	      atrules: {},
	      hasAtrules: false,
	      hasDppx: null,
	      hasKeywords: false,
	      hasPixelRatio: false,
	      hasPixelRatioFraction: false,
	      hasSelectors: false,
	      hasValues: false,
	      fixAtMediaParams: null,
	      fixAtSupportsParams: null,
	      fixProperty: null,
	      fixSelector: null,
	      fixValue: null,
	      flexbox2009: false,
	      flexbox2012: false,
	      functions: [],
	      initial: null,
	      jsFlex: false,
	      keywords: {},
	      placeholder: null,
	      prefix: '',
	      prefixes: [],
	      Prefix: '',
	      properties: {},
	      selectorList: [],
	      selectorMap: {},
	      valueProperties: {
	        'transition': 1,
	        'transition-property': 1,
	        'will-change': 1
	      },
	      WkBCTxt: false // -webkit-background-clip: text

	    };
	  }

	  function browserDetector(fixers) {
	    // add the required data to the fixers object.
	    init();
	    detectPrefix(fixers);
	    detectSelectors(fixers);
	    detectAtrules(fixers);
	    detectKeywords(fixers);
	    detectFunctions(fixers);
	    detectWebkitCompat(fixers);
	    finalize();
	  }

	  var emptySet = {};
	  var valueTokenizer = /[(),]|\/\*[\s\S]*?\*\//g;
	  /**
	   * For properties whose values are also properties, this will split a coma-separated
	   * value list into individual values, ignoring comas in comments and in
	   * functions(parameter, lists).
	   *
	   * @param {string} selector
	   * @return {string[]}
	   */

	  function splitValue(value) {
	    var indices = [],
	        res = [],
	        inParen = 0,
	        o;
	    /*eslint-disable no-cond-assign*/

	    while (o = valueTokenizer.exec(value)) {
	      /*eslint-enable no-cond-assign*/
	      switch (o[0]) {
	        case '(':
	          inParen++;
	          break;

	        case ')':
	          inParen--;
	          break;

	        case ',':
	          if (inParen) break;
	          indices.push(o.index);
	      }
	    }

	    for (o = indices.length; o--;) {
	      res.unshift(value.slice(indices[o] + 1));
	      value = value.slice(0, indices[o]);
	    }

	    res.unshift(value);
	    return res;
	  }

	  function makeDetector(before, targets, after) {
	    return new RegExp(before + '(?:' + targets.join('|') + ')' + after);
	  }

	  function makeLexer(before, targets, after) {
	    return new RegExp("\"(?:\\\\[\\S\\s]|[^\"])*\"|'(?:\\\\[\\S\\s]|[^'])*'|\\/\\*[\\S\\s]*?\\*\\/|" + before + '((?:' + targets.join('|') + '))' + after, 'gi');
	  } // declarations
	  // ------------
	  // function trim(s) {
	  //   return s.replace(/^\s*(.*?)\s*$/, '$1')
	  // }


	  function fixDecl(fixers, emit$$1, property, value) {
	    if (typeof property !== 'string' || property.charAt(0) === '-') return emit$$1(property, value);

	    if (!(typeof value === 'string' || typeof value === 'number')) {
	      return emit$$1(fixers.properties[property] || fixers.fixProperty(property), value);
	    }

	    value = value + '';

	    if (fixers.jsFlex) {
	      if (property === 'display' && (value === 'flex' || value === 'inline-flex')) {
	        emit$$1('-js-display', value);
	        return;
	      }
	    } else if (fixers.flexbox2009) {
	      // TODO: flex only takes one value in the 2009 spec
	      // if (property === 'flex') {
	      //   value = trim(value)
	      //   if (value === 'none' || value === 'initial') emit(property, '0')
	      //   else if (value === 'auto') emit(property, '1')
	      //   else emit(property, value.replace(/^(\d+)(?=\W|$).*/, '$1'))
	      //   return
	      // } else
	      if (property === 'flex-flow') {
	        value.split(/\s+/).forEach(function (v) {
	          // recurse! The lack of `next.` is intentional.
	          if (v.indexOf('wrap') > -1) fixDecl(fixers, emit$$1, 'flex-wrap', v);else if (v !== '') fixDecl(fixers, emit$$1, 'flex-direction', v);
	        });
	        return;
	      } else if (property === 'flex-direction') {
	        emit$$1(fixers.properties['box-orient'], value.indexOf('column') > -1 ? 'block-axis' : 'inline-axis');
	        emit$$1(fixers.properties['box-direction'], value.indexOf('-reverse') > -1 ? 'reverse' : 'normal');
	        return;
	      }
	    } // else if (fixers.flexbox2012) {
	    //   // if (property === 'flex' && value.indexOf('calc(') !== -1) {
	    //   //   var parsed =
	    //   // }
	    // }


	    if (fixers.WkBCTxt && property === 'background-clip' && value === 'text') {
	      emit$$1('-webkit-background-clip', value);
	    } else {
	      emit$$1(fixers.properties[property] || fixers.fixProperty(property), fixers.fixValue(value, property));
	    }
	  }

	  function finalizeFixers(fixers) {
	    var prefix = fixers.prefix; // properties
	    // ----------

	    fixers.fixProperty = fixers.fixProperty || function (prop) {
	      var prefixed;
	      return fixers.properties[prop] = supportedProperty(prop) || !supportedProperty(prefixed = prefix + prop) ? prop : prefixed;
	    }; // selectors
	    // ----------


	    var selectorDetector = makeDetector('', fixers.selectorList, '(?:\\b|$|[^-])');
	    var selectorMatcher = makeLexer('', fixers.selectorList, '(?:\\b|$|[^-])');

	    var selectorReplacer = function selectorReplacer(match, selector) {
	      return selector != null ? fixers.selectorMap[selector] : match;
	    };

	    fixers.fixSelector = function (selector) {
	      return selectorDetector.test(selector) ? selector.replace(selectorMatcher, selectorReplacer) : selector;
	    }; // values
	    // ------
	    // When gradients are supported with a prefix, convert angles to legacy
	    // (from clockwise to trigonometric)


	    var hasGradients = fixers.functions.indexOf('linear-gradient') > -1;
	    var gradientDetector = /\blinear-gradient\(/;
	    var gradientMatcher = /(^|\s|,|\()((?:repeating-)?linear-gradient\()\s*(-?\d*\.?\d*)deg/ig;

	    var gradientReplacer = function gradientReplacer(match, delim, gradient, deg) {
	      return delim + gradient + (90 - deg) + 'deg';
	    }; // functions


	    var hasFunctions = !!fixers.functions.length;
	    var functionsDetector = makeDetector('(?:^|\\s|,|\\()', fixers.functions, '\\s*\\(');
	    var functionsMatcher = makeLexer('(^|\\s|,|\\()', fixers.functions, '(?=\\s*\\()');

	    function functionReplacer(match, $1, $2) {
	      return $1 + prefix + $2;
	    } // properties as values (for transition, ...)
	    // No need to look for strings in these properties. We may insert prefixes in comments. Oh the humanity.


	    var valuePropertiesMatcher = /^\s*([-\w]+)/gi;

	    var valuePropertiesReplacer = function valuePropertiesReplacer(match, prop) {
	      return fixers.properties[prop] || fixers.fixProperty(prop);
	    };

	    fixers.fixValue = function (value, property) {
	      var res;
	      if (fixers.initial != null && value === 'initial') return fixers.initial;
	      if (fixers.hasKeywords && (res = (fixers.keywords[property] || emptySet)[value])) return res;
	      res = value;

	      if (fixers.valueProperties.hasOwnProperty(property)) {
	        res = value.indexOf(',') === -1 ? value.replace(valuePropertiesMatcher, valuePropertiesReplacer) : splitValue(value).map(function (v) {
	          return v.replace(valuePropertiesMatcher, valuePropertiesReplacer);
	        }).join(',');
	      }

	      if (hasFunctions && functionsDetector.test(value)) {
	        if (hasGradients && gradientDetector.test(value)) {
	          res = res.replace(gradientMatcher, gradientReplacer);
	        }

	        res = res.replace(functionsMatcher, functionReplacer);
	      }

	      return res;
	    }; // @media (resolution:...) {
	    // -------------------------


	    var resolutionMatcher = /((?:min-|max-)?resolution)\s*:\s*((?:\d*\.)?\d+)dppx/g;
	    var resolutionReplacer = fixers.hasPixelRatio ? function (_, prop, param) {
	      return fixers.properties[prop] + ':' + param;
	    } : fixers.hasPixelRatioFraction ? function (_, prop, param) {
	      return fixers.properties[prop] + ':' + Math.round(param * 10) + '/10';
	    } : function (_, prop, param) {
	      return prop + ':' + Math.round(param * 96) + 'dpi';
	    };
	    fixers.fixAtMediaParams = fixers.hasDppx !== false
	    /*it may be null*/
	    ? function (p) {
	      return p;
	    } : function (params) {
	      return params.indexOf('reso') !== -1 ? params.replace(resolutionMatcher, resolutionReplacer) : params;
	    }; // @supports ... {
	    // ---------------

	    var supportsProp, supportsValue;

	    var atSupportsParamsFixer = function atSupportsParamsFixer(property, value) {
	      supportsProp = property;
	      supportsValue = value;
	    }; // regexp built by scripts/regexps.js


	    var atSupportsParamsMatcher = /\(\s*([-\w]+)\s*:\s*((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|\((?:'(?:\\[\S\s]|[^'])*'|"(?:\\[\S\s]|[^"])*"|\/\*[\S\s]*?\*\/|[^\)])*\)|[^\)])*\)|[^\)])*\)|[^\)])*\)|[^\)])*\)|[^\)])*\)|[^\)])*)/g;

	    function atSupportsParamsReplacer(match, prop, value) {
	      fixDecl(fixers, atSupportsParamsFixer, prop, value);
	      return '(' + supportsProp + ':' + supportsValue;
	    }

	    fixers.fixAtSupportsParams = function (params) {
	      return params.replace(atSupportsParamsMatcher, atSupportsParamsReplacer);
	    };
	  }

	  var commonFixers;

	  function initBrowser() {
	    // exported for the test suite
	    commonFixers = blankFixers();
	    if (typeof getComputedStyle === 'function') browserDetector(commonFixers);
	    finalizeFixers(commonFixers);
	  }

	  initBrowser();

	  function prefixPlugin() {
	    var fixers = commonFixers;
	    var cache = [];
	    return {
	      set: {
	        setPrefixDb: function setPrefixDb(f) {
	          if (cache.indexOf(f) === -1) {
	            finalizeFixers(f);
	            cache.push(f);
	          }

	          fixers = f;
	          return prefixPlugin;
	        }
	      },
	      filter: function filter(next) {
	        return {
	          atrule: function atrule(rule, kind, params, hasBlock) {
	            next.atrule(fixers.hasAtrules && fixers.atrules[rule] || rule, kind, rule === '@media' ? fixers.fixAtMediaParams(params) : rule === '@supports' ? fixers.fixAtSupportsParams(params) : params, hasBlock);
	          },
	          decl: function decl(property, value) {
	            fixDecl(fixers, next.decl, property, value);
	          },
	          rule: function rule(selector) {
	            next.rule(fixers.hasSelectors ? fixers.fixSelector(selector) : selector);
	          }
	        };
	      }
	    };
	  }

	  exports.prefixPlugin = prefixPlugin;
	});
	unwrapExports$1(j2cPluginPrefixBrowser_commonjs);
	var j2cPluginPrefixBrowser_commonjs_1 = j2cPluginPrefixBrowser_commonjs.prefixPlugin; // @ts-ignore

	var j2c$1 = new j2c_commonjs(j2cPluginPrefixBrowser_commonjs_1);
	var ID_REGEX = /[^a-z0-9\\-]/g;
	/**
	 * @typedef {object} StyleObject 
	 * @typedef {(selector: string|Array<string>, vars: object, customVars?: object) => Array<object>} StyleFn
	 */

	/**
	 * Adds styles to head.
	 * @param {string} id - Identifier, used as HTMLElement id for the attached <style></style> element.
	 * @param {...Array<StyleObject>} styles - List of style Objects
	 * @returns {void}
	 */

	var add = function add(id) {
	  for (var _len = arguments.length, styles = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    styles[_key - 1] = arguments[_key];
	  }

	  return addToDocument.apply(void 0, [{
	    id: id
	  }].concat(styles));
	};
	/**
	 * Removes a style from head.
	 * @param {string} id - Identifier, used as HTMLElement id for the attached <style></style> element.
	 * @returns {void}
	 */


	var remove = function remove(id) {
	  if (isServer) return;

	  if (id) {
	    var old = document.getElementById(id);

	    if (old && old.parentNode) {
	      old.parentNode.removeChild(old);
	    }
	  }
	};
	/**
	 * Adds styles to the head.
	 * @param {object} params
	 * @param {string} params.id - Identifier, used as HTMLElement id for the attached <style></style> element.
	 * @param {object} [params.document] - Document reference.
	 * @param {...Array<StyleObject>} styles - List of style Objects.
	 * @returns {void}
	 */


	var addToDocument = function addToDocument(_ref) {
	  var id = _ref.id,
	      document = _ref.document;
	  if (isServer) return;
	  var safeId = id.replace(ID_REGEX, "_");
	  remove(safeId);
	  var documentRef = document || window.document;
	  var styleEl = documentRef.createElement("style");

	  if (safeId) {
	    styleEl.setAttribute("id", safeId);
	  }

	  for (var _len2 = arguments.length, styles = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    styles[_key2 - 1] = arguments[_key2];
	  }

	  styles.forEach(function (styles) {
	    // each style returns a list
	    if (Object.keys(styles).length) {
	      styles.forEach(function (style) {
	        var scoped = {
	          "@global": style
	        };
	        var sheet = j2c$1.sheet(scoped);
	        styleEl.appendChild(documentRef.createTextNode(sheet));
	      });
	    }
	  });
	  documentRef.head.appendChild(styleEl);
	};
	/**
	 * 
	 * @param {object} params
	 * @param {StyleObject|Array<StyleObject>} params.styles
	 * @param {string} [params.scope]
	 * @returns {Array<StyleObject>}
	 */


	var wrapInScope = function wrapInScope(_ref2) {
	  var styles = _ref2.styles,
	      scope = _ref2.scope;
	  return scope ? [_defineProperty$A({}, scope, styles)] : styles;
	};
	/**
	 * Adds component styles to head.
	 * @param {object} params
	 * @param {Array<string>} params.selectors
	 * @param {Array<StyleFn>} params.fns
	 * @param {object} params.vars
	 * @param {object} [params.customVars]
	 * @param {string} [params.mediaQuery]
	 * @param {string} [params.scope]
	 * @returns {void}
	 */


	var addStyle = function addStyle(_ref4) {
	  var selectors = _ref4.selectors,
	      styleFns = _ref4.fns,
	      vars = _ref4.vars,
	      customVars = _ref4.customVars,
	      mediaQuery = _ref4.mediaQuery,
	      scope = _ref4.scope;
	  var prefix = scope ? " " : "";
	  var selector = prefix + selectors.join("");
	  var styles = styleFns.map(function (fn) {
	    return fn(selector, vars, customVars);
	  }).filter(function (list) {
	    return list.length > 0;
	  });

	  if (styles.length === 0) {
	    return;
	  }

	  var id = selector.trim().replace(/^[^a-z]?(.*)/, "$1");
	  add(id, wrapInScope({
	    styles: wrapInScope({
	      styles: styles,
	      scope: scope
	    }),
	    scope: mediaQuery
	  }));
	};
	/**
	 * Returns a list of style objects for a component.
	 * @param {object} params
	 * @param {Array<string>} params.selectors
	 * @param {Array<StyleFn>} params.fns
	 * @param {object} params.vars - Style configuration variables
	 * @param {object} [params.customVars] - Style configuration variables
	 * @param {string} [params.mediaQuery] - Mediaquery string
	 * @param {string} [params.scope] - Scope selector
	 * @returns {Array<StyleObject>}
	 */


	var getStyle$1 = function getStyle$$1(_ref5) {
	  var selectors = _ref5.selectors,
	      styleFns = _ref5.fns,
	      vars = _ref5.vars,
	      customVars = _ref5.customVars,
	      mediaQuery = _ref5.mediaQuery,
	      scope = _ref5.scope;
	  var prefix = scope ? " " : "";
	  var selector = prefix + selectors.join("");
	  var styles = styleFns.map(function (fn) {
	    return fn(selector, vars, customVars);
	  });
	  return wrapInScope({
	    styles: wrapInScope({
	      styles: styles,
	      scope: scope
	    }),
	    scope: mediaQuery
	  });
	};
	/**
	 * Adds component styles to head.
	 * @param {string} selector 
	 * @param {Array<StyleFn>} fns 
	 * @param {object} vars - Style configuration variables
	 */


	var createAddStyle = function createAddStyle(selector, fns, vars) {
	  return (
	    /**
	     * @param {string} [customSelector=""]
	     * @param {object} customVars
	     * @param {object} [scoping={}]
	     * @param {string} [scoping.mediaQuery]
	     * @param {string} [scoping.scope]
	     * @returns {void}
	     */
	    function () {
	      var customSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	      var customVars = arguments.length > 1 ? arguments[1] : undefined;

	      var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	          mediaQuery = _ref6.mediaQuery,
	          scope = _ref6.scope;

	      return addStyle({
	        selectors: [selector, customSelector],
	        fns: fns,
	        vars: vars,
	        customVars: customVars,
	        mediaQuery: mediaQuery,
	        scope: scope
	      });
	    }
	  );
	};
	/**
	 * Returns styles for a component.
	 * @param {string} selector 
	 * @param {Array<StyleFn>} fns 
	 * @param {object} vars - Style configuration variables
	 */


	var createGetStyle = function createGetStyle(selector, fns, vars) {
	  return (
	    /**
	     * @param {string} [customSelector=""]
	     * @param {object} customVars
	     * @param {object} [scoping={}]
	     * @param {string} [scoping.mediaQuery]
	     * @param {string} [scoping.scope]
	     * @returns {Array<StyleObject>}
	     */
	    function () {
	      var customSelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	      var customVars = arguments.length > 1 ? arguments[1] : undefined;

	      var _ref7 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	          mediaQuery = _ref7.mediaQuery,
	          scope = _ref7.scope;

	      return [getStyle$1({
	        selectors: [selector, customSelector],
	        fns: fns,
	        vars: vars,
	        customVars: customVars,
	        mediaQuery: mediaQuery,
	        scope: scope
	      })];
	    }
	  );
	};

	var styler = {
	  add: add,
	  addStyle: addStyle,
	  addToDocument: addToDocument,
	  createAddStyle: createAddStyle,
	  createGetStyle: createGetStyle,
	  getStyle: getStyle$1,
	  remove: remove
	}; // @ts-check

	/**
	 * @typedef {(selector: string, vars: object, customVars?: object) => Array<object>} StyleFn
	 * @typedef {{[s: string]: StyleFn}} StyleCollection
	 */

	/**
	 * Wraps an object with a selector.
	 * @param {string} selector 
	 * @param {object} o 
	 * @returns {object}
	 */

	var sel = function sel(selector, o) {
	  return _defineProperty$A({}, selector, o);
	};
	/**
	 * Creates a right-to-left selector.
	 * @param {string} selector
	 * @returns {string}
	 */


	var selectorRTL = function selectorRTL(selector) {
	  return "*[dir=rtl] ".concat(selector, ", .pe-rtl ").concat(selector);
	};
	/**
	 * Creates a rgba CSS color string.
	 * @param {string} colorStr 
	 * @param {number} opacity 
	 * @returns {string}
	 */


	var rgba = function rgba(colorStr) {
	  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	  return "rgba(".concat(colorStr, ", ").concat(opacity, ")");
	};
	/**
	 * @param {object} params
	 * @param {string} [params.selector]
	 * @param {string} [params.scopedSelector]
	 * @param {StyleCollection} [params.varFns]
	 * @param {StyleCollection} [params.customVarFns]
	 * @param {StyleFn} [params.superStyle]
	 * @param {(_:any) => StyleCollection} [params.varMixin]
	 * @param {StyleCollection} [params.componentVars]
	 * @param {StyleCollection} [params.customVars]
	 * @returns {Array<object>}
	 */


	var createStyle = function createStyle(_ref2) {
	  var varFns = _ref2.varFns,
	      customVarFns = _ref2.customVarFns,
	      superStyle = _ref2.superStyle,
	      varMixin = _ref2.varMixin,
	      selector = _ref2.selector,
	      scopedSelector = _ref2.scopedSelector,
	      _ref2$componentVars = _ref2.componentVars,
	      componentVars = _ref2$componentVars === void 0 ? {} : _ref2$componentVars,
	      customVars = _ref2.customVars;

	  var allVars = _objectSpread$t({}, componentVars, customVars);

	  var currentVars = customVars ? customVars : allVars;

	  var general_styles = componentVars.general_styles,
	      otherVars = _objectWithoutProperties$1(componentVars, ["general_styles"]);

	  var baseLayout = superStyle !== undefined ? customVars !== undefined ? superStyle(selector, componentVars, customVars) : superStyle(selector, otherVars) : [];

	  var fns = _objectSpread$t({}, customVars ? customVarFns : {}, varFns);

	  return baseLayout.concat(Object.keys(varMixin(currentVars)).map(function (v) {
	    return fns && fns[v] !== undefined ? fns[v](scopedSelector, allVars) : null;
	  }).filter(function (s) {
	    return s;
	  }));
	};
	/**
	 * 
	 * @param {object} params
	 * @param {StyleCollection} [params.varFns]
	 * @param {StyleCollection} [params.customVarFns]
	 * @param {StyleFn} [params.superLayout]
	 * @param {(_:any) => StyleCollection} [params.varMixin]
	 * @returns {StyleFn}
	 */


	var createLayout = function createLayout(_ref3) {
	  var varFns = _ref3.varFns,
	      customVarFns = _ref3.customVarFns,
	      superLayout = _ref3.superLayout,
	      _ref3$varMixin = _ref3.varMixin,
	      varMixin = _ref3$varMixin === void 0 ? function (o) {
	    return o;
	  } : _ref3$varMixin;
	  return (
	    /**
	     * @param {string} selector
	     * @param {object} componentVars
	     * @param {object} [customVars]
	     * @returns {Array<object>}
	     */
	    function (selector, componentVars, customVars) {
	      return createStyle({
	        varFns: varFns,
	        customVarFns: customVarFns,
	        superStyle: superLayout,
	        varMixin: varMixin,
	        selector: selector,
	        scopedSelector: selector,
	        componentVars: componentVars,
	        customVars: customVars
	      });
	    }
	  );
	};
	/**
	 * 
	 * @param {object} params
	 * @param {string} [params.selector]
	 * @param {string} [params.scopedSelector]
	 * @param {object} [params.componentVars]
	 * @param {object} [params.customVars]  
	 * @param {StyleFn} [params.superColor]
	 * @param {StyleCollection} [params.varFns]
	 * @param {(_:any) => StyleCollection} [params.varMixin]
	 * @returns {Array<object>}
	 */


	var createColorStyle = function createColorStyle(_ref4) {
	  var selector = _ref4.selector,
	      scopedSelector = _ref4.scopedSelector,
	      componentVars = _ref4.componentVars,
	      customVars = _ref4.customVars,
	      varFns = _ref4.varFns,
	      superColor = _ref4.superColor,
	      varMixin = _ref4.varMixin;
	  return createStyle({
	    varFns: varFns,
	    superStyle: superColor,
	    varMixin: varMixin,
	    selector: selector,
	    scopedSelector: scopedSelector,
	    componentVars: componentVars,
	    customVars: customVars
	  });
	};
	/**
	 * 
	 * @param {object} params 
	 * @param {Array<string>} params.scopes
	 * @param {string} params.selector
	 * @param {boolean} params.isNoTouch
	* @returns {string}
	 */


	var appendPseudoClass = function appendPseudoClass(_ref5) {
	  var scopes = _ref5.scopes,
	      selector = _ref5.selector,
	      isNoTouch = _ref5.isNoTouch;
	  return isNoTouch ? scopes.map(function (s) {
	    return s + selector + ":hover";
	  }).join(",") : scopes.map(function (s) {
	    return s + selector;
	  }).join(",");
	};
	/**
	 * 
	 * @param {object} params 
	 * @param {Array<string>} params.scopes
	 * @param {string} params.selector
	 * @param {boolean} [params.isNoTouch]
	 * @returns {string}
	 */


	var createScopedSelector = function createScopedSelector(_ref6) {
	  var scopes = _ref6.scopes,
	      selector = _ref6.selector,
	      _ref6$isNoTouch = _ref6.isNoTouch,
	      isNoTouch = _ref6$isNoTouch === void 0 ? false : _ref6$isNoTouch;
	  return selector.split(/\s*,\s*/).map(function (s) {
	    return appendPseudoClass({
	      scopes: scopes,
	      selector: s,
	      isNoTouch: isNoTouch
	    });
	  }).join("");
	};
	/**
	 * @typedef {object} ColorScopeObject
	 * @property {Array<string>} scopes
	 * @property {string} varFnName
	 * @property {boolean} isNoTouch
	 */

	/**
	 * @type {Array<ColorScopeObject>} colorScopes
	 */


	var colorScopes = [{
	  // has/inside dark tone
	  scopes: [".pe-dark-tone", ".pe-dark-tone "],
	  varFnName: "darkTintFns",
	  isNoTouch: false
	}, {
	  // normal, has/inside light tone
	  scopes: ["", ".pe-light-tone", ".pe-light-tone "],
	  varFnName: "lightTintFns",
	  isNoTouch: false
	}, {
	  // has/inside dark tone
	  scopes: [".pe-no-touch .pe-dark-tone "],
	  varFnName: "darkTintHoverFns",
	  isNoTouch: true
	}, {
	  // normal, has/inside light tone
	  scopes: [".pe-no-touch ", ".pe-no-touch .pe-light-tone "],
	  varFnName: "lightTintHoverFns",
	  isNoTouch: true
	}];
	/**
	 * 
	 * @param {object} params
	 * @param {object} [params.varFns]
	 * @param {StyleFn} [params.superColor]
	 * @param {(_:any) => StyleCollection} [params.varMixin]
	 * @returns {StyleFn}
	 */

	var createColor = function createColor(_ref7) {
	  var _ref7$varFns = _ref7.varFns,
	      varFns = _ref7$varFns === void 0 ? {} : _ref7$varFns,
	      superColor = _ref7.superColor,
	      _ref7$varMixin = _ref7.varMixin,
	      varMixin = _ref7$varMixin === void 0 ? function (o) {
	    return o;
	  } : _ref7$varMixin;
	  return (
	    /**
	     * @param {string} selector
	     * @param {object} componentVars
	     * @param {object} [customVars]
	     * @returns {Array<object>}
	     */
	    function (selector, componentVars, customVars) {
	      return colorScopes.map(function (_ref8) {
	        var scopes = _ref8.scopes,
	            varFnName = _ref8.varFnName,
	            isNoTouch = _ref8.isNoTouch;
	        return createColorStyle({
	          selector: selector,
	          scopedSelector: createScopedSelector({
	            scopes: scopes,
	            selector: selector,
	            isNoTouch: isNoTouch
	          }),
	          componentVars: componentVars,
	          customVars: customVars,
	          varFns: varFns[varFnName],
	          superColor: superColor,
	          varMixin: varMixin
	        });
	      });
	    }
	  );
	};
	/**
	 * @param {object} vars 
	 * @param {object} behaviorVars
	 * @returns {string|undefined} 
	 */


	var createMarkerValue = function createMarkerValue(vars, behaviorVars) {
	  var marker = Object.keys(behaviorVars).filter(function (bvar) {
	    return vars[bvar] === true;
	  }).join(".");
	  return marker ? "\"".concat(marker, "\"") : undefined;
	};
	/**
	 * Creates a CSS style from which the key can be read from the `content` property.
	 * @param {object} vars 
	 * @param {object} behaviorVars 
	 * @returns {object}
	 */


	var createMarker = function createMarker(vars, behaviorVars) {
	  if (!vars) {
	    console.error("createMarker requires param `vars`"); // eslint-disable-line no-console
	  }

	  var value = createMarkerValue(vars, behaviorVars);
	  return value ? {
	    ":before": {
	      content: value,
	      display: "none"
	    }
	  } : undefined;
	}; // @ts-check

	var classes$E = {
	  component: "pe-spinner",
	  // elements
	  animation: "pe-spinner__animation",
	  placeholder: "pe-spinner__placeholder",
	  // states
	  animated: "pe-spinner--animated",
	  fab: "pe-spinner--fab",
	  large: "pe-spinner--large",
	  medium: "pe-spinner--medium",
	  permanent: "pe-spinner--permanent",
	  raised: "pe-spinner--raised",
	  regular: "pe-spinner--regular",
	  singleColor: "pe-spinner--single-color",
	  small: "pe-spinner--small",
	  visible: "pe-spinner--visible"
	};

	function _defineProperty$B(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$C() {
	  _extends$C = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$C.apply(this, arguments);
	}

	var generalFns = {
	  general_styles: function general_styles(selector) {
	    return [];
	  } // eslint-disable-line no-unused-vars

	};

	var tintFns = function tintFns(tint) {
	  return _defineProperty$B({}, "color_" + tint + "_raised_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--raised": {
	        backgroundColor: vars$$1["color_" + tint + "_raised_background"]
	      }
	    })];
	  });
	};

	var lightTintFns = _extends$C({}, generalFns, tintFns("light"));

	var darkTintFns = _extends$C({}, generalFns, tintFns("dark"));

	var color = createColor({
	  varFns: {
	    lightTintFns: lightTintFns,
	    darkTintFns: darkTintFns
	  }
	});

	var sizes = function sizes(size) {
	  return {
	    width: size + "px",
	    height: size + "px"
	  };
	};

	var raisedSize = function raisedSize(size) {
	  var padding = Math.round(size * 0.25); // only use rounded number to prevent sub-pixel alignment issues

	  var paddedSize = size + padding * 2;
	  return {
	    width: paddedSize + "px",
	    height: paddedSize + "px",
	    padding: padding + "px"
	  };
	};

	var varFns = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      transitionProperty: "all",
	      ".pe-spinner--raised": {
	        position: "relative",
	        borderRadius: "50%"
	      }
	    })];
	  },
	  animation_show_css: function animation_show_css(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--visible, &.pe-spinner--permanent": [vars$$1.animation_show_css]
	    })];
	  },
	  animation_hide_css: function animation_hide_css(selector, vars$$1) {
	    return _defineProperty$B({}, selector, vars$$1.animation_hide_css);
	  },
	  animation_delay: function animation_delay(selector, vars$$1) {
	    return [sel(selector, {
	      transitionDelay: vars$$1.animation_delay
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      transitionDuration: vars$$1.animation_duration
	    })];
	  },
	  animation_timing_function: function animation_timing_function(selector, vars$$1) {
	    return [sel(selector, {
	      transitionTimingFunction: vars$$1.animation_timing_function
	    })];
	  },
	  size_small: function size_small(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--small": sizes(vars$$1.size_small),
	      ".pe-spinner--raised": {
	        ".pe-spinner--small": raisedSize(vars$$1.size_small)
	      }
	    })];
	  },
	  size_regular: function size_regular(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--regular": sizes(vars$$1.size_regular),
	      ".pe-spinner--raised": {
	        ".pe-spinner--regular": raisedSize(vars$$1.size_regular)
	      }
	    })];
	  },
	  size_medium: function size_medium(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--medium": sizes(vars$$1.size_medium),
	      ".pe-spinner--raised": {
	        ".pe-spinner--medium": raisedSize(vars$$1.size_medium)
	      }
	    })];
	  },
	  size_large: function size_large(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--large": sizes(vars$$1.size_large),
	      ".pe-spinner--raised": {
	        ".pe-spinner--large": raisedSize(vars$$1.size_large)
	      }
	    })];
	  },
	  size_fab: function size_fab(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--fab": sizes(vars$$1.size_fab),
	      ".pe-spinner--raised": {
	        ".pe-spinner--fab": raisedSize(vars$$1.size_fab)
	      }
	    })];
	  }
	};
	var layout$1 = createLayout({
	  varFns: varFns
	}); // @ts-check

	/**
	 * @type {BaseSpinnerVars} baseSpinnerVars
	 */

	var baseSpinnerVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_delay: "0s",
	  animation_duration: ".220s",
	  animation_hide_css: "opacity: 0;",
	  animation_show_css: "opacity: 1;",
	  animation_timing_function: "ease-in-out",
	  size_fab: 7 * vars.grid_unit_component,
	  size_large: 6 * vars.grid_unit_component,
	  size_medium: 5 * vars.grid_unit_component,
	  size_regular: 4 * vars.grid_unit_component,
	  size_small: 3 * vars.grid_unit_component,
	  color_light_raised_background: rgba(vars.color_light_background),
	  color_dark_raised_background: rgba(vars.color_light_background) // also use light background with dark tone

	}; // @ts-check

	var fns = [layout$1, color];
	var selector = ".".concat(classes$E.component);
	styler.addStyle({
	  selectors: [selector],
	  fns: fns,
	  vars: baseSpinnerVars
	});

	var classes$F = {
	  component: "pe-shadow",
	  // elements
	  bottomShadow: "pe-shadow__bottom",
	  topShadow: "pe-shadow__top",
	  // states
	  animated: "pe-shadow--animated",
	  depth_n: "pe-shadow--depth-"
	};

	function _defineProperty$C(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$D() {
	  _extends$D = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$D.apply(this, arguments);
	}

	function _objectSpread$u(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$C(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var _createShadowForSelector = function _createShadowForSelector(which, depth) {
	  return function (selector, vars$$1) {
	    return sel(selector, _defineProperty$C({}, " .pe-shadow__".concat(which, ".pe-shadow--depth-").concat(depth), {
	      boxShadow: vars$$1["shadow_".concat(which, "_depth_").concat(depth)]
	    }));
	  };
	};
	/**
	 * @param {string} selector 
	 * @param {object} vars 
	 * @param {number} depth 
	 * @param {"top"|"bottom"} which 
	 */


	var _createShadow = function _createShadow(selector, vars$$1, depth, which) {
	  return sel(selector, _defineProperty$C({}, " .pe-shadow__".concat(which), {
	    boxShadow: vars$$1["shadow_".concat(which, "_depth_").concat(depth)]
	  }));
	};
	/**
	 * @param {string} selector 
	 * @param {object} vars 
	 * @param {number} depth
	 * @returns {object}
	 */


	var shadow$1 = function shadow(selector, vars$$1, depth) {
	  return [_createShadow(selector, vars$$1, depth, "top"), _createShadow(selector, vars$$1, depth, "bottom")];
	};
	/**
	 * @param {string} selector 
	 * @param {object} vars 
	 * @returns {object}
	 */


	var shadow_depth = function shadow_depth(selector, vars$$1) {
	  return vars$$1.shadow_depth !== undefined ? shadow$1(selector, vars$$1, vars$$1.shadow_depth) : null;
	};

	var sharedVarFns = {
	  shadow_depth: shadow_depth
	};

	var varFns$1 = _extends$D({}, {
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, [mixin.fit(), shadow$1(selector, vars$$1, 1), {
	      borderRadius: "inherit",
	      pointerEvents: "none",
	      " .pe-shadow__bottom, .pe-shadow__top": [mixin.fit(), {
	        borderRadius: "inherit"
	      }]
	    }])];
	  },
	  transition: function transition(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-shadow--animated": {
	        " .pe-shadow__bottom, .pe-shadow__top": {
	          transition: vars$$1.transition
	        }
	      }
	    })];
	  },
	  shadow_depth: shadow_depth
	}, [0, 1, 2, 3, 4, 5].reduce(function (acc, depth) {
	  return acc["shadow_top_depth_".concat(depth)] = _createShadowForSelector("top", depth), acc["shadow_bottom_depth_".concat(depth)] = _createShadowForSelector("bottom", depth), acc;
	}, {}));

	var layout$2 = createLayout({
	  varFns: varFns$1
	});
	var sharedVars = {
	  shadow_top_depth_0: "none",
	  shadow_bottom_depth_0: "none",
	  shadow_top_depth_1: "none",
	  shadow_bottom_depth_1: "0 1px 4px 0 rgba(0, 0, 0, 0.37)",
	  shadow_top_depth_2: "0 2px 2px 0 rgba(0, 0, 0, 0.2)",
	  shadow_bottom_depth_2: "0 6px 10px 0 rgba(0, 0, 0, 0.3)",
	  shadow_top_depth_3: "0 11px 7px 0 rgba(0, 0, 0, 0.19)",
	  shadow_bottom_depth_3: "0 13px 25px 0 rgba(0, 0, 0, 0.3)",
	  shadow_top_depth_4: "0 14px 12px 0 rgba(0, 0, 0, 0.17)",
	  shadow_bottom_depth_4: "0 20px 40px 0 rgba(0, 0, 0, 0.3)",
	  shadow_top_depth_5: "0 17px 17px 0 rgba(0, 0, 0, 0.15)",
	  shadow_bottom_depth_5: "0 27px 55px 0 rgba(0, 0, 0, 0.3)",
	  // theme vars
	  shadow_depth: undefined
	};

	var vars$1 = _objectSpread$u({
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  transition: "box-shadow ".concat(vars.animation_duration, " ease-out")
	}, sharedVars); // @ts-check


	var fns$1 = [layout$2];
	var selector$1 = ".".concat(classes$F.component);
	styler.addStyle({
	  selectors: [selector$1],
	  fns: fns$1,
	  vars: vars$1
	});

	var classes$G = {
	  component: "pe-text-button",
	  super: "pe-button",
	  row: "pe-button-row",
	  // elements      
	  content: "pe-button__content",
	  label: "pe-button__label",
	  textLabel: "pe-button__text-label",
	  wash: "pe-button__wash",
	  dropdown: "pe-button__dropdown",
	  // states      
	  border: "pe-button--border",
	  contained: "pe-button--contained",
	  disabled: "pe-button--disabled",
	  dropdownClosed: "pe-button--dropdown-closed",
	  dropdownOpen: "pe-button--dropdown-open",
	  extraWide: "pe-button--extra-wide",
	  hasDropdown: "pe-button--dropdown",
	  highLabel: "pe-button--high-label",
	  inactive: "pe-button--inactive",
	  raised: "pe-button--raised",
	  selected: "pe-button--selected",
	  separatorAtStart: "pe-button--separator-start"
	};

	function _defineProperty$D(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$E() {
	  _extends$E = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$E.apply(this, arguments);
	}

	function _objectSpread$v(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$D(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var varFns$2 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      userSelect: "none",
	      "-moz-user-select": "none",
	      outline: "none",
	      padding: 0,
	      textDecoration: "none",
	      textAlign: "center",
	      cursor: "pointer",
	      ".pe-button--selected, &.pe-button--disabled, &.pe-button--inactive": {
	        cursor: "default",
	        pointerEvents: "none"
	      },
	      " .pe-button__content": {
	        position: "relative",
	        borderRadius: "inherit"
	      },
	      " .pe-button__label": {
	        position: "relative",
	        display: "block",
	        borderRadius: "inherit",
	        pointerEvents: "none"
	      },
	      " .pe-button__wash": [mixin.fit(), {
	        zIndex: 0,
	        borderRadius: "inherit",
	        pointerEvents: "none"
	      }]
	    }), {
	      ".pe-button-row": {
	        // prevent inline block style to add extra space:
	        fontSize: 0,
	        lineHeight: 0
	      }
	    }];
	  },
	  row_margin_h: function row_margin_h(selector, vars$$1) {
	    return [{
	      ".pe-button-row": _defineProperty$D({
	        margin: "0 -".concat(vars$$1.row_margin_h, "px")
	      }, " ".concat(selector), {
	        margin: "0 ".concat(vars$$1.row_margin_h, "px")
	      })
	    }];
	  }
	};
	var superLayout = createLayout({
	  varFns: varFns$2
	});

	var _border = function border(selector, vars$$1, tint) {
	  return sel(selector, {
	    ":not(.pe-button--disabled)": {
	      " .pe-button__content": {
	        borderColor: vars$$1["color_" + tint + "_border"]
	      }
	    }
	  });
	};

	var generalFns$1 = {
	  general_styles: function general_styles() {
	    return [];
	  }
	};
	/**
	 * @param {tint} tint 
	 */

	var tintFns$1 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$D(_ref, "color_" + tint + "_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--disabled)": {
	        "&, &:link, &:visited": {
	          color: vars$$1["color_" + tint + "_text"]
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref, "color_" + tint + "_disabled_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--disabled": {
	        color: vars$$1["color_" + tint + "_disabled_text"]
	      }
	    })];
	  }), _defineProperty$D(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--disabled):not(.pe-button--selected)": {
	        " .pe-button__content": {
	          backgroundColor: vars$$1["color_" + tint + "_background"]
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref, "color_" + tint + "_active_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--disabled)": {
	        ".pe-button--selected": {
	          " .pe-button__content": {
	            backgroundColor: vars$$1["color_" + tint + "_active_background"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref, "color_" + tint + "_disabled_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--disabled": {
	        " .pe-button__content": {
	          backgroundColor: vars$$1["color_" + tint + "_disabled_background"]
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref, "color_" + tint + "_border", function (selector, vars$$1) {
	    return [_border("".concat(selector, ".pe-button--border"), vars$$1, tint)];
	  }), _defineProperty$D(_ref, "border", function border(selector, vars$$1) {
	    return [_border(selector, vars$$1, tint)];
	  }), _defineProperty$D(_ref, "color_" + tint + "_active_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--border.pe-button--selected": {
	        " .pe-button__content": {
	          borderColor: vars$$1["color_" + tint + "_active_border"]
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref, "color_" + tint + "_disabled_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--border.pe-button--disabled": {
	        " .pe-button__content": {
	          borderColor: vars$$1["color_" + tint + "_disabled_border"]
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref, "color_" + tint + "_icon", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__dropdown": {
	        color: vars$$1["color_" + tint + "_icon"]
	      }
	    })];
	  }), _defineProperty$D(_ref, "color_" + tint + "_separator", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--separator-start": {
	        " .pe-button__content": {
	          borderColor: vars$$1["color_" + tint + "_separator"]
	        }
	      }
	    })];
	  }), _ref;
	};
	/**
	 * @param {tint} tint 
	 */


	var hoverTintFns = function hoverTintFns(tint) {
	  var _ref2;

	  return _ref2 = {}, _defineProperty$D(_ref2, "color_" + tint + "_hover", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--disabled):not(.pe-button--selected)": {
	        color: vars$$1["color_" + tint + "_hover"]
	      }
	    })];
	  }), _defineProperty$D(_ref2, "color_" + tint + "_hover_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--disabled):not(.pe-button--selected)": {
	        " .pe-button__content": {
	          borderColor: vars$$1["color_" + tint + "_hover_border"]
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref2, "color_" + tint + "_wash_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--disabled):not(.pe-button--selected)": {
	        " .pe-button__wash": {
	          backgroundColor: vars$$1["color_" + tint + "_wash_background"]
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref2, "color_" + tint + "_hover_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--disabled):not(.pe-button--selected)": {
	        " .pe-button__content": {
	          backgroundColor: vars$$1["color_" + tint + "_hover_background"]
	        }
	      }
	    })];
	  }), _defineProperty$D(_ref2, "color_" + tint + "_hover_icon", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__dropdown": {
	        color: vars$$1["color_" + tint + "_hover_icon"]
	      }
	    })];
	  }), _ref2;
	};

	var lightTintFns$1 = _objectSpread$v({}, generalFns$1, tintFns$1("light"));

	var darkTintFns$1 = _objectSpread$v({}, generalFns$1, tintFns$1("dark"));

	var lightTintHoverFns = hoverTintFns("light");
	var darkTintHoverFns = hoverTintFns("dark");
	var superColor = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$1,
	    darkTintFns: darkTintFns$1,
	    lightTintHoverFns: lightTintHoverFns,
	    darkTintHoverFns: darkTintHoverFns
	  }
	});
	/** 
	 * @param {boolean} isRTL 
	 */

	var alignSide = function alignSide(isRTL) {
	  return function () {
	    return {
	      ".pe-button--separator-start .pe-button__content": {
	        borderStyle: isRTL ? "none solid none none" : "none none none solid"
	      }
	    };
	  };
	};

	var alignLeft = alignSide(false);
	var alignRight = alignSide(true);

	var line_height_label_padding_v = function line_height_label_padding_v(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-button__dropdown": {
	      minHeight: "calc((1em * ".concat(vars$$1.line_height, ") + 2 * ").concat(vars$$1.label_padding_v, "px)")
	    }
	  });
	};

	var outer_padding_v_label_padding_v = function outer_padding_v_label_padding_v(selector, vars$$1) {
	  return sel(selector, {
	    ".pe-button--high-label": {
	      padding: 0,
	      " .pe-button__label": {
	        padding: vars$$1.outer_padding_v + vars$$1.label_padding_v + "px 0"
	      }
	    }
	  });
	};

	var line_height_outer_padding_v_label_padding_v = function line_height_outer_padding_v_label_padding_v(selector, vars$$1) {
	  return sel(selector, {
	    ".pe-button--high-label": {
	      " .pe-button__label, .pe-button__dropdown": {
	        minHeight: "calc((1em * ".concat(vars$$1.line_height, ") + 2 * ").concat(vars$$1.outer_padding_v + vars$$1.label_padding_v, "px)")
	      }
	    }
	  });
	};

	var border_radius_button_group = function border_radius_button_group(selector, vars$$1, isRTL) {
	  var _peButton__content, _peButton__content2;

	  return sel(selector, {
	    " .pe-button__content": {
	      borderRadius: vars$$1.border_radius + "px"
	    },
	    ":not(:first-child)": {
	      " .pe-button__content": (_peButton__content = {}, _defineProperty$D(_peButton__content, isRTL ? "borderTopRightRadius" : "borderTopLeftRadius", 0), _defineProperty$D(_peButton__content, isRTL ? "borderBottomRightRadius" : "borderBottomLeftRadius", 0), _peButton__content)
	    },
	    ":not(:last-child)": {
	      " .pe-button__content": (_peButton__content2 = {}, _defineProperty$D(_peButton__content2, isRTL ? "borderTopLeftRadius" : "borderTopRightRadius", 0), _defineProperty$D(_peButton__content2, isRTL ? "borderBottomLeftRadius" : "borderBottomRightRadius", 0), _peButton__content2)
	    }
	  });
	};

	var _border$1 = function border(selector) {
	  return sel(selector, {
	    " .pe-button__wash, .pe-ripple": mixin.fit(-1),
	    " .pe-button__content": {
	      borderStyle: "solid"
	    }
	  });
	};

	var _border_width = function border_width(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-button__content": {
	      borderWidth: vars$$1.border_width + "px"
	    },
	    " .pe-button-group & + &": {
	      marginLeft: -vars$$1.border_width + "px"
	    }
	  });
	};

	var _contained = function contained(selector) {
	  return sel(selector, {
	    " .pe-button__wash": {
	      display: "none"
	    }
	  });
	};

	var varFns$1$1 = _objectSpread$v({
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [alignLeft(), {
	      display: "inline-block",
	      background: "transparent",
	      border: "none",
	      " .pe-button__content": {
	        position: "relative",
	        borderWidth: "1px",
	        // default
	        display: "flex",
	        alignItems: "center",
	        justifyContent: "center",
	        paddingTop: 0,
	        paddingBottom: 0
	      },
	      ".pe-button--border": _border$1(selector),
	      " .pe-button__label, .pe-button__dropdown": {
	        whiteSpace: "pre",
	        userSelect: "none",
	        "-moz-user-select": "none"
	      },
	      " .pe-button__text-label": {
	        display: "inline-block",
	        lineHeight: 1
	      },
	      ".pe-button--dropdown": {
	        minWidth: "0",
	        // IE 11 does not recognize "initial" here
	        " .pe-button__dropdown": {
	          position: "relative"
	        },
	        " .pe-svg": {
	          position: "absolute",
	          left: 0,
	          top: "50%"
	        },
	        " .pe-button__label + .pe-button__dropdown": {
	          marginLeft: "6px",
	          minWidth: 0
	        }
	      },
	      " .pe-button-group &": {
	        minWidth: 0
	      },
	      " .pe-button__dropdown .pe-svg": mixin.defaultTransition("transform"),
	      ".pe-button--dropdown-open": {
	        " .pe-button__dropdown .pe-svg": {
	          transform: "rotate(-180deg)"
	        }
	      }
	    }]), [sel(selectorRTL(selector), alignRight())]];
	  },
	  border_radius: function border_radius(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        borderRadius: vars$$1.border_radius + "px"
	      }
	    }), border_radius_button_group(".pe-button-group ".concat(selector), vars$$1, false), border_radius_button_group(selectorRTL(".pe-button-group ".concat(selector)), vars$$1, true)];
	  },
	  border_width: function border_width(selector, vars$$1) {
	    return [_border_width(selector, vars$$1)];
	  },
	  min_width: function min_width(selector, vars$$1) {
	    return [sel(selector, {
	      minWidth: vars$$1.min_width + "px"
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content, .pe-button__wash": [mixin.defaultTransition("all", vars$$1.animation_duration)]
	    })];
	  },
	  padding_h: function padding_h(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        paddingLeft: vars$$1.padding_h + "px",
	        paddingRight: vars$$1.padding_h + "px",
	        " .pe-button__dropdown": {
	          minWidth: "calc(36px - 2 * ".concat(vars$$1.padding_h, "px)")
	        },
	        ".pe-button--dropdown": {
	          " .pe-button__label + .pe-button__dropdown": {
	            marginRight: "calc(7px - ".concat(vars$$1.padding_h, "px)")
	          }
	        }
	      }
	    })];
	  },
	  padding_h_extra_wide: function padding_h_extra_wide(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--extra-wide .pe-button__content": {
	        padding: "0 " + vars$$1.padding_h_extra_wide + "px"
	      }
	    })];
	  },
	  label_padding_v: function label_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__label": {
	        padding: vars$$1.label_padding_v + "px 0"
	      },
	      ".pe-button--border": {
	        " .pe-button__label": {
	          padding: vars$$1.label_padding_v - 1 + "px 0"
	        }
	      }
	    }), vars$$1.line_height !== undefined && line_height_label_padding_v(selector, vars$$1), vars$$1.outer_padding_v !== undefined && outer_padding_v_label_padding_v(selector, vars$$1), vars$$1.line_height !== undefined && vars$$1.outer_padding_v !== undefined && vars$$1.label_padding_v !== undefined && line_height_outer_padding_v_label_padding_v(selector, vars$$1)];
	  },
	  font_weight: function font_weight(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__label": {
	        fontWeight: vars$$1.font_weight
	      }
	    })];
	  },
	  text_transform: function text_transform(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__label": {
	        textTransform: vars$$1.text_transform
	      }
	    })];
	  },
	  font_size: function font_size(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__label, .pe-button__dropdown": {
	        fontSize: vars$$1.font_size + "px"
	      }
	    })];
	  },
	  line_height: function line_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__label, .pe-button__dropdown": {
	        lineHeight: vars$$1.line_height
	      }
	    }), vars$$1.label_padding_v !== undefined && line_height_label_padding_v(selector, vars$$1), vars$$1.outer_padding_v !== undefined && vars$$1.label_padding_v !== undefined && line_height_outer_padding_v_label_padding_v(selector, vars$$1)];
	  },
	  dropdown_icon_size: function dropdown_icon_size(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--dropdown": {
	        " .pe-button__dropdown": {
	          width: vars$$1.dropdown_icon_size + "px"
	        },
	        " .pe-svg": {
	          width: vars$$1.dropdown_icon_size + "px",
	          height: vars$$1.dropdown_icon_size + "px",
	          marginTop: -vars$$1.dropdown_icon_size / 2 + "px"
	        }
	      }
	    })];
	  },
	  outer_padding_v: function outer_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      padding: vars$$1.outer_padding_v + "px 0",
	      ".pe-button--high-label": {
	        padding: 0
	      }
	    }), vars$$1.label_padding_v !== undefined && outer_padding_v_label_padding_v(selector, vars$$1), vars$$1.line_height !== undefined && vars$$1.outer_padding_v !== undefined && vars$$1.label_padding_v !== undefined && line_height_outer_padding_v_label_padding_v(selector, vars$$1)];
	  },
	  separator_width: function separator_width(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--separator-start": {
	        " .pe-button__content": {
	          borderWidth: vars$$1.separator_width + "px"
	        }
	      }
	    })];
	  },
	  letter_spacing: function letter_spacing(selector, vars$$1) {
	    return [sel(selector, {
	      letterSpacing: vars$$1.letter_spacing + "px"
	    })];
	  },
	  // Theme vars
	  border: function border(selector, vars$$1) {
	    return vars$$1.border && _border$1(selector);
	  },
	  contained: function contained(selector, vars$$1) {
	    return vars$$1.contained && _contained(selector);
	  }
	}, sharedVarFns);

	var superLayout$1 = createLayout({
	  varFns: varFns$1$1
	});
	var touch_height = vars.unit_touch_height; // 48

	var height = 36;
	var border_width = 1;

	var themeVars = _extends$E({}, {
	  border: false,
	  contained: false
	}, sharedVars);

	var borderVars = {
	  border_width: border_width,
	  color_light_border: rgba(vars.color_light_foreground, vars.blend_light_border_medium),
	  // only specify this variable to get all 4 states
	  // color_light_hover_border:             "transparent",
	  // color_light_active_border:            "transparent",
	  color_light_disabled_border: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  //
	  color_dark_border: rgba(vars.color_dark_foreground, vars.blend_dark_border_medium),
	  // only specify this variable to get all 4 states
	  // color_dark_hover_border:              "transparent",
	  // color_dark_active_border:             "transparent",
	  color_dark_disabled_border: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled)
	};
	/**
	 * @type {TextButtonVars} textButtonVars
	 */

	var textButtonVars = _objectSpread$v({
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_duration: vars.animation_duration,
	  border_radius: vars.unit_item_border_radius,
	  dropdown_icon_size: 24,
	  font_size: 14,
	  font_weight: 500,
	  label_padding_v: 11,
	  letter_spacing: 0.75,
	  line_height: 1,
	  min_width: 8 * vars.grid_unit_component,
	  outer_padding_v: (touch_height - height) / 2,
	  // (48 - 36) / 2 = 6
	  padding_h: 2 * vars.grid_unit,
	  // 8
	  padding_h_extra_wide: 6 * vars.grid_unit,
	  // 24
	  row_margin_h: vars.grid_unit,
	  separator_width: border_width,
	  text_transform: "uppercase",
	  color_light_background: "transparent",
	  color_light_text: rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  color_light_wash_background: rgba(vars.color_light_foreground, vars.blend_light_background_hover),
	  color_light_active_background: rgba(vars.color_light_foreground, vars.blend_light_background_active),
	  color_light_disabled_background: "transparent",
	  color_light_disabled_text: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  color_light_icon: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_separator: rgba(vars.color_light_foreground, vars.blend_light_border_light),
	  color_dark_background: "transparent",
	  color_dark_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  color_dark_wash_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_hover),
	  color_dark_active_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_active),
	  color_dark_disabled_background: "transparent",
	  color_dark_disabled_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled),
	  color_dark_icon: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_separator: rgba(vars.color_dark_foreground, vars.blend_dark_border_light)
	}, borderVars, themeVars);

	var themeVars$1 = _objectSpread$v({
	  border: false,
	  contained: true
	}, sharedVars);
	/**
	 * @type {ContainedButtonVars} containedButtonVars
	 */


	var containedButtonVars = _objectSpread$v({
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  padding_h: 4 * vars.grid_unit,
	  // 16
	  color_light_background: "#fff",
	  color_light_disabled_background: rgba(vars.color_light_foreground, vars.blend_light_background_disabled),
	  color_light_wash_background: "transparent",
	  color_dark_active_background: rgba(vars.color_primary_dark),
	  color_dark_background: rgba(vars.color_primary),
	  color_dark_disabled_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_disabled),
	  color_dark_wash_background: "transparent"
	}, themeVars$1); // @ts-check


	var fns$2 = [superLayout$1, superColor];
	var superFns = [superLayout];
	var superSelector = ".".concat(classes$G.super);
	var selector$2 = ".".concat(classes$G.component);
	/**
	 * @param {string} customSelector 
	 * @param {object} [customVars]
	 * @param {object} [scoping]
	 * @param {string} [scoping.mediaQuery]
	 * @param {string} [scoping.scope]
	 */

	var addStyle$3 = function addStyle(customSelector, customVars) {
	  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      _ref$mediaQuery = _ref.mediaQuery,
	      mediaQuery = _ref$mediaQuery === void 0 ? "" : _ref$mediaQuery,
	      _ref$scope = _ref.scope,
	      scope = _ref$scope === void 0 ? "" : _ref$scope;

	  var finalVars = customVars && customVars.contained ? containedButtonVars : textButtonVars;
	  customSelector && styler.addStyle({
	    selectors: [superSelector, customSelector],
	    fns: superFns,
	    vars: finalVars,
	    customVars: customVars,
	    mediaQuery: mediaQuery,
	    scope: scope
	  });
	  customSelector && styler.addStyle({
	    selectors: [selector$2, customSelector],
	    fns: fns$2,
	    vars: finalVars,
	    customVars: customVars,
	    mediaQuery: mediaQuery,
	    scope: scope
	  });
	};

	styler.addStyle({
	  selectors: [superSelector],
	  fns: superFns,
	  vars: textButtonVars
	});
	styler.addStyle({
	  selectors: [selector$2],
	  fns: fns$2,
	  vars: textButtonVars
	}); // @ts-check

	var color$1 = createColor({
	  superColor: superColor
	}); // @ts-check

	var layout$3 = createLayout({
	  superLayout: superLayout$1
	}); // @ts-check

	var fns$1$1 = [layout$3, color$1];
	var selectors = [classes$G.component, classes$G.contained].join(" ");
	var selector$1$1 = ".".concat(selectors.split(/\s/).join("."));
	styler.addStyle({
	  selectors: [selector$1$1],
	  fns: fns$1$1,
	  vars: containedButtonVars
	}); // @ts-check

	/**
	 * @param {string} customSelector 
	 * @param {object} [customVars]
	 * @param {object} [scoping]
	 * @param {string} [scoping.mediaQuery]
	 * @param {string} [scoping.scope]
	 */

	var addStyle$2$1 = function addStyle$$1(customSelector, customVars) {
	  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      _ref$mediaQuery = _ref.mediaQuery,
	      mediaQuery = _ref$mediaQuery === void 0 ? "" : _ref$mediaQuery,
	      _ref$scope = _ref.scope,
	      scope = _ref$scope === void 0 ? "" : _ref$scope;

	  addStyle$3(customSelector, customVars, {
	    mediaQuery: mediaQuery,
	    scope: scope
	  });
	};

	var textButtonVars$1 = textButtonVars;

	var classes$H = {
	  component: "pe-button-group"
	}; // @ts-check

	var varFns$3 = {
	  /**
	   * @param {string} selector
	   */
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      display: "flex"
	    })];
	  }
	};
	var layout$4 = createLayout({
	  varFns: varFns$3
	}); // @ts-check

	/**
	 * @typedef {import("../index").ButtonGroupVars} ButtonGroupVars
	 */

	/**
	 * @type {ButtonGroupVars} buttonGroupVars
	 */

	var buttonGroupVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true
	}; // @ts-check

	var fns$3 = [layout$4];
	var selector$3 = ".".concat(classes$H.component);
	styler.addStyle({
	  selectors: [selector$3],
	  fns: fns$3,
	  vars: buttonGroupVars
	});

	var classes$I = {
	  component: "pe-card",
	  // elements
	  actions: "pe-card__actions",
	  any: "pe-card__any",
	  content: "pe-card__content",
	  header: "pe-card__header",
	  headerTitle: "pe-card__header-title",
	  media: "pe-card__media",
	  mediaDimmer: "pe-card__media__dimmer",
	  overlay: "pe-card__overlay",
	  overlayContent: "pe-card__overlay__content",
	  primary: "pe-card__primary",
	  primaryMedia: "pe-card__primary-media",
	  subtitle: "pe-card__subtitle",
	  text: "pe-card__text",
	  title: "pe-card__title",
	  // states
	  actionsBorder: "pe-card__actions--border",
	  actionsHorizontal: "pe-card__actions--horizontal",
	  actionsJustified: "pe-card__actions--justified",
	  actionsTight: "pe-card__actions--tight",
	  actionsVertical: "pe-card__actions--vertical",
	  mediaCropX: "pe-card__media--crop-x",
	  mediaCropY: "pe-card__media--crop-y",
	  mediaOriginStart: "pe-card__media--origin-start",
	  mediaOriginCenter: "pe-card__media--origin-center",
	  mediaOriginEnd: "pe-card__media--origin-end",
	  mediaLarge: "pe-card__media--large",
	  mediaMedium: "pe-card__media--medium",
	  mediaRatioLandscape: "pe-card__media--landscape",
	  mediaRatioSquare: "pe-card__media--square",
	  mediaRegular: "pe-card__media--regular",
	  mediaSmall: "pe-card__media--small",
	  overlaySheet: "pe-card__overlay--sheet",
	  primaryHasMedia: "pe-card__primary--media",
	  primaryTight: "pe-card__primary--tight",
	  textTight: "pe-card__text--tight"
	};

	function _defineProperty$E(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$F() {
	  _extends$F = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$F.apply(this, arguments);
	}

	var generalFns$2 = {
	  general_styles: function general_styles(selector) {
	    return [];
	  } // eslint-disable-line no-unused-vars

	};

	var tintFns$2 = function tintFns(tint) {
	  return _defineProperty$E({}, "color_" + tint + "_main_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      backgroundColor: vars$$1["color_" + tint + "_main_background"]
	    })];
	  });
	};

	var lightTintFns$2 = _extends$F({}, generalFns$2, tintFns$2("light"));

	var darkTintFns$2 = _extends$F({}, generalFns$2, tintFns$2("dark"));

	var color$2 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$2,
	    darkTintFns: darkTintFns$2
	  }
	});
	var generalFns$1$1 = {
	  general_styles: function general_styles(selector) {
	    return [];
	  } // eslint-disable-line no-unused-vars

	};

	var tintFns$1$1 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$E(_ref, "color_" + tint + "_title_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__title": {
	        color: vars$$1["color_" + tint + "_title_text"]
	      }
	    })];
	  }), _defineProperty$E(_ref, "color_" + tint + "_subtitle_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__subtitle": {
	        color: vars$$1["color_" + tint + "_subtitle_text"]
	      }
	    })];
	  }), _defineProperty$E(_ref, "color_" + tint + "_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__text": {
	        color: vars$$1["color_" + tint + "_text"]
	      }
	    })];
	  }), _defineProperty$E(_ref, "color_" + tint + "_actions_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__actions--border": {
	        borderTop: "1px solid " + vars$$1["color_" + tint + "_actions_border"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$1$1 = _extends$F({}, generalFns$1$1, tintFns$1$1("light"));

	var darkTintFns$1$1 = _extends$F({}, generalFns$1$1, tintFns$1$1("dark"));

	var contentColor = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$1$1,
	    darkTintFns: darkTintFns$1$1
	  }
	});
	/** 
	 * @param {boolean} isRTL 
	 */

	var alignSide$1 = function alignSide(isRTL) {
	  return (// eslint-disable-line no-unused-vars

	    /**
	     * @param {string} [selector]
	     * @param {object} [vars]
	     */
	    function (selector, vars$$1) {
	      return {};
	    }
	  );
	}; // eslint-disable-line no-unused-vars


	var alignLeft$1 = alignSide$1(false);
	var alignRight$1 = alignSide$1(true);

	var tight_title_padding_bottom_subtitle_line_height_padding_bottom = function tight_title_padding_bottom_subtitle_line_height_padding_bottom(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-card__primary": {
	      ".pe-card__primary--tight": {
	        " .pe-card__title": {
	          paddingBottom: vars$$1.tight_title_padding_bottom - vars$$1.subtitle_line_height_padding_bottom + "px"
	        }
	      }
	    }
	  });
	};

	var title_padding_v_title_padding_h_subtitle_line_height_padding_bottom = function title_padding_v_title_padding_h_subtitle_line_height_padding_bottom(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-card__title": {
	      padding: [vars$$1.title_padding_v, vars$$1.title_padding_h, vars$$1.title_padding_v - vars$$1.subtitle_line_height_padding_bottom, vars$$1.title_padding_h].map(function (v) {
	        return v + "px";
	      }).join(" ")
	    }
	  });
	};

	var text_padding_v_text_line_height_padding_top = function text_padding_v_text_line_height_padding_top(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-card__text": {
	      paddingTop: vars$$1.text_padding_v - vars$$1.text_line_height_padding_top + "px"
	    }
	  });
	};

	var text_padding_bottom_text_line_height_padding_bottom = function text_padding_bottom_text_line_height_padding_bottom(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-card__text": {
	      "&:last-child": {
	        paddingBottom: vars$$1.text_padding_bottom - vars$$1.text_line_height_padding_bottom + "px"
	      }
	    }
	  });
	};

	var tight_text_padding_bottom_text_line_height_padding_bottom = function tight_text_padding_bottom_text_line_height_padding_bottom(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-card__text": {
	      paddingBottom: vars$$1.tight_text_padding_bottom - vars$$1.text_line_height_padding_bottom + "px",
	      ".pe-card__text--tight, &.pe-card__text--tight:last-child": {
	        paddingBottom: vars$$1.tight_text_padding_bottom - vars$$1.text_line_height_padding_bottom + "px"
	      }
	    }
	  });
	};

	var varFns$4 = {
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, [alignLeft$1(vars$$1), {
	      display: "block",
	      position: "relative",
	      "&, a:link, a:visited": {
	        textDecoration: "none"
	      },
	      // Content
	      " .pe-card__content": {
	        position: "relative",
	        borderRadius: "inherit",
	        overflow: "hidden",
	        width: "inherit",
	        height: "inherit"
	      },
	      // Media
	      " .pe-card__media": {
	        position: "relative",
	        overflow: "hidden",
	        borderTopLeftRadius: "inherit",
	        borderTopRightRadius: "inherit",
	        backgroundSize: "cover",
	        backgroundRepeat: "no-repeat",
	        backgroundPosition: "center",
	        ".pe-card__media--landscape": {
	          paddingBottom: 100 / 16 * 9 + "%"
	        },
	        ".pe-card__media--square": {
	          paddingBottom: "100%"
	        },
	        ".pe-card__media--crop-x": {
	          width: "100%",
	          height: "auto",
	          display: "block",
	          ".pe-card__media--origin-start": {
	            backgroundPositionY: "top"
	          },
	          ".pe-card__media--origin-end": {
	            backgroundPositionY: "bottom"
	          }
	        },
	        ".pe-card__media--crop-y": {
	          height: "100%",
	          width: "auto",
	          display: "block",
	          ".pe-card__media--origin-start": {
	            backgroundPositionX: "left"
	          },
	          ".pe-card__media--origin-end": {
	            backgroundPositionX: "right"
	          }
	        },
	        " img, iframe": [mixin.fit(), {
	          width: "100%",
	          height: "100%",
	          maxWidth: "none"
	        }],
	        " img": {
	          opacity: 0
	          /* allows right-click on image */

	        },
	        " .pe-card__header + .pe-card__media": {
	          borderTopLeftRadius: 0,
	          borderTopRightRadius: 0
	        }
	      },
	      " .pe-card__primary-media": {
	        margin: "16px"
	      },
	      // Overlay
	      " .pe-card__overlay": mixin.fit(),
	      // Dimmer
	      " .pe-card__media__dimmer": [mixin.fit(), {
	        zIndex: 1,
	        pointerEvents: "all"
	      }],
	      " .pe-card__overlay__content": {
	        position: "absolute",
	        bottom: 0,
	        top: "auto",
	        right: 0,
	        left: 0,
	        zIndex: 2
	      },
	      // Header
	      " .pe-card__header": {
	        " .pe-list-tile__title": {
	          fontSize: "14px",
	          fontWeight: vars.font_weight_normal,
	          lineHeight: "20px",
	          marginTop: "2px"
	        },
	        " .pe-list-tile__subtitle": {
	          marginTop: "-1px"
	        }
	      },
	      // Primary 
	      " .pe-card__primary": [flex$1.layoutHorizontal, {
	        position: "relative",
	        "& + .pe-card__text": {
	          marginTop: "-16px"
	        }
	      }],
	      // Title
	      " .pe-card__title": [flex$1.flex(), {
	        fontSize: "24px",
	        lineHeight: "29px"
	      }],
	      // Subtitle
	      " .pe-card__subtitle": {
	        fontSize: "14px",
	        lineHeight: "24px"
	      },
	      // Actions
	      " .pe-card__actions": {
	        ".pe-card__actions--tight": {
	          minHeight: 0,
	          paddingTop: 0,
	          paddingBottom: 0,
	          ".pe-card__actions--vertical": {
	            paddingLeft: 0,
	            paddingRight: 0
	          }
	        },
	        ".pe-card__actions--horizontal": {
	          minHeight: 36 + 2 * 8 + "px",
	          height: 36 + 2 * 8 + "px" // make align-items work on IE 11: https://github.com/philipwalton/flexbugs/issues/231

	        },
	        ".pe-card__actions--horizontal:not(.pe-card__actions--justified)": [flex$1.layoutHorizontal, flex$1.layoutCenter, {
	          " .pe-button": {
	            minWidth: 0
	          }
	        }],
	        ".pe-card__actions--justified": [flex$1.layoutJustified],
	        ".pe-card__actions--vertical": [flex$1.layoutVertical, {
	          // nested
	          " .pe-card__actions": [{
	            minHeight: 0
	          }],
	          " .pe-button": {
	            height: "36px",
	            padding: 0
	          },
	          " .pe-list": {
	            padding: 0
	          }
	        }]
	      },
	      " .pe-card__primary.pe-card__primary--media + .pe-card__actions": {
	        marginTop: "-16px"
	      },
	      // Text
	      " .pe-card__text": {
	        fontSize: "14px",
	        lineHeight: "24px",
	        " .pe-card__actions + &": {
	          marginTop: "8px"
	        }
	      },
	      " .pe-card__text, .pe-card__primary": {
	        "& + .pe-card__actions:not(:last-child)": {
	          // Lift up so that full button area is usable
	          position: "relative",
	          zIndex: 1
	        }
	      }
	    }, {
	      // RTL
	      "*[dir=rtl], .pe-rtl ": _defineProperty$E({}, selector, alignRight$1(vars$$1))
	    }])];
	  },
	  border_radius: function border_radius(selector, vars$$1) {
	    return [sel(selector, {
	      borderRadius: vars$$1.border_radius + "px",
	      " .pe-card__content .pe-card__media": {
	        borderTopLeftRadius: 0,
	        borderTopRightRadius: 0,
	        borderBottomLeftRadius: 0,
	        borderBottomRightRadius: 0
	      },
	      " .pe-card__content .pe-card__media:not(.pe-card__media--square):not(.pe-card__media--landscape)": {
	        ":first-child": {
	          borderTopLeftRadius: vars$$1.border_radius + "px",
	          borderTopRightRadius: vars$$1.border_radius + "px"
	        },
	        ":last-child": {
	          borderBottomLeftRadius: vars$$1.border_radius + "px",
	          borderBottomRightRadius: vars$$1.border_radius + "px"
	        }
	      }
	    })];
	  },
	  image_size_small: function image_size_small(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__primary-media": {
	        " .pe-card__media--small": {
	          width: vars$$1.image_size_small + "px",
	          height: vars$$1.image_size_small + "px"
	        }
	      }
	    })];
	  },
	  image_size_regular: function image_size_regular(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__primary-media": {
	        " .pe-card__media--regular": {
	          width: vars$$1.image_size_regular + "px"
	        }
	      }
	    })];
	  },
	  image_size_medium: function image_size_medium(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__primary-media": {
	        " .pe-card__media--medium": {
	          width: vars$$1.image_size_medium + "px"
	        }
	      }
	    })];
	  },
	  image_size_large: function image_size_large(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__primary-media": {
	        " .pe-card__media--large": {
	          width: vars$$1.image_size_large + "px"
	        }
	      }
	    })];
	  },
	  one_line_height_with_icon: function one_line_height_with_icon(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__header": {
	        height: vars$$1.one_line_height_with_icon + "px"
	      }
	    })];
	  },
	  tight_title_padding_bottom: function tight_title_padding_bottom(selector, vars$$1) {
	    return [sel(selector, {}), tight_title_padding_bottom_subtitle_line_height_padding_bottom(selector, vars$$1)];
	  },
	  subtitle_line_height_padding_bottom: function subtitle_line_height_padding_bottom(selector, vars$$1) {
	    return [sel(selector, {}), tight_title_padding_bottom_subtitle_line_height_padding_bottom(selector, vars$$1), title_padding_v_title_padding_h_subtitle_line_height_padding_bottom(selector, vars$$1)];
	  },
	  title_padding_v: function title_padding_v(selector, vars$$1) {
	    return [sel(selector, {}), title_padding_v_title_padding_h_subtitle_line_height_padding_bottom(selector, vars$$1)];
	  },
	  title_padding_h: function title_padding_h(selector, vars$$1) {
	    return [sel(selector, {}), title_padding_v_title_padding_h_subtitle_line_height_padding_bottom(selector, vars$$1)];
	  },
	  actions_button_margin_h: function actions_button_margin_h(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__actions.pe-card__actions--horizontal": {
	        margin: "0 -".concat(vars$$1.actions_button_margin_h, "px"),
	        " .pe-button": {
	          margin: "0 ".concat(vars$$1.actions_button_margin_h, "px")
	        }
	      }
	    })];
	  },
	  actions_padding_v: function actions_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__actions": {
	        paddingTop: vars$$1.actions_padding_v + "px",
	        paddingBottom: vars$$1.actions_padding_v + "px"
	      }
	    })];
	  },
	  actions_padding_h: function actions_padding_h(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__actions": {
	        paddingRight: vars$$1.actions_padding_h + "px",
	        paddingLeft: vars$$1.actions_padding_h + "px"
	      }
	    })];
	  },
	  actions_button_margin_v: function actions_button_margin_v(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__actions": {
	        ".pe-card__actions--vertical": {
	          " .pe-button": {
	            marginTop: vars$$1.actions_button_margin_v + "px",
	            marginBottom: vars$$1.actions_button_margin_v + "px"
	          }
	        }
	      }
	    })];
	  },
	  actions_vertical_padding_v: function actions_vertical_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__actions": {
	        ".pe-card__actions--vertical": {
	          ":not(.pe-card__actions--tight)": {
	            paddingTop: vars$$1.actions_vertical_padding_v + "px",
	            paddingBottom: vars$$1.actions_vertical_padding_v + "px"
	          },
	          // nested
	          " .pe-card__actions": [{
	            "&:first-child": {
	              marginTop: -vars$$1.actions_vertical_padding_v + "px"
	            },
	            "&:last-child": {
	              marginBottom: -vars$$1.actions_vertical_padding_v + "px"
	            }
	          }]
	        }
	      }
	    })];
	  },
	  offset_small_padding_v: function offset_small_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__text, .pe-card__primary": {
	        "& + .pe-card__actions:not(:last-child)": {
	          marginTop: -(vars$$1.offset_small_padding_v + 3) + "px"
	        }
	      }
	    })];
	  },
	  text_padding_h: function text_padding_h(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__text": {
	        paddingRight: vars$$1.text_padding_h + "px",
	        paddingLeft: vars$$1.text_padding_h + "px"
	      }
	    })];
	  },
	  text_padding_v: function text_padding_v(selector, vars$$1) {
	    return [sel(selector, {}), text_padding_v_text_line_height_padding_top(selector, vars$$1)];
	  },
	  text_line_height_padding_top: function text_line_height_padding_top(selector, vars$$1) {
	    return [sel(selector, {}), text_padding_v_text_line_height_padding_top(selector, vars$$1)];
	  },
	  text_padding_bottom: function text_padding_bottom(selector, vars$$1) {
	    return [sel(selector, {}), text_padding_bottom_text_line_height_padding_bottom(selector, vars$$1)];
	  },
	  tight_text_padding_bottom: function tight_text_padding_bottom(selector, vars$$1) {
	    return [sel(selector, {}), tight_text_padding_bottom_text_line_height_padding_bottom(selector, vars$$1)];
	  },
	  text_line_height_padding_bottom: function text_line_height_padding_bottom(selector, vars$$1) {
	    return [sel(selector, {}), text_padding_bottom_text_line_height_padding_bottom(selector, vars$$1), tight_text_padding_bottom_text_line_height_padding_bottom(selector, vars$$1)];
	  }
	};
	var layout$5 = createLayout({
	  varFns: varFns$4
	});
	var generalFns$2$1 = {
	  general_styles: function general_styles(selector) {
	    return [];
	  } // eslint-disable-line no-unused-vars

	};

	var tintFns$2$1 = function tintFns(tint) {
	  return _defineProperty$E({}, "color_" + tint + "_overlay_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-card__overlay__content": {
	        backgroundColor: vars$$1["color_" + tint + "_overlay_background"]
	      }
	    })];
	  });
	};

	var lightTintFns$2$1 = _extends$F({}, generalFns$2$1, tintFns$2$1("light"));

	var darkTintFns$2$1 = _extends$F({}, generalFns$2$1, tintFns$2$1("dark"));

	var overlayColor = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$2$1,
	    darkTintFns: darkTintFns$2$1
	  }
	}); // @ts-check

	var padding_v = 24;
	var padding_actions_v = 8;
	var actions_button_margin_v = 2;
	/**
	 * @type {CardVars} cardVars
	 */

	var cardVars = {
	  general_styles: true,
	  actions_button_margin_h: vars.grid_unit,
	  actions_button_margin_v: actions_button_margin_v,
	  actions_padding_h: 8,
	  actions_padding_v: 0,
	  actions_vertical_padding_v: padding_actions_v - actions_button_margin_v,
	  border_radius: vars.unit_block_border_radius,
	  icon_element_width: 72 - 4,
	  image_size_large: 3 * 80,
	  image_size_medium: 2 * 80,
	  image_size_regular: 1.4 * 80,
	  image_size_small: 1 * 80,
	  offset_small_padding_v: padding_v - 16,
	  one_line_height_with_icon: 72,
	  one_line_padding_v: 8,
	  padding_h: 16,
	  subtitle_line_height_padding_bottom: 7,
	  text_line_height_padding_bottom: 7,
	  text_line_height_padding_top: 6,
	  text_padding_bottom: 24,
	  text_padding_h: 16,
	  text_padding_v: 16,
	  tight_text_padding_bottom: 16,
	  tight_title_padding_bottom: 16,
	  title_padding_h: 16,
	  title_padding_v: 24,
	  color_light_main_background: rgba(vars.color_light_background),
	  color_light_title_text: rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  color_light_subtitle_text: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_text: rgba(vars.color_light_foreground, vars.blend_light_text_regular),
	  color_light_actions_border: rgba(vars.color_light_foreground, vars.blend_light_border_light),
	  color_light_overlay_background: rgba(vars.color_light_background, vars.blend_light_overlay_background),
	  color_dark_main_background: rgba(vars.color_dark_background),
	  color_dark_title_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  color_dark_subtitle_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_regular),
	  color_dark_actions_border: rgba(vars.color_dark_foreground, vars.blend_dark_border_light),
	  color_dark_overlay_background: rgba(vars.color_dark_background, vars.blend_dark_overlay_background)
	}; // @ts-check

	var selector$4 = ".".concat(classes$I.component);
	var contentSelector = ".".concat(classes$I.content);
	var overlaySheetSelector = ".".concat(classes$I.overlaySheet);
	var overlayContentSelector = ".".concat(classes$I.overlayContent);
	var baseFns = [layout$5, color$2];
	var overlayColorFns = [overlayColor];
	var contentColorFns = [contentColor];

	var addStyle$5 = function addStyle(customSelector, customVars) {
	  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      _ref$mediaQuery = _ref.mediaQuery,
	      mediaQuery = _ref$mediaQuery === void 0 ? "" : _ref$mediaQuery,
	      _ref$scope = _ref.scope,
	      scope = _ref$scope === void 0 ? "" : _ref$scope;

	  customSelector && styler.addStyle({
	    selectors: [customSelector, selector$4],
	    fns: baseFns,
	    vars: cardVars,
	    customVars: customVars,
	    mediaQuery: mediaQuery,
	    scope: scope
	  });
	  customSelector && styler.addStyle({
	    selectors: [customSelector, " " + overlaySheetSelector],
	    fns: overlayColorFns,
	    vars: cardVars,
	    customVars: customVars,
	    mediaQuery: mediaQuery,
	    scope: scope
	  });
	  customSelector && styler.addStyle({
	    selectors: [customSelector, " " + contentSelector],
	    fns: contentColorFns,
	    vars: cardVars,
	    customVars: customVars,
	    mediaQuery: mediaQuery,
	    scope: scope
	  });
	  customSelector && styler.addStyle({
	    selectors: [customSelector, " " + overlayContentSelector],
	    fns: contentColorFns,
	    vars: cardVars,
	    customVars: customVars,
	    mediaQuery: mediaQuery,
	    scope: scope
	  });
	};

	styler.addStyle({
	  selectors: [selector$4],
	  fns: baseFns,
	  vars: cardVars
	});
	styler.addStyle({
	  selectors: [overlaySheetSelector],
	  fns: overlayColorFns,
	  vars: cardVars
	});
	styler.addStyle({
	  selectors: [contentSelector],
	  fns: contentColorFns,
	  vars: cardVars
	});
	styler.addStyle({
	  selectors: [overlayContentSelector],
	  fns: contentColorFns,
	  vars: cardVars
	});

	var classes$J = {
	  component: "pe-control",
	  // elements
	  formLabel: "pe-control__form-label",
	  input: "pe-control__input",
	  label: "pe-control__label",
	  // states
	  disabled: "pe-control--disabled",
	  inactive: "pe-control--inactive",
	  large: "pe-control--large",
	  medium: "pe-control--medium",
	  off: "pe-control--off",
	  on: "pe-control--on",
	  regular: "pe-control--regular",
	  small: "pe-control--small",
	  // control view elements
	  box: "pe-control__box",
	  button: "pe-control__button",
	  // control view states
	  buttonOff: "pe-control__button--off",
	  buttonOn: "pe-control__button--on"
	};

	function _defineProperty$F(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$G() {
	  _extends$G = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$G.apply(this, arguments);
	}

	var generalFns$3 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-control__box": {
	        " .pe-control__button": {
	          color: "inherit"
	        },
	        " .pe-control__button--on": {
	          color: "inherit"
	        }
	      }
	    })];
	  }
	};

	var tintFns$3 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$F(_ref, "color_" + tint + "_on", function (selector, vars$$1) {
	    return [sel(selector, {
	      color: vars$$1["color_" + tint + "_on"] // override by specifying "color"

	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_off", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-control__button--off": {
	        color: vars$$1["color_" + tint + "_off"]
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_disabled", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--disabled": {
	        " .pe-control__label": {
	          color: vars$$1["color_" + tint + "_disabled"]
	        },
	        " .pe-control__box": {
	          " .pe-control__button--on, .pe-control__button--off": {
	            color: vars$$1["color_" + tint + "_disabled"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-control__label": {
	        color: vars$$1["color_" + tint + "_label"]
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_on_icon", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-control__box": {
	        " .pe-control__button--on": {
	          color: vars$$1["color_" + tint + "_on_icon"]
	        }
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_off_icon", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-control__box": {
	        " .pe-control__button--off": {
	          color: vars$$1["color_" + tint + "_off_icon"]
	        }
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_focus_on", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-button--focus .pe-button__focus": {
	          backgroundColor: vars$$1["color_" + tint + "_focus_on"]
	        }
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_focus_off", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-button--focus .pe-button__focus": {
	          backgroundColor: vars$$1["color_" + tint + "_focus_off"]
	        }
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_focus_on_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-button--focus .pe-button__focus": {
	          opacity: vars$$1["color_" + tint + "_focus_on_opacity"]
	        }
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_focus_off_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-button--focus .pe-button__focus": {
	          opacity: vars$$1["color_" + tint + "_focus_off_opacity"]
	        }
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_on_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-control__label": {
	          color: vars$$1["color_" + tint + "_on_label"]
	        }
	      }
	    })];
	  }), _defineProperty$F(_ref, "color_" + tint + "_off_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-control__label": {
	          color: vars$$1["color_" + tint + "_off_label"]
	        }
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$3 = _extends$G({}, generalFns$3, tintFns$3("light"));

	var darkTintFns$3 = _extends$G({}, generalFns$3, tintFns$3("dark"));

	var color$3 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$3,
	    darkTintFns: darkTintFns$3
	  }
	});

	var alignSide$2 = function alignSide(isRTL) {
	  return function (vars$$1) {
	    return {};
	  };
	}; // eslint-disable-line no-unused-vars


	var alignLeft$2 = alignSide$2(false);
	var alignRight$2 = alignSide$2(true);

	var makeSize = function makeSize(vars$$1, height) {
	  var iconSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : vars.unit_icon_size;
	  var labelSize = iconSize + vars$$1.label_height;
	  var iconOffset = (labelSize - iconSize) / 2;
	  return {
	    " .pe-control__form-label": {
	      height: height + "px"
	    },
	    " .pe-control__box": {
	      width: iconSize + "px",
	      height: iconSize + "px"
	    },
	    " .pe-button__content": {
	      width: labelSize + "px",
	      height: labelSize + "px",
	      flexShrink: 0,
	      " .pe-icon": [mixin.fit(iconOffset)]
	    }
	  };
	};

	var activeButton = function activeButton() {
	  return {
	    opacity: 1,
	    zIndex: 0
	  };
	};

	var inactiveButton = function inactiveButton() {
	  return {
	    opacity: 0,
	    zIndex: -1
	  };
	};

	var button_size_icon_size = function button_size_icon_size(selector, vars$$1, isRTL) {
	  var _peButtonPeContr;

	  return sel(selector, {
	    " .pe-button.pe-control__button": (_peButtonPeContr = {
	      top: -((vars$$1.button_size - vars$$1.icon_size) / 2) + "px"
	    }, _defineProperty$F(_peButtonPeContr, isRTL ? "right" : "left", -((vars$$1.button_size - vars$$1.icon_size) / 2) + "px"), _defineProperty$F(_peButtonPeContr, isRTL ? "left" : "right", "auto"), _peButtonPeContr)
	  });
	};

	var _label_padding_before = function label_padding_before(selector, vars$$1, isRTL) {
	  return sel(selector, {
	    " .pe-control__label": _defineProperty$F({}, isRTL ? "paddingRight" : "paddingLeft", vars$$1.label_padding_before + "px")
	  });
	};

	var _label_padding_after = function label_padding_after(selector, vars$$1, isRTL) {
	  return sel(selector, {
	    " .pe-control__label": _defineProperty$F({}, isRTL ? "paddingLeft" : "paddingRight", vars$$1.label_padding_after + "px")
	  });
	};

	var varFns$5 = {
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, [alignLeft$2(vars$$1), {
	      display: "inline-block",
	      boxSizing: "border-box",
	      margin: 0,
	      padding: 0,
	      " input[type=checkbox], input[type=radio]": {
	        display: "none"
	      },
	      " .pe-control__form-label": [flex$1.layoutHorizontal, flex$1.layoutCenter, {
	        position: "relative",
	        cursor: "pointer",
	        margin: 0,
	        color: "inherit",
	        ":focus": {
	          outline: 0
	        }
	      }],
	      ".pe-control--inactive": {
	        " .pe-control__form-label": {
	          cursor: "default"
	        }
	      },
	      " .pe-control__box": {
	        position: "relative",
	        display: "inline-block",
	        boxSizing: "border-box",
	        color: "inherit",
	        flexShrink: 0,
	        ":focus": {
	          outline: 0
	        }
	      },
	      " .pe-button.pe-control__button": {
	        position: "absolute"
	      },
	      ".pe-control--off": {
	        " .pe-control__button--on": inactiveButton(),
	        " .pe-control__button--off": activeButton()
	      },
	      ".pe-control--on": {
	        " .pe-control__button--on": activeButton(),
	        " .pe-control__button--off": inactiveButton()
	      },
	      " .pe-control__label": {
	        // padding: RTL
	        alignSelf: "center"
	      },
	      ".pe-control--disabled": {
	        " .pe-control__form-label": {
	          cursor: "auto"
	        },
	        " .pe-control__button": {
	          pointerEvents: "none"
	        }
	      },
	      " .pe-button__content": {
	        " .pe-icon": {
	          position: "absolute"
	        }
	      }
	    }, _defineProperty$F({}, "*[dir=rtl] ".concat(selector, ", .pe-rtl ").concat(selector), [alignRight$2(vars$$1)])])];
	  },
	  label_font_size: function label_font_size(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-control__form-label": {
	        fontSize: vars$$1.label_font_size + "px"
	      }
	    })];
	  },
	  label_height: function label_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-control__box": {
	        width: vars$$1.label_height + "px",
	        height: vars$$1.label_height + "px"
	      },
	      ".pe-control--small": makeSize(vars$$1, vars.unit_icon_size_small, vars.unit_icon_size_small),
	      ".pe-control--regular": makeSize(vars$$1, vars$$1.label_height, vars.unit_icon_size),
	      ".pe-control--medium": makeSize(vars$$1, vars.unit_icon_size_medium, vars.unit_icon_size_medium),
	      ".pe-control--large": makeSize(vars$$1, vars.unit_icon_size_large, vars.unit_icon_size_large)
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button.pe-control__button": [mixin.defaultTransition("opacity", vars$$1.animation_duration)],
	      " .pe-control__label": [mixin.defaultTransition("all", vars$$1.animation_duration)]
	    })];
	  },
	  button_size: function button_size(selector, vars$$1) {
	    return [sel(selector, {}), button_size_icon_size(selector, vars$$1, false), button_size_icon_size(selectorRTL(selector), vars$$1, true)];
	  },
	  icon_size: function icon_size(selector, vars$$1) {
	    return [sel(selector, {}), button_size_icon_size(selector, vars$$1, false), button_size_icon_size(selectorRTL(selector), vars$$1, true)];
	  },
	  label_padding_after: function label_padding_after(selector, vars$$1) {
	    return [sel(selector, {}), _label_padding_after(selector, vars$$1, false), _label_padding_after(selectorRTL(selector), vars$$1, true)];
	  },
	  label_padding_before: function label_padding_before(selector, vars$$1) {
	    return [sel(selector, {}), _label_padding_before(selector, vars$$1, false), _label_padding_before(selectorRTL(selector), vars$$1, true)];
	  }
	};
	var layout$6 = createLayout({
	  varFns: varFns$5
	}); // @ts-check

	var vars$1$1 = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_duration: vars.animation_duration,
	  button_size: 6 * vars.grid_unit_component,
	  icon_size: 3 * vars.grid_unit_component,
	  label_font_size: 2 * vars.grid_unit_component,
	  // 16
	  label_height: 3 * vars.grid_unit_component,
	  // 24
	  label_padding_after: 0,
	  label_padding_before: vars.grid_unit * 4,
	  // 16
	  color_light_on: rgba(vars.color_primary),
	  color_light_off: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_label: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_disabled: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  color_light_thumb_off_focus_opacity: .08,
	  color_light_thumb_on_focus_opacity: .11,
	  // icon colors may be set in theme; set to "inherit" by default
	  // color_light_on_icon
	  // color_light_off_icon
	  // label on/off colors may be set in theme; set to color_light_label by default
	  // color_light_on_label
	  // color_light_off_label
	  color_light_focus_on: rgba(vars.color_primary),
	  color_light_focus_on_opacity: .11,
	  color_light_focus_off: rgba(vars.color_light_foreground),
	  color_light_focus_off_opacity: .07,
	  color_dark_on: rgba(vars.color_primary),
	  color_dark_off: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_label: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_disabled: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled),
	  color_dark_thumb_off_focus_opacity: .08,
	  color_dark_thumb_on_focus_opacity: .11,
	  // icon color may be set in theme; set to "inherit" by default
	  // color_dark_on_icon
	  // color_dark_off_icon
	  // label on/off colors may be set in theme; set to color_dark_label by default
	  // color_dark_on_label
	  // color_dark_off_label
	  color_dark_focus_on: rgba(vars.color_primary),
	  // or '#80cbc4'
	  color_dark_focus_on_opacity: .14,
	  color_dark_focus_off: rgba(vars.color_dark_foreground),
	  color_dark_focus_off_opacity: .09
	}; // @ts-check

	var fns$4 = [layout$6, color$3];
	var selector$5 = ".".concat(classes$J.component);
	styler.addStyle({
	  selectors: [selector$5],
	  fns: fns$4,
	  vars: vars$1$1
	});

	var classes$K = {
	  component: "pe-checkbox-control"
	}; // @ts-check

	var color$1$1 = createColor({
	  superColor: color$3
	}); // @ts-check

	var layout$1$1 = createLayout({
	  superLayout: layout$6
	}); // @ts-check

	/**
	 * @typedef {import("../index").CheckboxVars} CheckboxVars
	 */

	/**
	 * @type {CheckboxVars} checkboxVars
	 */

	var checkboxVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true
	}; // @ts-check

	var fns$5 = [layout$1$1, color$1$1];
	var selector$6 = ".".concat(classes$K.component);
	styler.addStyle({
	  selectors: [selector$6],
	  fns: fns$5,
	  vars: checkboxVars
	});

	var classes$L = {
	  component: "pe-dialog-pane",
	  // elements
	  actions: "pe-dialog-pane__actions",
	  body: "pe-dialog-pane__body",
	  content: "pe-dialog-pane__content",
	  footer: "pe-dialog-pane__footer",
	  header: "pe-dialog-pane__header",
	  title: "pe-dialog-pane__title",
	  // states
	  withHeader: "pe-dialog-pane--header",
	  withFooter: "pe-dialog-pane--footer",
	  headerWithTitle: "pe-dialog-pane__header--title",
	  footerWithButtons: "pe-dialog-pane__footer--buttons",
	  footerHigh: "pe-dialog-pane__footer--high",
	  borderBottom: "pe-dialog-pane--border-bottom",
	  borderTop: "pe-dialog-pane--border-top",
	  fullBleed: "pe-dialog-pane--body-full-bleed"
	};

	function _defineProperty$G(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$H() {
	  _extends$H = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$H.apply(this, arguments);
	}

	var generalFns$4 = {
	  general_styles: function general_styles() {
	    return [{
	      " .pe-dialog-pane__body": {
	        borderColor: "transparent"
	      }
	    }];
	  }
	};

	var tintFns$4 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$G(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      backgroundColor: vars$$1["color_" + tint + "_background"]
	    })];
	  }), _defineProperty$G(_ref, "color_" + tint + "_title_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog-pane__header .pe-dialog-pane__title": {
	        color: vars$$1["color_" + tint + "_title_text"]
	      }
	    })];
	  }), _defineProperty$G(_ref, "color_" + tint + "_body_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog-pane__body": {
	        color: vars$$1["color_" + tint + "_body_text"]
	      }
	    })];
	  }), _defineProperty$G(_ref, "color_" + tint + "_body_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-dialog-pane--border-top .pe-dialog-pane__body": {
	        borderTopColor: vars$$1["color_" + tint + "_body_border"]
	      },
	      ".pe-dialog-pane--border-bottom .pe-dialog-pane__body": {
	        borderBottomStyle: "solid",
	        borderBottomColor: vars$$1["color_" + tint + "_body_border"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$4 = _extends$H({}, generalFns$4, tintFns$4("light"));

	var darkTintFns$4 = _extends$H({}, generalFns$4, tintFns$4("dark"));

	var color$4 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$4,
	    darkTintFns: darkTintFns$4
	  }
	});

	var max_width_side_padding_mobile = function max_width_side_padding_mobile(selector, vars$$1) {
	  var _ref3;

	  var maxWidthBreakpointMobile = vars$$1.max_width + 2 * vars$$1.side_padding_mobile;
	  return _ref3 = {}, _defineProperty$G(_ref3, "@media (max-width: " + maxWidthBreakpointMobile + "px)", _defineProperty$G({}, selector, {
	    maxWidth: "calc(100vw - ".concat(2 * vars$$1.side_padding_mobile, "px)")
	  })), _defineProperty$G(_ref3, "@media (min-width: " + (maxWidthBreakpointMobile + 1) + "px)", _defineProperty$G({}, selector, {
	    maxWidth: vars$$1.max_width + "px"
	  })), _ref3;
	};

	var padding_header_bottom = function padding_header_bottom(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-dialog-pane__header--title": {
	      paddingTop: vars$$1.padding - 4 + "px",
	      paddingRight: vars$$1.padding + "px",
	      paddingBottom: vars$$1.header_bottom - 4 + "px",
	      paddingLeft: vars$$1.padding + "px"
	    }
	  });
	};
	/*
	Setting an explicit max-height is needed for IE 11
	*/


	var header_height_footer_height_margin_vertical = function header_height_footer_height_margin_vertical(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-dialog-pane__body": {
	      maxHeight: "calc(100vh - (".concat(vars$$1.header_height, "px + ").concat(vars$$1.footer_height, "px + 2 * ").concat(vars$$1.margin_vertical, "px))")
	    }
	  });
	};
	/**
	 * @param {string} selector 
	 */


	var fullScreen = function fullScreen(selector) {
	  return sel(selector, {
	    " .pe-dialog-pane": {
	      borderRadius: 0
	    },
	    " .pe-dialog-pane__content": {
	      borderRadius: 0,
	      maxWidth: "none",
	      height: "100vh",
	      width: "100vw",
	      " > *": {
	        flexShrink: 0
	      },
	      " > .pe-dialog-pane__body": {
	        flexShrink: 1,
	        maxHeight: "none" // IE 11 doesn't know "initial"

	      }
	    },
	    " .pe-dialog-pane, .pe-dialog-pane__body": {
	      height: "100vh",
	      maxHeight: "100vh",
	      border: "none",
	      maxWidth: "none" // IE 11 doesn't know "initial"

	    }
	  });
	};

	var varFns$6 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [flex$1.layoutVertical, {
	      position: "relative",
	      borderTopLeftRadius: "inherit",
	      borderTopRightRadius: "inherit",
	      borderBottomLeftRadius: "inherit",
	      borderBottomRightRadius: "inherit",
	      margin: 0,
	      " .pe-dialog-pane__content": {
	        width: "100%",
	        display: "flex",
	        flexDirection: "column",
	        borderTopLeftRadius: "inherit",
	        borderTopRightRadius: "inherit",
	        borderBottomLeftRadius: "inherit",
	        borderBottomRightRadius: "inherit"
	      },
	      " .pe-dialog-pane__title": {
	        fontSize: vars.font_size_title + "px",
	        fontWeight: vars.font_weight_medium,
	        "& + div": {
	          marginTop: "16px"
	        }
	      },
	      " .pe-dialog-pane__header, .pe-dialog-pane__content > .pe-toolbar": {
	        borderTopLeftRadius: "inherit",
	        borderTopRightRadius: "inherit",
	        " .pe-dialog-pane__title": {
	          width: "100%",
	          wordBreak: "break-all",
	          overflow: "hidden",
	          textOverflow: "ellipsis",
	          whiteSpace: "nowrap"
	        }
	      },
	      " .pe-dialog-pane__body": [{
	        overflowY: "auto",
	        "-webkit-overflow-scrolling": "touch",
	        " p": {
	          margin: 0
	        },
	        " p + p": {
	          marginTop: "16px"
	        }
	      }],
	      ".pe-dialog-pane--body-full-bleed .pe-dialog-pane__body": {
	        padding: 0,
	        borderStyle: "none"
	      },
	      " .pe-dialog-pane__header--title + .pe-dialog-pane__body": {
	        paddingTop: 0
	      },
	      " .pe-dialog-pane__footer": {
	        display: "flex",
	        flexDirection: "column",
	        flexGrow: 1,
	        justifyContent: "center",
	        "&, > .pe-toolbar": {
	          borderBottomLeftRadius: "inherit",
	          borderBottomRightRadius: "inherit"
	        },
	        ".pe-dialog-pane__footer--high": {
	          // when buttons are stacked vertically
	          paddingBottom: "8px"
	        },
	        ".pe-dialog-pane__footer--buttons": {
	          padding: "0 8px",
	          fontSize: 0 // remove inline block spacing

	        }
	      },
	      " .pe-dialog-pane__actions": [flex$1.layoutHorizontal, flex$1.layoutEndJustified, flex$1.layoutWrap, {
	        alignItems: "center"
	      }],
	      ".pe-dialog-pane--header.pe-dialog-pane--border-top": {
	        " .pe-dialog-pane__body": {
	          borderTopStyle: "solid"
	        }
	      },
	      ".pe-dialog-pane--footer.pe-dialog-pane--border-bottom": {
	        " .pe-dialog-pane__body": {
	          borderBottomStyle: "solid"
	        }
	      }
	    }]), {
	      " .pe-dialog__content.pe-menu__content": _defineProperty$G({}, " ".concat(selector), {
	        " .pe-dialog-pane__body": {
	          padding: 0,
	          border: "none"
	        }
	      })
	    }];
	  },
	  max_width: function max_width(selector, vars$$1) {
	    return [vars$$1.side_padding_mobile !== undefined && max_width_side_padding_mobile(selector, vars$$1)];
	  },
	  side_padding_mobile: function side_padding_mobile(selector, vars$$1) {
	    return [vars$$1.side_padding_mobile !== undefined && max_width_side_padding_mobile(selector, vars$$1)];
	  },
	  min_width: function min_width(selector, vars$$1) {
	    return [sel(selector, {
	      minWidth: vars$$1.min_width + "px"
	    })];
	  },
	  margin_vertical: function margin_vertical(selector, vars$$1) {
	    return [sel(selector, {
	      maxHeight: "calc(100vh - 2 * ".concat(vars$$1.margin_vertical, "px)")
	    }), vars$$1.header_height !== undefined && vars$$1.footer_height !== undefined && header_height_footer_height_margin_vertical(selector, vars$$1)];
	  },
	  line_height_title: function line_height_title(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog-pane__title": {
	        lineHeight: vars$$1.line_height_title + "px"
	      }
	    })];
	  },
	  header_height: function header_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog-pane__header": {
	        height: vars$$1.header_height + "px"
	      }
	    }), vars$$1.footer_height !== undefined && vars$$1.margin_vertical !== undefined && header_height_footer_height_margin_vertical(selector, vars$$1)];
	  },
	  footer_height: function footer_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog-pane__footer--buttons .pe-dialog-pane__actions": {
	        minHeight: vars$$1.footer_height + "px"
	      }
	    }), vars$$1.header_height !== undefined && vars$$1.footer_height !== undefined && vars$$1.margin_vertical !== undefined && header_height_footer_height_margin_vertical(selector, vars$$1)];
	  },
	  padding: function padding(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog-pane__body": {
	        padding: vars$$1.padding + "px"
	      },
	      ".pe-dialog-pane--footer": {
	        " .pe-dialog-pane__body": {
	          paddingBottom: vars$$1.padding - 10 + "px"
	        }
	      }
	    }), vars$$1.header_bottom !== undefined && padding_header_bottom(selector, vars$$1)];
	  },
	  header_bottom: function header_bottom(selector, vars$$1) {
	    return [padding_header_bottom(selector, vars$$1)];
	  },
	  border_width: function border_width(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-dialog-pane--header": {
	        " .pe-dialog-pane__body": {
	          // borderTopStyle set in color.js
	          borderWidth: vars$$1.border_width + "px"
	        }
	      },
	      ".pe-dialog-pane--footer": {
	        " .pe-dialog-pane__body": {
	          // borderBottomStyle set in color.js
	          borderWidth: vars$$1.border_width + "px"
	        }
	      }
	    })];
	  }
	};
	var layout$7 = createLayout({
	  varFns: varFns$6
	}); // @ts-check

	/**
	 * @type {DialogPaneVars} dialogPaneVars
	 */

	var dialogPaneVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  border_width: 1,
	  footer_height: 52,
	  header_bottom: 20,
	  header_height: 64,
	  line_height_title: 24,
	  max_width: 7 * vars.grid_unit_menu,
	  // 7 * 56 = 392 
	  min_width: 5 * vars.grid_unit_menu,
	  // 5 * 56 = 280
	  padding: 3 * vars.grid_unit_component,
	  // 3 * 8 = 24
	  side_padding_mobile: 6 * vars.grid_unit,
	  // 6 * 4 = 48
	  max_height: 8 * vars.grid_unit_component,
	  margin_vertical: 8 * vars.grid_unit_component,
	  color_light_title_text: "inherit",
	  color_light_body_text: "inherit",
	  color_light_body_border: rgba(vars.color_light_foreground, vars.blend_light_border_light),
	  color_light_background: "inherit",
	  color_dark_title_text: "inherit",
	  color_dark_body_text: "inherit",
	  color_dark_body_border: rgba(vars.color_dark_foreground, vars.blend_dark_border_light),
	  color_dark_background: "inherit"
	}; // @ts-check

	var fns$6 = [layout$7, color$4];
	var selector$7 = ".".concat(classes$L.component);
	styler.addStyle({
	  selectors: [selector$7],
	  fns: fns$6,
	  vars: dialogPaneVars
	});

	var listTileClasses$5 = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};
	var menuClasses$2 = {
	  component: "pe-menu",
	  // elements
	  panel: "pe-menu__panel",
	  content: "pe-menu__content",
	  placeholder: "pe-menu__placeholder",
	  backdrop: "pe-menu__backdrop",
	  // states
	  floating: "pe-menu--floating",
	  origin: "pe-menu--origin",
	  permanent: "pe-menu--permanent",
	  showBackdrop: "pe-menu--backdrop",
	  visible: "pe-menu--visible",
	  width_auto: "pe-menu--width-auto",
	  width_n: "pe-menu--width-",
	  isTopMenu: "pe-menu--top-menu",
	  // lookup
	  listTile: listTileClasses$5.component,
	  selectedListTile: listTileClasses$5.selected
	};
	var classes$M = {
	  component: "pe-dialog",
	  // elements
	  placeholder: "pe-dialog__placeholder",
	  holder: "pe-dialog__holder",
	  content: "pe-dialog__content",
	  backdrop: "pe-dialog__backdrop",
	  touch: "pe-dialog__touch",
	  // states
	  fullScreen: "pe-dialog--full-screen",
	  modal: "pe-dialog--modal",
	  open: "pe-dialog--open",
	  // class set to html element
	  visible: "pe-dialog--visible",
	  // class set to dialog element
	  showBackdrop: "pe-dialog--backdrop",
	  transition: "pe-dialog--transition",
	  // lookup
	  menuContent: menuClasses$2.content
	};

	function _defineProperty$H(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$I() {
	  _extends$I = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$I.apply(this, arguments);
	}

	function _objectSpread$w(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$H(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var generalFns$5 = {
	  general_styles: function general_styles(selector) {
	    return [];
	  } // eslint-disable-line no-unused-vars

	};

	var tintFns$5 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$H(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog__content": {
	        backgroundColor: vars$$1["color_" + tint + "_background"]
	      }
	    })];
	  }), _defineProperty$H(_ref, "color_" + tint + "_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog__content": {
	        color: vars$$1["color_" + tint + "_text"]
	      }
	    })];
	  }), _defineProperty$H(_ref, "color_" + tint + "_backdrop_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog__backdrop": {
	        backgroundColor: vars$$1["color_" + tint + "_backdrop_background"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$5 = _extends$I({}, generalFns$5, tintFns$5("light"));

	var darkTintFns$5 = _extends$I({}, generalFns$5, tintFns$5("dark"));

	var color$5 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$5,
	    darkTintFns: darkTintFns$5
	  }
	});
	var behaviorVars = {
	  full_screen: false,
	  modal: false
	};

	var themeVars$2 = _extends$I({}, {
	  backdrop: false,
	  z_index: vars.z_dialog
	}, behaviorVars, sharedVars);
	/**
	 * @type {DialogVars} dialogVars
	 */


	var dialogVars = _objectSpread$w({
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_delay: "0s",
	  animation_duration: ".220s",
	  animation_hide_css: "opacity: 0;",
	  animation_show_css: "opacity: 1;",
	  animation_timing_function: "ease-in-out",
	  border_radius: vars.unit_block_border_radius,
	  position: "fixed",
	  // color vars
	  color_light_backdrop_background: "rgba(0, 0, 0, .4)",
	  color_dark_backdrop_background: "rgba(0, 0, 0, .5)",
	  color_light_background: rgba(vars.color_light_background),
	  color_dark_background: rgba(vars.color_dark_background),
	  color_light_text: rgba(vars.color_light_foreground, vars.blend_light_text_regular),
	  color_dark_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_regular)
	}, themeVars$2);

	var minWidth = "320px";
	/**
	 * @param {string} selector 
	 * @param {object} vars 
	 */

	var _backdrop = function backdrop(selector, vars$$1) {
	  return (// eslint-disable-line no-unused-vars
	    sel(selector, {
	      ".pe-dialog--visible .pe-dialog__backdrop": {
	        display: "block",
	        opacity: 1
	      }
	    })
	  );
	};

	var fullScreen$1 = function fullScreen$$1(selector, vars$$1) {
	  return sel(selector, [createMarker(vars$$1, behaviorVars), {
	    padding: 0,
	    " .pe-dialog__content": {
	      width: "100%" // for IE 11

	    }
	  }, fullScreen(selector, vars$$1)]);
	};

	var _modal = function modal(selector, vars$$1) {
	  return sel(selector, [createMarker(vars$$1, behaviorVars)]);
	};

	var varFns$7 = _objectSpread$w({
	  /**
	   * @param {string} selector
	   * @param {object} vars 
	   */
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, [flex$1.layoutCenterCenter, {
	      top: 0,
	      left: 0,
	      right: 0,
	      bottom: 0,
	      zIndex: vars$$1.z_index,
	      height: "100%",
	      // 100vh would make the dialog go beneath Mobile Safari toolbar        
	      transitionProperty: "opacity,background-color,transform",
	      ".pe-dialog--full-screen": fullScreen$1(selector, vars$$1),
	      ".pe-dialog--modal": _modal(selector, vars$$1),
	      " .pe-dialog__content": {
	        position: "relative",
	        transitionProperty: "all"
	      },
	      " .pe-dialog__backdrop": [mixin.defaultTransition("all"), // animation duration is set in component options
	      {
	        position: "absolute",
	        opacity: 0,
	        top: 0,
	        left: 0,
	        right: 0,
	        bottom: 0,
	        pointerEvents: "none"
	      }],
	      ".pe-dialog--backdrop": _backdrop(selector, vars$$1)
	    }]), {
	      ".pe-dialog__holder": {
	        height: "100%",
	        minWidth: minWidth
	      }
	    }];
	  },
	  animation_hide_css: function animation_hide_css(selector, vars$$1) {
	    return [sel(selector, [vars$$1.animation_hide_css])];
	  },
	  position: function position(selector, vars$$1) {
	    return [sel(selector, {
	      position: vars$$1.position
	    })];
	  },
	  animation_delay: function animation_delay(selector, vars$$1) {
	    return [sel(selector, {
	      "&, .pe-dialog__content": {
	        transitionDelay: vars$$1.animation_delay
	      }
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      "&, .pe-dialog__content": {
	        transitionDuration: vars$$1.animation_duration
	      }
	    })];
	  },
	  animation_timing_function: function animation_timing_function(selector, vars$$1) {
	    return [sel(selector, {
	      "&, .pe-dialog__content": {
	        transitionTimingFunction: vars$$1.animation_timing_function
	      }
	    })];
	  },
	  animation_show_css: function animation_show_css(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-dialog--visible": vars$$1.animation_show_css
	    })];
	  },
	  border_radius: function border_radius(selector, vars$$1) {
	    return [!vars$$1.full_screen && sel(selector, {
	      " .pe-dialog__content": {
	        borderTopLeftRadius: vars$$1.border_radius + "px",
	        borderTopRightRadius: vars$$1.border_radius + "px",
	        borderBottomLeftRadius: vars$$1.border_radius + "px",
	        borderBottomRightRadius: vars$$1.border_radius + "px"
	      }
	    })];
	  },
	  // Theme vars
	  backdrop: function backdrop(selector, vars$$1) {
	    return vars$$1.backdrop && _backdrop(selector, vars$$1);
	  },
	  full_screen: function full_screen(selector, vars$$1) {
	    return vars$$1.full_screen && fullScreen$1(selector, vars$$1);
	  },
	  modal: function modal(selector, vars$$1) {
	    return vars$$1.modal && _modal(selector, vars$$1);
	  }
	}, sharedVarFns);

	var layout$8 = createLayout({
	  varFns: varFns$7
	}); // @ts-check

	var fns$7 = [layout$8, color$5];
	var selector$8 = ".".concat(classes$M.component);
	styler.addStyle({
	  selectors: [selector$8],
	  fns: fns$7,
	  vars: dialogVars
	});

	var classes$N = {
	  component: "pe-dialog pe-drawer",
	  // states
	  cover: "pe-drawer--cover",
	  push: "pe-drawer--push",
	  mini: "pe-drawer--mini",
	  permanent: "pe-drawer--permanent",
	  border: "pe-drawer--border",
	  floating: "pe-drawer--floating",
	  fixed: "pe-drawer--fixed",
	  anchorEnd: "pe-drawer--anchor-end"
	};

	function _defineProperty$I(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$J() {
	  _extends$J = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$J.apply(this, arguments);
	}

	function _objectSpread$x(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$I(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var generalFns$6 = {
	  general_styles: function general_styles() {
	    return [{
	      " .pe-dialog__content": {
	        background: "none"
	      }
	    }];
	  }
	};

	var tintFns$6 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$I(_ref, "color_" + tint + "_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog__content": {
	        borderColor: vars$$1["color_" + tint + "_border"]
	      }
	    })];
	  }), _defineProperty$I(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog-pane": {
	        backgroundColor: vars$$1["color_" + tint + "_background"]
	      }
	    })];
	  }), _defineProperty$I(_ref, "color_" + tint + "_backdrop_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-dialog__backdrop": {
	        backgroundColor: vars$$1["color_" + tint + "_backdrop_background"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$6 = _extends$J({}, generalFns$6, tintFns$6("light"));

	var darkTintFns$6 = _extends$J({}, generalFns$6, tintFns$6("dark"));

	var color$6 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$6,
	    darkTintFns: darkTintFns$6
	  }
	});
	var SHADOW_WIDTH = 15;

	var _border$2 = function _border(selector, vars$$1, isRTL) {
	  return sel(selector, {
	    " .pe-dialog__content": {
	      borderWidth: "".concat(vars$$1.border ? 1 : 0, "px"),
	      borderStyle: isRTL ? "none none none solid" : "none solid none none"
	    }
	  });
	};

	var _border2 = function border(selector, vars$$1) {
	  return [_border$2(selector, vars$$1, false), _border$2(selectorRTL(selector), vars$$1, true)];
	};

	var alignSide$3 = function alignSide(isRTL) {
	  return function (selector, vars$$1) {
	    var _peDrawerFixed;

	    return [{
	      // Fixed
	      ".pe-drawer--fixed": (_peDrawerFixed = {}, _defineProperty$I(_peDrawerFixed, isRTL ? "right" : "left", 0), _defineProperty$I(_peDrawerFixed, isRTL ? "left" : "right", "auto"), _peDrawerFixed)
	    }, _border$2("".concat(selector, ".pe-drawer--border"), _extends$J({}, vars$$1, {
	      border: true
	    }), isRTL)];
	  };
	};

	var alignLeft$3 = alignSide$3(false);
	var alignRight$3 = alignSide$3(true);

	var _backdrop$1 = function backdrop(selector) {
	  return sel(selector, {
	    ".pe-dialog--visible .pe-dialog__backdrop": {
	      opacity: 1
	    }
	  });
	};

	var selectorAnchorEnd = function selectorAnchorEnd(selector) {
	  return "".concat(selector, ".pe-drawer--anchor-end");
	}; // fn: miniSelector contains .pe-drawer--mini


	var _content_width_mini_collapsed = function content_width_mini_collapsed(miniSelector, vars$$1) {
	  return sel(miniSelector, {
	    ":not(.pe-dialog--visible) .pe-dialog__content": {
	      width: "".concat(vars$$1.content_width_mini_collapsed, "px")
	    }
	  });
	}; // fn: coverSelector contains .pe-drawer--cover


	var _cover_content_max_width = function _cover_content_max_width(coverSelector, vars$$1, isRTL) {
	  var _peDialog__content, _peDialogVisible;

	  return sel(coverSelector, {
	    " .pe-dialog__content": (_peDialog__content = {
	      maxWidth: "".concat(vars$$1.content_max_width, "px")
	    }, _defineProperty$I(_peDialog__content, isRTL ? "right" : "left", "".concat(-vars$$1.content_max_width - SHADOW_WIDTH, "px")), _defineProperty$I(_peDialog__content, isRTL ? "left" : "right", "auto"), _peDialog__content),
	    ".pe-dialog--visible .pe-dialog__content": (_peDialogVisible = {}, _defineProperty$I(_peDialogVisible, isRTL ? "right" : "left", 0), _defineProperty$I(_peDialogVisible, isRTL ? "left" : "right", "auto"), _peDialogVisible)
	  });
	};

	var cover_content_max_width = function cover_content_max_width(coverSelector, vars$$1) {
	  return [_cover_content_max_width(coverSelector, vars$$1, false), _cover_content_max_width(selectorRTL(coverSelector), vars$$1, true), _cover_content_max_width(selectorAnchorEnd(coverSelector), vars$$1, true), _cover_content_max_width(selectorAnchorEnd(selectorRTL(coverSelector)), vars$$1, false)];
	}; // fn: selector contains .pe-drawer--permanent


	var _content_width = function content_width(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-dialog__content": {
	      width: "".concat(vars$$1.content_width, "px")
	    }
	  });
	}; // fn: pushSelector contains .pe-drawer--push


	var _push_content_width = function _push_content_width(pushSelector, vars$$1, isRTL) {
	  var _peDialog__content2, _peDialogVisible2;

	  return sel(pushSelector, {
	    " .pe-dialog__content": (_peDialog__content2 = {}, _defineProperty$I(_peDialog__content2, isRTL ? "marginRight" : "marginLeft", "".concat(-vars$$1.content_width - SHADOW_WIDTH, "px")), _defineProperty$I(_peDialog__content2, isRTL ? "marginLeft" : "marginRight", "auto"), _peDialog__content2),
	    ".pe-dialog--visible .pe-dialog__content": (_peDialogVisible2 = {
	      width: "".concat(vars$$1.content_width, "px")
	    }, _defineProperty$I(_peDialogVisible2, isRTL ? "marginRight" : "marginLeft", 0), _defineProperty$I(_peDialogVisible2, isRTL ? "marginLeft" : "marginRight", "auto"), _peDialogVisible2)
	  });
	};

	var push_content_width = function push_content_width(pushSelector, vars$$1) {
	  return [_push_content_width(pushSelector, vars$$1, false), _push_content_width(selectorRTL(pushSelector), vars$$1, true), _push_content_width(selectorAnchorEnd(pushSelector), vars$$1, true), _push_content_width(selectorAnchorEnd(selectorRTL(pushSelector)), vars$$1, false)];
	};

	var _cover = function cover(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-dialog__content": {
	      position: "absolute",
	      top: 0,
	      zIndex: vars$$1.z_index
	    },
	    ".pe-dialog--visible": {
	      " .pe-dialog__touch": {
	        display: "block"
	      }
	    }
	  });
	};
	/**
	 * @param {string} miniSelector 
	 * @param {object} [vars] 
	 */


	var _mini = function mini(miniSelector, vars$$1) {
	  return (// eslint-disable-line no-unused-vars
	    sel(miniSelector, {
	      " .pe-dialog__content": {
	        marginLeft: 0,
	        marginRight: 0
	      }
	    })
	  );
	};
	/**
	 * @param {string} permanentSelector 
	 * @param {object} [vars] 
	 */


	var _permanent = function permanent(permanentSelector, vars$$1) {
	  return (// eslint-disable-line no-unused-vars
	    sel(permanentSelector, {
	      position: "static",
	      display: "block",
	      padding: 0,
	      overflow: "initial",
	      " .pe-dialog__content": {
	        overflow: "visible",
	        maxHeight: "initial",
	        marginLeft: 0,
	        marginRight: 0
	      }
	    })
	  );
	};
	/**
	 * @param {string} pushSelector 
	 * @param {object} [vars] 
	 */
	// fn: pushSelector contains .pe-drawer--push


	var _push = function push(pushSelector, vars$$1) {
	  return (// eslint-disable-line no-unused-vars
	    sel(pushSelector, {
	      position: "static"
	    })
	  );
	};
	/**
	 * @param {string} selector 
	 * @param {object} [vars] 
	 */


	var borderRadius = function borderRadius(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-dialog__content": {
	      borderRadius: vars$$1.border_radius + "px"
	    }
	  });
	};
	/**
	 * @param {string} selector 
	 * @param {object} [vars] 
	 */


	var _floating = function floating(selector, vars$$1) {
	  return (// eslint-disable-line no-unused-vars
	    sel(selector, {
	      height: "auto",
	      " .pe-dialog__content": {
	        height: "auto"
	      }
	    })
	  );
	};

	var varFns$8 = _objectSpread$x({
	  /**
	   * @param {string} selector 
	   * @param {object} [vars] 
	   */
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, [alignLeft$3(selector, vars$$1), {
	      justifyContent: "flex-start",
	      position: "absolute",
	      top: 0,
	      left: 0,
	      right: 0,
	      bottom: 0,
	      zIndex: 1,
	      height: "100%",
	      minWidth: 0,
	      // IE 11 does not accept "none" or "inital" here
	      padding: 0,
	      opacity: 1,
	      flexShrink: 0,
	      transitionProperty: "all",
	      ":not(.pe-dialog--transition)": {
	        " .pe-dialog__content": {
	          transitionDuration: "0s"
	        }
	      },
	      " .pe-dialog__content": {
	        position: "relative",
	        // transitionProperty: "all",
	        height: "100%",
	        overflow: "visible",
	        minWidth: 0,
	        // IE 11 does not accept "none" or "inital" here
	        flexShrink: 0
	      },
	      " .pe-dialog-pane__content": {
	        height: "100%",
	        overflowY: "auto",
	        overflowX: "hidden"
	      },
	      " .pe-dialog-pane": {
	        height: "100%",
	        maxHeight: "none",
	        minWidth: 0 // IE 11 does not accept "none" or "inital" here

	      },
	      " .pe-dialog-pane__body": {
	        overflow: "visible",
	        maxHeight: "none",
	        border: "none"
	      },
	      // Fixed
	      ".pe-drawer--fixed": {
	        position: "fixed",
	        top: 0,
	        width: "100%",
	        zIndex: vars.z_drawer
	      },
	      // Mini
	      ".pe-drawer--mini": _mini(selector, vars$$1),
	      // Permanent
	      ".pe-drawer--permanent": _permanent(selector, vars$$1),
	      // Floating
	      ".pe-drawer--floating": _floating(selector, vars$$1),
	      // Cover (default)
	      ".pe-drawer--cover": _cover(selector, vars$$1),
	      // Push
	      ".pe-drawer--push": _push(selector, vars$$1),
	      // Backdrop
	      " .pe-dialog__backdrop": {
	        pointerEvents: "none",
	        opacity: 0,
	        display: "block"
	      },
	      " .pe-dialog__touch": {
	        display: "none",
	        position: "absolute",
	        top: 0,
	        left: 0,
	        right: 0,
	        bottom: 0
	      },
	      ".pe-dialog--backdrop": _backdrop$1(selector)
	    }]), [sel(selectorRTL(selector), alignRight$3(selector, vars$$1))]];
	  },
	  animation_delay: function animation_delay(selector, vars$$1) {
	    return [sel(selector, {
	      "&, .pe-dialog__content, .pe-dialog__backdrop": {
	        transitionDelay: vars$$1.animation_delay
	      }
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      "&, .pe-dialog__content, .pe-dialog__backdrop": {
	        transitionDuration: vars$$1.animation_duration
	      }
	    })];
	  },
	  animation_timing_function: function animation_timing_function(selector, vars$$1) {
	    return [sel(selector, {
	      "&, .pe-dialog__content, .pe-dialog__backdrop": {
	        transitionTimingFunction: vars$$1.animation_timing_function
	      }
	    })];
	  },
	  border_radius: function border_radius(selector, vars$$1) {
	    return [borderRadius(selector, vars$$1)];
	  },
	  content_max_width: function content_max_width(selector, vars$$1) {
	    return [cover_content_max_width("".concat(selector, ".pe-drawer--cover"), vars$$1)];
	  },
	  content_width: function content_width(selector, vars$$1) {
	    return [_content_width(selector, vars$$1), _content_width("".concat(selector, ".pe-dialog--visible"), vars$$1), _content_width("".concat(selector, ".pe-drawer--permanent"), vars$$1), push_content_width("".concat(selector, ".pe-drawer--push"), vars$$1)];
	  },
	  content_width_mini_collapsed: function content_width_mini_collapsed(selector, vars$$1) {
	    return [_content_width_mini_collapsed("".concat(selector, ".pe-drawer--mini"), vars$$1)];
	  },
	  // Theme vars
	  cover: function cover(selector, vars$$1) {
	    return vars$$1.cover && [_cover(selector, vars$$1), cover_content_max_width(selector, vars$$1)];
	  },
	  backdrop: function backdrop(selector, vars$$1) {
	    return [vars$$1.backdrop && _backdrop$1(selector)];
	  },
	  border: function border(selector, vars$$1) {
	    return [_border2(selector, vars$$1)];
	  },
	  mini: function mini(selector, vars$$1) {
	    return vars$$1.mini && [_mini(selector, vars$$1), _content_width_mini_collapsed(selector, vars$$1)];
	  },
	  permanent: function permanent(selector, vars$$1) {
	    return [vars$$1.permanent && _permanent(selector, vars$$1)];
	  },
	  floating: function floating(selector, vars$$1) {
	    return [vars$$1.floating && _floating(selector, vars$$1)];
	  },
	  push: function push(selector, vars$$1) {
	    return vars$$1.push && [_push(selector, vars$$1), push_content_width(selector, vars$$1)];
	  }
	}, sharedVarFns);

	var layout$9 = createLayout({
	  varFns: varFns$8
	});

	var themeVars$3 = _objectSpread$x({
	  backdrop: false,
	  border: undefined,
	  // set to `true` or `false`
	  cover: false,
	  floating: false,
	  mini: false,
	  permanent: false,
	  push: false,
	  z_index: vars.z_drawer
	}, sharedVars);
	/**
	 * @type {DrawerVars} drawerVars
	 */


	var drawerVars = _objectSpread$x({
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_delay: "0s",
	  animation_duration: ".260s",
	  animation_timing_function: "ease-in-out",
	  border_radius: 0,
	  content_max_width: 5 * vars.increment,
	  // 5 * 56
	  content_width: 240,
	  content_width_mini_collapsed: vars.increment,
	  // 1 * 56
	  // color vars
	  color_light_backdrop_background: "rgba(0, 0, 0, .4)",
	  color_dark_backdrop_background: "rgba(0, 0, 0, .5)",
	  color_light_background: rgba(vars.color_light_background),
	  color_dark_background: rgba(vars.color_dark_background),
	  color_light_border: rgba(vars.color_light_foreground, vars.blend_light_border_light),
	  color_dark_border: rgba(vars.color_dark_foreground, vars.blend_dark_border_light)
	}, themeVars$3); // @ts-check


	var fns$8 = [layout$9, color$6];
	var selector$9 = ".".concat(classes$N.component.replace(/ /g, "."));
	styler.addStyle({
	  selectors: [selector$9],
	  fns: fns$8,
	  vars: drawerVars
	});

	var classes$O = {
	  component: "pe-fab",
	  // elements
	  content: "pe-fab__content",
	  // states
	  mini: "pe-fab--mini"
	};

	function _defineProperty$J(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$K() {
	  _extends$K = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$K.apply(this, arguments);
	}

	var generalFns$7 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      ".pe-button--focus": {
	        " .pe-button__focus": {
	          opacity: 1
	        }
	      }
	    })];
	  }
	};

	var tintFns$7 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$J(_ref, "color_" + tint, function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        color: vars$$1["color_" + tint]
	      }
	    })];
	  }), _defineProperty$J(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        backgroundColor: vars$$1["color_" + tint + "_background"]
	      }
	    })];
	  }), _defineProperty$J(_ref, "color_" + tint + "_focus_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--focus": {
	        " .pe-button__focus": {
	          backgroundColor: vars$$1["color_" + tint + "_focus_background"]
	        }
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$7 = _extends$K({}, generalFns$7, tintFns$7("light"));

	var darkTintFns$7 = _extends$K({}, generalFns$7, tintFns$7("dark"));

	var color$7 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$7,
	    darkTintFns: darkTintFns$7
	  }
	}); // @ts-check

	var varFns$9 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      userSelect: "none",
	      "-moz-user-select": "none",
	      display: "inline-block",
	      position: "relative",
	      outline: "none",
	      cursor: "pointer",
	      padding: 0,
	      border: "none",
	      " .pe-button__content": {
	        position: "relative",
	        borderRadius: "50%"
	      },
	      " .pe-fab__content": {
	        display: "flex",
	        width: "100%",
	        height: "100%",
	        alignItems: "center",
	        justifyContent: "center"
	      },
	      " .pe-button__wash, .pe-button__focus": [mixin.fit(), {
	        borderRadius: "inherit"
	      }],
	      " .pe-ripple": {
	        borderRadius: "inherit"
	      },
	      " .pe-button__wash": {
	        transition: "background-color " + vars.animation_duration + " ease-in-out",
	        borderRadius: "inherit",
	        pointerEvents: "none",
	        backgroundColor: "transparent"
	      }
	    })];
	  },
	  size_regular: function size_regular(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        width: vars$$1.size_regular + "px",
	        height: vars$$1.size_regular + "px"
	      }
	    })];
	  },
	  size_mini: function size_mini(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-fab--mini": {
	        " .pe-button__content": {
	          width: vars$$1.size_mini + "px",
	          height: vars$$1.size_mini + "px",
	          padding: (vars$$1.size_mini - vars.unit_icon_size) / 2 + "px"
	        }
	      }
	    })];
	  }
	};
	var layout$a = createLayout({
	  varFns: varFns$9
	}); // @ts-check

	/**
	 * @type {DrawerVars} drawerVars
	 */

	var drawerVars$1 = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  size_mini: 5 * vars.grid_unit_component,
	  // 5 * 8 = 40
	  size_regular: 7 * vars.grid_unit_component,
	  // 7 * 8 = 56
	  color_light: rgba(vars.color_primary_foreground),
	  color_light_focus_background: rgba(vars.color_light_foreground, vars.blend_light_background_hover),
	  color_light_focus_opacity: vars.blend_light_background_hover_medium,
	  // same as button
	  color_light_background: rgba(vars.color_primary),
	  color_dark: rgba(vars.color_primary_foreground),
	  color_dark_focus_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_hover),
	  // same as button
	  color_dark_focus_opacity: vars.blend_dark_background_hover_medium,
	  // same as button
	  color_dark_background: rgba(vars.color_primary)
	}; // @ts-check

	var fns$9 = [layout$a, color$7];
	var selector$a = ".".concat(classes$O.component);
	styler.addStyle({
	  selectors: [selector$a],
	  fns: fns$9,
	  vars: drawerVars$1
	});

	var classes$P = {
	  component: "pe-icon",
	  // states
	  avatar: "pe-icon--avatar",
	  large: "pe-icon--large",
	  medium: "pe-icon--medium",
	  regular: "pe-icon--regular",
	  small: "pe-icon--small"
	};

	function _defineProperty$K(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$L() {
	  _extends$L = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$L.apply(this, arguments);
	}

	var generalFns$8 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      color: "currentColor"
	    })];
	  }
	};

	var tintFns$8 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$K(_ref, "color_" + tint, function (selector, vars$$1) {
	    return [sel(selector, {
	      color: vars$$1["color_" + tint]
	    })];
	  }), _defineProperty$K(_ref, "color_" + tint + "_avatar_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-icon--avatar": {
	        backgroundColor: vars$$1["color_" + tint + "_avatar_background"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$8 = _extends$L({}, generalFns$8, tintFns$8("light"));

	var darkTintFns$8 = _extends$L({}, generalFns$8, tintFns$8("dark"));

	var color$8 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$8,
	    darkTintFns: darkTintFns$8
	  }
	});

	var sizeDirective = function sizeDirective(size) {
	  return function (selector, vars$$1) {
	    return sel(selector, _defineProperty$K({}, ".pe-icon--".concat(size), {
	      width: vars$$1["size_".concat(size)] + "px",
	      height: vars$$1["size_".concat(size)] + "px"
	    }));
	  };
	};

	var varFns$a = _extends$L({}, {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      display: "inline-block",
	      verticalAlign: "middle",
	      backgroundRepeat: "no-repeat",
	      position: "relative",
	      fontSize: 0,
	      lineHeight: 0,
	      ".pe-icon--avatar": {
	        borderRadius: "50%"
	      },
	      ".pe-icon--avatar img": {
	        border: "none",
	        borderRadius: "50%",
	        width: "inherit",
	        height: "inherit"
	      },
	      " img": {
	        height: "inherit"
	      },
	      " .pe-svg, .pe-svg > div": {
	        /* React creates an additional div when wrapping an SVG */
	        width: "inherit",
	        height: "inherit"
	      }
	    })];
	  }
	}, ["small", "regular", "medium", "large"].reduce(function (acc, size) {
	  return acc["size_".concat(size)] = sizeDirective(size), acc;
	}, {}));

	var layout$b = createLayout({
	  varFns: varFns$a
	}); // @ts-check

	/**
	 * @type {IconVars} iconVars
	 */

	var iconVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  size_small: vars.unit_icon_size_small,
	  // 16 
	  size_regular: vars.unit_icon_size,
	  // 24
	  size_medium: vars.unit_icon_size_medium,
	  // 32
	  size_large: vars.unit_icon_size_large,
	  // 40
	  // avatar background is visible when image is not yet loaded
	  color_light_avatar_background: rgba(vars.color_light_foreground, vars.blend_light_background_disabled),
	  color_dark_avatar_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_disabled),
	  color_light: "currentcolor",
	  color_dark: "currentcolor"
	}; // @ts-check

	var fns$a = [layout$b, color$8];
	var selector$b = ".".concat(classes$P.component);
	styler.addStyle({
	  selectors: [selector$b],
	  fns: fns$a,
	  vars: iconVars
	});

	var classes$Q = {
	  component: "pe-button pe-icon-button",
	  // elements
	  content: "pe-icon-button__content",
	  label: "pe-icon-button__label",
	  // states
	  compact: "pe-icon-button--compact"
	};

	function _defineProperty$L(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$M() {
	  _extends$M = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$M.apply(this, arguments);
	}

	var generalFns$9 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      ".pe-button--focus, &.pe-button--selected": {
	        " .pe-button__focus": {
	          backgroundColor: "currentcolor"
	        }
	      }
	    })];
	  }
	};

	var tintFns$9 = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$L(_ref, "color_" + tint, function (selector, vars$$1) {
	    return [sel(selector, {
	      "&, .pe-icon-button__label": {
	        color: vars$$1["color_" + tint]
	      }
	    })];
	  }), _defineProperty$L(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__content": {
	        backgroundColor: vars$$1["color_" + tint + "_background"]
	      }
	    })];
	  }), _defineProperty$L(_ref, "color_" + tint + "_wash_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      opacity: vars$$1["color_" + tint + "_wash_opacity"]
	    })];
	  }), _defineProperty$L(_ref, "color_" + tint + "_focus_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--focus, &.pe-button--selected": {
	        " .pe-button__focus": {
	          opacity: vars$$1["color_" + tint + "_focus_opacity"]
	        }
	      }
	    })];
	  }), _defineProperty$L(_ref, "color_" + tint + "_disabled", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--disabled": {
	        " .pe-button__content, .pe-icon-button__label": {
	          color: vars$$1["color_" + tint + "_disabled"]
	        }
	      }
	    })];
	  }), _ref;
	};

	var hoverTintFns$1 = function hoverTintFns(tint) {
	  var _ref2;

	  return _ref2 = {}, _defineProperty$L(_ref2, "color_" + tint + "_hover", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__content": {
	        color: vars$$1["color_" + tint + "_hover"]
	      }
	    })];
	  }), _defineProperty$L(_ref2, "color_" + tint + "_label_hover", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__label": {
	        color: vars$$1["color_" + tint + "_label_hover"]
	      }
	    })];
	  }), _defineProperty$L(_ref2, "color_" + tint + "_background_hover", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__content": {
	        backgroundColor: vars$$1["color_" + tint + "_background_hover"]
	      }
	    })];
	  }), _defineProperty$L(_ref2, "color_" + tint + "_wash_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--disabled):not(.pe-button--selected)": {
	        " .pe-button__wash": {
	          backgroundColor: vars$$1["color_" + tint + "_wash_background"]
	        }
	      }
	    })];
	  }), _ref2;
	};

	var lightTintFns$9 = _extends$M({}, generalFns$9, tintFns$9("light"));

	var darkTintFns$9 = _extends$M({}, generalFns$9, tintFns$9("dark"));

	var lightTintHoverFns$1 = hoverTintFns$1("light");
	var darkTintHoverFns$1 = hoverTintFns$1("dark");
	var color$9 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$9,
	    darkTintFns: darkTintFns$9,
	    lightTintHoverFns: lightTintHoverFns$1,
	    darkTintHoverFns: darkTintHoverFns$1
	  }
	});

	var alignSide$4 = function alignSide(isRTL) {
	  return function (vars$$1) {
	    return {};
	  };
	}; // eslint-disable-line no-unused-vars


	var alignLeft$4 = alignSide$4(false);
	var alignRight$4 = alignSide$4(true);

	var _label_padding_before$1 = function label_padding_before(selector, vars$$1, isRTL) {
	  return sel(selector, {
	    " .pe-icon-button__label": _defineProperty$L({}, isRTL ? "paddingRight" : "paddingLeft", vars$$1.label_padding_before + "px")
	  });
	};

	var _label_padding_after$1 = function label_padding_after(selector, vars$$1, isRTL) {
	  return sel(selector, {
	    " .pe-icon-button__label": _defineProperty$L({}, isRTL ? "paddingLeft" : "paddingRight", vars$$1.label_padding_after + "px")
	  });
	};

	var varFns$b = {
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, [alignLeft$4(vars$$1), {
	      // don't set button size to facilitate different icon sizes
	      display: "inline-flex",
	      alignItems: "center",
	      cursor: "pointer",
	      border: "none",
	      " .pe-button__content": {
	        display: "flex",
	        alignItems: "center",
	        fontSize: "1rem",
	        borderRadius: "50%",
	        position: "relative"
	      },
	      " .pe-icon-button__content": {
	        lineHeight: 1,
	        borderRadius: "50%",
	        pointerEvents: "none"
	      }
	    }, _defineProperty$L({}, "*[dir=rtl] ".concat(selector, ", .pe-rtl ").concat(selector), [alignRight$4(vars$$1)])])];
	  },
	  padding: function padding(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__content": {
	        padding: vars$$1.padding + "px"
	      }
	    })];
	  },
	  padding_compact: function padding_compact(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-icon-button--compact": {
	        " .pe-icon-button__content": {
	          padding: vars$$1.padding_compact + "px"
	        }
	      }
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content, .pe-button__wash": [mixin.defaultTransition("all", vars$$1.animation_duration)]
	    })];
	  },
	  label_font_size: function label_font_size(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__label": {
	        fontSize: vars$$1.label_font_size + "px"
	      }
	    })];
	  },
	  label_line_height: function label_line_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__label": {
	        lineHeight: vars$$1.label_line_height + "px"
	      }
	    })];
	  },
	  label_font_weight: function label_font_weight(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__label": {
	        fontWeight: vars$$1.label_font_weight
	      }
	    })];
	  },
	  label_text_transform: function label_text_transform(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon-button__label": {
	        textTransform: vars$$1.label_text_transform
	      }
	    })];
	  },
	  label_padding_after: function label_padding_after(selector, vars$$1) {
	    return [sel(selector, {}), _label_padding_after$1(selector, vars$$1, false), _label_padding_after$1(selectorRTL(selector), vars$$1, true)];
	  },
	  label_padding_before: function label_padding_before(selector, vars$$1) {
	    return [sel(selector, {}), _label_padding_before$1(selector, vars$$1, false), _label_padding_before$1(selectorRTL(selector), vars$$1, true)];
	  }
	};
	var layout$c = createLayout({
	  varFns: varFns$b
	}); // @ts-check

	/**
	 * @type {IconButtonVars} iconButtonVars
	 */

	var iconButtonVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_duration: vars.animation_duration,
	  label_font_size: 16,
	  label_font_weight: 400,
	  label_line_height: 20,
	  label_padding_after: 0,
	  label_padding_before: vars.grid_unit * 1,
	  // 4
	  label_text_transform: "initial",
	  label_top_margin_factor: 1 / 12,
	  // align with icon
	  padding: (vars.grid_unit_icon_button - vars.unit_icon_size) / 2,
	  // 12
	  padding_compact: (vars.grid_unit_icon_button - vars.unit_icon_size) / 3,
	  // 8
	  color_background: "transparent",
	  // only specify this variable to get all 2 states
	  // theme specific background colors may be set in theme; disabled by default
	  // color_light_background:    "none",
	  // color_dark_background:     "none",
	  // color_light_hover:         "inherit",
	  // color_dark_hover:          "inherit",
	  // color_light_label_hover:   "inherit",
	  // color_dark_label_hover:    "inherit",
	  color_light: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_label: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_disabled: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  color_light_focus_opacity: vars.blend_light_background_hover_medium,
	  color_light_wash_background: rgba(vars.color_light_foreground, vars.blend_light_background_hover),
	  color_dark: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_label: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_disabled: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled),
	  color_dark_focus_opacity: vars.blend_dark_background_hover_medium,
	  color_dark_wash_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_hover) // hover colors may be set in theme; disabled by default
	  // color_light_background_hover:         "currentColor",
	  // color_dark_background_hover:          "currentColor",

	}; // @ts-check

	var fns$b = [layout$c, color$9];
	var selector$c = ".".concat(classes$Q.component.replace(/ /g, "."));
	styler.addStyle({
	  selectors: [selector$c],
	  fns: fns$b,
	  vars: iconButtonVars
	});

	var classes$R = {
	  component: "pe-ios-spinner",
	  // elements
	  blades: "pe-ios-spinner__blades",
	  blade: "pe-ios-spinner__blade"
	};

	function _defineProperty$M(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$N() {
	  _extends$N = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$N.apply(this, arguments);
	}

	var generalFns$a = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-ios-spinner__blade": {
	        background: "currentcolor"
	      }
	    })];
	  }
	};

	var tintFns$a = function tintFns(tint) {
	  return _defineProperty$M({}, "color_" + tint, function (selector, vars$$1) {
	    return [sel(selector, {
	      color: vars$$1["color_" + tint]
	    })];
	  });
	};

	var lightTintFns$a = _extends$N({}, generalFns$a, tintFns$a("light"));

	var darkTintFns$a = _extends$N({}, generalFns$a, tintFns$a("dark"));

	var color$1$2 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$a,
	    darkTintFns: darkTintFns$a
	  },
	  superColor: color
	});
	var bladeWidth = 9; // percent

	var bladeHeight = 28; // percent

	var kfFade = function kfFade() {
	  return {
	    " 0%": {
	      opacity: .640
	    },
	    " 100%": {
	      opacity: .035
	    }
	  };
	};

	var positionBlades = function positionBlades(vars$$1) {
	  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) {
	    // reverse to improve performance on iOS
	    var delay = -1 / 12 * i * styleDurationToMs(vars$$1.rotation_animation_duration);
	    var rotation = 360 - 360 / 12 * i;
	    return _defineProperty$M({}, " .pe-ios-spinner__blade:nth-of-type(" + (i + 1) + ")", {
	      transform: "rotate(" + rotation + "deg) translate3d(0,-140%,0)",
	      animation: "iosSpinnerFade " + vars$$1.rotation_animation_duration + " " + delay + "ms linear infinite"
	    });
	  });
	};

	var varFns$c = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-ios-spinner__blades": {
	        transform: "translate3d(0,0,0)",
	        position: "relative",
	        width: "100%",
	        height: "100%"
	      },
	      " .pe-ios-spinner__blade": {
	        position: "absolute",
	        width: bladeWidth + "%",
	        height: bladeHeight + "%",
	        left: (100 - bladeWidth) / 2 + "%",
	        top: (100 - bladeHeight) / 2 + "%",
	        opacity: 0,
	        borderRadius: "50px"
	      },
	      "@keyframes iosSpinnerFade": kfFade()
	    })];
	  },
	  rotation_animation_duration: function rotation_animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-ios-spinner__blades": [positionBlades(vars$$1)]
	    })];
	  }
	};
	var layout$1$2 = createLayout({
	  varFns: varFns$c,
	  superLayout: layout$1
	}); // @ts-check

	/**
	 * @type {IOSSpinnerVars} iOSSpinnerVars
	 */

	var iOSSpinnerVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  rotation_animation_duration: "1s",
	  color_light: rgba(vars.color_light_foreground),
	  color_dark: rgba(vars.color_dark_foreground)
	}; // @ts-check

	var fns$c = [layout$1$2, color$1$2];
	var selector$d = ".".concat(classes$R.component);
	styler.addStyle({
	  selectors: [selector$d],
	  fns: fns$c,
	  vars: iOSSpinnerVars
	});

	var listTileClasses$6 = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};
	var classes$S = {
	  component: "pe-list",
	  // states
	  border: "pe-list--border",
	  compact: "pe-list--compact",
	  hasHeader: "pe-list--header",
	  indentedBorder: "pe-list--indented-border",
	  padding: "pe-list--padding",
	  paddingTop: "pe-list--padding-top",
	  paddingBottom: "pe-list--padding-bottom",
	  // lookup
	  header: listTileClasses$6.header
	};

	function _defineProperty$N(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$O() {
	  _extends$O = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$O.apply(this, arguments);
	}

	var generalFns$b = {
	  general_styles: function general_styles() {
	    return [];
	  }
	};

	var tintFns$b = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$N(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      backgroundColor: vars$$1["color_" + tint + "_background"]
	    })];
	  }), _defineProperty$N(_ref, "color_" + tint + "_border", function (selector, vars$$1) {
	    var _sel;

	    return [sel(selector, (_sel = {}, _defineProperty$N(_sel, "& + .pe-list", {
	      borderTopColor: vars$$1["color_" + tint + "_border"]
	    }), _defineProperty$N(_sel, ".pe-list--border", {
	      " .pe-list-tile": {
	        ":not(:last-child)": {
	          borderColor: vars$$1["color_" + tint + "_border"]
	        }
	      }
	    }), _defineProperty$N(_sel, ".pe-list--indented-border", {
	      " .pe-list-tile": {
	        " .pe-list-tile__content:not(.pe-list-tile__content-front)": {
	          borderColor: vars$$1["color_" + tint + "_border"]
	        }
	      }
	    }), _sel))];
	  }), _ref;
	};

	var lightTintFns$b = _extends$O({}, generalFns$b, tintFns$b("light"));

	var darkTintFns$b = _extends$O({}, generalFns$b, tintFns$b("dark"));

	var color$a = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$b,
	    darkTintFns: darkTintFns$b
	  }
	}); // @ts-check

	var borderStyle = function borderStyle(vars$$1) {
	  return {
	    borderStyle: "none none solid none",
	    borderWidth: vars$$1.border_width_bordered + "px"
	  };
	};

	var varFns$d = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      flexGrow: 1,
	      ".pe-list--header": {
	        paddingTop: 0
	      },
	      ".pe-list--indented-border": {
	        borderTop: "none"
	      }
	    })];
	  },
	  padding: function padding(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list--padding": {
	        padding: vars$$1.padding + "px 0"
	      },
	      ".pe-list--padding-top": {
	        paddingTop: vars$$1.padding + "px"
	      },
	      ".pe-list--padding-bottom": {
	        paddingBottom: vars$$1.padding + "px"
	      }
	    })];
	  },
	  padding_compact: function padding_compact(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list--compact": {
	        padding: vars$$1.padding_compact + "px 0"
	      }
	    })];
	  },
	  border_width_stacked: function border_width_stacked(selector, vars$$1) {
	    return [sel(selector, {
	      "& + &": {
	        borderStyle: "solid none none none",
	        borderWidth: vars$$1.border_width_stacked + "px"
	      }
	    })];
	  },
	  border_width_bordered: function border_width_bordered(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list--border": {
	        " .pe-list-tile": {
	          ":not(.pe-list-tile--header):not(:last-child)": {
	            "&": borderStyle(vars$$1)
	          }
	        }
	      },
	      ".pe-list--indented-border": {
	        " .pe-list-tile": {
	          ":not(.pe-list-tile--header):not(:last-child)": {
	            " .pe-list-tile__content:not(.pe-list-tile__content-front)": borderStyle(vars$$1)
	          }
	        }
	      }
	    })];
	  }
	};
	var layout$d = createLayout({
	  varFns: varFns$d
	}); // @ts-check

	/**
	 * @type {ListVars} listVars
	 */

	var listVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  border_width_bordered: 1,
	  border_width_stacked: 1,
	  padding: vars.grid_unit_component,
	  // vertical padding
	  padding_compact: vars.grid_unit_component * 3 / 4,
	  color_light_border: rgba(vars.color_light_foreground, vars.blend_light_border_light),
	  color_dark_border: rgba(vars.color_dark_foreground, vars.blend_dark_border_light) // background color may be set in theme; disabled by default
	  // color_light_background: "inherit",
	  // color_dark_background:  "inherit"

	}; // @ts-check

	var fns$d = [layout$d, color$a];
	var selector$e = ".".concat(classes$S.component);
	styler.addStyle({
	  selectors: [selector$e],
	  fns: fns$d,
	  vars: listVars
	});

	var classes$T = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};

	function _defineProperty$O(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$P() {
	  _extends$P = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$P.apply(this, arguments);
	}

	function _objectSpread$y(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$O(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var _selected = function selected(selector, vars$$1, tint) {
	  var selectedTextColor = vars$$1["color_" + tint + "_selected_text"];
	  return sel(selector, _objectSpread$y({}, selectedTextColor !== "inherit" ? {
	    "&, .pe-list-tile__title, .pe-list-tile__content, .pe-list-tile__subtitle": {
	      color: selectedTextColor
	    }
	  } : undefined, {
	    " .pe-list-tile__primary, pe-list-tile__secondary": {
	      backgroundColor: vars$$1["color_" + tint + "_selected_background"]
	    }
	  }));
	};

	var generalFns$c = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      ".pe-list-tile--header": {
	        " .pe-list-tile__primary, pe-list-tile__secondary": {
	          backgroundColor: "inherit"
	        }
	      },
	      ":not(.pe-list-tile--disabled):not(.pe-list-tile--selected)": {
	        " a.pe-list-tile__primary:focus, a.pe-list-tile__secondary:focus": {
	          outline: "none",
	          backgroundColor: "inherit"
	        }
	      },
	      "&.pe-list-tile--sticky": {
	        backgroundColor: "inherit"
	      }
	    })];
	  }
	};

	var tintFns$c = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$O(_ref, "color_" + tint + "_title", function (selector, vars$$1) {
	    return [sel(selector, {
	      color: vars$$1["color_" + tint + "_title"]
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      backgroundColor: vars$$1["color_" + tint + "_background"],
	      "&.pe-list-tile--sticky": {
	        backgroundColor: vars$$1["color_" + tint + "_background"]
	      }
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_list_header", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--header": {
	        color: vars$$1["color_" + tint + "_list_header"]
	      }
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_subtitle", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-list-tile__subtitle": {
	        color: vars$$1["color_" + tint + "_subtitle"]
	      }
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_secondary", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-list-tile__secondary": {
	        color: vars$$1["color_" + tint + "_secondary"]
	      }
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_front", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-list-tile__content-front": {
	        color: vars$$1["color_" + tint + "_front"]
	      }
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_text_disabled", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--disabled": {
	        "&, .pe-list-tile__title, .pe-list-tile__content, .pe-list-tile__subtitle": {
	          color: vars$$1["color_" + tint + "_text_disabled"]
	        }
	      }
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_highlight_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--highlight:not(.pe-list-tile--selected)": {
	        " .pe-list-tile__primary, pe-list-tile__secondary": {
	          backgroundColor: vars$$1["color_" + tint + "_highlight_background"]
	        }
	      }
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_focus_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-list-tile--disabled):not(.pe-list-tile--selected)": {
	        " a.pe-list-tile__primary:focus, a.pe-list-tile__secondary:focus": {
	          backgroundColor: vars$$1["color_" + tint + "_focus_background"]
	        }
	      }
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_selected_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--selected": _selected(selector, vars$$1, tint)
	    })];
	  }), _defineProperty$O(_ref, "color_" + tint + "_selected_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--selected": _selected(selector, vars$$1, tint)
	    })];
	  }), _ref;
	};

	var hoverTintFns$2 = function hoverTintFns(tint) {
	  var _ref2;

	  return _ref2 = {}, _defineProperty$O(_ref2, "color_" + tint + "_hover", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--hoverable:not(.pe-list-tile--selected)": {
	        color: vars$$1["color_" + tint + "_hover"]
	      }
	    })];
	  }), _defineProperty$O(_ref2, "color_" + tint + "_hover_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--hoverable:not(.pe-list-tile--selected)": {
	        " .pe-list-tile__primary, .pe-list-tile__secondary": {
	          backgroundColor: vars$$1["color_" + tint + "_hover_background"]
	        }
	      }
	    })];
	  }), _defineProperty$O(_ref2, "color_" + tint + "_hover_front", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--hoverable:not(.pe-list-tile--selected)": {
	        " .pe-list-tile__primary .pe-list-tile__content-front": {
	          color: vars$$1["color_" + tint + "_hover_front"]
	        }
	      }
	    })];
	  }), _ref2;
	};

	var themeFns = function themeFns(tint) {
	  return {
	    selected: function selected(selector, vars$$1) {
	      return vars$$1.selected && _selected(selector, vars$$1, tint);
	    }
	  };
	};

	var lightTintFns$c = _extends$P({}, generalFns$c, tintFns$c("light"), themeFns("light"));

	var darkTintFns$c = _extends$P({}, generalFns$c, tintFns$c("dark"), themeFns("dark"));

	var lightTintHoverFns$2 = hoverTintFns$2("light");
	var darkTintHoverFns$2 = hoverTintFns$2("dark");
	var color$b = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$c,
	    darkTintFns: darkTintFns$c,
	    lightTintHoverFns: lightTintHoverFns$2,
	    darkTintHoverFns: darkTintHoverFns$2
	  }
	});

	var alignSide$5 = function alignSide(isRTL) {
	  return function (vars$$1) {
	    return {
	      // eslint-disable-line no-unused-vars
	      " .pe-list-tile__content-front + .pe-list-tile__content": _defineProperty$O({}, isRTL ? "paddingRight" : "paddingLeft", 0)
	    };
	  };
	}; // eslint-disable-line no-unused-vars


	var alignLeft$5 = alignSide$5(false);
	var alignRight$5 = alignSide$5(true);
	/**
	 * @param {number} left
	 * @param {number} [right]
	 */

	var paddingH = function paddingH(left) {
	  var right = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : left;
	  return {
	    "padding-left": left + "px",
	    "padding-right": right + "px"
	  };
	};
	/**
	 * @param {number} top 
	 * @param {number} [bottom] 
	 */


	var paddingV = function paddingV(top) {
	  var bottom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : top;
	  return {
	    "padding-top": top + "px",
	    "padding-bottom": bottom + "px"
	  };
	};
	/**
	 * @param {string} selector 
	 * @param {ListTileVars} vars 
	 */


	var title_line_count_single_line_height = function title_line_count_single_line_height(selector, vars$$1) {
	  return sel(selector, {
	    lineHeight: vars$$1.single_line_height + "px",
	    ".pe-list-tile--navigation": {
	      " .pe-list-tile__title": {
	        minHeight: vars$$1.single_line_height + "px"
	      }
	    },
	    " .pe-list-tile__title": [mixin.ellipsis(vars$$1.title_line_count, vars$$1.single_line_height, "px")]
	  });
	};
	/**
	 * @param {string} selector 
	 * @param {ListTileVars} vars 
	 */


	var unSelectable = function unSelectable(selector, vars$$1) {
	  return (// eslint-disable-line no-unused-vars 
	    sel(selector, {
	      "&, a": {
	        pointerEvents: "none"
	      }
	    })
	  );
	};
	/**
	 * @param {string} selector 
	 * @param {ListTileVars} vars 
	 */


	var _inset = function inset(selector, vars$$1) {
	  return insetH(selector, vars$$1), insetV(selector, vars$$1);
	};
	/**
	 * @param {string} selector 
	 * @param {ListTileVars} vars 
	 */


	var insetH = function insetH(selector, vars$$1) {
	  var margin = vars$$1.inset_h_size;
	  return sel(selector, {
	    marginLeft: margin + "px",
	    marginRight: margin + "px",
	    " .pe-list-tile__content": {
	      marginLeft: -margin + "px",
	      marginRight: -margin + "px"
	    }
	  });
	};
	/**
	 * @param {string} selector 
	 * @param {ListTileVars} vars 
	 */


	var insetV = function insetV(selector, vars$$1) {
	  var margin = vars$$1.inset_v_size;
	  return sel(selector, {
	    marginTop: margin + "px",
	    marginBottom: margin + "px"
	  });
	};
	/**
	 * @param {string} selector 
	 * @param {ListTileVars} vars 
	 */


	var _rounded = function rounded(selector, vars$$1) {
	  return sel(selector, {
	    "&, .pe-list-tile__primary": {
	      borderRadius: vars$$1.rounded_border_radius + "px"
	    }
	  });
	};

	var varFns$e = {
	  /**
	   * @param {string} selector 
	   * @param {ListTileVars} vars 
	   */
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, [alignLeft$5(vars$$1), flex$1.layout, {
	      position: "relative",
	      ".pe-list-tile--navigation": {
	        " .pe-list-tile__title": {
	          whiteSpace: "pre-wrap"
	        }
	      },
	      ".pe-list-tile--sticky": mixin.sticky(2),
	      ".pe-list-tile--inset-h": insetH(selector, vars$$1),
	      ".pe-list-tile--inset-v": insetV(selector, vars$$1),
	      " .pe-list-tile__primary": {
	        width: "100%"
	      },
	      " .pe-list-tile__primary, .pe-list-tile__secondary": [flex$1.layoutHorizontal, mixin.defaultTransition("background", ".200s"), {
	        textDecoration: "none",
	        color: "inherit",
	        border: "none"
	      }],
	      ":not(.pe-list-tile--header) .pe-list-tile__primary": [flex$1.flex(), {
	        position: "relative",
	        " .pe-list-tile__content:not(.pe-list-tile__content-front)": [flex$1.flex()]
	      }],
	      ":not(.pe-list-tile--disabled)": {
	        outline: "none"
	      },
	      " .pe-list-tile__secondary": {
	        textAlign: "right",
	        position: "relative"
	      },
	      " .pe-list-tile__content": [flex$1.layoutVertical, flex$1.selfCenter, {
	        width: "100%",
	        ".pe-list-tile__content-front": {
	          flexShrink: 0
	        }
	      }],
	      " .pe-list-tile__title": {
	        whiteSpace: "normal"
	      },
	      " .pe-list-tile__subtitle": [mixin.ellipsis(vars$$1.subtitle_line_count, vars$$1.line_height_subtitle, "px"), {
	        fontSize: vars$$1.font_size_subtitle + "px",
	        fontWeight: vars$$1.font_weight_subtitle,
	        lineHeight: vars$$1.line_height_subtitle + "px",
	        ".pe-list-tile__high-subtitle": [mixin.ellipsis(vars$$1.high_subtitle_line_count, vars$$1.line_height_subtitle, "px"), {
	          whiteSpace: "normal"
	        }]
	      }],
	      ".pe-list-tile--selected, &.pe-list-tile--disabled": unSelectable(selector, vars$$1),
	      ".pe-list-tile--subtitle": {
	        " .pe-list-tile__content": {
	          " .pe-list-tile__title": {
	            padding: 0
	          }
	        }
	      },
	      ".pe-list-tile--high-subtitle": {
	        " .pe-list-tile--high-subtitle .pe-list-tile__secondary": [flex$1.layoutHorizontal, flex$1.layoutStart],
	        " .pe-list-tile__content": [flex$1.selfStart, {
	          " .pe-list-tile__title": {
	            padding: 0
	          }
	        }]
	      },
	      // List header
	      ".pe-list-tile--header": {
	        pointerEvents: "none",
	        " .pe-list-tile__content": {
	          paddingTop: 0,
	          paddingBottom: 0
	        },
	        " .pe-list-tile__title": {
	          padding: 0
	        }
	      },
	      // Firefox only
	      "@supports (-moz-appearance:none) and (display:contents)": {
	        " .pe-list-tile__primary, .pe-list-tile__content": {
	          overflow: "hidden"
	        }
	      },
	      // Menu
	      ".pe-dialog .pe-menu__content &": {
	        " .pe-list-tile__content": {
	          paddingLeft: "24px",
	          paddingRight: "24px"
	        },
	        " .pe-list-tile__content-front": {
	          paddingRight: 0,
	          width: "64px",
	          marginRight: "-7px"
	        },
	        " .pe-list-tile__title": mixin.ellipsis("none")
	      },
	      ".pe-menu__content &": {
	        ":not(.pe-list-tile--disabled)": {
	          cursor: "default",
	          "&, .pe-list-tile__primary, .pe-list-tile__secondary": {
	            " .pe-list-tile__title, .pe-list-tile__subtitle": {
	              userSelect: "none",
	              "-moz-user-select": "none"
	            }
	          }
	        }
	      },
	      // Non-touch
	      "html.pe-no-touch &.pe-list-tile--hoverable, \
        html.pe-no-touch &.pe-list-tile--selectable": {
	        ":not(.pe-list-tile--header):not(.pe-list-tile--disabled):not(.pe-list-tile--selected):hover": {
	          cursor: "pointer"
	        }
	      }
	    }]), _defineProperty$O({}, selectorRTL(selector), alignRight$5(vars$$1))];
	  },
	  title_line_count: function title_line_count(selector, vars$$1) {
	    return [title_line_count_single_line_height(selector, vars$$1)];
	  },
	  single_line_height: function single_line_height(selector, vars$$1) {
	    return [title_line_count_single_line_height(selector, vars$$1)];
	  },
	  font_size_title: function font_size_title(selector, vars$$1) {
	    return [sel(selector, {
	      fontSize: vars$$1.font_size_title + "px",
	      " .pe-list-tile__secondary": {
	        fontSize: vars$$1.font_size_title + "px"
	      }
	    })];
	  },
	  font_weight_title: function font_weight_title(selector, vars$$1) {
	    return [sel(selector, {
	      fontWeight: vars$$1.font_weight_title
	    })];
	  },
	  font_size_navigation_title: function font_size_navigation_title(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--navigation": {
	        fontSize: vars$$1.font_size_navigation_title + "px"
	      }
	    })];
	  },
	  font_weight_navigation_title: function font_weight_navigation_title(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--navigation": {
	        fontWeight: vars$$1.font_weight_navigation_title
	      }
	    })];
	  },
	  padding: function padding(selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-list-tile--header)": {
	        " .pe-list-tile__content:not(.pe-list-tile__content-front)": [paddingV(vars$$1.padding, vars$$1.padding + 1)]
	      },
	      " .pe-list-tile__content": {
	        ".pe-list-tile__content-front": [paddingV(vars$$1.padding - 5)]
	      }
	    })];
	  },
	  side_padding: function side_padding(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-list-tile__content": [paddingH(vars$$1.side_padding)]
	    })];
	  },
	  inset_size: function inset_size(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--inset": _inset(selector, vars$$1)
	    })];
	  },
	  rounded_border_radius: function rounded_border_radius(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--rounded": _rounded(selector, vars$$1)
	    })];
	  },
	  compact_front_item_width: function compact_front_item_width(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-list-tile__content-front": {
	        ".pe-list-tile--compact-front": {
	          width: vars$$1.compact_front_item_width + "px"
	        }
	      }
	    })];
	  },
	  front_item_width: function front_item_width(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-list-tile__content-front": {
	        ":not(.pe-list-tile--compact-front)": {
	          width: vars$$1.front_item_width + "px"
	        }
	      }
	    })];
	  },
	  font_size_small: function font_size_small(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-list-tile__content": {
	        " small": {
	          fontSize: vars$$1.font_size_small + "px"
	        }
	      }
	    })];
	  },
	  has_high_subtitle_padding: function has_high_subtitle_padding(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--high-subtitle": {
	        " .pe-list-tile__content": [paddingV(vars$$1.has_high_subtitle_padding, vars$$1.has_high_subtitle_padding + 1)]
	      }
	    })];
	  },
	  has_subtitle_padding: function has_subtitle_padding(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--subtitle": {
	        " .pe-list-tile__content": [paddingV(vars$$1.has_subtitle_padding, vars$$1.has_subtitle_padding + 1)]
	      }
	    })];
	  },
	  single_height: function single_height(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--header": {
	        height: vars$$1.single_height + "px",
	        " .pe-list-tile__title": [mixin.ellipsis(1, vars$$1.single_height, "px"), {
	          lineHeight: vars$$1.single_height + "px",
	          padding: 0
	        }]
	      }
	    })];
	  },
	  font_size_list_header: function font_size_list_header(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--header": {
	        " .pe-list-tile__title": {
	          fontSize: vars$$1.font_size_list_header + "px"
	        }
	      }
	    })];
	  },
	  font_weight_list_header: function font_weight_list_header(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-list-tile--header": {
	        " .pe-list-tile__title": {
	          fontWeight: vars$$1.font_weight_list_header
	        }
	      }
	    })];
	  },
	  compact_padding: function compact_padding(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-list--compact &, &.pe-list-tile--compact": {
	        ":not(.pe-list-tile--header)": {
	          " .pe-list-tile__content:not(.pe-list-tile__content-front)": paddingV(vars$$1.compact_padding, vars$$1.compact_padding + 1)
	        }
	      }
	    })];
	  },
	  // Theme vars
	  inset: function inset(selector, vars$$1) {
	    return vars$$1.inset && _inset(selector, vars$$1);
	  },
	  inset_h: function inset_h(selector, vars$$1) {
	    return vars$$1.inset_h && insetH(selector, vars$$1);
	  },
	  inset_v: function inset_v(selector, vars$$1) {
	    return vars$$1.inset_h && insetV(selector, vars$$1);
	  },
	  rounded: function rounded(selector, vars$$1) {
	    return vars$$1.rounded && _rounded(selector, vars$$1);
	  },
	  selected: function selected(selector, vars$$1) {
	    return vars$$1.selected && unSelectable(selector, vars$$1);
	  }
	};
	var layout$e = createLayout({
	  varFns: varFns$e
	}); //
	// heights:
	// single line: 48
	// single line, dense: 40
	// single line, with icon: 48
	// single line, with icon, dense: 40
	// single line, with avatar: 56
	// single line, with avatar, dense: 48
	// two-line: 72
	// two-line, dense: 60
	// three-line: 88
	// three-line, dense: 76

	var single_height = 48;
	var padding = 8;
	var single_with_icon_height = 56;
	var themeVars$4 = {
	  inset: false,
	  inset_h: false,
	  inset_v: false,
	  selected: false,
	  rounded: false
	};
	/**
	 * @type {ListTileVars} listTileVars
	 */

	var listTileVars = _objectSpread$y({
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  compact_front_item_width: 64,
	  compact_padding: 9,
	  compact_side_padding: 1 * vars.grid_unit_component,
	  font_size_list_header: 14,
	  font_size_navigation_title: 14,
	  font_size_small: 12,
	  font_size_subtitle: 14,
	  font_size_title: 16,
	  font_weight_list_header: vars.font_weight_medium,
	  font_weight_navigation_title: vars.font_weight_medium,
	  font_weight_subtitle: vars.font_weight_normal,
	  font_weight_title: vars.font_weight_normal,
	  front_item_width: 72,
	  has_high_subtitle_padding: 13,
	  has_subtitle_padding: 15,
	  high_subtitle_line_count: 2,
	  inset_h_size: 1 * vars.grid_unit_component,
	  // 8
	  inset_v_size: 1 * vars.grid_unit_component,
	  // 8
	  line_height_subtitle: 20,
	  padding: 13,
	  rounded_border_radius: vars.unit_item_border_radius,
	  side_padding: 2 * vars.grid_unit_component,
	  // 16
	  single_height: single_height,
	  single_line_height: single_height - 2 * padding - (2 * 5 + 1),
	  single_with_icon_height: single_with_icon_height,
	  single_with_icon_line_height: single_with_icon_height - 2 * padding - (2 * 5 + 1),
	  subtitle_line_count: 1,
	  title_line_count: 1,
	  color_light_title: rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  color_light_subtitle: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_info: rgba(vars.color_light_foreground, vars.blend_light_text_tertiary),
	  color_light_front: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_text_disabled: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  color_light_list_header: rgba(vars.color_light_foreground, vars.blend_light_text_tertiary),
	  color_light_secondary: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_hover: rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  color_light_hover_front: rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  color_light_hover_background: rgba(vars.color_light_foreground, vars.blend_light_background_hover),
	  color_light_focus_background: rgba(vars.color_light_foreground, vars.blend_light_background_hover),
	  color_light_selected_text: "inherit",
	  color_light_selected_background: rgba(vars.color_light_foreground, vars.blend_light_background_hover),
	  color_light_highlight_background: rgba(vars.color_light_foreground, vars.blend_light_background_hover),
	  // background color may be set in theme; disabled by default
	  // color_light_background:          "inherit",
	  color_dark_title: rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  color_dark_subtitle: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_info: rgba(vars.color_dark_foreground, vars.blend_dark_text_tertiary),
	  color_dark_front: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_text_disabled: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled),
	  color_dark_list_header: rgba(vars.color_dark_foreground, vars.blend_dark_text_tertiary),
	  color_dark_secondary: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_hover: rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  color_dark_hover_front: rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  color_dark_hover_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_hover),
	  color_dark_selected_text: "inherit",
	  color_dark_selected_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_hover),
	  color_dark_highlight_background: rgba(vars.color_dark_foreground, vars.blend_dark_background_hover)
	}, themeVars$4); // @ts-check


	var fns$e = [layout$e, color$b];
	var selector$f = ".".concat(classes$T.component);
	styler.addStyle({
	  selectors: [selector$f],
	  fns: fns$e,
	  vars: listTileVars
	});

	var classes$U = {
	  component: "pe-md-spinner",
	  // elements
	  animation: "pe-md-spinner__animation",
	  circle: "pe-md-spinner__circle",
	  circleClipper: "pe-md-spinner__circle-clipper",
	  circleClipperLeft: "pe-md-spinner__circle-clipper-left",
	  circleClipperRight: "pe-md-spinner__circle-clipper-right",
	  gapPatch: "pe-md-spinner__gap-patch",
	  layer: "pe-md-spinner__layer",
	  layerN: "pe-md-spinner__layer-"
	};

	function _defineProperty$P(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$Q() {
	  _extends$Q = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$Q.apply(this, arguments);
	}
	/*
	Styling derived from https://github.com/PolymerElements/paper-spinner

	@license
	Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
	This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
	The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
	The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
	Code distributed by Google as part of the polymer project is also
	subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
	*/


	var generalFns$d = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-md-spinner__layer": {
	        borderColor: "currentcolor"
	      }
	    })];
	  }
	};

	var tintFns$d = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$P(_ref, "color_" + tint + "_single", function (selector, vars$$1) {
	    return [sel(selector, {
	      color: vars$$1["color_" + tint + "_single"]
	    })];
	  }), _defineProperty$P(_ref, "color_" + tint + "_1", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-spinner--single-color)": {
	        " .pe-md-spinner__layer-1": {
	          borderColor: vars$$1["color_" + tint + "_1"]
	        }
	      }
	    })];
	  }), _defineProperty$P(_ref, "color_" + tint + "_2", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-spinner--single-color)": {
	        " .pe-md-spinner__layer-2": {
	          borderColor: vars$$1["color_" + tint + "_2"]
	        }
	      }
	    })];
	  }), _defineProperty$P(_ref, "color_" + tint + "_3", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-spinner--single-color)": {
	        " .pe-md-spinner__layer-3": {
	          borderColor: vars$$1["color_" + tint + "_3"]
	        }
	      }
	    })];
	  }), _defineProperty$P(_ref, "color_" + tint + "_4", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-spinner--single-color)": {
	        " .pe-md-spinner__layer-4": {
	          borderColor: vars$$1["color_" + tint + "_4"]
	        }
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$d = _extends$Q({}, generalFns$d, tintFns$d("light"));

	var darkTintFns$d = _extends$Q({}, generalFns$d, tintFns$d("dark"));

	var color$1$3 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$d,
	    darkTintFns: darkTintFns$d
	  },
	  superColor: color
	});
	var OPACITY_MIN = 0;
	var OPACITY_MAX = .99;
	var CURVE_INFINITE = "cubic-bezier(0.4, 0.0, 0.2, 1) infinite both";

	var kfRotate = function kfRotate() {
	  return {
	    " to": {
	      transform: "rotate(360deg)"
	    }
	  };
	};

	var kfLeftSpin = function kfLeftSpin() {
	  return kfSpin(1);
	};

	var kfRightSpin = function kfRightSpin() {
	  return kfSpin(-1);
	};

	var kfSpin = function kfSpin(direction) {
	  return {
	    " from": {
	      "transform": "rotate(" + direction * 130 + "deg)"
	    },
	    " 50%": {
	      "transform": "rotate(" + direction * -5 + "deg)"
	    },
	    " to": {
	      "transform": "rotate(" + direction * 130 + "deg)"
	    }
	  };
	};

	var kfFadeOut = function kfFadeOut() {
	  return {
	    " from": {
	      opacity: OPACITY_MAX
	    },
	    " to": {
	      opacity: OPACITY_MIN
	    }
	  };
	};

	var kfFillUnfillRotate = function kfFillUnfillRotate(arcSize) {
	  return {
	    " 12.5%": {
	      transform: "rotate(" + 0.5 * arcSize + "deg)"
	    },
	    " 25%": {
	      transform: "rotate(" + 1.0 * arcSize + "deg)"
	    },
	    " 37.5%": {
	      transform: "rotate(" + 1.5 * arcSize + "deg)"
	    },
	    " 50%": {
	      transform: "rotate(" + 2.0 * arcSize + "deg)"
	    },
	    " 62.5%": {
	      transform: "rotate(" + 2.5 * arcSize + "deg)"
	    },
	    " 75%": {
	      transform: "rotate(" + 3.0 * arcSize + "deg)"
	    },
	    " 87.5%": {
	      transform: "rotate(" + 3.5 * arcSize + "deg)"
	    },
	    " to": {
	      transform: "rotate(" + 4.0 * arcSize + "deg)"
	    }
	  };
	};
	/**
	 * HACK: Even though the intention is to have the current .pe-md-spinner__layer at
	 * `opacity: 1`, we set it to `opacity: 0.99` instead since this forces Chrome
	 * to do proper subpixel rendering for the elements being animated. This is
	 * especially visible in Chrome 39 on Ubuntu 14.04. See:
	 *
	 * - https://github.com/Polymer/paper-spinner/issues/9
	 * - https://code.google.com/p/chromium/issues/detail?id=436255
	 */


	var kfLayer1FadeInOut = function kfLayer1FadeInOut() {
	  return {
	    " from": {
	      opacity: OPACITY_MAX
	    },
	    " 25%": {
	      opacity: OPACITY_MAX
	    },
	    " 26%": {
	      opacity: OPACITY_MIN
	    },
	    " 89%": {
	      opacity: OPACITY_MIN
	    },
	    " 90%": {
	      opacity: OPACITY_MAX
	    },
	    " 100%": {
	      opacity: OPACITY_MAX
	    }
	  };
	};

	var kfLayer2FadeInOut = function kfLayer2FadeInOut() {
	  return {
	    " from": {
	      opacity: OPACITY_MIN
	    },
	    " 15%": {
	      opacity: OPACITY_MIN
	    },
	    " 25%": {
	      opacity: OPACITY_MAX
	    },
	    " 50%": {
	      opacity: OPACITY_MAX
	    },
	    " 51%": {
	      opacity: OPACITY_MIN
	    }
	  };
	};

	var kfLayer3FadeInOut = function kfLayer3FadeInOut() {
	  return {
	    " from": {
	      opacity: OPACITY_MIN
	    },
	    " 40%": {
	      opacity: OPACITY_MIN
	    },
	    " 50%": {
	      opacity: OPACITY_MAX
	    },
	    " 75%": {
	      opacity: OPACITY_MAX
	    },
	    " 76%": {
	      opacity: OPACITY_MIN
	    }
	  };
	};

	var kfLayer4FadeInOut = function kfLayer4FadeInOut() {
	  return {
	    " from": {
	      opacity: OPACITY_MIN
	    },
	    " 65%": {
	      opacity: OPACITY_MIN
	    },
	    " 75%": {
	      opacity: OPACITY_MAX
	    },
	    " 90%": {
	      opacity: OPACITY_MAX
	    },
	    " 100%": {
	      opacity: OPACITY_MIN
	    }
	  };
	};

	var layerAnimation = function layerAnimation(vars$$1, num) {
	  return _defineProperty$P({}, ".pe-md-spinner__layer-" + num, {
	    animation: "mdSpinnerFillUnfillRotate " + 4 * vars$$1.arc_time + "s " + CURVE_INFINITE + ",  mdSpinnerLayer" + num + "FadeInOut " + 4 * vars$$1.arc_time + "s " + CURVE_INFINITE
	  });
	};

	var varFns$f = {
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, {
	      "@keyframes mdSpinnerRotate": kfRotate(),
	      "@keyframes mdSpinnerRightSpin": kfRightSpin(),
	      "@keyframes mdSpinnerLeftSpin": kfLeftSpin(),
	      "@keyframes mdSpinnerFadeOut": kfFadeOut(),
	      "@keyframes mdSpinnerLayer1FadeInOut": kfLayer1FadeInOut(),
	      "@keyframes mdSpinnerLayer2FadeInOut": kfLayer2FadeInOut(),
	      "@keyframes mdSpinnerLayer3FadeInOut": kfLayer3FadeInOut(),
	      "@keyframes mdSpinnerLayer4FadeInOut": kfLayer4FadeInOut(),
	      " .pe-md-spinner__animation": {
	        position: "relative",
	        width: "100%",
	        height: "100%",

	        /* The spinner does not have any contents that would have to be
	        * flipped if the direction changes. Always use ltr so that the
	        * style works out correctly in both cases. */
	        direction: "ltr"
	      },

	      /**
	      * Patch the gap that appear between the two adjacent div.pe-md-spinner__circle-clipper while the
	      * spinner is rotating (appears on Chrome 38, Safari 7.1, and IE 11).
	      *
	      * Update: the gap no longer appears on Chrome when .pe-md-spinner__layer"s opacity is 0.99,
	      * but still does on Safari and IE.
	      */
	      " .pe-md-spinner__gap-patch": {
	        position: "absolute",
	        boxSizing: "border-box",
	        top: 0,
	        left: "45%",
	        width: "10%",
	        height: "100%",
	        overflow: "hidden",
	        borderColor: "inherit"
	      },
	      " .pe-md-spinner__gap-patch .pe-md-spinner__circle": {
	        width: "1000%",
	        left: "-450%"
	      },
	      " .pe-md-spinner__circle-clipper": {
	        display: "inline-block",
	        fontSize: 0,
	        lineHeight: 0,
	        position: "relative",
	        width: "50%",
	        height: "100%",
	        overflow: "hidden",
	        borderColor: "inherit"
	      },
	      " .pe-md-spinner__circle-clipper .pe-md-spinner__circle": {
	        width: "200%"
	      },
	      " .pe-md-spinner__circle": [mixin.fit(), {
	        animation: "none",
	        boxSizing: "border-box",
	        height: "100%",
	        borderStyle: "solid",
	        borderColor: "inherit",
	        borderRadius: "50%",
	        borderBottomColor: "transparent !important"
	      }],
	      " .pe-md-spinner__circle-clipper-left .pe-md-spinner__circle": {
	        transform: "rotate(129deg)",
	        borderRightColor: "transparent !important"
	      },
	      " .pe-md-spinner__circle-clipper-right .pe-md-spinner__circle": {
	        transform: "rotate(-129deg)",
	        left: "-100%",
	        borderLeftColor: "transparent !important"
	      },

	      /**
	      * IMPORTANT NOTE ABOUT CSS ANIMATION PROPERTIES (keanulee):
	      *
	      * iOS Safari (tested on iOS 8.1) does not handle animation-delay very well - it doesn"t
	      * guarantee that the animation will start _exactly_ after that value. So we avoid using
	      * animation-delay and instead set custom keyframes for each color (as redundant as it
	      * seems).
	      *
	      * We write out each animation in full (instead of separating animation-name,
	      * animation-duration, etc.) because under the polyfill, Safari does not recognize those
	      * specific properties properly, treats them as -webkit-animation, and overrides the
	      * other animation rules. See https://github.com/Polymer/platform/issues/53.
	      */
	      " .pe-md-spinner__layer": [[1, 2, 3, 4].map(function (num) {
	        return layerAnimation(vars$$1, num);
	      }), {
	        position: "absolute",
	        width: "100%",
	        height: "100%",
	        whiteSpace: "nowrap"
	      }]
	    })];
	  },
	  rotation_duration: function rotation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-md-spinner__animation": {
	        animation: "mdSpinnerRotate " + vars$$1.rotation_duration + "s linear infinite"
	      }
	    })];
	  },
	  border_width_small: function border_width_small(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--small": {
	        " .pe-md-spinner__circle": {
	          borderWidth: vars$$1.border_width_small + "px"
	        }
	      }
	    })];
	  },
	  border_width_regular: function border_width_regular(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--regular": {
	        " .pe-md-spinner__circle": {
	          borderWidth: vars$$1.border_width_regular + "px"
	        }
	      }
	    })];
	  },
	  border_width_medium: function border_width_medium(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--medium": {
	        " .pe-md-spinner__circle": {
	          borderWidth: vars$$1.border_width_medium + "px"
	        }
	      }
	    })];
	  },
	  border_width_large: function border_width_large(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--large": {
	        " .pe-md-spinner__circle": {
	          borderWidth: vars$$1.border_width_large + "px"
	        }
	      }
	    })];
	  },
	  border_width_fab: function border_width_fab(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-spinner--fab": {
	        " .pe-md-spinner__circle": {
	          borderWidth: vars$$1.border_width_fab + "px"
	        }
	      }
	    })];
	  },
	  arc_size: function arc_size(selector, vars$$1) {
	    return [sel(selector, {
	      "@keyframes mdSpinnerFillUnfillRotate": kfFillUnfillRotate(vars$$1.arc_size)
	    })];
	  },
	  arc_time: function arc_time(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-md-spinner__circle-clipper-left .pe-md-spinner__circle": {
	        animation: "mdSpinnerLeftSpin " + vars$$1.arc_time + "s " + CURVE_INFINITE
	      },
	      " .pe-md-spinner__circle-clipper-right .pe-md-spinner__circle": {
	        animation: "mdSpinnerRightSpin " + vars$$1.arc_time + "s " + CURVE_INFINITE
	      },
	      " .pe-md-spinner__layer": {
	        animation: "mdSpinnerFillUnfillRotate " + 4 * vars$$1.arc_time + "s " + CURVE_INFINITE
	      }
	    })];
	  }
	};
	var layout$1$3 = createLayout({
	  varFns: varFns$f,
	  superLayout: layout$1
	}); // @ts-check

	var arc_size = 270; // degrees - amount of circle the arc takes up

	var arc_time = 1.333; // s - time it takes to expand and contract arc

	var arc_start_degrees = 360 / 5 * 3; // degrees - how much the start location of the arc should rotate each time, 216 gives us a 5 pointed star shape (it"s 360/5 * 3). For a 7 pointed star, we might do 360/7 * 3 = 154.286.

	var rotation_duration = 360 * arc_time / (arc_start_degrees + (360 - arc_size)); // 1.568s

	var blue400 = "#42a5f5";
	var red500 = "#f44336";
	var yellow600 = "#fdd835";
	var green500 = "#4caf50";
	/**
	 * @type {MaterialDesignSpinnerVars} materialDesignSpinnerVars
	 */

	var materialDesignSpinnerVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  arc_size: arc_size,
	  arc_start_degrees: arc_start_degrees,
	  arc_time: arc_time,
	  border_width_fab: baseSpinnerVars.size_fab / baseSpinnerVars.size_regular * 3,
	  border_width_large: baseSpinnerVars.size_large / baseSpinnerVars.size_regular * 3,
	  border_width_medium: baseSpinnerVars.size_medium / baseSpinnerVars.size_regular * 3,
	  border_width_regular: 3,
	  border_width_small: baseSpinnerVars.size_small / baseSpinnerVars.size_regular * 3,
	  rotation_duration: rotation_duration,
	  color_light_single: rgba(vars.color_primary),
	  color_light_1: blue400,
	  color_light_2: red500,
	  color_light_3: yellow600,
	  color_light_4: green500,
	  color_dark_single: rgba(vars.color_primary),
	  color_dark_1: blue400,
	  color_dark_2: red500,
	  color_dark_3: yellow600,
	  color_dark_4: green500
	}; // @ts-check

	var fns$f = [layout$1$3, color$1$3];
	var selector$g = ".".concat(classes$U.component);
	styler.addStyle({
	  selectors: [selector$g],
	  fns: fns$f,
	  vars: materialDesignSpinnerVars
	});

	var classes$V = {
	  component: "pe-md-progress-spinner",
	  // elements
	  animation: "pe-md-progress-spinner__animation",
	  circle: "pe-md-progress-spinner__circle",
	  circleRight: "pe-md-progress-spinner__circle-right",
	  circleLeft: "pe-md-progress-spinner__circle-left"
	};

	function _defineProperty$Q(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$R() {
	  _extends$R = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$R.apply(this, arguments);
	}

	var generalFns$e = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-md-progress-spinner__circle": {
	        borderColor: "currentcolor"
	      }
	    })];
	  }
	};

	var tintFns$e = function tintFns(tint) {
	  return _defineProperty$Q({}, "color_" + tint, function (selector, vars$$1) {
	    return [sel(selector, {
	      color: vars$$1["color_" + tint]
	    })];
	  });
	};

	var lightTintFns$e = _extends$R({}, generalFns$e, tintFns$e("light"));

	var darkTintFns$e = _extends$R({}, generalFns$e, tintFns$e("dark"));

	var color$1$4 = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$e,
	    darkTintFns: darkTintFns$e
	  },
	  superColor: color$1$3
	}); // @ts-check

	var varFns$g = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      position: "relative",
	      " .pe-md-progress-spinner__animation": {
	        position: "absolute",
	        width: "100%",
	        height: "100%"
	      },
	      " .pe-md-progress-spinner__circle": {
	        position: "absolute",
	        boxSizing: "border-box",
	        width: "100%",
	        height: "100%",
	        borderStyle: "solid",
	        borderRadius: "50%"
	      },
	      " .pe-md-progress-spinner__circle-left, .pe-md-progress-spinner__circle-right": {
	        transform: "rotate(0)",
	        clip: "rect(0, 0, 0, 0)"
	      }
	    })];
	  },
	  progress_animation_duration: function progress_animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-md-progress-spinner__animation": {
	        animationDuration: vars$$1.progress_animation_duration
	      }
	    })];
	  }
	};
	var layout$1$4 = createLayout({
	  varFns: varFns$g,
	  superLayout: layout$1$3
	}); // @ts-check

	/**
	 * @type {MaterialDesignProgressSpinnerVars} materialDesignProgressSpinnerVars
	 */

	var materialDesignProgressSpinnerVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  progress_animation_duration: ".8s",
	  color_light: rgba(vars.color_primary),
	  color_dark: rgba(vars.color_primary)
	}; // @ts-check

	var fns$g = [layout$1$4, color$1$4];
	var selector$h = ".".concat(classes$V.component);
	styler.addStyle({
	  selectors: [selector$h],
	  fns: fns$g,
	  vars: materialDesignProgressSpinnerVars
	});

	var listTileClasses$7 = {
	  component: "pe-list-tile",
	  // elements
	  content: "pe-list-tile__content",
	  highSubtitle: "pe-list-tile__high-subtitle",
	  primary: "pe-list-tile__primary",
	  secondary: "pe-list-tile__secondary",
	  subtitle: "pe-list-tile__subtitle",
	  title: "pe-list-tile__title",
	  contentFront: "pe-list-tile__content-front",
	  // states  
	  compact: "pe-list-tile--compact",
	  compactFront: "pe-list-tile--compact-front",
	  disabled: "pe-list-tile--disabled",
	  hasFront: "pe-list-tile--front",
	  hasHighSubtitle: "pe-list-tile--high-subtitle",
	  hasSubtitle: "pe-list-tile--subtitle",
	  header: "pe-list-tile--header",
	  hoverable: "pe-list-tile--hoverable",
	  insetH: "pe-list-tile--inset-h",
	  insetV: "pe-list-tile--inset-v",
	  selectable: "pe-list-tile--selectable",
	  selected: "pe-list-tile--selected",
	  rounded: "pe-list-tile--rounded",
	  highlight: "pe-list-tile--highlight",
	  sticky: "pe-list-tile--sticky",
	  navigation: "pe-list-tile--navigation"
	};
	var classes$W = {
	  component: "pe-menu",
	  // elements
	  panel: "pe-menu__panel",
	  content: "pe-menu__content",
	  placeholder: "pe-menu__placeholder",
	  backdrop: "pe-menu__backdrop",
	  // states
	  floating: "pe-menu--floating",
	  origin: "pe-menu--origin",
	  permanent: "pe-menu--permanent",
	  showBackdrop: "pe-menu--backdrop",
	  visible: "pe-menu--visible",
	  width_auto: "pe-menu--width-auto",
	  width_n: "pe-menu--width-",
	  isTopMenu: "pe-menu--top-menu",
	  // lookup
	  listTile: listTileClasses$7.component,
	  selectedListTile: listTileClasses$7.selected
	};

	function _defineProperty$R(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$S() {
	  _extends$S = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$S.apply(this, arguments);
	}

	function _objectSpread$z(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$R(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var generalFns$f = {
	  general_styles: function general_styles(selector) {
	    return [];
	  } // eslint-disable-line no-unused-vars

	};

	var tintFns$f = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$R(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-menu__panel": {
	        "background-color": vars$$1["color_" + tint + "_background"]
	      }
	    })];
	  }), _defineProperty$R(_ref, "color_" + tint + "_backdrop_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-menu__backdrop": {
	        "background-color": vars$$1["color_" + tint + "_backdrop_background"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$f = _extends$S({}, generalFns$f, tintFns$f("light"));

	var darkTintFns$f = _extends$S({}, generalFns$f, tintFns$f("dark"));

	var color$c = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$f,
	    darkTintFns: darkTintFns$f
	  }
	});
	var behaviorVars$1 = {
	  top_menu: false // set to true to position the menu at the top of the screen, full width

	};

	var themeVars$5 = _objectSpread$z({
	  backdrop: undefined,
	  // (Boolean) - if not set, backdrop existence is set by component option
	  z: vars.z_menu
	}, behaviorVars$1, sharedVars);
	/**
	 * @type {MenuVars} menuVars
	 */


	var menuVars = _objectSpread$z({
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_delay: "0s",
	  animation_duration: ".180s",
	  animation_hide_css: "opacity: 0;",
	  animation_hide_origin_effect_css: "transform: scale(0.75);",
	  // set to "transform: scale(1)" to reset scaling
	  animation_show_css: "opacity: 1;",
	  animation_show_origin_effect_css: "transform: scale(1);",
	  animation_timing_function: "ease-in-out",
	  border_radius: vars.unit_block_border_radius,
	  height: undefined,
	  // (height value with unit) - if not set, height is set by component option
	  min_width: 1.5,
	  width_factor: vars.grid_unit_menu,
	  widths: [1, 1.5, 2, 3, 4, 5, 6, 7],
	  // color vars
	  color_light_background: rgba(vars.color_light_background),
	  color_dark_background: rgba(vars.color_dark_background),
	  color_light_backdrop_background: "rgba(0, 0, 0, .1)",
	  color_dark_backdrop_background: "rgba(0, 0, 0, .5)"
	}, themeVars$5);
	/**
	 * 
	 * @param {boolean} isRTL 
	 */


	var alignSide$6 = function alignSide(isRTL) {
	  return function () {
	    return {
	      textAlign: isRTL ? "right" : "left"
	    };
	  };
	};

	var alignLeft$6 = alignSide$6(false);
	var alignRight$6 = alignSide$6(true);

	var unifyWidth$1 = function unifyWidth(vars$$1, width) {
	  return width < vars$$1.min_width ? vars$$1.min_width : width;
	};

	var widthClass$1 = function widthClass(width) {
	  var widthStr = width.toString().replace(".", "-");
	  return "pe-menu--width-" + widthStr;
	};
	/**
	 * 
	 * @param {object} params
	 * @param {object} params.vars
	 * @param {number} params.width
	 * @param {string} [params.value]
	 */


	var widthStyle = function widthStyle(_ref) {
	  var vars$$1 = _ref.vars,
	      width = _ref.width,
	      value = _ref.value;
	  var s = unifyWidth$1(vars$$1, width);
	  return _defineProperty$R({}, "." + widthClass$1(s), {
	    " .pe-menu__panel": {
	      width: value || vars$$1.width_factor * s + "px" // We can't set maxWidth because we don't know the width of the container

	    }
	  });
	};

	var widths_min_width_width_factor = function widths_min_width_width_factor(selector, vars$$1) {
	  return sel(selector, [vars$$1.widths.map(function (width) {
	    return widthStyle({
	      vars: vars$$1,
	      width: width
	    });
	  }), {
	    " .pe-menu__panel": {
	      minWidth: vars.grid_unit_menu * vars$$1.min_width + "px"
	    }
	  }]);
	};

	var _backdrop$2 = function backdrop(selector, vars$$1) {
	  return (// eslint-disable-line no-unused-vars
	    sel(selector, {
	      " .pe-menu__backdrop": {
	        display: "block"
	      }
	    })
	  );
	};

	var _top_menu = function top_menu(selector, vars$$1) {
	  return sel(selector, [vars$$1.widths.map(function (width) {
	    return widthStyle({
	      vars: vars$$1,
	      width: width,
	      value: "100vw"
	    });
	  }), createMarker(vars$$1, behaviorVars$1), {
	    " .pe-menu__panel": {
	      position: "fixed",
	      width: "100vw",
	      top: 0,
	      left: 0,
	      right: 0,
	      bottom: "auto",
	      borderTopLeftRadius: 0,
	      borderTopRightRadius: 0
	    }
	  }]);
	};

	var _z = function z(selector, vars$$1) {
	  return sel(selector, {
	    ".pe-menu--floating": {
	      " .pe-menu__panel, .pe-menu__backdrop": {
	        zIndex: vars$$1.z
	      }
	    }
	  });
	};

	var varFns$h = _objectSpread$z({
	  general_styles: function general_styles(selector, vars$$1) {
	    return [sel(selector, [alignLeft$6(), {
	      position: "static",
	      ".pe-menu--width-auto": {
	        width: "auto"
	      },
	      ".pe-menu--permanent": {
	        " .pe-menu__panel": {
	          opacity: 1,
	          position: "relative"
	        }
	      },
	      ".pe-menu--floating": {
	        " .pe-menu__panel": {
	          transitionProperty: "opacity, transform"
	        }
	      },
	      " .pe-menu__panel": {
	        transitionProperty: "all",
	        opacity: 0,
	        position: "absolute"
	      },
	      " .pe-menu__backdrop": {
	        display: "none",
	        transitionProperty: "all",
	        position: "fixed",
	        top: 0,
	        right: 0,
	        bottom: 0,
	        left: 0,
	        opacity: 0
	      },
	      ".pe-menu--backdrop": _backdrop$2(selector),
	      ".pe-menu--visible .pe-menu__backdrop": {
	        opacity: 1
	      },
	      ".pe-menu--top-menu": _top_menu(selector, vars$$1),
	      " .pe-menu__content": {
	        overflowX: "auto",
	        overflowY: "auto",
	        width: "100%",
	        height: "100%"
	      },
	      ".pe-menu--full-height": {
	        height: "100%",
	        " .pe-menu__panel": {
	          height: "100%"
	        }
	      }
	    }]), _defineProperty$R({}, selectorRTL(selector), alignRight$6())];
	  },
	  animation_delay: function animation_delay(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-menu__panel, .pe-menu__backdrop": {
	        transitionDelay: vars$$1.animation_delay
	      }
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-menu__panel, .pe-menu__backdrop": {
	        transitionDuration: vars$$1.animation_duration
	      }
	    })];
	  },
	  animation_timing_function: function animation_timing_function(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-menu__panel, .pe-menu__backdrop": {
	        transitionTimingFunction: vars$$1.animation_timing_function
	      }
	    })];
	  },
	  animation_show_css: function animation_show_css(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-menu--visible": {
	        " .pe-menu__panel": vars$$1.animation_show_css
	      }
	    })];
	  },
	  animation_hide_css: function animation_hide_css(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-menu__panel": vars$$1.animation_hide_css
	    })];
	  },
	  animation_show_origin_effect_css: function animation_show_origin_effect_css(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-menu--origin.pe-menu--visible": {
	        " .pe-menu__panel": vars$$1.animation_show_origin_effect_css
	      }
	    })];
	  },
	  animation_hide_origin_effect_css: function animation_hide_origin_effect_css(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-menu--origin:not(.pe-menu--visible)": {
	        " .pe-menu__panel": vars$$1.animation_hide_origin_effect_css
	      }
	    })];
	  },
	  height: function height(selector, vars$$1) {
	    return [vars$$1.height !== undefined && sel(selector, {
	      " .pe-menu__panel": {
	        height: vars$$1.height
	      }
	    })];
	  },
	  widths: function widths(selector, vars$$1) {
	    return [widths_min_width_width_factor(selector, vars$$1)];
	  },
	  min_width: function min_width(selector, vars$$1) {
	    return [widths_min_width_width_factor(selector, vars$$1)];
	  },
	  width_factor: function width_factor(selector, vars$$1) {
	    return [widths_min_width_width_factor(selector, vars$$1)];
	  },
	  border_radius: function border_radius(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-menu__panel": {
	        borderRadius: vars$$1.border_radius + "px"
	      }
	    })];
	  },
	  // Theme vars
	  backdrop: function backdrop(selector, vars$$1) {
	    return [vars$$1.backdrop && _backdrop$2(selector, vars$$1)];
	  },
	  top_menu: function top_menu(selector, vars$$1) {
	    return [vars$$1.top_menu && _top_menu(selector, vars$$1)];
	  },
	  z: function z(selector, vars$$1) {
	    return [vars$$1.z && _z(selector, vars$$1)];
	  }
	}, sharedVarFns);

	var layout$f = createLayout({
	  varFns: varFns$h
	}); // @ts-check

	var fns$h = [layout$f, color$c];
	var selector$i = ".".concat(classes$W.component);
	styler.addStyle({
	  selectors: [selector$i],
	  fns: fns$h,
	  vars: menuVars
	});

	var classes$X = {
	  component: "pe-notification",
	  // elements
	  action: "pe-notification__action",
	  content: "pe-notification__content",
	  holder: "pe-notification__holder",
	  placeholder: "pe-notification__placeholder",
	  title: "pe-notification__title",
	  // states
	  hasContainer: "pe-notification--container",
	  horizontal: "pe-notification--horizontal",
	  multilineTitle: "pe-notification__title--multi-line",
	  vertical: "pe-notification--vertical",
	  visible: "pe-notification--visible"
	};

	function _defineProperty$S(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$T() {
	  _extends$T = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$T.apply(this, arguments);
	}

	var generalFns$g = {
	  general_styles: function general_styles(selector) {
	    return [];
	  } // eslint-disable-line no-unused-vars

	};

	var tintFns$g = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$S(_ref, "color_" + tint + "_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-notification__content": {
	        color: vars$$1["color_" + tint + "_text"]
	      }
	    })];
	  }), _defineProperty$S(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-notification__content": {
	        background: vars$$1["color_" + tint + "_background"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$g = _extends$T({}, generalFns$g, tintFns$g("light"));

	var darkTintFns$g = _extends$T({}, generalFns$g, tintFns$g("dark"));

	var color$d = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$g,
	    darkTintFns: darkTintFns$g
	  }
	}); // @ts-check

	var varFns$i = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [flex$1.layoutCenterCenter, {
	      // assumes position relative
	      top: 0,
	      right: 0,
	      bottom: 0,
	      left: 0,
	      pointerEvents: "none",
	      justifyContent: "flex-start",
	      // For IE 11
	      ".pe-multiple--screen": {
	        position: "fixed",
	        zIndex: vars.z_notification
	      }
	    }]), {
	      ":not(.pe-notification--container) .pe-multiple--container": {
	        position: "absolute"
	      }
	    }];
	  }
	};
	var holderLayout = createLayout({
	  varFns: varFns$i
	});

	var title_single_padding_v_title_padding_h = function title_single_padding_v_title_padding_h(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-notification__title": {
	      padding: vars$$1.title_single_padding_v + "px " + vars$$1.title_padding_h + "px"
	    }
	  });
	};

	var customLayoutFns = {
	  animation_hide_css: function animation_hide_css(selector, vars$$1) {
	    return [sel(selector, vars$$1.animation_hide_css)];
	  },
	  animation_show_css: function animation_show_css(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-notification--visible": [vars$$1.animation_show_css]
	    })];
	  },
	  width: function width(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-notification__content": {
	        width: vars$$1.width + "px"
	      }
	    })];
	  },
	  animation_delay: function animation_delay(selector, vars$$1) {
	    return [sel(selector, {
	      transitionDelay: vars$$1.animation_delay
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      transitionDuration: vars$$1.animation_duration
	    })];
	  },
	  animation_timing_function: function animation_timing_function(selector, vars$$1) {
	    return [sel(selector, {
	      transitionTimingFunction: vars$$1.animation_timing_function
	    })];
	  },
	  side_padding: function side_padding(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-notification__content": {
	        padding: "0 " + vars$$1.side_padding + "px"
	      }
	    })];
	  },
	  border_radius: function border_radius(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-notification__content": {
	        borderRadius: vars$$1.border_radius + "px"
	      }
	    })];
	  },
	  title_single_padding_v: function title_single_padding_v(selector, vars$$1) {
	    return [title_single_padding_v_title_padding_h(selector, vars$$1)];
	  },
	  title_padding_h: function title_padding_h(selector, vars$$1) {
	    return [title_single_padding_v_title_padding_h(selector, vars$$1)];
	  },
	  font_size: function font_size(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-notification__title": {
	        fontSize: vars$$1.font_size + "px"
	      }
	    })];
	  },
	  line_height: function line_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-notification__title": {
	        lineHeight: vars$$1.line_height + "px"
	      }
	    })];
	  },
	  title_multi_padding_v: function title_multi_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-notification--horizontal": {
	        " .pe-notification__title--multi-line": {
	          paddingTop: vars$$1.title_multi_padding_v + "px",
	          paddingBottom: vars$$1.title_multi_padding_v + "px"
	        }
	      },
	      ".pe-notification--vertical": {
	        " .pe-notification__title--multi-line": {
	          paddingTop: vars$$1.title_multi_padding_v + "px"
	        }
	      }
	    })];
	  }
	};

	var varFns$1$2 = _extends$T({}, {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [flex$1.layoutCenter, {
	      pointerEvents: "all",
	      justifyContent: "center",
	      margin: "0 auto",
	      transitionProperty: "all",
	      opacity: 0,
	      " .pe-notification__title": {
	        flex: "1 0 auto"
	      },
	      " .pe-notification__action": {
	        " .pe-button": {
	          margin: 0
	        }
	      },
	      " .pe-notification__content": {
	        maxWidth: "100%"
	      },
	      ".pe-notification--horizontal": {
	        " .pe-notification__content": flex$1.layoutHorizontal,
	        " .pe-notification__title": [flex$1.flex(), {
	          alignSelf: "center"
	        }],
	        " .pe-notification__action": flex$1.layoutCenter
	      },
	      ".pe-notification--vertical": {
	        " .pe-notification__content": [flex$1.layoutVertical],
	        " .pe-notification__title": {
	          paddingBottom: "6px"
	        },
	        " .pe-notification__action": [flex$1.layoutEndJustified, {
	          width: "100%"
	        }]
	      }
	    }])];
	  }
	}, customLayoutFns);

	var layout$g = createLayout({
	  varFns: varFns$1$2
	}); // @ts-check

	var buttonPaddingH = 8; // padding, inner text space

	/**
	 * @type {NotificationVars} notificationVars
	 */

	var notificationVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_delay: "0s",
	  animation_duration: ".3s",
	  animation_hide_css: "opacity: 0;",
	  animation_show_css: "opacity: 1;",
	  animation_timing_function: "ease-in-out",
	  border_radius: vars.unit_block_border_radius,
	  font_size: 14,
	  line_height: 20,
	  min_height: 80,
	  side_padding: 24 - buttonPaddingH,
	  title_multi_padding_v: 20,
	  // 24 - natural line height
	  title_padding_h: buttonPaddingH,
	  title_single_padding_v: 14,
	  width: 288,
	  color_light_background: rgba(vars.color_light_background),
	  color_light_text: rgba(vars.color_light_foreground, vars.blend_light_dark_primary),
	  color_dark_background: rgba(vars.color_dark_background),
	  color_dark_text: rgba(vars.color_dark_foreground, vars.blend_light_text_primary)
	}; // @ts-check

	var fns$i = [layout$g, color$d];
	var selector$j = ".".concat(classes$X.component);
	var holderFns = [holderLayout];
	var holderSelector = ".".concat(classes$X.holder);

	styler.addStyle({
	  selectors: [holderSelector],
	  fns: holderFns,
	  vars: notificationVars
	});
	styler.addStyle({
	  selectors: [selector$j],
	  fns: fns$i,
	  vars: notificationVars
	});

	var classes$Y = {
	  component: "pe-radio-control"
	}; // @ts-check

	var color$1$5 = createColor({
	  superColor: color$3
	}); // @ts-check

	var varFns$j = {
	  general_styles: function general_styles() {
	    return {
	      " .pe-radio-group": {
	        display: "flex"
	      }
	    };
	  }
	};
	var layout$1$5 = createLayout({
	  varFns: varFns$j,
	  superLayout: layout$6
	}); // @ts-check

	/**
	 * @typedef {import("../index").RadioButtonVars} RadioButtonVars
	 */

	/**
	 * @type {RadioButtonVars} radioButtonVars
	 */

	var radioButtonVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true
	}; // @ts-check

	var fns$j = [layout$1$5, color$1$5];
	var selector$k = ".".concat(classes$Y.component);
	styler.addStyle({
	  selectors: [selector$k],
	  fns: fns$j,
	  vars: radioButtonVars
	});

	var classes$Z = {
	  component: "pe-ripple",
	  // elements
	  mask: "pe-ripple__mask",
	  waves: "pe-ripple__waves",
	  // states
	  unconstrained: "pe-ripple--unconstrained",
	  wavesAnimating: "pe-ripple__waves--animating"
	};

	function _defineProperty$T(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$U() {
	  _extends$U = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$U.apply(this, arguments);
	}

	var generalFns$h = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      color: "inherit"
	    })];
	  }
	};

	var tintFns$h = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$T(_ref, "color", function color(selector, vars) {
	    return [sel(selector, {
	      color: vars["color"]
	    })];
	  }), _defineProperty$T(_ref, "color_" + tint, function (selector, vars) {
	    return [sel(selector, {
	      color: vars["color_" + tint]
	    })];
	  }), _ref;
	};

	var lightTintFns$h = _extends$U({}, generalFns$h, tintFns$h("light"));

	var darkTintFns$h = _extends$U({}, generalFns$h, tintFns$h("dark"));

	var color$e = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$h,
	    darkTintFns: darkTintFns$h
	  }
	}); // @ts-check

	var varFns$k = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [mixin.fit(), {
	      color: "inherit",
	      borderRadius: "inherit",
	      pointerEvents: "none",
	      ":not(.pe-ripple--unconstrained)": {
	        borderRadius: "inherit",
	        " .pe-ripple__mask": {
	          overflow: "hidden",
	          borderRadius: "inherit"
	        }
	      },
	      " .pe-ripple__mask": [mixin.fit(), {
	        transform: "translate3d(0,0,0)"
	      }],
	      " .pe-ripple__waves": {
	        outline: "1px solid transparent",
	        // for IE10
	        position: "absolute",
	        borderRadius: "50%",
	        pointerEvents: "none",
	        display: "none"
	      },
	      " .pe-ripple__waves--animating": {
	        display: "block"
	      }
	    }])];
	  }
	};
	var layout$h = createLayout({
	  varFns: varFns$k
	}); // @ts-check

	/**
	 * @typedef {import("../index").RippleVars} RippleVars
	 */

	/**
	 * @type {RippleVars} rippleVars
	 */

	var rippleVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  color: "inherit" // only specify this variable to get both states
	  // color_light:   "inherit",
	  // color_dark:    "inherit"

	}; // @ts-check

	var fns$k = [layout$h, color$e];
	var selector$l = ".".concat(classes$Z.component);
	styler.addStyle({
	  selectors: [selector$l],
	  fns: fns$k,
	  vars: rippleVars
	});

	var classes$_ = {
	  component: "pe-search",
	  // elements
	  content: "pe-search__content",
	  // states
	  searchFullWidth: "pe-search--full-width",
	  searchInset: "pe-search--inset"
	};

	function _defineProperty$U(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$V() {
	  _extends$V = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$V.apply(this, arguments);
	}

	var generalFns$i = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-textfield__input-area": {
	        backgroundColor: "transparent"
	      }
	    })];
	  }
	};

	var tintFns$i = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$U(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      backgroundColor: vars$$1["color_" + tint + "_background"]
	    })];
	  }), _defineProperty$U(_ref, "color_" + tint + "_label_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield": {
	        " .pe-textfield__label": {
	          color: vars$$1["color_" + tint + "_label_text"]
	        }
	      }
	    })];
	  }), _defineProperty$U(_ref, "color_" + tint + "_input_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield": {
	        " .pe-textfield__input": {
	          color: vars$$1["color_" + tint + "_input_text"]
	        }
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$i = _extends$V({}, generalFns$i, tintFns$i("light"));

	var darkTintFns$i = _extends$V({}, generalFns$i, tintFns$i("dark"));

	var color$f = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$i,
	    darkTintFns: darkTintFns$i
	  }
	}); // @ts-check

	var inset_height_line_height_input = function inset_height_line_height_input(selector, vars$$1) {
	  var inset_input_padding_v = (vars$$1.inset_height - vars$$1.line_height_input) / 2;
	  return sel(selector, {
	    ".pe-search--inset": {
	      " .pe-textfield__input, .pe-textfield__label": {
	        paddingTop: inset_input_padding_v + "px",
	        paddingBottom: inset_input_padding_v + "px"
	      }
	    }
	  });
	};

	var full_width_height_line_height_input = function full_width_height_line_height_input(selector, vars$$1) {
	  var full_width_input_padding_v = (vars$$1.full_width_height - vars$$1.line_height_input) / 2;
	  return sel(selector, {
	    ".pe-search--full-width": {
	      " .pe-textfield__input, .pe-textfield__label": {
	        paddingTop: full_width_input_padding_v + "px",
	        paddingBottom: full_width_input_padding_v + "px"
	      }
	    }
	  });
	};

	var varFns$l = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [flex$1.flex(), {
	      position: "relative",
	      // necessary when a shadow is added
	      " .pe-textfield": [flex$1.flex(), {
	        alignItems: "center",
	        padding: 0,
	        // prevent that neighboring icon button with ripple hides the cursor
	        position: "relative",
	        zIndex: 1,
	        " .pe-textfield__input-area": {
	          padding: 0,
	          ":after": {
	            display: "none"
	          }
	        },
	        " .pe-textfield__input": {
	          // reset
	          border: "none"
	        },
	        " .pe-textfield__label": {
	          // reset
	          top: 0,
	          bottom: 0
	        }
	      }],
	      " .pe-search__content": {
	        "&, .pe-textfield": flex$1.layoutHorizontal,
	        "&, .pe-textfield__input-area": {
	          flexGrow: 1
	        }
	      },
	      " .pe-search__content > *": [flex$1.layoutVertical, flex$1.selfCenter],
	      ".pe-search--inset": {
	        "&, .pe-textfield__input-area, .pe-textfield__input, .pe-textfield__label": {
	          padding: 0
	        }
	      }
	    }])];
	  },
	  font_size_input: function font_size_input(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield": {
	        " .pe-textfield__input, .pe-textfield__label": {
	          fontSize: vars$$1.font_size_input + "px"
	        }
	      }
	    })];
	  },
	  line_height_input: function line_height_input(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input, .pe-textfield__label": {
	        lineHeight: vars$$1.line_height_input + "px"
	      }
	    }), inset_height_line_height_input(selector, vars$$1)];
	  },
	  inset_border_radius: function inset_border_radius(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-search--inset": {
	        "border-radius": vars$$1.inset_border_radius + "px"
	      }
	    })];
	  },
	  inset_side_padding: function inset_side_padding(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-search--inset": {
	        padding: "0 " + vars$$1.inset_side_padding + "px"
	      }
	    })];
	  },
	  inset_height: function inset_height(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-search--inset": {
	        "&, .pe-textfield__input-area, .pe-textfield__input, .pe-textfield__label": {
	          padding: 0,
	          height: vars$$1.inset_height + "px"
	        }
	      }
	    }), inset_height_line_height_input(selector, vars$$1)];
	  },
	  full_width_height: function full_width_height(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-search--full-width": {
	        "&, .pe-textfield__input-area, .pe-textfield__input, .pe-textfield__label": {
	          height: vars$$1.full_width_height + "px"
	        }
	      }
	    }), full_width_height_line_height_input(selector, vars$$1)];
	  },
	  inset_input_indent: function inset_input_indent(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-search--inset": {
	        " .pe-textfield__input, .pe-textfield__label": {
	          paddingLeft: vars$$1.inset_input_indent + "px"
	        }
	      }
	    })];
	  },
	  inset_input_right_padding: function inset_input_right_padding(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-search--inset": {
	        " .pe-textfield__input, .pe-textfield__label": {
	          paddingRight: vars$$1.inset_input_right_padding + "px"
	        }
	      }
	    })];
	  },
	  full_width_side_padding: function full_width_side_padding(selector, vars$$1) {
	    var full_width_input_indent = vars.unit_indent - vars$$1.full_width_side_padding - vars.grid_unit_icon_button;
	    return sel(selector, {
	      ".pe-search--full-width": {
	        padding: "0 " + vars$$1.full_width_side_padding + "px",
	        " .pe-textfield__input, .pe-textfield__label": {
	          paddingLeft: full_width_input_indent + "px"
	        }
	      },
	      ".pe-search--full-width + .pe-list .pe-list-tile": {
	        "> :first-child": {
	          paddingLeft: vars$$1.full_width_side_padding + "px"
	        },
	        "> :last-child": {
	          paddingRight: vars$$1.full_width_side_padding + "px"
	        }
	      }
	    });
	  },
	  full_width_border_radius: function full_width_border_radius(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-search--full-width": {
	        borderRadius: vars$$1.full_width_border_radius + "px"
	      }
	    })];
	  },
	  full_width_input_right_padding: function full_width_input_right_padding(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-search--full-width": {
	        " .pe-textfield__input, .pe-textfield__label": {
	          paddingRight: vars$$1.full_width_input_right_padding + "px"
	        }
	      }
	    })];
	  }
	};
	var layout$i = createLayout({
	  varFns: varFns$l
	}); // @ts-check

	/**
	 * @type {SearchVars} searchVars
	 */

	var searchVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  font_size_input: 20,
	  full_width_border_radius: 0,
	  full_width_height: 56,
	  full_width_input_right_padding: 0,
	  full_width_side_margin: 0,
	  full_width_side_padding: 8,
	  inset_border_radius: vars.unit_block_border_radius,
	  inset_height: 48,
	  inset_input_indent: 16,
	  inset_input_right_padding: 0,
	  inset_side_padding: 0,
	  line_height_input: 20,
	  color_light_label_text: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  color_light_input_text: rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  color_light_background: rgba(vars.color_light_background),
	  color_dark_label_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled),
	  color_dark_input_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  color_dark_background: rgba(vars.color_dark_background)
	}; // @ts-check

	var fns$l = [layout$i, color$f];
	var selector$m = ".".concat(classes$_.component);
	styler.addStyle({
	  selectors: [selector$m],
	  fns: fns$l,
	  vars: searchVars
	});

	var classes$10 = {
	  component: "pe-slider",
	  // elements
	  control: "pe-slider__control",
	  label: "pe-slider__label",
	  pin: "pe-slider__pin",
	  thumb: "pe-slider__thumb",
	  tick: "pe-slider__tick",
	  ticks: "pe-slider__ticks",
	  track: "pe-slider__track",
	  trackBar: "pe-slider__track-bar",
	  trackBarValue: "pe-slider__track-bar-value",
	  trackPart: "pe-slider__track-part",
	  trackPartRest: "pe-slider__track-rest",
	  trackPartValue: "pe-slider__track-value",
	  // states
	  hasFocus: "pe-slider--focus",
	  hasPin: "pe-slider--pin",
	  hasTicks: "pe-slider--ticks",
	  hasTrack: "pe-slider--track",
	  isActive: "pe-slider--active",
	  isAtMin: "pe-slider--min",
	  isDisabled: "pe-slider--disabled",
	  tickValue: "pe-slider__tick--value"
	};

	function _defineProperty$V(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$W() {
	  _extends$W = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$W.apply(this, arguments);
	}

	var generalFns$j = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-slider__control": {
	        ":after": {
	          borderColor: "transparent"
	        }
	      },
	      " .pe-slider__pin": {
	        backgroundColor: "currentcolor",
	        ":before": {
	          backgroundColor: "inherit"
	        }
	      },
	      ":not(.pe-slider--disabled)": {
	        " .pe-slider__control": {
	          backgroundColor: "currentcolor"
	        },
	        " .pe-slider__track-value .pe-slider__track-bar-value": {
	          background: "currentcolor"
	        },
	        ".pe-slider--focus:not(.pe-slider--min):not(.pe-slider--pin) .pe-slider__control:before,\
        &:not(.pe-slider--min):not(.pe-slider--pin) .pe-slider__control:focus:before": {
	          backgroundColor: "currentcolor"
	        }
	      },
	      ".pe-slider--min:not(.pe-slider--disabled):not(.pe-slider--ticks)": {
	        " .pe-slider__control": {
	          backgroundColor: "transparent"
	        },
	        " .pe-slider__thumb": {
	          opacity: 0
	        },
	        ".pe-slider--ticks": {
	          " .pe-slider__control:after": {
	            borderColor: "transparent"
	          }
	        }
	      }
	    })];
	  }
	};

	var tintFns$j = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$V(_ref, "color_" + tint + "_icon", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-slider--disabled)": {
	        " .pe-icon": {
	          color: vars$$1["color_" + tint + "_icon"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-slider--disabled)": {
	        " .pe-slider__label": {
	          color: vars$$1["color_" + tint + "_label"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_thumb_on", function (selector, vars$$1) {
	    return [sel(selector, {
	      color: vars$$1["color_" + tint + "_thumb_on"] // override by specifying "color"

	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_track_inactive", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__track-bar-value": {
	        background: vars$$1["color_" + tint + "_track_inactive"]
	      },
	      ".pe-slider--min:not(.pe-slider--disabled):not(.pe-slider--ticks)": {
	        " .pe-slider__control:after": {
	          borderColor: vars$$1["color_" + tint + "_track_inactive"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_tick", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__tick": {
	        background: vars$$1["color_" + tint + "_tick"]
	      },
	      ".pe-slider--min:not(.pe-slider--disabled)": {
	        ".pe-slider--tick": {
	          backgroundColor: vars$$1["color_" + tint + "_tick"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_tick_value", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__tick--value": {
	        background: vars$$1["color_" + tint + "_tick_value"]
	      },
	      ".pe-slider--min:not(.pe-slider--disabled)": {
	        ".pe-slider--tick--value": {
	          backgroundColor: vars$$1["color_" + tint + "_tick_value"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_disabled_icon", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-icon": {
	        color: vars$$1["color_" + tint + "_disabled_icon"]
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_disabled_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__label": {
	        color: vars$$1["color_" + tint + "_disabled_label"]
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_track_active", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-slider--active": {
	        " .pe-slider__track-bar-value": {
	          background: vars$$1["color_" + tint + "_track_active"]
	        }
	      },
	      ".pe-slider--min:not(.pe-slider--disabled)": {
	        ".pe-slider--active .pe-slider__control:after": {
	          borderColor: vars$$1["color_" + tint + "_track_active"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_thumb_inactive", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-slider--disabled": {
	        " .pe-slider__control": {
	          background: vars$$1["color_" + tint + "_thumb_inactive"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_thumb_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-slider--disabled)": {
	        " .pe-slider__control": {
	          backgroundColor: vars$$1["color_" + tint + "_thumb_background"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_thumb_off_focus_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-slider--disabled)": {
	        " .pe-slider__control": {
	          ":before": {
	            opacity: vars$$1["color_" + tint + "_thumb_off_focus_opacity"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_thumb_off_focus", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-slider--disabled)": {
	        ".pe-slider--focus.pe-slider--min:not(.pe-slider--pin) .pe-slider__control:before,\
        .pe-slider--min:not(.pe-slider--pin) .pe-slider__control:focus:before": {
	          backgroundColor: vars$$1["color_" + tint + "_thumb_off_focus"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_thumb_on_focus_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-slider--disabled)": {
	        ".pe-slider--focus:not(.pe-slider--min):not(.pe-slider--pin) .pe-slider__control:before,\
        &:not(.pe-slider--min):not(.pe-slider--pin) .pe-slider__control:focus:before": {
	          opacity: vars$$1["color_" + tint + "_thumb_on_focus_opacity"]
	        }
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_pin_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__pin:after": {
	        color: vars$$1["color_" + tint + "_pin_label"]
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_pin_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__pin": {
	        backgroundColor: vars$$1["color_" + tint + "_pin_background"]
	      }
	    })];
	  }), _defineProperty$V(_ref, "color_" + tint + "_track_value", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-slider--disabled)": {
	        " .pe-slider__track-value .pe-slider__track-bar-value": {
	          backgroundColor: vars$$1["color_" + tint + "_track_value"]
	        }
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$j = _extends$W({}, generalFns$j, tintFns$j("light"));

	var darkTintFns$j = _extends$W({}, generalFns$j, tintFns$j("dark"));

	var color$g = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$j,
	    darkTintFns: darkTintFns$j
	  }
	}); // @ts-check

	var getThumbSize = function getThumbSize(vars$$1) {
	  var thumbSize = Math.max(vars$$1.thumb_size, 2 * vars$$1.thumb_border_width);
	  var barOffset = thumbSize / 2;
	  var stepsOffset = barOffset - 1;
	  return {
	    normalThumbSize: thumbSize,
	    disabledThumbSize: thumbSize - 2 * vars$$1.thumb_border_width,
	    barOffset: barOffset,
	    stepsOffset: stepsOffset
	  };
	};

	var getBorderWidth = function getBorderWidth(vars$$1) {
	  var borderWidth = vars$$1.thumb_border_width;
	  var scaledBorderWidth = Math.max(1, vars$$1.thumb_border_width / vars$$1.active_thumb_scale);
	  return {
	    normalBorderWidth: borderWidth,
	    disabledBorderWidth: 1 / vars$$1.disabled_thumb_scale * vars$$1.thumb_border_width,
	    scaledBorderWidth: scaledBorderWidth
	  };
	};

	var thumb_size_thumb_border_width_disabled_thumb_scale = function thumb_size_thumb_border_width_disabled_thumb_scale(selector, vars$$1) {
	  var _getThumbSize = getThumbSize(vars$$1),
	      normalThumbSize = _getThumbSize.normalThumbSize,
	      disabledThumbSize = _getThumbSize.disabledThumbSize;

	  var _getBorderWidth = getBorderWidth(vars$$1),
	      normalBorderWidth = _getBorderWidth.normalBorderWidth,
	      disabledBorderWidth = _getBorderWidth.disabledBorderWidth;

	  return sel(selector, {
	    " .pe-slider__control:after": {
	      borderWidth: normalBorderWidth + "px",
	      width: normalThumbSize + "px",
	      height: normalThumbSize + "px",
	      left: 0,
	      top: 0
	    },
	    ".pe-slider--disabled .pe-slider__control:after": {
	      borderWidth: disabledBorderWidth + "px",
	      width: disabledThumbSize + "px",
	      height: disabledThumbSize + "px",
	      left: normalThumbSize - disabledThumbSize + "px",
	      top: normalThumbSize - disabledThumbSize + "px"
	    },
	    ".pe-slider--ticks .pe-slider__control:after": {
	      borderWidth: 0
	    }
	  });
	};

	var height_track_height = function height_track_height(selector, vars$$1) {
	  return sel(selector, {
	    marginTop: (vars$$1.height - vars$$1.track_height) / 2 + "px "
	  });
	};

	var track_height_bar_height = function track_height_bar_height(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-slider__track-part": {
	      margin: (vars$$1.track_height - vars$$1.bar_height) / 2 + "px 0"
	    }
	  });
	};

	var thumb_size_thumb_touch_size = function thumb_size_thumb_touch_size(selector, vars$$1) {
	  var _getThumbSize2 = getThumbSize(vars$$1),
	      normalThumbSize = _getThumbSize2.normalThumbSize;

	  return sel(selector, {
	    " .pe-slider__control:before": {
	      left: -vars$$1.thumb_touch_size / 2 + normalThumbSize / 2 + "px",
	      top: -vars$$1.thumb_touch_size / 2 + normalThumbSize / 2 + "px"
	    }
	  });
	};

	var thumb_size_active_thumb_scale = function thumb_size_active_thumb_scale(selector, vars$$1) {
	  var _getThumbSize3 = getThumbSize(vars$$1),
	      normalThumbSize = _getThumbSize3.normalThumbSize;

	  var _getBorderWidth2 = getBorderWidth(vars$$1),
	      scaledBorderWidth = _getBorderWidth2.scaledBorderWidth;

	  var scaledThumbDiff = (vars$$1.active_thumb_scale - 1) * normalThumbSize / 2;
	  return sel(selector, {
	    ".pe-slider--active:not(.pe-slider--ticks)": {
	      " .pe-slider__control": {
	        borderWidth: scaledBorderWidth + "px"
	      },
	      // left side
	      " .pe-slider__track-value .pe-slider__track-bar-value": {
	        transform: "translateX(" + -scaledThumbDiff + "px)"
	      },
	      // right side
	      " .pe-slider__track-rest .pe-slider__track-bar-value": {
	        transform: "translateX(" + scaledThumbDiff + "px)"
	      }
	    },
	    ".pe-slider--active.pe-slider--ticks": {
	      " .pe-slider__control:after": {
	        borderWidth: 0
	      }
	    }
	  });
	};

	var thumb_size_pin_width = function thumb_size_pin_width(selector, vars$$1) {
	  var _getThumbSize4 = getThumbSize(vars$$1),
	      stepsOffset = _getThumbSize4.stepsOffset;

	  return sel(selector, {
	    " .pe-slider__pin": {
	      margin: "0 " + stepsOffset + "px 0 " + (stepsOffset - vars$$1.pin_width / 2 + 1) + "px"
	    }
	  });
	};

	var varFns$m = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [flex$1.layoutHorizontal, flex$1.flexGrow(1), {
	      userSelect: "none",
	      "-moz-user-select": "none",
	      alignItems: "center",
	      " > .pe-icon": flex$1.layoutCenter,
	      " .pe-slider__track": [flex$1.layoutHorizontal, flex$1.flexGrow(1), {
	        userSelect: "none",
	        "-moz-user-select": "none",
	        position: "relative",
	        outline: 0
	      }],
	      " .pe-slider__control": [flex$1.selfCenter, mixin.defaultTransition("transform, background", ".200s"), {
	        transform: "scale(1)",
	        userSelect: "none",
	        "-moz-user-select": "none",
	        lineHeight: 0,
	        borderRadius: "50%",
	        outline: 0,
	        zIndex: 1,
	        position: "relative",
	        // touch area
	        ":before": {
	          content: "\"\"",
	          position: "absolute",
	          borderRadius: "50%"
	        },
	        // border
	        ":after": {
	          content: "\"\"",
	          position: "absolute",
	          borderRadius: "50%",
	          borderStyle: "solid"
	        }
	      }],
	      " .pe-slider__thumb": [mixin.fit(), {
	        "&, .pe-icon": {
	          width: "inherit",
	          height: "inherit"
	        }
	      }],
	      " .pe-slider__label": {
	        minWidth: vars.unit_icon_size + "px",
	        textAlign: "center",
	        fontSize: "16px",
	        fontWeight: vars.font_weight_medium
	      },
	      " .pe-slider__track-part": [flex$1.flex(), {
	        userSelect: "none",
	        "-moz-user-select": "none",
	        overflow: "hidden" // Firefox otherwise uses 6x at 0%

	      }],
	      " .pe-slider__track-value, .pe-slider__track-rest": flex$1.layoutHorizontal,
	      " .pe-slider__track-bar": [flex$1.flex(), {
	        position: "relative",
	        overflow: "hidden"
	      }],
	      " .pe-slider__track-bar-value": flex$1.flex(),
	      " .pe-slider__ticks": [flex$1.layoutJustified, {
	        userSelect: "none",
	        "-moz-user-select": "none",
	        position: "absolute",
	        left: 0,
	        pointerEvents: "none"
	      }],
	      " .pe-slider__pin": [mixin.defaultTransition("transform", ".11s"), {
	        transform: "translateZ(0) scale(0) translate(0, 0)",
	        transformOrigin: "bottom",
	        position: "absolute",
	        zIndex: 1,
	        height: 0,
	        left: 0,
	        // set in js
	        top: 0,
	        pointerEvents: "none",
	        "&::before, &::after": {
	          position: "absolute",
	          top: 0,
	          left: 0
	        },
	        "::before": {
	          transform: "rotate(-45deg)",
	          content: "\"\"",
	          borderRadius: "50% 50% 50% 0"
	        },
	        "::after": {
	          content: "attr(value)",
	          textAlign: "center"
	        }
	      }],
	      ".pe-slider--pin.pe-slider--active, &.pe-slider--pin.pe-slider--focus": {
	        " .pe-slider__pin": {
	          transform: "translateZ(0) scale(1) translate(0, -24px)"
	        }
	      },
	      ":not(.pe-slider--disabled)": {
	        " .pe-slider__control": {
	          cursor: "pointer"
	        },
	        ".pe-slider--track": {
	          " .pe-slider__track": {
	            cursor: "pointer"
	          }
	        }
	      },
	      ".pe-slider--disabled": {
	        " .pe-slider__control": {
	          borderWidth: 0
	        }
	      }
	    }])];
	  },
	  thumb_size: function thumb_size(selector, vars$$1) {
	    var _getThumbSize5 = getThumbSize(vars$$1),
	        normalThumbSize = _getThumbSize5.normalThumbSize,
	        barOffset = _getThumbSize5.barOffset,
	        stepsOffset = _getThumbSize5.stepsOffset;

	    return [sel(selector, {
	      " .pe-slider__control": {
	        width: normalThumbSize + "px",
	        height: normalThumbSize + "px"
	      },
	      " .pe-slider__track-value .pe-slider__track-bar": {
	        marginLeft: barOffset + "px"
	      },
	      " .pe-slider__track-rest .pe-slider__track-bar": {
	        marginRight: barOffset + "px"
	      },
	      " .pe-slider__ticks": {
	        width: "calc(100% - " + 2 * stepsOffset + "px)",
	        margin: "0 " + stepsOffset + "px"
	      }
	    }), thumb_size_thumb_border_width_disabled_thumb_scale(selector, vars$$1), thumb_size_thumb_touch_size(selector, vars$$1), thumb_size_active_thumb_scale(selector, vars$$1), thumb_size_pin_width(selector, vars$$1)];
	  },
	  active_thumb_scale: function active_thumb_scale(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-slider--active:not(.pe-slider--ticks)": {
	        " .pe-slider__control": {
	          transform: "scale(" + vars$$1.active_thumb_scale + ")"
	        }
	      }
	    }), thumb_size_active_thumb_scale(selector, vars$$1)];
	  },
	  thumb_touch_size: function thumb_touch_size(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__control": {
	        ":before": {
	          width: vars$$1.thumb_touch_size + "px",
	          height: vars$$1.thumb_touch_size + "px"
	        }
	      }
	    }), thumb_size_thumb_touch_size(selector, vars$$1)];
	  },
	  thumb_border_width: function thumb_border_width(selector, vars$$1) {
	    return [sel(selector, {}), thumb_size_thumb_border_width_disabled_thumb_scale(selector, vars$$1)];
	  },
	  disabled_thumb_scale: function disabled_thumb_scale(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-slider--disabled": {
	        " .pe-slider__control": {
	          transform: "scale(" + vars$$1.disabled_thumb_scale + ")"
	        }
	      }
	    }), thumb_size_thumb_border_width_disabled_thumb_scale(selector, vars$$1)];
	  },
	  active_pin_thumb_scale: function active_pin_thumb_scale(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-slider--pin.pe-slider--active, &.pe-slider--pin.pe-slider--focus": {
	        " .pe-slider__control": {
	          transform: "scale(" + vars$$1.active_pin_thumb_scale + ")"
	        }
	      }
	    })];
	  },
	  height: function height(selector, vars$$1) {
	    return [sel(selector, {
	      height: vars$$1.height + "px",
	      " > .pe-icon": {
	        height: vars$$1.height + "px"
	      },
	      " .pe-slider__label": {
	        height: vars$$1.height + "px",
	        lineHeight: vars$$1.height + "px"
	      },
	      " .pe-slider__ticks": {
	        top: vars$$1.height / 2 - 1 + "px"
	      }
	    }), height_track_height(selector, vars$$1)];
	  },
	  track_height: function track_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__track": {
	        height: vars$$1.track_height + "px"
	      }
	    }), height_track_height(selector, vars$$1), track_height_bar_height(selector, vars$$1)];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__track": mixin.defaultTransition("transform", vars$$1.animation_duration),
	      " .pe-slider__control:before": mixin.defaultTransition("background-color", vars$$1.animation_duration),
	      " .pe-slider__control:after": mixin.defaultTransition("border", vars$$1.animation_duration),
	      " .pe-slider__thumb": mixin.defaultTransition("opacity", vars$$1.animation_duration),
	      " .pe-slider__track-bar-value": mixin.defaultTransition("transform, background-color", vars$$1.animation_duration)
	    })];
	  },
	  side_spacing: function side_spacing(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__track": {
	        margin: "0 " + vars$$1.side_spacing + "px"
	      }
	    })];
	  },
	  horizontal_layout_side_spacing: function horizontal_layout_side_spacing(selector, vars$$1) {
	    return [sel(selector, {
	      " div + .pe-slider__track": {
	        margin: "0 " + vars$$1.horizontal_layout_side_spacing + "px"
	      }
	    })];
	  },
	  bar_height: function bar_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__track-part,\
        .pe-slider__track-bar-value,\
        .pe-slider__ticks,\
        .pe-slider__tick": {
	        height: vars$$1.bar_height + "px"
	      }
	    }), track_height_bar_height(selector, vars$$1)];
	  },
	  step_width: function step_width(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__tick": {
	        width: vars$$1.step_width + "px"
	      }
	    })];
	  },
	  pin_width: function pin_width(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__pin": {
	        width: vars$$1.pin_width + "px",
	        "::before": {
	          width: vars$$1.pin_width + "px",
	          height: vars$$1.pin_width + "px"
	        },
	        "::after": {
	          width: vars$$1.pin_width + "px",
	          height: vars$$1.pin_height + "px",
	          lineHeight: vars$$1.pin_width + "px"
	        }
	      }
	    }), thumb_size_pin_width(selector, vars$$1)];
	  },
	  pin_font_size: function pin_font_size(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-slider__pin::after": {
	        fontSize: vars$$1.pin_font_size + "px"
	      }
	    })];
	  }
	};
	var layout$j = createLayout({
	  varFns: varFns$m
	}); // @ts-check

	var lightForeground = vars.color_light_foreground;
	var darkForeground = vars.color_dark_foreground;
	var activeColor = vars.color_primary; // or override in CSS by setting 'color' property on '.pe-slider'

	var thumb_size = 12;
	var thumb_touch_size = Math.max(40, thumb_size);
	var thumb_border_width = 2;
	var active_thumb_scale = 3 / 2;
	var disabled_thumb_scale = 1 / 2;
	var active_pin_thumb_scale = 2 / 6;
	var largestThumbSize = active_thumb_scale * thumb_size;
	var largestElement = Math.max(thumb_touch_size, largestThumbSize);
	var height$1 = Math.max(52, largestThumbSize);
	var side_spacing = Math.max(10, largestElement / 2 - thumb_size / 2);
	var horizontal_layout_side_spacing = side_spacing + 4; // optimization for horizontal layout

	var vars$1$2 = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  active_pin_thumb_scale: active_pin_thumb_scale,
	  active_thumb_scale: active_thumb_scale,
	  animation_duration: vars.animation_duration,
	  bar_height: 2,
	  disabled_thumb_scale: disabled_thumb_scale,
	  height: height$1,
	  horizontal_layout_side_spacing: horizontal_layout_side_spacing,
	  pin_font_size: 10,
	  pin_height: 32,
	  pin_width: 26,
	  side_spacing: side_spacing,
	  step_width: 2,
	  thumb_border_width: thumb_border_width,
	  thumb_size: thumb_size,
	  thumb_touch_size: thumb_touch_size,
	  track_height: height$1,
	  color_light_track_active: rgba(lightForeground, .38),
	  color_light_track_inactive: rgba(lightForeground, .26),
	  color_light_track_value: "currentColor",
	  // background color may be set in theme; disabled by default
	  // color_light_thumb_background:        undefined,
	  color_light_thumb_off: rgba(lightForeground, .26),
	  color_light_thumb_off_focus: rgba(lightForeground),
	  color_light_thumb_off_focus_opacity: .08,
	  color_light_thumb_on: rgba(activeColor),
	  color_light_thumb_on_focus_opacity: .11,
	  color_light_thumb_inactive: rgba(lightForeground, .26),
	  color_light_tick: rgba(lightForeground, 1),
	  color_light_tick_value: rgba(lightForeground, 1),
	  color_light_icon: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_disabled_icon: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  color_light_label: rgba(vars.color_light_foreground, vars.blend_light_text_secondary),
	  color_light_disabled_label: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  color_light_pin_label: "#fff",
	  color_light_pin_background: "currentColor",
	  color_dark_track_active: rgba(darkForeground, .3),
	  color_dark_track_inactive: rgba(darkForeground, .2),
	  color_dark_track_value: "currentColor",
	  // background color may be set in theme; disabled by default
	  // color_dark_thumb_background:         undefined,
	  color_dark_thumb_off: rgba(darkForeground, .2),
	  color_dark_thumb_off_focus: rgba(darkForeground),
	  color_dark_thumb_off_focus_opacity: .08,
	  color_dark_thumb_on: rgba(activeColor),
	  color_dark_thumb_on_focus_opacity: .11,
	  color_dark_thumb_inactive: rgba(darkForeground, .2),
	  color_dark_tick: rgba(darkForeground, 1),
	  color_dark_tick_value: rgba(darkForeground, 1),
	  color_dark_icon: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_disabled_icon: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled),
	  color_dark_label: rgba(vars.color_dark_foreground, vars.blend_dark_text_secondary),
	  color_dark_disabled_label: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled),
	  color_dark_pin_label: "#fff",
	  color_dark_pin_background: "currentColor"
	}; // @ts-check

	var fns$m = [layout$j, color$g];
	var selector$n = ".".concat(classes$10.component);
	styler.addStyle({
	  selectors: [selector$n],
	  fns: fns$m,
	  vars: vars$1$2
	});

	function _defineProperty$W(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread$A(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty$W(target, key, source[key]);
	    });
	  }

	  return target;
	}

	var notificationClasses$1 = {
	  component: "pe-notification",
	  // elements
	  action: "pe-notification__action",
	  content: "pe-notification__content",
	  holder: "pe-notification__holder",
	  placeholder: "pe-notification__placeholder",
	  title: "pe-notification__title",
	  // states
	  hasContainer: "pe-notification--container",
	  horizontal: "pe-notification--horizontal",
	  multilineTitle: "pe-notification__title--multi-line",
	  vertical: "pe-notification--vertical",
	  visible: "pe-notification--visible"
	};

	var classes$11 = _objectSpread$A({}, notificationClasses$1, {
	  component: "pe-notification pe-snackbar",
	  // elements
	  holder: "pe-snackbar__holder",
	  placeholder: "pe-snackbar__placeholder",
	  // states
	  open: "pe-snackbar--open"
	}); // @ts-check


	var color$1$6 = createColor({
	  superColor: color$d
	});
	var varFns$n = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [flex$1.layoutCenterCenter, {
	      position: "fixed",
	      top: "auto",
	      right: 0,
	      bottom: 0,
	      left: 0,
	      zIndex: vars.z_notification,
	      pointerEvents: "none",
	      justifyContent: "flex-start",
	      // For IE11
	      width: "100%"
	    }]), _defineProperty$W({}, ".pe-notification--container ".concat(selector), {
	      position: "relative"
	    })];
	  }
	};
	var holderLayout$1 = createLayout({
	  varFns: varFns$n
	});

	var breakpoint = function breakpoint(breakpointSel) {
	  return function (selector, o) {
	    return _defineProperty$W({}, breakpointSel, _defineProperty$W({}, selector, o));
	  };
	};

	var breakpointTabletPortraitUp = breakpoint("@media (min-width: ".concat(vars.breakpoint_for_tablet_portrait_up, "px)"));
	var varFns$1$3 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      width: "100%",
	      opacity: 1,
	      " .pe-notification__content": {
	        width: "100%",
	        margin: "0 auto",
	        borderBottomLeftRadius: 0,
	        borderBottomRightRadius: 0
	      }
	    }), breakpointTabletPortraitUp(selector, {
	      ".pe-notification--horizontal": {
	        " .pe-notification__title": {
	          paddingRight: "30px"
	        }
	      }
	    })];
	  },
	  min_width: function min_width(selector, vars$$1) {
	    return [breakpointTabletPortraitUp(selector, {
	      minWidth: vars$$1.min_width + "px"
	    })];
	  },
	  max_width: function max_width(selector, vars$$1) {
	    return [breakpointTabletPortraitUp(selector, {
	      maxWidth: vars$$1.max_width + "px"
	    })];
	  },
	  border_radius: function border_radius(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-notification__content": {
	        borderTopLeftRadius: vars$$1.border_radius + "px",
	        borderTopRightRadius: vars$$1.border_radius + "px",
	        borderBottomLeftRadius: 0,
	        borderBottomRightRadius: 0
	      }
	    })];
	  }
	};
	var layout$k = createLayout({
	  varFns: varFns$1$3,
	  customVarFns: customLayoutFns
	}); // @ts-check

	/**
	 * @type {SnackbarVars} snackbarVars
	 */

	var snackbarVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_hide_css: "",
	  animation_show_css: "",
	  border_radius: 0,
	  max_width: 568,
	  min_height: 0,
	  min_width: 288,
	  color_light_background: rgba(vars.color_light_background),
	  color_dark_background: rgba(vars.color_dark_background)
	}; // @ts-check

	var fns$n = [layout$k, color$1$6];
	var selector$o = ".".concat(classes$11.component.replace(/ /g, "."));
	var holderFns$1 = [holderLayout$1];
	var holderSelector$1 = ".".concat(classes$11.holder.replace(/ /g, "."));

	styler.addStyle({
	  selectors: [holderSelector$1],
	  fns: holderFns$1,
	  vars: snackbarVars
	});
	styler.addStyle({
	  selectors: [selector$o],
	  fns: fns$n,
	  vars: snackbarVars
	});

	var classes$12 = {
	  component: "pe-svg"
	};

	function _defineProperty$X(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$X() {
	  _extends$X = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$X.apply(this, arguments);
	}

	var generalFns$k = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      color: "inherit",
	      " svg": {
	        color: "inherit",
	        " path, rect, circle, polygon": {
	          "&:not([fill=none])": {
	            fill: "currentcolor"
	          }
	        }
	      }
	    })];
	  }
	};

	var tintFns$k = function tintFns(tint) {
	  return _defineProperty$X({}, "color_" + tint, function (selector, vars) {
	    return [sel(selector, {
	      " svg": {
	        " path, rect, circle, polygon": {
	          "&:not([fill=none])": {
	            fill: vars["color_" + tint]
	          }
	        }
	      }
	    })];
	  });
	};

	var lightTintFns$k = _extends$X({}, generalFns$k, tintFns$k("light"));

	var darkTintFns$k = _extends$X({}, generalFns$k, tintFns$k("dark"));

	var color$h = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$k,
	    darkTintFns: darkTintFns$k
	  }
	}); // @ts-check

	var varFns$o = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      lineHeight: 1,
	      " > div, svg": {
	        width: "inherit",
	        height: "inherit"
	      }
	    })];
	  }
	};
	var layout$l = createLayout({
	  varFns: varFns$o
	}); // @ts-check

	/**
	 * @typedef {import("../index").SVGVars} SVGVars
	 */

	/**
	 * @type {SVGVars} svgVars
	 */

	var svgVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  color_light: "currentcolor",
	  color_dark: "currentcolor"
	}; // @ts-check

	var fns$o = [layout$l, color$h];
	var selector$p = ".".concat(classes$12.component);
	var addStyle$q = styler.createAddStyle(selector$p, fns$o, svgVars);
	styler.addStyle({
	  selectors: [selector$p],
	  fns: fns$o,
	  vars: svgVars
	});

	var classes$13 = {
	  component: "pe-switch-control",
	  // elements
	  knob: "pe-switch-control__knob",
	  thumb: "pe-switch-control__thumb",
	  track: "pe-switch-control__track"
	};

	function _defineProperty$Y(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$Y() {
	  _extends$Y = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$Y.apply(this, arguments);
	}

	var generalFns$l = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-switch-control__knob": {
	          backgroundColor: "currentcolor"
	        },
	        " .pe-icon": {
	          color: "currentcolor"
	        }
	      },
	      ".pe-control--on": {
	        " .pe-switch-control__knob": {
	          backgroundColor: "currentcolor"
	        },
	        " .pe-icon": {
	          color: "currentcolor"
	        }
	      }
	    })];
	  }
	};

	var tintFns$l = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$Y(_ref, "color_" + tint + "_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-control__label": {
	        color: vars$$1["color_" + tint + "_label"]
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_track_off", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-switch-control__track": {
	          backgroundColor: vars$$1["color_" + tint + "_track_off"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_track_off_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-switch-control__track": {
	          opacity: vars$$1["color_" + tint + "_track_off_opacity"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_thumb_off", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-switch-control__thumb": {
	          color: vars$$1["color_" + tint + "_thumb_off"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_focus_off", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-button--focus": {
	          " .pe-button__focus": {
	            backgroundColor: vars$$1["color_" + tint + "_focus_off"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_focus_off_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-button--focus": {
	          " .pe-button__focus": {
	            opacity: vars$$1["color_" + tint + "_focus_off_opacity"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_icon_off", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-icon": {
	          color: vars$$1["color_" + tint + "_icon_off"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_off_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-control__label": {
	          color: vars$$1["color_" + tint + "_off_label"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_track_on", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-switch-control__track": {
	          backgroundColor: vars$$1["color_" + tint + "_track_on"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_track_on_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-switch-control__track": {
	          opacity: vars$$1["color_" + tint + "_track_on_opacity"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_thumb_on", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-switch-control__thumb": {
	          color: vars$$1["color_" + tint + "_thumb_on"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_focus_on", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-button--focus": {
	          " .pe-button__focus": {
	            backgroundColor: vars$$1["color_" + tint + "_focus_on"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_focus_on_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-button--focus": {
	          " .pe-button__focus": {
	            opacity: vars$$1["color_" + tint + "_focus_on_opacity"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_icon_on", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-icon": {
	          color: vars$$1["color_" + tint + "_icon_on"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_on_label", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-control__label": {
	          color: vars$$1["color_" + tint + "_on_label"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_disabled", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on.pe-control--disabled, &.pe-control--off.pe-control--disabled": {
	        " .pe-control__label": {
	          color: vars$$1["color_" + tint + "_disabled"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_track_disabled", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on.pe-control--disabled, &.pe-control--off.pe-control--disabled": {
	        " .pe-switch-control__track": {
	          backgroundColor: vars$$1["color_" + tint + "_track_disabled"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_track_disabled_opacity", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on.pe-control--disabled, &.pe-control--off.pe-control--disabled": {
	        " .pe-switch-control__track": {
	          opacity: vars$$1["color_" + tint + "_track_disabled_opacity"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref, "color_" + tint + "_thumb_disabled", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on.pe-control--disabled, &.pe-control--off.pe-control--disabled": {
	        " .pe-switch-control__thumb, .pe-button__content": {
	          color: vars$$1["color_" + tint + "_thumb_disabled"]
	        }
	      }
	    })];
	  }), _ref;
	};

	var hoverTintFns$3 = function hoverTintFns(tint) {
	  var _ref2;

	  return _ref2 = {}, _defineProperty$Y(_ref2, "color_" + tint + "_wash_on", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--on": {
	        " .pe-button__wash": {
	          backgroundColor: vars$$1["color_" + tint + "_wash_on"]
	        }
	      }
	    })];
	  }), _defineProperty$Y(_ref2, "color_" + tint + "_wash_off", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-control--off": {
	        " .pe-button__wash": {
	          backgroundColor: vars$$1["color_" + tint + "_wash_off"]
	        }
	      }
	    })];
	  }), _ref2;
	};

	var lightTintFns$l = _extends$Y({}, generalFns$l, tintFns$l("light"));

	var darkTintFns$l = _extends$Y({}, generalFns$l, tintFns$l("dark"));

	var lightTintHoverFns$3 = hoverTintFns$3("light");
	var darkTintHoverFns$3 = hoverTintFns$3("dark");
	var color$i = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$l,
	    darkTintFns: darkTintFns$l,
	    lightTintHoverFns: lightTintHoverFns$3,
	    darkTintHoverFns: darkTintHoverFns$3
	  }
	});

	var transition$1 = function transition(vars$$1, properties) {
	  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : vars$$1.animation_duration;
	  return mixin.defaultTransition(properties, duration, "ease-out");
	};

	var getSizeData = function getSizeData(vars$$1, size) {
	  var factor = size / vars.unit_icon_size;
	  var thumbSize = Math.floor(0.5 * vars$$1.thumb_size * factor) * 2; // round to even

	  var scaledTrackHeight = Math.floor(0.5 * vars$$1.track_height * factor) * 2; // round to even

	  var scaledTrackWidth = Math.floor(0.5 * vars$$1.track_length * factor) * 2;
	  var scaledThumbSize = Math.floor(0.5 * vars$$1.thumb_size * factor) * 2;
	  var trackTop = (vars$$1.label_height * factor - scaledTrackHeight) / 2;
	  var thumbPadding = vars$$1.icon_button_padding;
	  var thumbMargin = (size - scaledThumbSize) / 2;
	  var thumbOuterSize = size + 2 * thumbPadding;
	  var thumbOffsetMin = -(thumbOuterSize / 2) + thumbSize / 2;
	  var thumbOffsetMax = thumbOffsetMin + scaledTrackWidth - thumbSize;
	  var thumbOffsetY = thumbOffsetMin + thumbMargin;
	  var trackVisualOffset = 0.3; // prevent sub pixel of track to shine through knob border

	  return {
	    factor: factor,
	    scaledThumbSize: scaledThumbSize,
	    scaledTrackHeight: scaledTrackHeight,
	    scaledTrackWidth: scaledTrackWidth,
	    size: size,
	    thumbMargin: thumbMargin,
	    thumbOffsetMax: thumbOffsetMax,
	    thumbOffsetMin: thumbOffsetMin,
	    thumbOffsetY: thumbOffsetY,
	    thumbPadding: thumbPadding,
	    trackTop: trackTop,
	    trackVisualOffset: trackVisualOffset
	  };
	};

	var customSize = function customSize(vars$$1, _ref) {
	  var scaledThumbSize = _ref.scaledThumbSize,
	      scaledTrackHeight = _ref.scaledTrackHeight,
	      scaledTrackWidth = _ref.scaledTrackWidth,
	      size = _ref.size,
	      thumbMargin = _ref.thumbMargin,
	      thumbOffsetY = _ref.thumbOffsetY,
	      thumbPadding = _ref.thumbPadding,
	      trackTop = _ref.trackTop,
	      trackVisualOffset = _ref.trackVisualOffset;
	  return {
	    " .pe-control__form-label": {
	      height: size + "px",
	      minWidth: scaledTrackWidth + "px"
	    },
	    " .pe-switch-control__track": {
	      height: scaledTrackHeight + "px",
	      width: scaledTrackWidth - 2 * trackVisualOffset + "px",
	      top: trackTop + "px",
	      borderRadius: scaledTrackHeight + "px"
	    },
	    " .pe-switch-control__thumb": {
	      top: thumbOffsetY + "px"
	    },
	    " .pe-switch-control__knob": {
	      width: scaledThumbSize + "px",
	      height: scaledThumbSize + "px",
	      margin: thumbMargin + "px"
	    },
	    " .pe-button__content": {
	      padding: thumbPadding + "px"
	    }
	  };
	};

	var customSpacing = function customSpacing(vars$$1, _ref2, isRTL) {
	  var _peControl__label, _peSwitchControl_, _peSwitchControl_2, _peSwitchControl_3;

	  var factor = _ref2.factor,
	      scaledTrackWidth = _ref2.scaledTrackWidth,
	      thumbOffsetMax = _ref2.thumbOffsetMax,
	      thumbOffsetMin = _ref2.thumbOffsetMin,
	      trackVisualOffset = _ref2.trackVisualOffset;
	  return {
	    " .pe-control__label": (_peControl__label = {}, _defineProperty$Y(_peControl__label, isRTL ? "paddingRight" : "paddingLeft", vars$$1.padding * factor + 8 + scaledTrackWidth + "px"), _defineProperty$Y(_peControl__label, isRTL ? "paddingLeft" : "paddingRight", 0), _peControl__label),
	    " .pe-switch-control__track": (_peSwitchControl_ = {}, _defineProperty$Y(_peSwitchControl_, isRTL ? "right" : "left", trackVisualOffset + "px"), _defineProperty$Y(_peSwitchControl_, isRTL ? "left" : "right", "auto"), _peSwitchControl_),
	    " .pe-switch-control__thumb": (_peSwitchControl_2 = {}, _defineProperty$Y(_peSwitchControl_2, isRTL ? "right" : "left", thumbOffsetMin + "px"), _defineProperty$Y(_peSwitchControl_2, isRTL ? "left" : "right", "auto"), _peSwitchControl_2),
	    ".pe-control--on": {
	      " .pe-switch-control__thumb": (_peSwitchControl_3 = {}, _defineProperty$Y(_peSwitchControl_3, isRTL ? "right" : "left", thumbOffsetMax + "px"), _defineProperty$Y(_peSwitchControl_3, isRTL ? "left" : "right", "auto"), _peSwitchControl_3)
	    }
	  };
	};

	var alignSide$7 = function alignSide(isRTL) {
	  return function () {
	    var _peSwitchControl_4;

	    return {
	      " .pe-switch-control__track": (_peSwitchControl_4 = {}, _defineProperty$Y(_peSwitchControl_4, isRTL ? "right" : "left", 0), _defineProperty$Y(_peSwitchControl_4, isRTL ? "left" : "right", "auto"), _peSwitchControl_4)
	    };
	  };
	};

	var alignLeft$7 = alignSide$7(false);
	var alignRight$7 = alignSide$7(true);

	var createSize = function createSize(selector, vars$$1) {
	  var sizeData = {
	    small: getSizeData(vars$$1, vars.unit_icon_size_small),
	    regular: getSizeData(vars$$1, vars.unit_icon_size),
	    medium: getSizeData(vars$$1, vars.unit_icon_size_medium),
	    large: getSizeData(vars$$1, vars.unit_icon_size_large)
	  };
	  return [sel(selector, {
	    ".pe-control--small": [customSize(vars$$1, sizeData.small), customSpacing(vars$$1, sizeData.small, false)],
	    ".pe-control--regular": [customSize(vars$$1, sizeData.regular), customSpacing(vars$$1, sizeData.regular, false)],
	    ".pe-control--medium": [customSize(vars$$1, sizeData.medium), customSpacing(vars$$1, sizeData.medium, false)],
	    ".pe-control--large": [customSize(vars$$1, sizeData.large), customSpacing(vars$$1, sizeData.large, false)]
	  }), _defineProperty$Y({}, "*[dir=rtl] ".concat(selector, ", .pe-rtl ").concat(selector), [alignRight$7(), {
	    ".pe-control--small": [customSpacing(vars$$1, sizeData.small, true)],
	    ".pe-control--regular": [customSpacing(vars$$1, sizeData.regular, true)],
	    ".pe-control--medium": [customSpacing(vars$$1, sizeData.medium, true)],
	    ".pe-control--large": [customSpacing(vars$$1, sizeData.large, true)]
	  }])];
	};

	var varFns$p = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [alignLeft$7(), {
	      " .pe-switch-control__track": [{
	        position: "absolute"
	      }],
	      " .pe-switch-control__thumb": {
	        position: "absolute",
	        zIndex: 1,
	        // Prevents flickering of text label when toggling
	        color: "inherit",
	        ":focus": {
	          outline: 0
	        }
	      },
	      " .pe-switch-control__knob": {
	        position: "relative",
	        borderRadius: "50%"
	      },
	      " .pe-icon-button .pe-button__content": {
	        transition: "none",
	        " .pe-switch-control__knob .pe-icon": [mixin.fit(), {
	          width: "100%",
	          height: "100%"
	        }]
	      }
	    }]), _defineProperty$Y({}, "_:-ms-fullscreen, :root ".concat(selector), {
	      " input": {
	        position: "absolute",
	        zIndex: 1,
	        width: "100%",
	        height: "100%",
	        left: 0,
	        top: 0,
	        right: 0,
	        bottom: 0,
	        display: "block",
	        opacity: 0,
	        cursor: "pointer"
	      },
	      " label": {
	        cursor: "auto"
	      }
	    })];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-switch-control__track, .pe-switch-control__thumb, .pe-control__label, .pe-button__focus": transition$1(vars$$1, "all")
	    })];
	  },
	  createSize: createSize
	};

	var withCreateSizeVar = function withCreateSizeVar(vars$$1) {
	  return vars$$1.thumb_size || vars$$1.track_height || vars$$1.track_length || vars$$1.label_height || vars$$1.icon_button_padding ? _extends$Y({}, vars$$1, {
	    createSize: true
	  }) : vars$$1;
	};

	var layout$1$6 = createLayout({
	  varFns: varFns$p,
	  superLayout: layout$6,
	  varMixin: withCreateSizeVar
	}); // @ts-check

	/**
	 * @type {SwitchVars} switchVars
	 */

	var switchVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_duration: vars.animation_duration,
	  hit_area_padding: (vars.grid_unit_icon_button - vars.unit_icon_size) / 2,
	  // 12
	  icon_button_padding: iconButtonVars.padding,
	  padding: vars.grid_unit_component,
	  thumb_size: 20,
	  track_height: 14,
	  track_length: 36,
	  label_height: vars$1$1.label_height,
	  color_light_thumb_on: rgba(vars.color_primary),
	  color_light_thumb_off: "#f1f1f1",
	  color_light_thumb_disabled: "#eee",
	  color_light_wash_on: rgba(vars.color_primary, vars.blend_light_background_active),
	  color_light_wash_off: iconButtonVars.color_light_wash_background,
	  color_light_track_on: rgba(vars.color_primary_faded),
	  color_light_track_on_opacity: .55,
	  color_light_track_off: rgba(vars.color_light_foreground, vars.blend_light_text_regular),
	  color_light_track_off_opacity: .55,
	  color_light_track_disabled: rgba(vars.color_light_foreground, vars.blend_light_background_disabled),
	  color_light_track_disabled_opacity: 1,
	  // icon color may be set in theme; default "currentcolor"
	  // color_light_icon_on:                   "currentcolor",
	  // color_light_icon_off:                  "currentcolor",
	  // color_light_focus_on and so on taken from selectionControlVars
	  color_dark_thumb_on: rgba(vars.color_primary),
	  color_dark_thumb_off: "#bdbdbd",
	  color_dark_thumb_disabled: "#555",
	  color_dark_wash_on: rgba(vars.color_primary, vars.blend_dark_background_active),
	  color_dark_wash_off: iconButtonVars.color_dark_wash_background,
	  color_dark_track_on: rgba(vars.color_primary_faded, vars.blend_dark_text_tertiary),
	  // or "#5a7f7c"
	  color_dark_track_on_opacity: 9,
	  color_dark_track_off: "#717171",
	  color_dark_track_off_opacity: .55,
	  color_dark_track_disabled: "#717171",
	  color_dark_track_disabled_opacity: .3 // icon color may be set in theme; default "currentcolor"
	  // color_dark_icon_on:                    "currentcolor"
	  // color_dark_icon_off:                   "currentcolor"
	  // color_dark_focus_on and so on taken from selectionControlVars

	}; // @ts-check

	var fns$p = [layout$1$6, color$i];
	var selector$q = ".".concat(classes$13.component);
	styler.addStyle({
	  selectors: [selector$q],
	  fns: fns$p,
	  vars: switchVars
	});

	var buttonClasses$3 = {
	  component: "pe-text-button",
	  super: "pe-button",
	  row: "pe-button-row",
	  // elements      
	  content: "pe-button__content",
	  label: "pe-button__label",
	  textLabel: "pe-button__text-label",
	  wash: "pe-button__wash",
	  dropdown: "pe-button__dropdown",
	  // states      
	  border: "pe-button--border",
	  contained: "pe-button--contained",
	  disabled: "pe-button--disabled",
	  dropdownClosed: "pe-button--dropdown-closed",
	  dropdownOpen: "pe-button--dropdown-open",
	  extraWide: "pe-button--extra-wide",
	  hasDropdown: "pe-button--dropdown",
	  highLabel: "pe-button--high-label",
	  inactive: "pe-button--inactive",
	  raised: "pe-button--raised",
	  selected: "pe-button--selected",
	  separatorAtStart: "pe-button--separator-start"
	};
	var classes$14 = {
	  component: "pe-tabs",
	  // elements
	  indicator: "pe-tabs__indicator",
	  scrollButton: "pe-tabs__scroll-button",
	  scrollButtonAtEnd: "pe-tabs__scroll-button-end",
	  scrollButtonAtStart: "pe-tabs__scroll-button-start",
	  tab: "pe-tab",
	  tabContent: "pe-tabs__tab-content",
	  tabRow: "pe-tabs__row",
	  // states
	  activeSelectable: "pe-tabs__active--selectable",
	  isAtEnd: "pe-tabs--end",
	  isAtStart: "pe-tabs--start",
	  isAutofit: "pe-tabs--autofit",
	  isMenu: "pe-tabs--menu",
	  scrollable: "pe-tabs--scrollable",
	  compactTabs: "pe-tabs--compact",
	  tabHasIcon: "pe-tabs__tab--icon",
	  tabRowCentered: "pe-tabs__row--centered",
	  tabRowIndent: "pe-tabs__row--indent",
	  // lookup
	  label: buttonClasses$3.label
	};

	function _defineProperty$Z(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$Z() {
	  _extends$Z = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$Z.apply(this, arguments);
	}

	var generalFns$m = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      ".pe-button--selected": {
	        " .pe-button__content": {
	          background: "transparent"
	        }
	      }
	    })];
	  }
	};

	var tintFns$m = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$Z(_ref, "color_" + tint + "_selected", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--selected": {
	        " .pe-button__content": {
	          color: vars$$1["color_" + tint + "_selected"]
	        }
	      }
	    })];
	  }), _defineProperty$Z(_ref, "color_" + tint + "_selected_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-button--selected": {
	        " .pe-button__content": {
	          background: vars$$1["color_" + tint + "_selected_background"]
	        }
	      }
	    })];
	  }), _defineProperty$Z(_ref, "color_" + tint + "_icon", function (selector, vars$$1) {
	    return [sel(selector, {
	      ":not(.pe-button--selected) .pe-icon": {
	        color: vars$$1["color_" + tint + "_icon"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$m = _extends$Z({}, generalFns$m, tintFns$m("light"));

	var darkTintFns$m = _extends$Z({}, generalFns$m, tintFns$m("dark"));

	var tabColor = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$m,
	    darkTintFns: darkTintFns$m
	  }
	});

	var tab_label_transition_property_animation_duration = function tab_label_transition_property_animation_duration(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-button__content": mixin.defaultTransition(vars$$1.tab_label_transition_property, vars$$1.animation_duration)
	  });
	};

	var varFns$q = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [flex$1.flex(), flex$1.flexIndex("none"), {
	      userSelect: "none",
	      "-moz-user-select": "none",
	      margin: 0,
	      borderRadius: 0,
	      padding: 0,
	      " .pe-button__content": {
	        lineHeight: vars.line_height + "em",
	        borderRadius: 0,
	        position: "relative",
	        " .pe-button__label, .pe-icon": {
	          overflow: "hidden",
	          whiteSpace: "normal"
	        },
	        " .pe-button__label": {
	          padding: 0,
	          width: "100%" // for IE 11

	        },
	        " .pe-icon": {
	          marginLeft: "auto",
	          marginRight: "auto"
	        },
	        " .pe-button__focus": {
	          display: "none"
	        }
	      },
	      ".pe-tabs__tab--icon": {
	        "&, .pe-button__content": {
	          " .pe-button__content, .pe-icon": {
	            margin: "0 auto"
	          }
	        }
	      },
	      ".pe-tabs--menu &": {
	        "&, &.pe-tabs__tab--icon, &.pe-text-button": {
	          minWidth: 0,
	          " .pe-button__content": {
	            " .pe-icon": {
	              marginBottom: 0
	            },
	            " .pe-button__content": {
	              fontSize: "10px",
	              lineHeight: "12px",
	              textTransform: "none"
	            }
	          }
	        }
	      },
	      ".pe-tabs--compact &": {
	        minWidth: "initial"
	      },
	      " .pe-tabs__tab-content": [flex$1.layoutCenterCenter, flex$1.layoutVertical, {
	        height: "inherit"
	      }],
	      ".pe-tabs--autofit &": [flex$1.flex(), {
	        minWidth: "initial",
	        maxWidth: "none"
	      }],
	      ".pe-tabs__active--selectable &": {
	        ".pe-button--selected": {
	          cursor: "pointer",
	          pointerEvents: "initial"
	        }
	      }
	    }])];
	  },
	  tab_height: function tab_height(selector, vars$$1) {
	    return [sel(selector, {
	      height: vars$$1.tab_height + "px",
	      " .pe-button__content": {
	        height: vars$$1.tab_height + "px"
	      }
	    })];
	  },
	  tab_min_width: function tab_min_width(selector, vars$$1) {
	    return [sel(selector, {
	      minWidth: vars$$1.tab_min_width + "px" // for smaller screens, see also media query

	    })];
	  },
	  tab_max_width: function tab_max_width(selector, vars$$1) {
	    return [sel(selector, {
	      maxWidth: isNaN(vars$$1.tab_max_width) ? vars$$1.tab_max_width : vars$$1.tab_max_width + "px"
	    })];
	  },
	  tab_min_width_tablet: function tab_min_width_tablet(selector, vars$$1) {
	    return _defineProperty$Z({}, "@media (min-width: " + vars.breakpoint_for_tablet_landscape_up + "px)", _defineProperty$Z({}, ".pe-tabs:not(.pe-tabs--small):not(.pe-tabs--menu):not(.pe-tabs--autofit):not(.pe-tabs--scrollable):not(.pe-tabs--compact) ".concat(selector), {
	      minWidth: vars$$1.tab_min_width_tablet + "px"
	    }));
	  },
	  tab_icon_label_height: function tab_icon_label_height(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-tabs__tab--icon": {
	        "&, .pe-button__content": {
	          height: vars$$1.tab_icon_label_height + "px"
	        }
	      }
	    })];
	  },
	  tab_label_transition_property: function tab_label_transition_property(selector, vars$$1) {
	    return [tab_label_transition_property_animation_duration(selector, vars$$1)];
	  },
	  animation_duration: function animation_duration(selector, vars$$1) {
	    return [tab_label_transition_property_animation_duration(selector, vars$$1)];
	  },
	  tab_content_padding_v: function tab_content_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        padding: "0 " + vars$$1.tab_content_padding_v + "px"
	      }
	    })];
	  },
	  label_max_width: function label_max_width(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        " .pe-button__label, .pe-icon": {
	          maxWidth: vars$$1.label_max_width + "px" // or .pe-tabs width minus 56dp

	        }
	      }
	    })];
	  },
	  tab_label_line_height: function tab_label_line_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        " .pe-button__label, .pe-icon": {
	          lineHeight: vars$$1.tab_label_line_height + "px",
	          maxHeight: 2 * vars$$1.tab_label_line_height + "px"
	        }
	      }
	    })];
	  },
	  tab_label_vertical_offset: function tab_label_vertical_offset(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-button__content": {
	        " .pe-button__label": {
	          margin: vars$$1.tab_label_vertical_offset + "px 0 0 0"
	        }
	      }
	    })];
	  },
	  tab_icon_label_icon_spacing: function tab_icon_label_icon_spacing(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-tabs__tab--icon": {
	        "&, .pe-button__content": {
	          " .pe-icon": {
	            marginBottom: vars$$1.tab_icon_label_icon_spacing + "px"
	          }
	        }
	      }
	    })];
	  },
	  menu_tab_height: function menu_tab_height(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-tabs--menu &": {
	        // reset sizes to fit within a small space
	        height: vars$$1.menu_tab_height + "px",
	        "&, &.pe-tabs__tab--icon, &.pe-text-button": {
	          " .pe-button__content": {
	            height: vars$$1.menu_tab_height + "px"
	          }
	        }
	      }
	    })];
	  },
	  menu_tab_icon_label_height: function menu_tab_icon_label_height(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-tabs--menu &": {
	        "&.pe-tabs__tab--icon": {
	          height: vars$$1.menu_tab_icon_label_height + "px"
	        }
	      }
	    })];
	  },
	  tab_menu_content_padding_v: function tab_menu_content_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-tabs--menu &": {
	        "&, &.pe-tabs__tab--icon, &.pe-text-button": {
	          " .pe-button__content": {
	            padding: "0 " + vars$$1.tab_menu_content_padding_v + "px"
	          }
	        }
	      }
	    })];
	  }
	};
	var tabLayout = createLayout({
	  varFns: varFns$q
	});
	var generalFns$1$2 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-tabs__scroll-button": {
	        color: "inherit"
	      },
	      " .pe-no-touch &": {
	        ".pe-tabs--scrollable": {
	          backgroundColor: "inherit"
	        },
	        " .pe-tabs__scroll-button": {
	          backgroundColor: "inherit",
	          " .pe-button__content": {
	            backgroundColor: "inherit"
	          }
	        }
	      }
	    })];
	  }
	};

	var tintFns$1$2 = function tintFns(tint) {
	  return _defineProperty$Z({}, "color_" + tint + "_tab_indicator", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-tabs__indicator": {
	        backgroundColor: vars$$1["color_" + tint + "_tab_indicator"]
	      }
	    })];
	  });
	};

	var lightTintFns$1$2 = _extends$Z({}, generalFns$1$2, tintFns$1$2("light"));

	var darkTintFns$1$2 = _extends$Z({}, generalFns$1$2, tintFns$1$2("dark"));

	var tabsColor = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$1$2,
	    darkTintFns: darkTintFns$1$2
	  }
	});

	var alignSide$8 = function alignSide(isRTL) {
	  return function () {
	    return {
	      " .pe-tabs__indicator": _defineProperty$Z({
	        transformOrigin: isRTL ? "right 50%" : "left 50%"
	      }, isRTL ? "right" : "left", 0)
	    };
	  };
	};

	var alignLeft$8 = alignSide$8(false);
	var alignRight$8 = alignSide$8(true);

	var _tabs_indent = function tabs_indent(selector, vars$$1, isRTL) {
	  return sel(selector, {
	    " .pe-tabs__row": {
	      ".pe-tabs__row--indent": _defineProperty$Z({}, isRTL ? "paddingRight" : "paddingLeft", vars$$1.tabs_indent + "px")
	    }
	  });
	};

	var varFns$1$4 = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [alignLeft$8(), {
	      userSelect: "none",
	      "-moz-user-select": "none",
	      transform: "translate3d(0,0,0)",
	      "-webkit-overflow-scrolling": "touch",
	      "& ::-webkit-scrollbar": {
	        "display": "none"
	      },
	      ".pe-tabs--scrollable": {
	        display: "flex",
	        "-ms-overflow-style": "none",
	        " .pe-tabs__scroll-button": {
	          // default hide, show with html.pe-no-touch
	          display: "none"
	        },
	        " .pe-tabs__tab": {
	          minWidth: 0
	        }
	      },
	      " .pe-no-touch &": {
	        " .pe-tabs__scroll-button": {
	          position: "relative",
	          display: "block",
	          zIndex: 1,
	          borderRadius: 0,
	          " .pe-button__content": {
	            borderRadius: 0,
	            transitionProperty: "all",
	            transitionTimingFunction: "ease-in-out"
	          }
	        },
	        ".pe-tabs--start .pe-tabs__scroll-button-start": {
	          pointerEvents: "none",
	          cursor: "default",
	          opacity: 0
	        },
	        ".pe-tabs--end .pe-tabs__scroll-button-end": {
	          pointerEvents: "none",
	          cursor: "default",
	          opacity: 0
	        }
	      },
	      " .pe-tabs__row": [flex$1.layoutHorizontal, {
	        userSelect: "none",
	        "-moz-user-select": "none",
	        position: "relative",
	        whiteSpace: "nowrap",
	        ".pe-tabs__row--indent": {
	          margin: 0,
	          overflow: "auto"
	        },
	        ".pe-tabs__row--centered": flex$1.layoutCenterJustified
	      }],
	      " .pe-tabs__scroll-button-offset": [flex$1.flex(), flex$1.flexIndex("none")],
	      " .pe-tabs__indicator": {
	        transform: "translate3d(0,0,0)",
	        // transformOrigin set in alignSide
	        transitionProperty: "all",
	        transitionTimingFunction: "ease-in-out",
	        position: "absolute",
	        zIndex: 1,
	        bottom: 0,
	        // left/right set in alignSide
	        width: "100%" // and transformed with js
	        // background-color defined in implementation/theme css

	      },
	      " .pe-toolbar--tabs .pe-toolbar__bar &": [mixin.fit(), {
	        width: "auto",
	        margin: 0,
	        top: "auto"
	      }]
	    }]), _defineProperty$Z({}, "*[dir=rtl] ".concat(selector, ", .pe-rtl ").concat(selector), [alignRight$8()])];
	  },
	  tabs_indent: function tabs_indent(selector, vars$$1) {
	    return [_tabs_indent(selector, vars$$1, false), _tabs_indent(selectorRTL(selector), vars$$1, true)];
	  },
	  tab_height: function tab_height(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-tabs--scrollable": {
	        display: "flex",
	        // hide scrollbar (this approach is required for Firefox)
	        "max-height": vars$$1.tab_height + "px"
	      }
	    })];
	  },
	  scrollbar_offset: function scrollbar_offset(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-tabs--scrollable": {
	        " .pe-tabs__row": {
	          marginBottom: -vars$$1.scrollbar_offset + "px"
	        }
	      }
	    })];
	  },
	  scroll_button_size: function scroll_button_size(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-no-touch &": {
	        " .pe-tabs__scroll-button": {
	          width: vars$$1.scroll_button_size + "px",
	          height: vars$$1.scroll_button_size + "px"
	        }
	      }
	    })];
	  },
	  scroll_button_fade_duration: function scroll_button_fade_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-no-touch &": {
	        " .pe-tabs__scroll-button": {
	          " .pe-button__content": {
	            transitionDuration: vars$$1.scroll_button_fade_duration
	          }
	        }
	      }
	    })];
	  },
	  scroll_button_fade_delay: function scroll_button_fade_delay(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-no-touch &": {
	        " .pe-tabs__scroll-button": {
	          " .pe-button__content": {
	            transitionDelay: vars$$1.scroll_button_fade_delay
	          }
	        }
	      }
	    })];
	  },
	  scroll_button_opacity: function scroll_button_opacity(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-no-touch &": {
	        " .pe-tabs__scroll-button": {
	          " .pe-button__content": {
	            opacity: vars$$1.scroll_button_opacity
	          }
	        }
	      }
	    })];
	  },
	  tab_indicator_height: function tab_indicator_height(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-tabs__indicator": {
	        height: vars$$1.tab_indicator_height + "px"
	      }
	    })];
	  }
	};
	var tabsLayout = createLayout({
	  varFns: varFns$1$4
	}); // @ts-check

	var fontSize = textButtonVars$1.font_size;
	var tab_label_line_height = 1.1 * fontSize;
	var tab_height = 48;
	var scroll_button_size = tab_height;
	/**
	 * @type {TabsVars} tabsVars
	 */

	var tabsVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  animation_duration: textButtonVars$1.animation_duration,
	  indicator_slide_speed: 600,
	  // px per second
	  label_max_width: 264,
	  menu_tab_height: 44,
	  menu_tab_icon_label_height: 44,
	  scroll_button_fade_delay: ".25s",
	  scroll_button_fade_duration: ".2s",
	  scroll_button_opacity: .7,
	  scroll_button_size: scroll_button_size,
	  scrollbar_offset: 0,
	  tab_content_padding_v: 12,
	  tab_height: tab_height,
	  tab_icon_label_height: 72,
	  tab_icon_label_icon_spacing: 7,
	  tab_indicator_height: 2,
	  tab_label_line_height: tab_label_line_height,
	  tab_label_transition_property: "opacity, color, backgroundColor",
	  tab_label_vertical_offset: tab_label_line_height - fontSize,
	  tab_max_width: "initial",
	  tab_menu_content_padding_v: 6,
	  tab_min_width: 72,
	  tab_min_width_tablet: 160,
	  tabs_indent: 0,
	  color_light_text: rgba(vars.color_light_foreground, vars.blend_light_text_regular),
	  color_light_selected: rgba(vars.color_primary),
	  color_light_selected_background: "transparent",
	  color_light_tab_indicator: rgba(vars.color_primary),
	  color_light_icon: iconButtonVars.color_light,
	  color_dark_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_regular),
	  color_dark_selected: rgba(vars.color_primary),
	  color_dark_selected_background: "transparent",
	  color_dark_tab_indicator: rgba(vars.color_primary),
	  color_dark_icon: iconButtonVars.color_dark // hover colors may be set in theme; disabled by default
	  // color_light_hover:                    rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  // color_light_hover_background:         "transparent",
	  //
	  // color_dark_hover:                     rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  // color_dark_hover_background:          "transparent",

	}; // @ts-check

	var tabsFns = [tabsLayout, tabsColor];
	var tabFns = [tabLayout, tabColor];
	var tabsSelector = ".".concat(classes$14.component);
	var tabClass = "".concat(classes$14.tab, " pe-text-button pe-button");
	var tabSelector = " .".concat(tabClass.replace(/ /g, "."));

	styler.addStyle({
	  selectors: [tabsSelector],
	  fns: tabsFns,
	  vars: tabsVars
	});
	styler.addStyle({
	  selectors: [tabSelector],
	  fns: tabFns,
	  vars: tabsVars
	});

	var classes$15 = {
	  component: "pe-textfield",
	  // elements
	  counter: "pe-textfield__counter",
	  error: "pe-textfield__error",
	  errorPlaceholder: "pe-textfield__error-placeholder",
	  focusHelp: "pe-textfield__help-focus",
	  help: "pe-textfield__help",
	  input: "pe-textfield__input",
	  inputArea: "pe-textfield__input-area",
	  label: "pe-textfield__label",
	  optionalIndicator: "pe-textfield__optional-indicator",
	  requiredIndicator: "pe-textfield__required-indicator",
	  // states
	  hasCounter: "pe-textfield--counter",
	  hasFloatingLabel: "pe-textfield--floating-label",
	  hasFullWidth: "pe-textfield--full-width",
	  hideClear: "pe-textfield--hide-clear",
	  hideSpinner: "pe-textfield--hide-spinner",
	  hideValidation: "pe-textfield--hide-validation",
	  isDense: "pe-textfield--dense",
	  isRequired: "pe-textfield--required",
	  stateDirty: "pe-textfield--dirty",
	  stateDisabled: "pe-textfield--disabled",
	  stateFocused: "pe-textfield--focused",
	  stateInvalid: "pe-textfield--invalid",
	  stateReadonly: "pe-textfield--readonly"
	};

	function _defineProperty$_(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$_() {
	  _extends$_ = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$_.apply(this, arguments);
	}

	var generalFns$n = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, {
	      " .pe-textfield__input-area": {
	        color: "inherit",
	        "&:after": {
	          backgroundColor: "currentcolor"
	        }
	      },
	      ".pe-textfield--disabled, &.pe-textfield--readonly": {
	        " .pe-textfield__input-area:after": {
	          backgroundColor: "transparent"
	        }
	      },
	      ".pe-textfield--invalid:not(.pe-textfield--hide-validation)": {
	        " .pe-textfield__input": {
	          boxShadow: "none"
	        }
	      }
	    })];
	  }
	};

	var tintFns$n = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$_(_ref, "color_" + tint + "_focus_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      color: vars$$1["color_" + tint + "_focus_border"] // override by specifying "color"

	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_input_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input-area": {
	        backgroundColor: vars$$1["color_" + tint + "_input_background"]
	      },
	      " .pe-textfield__input:-webkit-autofill": {
	        "-webkit-box-shadow": "0 0 0px 1000px " + vars$$1["color_" + tint + "_input_background"] + " inset"
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_input_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input": {
	        color: vars$$1["color_" + tint + "_input_text"]
	      },
	      " .pe-textfield__input:-webkit-autofill": {
	        color: vars$$1["color_" + tint + "_input_text"] + " !important"
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_counter_ok_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--counter ": {
	        " .pe-textfield__input-area:after": {
	          backgroundColor: vars$$1["color_" + tint + "_counter_ok_border"]
	        }
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_input_bottom_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input": {
	        borderColor: vars$$1["color_" + tint + "_input_bottom_border"]
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_label_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__label": {
	        color: vars$$1["color_" + tint + "_label_text"]
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_disabled_label_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--disabled, &.pe-textfield--readonly": {
	        " .pe-textfield__input-area:after": {
	          backgroundImage: "linear-gradient(to right, " + vars$$1["color_" + tint + "_disabled_label_text"] + " 20%, rgba(255, 255, 255, 0) 0%)"
	        }
	      },
	      ".pe-textfield--disabled": {
	        " .pe-textfield__input, .pe-textfield__label": {
	          color: vars$$1["color_" + tint + "_disabled_label_text"]
	        }
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_readonly_label_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--readonly": {
	        " .pe-textfield__input, .pe-textfield__label": {
	          color: vars$$1["color_" + tint + "_readonly_label_text"]
	        }
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_highlight_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--focused": {
	        // note: not when textfield--dirty and not textfield--focused
	        ".pe-textfield--floating-label .pe-textfield__label": {
	          color: vars$$1["color_" + tint + "_highlight_text"]
	        }
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_required_symbol", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--focused": {
	        ".pe-textfield--required.pe-textfield--floating-label": {
	          " .pe-textfield__required-indicator": {
	            color: vars$$1["color_" + tint + "_required_symbol"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_help_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__help, .pe-textfield__counter": {
	        color: vars$$1["color_" + tint + "_help_text"]
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_input_error_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--invalid:not(.pe-textfield--hide-validation)": {
	        " .pe-textfield__input": {
	          borderColor: vars$$1["color_" + tint + "_input_error_border"]
	        },
	        "&, &.pe-textfield--counter": {
	          " .pe-textfield__input-area:after": {
	            backgroundColor: vars$$1["color_" + tint + "_input_error_border"]
	          }
	        }
	      }
	    })];
	  }), _defineProperty$_(_ref, "color_" + tint + "_input_error_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--invalid:not(.pe-textfield--hide-validation)": {
	        " .pe-textfield__label": {
	          color: vars$$1["color_" + tint + "_input_error_text"]
	        },
	        " .pe-textfield__error, .pe-textfield__counter, .pe-textfield__help": {
	          color: vars$$1["color_" + tint + "_input_error_text"]
	        },
	        ".pe-textfield--required .pe-textfield__label": {
	          color: vars$$1["color_" + tint + "_input_error_text"]
	        }
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$n = _extends$_({}, generalFns$n, tintFns$n("light"));

	var darkTintFns$n = _extends$_({}, generalFns$n, tintFns$n("dark"));

	var color$j = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$n,
	    darkTintFns: darkTintFns$n
	  }
	});

	var alignSide$9 = function alignSide(isRTL) {
	  return function () {
	    return {
	      " .pe-textfield__counter": {
	        textAlign: isRTL ? "left" : "right",
	        float: isRTL ? "left" : "right",
	        padding: isRTL ? "0 16px 0 0" : "0 0 0 16px"
	      }
	    };
	  };
	};

	var alignLeft$9 = alignSide$9(false);
	var alignRight$9 = alignSide$9(true);

	var vertical_spacing_top_input_padding_v = function vertical_spacing_top_input_padding_v(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-textfield__label": {
	      top: vars$$1.vertical_spacing_top + vars$$1.input_padding_v + "px"
	    }
	  });
	};

	var floating_label_vertical_spacing_top_input_padding_v = function floating_label_vertical_spacing_top_input_padding_v(selector, vars$$1) {
	  return sel(selector, {
	    ".pe-textfield--floating-label .pe-textfield__label": {
	      top: vars$$1.floating_label_vertical_spacing_top + vars$$1.input_padding_v + "px"
	    }
	  });
	};

	var dense_floating_label_vertical_spacing_top_input_padding_v = function dense_floating_label_vertical_spacing_top_input_padding_v(selector, vars$$1) {
	  return sel(selector, {
	    ".pe-textfield--floating-label.pe-textfield--dense .pe-textfield__label": {
	      top: vars$$1.dense_floating_label_vertical_spacing_top + vars$$1.input_padding_v + "px"
	    }
	  });
	};

	var input_padding_v_input_padding_h = function input_padding_v_input_padding_h(selector, vars$$1) {
	  return sel(selector, {
	    " .pe-textfield__input": {
	      padding: vars$$1.input_padding_v + "px " + vars$$1.input_padding_h + "px"
	    },
	    " textarea.pe-textfield__input": {
	      margin: vars$$1.input_padding_v + "px " + vars$$1.input_padding_h + "px"
	    }
	  });
	};

	var full_width_input_padding_v_full_width_input_padding_h = function full_width_input_padding_v_full_width_input_padding_h(selector, vars$$1) {
	  return sel(selector, {
	    ".pe-textfield--full-width": {
	      " .pe-textfield__input": {
	        padding: vars$$1.full_width_input_padding_v + "px " + vars$$1.full_width_input_padding_h + "px"
	      }
	    }
	  });
	};

	var dense_full_width_input_padding_v_dense_full_width_input_padding_h = function dense_full_width_input_padding_v_dense_full_width_input_padding_h(selector, vars$$1) {
	  return sel(selector, {
	    ".pe-textfield--full-width.pe-textfield--dense": {
	      " .pe-textfield__input": {
	        padding: vars$$1.dense_full_width_input_padding_v + "px " + vars$$1.dense_full_width_input_padding_h + "px"
	      }
	    }
	  });
	};

	var varFns$r = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [alignLeft$9(), mixin.clearfix(), {
	      position: "relative",
	      lineHeight: vars.line_height,
	      display: "inline-block",
	      boxSizing: "border-box",
	      margin: 0,
	      overflow: "visible",
	      // Firefox needs this
	      width: "100%",
	      maxWidth: "100%",
	      " .pe-textfield__input-area": {
	        position: "relative",
	        "&:after": {
	          position: "absolute",
	          content: "\"\"",
	          bottom: 0,
	          left: 0,
	          width: "100%",
	          opacity: 0
	        }
	      },
	      ".pe-textfield--focused .pe-textfield__input-area:after": {
	        opacity: 1
	      },
	      " .pe-textfield__input": {
	        display: "block",
	        width: "100%",
	        background: "none",
	        color: "inherit",
	        borderStyle: "none none solid none",
	        borderRadius: 0,
	        margin: 0,
	        // disable glow on textfield--invalid fields
	        "&:textfield--invalid": {
	          boxShadow: "none"
	        },
	        ":invalid": {
	          boxShadow: "none"
	        },
	        // Remove clear cross icon from IE
	        "::-ms-clear": {
	          width: 0,
	          height: 0
	        }
	      },
	      " textarea.pe-textfield__input": {
	        padding: 0,
	        display: "block"
	      },
	      // focus border
	      ".pe-textfield--focused .pe-textfield__input": {
	        outline: "none"
	      },
	      " .pe-textfield__label": {
	        position: "absolute",
	        display: "block",
	        bottom: 0,
	        pointerEvents: "none",
	        whiteSpace: "nowrap",
	        cursor: "text"
	      },
	      ".pe-textfield--dirty .pe-textfield__label": {
	        visibility: "hidden"
	      },
	      "&:not(.pe-textfield--no-char)": {
	        " .pe-textfield__required-indicator, .pe-textfield__optional-indicator": {
	          padding: "0 0 0 .25em"
	        }
	      },
	      ".pe-textfield--floating-label": {
	        ".pe-textfield--focused, &.pe-textfield--dirty": {
	          " .pe-textfield__label": {
	            visibility: "visible"
	          }
	        }
	      },
	      ".pe-textfield--disabled, &.pe-textfield--readonly": {
	        " .pe-textfield__label": {
	          cursor: "auto"
	        },
	        " .pe-textfield__input": {
	          "border-bottom": "none"
	        },
	        " .pe-textfield__input-area:after": {
	          opacity: 1,
	          height: "1px",
	          bottom: "-1px",
	          backgroundPosition: "top",
	          backgroundSize: "4px 1px",
	          backgroundRepeat: "repeat-x"
	        }
	      },
	      " .pe-textfield__error, .pe-textfield__error-placeholder, .pe-textfield__help, .pe-textfield__counter": {
	        lineHeight: vars.line_height
	      },
	      " .pe-textfield__help-focus": [mixin.defaultTransition("opacity"), {
	        opacity: 0
	      }],
	      ".pe-textfield--focused .pe-textfield__help-focus, &.pe-textfield--dirty .pe-textfield__help-focus": {
	        opacity: 1
	      },
	      ".pe-textfield--hide-clear": {
	        " .pe-textfield__input::-ms-clear": {
	          display: "none"
	        }
	      },
	      ".pe-textfield--hide-spinner": {
	        " input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button": {
	          "-webkit-appearance": "none",
	          margin: 0
	        },
	        " input[type=number]": {
	          "-moz-appearance": "textfield"
	        }
	      },
	      ".pe-textfield--full-width": {
	        width: "100%",
	        padding: 0,
	        " .pe-textfield__input-area": {
	          padding: 0
	        }
	      }
	    }]), _defineProperty$_({}, "*[dir=rtl] ".concat(selector, ", .pe-rtl ").concat(selector), [alignRight$9()])];
	  },
	  vertical_spacing_bottom: function vertical_spacing_bottom(selector, vars$$1) {
	    return [sel(selector, {
	      paddingBottom: vars$$1.vertical_spacing_bottom + "px"
	    })];
	  },
	  floating_label_vertical_spacing_bottom: function floating_label_vertical_spacing_bottom(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--floating-label": {
	        paddingBottom: vars$$1.floating_label_vertical_spacing_bottom + "px"
	      },
	      ".pe-textfield--dense": {
	        paddingBottom: vars$$1.dense_floating_label_vertical_spacing_bottom + "px"
	      }
	    })];
	  },
	  vertical_spacing_top: function vertical_spacing_top(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input-area": {
	        paddingTop: vars$$1.vertical_spacing_top + "px"
	      }
	    }), vertical_spacing_top_input_padding_v(selector, vars$$1)];
	  },
	  input_padding_v: function input_padding_v(selector, vars$$1) {
	    return [vertical_spacing_top_input_padding_v(selector, vars$$1), floating_label_vertical_spacing_top_input_padding_v(selector, vars$$1), dense_floating_label_vertical_spacing_top_input_padding_v(selector, vars$$1), input_padding_v_input_padding_h(selector, vars$$1)];
	  },
	  input_padding_h: function input_padding_h(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__label": {
	        left: vars$$1.input_padding_h + "px",
	        right: vars$$1.input_padding_h + "px"
	      }
	    }), input_padding_v_input_padding_h(selector, vars$$1)];
	  },
	  floating_label_vertical_spacing_top: function floating_label_vertical_spacing_top(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--floating-label": {
	        " .pe-textfield__input-area": {
	          paddingTop: vars$$1.floating_label_vertical_spacing_top + "px"
	        }
	      }
	    }), floating_label_vertical_spacing_top_input_padding_v(selector, vars$$1)];
	  },
	  dense_floating_label_vertical_spacing_top: function dense_floating_label_vertical_spacing_top(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--floating-label.pe-textfield--dense": {
	        " .pe-textfield__input-area": {
	          paddingTop: vars$$1.dense_floating_label_vertical_spacing_top + "px"
	        }
	      }
	    }), dense_floating_label_vertical_spacing_top_input_padding_v(selector, vars$$1)];
	  },
	  input_focus_border_animation_duration: function input_focus_border_animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input-area:after": mixin.defaultTransition("opacity", vars$$1.input_focus_border_animation_duration)
	    })];
	  },
	  input_focus_border_width: function input_focus_border_width(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input-area:after": {
	        height: vars$$1.input_focus_border_width + "px"
	      }
	    })];
	  },
	  font_size_error: function font_size_error(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__error, .pe-textfield__error-placeholder, .pe-textfield__help, .pe-textfield__counter": {
	        fontSize: vars$$1.font_size_error + "px",
	        minHeight: vars$$1.font_size_error * vars.line_height + "px"
	      }
	    })];
	  },
	  font_size_input: function font_size_input(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input, .pe-textfield__label": {
	        fontSize: vars$$1.font_size_input + "px"
	      }
	    })];
	  },
	  line_height_input: function line_height_input(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input, .pe-textfield__label": {
	        lineHeight: vars$$1.line_height_input + "px"
	      }
	    })];
	  },
	  input_border_width: function input_border_width(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__input": {
	        borderWidth: vars$$1.input_border_width + "px"
	      },
	      // focus border
	      ".pe-textfield--focused .pe-textfield__input": {
	        borderWidth: vars$$1.input_border_width + "px",
	        outline: "none"
	      }
	    })];
	  },
	  full_width_input_padding_v: function full_width_input_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--full-width": {
	        " .pe-textfield__label": {
	          top: vars$$1.full_width_input_padding_v + "px"
	        }
	      }
	    }), full_width_input_padding_v_full_width_input_padding_h(selector, vars$$1)];
	  },
	  full_width_input_padding_h: function full_width_input_padding_h(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--full-width": {
	        " .pe-textfield__error, .pe-textfield__help, .pe-textfield__counter": {
	          paddingLeft: vars$$1.full_width_input_padding_h + "px",
	          paddingRight: vars$$1.full_width_input_padding_h + "px"
	        },
	        " .pe-textfield__label": {
	          left: vars$$1.full_width_input_padding_h + "px",
	          right: vars$$1.full_width_input_padding_h + "px"
	        }
	      }
	    }), full_width_input_padding_v_full_width_input_padding_h(selector, vars$$1)];
	  },
	  dense_font_size_input: function dense_font_size_input(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--dense": {
	        "&, .pe-textfield__input, .pe-textfield__label": {
	          fontSize: vars$$1.dense_font_size_input + "px"
	        }
	      }
	    })];
	  },
	  dense_full_width_font_size_input: function dense_full_width_font_size_input(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--dense": {
	        " .pe-textfield__input": {
	          fontSize: vars$$1.dense_full_width_font_size_input + "px"
	        },
	        " .pe-textfield__label": {
	          fontSize: vars$$1.dense_full_width_font_size_input + "px"
	        }
	      }
	    })];
	  },
	  dense_full_width_input_padding_v: function dense_full_width_input_padding_v(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--full-width": {
	        ".pe-textfield--dense": {
	          " .pe-textfield__label": {
	            top: vars$$1.dense_full_width_input_padding_v + "px"
	          }
	        }
	      }
	    }), dense_full_width_input_padding_v_dense_full_width_input_padding_h(selector, vars$$1)];
	  },
	  dense_full_width_input_padding_h: function dense_full_width_input_padding_h(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--full-width": {
	        ".pe-textfield--dense": {
	          " .pe-textfield__label": {
	            left: vars$$1.dense_full_width_input_padding_h + "px",
	            right: vars$$1.dense_full_width_input_padding_h + "px"
	          }
	        }
	      }
	    }), dense_full_width_input_padding_v_dense_full_width_input_padding_h(selector, vars$$1)];
	  },
	  margin_top_error_message: function margin_top_error_message(selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-textfield__error, .pe-textfield__error-placeholder, .pe-textfield__help, .pe-textfield__counter": {
	        marginTop: vars$$1.margin_top_error_message + "px"
	      }
	    })];
	  },
	  floating_label_animation_duration: function floating_label_animation_duration(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--floating-label": {
	        " .pe-textfield__label": mixin.defaultTransition("all", vars$$1.floating_label_animation_duration)
	      }
	    })];
	  },
	  dense_font_size_floating_label: function dense_font_size_floating_label(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--floating-label": {
	        ".pe-textfield--dense": {
	          ".pe-textfield--focused, &.pe-textfield--dirty": {
	            fontSize: vars$$1.dense_font_size_floating_label + "px"
	          }
	        }
	      }
	    })];
	  },
	  dense_floating_label_top: function dense_floating_label_top(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--floating-label": {
	        ".pe-textfield--dense": {
	          ".pe-textfield--focused, &.pe-textfield--dirty": {
	            " .pe-textfield__label": {
	              top: vars$$1.dense_floating_label_top + "px"
	            }
	          }
	        }
	      }
	    })];
	  },
	  floating_label_top: function floating_label_top(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--floating-label": {
	        ".pe-textfield--focused, &.pe-textfield--dirty": {
	          " .pe-textfield__label": {
	            top: vars$$1.floating_label_top + "px"
	          }
	        }
	      }
	    })];
	  },
	  font_size_floating_label: function font_size_floating_label(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-textfield--floating-label": {
	        ".pe-textfield--focused, &.pe-textfield--dirty": {
	          " .pe-textfield__label": {
	            fontSize: vars$$1.font_size_floating_label + "px"
	          }
	        }
	      }
	    })];
	  }
	};
	var layout$m = createLayout({
	  varFns: varFns$r
	}); // @ts-check

	/**
	 * @type {TextfieldVars} textfieldVars
	 */

	var textfieldVars = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  dense_floating_label_top: 10,
	  dense_floating_label_vertical_spacing_bottom: 4,
	  // 8 minus natural label height padding (1)
	  dense_floating_label_vertical_spacing_top: 23,
	  // 12 + 8 + 4 minus natural label height padding (1)
	  dense_font_size_floating_label: 13,
	  dense_font_size_input: 13,
	  dense_full_width_font_size_input: 13,
	  dense_full_width_input_padding_h: 16,
	  dense_full_width_input_padding_v: 15,
	  // 16 minus natural label height padding (1)
	  floating_label_animation_duration: ".12s",

	  /**
	   * Top position in pixels
	   */
	  floating_label_top: 14,
	  floating_label_vertical_spacing_bottom: 7,
	  // 8 minus natural label height padding (1)
	  floating_label_vertical_spacing_top: 30,
	  // 16 + 8 + 8 minus natural label height padding (2)
	  font_size_error: 12,
	  font_size_floating_label: 12,
	  font_size_input: 16,
	  full_width_input_padding_h: 20,
	  full_width_input_padding_v: 18,
	  // 20 minus natural label height padding (2)
	  input_border_width: 1,
	  input_focus_border_animation_duration: vars.animation_duration,
	  input_focus_border_width: 2,
	  input_padding_h: 0,
	  input_padding_v: 7,
	  line_height_input: 20,
	  margin_top_error_message: 6,
	  vertical_spacing_bottom: 7,
	  // 8 minus natural label height padding (1)
	  vertical_spacing_top: 6,
	  // 8 minus natural label height padding (1)
	  color_light_input_text: rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  color_light_input_background: "transparent",
	  // only used to "remove" autofill color
	  color_light_highlight_text: rgba(vars.color_primary, vars.blend_light_text_primary),
	  color_light_input_bottom_border: rgba(vars.color_light_foreground, vars.blend_light_border_light),
	  color_light_input_error_text: rgba("221, 44, 0"),
	  color_light_input_error_border: rgba("221, 44, 0"),
	  color_light_input_placeholder: rgba(vars.color_light_foreground, vars.blend_light_text_tertiary),
	  color_light_label_text: rgba(vars.color_light_foreground, vars.blend_light_text_tertiary),
	  color_light_disabled_label_text: rgba(vars.color_light_foreground, vars.blend_light_text_disabled),
	  color_light_readonly_label_text: rgba(vars.color_light_foreground, vars.blend_light_text_tertiary),
	  color_light_help_text: rgba(vars.color_light_foreground, vars.blend_light_text_tertiary),
	  color_light_required_symbol: rgba("221, 44, 0"),
	  color_light_focus_border: rgba(vars.color_primary),
	  color_light_counter_ok_border: rgba(vars.color_primary),
	  color_dark_input_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  color_dark_input_background: "transparent",
	  // only used to "remove" autofill color
	  color_dark_highlight_text: rgba(vars.color_primary, vars.blend_dark_text_primary),
	  color_dark_input_bottom_border: rgba(vars.color_dark_foreground, vars.blend_dark_border_light),
	  color_dark_input_error_text: rgba("222, 50, 38"),
	  color_dark_input_error_border: rgba("222, 50, 38"),
	  color_dark_input_placeholder: rgba(vars.color_dark_foreground, vars.blend_dark_text_tertiary),
	  color_dark_label_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_tertiary),
	  color_dark_disabled_label_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_disabled),
	  color_dark_readonly_label_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_tertiary),
	  color_dark_help_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_tertiary),
	  color_dark_required_symbol: rgba("221, 44, 0"),
	  color_dark_focus_border: rgba(vars.color_primary),
	  color_dark_counter_ok_border: rgba(vars.color_primary)
	}; // @ts-check

	var fns$q = [layout$m, color$j];
	var selector$r = ".".concat(classes$15.component);
	styler.addStyle({
	  selectors: [selector$r],
	  fns: fns$q,
	  vars: textfieldVars
	});

	var classes$16 = {
	  // Toolbar
	  component: "pe-toolbar",
	  // states
	  compact: "pe-toolbar--compact",
	  appBar: "pe-toolbar--app-bar",
	  // Toolbar title
	  // elements
	  title: "pe-toolbar__title",
	  // states
	  centeredTitle: "pe-toolbar__title--center",
	  indentedTitle: "pe-toolbar__title--indent",
	  fullbleed: "pe-toolbar--fullbleed",
	  border: "pe-toolbar--border"
	};

	function _defineProperty$10(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends$10() {
	  _extends$10 = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends$10.apply(this, arguments);
	}

	var generalFns$o = {
	  general_styles: function general_styles(selector) {
	    return [];
	  } // eslint-disable-line no-unused-vars

	};

	var tintFns$o = function tintFns(tint) {
	  var _ref;

	  return _ref = {}, _defineProperty$10(_ref, "color_" + tint + "_text", function (selector, vars$$1) {
	    return [sel(selector, {
	      " .pe-toolbar__title": {
	        "&, a:link, a:visited": {
	          color: vars$$1["color_" + tint + "_text"]
	        }
	      }
	    })];
	  }), _defineProperty$10(_ref, "color_" + tint + "_background", function (selector, vars$$1) {
	    return [sel(selector, {
	      backgroundColor: vars$$1["color_" + tint + "_background"]
	    })];
	  }), _defineProperty$10(_ref, "color_" + tint + "_border", function (selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-toolbar--border": {
	        borderColor: vars$$1["color_" + tint + "_border"]
	      }
	    })];
	  }), _ref;
	};

	var lightTintFns$o = _extends$10({}, generalFns$o, tintFns$o("light"));

	var darkTintFns$o = _extends$10({}, generalFns$o, tintFns$o("dark"));

	var color$k = createColor({
	  varFns: {
	    lightTintFns: lightTintFns$o,
	    darkTintFns: darkTintFns$o
	  }
	});
	/**
	 * 
	 * @param {string} breakpointSel 
	 */

	var breakpoint$1 = function breakpoint(breakpointSel) {
	  return (
	    /**
	     * @param {string} selector
	     * @param {object} o
	     */
	    function (selector, o) {
	      return _defineProperty$10({}, breakpointSel, _defineProperty$10({}, selector, o));
	    }
	  );
	};
	/**
	 * @param {object} params
	 * @param {string} params.selector
	 * @param {object} params.vars
	 * @param {boolean} [params.isRTL]
	 * @param {boolean} [params.isLarge]
	 */


	var indent_padding_side = function indent_padding_side(_ref2) {
	  var _peToolbar__title;

	  var selector = _ref2.selector,
	      vars$$1 = _ref2.vars,
	      isRTL = _ref2.isRTL,
	      isLarge = _ref2.isLarge;
	  var indent = isLarge ? vars$$1.indent_large : vars$$1.indent;
	  var fn = isLarge ? breakpointTabletPortraitUp$1 : sel;
	  return fn(selector, {
	    " .pe-toolbar__title--indent, .pe-toolbar__title.pe-toolbar__title--indent": (_peToolbar__title = {}, _defineProperty$10(_peToolbar__title, isRTL ? "marginLeft" : "marginRight", 0), _defineProperty$10(_peToolbar__title, isRTL ? "marginRight" : "marginLeft", indent + "px"), _peToolbar__title)
	  });
	};
	/**
	 * @param {object} params
	 * @param {string} params.selector
	 * @param {object} params.vars
	 * @param {boolean} [params.isRTL]
	 * @param {boolean} [params.isLarge]
	 */


	var _title_padding = function title_padding(_ref3) {
	  var _spanPeToolbar;

	  var selector = _ref3.selector,
	      vars$$1 = _ref3.vars,
	      isRTL = _ref3.isRTL,
	      isLarge = _ref3.isLarge;
	  var title_padding = isLarge ? vars$$1.title_padding_large : vars$$1.title_padding;
	  var fn = isLarge ? breakpointTabletPortraitUp$1 : sel;
	  return fn(selector, {
	    " > span, .pe-toolbar__title": (_spanPeToolbar = {}, _defineProperty$10(_spanPeToolbar, isRTL ? "marginLeft" : "marginRight", 0), _defineProperty$10(_spanPeToolbar, isRTL ? "marginRight" : "marginLeft", title_padding + "px"), _spanPeToolbar),
	    " .pe-toolbar__title--center": {
	      marginLeft: title_padding + "px",
	      marginRight: title_padding + "px"
	    }
	  });
	};
	/**
	 * @param {object} params
	 * @param {string} params.selector
	 * @param {object} params.vars
	 * @param {boolean} [params.isRTL]
	 * @param {boolean} [params.isLarge]
	 */


	var title_padding_title_after_icon_padding = function title_padding_title_after_icon_padding(_ref4) {
	  var _notPeToolbar_;

	  var selector = _ref4.selector,
	      vars$$1 = _ref4.vars,
	      isRTL = _ref4.isRTL,
	      isLarge = _ref4.isLarge;
	  var padding = isLarge ? vars$$1.title_after_icon_padding_large : vars$$1.title_after_icon_padding;
	  var fn = isLarge ? breakpointTabletPortraitUp$1 : sel;
	  return fn(selector, {
	    " > :not(.pe-toolbar__title):first-child:not(.pe-toolbar__title--indent):first-child": (_notPeToolbar_ = {}, _defineProperty$10(_notPeToolbar_, isRTL ? "marginRight" : "marginLeft", 0), _defineProperty$10(_notPeToolbar_, isRTL ? "marginLeft" : "marginRight", padding + "px"), _notPeToolbar_)
	  });
	};

	var breakpointPhoneOnly = breakpoint$1("@media (min-width: ".concat(vars.breakpoint_for_phone_only, "px) and (orientation: landscape)"));
	var breakpointTabletPortraitUp$1 = breakpoint$1("@media (min-width: ".concat(vars.breakpoint_for_tablet_portrait_up, "px)"));
	var varFns$s = {
	  general_styles: function general_styles(selector) {
	    return [sel(selector, [flex$1.layout, flex$1.layoutHorizontal, flex$1.layoutCenter, {
	      position: "relative",
	      zIndex: vars.z_toolbar,
	      " > a": {
	        textDecoration: "none"
	      },
	      ".pe-toolbar--fullbleed": {
	        padding: 0
	      },
	      ".pe-toolbar--border": {
	        borderWidth: "1px",
	        borderStyle: "none none solid none"
	      },
	      " > *": {
	        flexShrink: 0
	      },
	      " > span, .pe-toolbar__title, .pe-toolbar__title--indent": {
	        width: "100%",
	        display: "block",
	        wordBreak: "break-all",
	        overflow: "hidden",
	        textOverflow: "ellipsis",
	        whiteSpace: "nowrap",
	        flexShrink: 1
	      },
	      " .pe-toolbar__title--center": {
	        textAlign: "center",
	        justifyContent: "center"
	      },
	      " > .pe-action": {
	        paddingLeft: "12px",
	        paddingRight: "12px"
	      },
	      " .pe-fit": [mixin.fit(), {
	        margin: 0
	      }]
	    }])];
	  },
	  height: function height(selector, vars$$1) {
	    return [sel(selector, {
	      height: vars$$1.height + "px"
	    })];
	  },
	  height_compact: function height_compact(selector, vars$$1) {
	    return [sel(selector, {
	      ".pe-toolbar--compact": {
	        height: vars$$1.height_compact + "px"
	      }
	    }), breakpointPhoneOnly(selector, {
	      height: vars$$1.height + "px"
	    })];
	  },
	  line_height: function line_height(selector, vars$$1) {
	    return [sel(selector, {
	      lineHeight: vars$$1.line_height + "em",
	      " > span, .pe-toolbar__title, .pe-toolbar__title--indent": {
	        lineHeight: vars$$1.line_height
	      }
	    })];
	  },
	  font_size: function font_size(selector, vars$$1) {
	    return [sel(selector, {
	      " > span, .pe-toolbar__title, .pe-toolbar__title--indent, .pe-action": {
	        fontSize: vars$$1.font_size + "px"
	      }
	    })];
	  },
	  font_weight: function font_weight(selector, vars$$1) {
	    return [sel(selector, {
	      " > span, .pe-toolbar__title, .pe-toolbar__title--indent": {
	        fontWeight: vars$$1.font_weight
	      }
	    })];
	  },
	  padding_side: function padding_side(selector, vars$$1) {
	    return [sel(selector, {
	      padding: "0 " + vars$$1.padding_side + "px"
	    }), indent_padding_side({
	      selector: selector,
	      vars: vars$$1
	    }), indent_padding_side({
	      selector: selectorRTL(selector),
	      vars: vars$$1,
	      isRTL: true
	    })];
	  },
	  indent: function indent(selector, vars$$1) {
	    return [indent_padding_side({
	      selector: selector,
	      vars: vars$$1
	    }), indent_padding_side({
	      selector: selectorRTL(selector),
	      vars: vars$$1,
	      isRTL: true
	    })];
	  },
	  indent_large: function indent_large(selector, vars$$1) {
	    return [indent_padding_side({
	      selector: selector,
	      vars: vars$$1,
	      isLarge: true
	    }), indent_padding_side({
	      selector: selectorRTL(selector),
	      vars: vars$$1,
	      isRTL: true,
	      isLarge: true
	    })];
	  },
	  title_padding: function title_padding(selector, vars$$1) {
	    return [_title_padding({
	      selector: selector,
	      vars: vars$$1
	    }), _title_padding({
	      selector: selectorRTL(selector),
	      vars: vars$$1,
	      isRTL: true
	    })];
	  },
	  title_padding_large: function title_padding_large(selector, vars$$1) {
	    return [_title_padding({
	      selector: selector,
	      vars: vars$$1,
	      isLarge: true
	    }), _title_padding({
	      selector: selectorRTL(selector),
	      vars: vars$$1,
	      isRTL: true,
	      isLarge: true
	    })];
	  },
	  title_after_icon_padding: function title_after_icon_padding(selector, vars$$1) {
	    return [title_padding_title_after_icon_padding({
	      selector: selector,
	      vars: vars$$1
	    }), title_padding_title_after_icon_padding({
	      selector: selectorRTL(selector),
	      vars: vars$$1,
	      isRTL: true
	    })];
	  },
	  title_after_icon_padding_large: function title_after_icon_padding_large(selector, vars$$1) {
	    return [title_padding_title_after_icon_padding({
	      selector: selector,
	      vars: vars$$1,
	      isLarge: true
	    }), title_padding_title_after_icon_padding({
	      selector: selectorRTL(selector),
	      vars: vars$$1,
	      isRTL: true,
	      isLarge: true
	    })];
	  },
	  height_large: function height_large(selector, vars$$1) {
	    return [breakpointTabletPortraitUp$1(selector, {
	      height: vars$$1.height_large + "px"
	    })];
	  },
	  padding_side_large: function padding_side_large(selector, vars$$1) {
	    return [breakpointTabletPortraitUp$1(selector, {
	      padding: "0 " + vars$$1.padding_side_large + "px"
	    })];
	  }
	};
	var layout$n = createLayout({
	  varFns: varFns$s
	}); // @ts-check

	var padding_side = vars.grid_unit_component * 2 - 12; // 16 - 12 = 4

	var padding_side_large = vars.grid_unit_component * 3 - 12; // 24 - 12 = 12

	var vars$1$3 = {
	  /**
	   * Generate general styles, not defined by variables
	   */
	  general_styles: true,
	  font_size: 20,
	  font_weight: 400,
	  height: vars.grid_unit_component * 7,
	  // 56
	  height_compact: vars.grid_unit_component * 6,
	  // 48
	  height_large: vars.grid_unit_component * 8,
	  // 64
	  line_height: vars.line_height,
	  padding_side: padding_side,
	  padding_side_large: padding_side_large,
	  indent: vars.unit_indent - padding_side,
	  indent_large: vars.unit_indent_large - padding_side_large,
	  title_after_icon_padding: 4,
	  title_after_icon_padding_large: 12,
	  title_padding: 16,
	  title_padding_large: 8,
	  color_light_text: rgba(vars.color_light_foreground, vars.blend_light_text_primary),
	  color_light_border: rgba(vars.color_light_foreground, vars.blend_light_border_light),
	  color_light_background: rgba(vars.color_light_background),
	  color_dark_text: rgba(vars.color_dark_foreground, vars.blend_dark_text_primary),
	  color_dark_border: rgba(vars.color_dark_foreground, vars.blend_dark_border_light),
	  color_dark_background: rgba(vars.color_dark_background)
	}; // @ts-check

	var fns$r = [layout$n, color$k];
	var selector$s = ".".concat(classes$16.component);
	styler.addStyle({
	  selectors: [selector$s],
	  fns: fns$r,
	  vars: vars$1$3
	});

	var reset = function reset() {
	  return [{
	    // apply a natural box layout model to all elements, but allow elements to change
	    " html": {
	      "box-sizing": "border-box"
	    },
	    " *, *:before, *:after": {
	      "box-sizing": "inherit"
	    },
	    " *": [// remove tap highlight in mobile Safari
	    {
	      "-webkit-tap-highlight-color": "rgba(0,0,0,0)"
	    }, {
	      "-webkit-tap-highlight-color": "transparent" // For some Androids

	    }],
	    // Remove dotted link borders in Firefox
	    " a, a:active, a:focus, input:active, *:focus": {
	      outline: 0
	    },
	    // Mobile Safari: override default fading of disabled elements
	    " input:disabled": {
	      opacity: 1
	    }
	  }];
	}; // @ts-check


	var robotoStyle = function robotoStyle() {
	  return [{
	    "html, body, button, input, select, textarea": {
	      fontFamily: "Roboto, Helvetica, Arial, sans-serif"
	    }
	  }];
	};


	var fontSize$1 = 14;

	var typography = function typography() {
	  return [{
	    " h1, h2, h3, h4, h5, h6, p": {
	      margin: 0,
	      padding: 0
	    }
	  }, {
	    " h1, h2, h3, h4, h5, h6": {
	      " small": {
	        "font-weight": vars.font_weight_normal,
	        "line-height": vars.line_height,
	        "letter-spacing": "-0.02em",
	        "font-size": "0.6em"
	      }
	    }
	  }, {
	    " h1": {
	      "font-size": "56px",
	      "font-weight": vars.font_weight_normal,
	      "line-height": vars.line_height,
	      "margin-top": "24px",
	      "margin-bottom": "24px"
	    }
	  }, {
	    " h2": {
	      "font-size": "45px",
	      "font-weight": vars.font_weight_normal,
	      "line-height": vars.line_height,
	      "margin-top": "24px",
	      "margin-bottom": "24px"
	    }
	  }, {
	    " h3": {
	      "font-size": "34px",
	      "font-weight": vars.font_weight_normal,
	      "line-height": vars.line_height,
	      "margin-top": "24px",
	      "margin-bottom": "24px"
	    }
	  }, {
	    " h4": {
	      "font-size": "24px",
	      "font-weight": vars.font_weight_normal,
	      "line-height": vars.line_height,
	      "-moz-osx-font-smoothing": "grayscale",
	      "margin-top": "24px",
	      "margin-bottom": "16px"
	    }
	  }, {
	    " h5": {
	      "font-size": "20px",
	      "font-weight": vars.font_weight_medium,
	      "line-height": vars.line_height,
	      "letter-spacing": "-0.02em",
	      "margin-top": "24px",
	      "margin-bottom": "16px"
	    }
	  }, {
	    " h6": {
	      "font-size": "16px",
	      "font-weight": vars.font_weight_normal,
	      "line-height": vars.line_height,
	      "letter-spacing": "0.04em",
	      "margin-top": "24px",
	      "margin-bottom": "16px"
	    }
	  }, {
	    " html, body": {
	      "font-size": fontSize$1 + "px",
	      "line-height": vars.line_height,
	      "font-weight": vars.font_weight_normal
	    },
	    " p": {
	      "font-size": fontSize$1 + "px",
	      "font-weight": vars.font_weight_normal,
	      "line-height": vars.line_height,
	      "letter-spacing": "0",
	      "margin-bottom": "16px"
	    },
	    " blockquote": {
	      "position": "relative",
	      "font-size": "24px",
	      "font-weight": vars.font_weight_normal,
	      "font-style": "italic",
	      "line-height": vars.line_height,
	      "letter-spacing": "0.08em",
	      "margin-top": "24px",
	      "margin-bottom": "16px"
	    },
	    " ul, ol": {
	      "font-size": fontSize$1 + "px",
	      "font-weight": vars.font_weight_normal,
	      "line-height": vars.line_height,
	      "letter-spacing": 0
	    },
	    " b, strong": {
	      "font-weight": vars.font_weight_medium
	    }
	  }];
	}; // @ts-check


	var fns$s = [robotoStyle, reset, typography];

	var addRoboto = function addRoboto() {
	  addWebFont("google", {
	    families: ["Roboto:400,500,700,400italic:latin"]
	  });
	};

	var addTypography = function addTypography() {
	  addRoboto();
	  styler.add("pe-material-design-typography", fns$s.map(function (s) {
	    return s();
	  }));
	};

	addTypography();
	var linkIconSVG = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z\"/></svg>";
	addStyle$2$1(".themed-button", {
	  color_light_background: "#FF1744",
	  color_light_text: "#fff"
	});
	addStyle$q(".themed-svg", {
	  color_light: "#2196f3"
	});
	addStyle$5(".themed-card", {
	  color_dark_main_background: "#B89E58",
	  color_dark_title_text: "#fff",
	  color_dark_subtitle_text: "#fff"
	});
	var App = {
	  view: function view() {
	    return mithril(".page", [mithril(".row", [mithril("h3", "Polythene for Mithril built with Rollup"), mithril("h6", "CSS Test")]), mithril(".row", [mithril("h6", "SVG"), mithril(".component", mithril(SVG, {
	      content: mithril.trust(linkIconSVG),
	      className: "themed-svg",
	      // Set explicit size for IE 11:
	      style: {
	        width: "24px",
	        height: "24px"
	      }
	    }))]), mithril(".row", [mithril("h6", "Raised Button"), mithril(".component", mithril(Button, {
	      raised: true,
	      label: "Button"
	    }))]), mithril(".row", [mithril("h6", "Text Button"), mithril(".component", mithril(Button, {
	      label: "Button"
	    }))]), mithril(".row", [mithril("h6", "Themed Regular Button"), mithril(".component", mithril(Button, {
	      label: "Button",
	      className: "themed-button"
	    }))]), mithril(".row", [mithril("h6", "Icon"), mithril(".component", mithril(Icon, {
	      size: "large",
	      src: "http://arthurclemens.github.io/assets/polythene/examples/avatar-1.png",
	      avatar: true
	    }))]), mithril(".row", [mithril("h6", "Icon Button"), mithril(".component", mithril(IconButton, {
	      icon: {
	        svg: {
	          content: mithril.trust(linkIconSVG)
	        }
	      }
	    }))]), mithril(".row", [mithril("h6", "FAB"), mithril(".component", mithril(FAB, {
	      icon: {
	        svg: {
	          content: mithril.trust(linkIconSVG)
	        }
	      }
	    }))]), mithril(".row", [mithril("h6", "Tabs"), mithril(".component", mithril(Tabs, {
	      tabs: [{
	        label: "New"
	      }, {
	        label: "Favorites"
	      }, {
	        label: "Saved"
	      }],
	      autofit: true
	    }))]), mithril(".row", [mithril("h6", "Card"), mithril(".component", mithril(Card, {
	      className: "themed-card",
	      tone: "dark",
	      content: [{
	        primary: {
	          title: "Get Ready",
	          subtitle: "2 Unlimited",
	          media: {
	            ratio: "square",
	            size: "medium",
	            content: mithril("img", {
	              src: "https://lastfm-img2.akamaized.net/i/u/avatar170s/ca297951611442bda8ea55fba764c757"
	            })
	          }
	        }
	      }, {
	        actions: {
	          content: [mithril(Button, {
	            label: "Listen now"
	          })]
	        }
	      }]
	    }))]), mithril(".row", [mithril("h6", "Checkbox"), mithril(".component", mithril(Checkbox, {
	      label: "Label"
	    }))]), mithril(".row", [mithril("h6", "Switch"), mithril(".component", mithril(Switch, {
	      label: "Label"
	    }))]), mithril(".row", [mithril("h6", "Radio Button"), mithril(".component", mithril(RadioGroup, {
	      name: "defaultChecked",
	      content: [{
	        value: "One",
	        label: "One"
	      }, {
	        value: "Two",
	        label: "Two",
	        defaultChecked: true
	      }]
	    }))]), mithril(".row", [mithril("h6", "TextField"), mithril(".component", mithril(TextField, {
	      defaultValue: "abC",
	      validate: function validate(value) {
	        return value !== value.toLowerCase() ? {
	          valid: false,
	          error: "Only use lowercase characters."
	        } : null;
	      },
	      validateAtStart: true
	    }))]), mithril(".row", [mithril("h6", "Slider"), mithril(".component", mithril(Slider, {
	      defaultValue: 50
	    }))]), mithril(".row", [mithril("h6", "Spinner"), mithril(".component", mithril(MaterialDesignSpinner, {
	      permanent: true
	    }))]), mithril(".row", [mithril("h6", "Dialog"), mithril(".component", mithril(Button, {
	      raised: true,
	      label: "Show dialog",
	      events: {
	        onclick: function onclick() {
	          return Dialog.show({
	            /* note the Dialog component is below the other elements in the app */
	            title: "Hello",
	            body: "Click outside to close, or press ESCAPE",
	            backdrop: true
	          });
	        }
	      }
	    }))]), mithril(".row", [mithril("h6", "Notification"), mithril(".component", mithril(Button, {
	      raised: true,
	      label: "Show Notification",
	      events: {
	        onclick: function onclick() {
	          return Notification.show({
	            /* note the Notification component is below the other elements in the app */
	            title: "Hello"
	          });
	        }
	      }
	    }))]), mithril(".row", [mithril("h6", "Snackbar"), mithril(".component", mithril(Button, {
	      raised: true,
	      label: "Show Snackbar",
	      events: {
	        onclick: function onclick() {
	          return Snackbar.show({
	            /* note the Snackbar component is below the other elements in the app */
	            title: "Hello"
	          });
	        }
	      }
	    }))]), mithril(Dialog), mithril(Snackbar), mithril(Notification)]);
	  }
	};
	mithril.mount(document.querySelector("#root"), App);

}));
//# sourceMappingURL=index.js.map
