
module.exports = function feryt(document) {
    return new (function Feryt() {

        this.find = function find(selector) {
            return _find(selector, true);
        };

        this.findOne = function find(selector) {
            return _find(selector);
        };

        function wrapList(elements) {
            return new (function FerytNodeList(elements) {

                this.count = function count(n) {
                    testEquality('matched element count', elements.length, n);
                    return this;
                };

                this.each = function attr(fn) {
                    elements.forEach(function(el) { fn(wrapNode(el)); });
                    return this;
                };

                this.raw = function raw() {
                    return elements;
                };
                
            })(Array.prototype.slice.call(elements));

        }

        function wrapNode(element) {
            return new (function FerytNode(element) {

                this.classes = function checkClass(hasClasses, doesntHaveClasses) {
                    if(!hasClasses) hasClasses = [];
                    if(!doesntHaveClasses) doesntHaveClasses = [];
                    hasClasses.forEach(function checkHasClass(c) {
                        testTruth("expected class '" + c + "'", element.className.indexOf(c) > -1);
                    });

                    doesntHaveClasses.forEach(function checkNoClass(c) {
                        testTruth("expected not to find class '" + c+"'", element.className.indexOf(c) === -1);
                    });
                    return this;
                };
                
                this.find = function find(selector) {
                    selector = getSelectorFromElement(document, element) + selector;
                    return _find(selector, true);
                };

                this.findOne = function find(selector) {
                    selector = getSelectorFromElement(document, element) + selector;
                    return _find(selector);
                };
                
                this.content = function content(str) {
                    testEquality('content', element.innerHTML, str);
                    return this;
                };

                this.raw = function raw() {
                    return element;
                };

                this.attr = function attr(attrs) {
                    Object.keys(attrs).forEach(function checkAttribute(k) {
                        testEquality("attribute '"+k+"'", element.getAttribute(k), attrs[k]);
                    });
                    return this;
                };
            })(element);
        }


        //modified from https://github.com/rishihahs/domtalk (see that github for MIT license)
        function getSelectorFromElement(document, element) {
            if (element === document.documentElement) {
                return ':root';
            } else if (element.tagName && element.tagName.toUpperCase() === 'BODY') {
                return 'body';
            } else if (element.id) {
                return '#' + element.id;
            }

            var parent = element.parentNode;
            var parentLoc = getSelectorFromElement(document, parent);

            var children = parent.childNodes;
            var index = 0;
            for (var i = 0; i < children.length; i++) {
                if (children[i].nodeType === 1) {
                    if (children[i] === element) {
                        break;
                    }

                    index++;
                }
            }
            return parentLoc + ' *:nth-child(' + (index + 1) + ')';
        }
        
        function testEquality(msg, a, b) {
            if(a === b) return true;
            var err = msg + " was '" + a.toString() + "', expected '" + b.toString()+"'";
            throw Error(err);
        }

        function testTruth(msg, bool) {
            if(bool) return true;
            throw Error(msg);
        }

        function _find(selector, multi) {
            var results = document[multi ? 'querySelectorAll' : 'querySelector'](selector);
            testTruth("nothing matching '"+selector+"'", results);
            if(multi) return wrapList(results);
            return wrapNode(results);

        }

    })(document);
};


