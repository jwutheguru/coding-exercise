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
     *  @param {*[]} array - An array of anything. Default [] if no or invalid param.
     */
    function ArrayReader(array) {
        /** 
         *  @prop A copy of the array passed in. So as to prevent user altering original.
         */
        var arr = (array && Array.isArray(array)) ? array.slice(0) : [];

        /** 
         *  @prop Current iterator position, starting at 0 (could also be -1) 
         */
        var currIndex = 0;

        /*
            The following variables are for saving the array in original and reversed order
            to speed up reverse() method. @see reverse();  
         */
        var reversalCounter = 0;
        var origArr, reversedArr;

        /**
         *  Checks if array can still be iterated forward.
         *  @return {boolean} Whether array still has value in the next position
         */
        function hasNext() {
            return (currIndex >= -1 && currIndex < arr.length - 1);
        }

        /**
         *  Moves the current iterator position forward and returns the new value.
         *  Calls the current() method. @see current().
         *  @return {* | null} The new value at the updated iterator position. 
         *                      Returns null if out of array bounds.
         */
        function next() {
            /* currIndex never exceeds array length. 
             * This is by design so when ArrayReader.reverse() is called, 
             * user may traverse array again in reverse. @see reverse()
             */
            if (currIndex < arr.length) 
                currIndex++;

            return current();
        }

        /**
         *  Returns the value at the current iterator position.
         *  @return {* | null} Value at current iterator position. 
         *                      Returns null if out of array bounds.
         */
        function current() {        
            if (currIndex < 0 || currIndex >= arr.length)
                return null;
            else
                return arr[currIndex];
        }

        /**
         *  Returns a function that returns the current value when this method is called. 
         *  @return {function} Function to retrieve the value at current iterator position
         *                      when this method ('tag') was invoked.
         */
        function tag() {
            var currValue = current();

            return function() {
                return currValue;
            };
        }

        /**
         *  Reverses ArrayReader's array as well as the iterator position.
         *  Example: 
         *          ArrayReader's array is [1, 2, 3, 4(*), 5]. Where (*) denotes current iterator position.
         *          When reverse is called, ArrayReader's array is now [5, 4(*), 3, 2, 1].
         *          The return value of ArrayReader.current() is the same before reversal. 
         *          Further calls to ArrayReader.next() will read out the array in reverse.
         */
        function reverse() {
            /*  If memory space is not an issue, the following is faster 
                for subsequent reverse() calls after the first. */

            // Create 2 arrays, one in original order and one reversed order.
            if (reversalCounter === 0) {
                origArr = arr.slice(0);
                reversedArr = arr.slice(0).reverse();
            }

            // From now on, arr will just reference either origArr or reversedArr.
            // On first and every odd numbered calls to reverse(), reference reverseArr, else origArr.
            arr = (++reversalCounter % 2 === 0) ? origArr : reversedArr;

            /*  Otherwise, we could just use simple reversal */
            // arr.reverse();

            // "Reflect" the current iterator position about the array's center
            // Arrays that have been fully traversed (index at arr.length) will now be at -1.
            var middle = (arr.length - 1) / 2;
            currIndex = middle - (currIndex - middle);
        }


        /** Public methods */
        this.hasNext = hasNext;
        this.next = next;
        this.current = current;
        this.tag = tag;
        this.reverse = reverse;
    }

    return ArrayReader;

});
