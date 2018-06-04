// Copyright 2010 by Kelly Ford All rights reserved.
// This code may not be used without express written consent by the author.
// Website: http://www.dnndev.com
//---------------------------------------------------------------------------
(function($) {
    $.fn.adminList = function(options) {
        var opts = $.extend({}, $.fn.adminList.defaults, options);

        return this.each(function() {
            var theList = $(this);
            var itemText = null;
            var itemValue = null;

            theList.wrap("<div style=\"overflow:hidden;\" />");
            var container = theList.parent();
            theList.css({ "float": "left" });
            theList.change(function() {
                // enable editing when item selected
                var selItem = theList.find("option:selected");
                var panel = container.find("div");
                panel.find("input[type=\"text\"]:first").val(selItem.text());
                panel.find("input[type=\"text\"]:last").val(selItem.val());
                panel.find("input[value=Save]")
                    .removeClass("admin-list-new")
                    .addClass("admin-list-update");
                panel.show();
            });
            // Create command buttons
            var btns = $("<ul style=\"float:left;padding:0px;margin-left:5px;\">" +
                          "<li><span class=\"ui-icon-plus\"/></li>" +
                          "<li><span class=\"ui-icon-close\"/></li>" +
                          "<li><span class=\"ui-icon-circle-arrow-n\"/></li>" +
                          "<li><span class=\"ui-icon-circle-arrow-s\"/></li>" +
                         "</ul>" +
                         "<div style=\"display:none;clear:left;\">" +
                         " <label style=\"display:block;padding-bottom:3px;\">" + opts.textEntryLabel + "</label> <input type=\"text\" /><br />" +
                         " <label style=\"display:block;padding-top:4px;padding-bottom:3px;\">" + opts.valueEntryLabel + "</label> <input type=\"text\" /><br />" +
                         " <input type=\"button\" value=\"Save\" style=\"margin-left:30px;\" /> <input type=\"button\" value=\"Hide\" />" +
                         "</div>");
            itemText = btns.find("input[type=text]:first");
            itemValue = btns.find("input[type=text]:last");
            itemText.width(theList.width());
            itemValue.width(theList.width());
            btns.find("ul").css({ "margin-left": "10px" });
            btns.find("li").addClass("ui-state-default ui-corner-all")
                        .css({ "cursor": "pointer", "list-style": "none outside none", "margin": "2px", "padding": "1px 0 2px 2px", "position": "relative", "width": "18px" })
                        .hover(function() { $(this).addClass("ui-state-highlight"); }, function() { $(this).removeClass("ui-state-highlight"); });
            btns.find("li span").addClass("ui-icon");
            btns.find("li:first").css({ "margin-top": "-5px" });
            // Add Button 
            btns.find("li span.ui-icon-plus").click(function() {
                // clear the input boxes and show the panel to add an item
                var editdiv = $(this).parent().parent().parent().find("div");
                itemText.val('');
                var btnSave = editdiv.find("input[value=Save]");
                btnSave.removeClass("admin-list-update");
                btnSave.addClass("admin-list-new");
                editdiv.show();
                itemText.focus();
            });
            if (opts.showUpdDownButtons) {
                // Move Item Up/Down
                btns.find("li span.ui-icon-circle-arrow-n").parent().click(function() {
                    var lst = theList.get(0);
                    var curIndex = lst.selectedIndex;
                    if (curIndex > 0) {
                        // can move up - swap current item with the one above it
                        var selItem = theList.find("option:selected");
                        var prevItem = selItem.prev();
                        prevItem.before(selItem);
                    }
                });
                btns.find("li span.ui-icon-circle-arrow-s").parent().click(function() {
                    var lst = theList.get(0);
                    var curIndex = lst.selectedIndex;
                    if (curIndex < lst.length - 1) {
                        // can move up - swap current item with the one above it
                        var selItem = theList.find("option:selected");
                        var nextItem = selItem.next();
                        nextItem.after(selItem);
                    }
                });
            } else {
                btns.find("li span.ui-icon-circle-arrow-n").parent().remove();
                btns.find("li span.ui-icon-circle-arrow-s").parent().remove();
            }
            // Delete Item(s)
            btns.find("li span.ui-icon-close").parent().click(function() {
                var selItem = theList.find("option:selected");
                if (selItem) { selItem.remove(); }
                $.isFunction(opts.listChanged) && opts.listChanged.call(theList);
                // hide the edit panel if it's showing.
                container.find("div").hide();
            });


            // add a little headroom for the Save/Hide buttons
            btns.find("input[type=button]").css({ "margin-top": "5px" });
            btns.find("input[value=Save]").click(function() {
                // validate and add to list box
                if ($(this).hasClass("admin-list-update")) {
                    var selItem = theList.find("option:selected");
                    selItem.val(itemValue.val());
                    selItem.text(itemText.val());
                    itemText.val('');
                    itemValue.val('');
                    $.isFunction(opts.listChanged) && opts.listChanged.call(theList);
                    $(this).parent().hide();
                }
                else {
                    // add item to listbox
                    var newItem = "<option value=\"" + itemValue.val() + "\">" + itemText.val() + "</option>";
                    theList.append(newItem);
                    // select item so listbox scrolls to selected item
                    var items = theList.find("option").length;
                    theList.attr("selectedIndex", items - 1);
                    $.isFunction(opts.listChanged) && opts.listChanged.call(theList);
                    // set user back to item text and select the text there so they're ready to add
                    // another item.
                    itemText.focus();
                    itemText.select();

                }
            });
            btns.find("input[value=Hide]").click(function() {
                $(this).parent().hide();
            });
            $(this).after(btns);

        });
    };
    // textEntryLabel:      Text to use for the caption for the display text for the list item
    // valueEntryLabel:     Text to use for the caption for the hidden value for the list item
    // showUpDownButtons:   If true, user can select an item and move it up or down in the list
    // listChanged:         Callback. Supply a function to be called when the list contents have changed
    $.fn.adminList.defaults = {
        textEntryLabel: 'Text:',
        valueEntryLabel: 'Value:',
        showUpDownButtons: true,
        listChanged: null
    };
})(jQuery);