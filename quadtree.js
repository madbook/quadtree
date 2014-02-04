(function (root, factory) {
    if (typeof define === 'function' && define.amd)
        define([], factory)
    else if (typeof exports === 'object')
        module.exports = factory()
    else
        root.QuadTree = factory()
})(this, function () {

    var MAX_CHILDREN = 3
    var MAX_DEPTH = 3

    function QuadTree (x0, y0, x2, y2, depth) {
        // A node in the quad tree.

        this.x0 = x0 || 0
        this.y0 = y0 || 0
        this.x2 = x2 || 300
        this.y2 = y2 || 200
        this.x1 = (this.x2 - this.x0) / 2 | 0
        this.y1 = (this.y2 - this.y0) / 2 | 0

        this.children  = []
        this.nodes = null
        this.depth = depth || 0
    }

    QuadTree.createTree = function (x0, y0, x1, y1) {
        return new QuadTree(x0, y0, x1, y1, 0)
    }

    QuadTree.prototype.insert = function (point) {
        // Insert a point into the tree, splitting if necessary.

        if (this.nodes !== null)
            return this.nodes[this.getIndex(point)].insert(point)

        if (this.children.length < MAX_CHILDREN || this.depth >= MAX_DEPTH)
            return this.insertChild(point)

        this.split()
        this.children.forEach(this.insert, this)
        this.children.length = 0
        return this.insert(point)
    }

    QuadTree.prototype.insertChild = function (point) {
        // Pushes point onto child array

        this.children.push(point)
        return this
    }

    QuadTree.prototype.getIndex = function (point) {
        // Get the index of the node to insert this point at.

        return 0 | (point.x > this.x1 ? 1 : 0) | (point.y > this.y1 ? 2 : 0)
    }


    QuadTree.prototype.split = function () {
        // Create four child nodes.

        if (this.nodes === null)
            this.nodes = []

        this.nodes.push(new QuadTree(this.x0, this.y0,
                                     this.x1, this.y1, this.depth + 1))
        this.nodes.push(new QuadTree(this.x1, this.y0,
                                     this.x2, this.y1, this.depth + 1))
        this.nodes.push(new QuadTree(this.x0, this.y1,
                                     this.x1, this.y2, this.depth + 1))
        this.nodes.push(new QuadTree(this.x1, this.y1,
                                     this.x2, this.y2, this.depth + 1))

        return this
    }

    QuadTree.prototype.collapse = function () {
        // Attempts to collapse unneccessarily complex nodes. Usefull if nodes
        // are altered a lot.

        if (this.nodes === null)
            return this

        this.nodes.forEach(eachNodeCollapse)

        if (this.countChildren() > MAX_CHILDREN)
            return this

        this.children = this.getAllChildren()
        this.nodes.forEach(eachNodeDestroy)
        this.nodes = null
    }

    QuadTree.prototype.reset = function () {
        // Rebuild the tree completely with current tree contents.

        var children = this.getAllChildren()
        this.destroy()
        children.forEach(this.insert, this)
    }

    QuadTree.prototype.getAllChildren = function () {
        // Gets all children.

        if (this.nodes !== null)
            return this.nodes.reduce(reduceNodeChildren, [])

        return this.getChildren()
    }

    QuadTree.prototype.destroy = function () {
        // Cleans up child nodes.

        if (this.nodes !== null) {
            this.nodes.forEach(eachNodeDestroy)
            this.nodes.length = 0
            this.nodes = null
        }

        this.children.length = 0
        this.children
    }

    QuadTree.prototype.remove = function (point) {
        // Search for an object in the QuadTree, and remove it if found.

        var children = this.search(point).getChildren()
        var i = children.indexOf(point)
        if (~i)
            children.splice(i, 1)

        return this
    }

    QuadTree.prototype.search = function (point) {
        // Find the QuadTree where a point would be located or inserted.

        if (this.nodes !== null)
            return this.nodes[this.getIndex(point)].search(point)

        return this
    }

    QuadTree.prototype.getChildren = function () {
        // Returns the child array.

        return this.children
    }

    QuadTree.prototype.countChildren = function () {
        // Returns the count of children, including children of nodes

        if (this.nodes !== null)
            return this.nodes.reduce(reduceNodeCountChildren, 0)

        return this.children.length
    }

    function eachNodeCollapse (node) {
        // Use with `this.nodes.forEach`. Collapses all nodes.
        return node.collapse()
    }

    function eachNodeDestroy (node) {
        // Use with `this.nodes.forEach`. Destroys all nodes.
        return node.destroy()
    }

    function reduceNodeCountChildren (val, node) {
        // Use with `this.nodes.reduce`. Counts node children.
        return val + node.countChildren()
    }

    function reduceNodeChildren (arr, node) {
        // Use with `this.nodes.reduce`. Builds an array of all node children.
        arr.push.apply(arr, node.getAllChildren())
        return arr
    }

    return QuadTree
})