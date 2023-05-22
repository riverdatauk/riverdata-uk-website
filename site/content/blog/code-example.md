---
title: Code example
description: Shows eleventy code plugin.
date: 2018-08-24
draft: true
tags:
  - second tag
  - posts with two tags
---

## Code

### Styled (with Syntax)

```js
// this is a command
function myCommand() {
  let counter = 0;
  counter++;
}

// Test with a line break above this line.
console.log('Test');
```

### Unstyled

```
// this is a command
function myCommand() {
	let counter = 0;
	counter++;
}

// Test with a line break above this line.
console.log('Test');
```

## Diff

```diff-js
 // this is a command
 function myCommand() {
+  let counter = 0;
-  let counter = 1;
   counter++;
 }

 // Test with a line break above this line.
 console.log('Test');
```
