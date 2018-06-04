//
// ================================================================
// viewDesigners for XMod Pro
// Copyright 2011-2012 by Kelly Ford for KnowBetter Creative Services LLC
// All rights reserved
// ----------------------------------------------------------------
//

//
// options:
//   tagName: REQUIRED. Name of tag to display designer for.
// methods:
//   getTagCode: returns the code for the tag based on property values entered. No 
//               indentation is provided but new lines are inserted. It is expected 
//               the indentation will be handled by the editor.
//
(function ($) {
    var dataID = "tagDesigner";
    var methods = {
        init: function (options) {
            var opts = $.extend({}, $.fn.tagDesigner.defaults, options);
            var $this = $(this);
            var data = $this.data(dataID);
            if (!data) {
                $this.data(dataID, { opts: opts, container: $this });
            }
            initialize($this);
        },
        getTagCode: function () {
            // call this function to generate XMP code for the tag represented by this designer.
            // the tag name is stored in the plugins data so it can be retrieved in this function.
            var $container = $(this);
            var data = $container.data(dataID);
            var opts = data.opts;
            var tagName = opts.tagName;
            return getTagCode($container, tagName)

        }
    }; // methods

    $.fn.tagDesigner = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.' + dataID);
        }
    }; // $.fn.tagDesigner

    $.tagDesigner = {}; // base object to hold static functions

    $.fn.tagDesigner.defaults = {
        tagName: ''
    };

    // ========== 
    // Functions
    // ==========
    function initialize($container) {
        var data = $container.data(dataID);
        var opts = data.opts;


        var designerHtml = propertySheet(opts.tagName, false);

        $container.html('').append(designerHtml)
			.find('.xmp-designer-row').css({ 'overflow': 'hidden', 'padding': '3px 0px' })
			.find('label').css({ 'display': 'block', 'float': 'left', 'width': '120px' })
			.parent().find('input').css({ 'float': 'left' });

        $container.find('.alphanumeric').alphanumeric();
        $container.find('.numeric').numeric();

        $container.find('.designer-parameters').listEditor(
            { itemProperties: [
				{ Name: "Name", Control: "textbox" },
				{ Name: "Value", Control: "textbox" },
				{ Name: "DefaultValue", Caption: "Default Value", Control: "textbox" },
				{ Name: "DataType", Caption: "Data Type", Control: "dropdownlist", Value: "Boolean|DateTime|Decimal|Double|Byte|Int16|Int32|Int64|Single|String"}]
            });
        $container.find('.designer-urlparameters').listEditor({ 
            itemProperties: [
                { Name: "Name", Control: "textbox" }, 
                { Name: "Value", Control: "textbox"}
            ]
         });

        $container.find('.designer-case').listEditor(
            { itemProperties: [
				{ Name: "CompareType", Caption: "Compare Type", Control: "dropdownlist",
				    Value: "Numeric|Float|Date|Text|RegEx|Boolean|Role"
				},
	            { Name: "Value", Control: "textbox" },
    	        { Name: "Expression", Control: "textbox" },
        	    { Name: "Operator", Control: "dropdownlist", Value: "=|<>|<|>|<=|>=" },
            	{ Name: "IgnoreCase", Caption: "Ignore Case", Control: "dropdownlist", Value: "True,False" },
             	{ Name: "Culture", Control: "textbox"}]
            });
        $container.find('.designer-fields').listEditor(
            { itemProperties: [
				{ Name: "Name", Control: "textbox" },
             	{ Name: "Value", Control: "textbox"}]
            });

    } // initialize

    function propertySheet(tagName, bGetTagProperties) {
        if (!bGetTagProperties) { bGetTagProperties = false }
        else { bGetTagProperties = true };
        var props = [];
        var tagNameLower = tagName.toLowerCase();
        switch (tagNameLower) {
            case 'addbutton':
            case 'addlink':
            case 'addimage':
            case 'commandbutton':
            case 'commandlink':
            case 'commandimage':
            case 'deletebutton':
            case 'deletelink':
            case 'deleteimage':
            case 'detailbutton':
            case 'detaillink':
            case 'detailimage':
            case 'editbutton':
            case 'editlink':
            case 'editimage':
            case 'returnbutton':
            case 'returnlink':
            case 'returnimage':
            case 'togglebutton':
            case 'toggleimage':
            case 'togglelink':
                // get top-level properties
                //props = ["CssClass", "Height", "Width", "Style", "OnClientClick"];
                // patrick: no need for OnClientClick in array above, because you're pushing it below
                props = ["CssClass", "Height", "Width", "Style"];
                if (tagNameLower.indexOf("toggle") == 0) {
                    props.push("Speed");
                    props.push("Target");
                } else {
                    // all non-toggle buttons have OnClientclick
                    props.push("OnClientClick");
                }
                if (tagNameLower.indexOf("image") != -1) {
                    props.splice(0, 0, "ImageUrl", "ImageAlign", "AlternateText");
                } else {
                    props.splice(0, 0, "Text");
                }
                // command buttons have some extra props.
                if (tagNameLower.indexOf("command") != -1) {
                    props.push("Target");
                    props.push("Name");
                    props.push("Type");
                }
                var propString = '';
                // toggle___ and return___ buttons don't have parameters.
                // command buttons have child <Command> tags that have child <Parameter> tags. 
                // 
                if (tagNameLower.indexOf("return") == -1 ||
					tagNameLower.indexOf("toggle") == -1) {
                    props.push("Parameters");
                }
                break;
            case 'ajaxlink':
            case 'ajaxbutton':
            case 'ajaximage':
                props = ["CssClass", "Height", "LoadingCssClass", "LoadingImageUrl",
                         "OnError", "OnSuccess", "Style", "Target", "Url", "Width", "Fields"];
                if (tagNameLower.indexOf("image") != -1) {
                    props.splice(0, 0, "ImageUrl", "AlternateText");
                } else {
                    props.splice(0, 0, "Text");
                }
                break;
            case 'datalist':
                props =
                    ["AddRoles", "Ajax", "DeleteRoles", "DetailRoles", "EditRoles", "ID", "RepeatColumns", "RepeatDirection", "RepeatLayout", "UsePaging"];
                break;
            case 'each':
                props = ["Value", "Delimiter", "FirstItemTemplate", "ItemTemplate", "AlternatingItemTemplate", "LastItemTemplate", "SeparatorTemplate"];
                break;
            case 'format':
                props = ["Type", "Value", "Pattern", "Replacement", "MaxLength", "InputCulture", "OutputCulture"];
                break;
            case 'ifempty':
            case 'ifnotempty':
                props = ["Value"];
                break;
            case 'jqueryready':
                props = ["jqueryready-script"]; // dummy property to trigger creation of a TextArea with special class
                break;
            case 'loadfeed':
                props = ["FeedName", "LoadingCssClass", "LoadingImageUrl", "Target", "Fields"]
                break;
            case 'loadfeedbutton':
            case 'loadfeedlink':
                props = ["FeedName", "LoadingCssClass", "LoadingImageUrl", "Target",
                         "IDSelector", "InfinitePaging", "InsertMode", "Text", "Fields"]
                break;
            case 'loadfeedimage':
                props = ["FeedName", "LoadingCssClass", "LoadingImageUrl", "Target",
                         "IDSelector", "InfinitePaging", "InsertMode", "AlternateText",
                         "ImageUrl", "Fields"]
                break;
            case 'metatags':
                props = ["Title", "MetaTags-Title-Append", "Keywords", "MetaTags-Keywords-Append", "Description", "MetaTags-Description-Append"];
                break;
            case 'navigateurl':
                props = ["TabID", "ControlKey", "UrlParameters"];
                break;
            case 'pager':
                props = ["PageSize", "ShowTopPager", "ShowBottomPager", "ShowFirstLast",
                             "FirstPageCaption", "LastPageCaption", "FirstLastCssClass", "ShowPrevNext",
                             "NextPageCaption", "PrevPageCaption", "PrevNextCssClass",
                             "MaxPageNumButtons", "PageNumCssClass", "DisplayTemplate"];
                break;
            case 'redirect':
                props = ["Display", "Method", "ImageUrl", "ImageAlign", "OnClientClick", "Style", "Target",
                        "Text", "Width", "Fields"];
                break;
            case 'register':
                props = ["TagPrefix", "Namespace", "Assembly"];
                break;
            case 'scriptblock':
                props = ["ScriptId", "BlockType", "RegisterOnce", "Url"];
                break;
            case 'searchsort':
                props = ["FilterExpression", "Height", "ReverseSortCssClass", "ReverseSortText",
                         "SearchBoxCssClass", "SearchButtonCssClass", "SearchButtonText", "SearchLabelCssClass",
                         "SearchLabelText", "SortButtonCssClass", "SortButtonText", "SortFieldLabels",
                         "SortFieldListCssClass", "SortFieldNames", "SortLabelCssClass", "SortLabelText", "Width",
                         "DisplayTemplate"];
                break;
            case 'select':
                props = ["Mode", "Case", "Else"];
                break;
            case 'slideshow':
                props = ["BasePath", "ConnectionString", "Height", "ID", "ImageField", "ResizeImages", "TimeOut", "Width"]; //,[ListDataSource Tag]
                break;
            case 'template':
                props = ["AddRoles", "Ajax", "ConnectionString", "DeleteRoles", "DetailRoles", "EditRoles", "ID", "UsePaging"];
                /*
                CHILD TAGS: ListDataSource, DetailDataSource, DeleteCommand, CustomCommands, Pager, SearchSort, 
                HeaderTemplate, ItemTemplate, AlternatingItemTemplate, SeparatorTemplate, FooterTemplate, 
                DetailTemplate, NoItemsTemplate*/
                break;
            case 'feed':
                props = ["Doctype", "ContentType", "ConnectionString", "Filename"]
                /*
                CHILD TAGS: ListDataSource
                HeaderTemplate, ItemTemplate, AlternatingItemTemplate, SeparatorTemplate, FooterTemplate, 
                */
                break;
            case 'listdatasource':
            case 'detaildatasource':
            case 'deletecommand':
                props = ["CommandText", "ConnectionString", "CommandType", "Parameters"];
                break;
            case 'customcommands':
                // need to implement. Its just tag pair with no properties that contains DataCommand tags.
            case 'datacommand':
                props = ["CommandName", "CommandText", "ConnectionString", "Parameters"];
                //DataCommand Tags (CommandName,CommandText,?CommandType?,ConnectionString), Parameter Tags (Name, Value, DefaultValue, DataType)
                break;
        } // switch
        if (bGetTagProperties) return this.GetPropertySheetvalues(props);
        return createPropertySheet(props, tagName);
    } // function propertySheet()

    function createPropertySheet(arrProperties, tagName) {
        var out = '';
        for (var i = 0; i < arrProperties.length; i++) {
            var propName = arrProperties[i];
            var propNameLower = propName.toLowerCase();
            var tagNameLower = (tagName) ? tagName.toLowerCase() : '';
            switch (propNameLower) {
                case "ajax":
                case "else":
                case "infinitepaging":
                case "registeronce":
                case "resizeimages":
                case "usepaging":
                    out += CreateCheckbox(toCaption(propName), "designer-" + propNameLower, true);
                    break;
                case "blocktype":
                    out += CreateDropdown(toCaption(propName), "designer-blocktype",
                            ["HeadScript", "ClientScript", "StartupScript", "ClientScriptInclude"]);
                    break;
                case "case":
                    out += CreateCaseEditor("Cases", "designer-" + propNameLower);
                    break;
                case "commandtype":
                    out += CreateDropdown(toCaption(propName), "designer-" + propNameLower, ["Text", "Stored Procedure"], ["", "StoredProcedure"]);
                    break;
                case "description":
                    out += CreateTextArea(toCaption(propName), "designer-" + propNameLower);
                    break;
                case "imagealign":
                    out += CreateDropdown(toCaption(propName), "designer-" + propNameLower,
                        ["", "Left", "Right", "Top", "Bottom", "Baseline", "Middle", "AbsBottom", "AbsMiddle", "TextTop"]);
                    break;
                case "insertmode":
                    // used by LoadFeedButton/image/link
                    out += CreateDropdown(toCaption(propName), "designer-" + propNameLower,
                        ["", "Replace", "Append", "Prepend"]);
                    break;
                case "jqueryready-script":
                    out += CreateTextArea("jQuery Script", "designer-jqueryready-script");
                    break;
                case "metatags-description-append":
                case "metatags-keywords-append":
                case "metatags-title-append":
                    out += CreateCheckbox("Append", "designer-" + propNameLower);
                    break;
                case "mode":
                    out += CreateDropdown("Mode", "designer-" + propNameLower, ["Standard", "Inclusive"]);
                    break;
                case "maxpagenumbuttons":
                    out += CreateTextInput(toCaption(propName), "designer-" + propNameLower + ' numeric');
                    break;
                case "pagesize":
                    out += CreateTextInput(toCaption(propName), "designer-" + propNameLower + ' numeric');
                    break;
                case "showtoppager":
                case "showbottompager":
                    out += CreateCheckbox(toCaption(propName), "designer-" + propNameLower);
                    break;
                case "showfirstlast":
                    out += CreateCheckbox("Show First/Last", "designer-" + propNameLower);
                    break;
                case "showprevnext":
                    out += CreateCheckbox("Show Prev/Next", "designer-" + propNameLower);
                    break;
                case "parameters":
                    // optional parameter tags for command-type buttons
                    out += CreateParameterEditor(toCaption(propName), "designer-" + propNameLower);
                    break;
                case "urlparameters":
                    // optional parameter tags for NavigateUrl tag
                    out += CreateParameterEditor(toCaption(propName), "designer-" + propNameLower);
                    break;
                case "display":
                    // used by Redirect
                    out += CreateDropdown(toCaption(propName), "designer-" + propNameLower, ["Button", "Image", "Link"], ["Button", "ImageButton", "LinkButton"]);
                    break;
                case "method":
                    // used by Redirect
                    out += CreateDropdown(toCaption(propName), "designer-" + propNameLower, ["Get", "Post"]);
                    break;
                case "timeout":
                    out += CreateTextInput(toCaption(propName), "designer-" + propNameLower + ' numeric');
                    break;
                case "firstitemtemplate":
                case "lastitemtemplate":
                case "itemtemplate":
                case "alternatingitemtemplate":
                case "separatortemplate":
                    // Each tag
                    out += CreateCheckbox(toCaption(propName), "designer-" + propNameLower, true);
                    break;
                case "value":
                case "delimiter":
                    // Each tag Value and Delimiter properties
                    out += CreateTextInput(toCaption(propName), "designer-" + propNameLower);
                    break;
                case "type":
                    switch (tagNameLower) {
                        case 'commandbutton':
                        case 'commandlink':
                        case 'commandimage':
                            // currently only used for Command____ buttons
                            out += CreateDropdown(toCaption(propName), "designer-" + propNameLower, ["Custom", "List", "Detail"]);
                            break;
                        case 'format':
                            out += CreateDropdown(toCaption(propName), "designer-" + propNameLower,
								["Numeric", "Float", "Text", "RegEx", "Date", "Cloak", "HtmlEncode", "HtmlDecode", "UrlEncode", "UrlDecode"]);
                            break;
                    }
                    break;
                case "fields":
                    // option field tags for redirect button
                    out += CreateFieldEditor(toCaption(propName), "designer-" + propNameLower);
                    break;
                case "maxlength":
                    out += CreateTextInput(toCaption(propName), "designer-" + propNameLower + " numeric");
                    break;
                case "displaytemplate":
                    // Pager & SearchSort tag
                    out += CreateTextArea(toCaption(propName), "designer-" + propNameLower);
                    break;
                default:
                    // all other properties are assumed to have a standard textbox input
                    out += CreateTextInput(toCaption(propName), "designer-" + propNameLower);

            }
        }
        return out;
    } // createPropertySheet()

    // convertts property name to human readable caption for a control
    function toCaption(propName) {
        var out = propName.replace("-", " ");
        return out.replace(/([a-z])([A-Z])/, "$1 $2");
    }

    function getTagCode($container, tagName) {
        var tagCode = '';
        var tagNameLower = tagName.toLowerCase();
        switch (tagNameLower) {
            case 'addbutton':
            case 'addlink':
            case 'addimage':
            case 'editbutton':
            case 'editlink':
            case 'editimage':
            case 'deletebutton':
            case 'deletelink':
            case 'deleteimage':
            case 'detailbutton':
            case 'detaillink':
            case 'detailimage':
            case 'returnbutton':
            case 'returnlink':
            case 'returnimage':
                // get top-level properties
                var props = ["CssClass", "Height", "Width", "Style", "OnClientClick"];
                if (tagNameLower.indexOf("image") != -1) {
                    props.splice(0, 0, "ImageUrl", "ImageAlign", "AlternateText");
                } else {
                    props.splice(0, 0, "Text");
                }
                var propString = getAttributeString($container, props)
                tagCode = '<xmod:' + tagName + propString;
                // return___ buttons don't have parameters.
                var paramTags = '';
                if (tagNameLower.indexOf("return") == -1) paramTags = getListTagsString($container, 'Parameter', '.designer-parameters');
                if (paramTags) {
                    tagCode += '>\n' + paramTags + '</xmod:' + tagName + '>';
                } else {
                    tagCode += ' />';
                }
                break;
            case 'ajaxbutton':
            case 'ajaximage':
            case 'ajaxlink':
                var props = ["CssClass", "Height", "LoadingCssClass", "LoadingImageUrl",
                         "OnError", "OnSuccess", "Style", "Target", "Url", "Width", "Fields"];
                if (tagNameLower.indexOf("image") != -1) {
                    props.splice(0, 0, "ImageUrl", "AlternateText");
                } else {
                    props.splice(0, 0, "Text");
                }
                tagCode = '<xmod:' + tagName + getAttributeString($container, props);
                var fieldTags = getListTagsString($container, 'Field', '.designer-fields');
                if (fieldTags) {
                    tagCode += '>\n' + fieldTags + '</xmod:' + tagName + '>';
                } else {
                    tagCode += ' />';
                }
                break;
            case 'loadfeed':
            case 'loadfeedbutton':
            case 'loadfeedlink':
            case 'loadfeedimage':
                var props = ["FeedName", "LoadingCssClass", "LoadingImageUrl", "Target", "Fields"]
                if (tagNameLower != 'loadfeed') {
                    props.splice(4, 0, "IDSelector", "InfinitePaging", "InsertMode");
                    if (tagNameLower.indexOf("image") != -1) {
                        props.splice(6, 0, "ImageUrl", "AlternateText");
                    } else {
                        props.splice(6, 0, "Text");
                    }
                }
                tagCode = '<xmod:' + tagName + getAttributeString($container, props);
                var fieldTags = getListTagsString($container, 'Field', '.designer-fields');
                if (fieldTags) {
                    tagCode += '>\n' + fieldTags + '</xmod:' + tagName + '>';
                } else {
                    tagCode += ' />';
                }
                break;
            case 'commandbutton':
            case 'commandimage':
            case 'commandlink':
                var props = ["CssClass", "Height", "Width", "Style", "OnClientClick"];
                if (tagNameLower.indexOf("image") != -1) {
                    props.splice(0, 0, "ImageUrl", "ImageAlign", "AlternateText");
                } else {
                    props.splice(0, 0, "Text");
                }
                // command buttons have an internal <Command> tag that has props and contains <Parameter> tags.
                var outerPropString = getAttributeString($container, props);
                props = ["Target", "Name", "Type"];
                var commandPropString = getAttributeString($container, props);
                var paramTags = getListTagsString($container, 'Parameter', '.designer-parameters');
                tagCode = "<xmod:" + tagName + outerPropString + ">\n";
                tagCode += "<Command" + commandPropString;
                if (paramTags) {
                    tagCode += ">\n" + paramTags + '</Command>\n';
                } else {
                    tagCode += " />\n";
                }
                tagCode += "</xmod:" + tagName + ">";
                break;
            case 'datalist':
                props =
                    ["AddRoles", "Ajax", "DeleteRoles", "DetailRoles", "EditRoles", "ID", "RepeatColumns", "RepeatDirection", "RepeatLayout", "UsePaging"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + '>\n</xmod:' + tagName + '>';
                break;
            case 'each':
                props = ["Value", "Delimiter"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + '>\n';
                tagCode += '<!-- Placeholders You Can Use:\n' +
                           ' {value} : The text of the current item\n' +
                           ' {index} : The item number in the list, starting with 1\n' +
                           ' {count} : The total number of items in the list\n' +
                           ' PLEASE REMOVE THIS COMMENT PRIOR TO PUBLISHING -->\n';
                if ($container.find('.designer-firstitemtemplate').get(0).checked) { tagCode += '<FirstItemTemplate>\n\n</FirstItemTemplate>\n' }
                if ($container.find('.designer-itemtemplate').get(0).checked) { tagCode += '<ItemTemplate>\n\n</ItemTemplate>\n' }
                if ($container.find('.designer-alternatingitemtemplate').get(0).checked) { tagCode += '<AlternatingItemTemplate>\n\n</AlternatingItemTemplate>\n' }
                if ($container.find('.designer-lastitemtemplate').get(0).checked) { tagCode += '<LastItemTemplate>\n\n</LastItemTemplate>\n' }
                if ($container.find('.designer-separatortemplate').get(0).checked) { tagCode += '<SeparatorTemplate>\n\n</SeparatorTemplate>\n' }
                tagCode += '</xmod:' + tagName + '>';
                break;
            case 'format':
                props = ["Type", "Value", "Pattern", "Replacement", "MaxLength", "InputCulture", "OutputCulture"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + ' />';
                break;
            case 'ifempty':
            case 'ifnotempty':
                props = ["Value"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + '>\n</xmod:' + tagName + '>';
                break;
            case 'jqueryready':
                props = [];
                tagCode = '<xmod:jQueryReady>\n' + $container.find('.designer-jqueryready-script').val() + '\n\n</xmod:jQueryReady>';
                break;
            case 'metatags':
                props = ["Title", "MetaTags-Title-Append", "Keywords", "MetaTags-Keywords-Append", "Description", "MetaTags-Description-Append"];
                tagCode = '<xmod:MetaTags>\n';
                var title = $container.find('.designer-title').val();
                var titleAppend = $container.find('.designer-metatags-title-append').get(0).checked;
                var keywords = $container.find('.designer-keywords').val();
                var keywordsAppend = $container.find('.designer-metatags-keywords-append').get(0).checked;
                var description = $container.find('.designer-description').val();
                var descriptionAppend = $container.find('.designer-metatags-description-append').get(0).checked;
                if (title) {
                    tagCode += '<Title Append="';
                    tagCode += (titleAppend) ? 'True' : 'False';
                    tagCode += '">' + title + '</Title>\n';
                }
                if (keywords) {
                    tagCode += '<Keywords Append="';
                    tagCode += (keywordsAppend) ? 'True' : 'False';
                    tagCode += '">' + keywords + '</Keywords>\n';
                }
                if (description) {
                    tagCode += '<Description Append="';
                    tagCode += (descriptionAppend) ? 'True' : 'False';
                    tagCode += '">' + description + '</Description>\n';
                }
                tagCode += '</xmod:MetaTags>';
                break;
            case 'navigateurl':
                props = ["TabID", "ControlKey", "UrlParameters"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props);
                var params = getListTagsString($container, "Parameter", ".designer-urlparameters");
                if (params) {
                    tagCode += '>\n' + params + '</xmod:' + tagName + '>';
                } else {
                    tagCode += ' />';
                }
                break;
            case 'pager':
                props = ["PageSize", "ShowTopPager", "ShowBottomPager", "ShowFirstLast",
                             "FirstPageCaption", "LastPageCaption", "FirstLastCssClass", "ShowPrevNext",
                             "NextPageCaption", "PrevPageCaption", "PrevNextCssClass",
                             "MaxPageNumButtons", "PageNumCssClass"];
                tagCode = '<' + tagName + getAttributeString($container, props);
                var displayTemplate = $container.find('.designer-displaytemplate').val();
                if (displayTemplate) {
                    tagCode += '>\n' + displayTemplate + '\n</' + tagName + '>';
                } else {
                    tagCode += ' />';
                }
                break;
            case 'redirect':
                props = ["Display", "Method", "ImageUrl", "ImageAlign", "OnClientClick", "Style", "Target",
                        "Text", "Width"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props);
                var fieldTags = getListTagsString($container, 'Field', '.designer-fields');
                if (fieldTags) {
                    tagCode += '>\n' + fieldTags + '</xmod:' + tagName + '>';
                } else {
                    tagCode += ' />';
                }
                break;
            case 'register':
                props = ["TagPrefix", "Namespace", "Assembly"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + ' />';
                break;
            case 'scriptblock':
                props = ["ScriptId", "BlockType", "RegisterOnce", "Url"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + ' />';
                break;
            case 'searchsort':
                props = ["FilterExpression", "Height", "ReverseSortCssClass", "ReverseSortText",
                         "SearchBoxCssClass", "SearchButtonCssClass", "SearchButtonText", "SearchLabelCssClass",
                         "SearchLabelText", "SortButtonCssClass", "SortButtonText", "SortFieldLabels",
                         "SortFieldListCssClass", "SortFieldNames", "SortLabelCssClass", "SortLabelText", "Width"];
                tagCode = '<SearchSort' + getAttributeString($container, props);
                var dispTemp = $container.find('.designer-displaytemplate').val();
                if (dispTemp) {
                    tagCode += '>\n' + dispTemp + '\n</SearchSort>';
                } else {
                    tagCode += ' />';
                }
                break;
            case 'select':
                props = ["Mode"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + '>\n';
                var cases = getListTagsString($container, "Case", ".designer-case", true);
                if (cases) {
                    tagCode += cases;
                    if ($container.find('.designer-else').get(0).checked) {
                        tagCode += '<Else>\n\n</Else>\n';
                    }
                    tagCode += '</xmod:' + tagName + '>';
                } else {
                    tagCode += '<xmod:' + tagName + '>';
                }
                break;
            case 'slideshow':
                props = ["BasePath", "ConnectionString", "Height", "ID", "ImageField", "ResizeImages", "TimeOut", "Width"]; //,[ListDataSource Tag]
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + '>\n</xmod:' + tagName + '>';
                break;
            case 'template':
                props = ["AddRoles", "Ajax", "ConnectionString", "DeleteRoles", "DetailRoles", "EditRoles", "ID", "UsePaging"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + '>\n</xmod:' + tagName + '>';
                /*
                CHILD TAGS: ListDataSource, DetailDataSource, DeleteCommand, CustomCommands, Pager, SearchSort, 
                HeaderTemplate, ItemTemplate, AlternatingItemTemplate, SeparatorTemplate, FooterTemplate, 
                DetailTemplate, NoItemsTemplate*/
                break;
            case 'feed':
                props = ["Doctype", "ContentType", "ConnectionString", "Filename"]
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + '>\n</xmod:' + tagName + '>';
                break;
            case 'listdatasource':
            case 'detaildatasource':
            case 'deletecommand':
                props = ["CommandText", "ConnectionString", "CommandType"];
                tagCode = '<' + tagName + getAttributeString($container, props);
                var params = getListTagsString($container, "Parameter", ".designer-parameters");
                if (params) {
                    tagCode += '>\n' + params + '</' + tagName + '>';
                } else {
                    tagCode += ' />';
                }
                break;
            case 'customcommands':
                // need to implement. Its just tag pair with no properties that contains DataCommand tags.
                tagCode = '<CustomCommands>\n';
                tagCode += getTagCode($container, "DataCommand");
                tagCode += '\n</CustomCommands>';
                break;
            case 'datacommand':
                props = ["CommandName", "CommandText", "ConnectionString", "Parameters"];
                tagCode = '<' + tagName + getAttributeString($container, props);
                var params = getListTagsString($container, "Parameter", ".designer-parameters");
                if (params) {
                    tagCode += '>\n' + params + '</' + tagName + '>';
                } else {
                    tagCode += ' />';
                }
                //DataCommand Tags (CommandName,CommandText,?CommandType?,ConnectionString), Parameter Tags (Name, Value, DefaultValue, DataType)
                break;
            case 'togglebutton':
            case 'togglelink':
                props = ["CssClass", "Height", "Speed", "Style", "Target", "Text", "Width"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + ' />';
                break;
            case 'toggleimage':
                props = ["AlternateText", "CssClass", "Height", "ImageAlign", "ImageUrl", "Speed", "Style", "Target", "Width"];
                tagCode = '<xmod:' + tagName + getAttributeString($container, props) + ' />';
                break;

        } // switch(tagName.toLowerCase())
        return tagCode;
    }

    function getListTagsString($container, listTagName, listEditorSelector, forceTagPair) {
        // this gets a string that contains tags edited by the listEditor plugin like:
        // <Parameter> and <Field>.
        // pass-in the tag name and the class to use to find the listEditor plugin.
        // so, for <Parameter> tags, it would be: $container, "Parameter", ".designer-parameters" for 
        // the function parameters.
        var out = '';
        // get feild tags from plugin
        var arrItems = $container.find(listEditorSelector).listEditor("getListItems");
        var arrPropNames = $container.find(listEditorSelector).listEditor("getPropertyNames");
        if (arrItems.length > 0) {
            // loop thru each item. for each item, loop through each property and create the tag attribute
            for (var i = 0; i < arrItems.length; i++) {
                var currentItem = arrItems[i];
                var currTagAttributes = '';
                for (var j = 0; j < arrPropNames.length; j++) {
                    currTagAttributes += ' ' + arrPropNames[j] + '="' + currentItem[arrPropNames[j]] + '"'
                }
                out += '<' + listTagName + currTagAttributes;
                if (forceTagPair) { out += '></' + listTagName + '>\n'; }
                else { out += ' />\n'; }
            }
        }
        return out;
    }

    function getAttributeString($designer, arrProperties) {
        var out = '';
        for (var i = 0; i < arrProperties.length; i++) {
            var propName = arrProperties[i];
            var propNameLower = propName.toLowerCase();
            switch (propNameLower) {
                case 'usepaging':
                case "else":
                case "registeronce":
                case "resizeimages":
                case "infinitepaging":
                case "showtoppager":
                case "showbottompager":
                case "showfirstlast":
                case "showprevnext":
                case 'ajax':
                    // properties represented by checkboxes
                    var sVal = $designer.find('.designer-' + propNameLower).get(0).checked;
                    out += ' ' + propName + '="';
                    out += (sVal) ? "True" : "False";
                    out += '"';
                    break;
                default:
                    // all properties that don't need special handling
                    var sVal = $designer.find('.designer-' + propNameLower).val();
                    if (sVal) out += ' ' + propName + '="' + sVal + '"';
            }
        }
        return out;
    } // getAttributeString()

    // helper function for creating Property Sheet for controls' tag editing dialog
    function CreateTextInput(label, className) {
        return '<div class="xmp-designer-row">\n' +
               '<label>' + label + '</label>\n' +
               '<input type="text" class="' + className + '" />\n</div>';
    }
    function CreateTextArea(label, className) {
        return '<div class="xmp-designer-row">\n' +
               '<label style="display:block;">' + label + '</label>\n' +
               '<textarea style="width:98%;height:130px;" class="' + className + '"></textarea>\n</div>';
    }
    function CreateDropdown(label, className, arrItemsText, arrItemsValue) {
        return CreateListBox(label, className, 1, arrItemsText, arrItemsValue);
    }
    function CreateDataTypeDropdown(label, className) {
        return CreateListBox(label, className, 1,
            ["", "Boolean", "Byte", "Date", "DateTime", "Decimal", "Double",
                 "Int16", "Int32", "Int64", "Single", "String"]);
    }
    function CreateListBox(label, className, rows, arrItemsText, arrItemsValue) {
        var sItems = '';
        if (arrItemsText) {
            for (var i = 0; i < arrItemsText.length; i++) {
                var sText = arrItemsText[i];
                var sVal = sText;
                if (arrItemsValue) sVal = arrItemsValue[i];
                sItems += '<option value="' + sVal + '">' + sText + '</option>\n'
            }
        }
        var sOut = '<div class="xmp-designer-row">\n' +
                   '<label>' + label + '</label>\n' +
                   '<select size="' + rows + '" class="' + className + '"';
        if (sItems) {
            sOut += '>\n' + sItems + '</select>\n</div>';
        } else {
            sOut += ' />\n</div>';
        }
        return sOut;
    }
    function CreateCheckbox(label, className, setChecked) {
        var out = '<div class="xmp-designer-row">\n' +
               '<label>' + label + '</label>\n' +
               '<input type="checkbox" class="' + className + '"';
        if (setChecked) { out += ' checked="checked"' }
        out += ' />\n</div>';
        return out;
    }
    /*
    function CreateColorPicker(label,className){
    // currently only returns a textbox but can be modified to 
    // instantiate a color picker
    return this.Create
    }
    */
    function CreateParameterEditor(label, className) {
        return '<div class="xmp-designer-row">\n' +
               '<label>' + label + '</label>\n' +
               '<div class="' + className + '"></div>';
    }
    function CreateFieldEditor(label, className) {
        return '<div class="xmp-designer-row">\n' +
               '<label>' + label + '</label>\n' +
               '<div class="' + className + '"></div>';
    }
    function CreateCaseEditor(label, className) {
        return '<div class="xmp-designer-row">\n' +
               '<label>' + label + '</label>\n' +
               '<div class="' + className + '"></div>';
    }

})(jQuery);              // tagDesigner plugin

// jQuery.listEditor plugin for XMod Pro
// Author: Kelly Ford
// Copyright 2012 by KnowBetter Creative Services LLC
// All rights reserved
//
// Documentation
// settings:
//	itemProperty: An array of control objects which describe the input controls 
//				  for each item in the list. 
//				  Control Object Properties:
//					Name: (required) Label and Name of the property
//					Caption: (optional) Caption to be used for the property's input control
//					Control: (required) Textbox, Dropdownlist, Listbox, or Checkbox
//					Value: (optional) For list controls, a pipe (|) delimited list of values for the control.
//	inputPanelClass: 
//				  Defaults to list-editor-input-panel. Use to style the panel that contains the 
//				  input controls if needed.
//
// The first itemProperty will be displayed as the text in the list item list box; 
// 
//
(function($){
	var dataID = "listEditor";
	var methods = {
        init: function(options) {
            var opts = $.extend({}, $.fn.listEditor.defaults, options);
            var $this = $(this);
            var data = $this.data(dataID);
            if (!data) {
                $this.data(dataID, {opts: opts, container: $this});
            }
			return this.each(function(){
				initialize($(this));
			});
        }, 
        getListItems: function(){
            // call this function to generate XMP code for the tag represented by this designer.
            // the tag name is stored in the plugins data so it can be retrieved in this function.
            var $container = $(this);
            var data = $container.data(dataID);
            var opts = data.opts;
			var $list = $container.find('select:first');
            var arrItems = $list.data(dataID);
			// arrItems is an array of arrays. Each array is a set of values of the properties in 
			// the same order as the properties are specified in settings.itemProperties.
			var arrOutputItems = new Array();
			var arrProperties = opts.itemProperties;
			for (var i=0;i<arrItems.length;i++){
				var currentItem = arrItems[i];
				var outputItem = {};
				// assign each property its value for this item
				for (var j=0;j<arrProperties.length;j++){
					outputItem[arrProperties[j].Name] = currentItem[j]	
				}
				// add the new object to the output array
				arrOutputItems.push(outputItem);
			}
			return arrOutputItems;
        }, 
		getPropertyNames: function(){
            var $container = $(this);
            var data = $container.data(dataID);
            var opts = data.opts;
			var arrItemProperties = opts.itemProperties;
			var $list = $container.find('select:first');
			var arrOutput = new Array();
			for (var i=0;i<arrItemProperties.length;i++){
				arrOutput.push(arrItemProperties[i].Name);
			}
			return arrOutput;
		}
    }; // methods
	$.fn.listEditor = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.' + dataID);
        }
	}
	$.fn.listEditor.defaults = {
        itemProperties: [
		    {Name:"Text", Caption:null, Control:"textbox", Value:null}, 
			{Name:"Value", Caption:null, Control:"textbox", Value:null}
		],
		inputPanelClass: "list-editor-input-panel"
    };

	function initialize($container){
		var data = $container.data(dataID);
		var settings = data.opts;
		var sHtml = 
				'<select size="6" />' + 
				'<ul>' + 
				'  <li><span/></li>' + 
				'  <li><span/></li>' + 
				'  <li><span/></li>' + 
				'  <li><span/></li>' + 
				'</ul>' + 
				'<div class="' + settings.inputPanelClass + '">';
		var props = settings.itemProperties;
		for (var i=0; i < props.length; i++){
			var caption = props[i].Caption;
			if (!caption) caption = props[i].Name;
			sHtml += '  <div>';
			
			switch (props[i].Control.toLowerCase()) {
				case 'textbox':
					sHtml += '<label>' + caption + '</label><input type="text"/>';
					break;
				case 'dropdownlist':
				case 'listbox':
					var size = 1;
					if (props[i].Control.toLowerCase() == 'listbox')size = 5;
					sHtml += '<label>' + caption + '</label><select size="' + size + '"';
					if (props[i].Value) {
						sHtml += '>';	
						var arrValues = props[i].Value.split('|');
						for (var j=0;j<arrValues.length;j++) {
							sHtml += '<option value="' + arrValues[j] + '">' + arrValues[j] + '</option>';	
						}
						sHtml += '</select>';
					} else {
						sHtml += ' />';
					}
					break;
				case 'checkbox':
					sHtml += '<input type="checkbox" /><label>' + caption + '</label>';
					break;
			}
			sHtml += '</div>';
		}
		sHtml += 
				'  <div><input type="button" value="Save"/><input type="button" value="Hide"/></div>' + 
				'</div>';
		$container.html(sHtml);
		
		// setup control pointers
		var $list = $container.find('select:first');
		var $btnList = $container.find('ul');
		var $btnAdd = $btnList.find('li:first');
		var $btnDelete = $btnAdd.next();
		var $btnUp = $btnDelete.next();
		var $btnDown = $btnUp.next();
		var $inputPanel = $container.find('.' + settings.inputPanelClass);
		var $btnSave = $inputPanel.find('input[value=Save]');
		var $btnHide = $inputPanel.find('input[value=Hide]');
			
		// create array to contain list of items
		$list.data(dataID,new Array());
			
		// set styling
		$container.css({'overflow':'hidden'});
		$list.css({ 'width': '150px', 'float': 'left', 'padding': '0px' });
		$btnList.css({ 'float':'left','padding':'0px','margin-left':'10px','margin-top':'2px'});
		$btnAdd.css({'margin-top':'-5px'}).find('span:first').addClass("ui-icon-plus");
		$btnDelete.find('span:first').addClass("ui-icon-close");
		$btnUp.find('span:first').addClass("ui-icon-circle-arrow-n");
		$btnDown.find('span:first').addClass("ui-icon-circle-arrow-s");
		$btnList.find('li').addClass('ui-state-default ui-corner-all')
			.css({'cursor':'pointer', 'list-style':'none outside none', 
				  'margin':'2px', 'padding':'1px 0 2px 2px', 'position':'relative',
				  'width':'18px'})
			.hover(function() {$(this).addClass('ui-state-highlight');}, 
				   function() {$(this).removeClass('ui-state-highlight');})
			.find('span').addClass('ui-icon');
		$inputPanel.css({'display':'none','clear':'left'});
		$inputPanel.find('div')
			.css({'overflow':'hidden'})
			.find('label').css(
				{'display':'block','font-size':'.8em'})
			.parent().find('input').css(
				{'float':'left'});
			
		$btnSave.css({'margin-left':'30px'});
		$btnHide.css({'margin-left':'8px'});
			
		// events
		$list.change(function(){
			// enable editing when item selected
			var $selItem = $(this).find("option:selected");
			var arrItemList = $list.data(dataID);
			if (arrItemList) {
				var selIndex = $list.get(0).selectedIndex;
				var data = arrItemList[selIndex];
				writeProperties($container, settings, data);
			}
			$btnSave.removeClass('parameter-designer-new')
					.addClass('parameter-designer-update');
			$inputPanel.show();
		});
		$btnAdd.click(function(){
			// clear input boxes and show panel
			$inputPanel.find('input[type="text"]').val('');
			$btnSave.removeClass('parameter-designer-update')
					.addClass('parameter-designer-new');
			$inputPanel.show();
			setPropertyInputFocus($container,settings,0);
		});
		$btnDelete.click(function(){
			var selItem = $list.find('option:selected');
			if (selItem) { 
				var selIndex = $list.get(0).selectedIndex;
				var arrParams = $list.data(dataID);
				arrParams.splice(selIndex,1);
				selItem.remove(); }
			// hide the edit panel if it's showing
			$inputPanel.hide();
		});
		$btnUp.click(function(){
			var curIndex = $list.get(0).selectedIndex;
			if (curIndex > 0) {
				// can move up - swap current item witht he one above it
				var selItem = $list.find('option:selected');
				var selIndex = $list.get(0).selectedIndex;
				var arrParams = $list.data(dataID);
				var prevItem = selItem.prev();
				var tempParam = arrParams[selIndex];
				arrParams[selIndex] = arrParams[selIndex - 1];
				arrParams[selIndex - 1] = tempParam;
				prevItem.before(selItem);
			}
		});
		$btnDown.click(function(){
			var curIndex = $list.get(0).selectedIndex;
			if (curIndex < $list.get(0).length - 1) {
				// can move down - swap current item with the one below it
				var selItem = $list.find('option:selected');
				var selIndex = $list.get(0).selectedIndex;
				var arrParams = $list.data(dataID);
				var nextItem = selItem.next();
				var tempParam = arrParams[selIndex];
				arrParams[selIndex] = arrParams[selIndex + 1]
				arrParams[selIndex + 1] = tempParam;
				nextItem.after(selItem);
			}
		});
		$btnSave.click(function(){
			// validate and add to list box
			var objData = readProperties($container,settings);
			var props = settings.itemProperties;
			var arrObjectList = $list.data(dataID);
			if ($(this).hasClass('parameter-designer-update')){
				var selItem = $list.find('option:selected');
				selItem.text(objData[0]);
				selItem.val(objData[0]);
				arrObjectList[$list.get(0).selectedIndex] = objData;
				$inputPanel.hide();
			} else {
				// add item to listbox
				$list.append(
					'<option value="' + objData[0] + '">' + objData[0] + '</option>');
				$list.get(0).selectedIndex = $list.find('option').length - 1;
				arrObjectList[$list.get(0).selectedIndex] = objData;
				// position cursor in first property field and set focus so user can 
				// continue adding property values without touching the mouse
				setPropertyInputFocus($container, settings, 0);
			}
		});
		$btnHide.click(function(){
			$inputPanel.hide();
		});		
	} // function initialize()
	
	// returns array of property values in the order specified in settings.itemProperties
	function readProperties($container,settings){
		var props = settings.itemProperties;
		var $inputPanel = $container.find('.' + settings.inputPanelClass);
		var arrValues = new Array();
		for (var i=0; i < props.length; i++){
			var $row = $inputPanel.find('div').eq(i);
			switch (props[i].Control.toLowerCase()){
				case 'textbox': 
					arrValues.push($row.find('input').val());
					break;	
				case 'dropdownlist':
				case 'listbox':
					arrValues.push($row.find('select').val());
					break;
				case 'checkbox':
					arrValues.push($row.find('input[type=checkbox]').get(0).checked);
					break;
			}
		}
		return arrValues;
	} // this.readProperties
	
	// takes an object representing a full set of properties for the item 
	// and sets the control values in the input panel.
	function writeProperties($container, settings, itemPropertyValues){
		var props = settings.itemProperties;
		var $inputPanel = $container.find('.' + settings.inputPanelClass);
		for (var i=0; i<props.length; i++) {
			var $row = $inputPanel.find('div').eq(i);
			switch (props[i].Control.toLowerCase()){
				case 'textbox':
					$row.find('input').val(itemPropertyValues[i]);
					break;
				case 'dropdownlist':
				case 'listbox':
					$row.find('select').val(itemPropertyValues[i]);
					break;
				case 'checkbox':
					$row.find('input[type=checkbox]').get(0).checked = (itemPropertyValues[i] === true)
			}
		}
	} // this.writeProperties
	
	function setPropertyInputFocus($container, settings, index){
		var prop = settings.itemProperties[index];
		var $row = $container.find('.list-editor-input-panel div:eq('+index+')');
		switch (prop.Control.toLowerCase()){
			case 'textbox':
				$row.find('input').focus();
				$row.find('input').select();
				break;
			case 'checkbox':
				$row.find('input[type=checkbox]').focus();
				break;
			case 'dropdownlist':
			case 'listbox':
				$row.find('select').focus();
				break;	
		}

	}
})(jQuery); // listEditor plugin

