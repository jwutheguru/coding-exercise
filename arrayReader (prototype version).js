/**
 *  ArrayReader
 *  =================================
 *  A simple array iterator.
 *
 *  Constructor:
 *      - ArrayReader(array)    Takes an array of anything.
 *
 *  Methods:
 *      - hasNext               Checks if array can still be iterated forward.
 *      - next                  Moves the current iterator position forward and returns the new value.
 *      - current               Returns the value at the current iterator position.
 *      - tag                   Saves the value at current iterator position for use later. 
 *      - reverse               Reverses ArrayReader's array as well as the iterator position.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        module.exports = factory();
    else
        root.ArrayReader = factory();
})(this, function() {
    'use strict';

    /**
     *  Creates ArrayReader, a simple array iterator
     *  @class ArrayReader
     *  @param {*[]} array - An array of anything. Default [] if no or invalid param
     */
    function ArrayReader(array) {
        /** 
         *  @prop A copy of the array passed in. So as to prevent user altering original.
         */
        this._arr = (array && Array.isArray(array)) ? array.slice(0) : [];

        /** @prop Current iterator position, starting at 0 (could also be -1) */
        this._currIndex = 0;
    }

    /**
     *  Checks if array can still be iterated forward.
     *  @return {boolean} Whether array still has value in the next position
     */
    ArrayReader.prototype.hasNext = function() {
        return (this._currIndex >= -1 && this._currIndex < this._arr.length - 1);
    };

    /**
     *  Moves the current iterator position forward and returns the new value.
     *  Calls the current() method. @see current().
     *  @return {* | null} The new value at the updated iterator position. 
     *                      Returns null if out of array bounds.
     */
    ArrayReader.prototype.next = function() {
        /* _currIndex never exceeds array length. 
         * This is by design so when ArrayReader.reverse() is called, 
         * user may traverse array again in reverse. @see {@link ArrayReader.prototype.reverse}
         */
        if (this._currIndex < this._arr.length) 
            this._currIndex++;

        return this.current();
    };

    /**
     *  Returns the value at the current iterator position.
     *  @return {* | null} Value at current iterator position. 
     *                      Returns null if out of array bounds.
     */
    ArrayReader.prototype.current = function() {
        if (this._currIndex < 0 || this._currIndex >= this._arr.length)
            return null;
        else
            return this._arr[this._currIndex];
    };

    /**
     *  Returns a function that returns the current value when this method is called. 
     *  @return {function} Function to retrieve the value at current iterator position
     *                      when this method ('tag') was invoked.
     */
    ArrayReader.prototype.tag = function() {
        var currValue = this.current();

        return function() {
            return currValue;
        };
    };

    /**
     *  Reverses ArrayReader's array as well as the iterator position.
     *  Example: 
     *          ArrayReader's array is [1, 2, 3, 4(*), 5]. Where (*) denotes current iterator position.
     *          When reverse is called, ArrayReader's array is now [5, 4(*), 3, 2, 1].
     *          The return value of ArrayReader.current() is the same before reversal. 
     *          Further calls to ArrayReader.next() will read out the array in reverse.
     */
    ArrayReader.prototype.reverse = function() {
        this._arr.reverse();

        // "Reflect" the current iterator position about the array's center
        // Arrays that have been fully traversed (index at arr.length) will now be at -1.
        var middle = (this._arr.length - 1) / 2;
        this._currIndex = middle - (this._currIndex - middle);
    };

    return ArrayReader;

});
