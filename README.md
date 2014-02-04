quadtree
========

Simple quad tree for tracking point positions

Load via CommonJS (node-style), AMD, or via script tag.

To create a quad tree

```
var QuadTree = require('./quadtree.js')
myTree = new QuadTree(0, 0, 300, 200)
```

## Methods

A _point_ refers to any object with an `x` and `y` coordinate.  This QuadTree
implementation does not take width or height into account, so a point can only
live in a single node quadrant at a time, so it _may_ not be suitable for
collision detection (depending on your needs).

name | parameters | description
---- | ---------- | -----------
insert | `{x: Number, y: Number}` | insert a _point_ into the quadtree
remove | `{x: Number, y: Number}` | find and remove a _point_ from the quadtree
search | `{x: Number, y: Number}` | returns the node where a point _would_ be inserted
getChildren | | returns the array containing the node's children
getAllChildren | | returns an array of all _points_ contained in sub-nodes' children
countChildren | | returns number of _points_ contained in a node or its sub-nodes
destroy | | removes all children and all sub-nodes from the current node
reset | | destroys the node and rebuilds with current contents, useful if objects move around a lot.