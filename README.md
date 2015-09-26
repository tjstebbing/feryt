
```
                                _____                      __
       ,____          (\=-,   _/ ____\___________ ___.__._/  |_ 
       \ "=.`'-.______/ /^    \   __\/ __ \_  __ <   |  |\   __\
        `-._.-"(=====' /       |  | \  ___/|  | \/\___  | |  |  
                \<'--\(        |__|  \___  >__|   / ____| |__|  
                 ^^   ^^                 \/       \/            
```

Feryts out DOM elements from css selectors and asserts facts about them. 

This is particularly useful for testing components, templated email output,
or smoke-testing entire websites.

Feryt works with browser DOM or in node with [jsdom](https://www.npmjs.com/package/jsdom).


## Examples

In browser simply pass the document object to feryt and start asseting facts:

```js
// 1) page has a div element with a foo class
// 2) which within which are 4 ul elements

feryt(document).findOne('div.foo').find('ul').count(4);

```


Here is a simple test using jsdom and mocha:

```js
var jsdom = require('jsdom');
var feryt = require('feryt');

var html = `
  <div>
    <div class='list'>
      <div class='item'>abc</div>
      <div class='item'>abc</div>
      <div class='item'>abc</div>
      <div class='item'>abc</div>
    </div>
    <img src='http://google.com/logo.png'/>
  </div>`;



describe('Testing some HTML is valid', function() {

    var f = feryt(jsdom.jsdom(html).document);

    it("should have an img for the google logo, with a 'logo' class", function () {
        f.findOne('img')
         .attr({src : 'http://google.com/logo.png'})
         .classes(['logo']);
    });
    
    it('should have a list div with 4 items containing abc', function () {
        f.find('.list > .item')
         .count(4)
         .each(function(n) {
            n.content('abc');
         });
    });

});

```

## API:

##### `feryt(document) -> Feryt object`

The `feryt` constructor takes a DOM compatable document object and returns a
Feryt object.


### `Feryt object`

The `Feryt` object wraps a DOM document and provides the following methods:

##### `Feryt.findOne(selector) -> FerytNode object`

Given a valid CSS selector, will return the first match wrapped in a FerytNode,
if no element can be found, throws an exception. In the simplest case this can
be used to verify an element exists in the DOM.

```js
feryt(document).findOne('.carousel');
```

##### `Feryt.find(selector) -> FerytNodeList object`

Given a valid CSS selector, will return all matches wrapped in a FerytNodeList,
if no elements can be found, throws an exception.

```js
feryt(document).find('input[type=text]'); //finds all text inputs
```


### `FerytNode object`

Several methods return a FerytNode object, which represents a single DOM 
element with the following chainable methods.

##### `FerytNode.attr({ attr : value, ...}) -> self`

Iterates through the provided attributes (keys) and asserts their values are equal.

```js
feryt(document).findOne('img.logo').attr({ src : 'http://example.com/logo.png' });
```

##### `FerytNode.classes(['foo', ...], ['bar', ...]) -> self`

Asserts that classes are either present or absent. The first argument is an Array
of classes to check exist, the second to check do not exist. Either are optional.

```js
feryt(document).findOne('header > img').classes(['logo']);
```

##### `FerytNode.content(string) -> self`

Assert that the content (innerHTML) of an element matches string. 

```js
feryt(document).findOne('.content p:first-child').content('Green eggs and ham');
```

##### `FerytNode.findOne(selector) -> FerytNode object`

Simmilar to Feryt.findOne, however attempts to construct a unique selector for the
current element and joins that with the passed in selector with ' > '. Useful for
chaining further tests, especially combiled within a FerytNodeList.each function. 

```js
feryt(document).findOne('div.fnord').findOne('> img');
```
##### `FerytNode.find(selector) -> FerytNodeList object`

Simmilar to Feryt.find, however attempts to construct a unique selector for the
current element and joins that with the passed in selector. Useful for
chaining further tests, especially combiled within a FerytNodeList.each function. 


##### `FerytNode.raw() -> DOMElement`

Returns the raw DOMElement wrapped by this FerytNode.

### `FerytNodeList object`

Several methods return a FerytNodeList object, which represents an array of DOM 
elements with the following chainable methods.

##### `FerytNode.count(n) -> self`

Assert that the number of elements matched is `n`. 

```js
feryt(document).find('ul.results li').count(12);
```

##### `FerytNode.each(function(FerytNode) { ... }) -> self`

This takes a function which will be invoked once for each element in the list, 
this allows you to do branching and complext testing in a chainable way over 
many elements.


```js
feryt(document).find('ul.results li').each(function(elem) {
    //check that each li has a 'result' class and contains 3 paragraphs
    elem.classes(['result']).find('p').count(3);
});
```

##### `FerytNode.raw() -> DOMElement`

Returns the javascript Array of DOMElement wrapped by this FerytNode.





Feryt is MIT software, the cool ascii ferret was created by JGS














