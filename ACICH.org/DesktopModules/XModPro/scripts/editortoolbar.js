// requires: jQuery UI dialog; formbuilder.js, code-mirror/util/formatting.js
//
// ================================================================
// editorToolbar Plugin for XMod Pro
// Copyright 2011-2012 by Kelly Ford for KnowBetter Creative Services LLC
// All rights reserved
// ----------------------------------------------------------------
//
(function ($) {
    var dataID = "editorToolbar";
    var methods = {
        init: function (options) {
            var opts = $.extend({}, $.fn.editorToolbar.defaults, options);
            var $this = $(this), data = $this.data(dataID);
            if (!data) {
                $this.data(dataID, {
                    opts: opts,
                    container: $this
                });
            }
            initialize($this);
        }
    };

    $.fn.editorToolbar = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.editorToolbar');
        }
    };

    $.editorToolbar = {}; // base object to hold static functions

    // OPTIONS:
    // contentType - 'template', 'form', or 'feed'. Determines how to populate the tag lists
    $.fn.editorToolbar.defaults = {
        contentType: 'template',
        editor: null,
        xdata: null  //needed for ControlDataSource tag.
    }; // editorToolbar.defaults


    function initialize(container) {
        var data = container.data(dataID);
        var opts = data.opts;
        var editor = opts.editor;
        // Create tabs
        container.html('<div class="xmp-toolbar ui-widget-content ui-corner-top">' +
            '<ul class="ui-helper-reset">' +
            '<li class="xmp-toolbar-bold"><img src="images/bold.png" title="Bold" /></li>' +
            '<li class="xmp-toolbar-italic"><img src="images/italic.png" title="Italic" /></li>' +
            '<li class="xmp-toolbar-table"><img src="images/table.png" title="Insert Table" /></li>' +
            '</ul>' +
            '<label>Tags</label>' +
            '<select size="1" class="xmp-tags" style="margin-left: 4px;"></select>' +
            '<label>Tokens</label>' +
            '<select size="1" class="xmp-tokens" style="margin-left: 4px;"></select>' +
            '<label>Snippets</label>' +
            '<select size="1" class="xmp-snippets" style="margin-left: 4px;"></select>' +
            '<ul class="ui-helper-reset">' +
            '<li class="xmp-toolbar-indentall"><img src="images/reformat.png" title="Reformat" /></li>' +
            '</ul>' +
            '</div>');
        container.find('.xmp-toolbar li').addClass('ui-state-default ui-corner-all').hover(function () {
            $(this).addClass('ui-state-hover').css({ 'cursor': 'pointer' });
        }, function () {
            $(this).removeClass('ui-state-hover').css({ 'cursor': 'normal' });
        }).find('img').css({ 'margin': '4px', 'border': '0px none' });
        container.find('.xmp-toolbar select').css({ 'margin-right': '8px', 'float': 'left' });
        container.find('.xmp-toolbar label').css({ 'float': 'left' });

        // add DIV to hold designer pop-up
        container.append('<div id="xmp-designer" class="xmp-designer"></div>');

        var $tagList = container.find("select.xmp-tags");
        var $tokenList = container.find("select.xmp-tokens");
        switch (opts.contentType) {
            case "template":
                initTemplate(container, $tagList, $tokenList);
                break;
            case "form":
                initForm(container, $tagList, $tokenList);
                break;
            case "feed":
                initFeed(container, $tagList, $tokenList);
                break;
        }

        // setup toolbar buttons
        container.find('.xmp-toolbar-bold').click(function () {
            var sel = editor.getSelection();
            editor.replaceSelection('<strong>' + sel + '</strong>');
        });
        container.find('.xmp-toolbar-italic').click(function () {
            var sel = editor.getSelection();
            editor.replaceSelection('<em>' + sel + '</em>');
        });
        container.find('.xmp-toolbar-table').click(function () {
            var sel = editor.getSelection();
            var out =
                '<table>\n' +
                '<thead>\n' +
                '<tr>\n' +
                '<th></th>\n' +
                '</tr>\n' +
                '</thead>\n' +
                '<tbody>\n' +
                '<tr>\n' +
                '<td>' + sel + '</td>\n' +
                '</tr>\n' +
                '</tbody>\n' +
                '</table>';
            var nLines = out.split('\n').length;
            editor.replaceSelection(out);
            indentLines(nLines, editor);
        });
        container.find('.xmp-toolbar-indentall').click(function () {
            editor.execCommand("selectAll");
            var range = getSelectedRange(editor);
            editor.autoFormatRange(range.from, range.to);
        });

        // xmp.snippets requires /Portals/_default/XModPro/snippets.js be loaded into parent page.
        var $lstSnippets = container.find(('select.xmp-snippets'));

        getSnippets($lstSnippets, container);

        $lstSnippets.change(function () {
            var index = $(this).val();
            if (index === 'edit') {
                // display snippet manager
                var $mgr = $('#xmp-snippet-mgr');
                if ($mgr.length === 0) {
                    // create the mgr
                    var mgr = '<div id="xmp-snippet-mgr"></div>';
                    $('body').append(mgr);
                    $('#xmp-snippet-mgr').snippetManager({ snippets: xmp.snippets });
                    $mgr = $('#xmp-snippet-mgr');
                    $mgr.dialog({ modal: true,
                        width: 450,
                        height: 420,
                        title: "Snippet Manager",
                        position: { my: "ceter top", at: "ceter top+10" },
                        buttons: {
                            "Save Changes": function () {
                                // send the data to the server for saving.
                                var snippets = $('#xmp-snippet-mgr').snippetManager('getSnippets');
                                var snipText = JSON.stringify(snippets);
                                $.ajax({
                                    type: "POST",
                                    datatype: "text",
                                    url: "KBXM_Manage.aspx",
                                    data: { xdata: data.opts.xdata, callback: 'updatesnippets', snippets: snipText },
                                    success: function (data) {
                                        if (typeof xmp === 'undefined' || !xmp) { xmp = {}; };
                                        xmp.snippets = snippets;
                                        loadSnippets($lstSnippets, container)
                                        $mgr.dialog("close");
                                    },
                                    error: function (jqXHR) {
                                        alert(jqXHR.responseText);
                                    },
                                    cache: false
                                });

                            },
                            "Cancel": function () {
                                $mgr.dialog("close");
                            }
                        }
                    });
                }
                $mgr.dialog("open");
            } else if (index !== '') {
                editor.replaceSelection(xmp.snippets[index].snippet);
                $(this).val('');
            }
        });

    }
    function getSnippets($lst, container) {
        var data = container.data(dataID);
        var opts = data.opts;
        $.ajax({
            type: "POST",
            datatype: "json",
            url: "KBXM_Manage.aspx",
            data: { xdata: data.opts.xdata, callback: 'loadsnippets' },
            success: function (data) {
                if (typeof xmp === 'undefined' || !xmp) { xmp = {}; };
                xmp.snippets = data;
                loadSnippets($lst, container);
            },
            error: function (jqXHR) {
                alert(jqXHR.responseText);
            },
            cache: false
        });
    }
    function loadSnippets($lst, container) {
        var data = container.data(dataID);
        var opts = data.opts;
        var sOut = '<optgroup label=""><option value="" />';
        if (typeof xmp !== 'undefined' && typeof xmp.snippets !== 'undefined') {
            var snippet = null;
            for (var n = 0; n < xmp.snippets.length; n++) {
                snippet = xmp.snippets[n];
                if (snippet.context === 'undefined' || snippet.context === 'all' || snippet.context === opts.contentType) {
                    sOut += '<option value="' + n + '">' + xmp.snippets[n].name + '</option>';
                }
            }
        }
        sOut += '</optgroup>';
        sOut += '<optgroup label="------------------"><option value="edit">Edit Snippets</option>';
        $lst.each(function () {
            $(this).html(sOut);
        });
    }

    function getSelectedRange(editor) {
        return { from: editor.getCursor(true), to: editor.getCursor(false) };
    }
    function initTemplate(container, $tagList, $tokenList) {
        var data = container.data(dataID);
        var editor = data.opts.editor;
        var tags = new Array();
        tags = ["AddButton", "AddImage", "AddLink", "AjaxButton",
                "AjaxImage", "AjaxLink", "AlternatingItemTemplate",
                "CommandButton", "CommandImage", "CommandLink", "CustomCommands",
                "DataList", "DataCommand", "DeleteButton",
                "DeleteImage", "DeleteLink", "DeleteCommand",
                "DetailButton", "DetailDataSource", "DetailImage", "DetailLink", "DetailTemplate",
                "Each", "EditButton", "EditImage", "EditLink",
                "FooterTemplate", "Format",
                "HeaderTemplate",
                "IfEmpty", "IfNotEmpty",
                "ItemTemplate",
                "jQueryReady", "ListDataSource",
                "LoadFeed", "LoadFeedButton", "LoadFeedImage", "LoadFeedLink",
                "MetaTags", "NavigateUrl", "NoItemsTemplate", "Pager", "Redirect", "Register", "ReturnButton",
                "ReturnImage", "ReturnLink",
                "SeparatorTemplate", "ScriptBlock", "SearchSort", "Select", "Slideshow",
                "Template", "ToggleButton", "ToggleImage", "ToggleLink"];
        var lstHtml = '<option value=""></option>';
        var curTag = '';
        for (var i = 0; i < tags.length; i++) {
            curTag = tags[i].replace(/[\s\-]/, "").toLowerCase();
            lstHtml += '<option value="' + curTag + '">' + tags[i] + '</option>'
        }
        $tagList.html(lstHtml);
        $tagList.change(function () {
            var $lst = $(this);
            if (!$lst.val()) return;
            var tag = $lst.find('option:selected').text();
            var sel = editor.getSelection();
            var bUseDialog = true;
            switch ($lst.val()) {
                case 'alternatingitemtemplate':
                    editor.replaceSelection('<AlternatingItemTemplate>' + sel + '</AlternatingItemTemplate>');
                    bUseDialog = false;
                    break;
                case 'detailtemplate':
                    editor.replaceSelection('<DetailTemplate>' + sel + '</DetailTemplate>');
                    bUseDialog = false;
                    break;
                case 'footertemplate':
                    editor.replaceSelection('<FooterTemplate>' + sel + '</FooterTemplate>');
                    bUseDialog = false;
                    break;
                case 'headertemplate':
                    editor.replaceSelection('<HeaderTemplate>' + sel + '</HeaderTemplate>');
                    bUseDialog = false;
                    break;
                case 'itemtemplate':
                    editor.replaceSelection('<ItemTemplate>' + sel + '</ItemTemplate>');
                    bUseDialog = false;
                    break;
                case 'noitemstemplate':
                    editor.replaceSelection('<NoItemsTemplate>' + sel + '</NoItemsTemplate>');
                    bUseDialog = false;
                    break;
                case 'separatortemplate':
                    editor.replaceSelection('<SeparatorTemplate>' + sel + '</SeparatorTemplate>');
                    bUseDialog = false;
                    break;
            }
            if (!bUseDialog) return;
            var linesToIndent = 1;
            var $designer = $('<div id="xmp-designer"></div>');
            $designer.tagDesigner({ tagName: tag });
            var dlgTop = container.position().top + 50;
            var dlgLeft = container.position().left + 240;
            $designer.dialog({
                width: 400,
                position: [dlgLeft, dlgTop],
                title: tag,
                buttons: {
                    "Save": function () {
                        var output = $designer.tagDesigner("getTagCode");
                        // subtract 1 b/c even if no \n, there's still a line
                        var nLines = output.split("\n").length - 1;
                        editor.replaceSelection(output);
                        indentLines(nLines, editor);
                        $(this).dialog('destroy');
                        $lst.val('');
                        $(this).remove();
                        editor.focus();
                    },
                    close: function () {
                        $(this).dialog('destroy');
                        $(this).remove();
                        $lst.val('');
                        editor.focus();
                    }
                }
            });
            $designer.dialog('open');
        }); //$tagList.change()
        var tokens = new Array();
        tokens = ["Cookie:cookieName", "DateAdd:1,d,MM/dd/yyyy", "Form:parameterName",
                  "Join()", "Localize: keyName",
                  "Module:Id", "Module:Title",
                  "Portal:Id",
                  "Request:HostAddress", "Request:HostName", "Request:PageName", "Request:Referrer", "Request:URL",
                  "Request:Agent", "Request:Browser", "Request:Locale", "URL:parameterName",
                  "User:Email", "User:ID", "User:Username", "User:FirstName", "User:LastName", "User:DisplayName"]
        lstHtml = '<option value=""></option>';
        for (var i = 0; i < tokens.length; i++) {
            lstHtml += '<option value="[[' + tokens[i] + ']]">' + tokens[i] + '</option>';
        }
        $tokenList.html(lstHtml).change(function () {
            editor.replaceSelection($(this).val());
            $(this).val('');
        });
    }
    function initFeed(container, $tagList, $tokenList) {
        var data = container.data(dataID);
        var editor = data.opts.editor;
        var tags = new Array();
        tags = ["Feed", "Format", "ListDataSource", "Register", "SearchSort", "Select"];
        var lstHtml = '<option value=""></option>';
        var curTag = '';
        for (var i = 0; i < tags.length; i++) {
            curTag = tags[i].replace(/[\s\-]/, "").toLowerCase();
            lstHtml += '<option value="' + curTag + '">' + tags[i] + '</option>'
        }
        $tagList.html(lstHtml);
        $tagList.change(function () {
            var $lst = $(this);
            if (!$lst.val()) return;
            var tag = $lst.find('option:selected').text();
            var sel = editor.getSelection();
            var linesToIndent = 1;
            var $designer = $('<div id="xmp-designer"></div>');
            $designer.tagDesigner({ tagName: tag });
            var dlgTop = container.position().top + 50;
            var dlgLeft = container.position().left + 240;
            $designer.dialog({
                width: 400,
                position: [dlgLeft, dlgTop],
                title: tag,
                buttons: {
                    "Save": function () {
                        var output = $designer.tagDesigner("getTagCode");
                        // subtract 1 b/c even if no \n, there's still a line
                        var nLines = output.split("\n").length - 1;
                        editor.replaceSelection(output);
                        indentLines(nLines, editor);
                        $(this).dialog('destroy');
                        $lst.val('');
                        $(this).remove();
                        editor.focus();
                    },
                    close: function () {
                        $(this).dialog('destroy');
                        $(this).remove();
                        $lst.val('');
                        editor.focus();
                    }
                }
            });
            $designer.dialog('open');
        }); //$tagList.change()
        var tokens = new Array();
        tokens = ["Cookie:cookieName", "DateAdd:1,d,MM/dd/yyyy", "Form:parameterName", "Join()",
                  "Request:Referrer", "Request:URL", "Request:PageName", "Request:HostName",
                  "Request:Agent", "Request:Browser", "Request:Locale", "URL:parameterName"]
        lstHtml = '<option value=""></option>';
        for (var i = 0; i < tokens.length; i++) {
            lstHtml += '<option value="[[' + tokens[i] + ']]">' + tokens[i] + '</option>';
        }
        $tokenList.html(lstHtml).change(function () {
            editor.replaceSelection($(this).val());
            $(this).val('');
        });
    }

    function initForm(container, $tagList, $tokenList) {
        var data = container.data(dataID);
        var opts = data.opts;
        var editor = data.opts.editor;
        var dialogInitialized = false;
        var tags = new Array();
        tags = ["Action", "AddButton", "AddImage", "AddLink", "AddToRoles", "AddUser", "AjaxButton", "AjaxImage", "AjaxLink",
                "CalendarButton", "CalendarImage", "CalendarLink", "CancelButton",
                "CancelImage", "CancelLink", "CAPTCHA", "Checkbox", "CheckboxList",
                "ContinueButton", "ContinueImage", "ContinueLink", "ControlDataSource", "DateInput",
                "DropdownList", "DualList", "Email", "FileUpload", "HTMLInput", "jQueryReady",
                "Label", "ListBox", "Panel", "Password", "RadioButton", "RadioButtonList",
                "Register", "Redirect", "RemoveFromRoles", "ScriptBlock", "SelectCommand", "SilentPost",
                "SubmitCommand", "Tabstrip", "Text", "TextArea", "TextBox",
                "UpdateButton", "UpdateImage", "UpdateLink", "UpdateUser",
                "Validation", "ValidationSummary"];
        var lstHtml = '<option value=""></option>';
        var curTag = '';
        for (var i = 0; i < tags.length; i++) {
            curTag = tags[i].replace(/[\s\-]/, "").toLowerCase();
            lstHtml += '<option value="' + curTag + '">' + tags[i] + '</option>'
        }
        $tagList.html(lstHtml);
        $tagList.change(function () {
            var $lst = $(this);
            if (!$lst.val()) return;
            var ctl = null;
            switch ($lst.val()) {
                case 'action': ctl = new ctlAction(); break;
                case 'addbutton': ctl = new ctlAddButton(); break;
                case 'addimage': ctl = new ctlAddImage(); break;
                case 'addlink': ctl = new ctlAddLink(); break;
                case 'addtoroles': ctl = new ctlAddToRoles(); break;
                case 'adduser': ctl = new ctlAddUser(); break;
                case 'ajaxbutton': ctl = new ctlAjaxButton(); break;
                case 'ajaximage': ctl = new ctlAjaxImage(); break;
                case 'ajaxlink': ctl = new ctlAjaxLink(); break;
                case 'calendarbutton': ctl = new ctlCalendarButton(); break;
                case 'calendarimage': ctl = new ctlCalendarImage(); break;
                case 'calendarlink': ctl = new ctlCalendarLink(); break;
                case 'cancelbutton': ctl = new ctlCancelButton(); break;
                case 'cancelimage': ctl = new ctlCancelImage(); break;
                case 'cancellink': ctl = new ctlCancelLink(); break;
                case 'captcha': ctl = new ctlCaptcha(); break;
                case 'checkbox': ctl = new ctlCheckBox(); break;
                case 'checkboxlist': ctl = new ctlCheckBoxList(); break;
                case 'continuebutton': ctl = new ctlContinueButton(); break;
                case 'continueimage': ctl = new ctlContinueImage(); break;
                case 'continuelink': ctl = new ctlContinueLink(); break;
                case 'controldatasource': ctl = new ctlControlDataSource(); break;
                case 'dateinput': ctl = new ctlDateInput(); break;
                case 'dropdownlist': ctl = new ctlDropDownList(); break;
                case 'duallist': ctl = new ctlDualList(); break;
                case 'email': ctl = new ctlEmail(); ctl.ignoreSendRule = true; break;
                case 'fileupload': ctl = new ctlFileUpload(); break;
                case 'htmlinput': ctl = new ctlHtmlInput(); break;
                case 'jqueryready': ctl = new ctljQueryReady(); break;
                case 'label': ctl = new ctlLabel(); break;
                case 'listbox': ctl = new ctlListBox(); break;
                case 'panel': ctl = new ctlPanel(); break;
                case 'password': ctl = new ctlPassword(); break;
                case 'radiobutton': ctl = new ctlRadioButton(); break;
                case 'radiobuttonlist': ctl = new ctlRadioButtonList(); break;
                case 'register': ctl = new ctlRegister(); break;
                case 'redirect': ctl = new ctlRedirect(); break;
                case 'removefromroles': ctl = new ctlRemoveFromRoles(); break;
                case 'selectcommand': ctl = new ctlSelectCommand(); break;
                case 'scriptblock': ctl = new ctlScriptBlock(); break;
                case 'silentpost': ctl = new ctlSilentPost(); break;
                case 'submitcommand': ctl = new ctlSubmitCommand(); break;
                case 'tabstrip': ctl = new ctlTabstrip(); break;
                case 'text': ctl = new ctlText(); break;
                case 'textarea': ctl = new ctlTextArea(); break;
                case 'textbox': ctl = new ctlTextBox(); break;
                case 'updatebutton': ctl = new ctlUpdateButton(); break;
                case 'updateimage': ctl = new ctlUpdateImage(); break;
                case 'updatelink': ctl = new ctlUpdateLink(); break;
                case 'updateuser': ctl = new ctlUpdateUser(); break;
                case 'validation': ctl = new ctlValidate(); break;
                case 'validationsummary': ctl = new ctlValidationSummary(); break;
                default: alert("The control '" + $lst.val() + "' isn't yet supported");
            }

            if (ctl.Tag.toLower != "label") ctl.Label = new ctlLabel;
            var $designer = $('#xmp-designer');
            if ($lst.val() == 'validation') {
                $designer.validateTagsUI();
                //ctlUtils.LoadValidationDesigner($designer, null);
            } else {
                var $prop = $(ctl.PropertySheet());
                $prop.find('.alphanumeric').alphanumeric();
                $prop.find('.numeric').numeric();
                $prop.find('.designer-listitems').adminList();
                $prop.find('.designer-fields').listEditor(
                    { itemProperties: [
                        { Name: "Name", Control: "textbox" },
                        { Name: "Value", Control: "textbox"}]
                    });

                $prop.find('.textlistitems').adminList(true);
                var dataChoosers = $prop.find('.designer-datachooser');
                if (dataChoosers.length) {
                    if ($lst.val() == 'controldatasource') {
                        dataChoosers.dataChooser({
                            xdata: opts.xdata,
                            keyFieldChooser: false,
                            enableSort: true
                        });
                    } else if ($lst.val() == 'selectcommand') {
                        dataChoosers.dataChooser({
                            xdata: opts.xdata,
                            keyFieldChooser: false,
                            enableSort: false
                        });
                    } else if ($lst.val() == 'submitcommand') {
                        dataChoosers.dataChooser({
                            xdata: opts.xdata,
                            keyFieldChooser: true,
                            enableSort: false
                        });
                    }
                }
                $designer.html($prop);

            }
            var dlgTop = container.position().top + 50;
            var dlgLeft = container.position().left + 240;

            $designer.dialog({
                width: 400,
                position: [dlgLeft, dlgTop],
                title: ctl.Tag,
                buttons: {
                    "Save": function () {
                        if ($tagList.val() == 'validation' ||
                            $prop.find('.required').required()) {
                            var output = '';
                            if ($tagList.val() == 'validation') {
                                output = $designer.validateTagsUI('getValidateTagsXml');
                            }
                            else if ($tagList.val() == 'controldatasource' ||
                                     $tagList.val() == 'selectcommand' ||
                                     $tagList.val() == 'submitcommand') {
                                var ctl = $designer.data('ctrl');
                                ctl.LoadFromDesigner($designer);
                                output = ctl.GetFullTag();
                            }
                            else {
                                var ctl = $designer.data('ctrl');
                                ctl.LoadFromDesigner($designer);
                                ctl.Label = null; // set to null so it won't be rendered.
                                output = ctl.GetXml(0);
                            }
                            // subtract 1 b/c even if no \n, there's still a line
                            var nLines = output.split("\n").length - 1;
                            editor.replaceSelection(output);
                            indentLines(nLines, editor);
                            $lst.val('');
                            $(this).dialog('destroy');
                            editor.focus();
                        }
                    },
                    "Close": function () {
                        $lst.val('');
                        $(this).dialog('destroy');
                        editor.focus();
                    }
                }
            });
            $designer.data('ctrl', ctl);
            dialogInitialized = true;
            $designer.dialog('open');
        });
        var tokens = new Array();
        tokens = ["Cookie:cookieName", "DateAdd:1,d,MM/dd/yyyy", "Form:parameterName",
                  "Join()", "Localize: keyName",
                  "Module:Id", "Module:Title", 
                  "Portal:Id",
                  "Request:HostAddress", "Request:HostName", "Request:PageName", "Request:Referrer", "Request:URL",
                  "Request:Agent", "Request:Browser", "Request:Locale", "URL:parameterName",
                  "User:Email", "User:ID", "User:Username", "User:FirstName", "User:LastName", "User:DisplayName"]
        lstHtml = '<option value=""></option>';
        for (var i = 0; i < tokens.length; i++) {
            lstHtml += '<option value="[[' + tokens[i] + ']]">' + tokens[i] + '</option>';
        }
        $tokenList.html(lstHtml).change(function () {
            editor.replaceSelection($(this).val());
            $(this).val('');
        });
    } //initForm

    // helper set proper indentation of affected lines in editor
    function indentLines(linesToIndent, editor) {
        var nMaxIndex = linesToIndent - 1;
        var cursor = editor.getCursor(true);
        for (var i = 0; i <= nMaxIndex; i++) { editor.indentLine(cursor.line + i); }
    }

    // helper to convert XML node to a string
    function xmlToString(xmlNode) {
        try {
            // Gecko-based browsers, Safari, Opera.
            return (new XMLSerializer()).serializeToString(xmlNode);
        }
        catch (e) {
            try {
                // Internet Explorer.
                return xmlNode.xml;
            }
            catch (e) {//Strange Browser ??
                alert('Xmlserializer not supported');
            }
        }
        return false;
    }
})(jQuery);

