define({
	/**
     * Resize the text area to aways fit the content.  
     * @param  {jQuery}
     * @return {undefined}
     */
    resizeTextArea: function ($textarea){
        var lines = $textarea.val().split('\n');
        var nrows = lines.length;
        var ncols = lines.reduce(function(prev, curr){
            return Math.max(prev, curr.length);
        }, 0);
        $textarea.attr('rows', Math.max(1, nrows-1));
        $textarea.attr('cols', Math.max(ncols, 40));
    },
});