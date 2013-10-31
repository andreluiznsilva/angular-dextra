jQuery.fn.table2CSV = function(options) {
    var options = jQuery.extend({
        separator : ',',
        header : []
    }, options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    // header
    var numCols = options.header.length;
    var tmpRow = []; // construct header available array

    if (numCols > 0) {
        for ( var i = 0; i < numCols; i++) {
            tmpRow[tmpRow.length] = formatData(options.header[i]);
        }
    } else {
        $(el).filter(':visible').find('th').each(function() {
            if ($(this).css('display') != 'none')
                tmpRow[tmpRow.length] = formatData($(this).html());
        });
    }

    row2CSV(tmpRow);

    // actual data
    $(el).find('tr').each(function() {
        var tmpRow = [];
        $(this).filter(':visible').find('td').each(function() {
            if ($(this).css('display') != 'none')
                tmpRow[tmpRow.length] = formatData($(this).html());
        });
        row2CSV(tmpRow);
    });

    return csvData;

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = mystr;
        }
    }
    function formatData(input) {
        // replace " with â€œ
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "â€œ");
        // HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        if (output == "")
            return '';
        return '"' + output + '"';
    }
};