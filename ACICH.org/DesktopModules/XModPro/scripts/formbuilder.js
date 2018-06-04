//
// ================================================================
// formBuilder Plugin for XMod Pro
// Copyright 2011-2012 by Kelly Ford for KnowBetter Creative Services LLC
// All rights reserved
// ----------------------------------------------------------------
//
var style_Label = "xmp-form-label";
var style_Row = "xmp-form-row";
var style_Form = "xmp-form";
var style_Validate = "xmp-validation";
var bDialogInit = false;
var bValidateDesignerInit = false;
var keyControlData = "ControlData";
var keyValidateTags = "ValidateTags";
var activeRow = null; // currently selected row in form
var isEditing = false; // flag so control dialog can determine if it's in edit or add mode

//#region - ControlUtilities
// common functions used when working with controls. Use the ctlUtils object.
function ControlUtilities() {

    this.BuildStyleProperty = function (styleArray) {
        if (styleArray.length > 0) {
            return ' style="' + styleArray.join(' ') + '"';
        } else {
            return '';
        }
    };
    // Used to parse the XML for ListItems and return an array of ListItem objects.
    this.ParseListItems = function (node) {
        var li = null;
        var arrItems = new Array;
        node.find("ListItem").each(function () {
            $li = jQuery(this);
            li = new ListItem($li.text(), $li.attr("Value"));
            arrItems.push(li);
        });
        return arrItems;
    };
    // parses a control's XML for Validate tags. Returns an array of ctlValidate objects
    // or null if none found.
    this.ParseValidateTags = function (node) {
        var $node = jQuery(node);
        if ($node.find("Validate")) {
            var valItems = new Array;
            $node.find("Validate").each(function () {
                valItems.push(new ctlValidate(jQuery(this)));
            });
            return valItems;
        }
        return null;
    };
    // this is designed to load the validation designer with an array of ctlValidate objects
    // it sets up the designer to handle multiple validate tags.
    this.LoadValidationDesigner = function (designer, validateTags) {
        designer.find(".val-dataentry").hide();
        var sHtml = '';
        var $lst = designer.find(".val-validatorlist");
        $lst.html('');
        if (validateTags) {
            var valType, valTypeCaption;
            for (var i = 0; i < validateTags.length; i++) {
                valType = validateTags[i].Type;
                valTypeCaption = valType // set default;
                switch (valType) {
                    case 'regex': valTypeCaption = "Regular Expression"; break;
                    case 'required': valTypeCaption = "Required"; break;
                    case 'range': valTypeCaption = "Range"; break;
                    case 'compare': valTypeCaption = "Compare"; break;
                    case 'email': valTypeCaption = "Email"; break;
                    case 'checkbox': valTypeCaption = "Checkbox"; break;
                    case 'checkboxlist': valTypeCaption = "CheckboxList"; break;
                    case 'xml': valTypeCaption = "XML"; break;
                }
                sHtml += '<option value="' + valType + '">' + valTypeCaption + '</option>';
            }
        }
        $lst.append(sHtml);
        $lst.data(keyValidateTags, validateTags); // so the tags can be referenced later.
        $lst.change(function () {
            // load validate tag
            var idx = this.selectedIndex;
            var curTag = jQuery(this).data(keyValidateTags)[idx];
            var designer = jQuery(this).parent();
            curTag.LoadDesigner(designer);
            designer.find(".val-dataentry").show();
        });
        if (!bValidateDesignerInit) {
            // assign events, etc. so the designer works correctly.
            designer.find('ul li span.ui-icon-plus').click(function () {
                // prep form for adding new validator
                var des = jQuery(this).parent().parent().parent();
                var tag = new ctlValidate();
                tag.LoadDesigner(des, tag);
                des.find('.val-dataentry').show();
                des.find('.val-all').show();
                des.find('select.validation-type-selector').val('').change();
                des.find('.val-validatorlist').val('');
            });
            // delete selected validator
            designer.find('ul li span.ui-icon-close').click(function () {
                var des = jQuery(this).parent().parent().parent();
                var $lst = des.find(".val-validatorlist");
                var idx = $lst.get(0).selectedIndex;
                $lst.data(keyValidateTags).splice(idx, 1);
                $lst.find('option:eq(' + idx + ')').remove();
                // clean up data entry area
                var tag = new ctlValidate();
                tag.LoadDesigner(des, tag);
                des.find('.val-dataentry').hide();
            });
            // update or add new validator tag
            designer.find('input[value="Save"]').click(function () {
                var des = jQuery(this).parent().parent();
                var $lst = des.find('.val-validatorlist');
                var idx = $lst.get(0).selectedIndex;
                // this is needed so we can display the user-friendly validator type name 
                // in the list of validators.
                var $lstType = des.find('select.validation-type-selector');
                var idxType = $lstType.get(0).selectedIndex;
                var FriendlyTypeName = $lstType.find('option:eq(' + idxType + ')').text();

                if (idx >= 0) {
                    var tag = $lst.data(keyValidateTags)[idx];
                    // read data into the tag from the form
                    tag.LoadFromDesigner(des);
                    // update the list box of validators to match updated validator
                    $lst.find('option:eq(' + idx + ')').text(FriendlyTypeName);
                } else {
                    // new tag. add it to the list and data object
                    var tag = new ctlValidate();
                    tag.LoadFromDesigner(des);
                    if (!$lst.data(keyValidateTags)) {
                        $lst.data(keyValidateTags, new Array);
                    }
                    $lst.data(keyValidateTags).push(tag);
                    $lst.append('<option value="' + tag.Type + '">' + FriendlyTypeName + '</option>');
                }
                // clean up data entry area.
                var tag = new ctlValidate();
                tag.LoadDesigner(des, tag);
                des.find('.val-dataentry').hide();
            });
            // cancel action, clean up data entry area
            designer.find('input[value="Cancel"]').click(function () {
                var des = jQuery(this).parent().parent();
                des.find('.val-validatorlist').val('');
                var tag = new ctlValidate();
                tag.LoadDesigner(des, tag);
                des.find('.val-dataentry').hide();
            });
            bValidateDesignerInit = true;
        }
    };
    // returns an array of ctlValidate objects from the designer
    this.LoadFromValidationDesigner = function (designer) {
        // access the list of validators and retrieve the array
        var $lst = designer.siblings('#designer-validate').find(".val-validatorlist");
        return $lst.data(keyValidateTags);
    };

    this.BuildListOptions = function (ListItemsArray) {
        var out = '';
        if (ListItemsArray) {
            for (var i = 0; i < ListItemsArray.length; i++) {
                out += '<option value="' + ListItemsArray[i].Value + '">' + ListItemsArray[i].Text + '</option>';
            }
        }
        return out;
    };
    // returns XML from an array of any "ctl" object
    this.GetListItemsXml = function (ListItemsArray, indent) {
        var out = '';
        if (!indent) { indent = '      '; }
        for (var i = 0; i < ListItemsArray.length; i++) {
            out += '  ' + indent + ListItemsArray[i].GetXml() + '\n';
        }
        return out;
    };

    this.BuildSqlSelect = function (table, arrFields, sortField, sortOrder) {
        var out = 'SELECT ';
        for (var i = 0; i < arrFields.length; i++) {
            if (i > 0) { out += ', ' };
            out += arrFields[i];
        }
        out += ' FROM ' + table;
        if (sortField) {
            out += ' ORDER BY ' + sortField
            if (sortOrder) {
                out += ' ' + sortOrder.toUpperCase();
            }
        }
        return out;
    }
    
    this.BuildSqlInsert = function (table, arrFields) {
        var out = 'INSERT INTO ' + table + ' (';
        var params = '';
        for (var i = 0; i < arrFields.length; i++) {
            if (i > 0) { 
                out += ', ';
                params += ', ';
            };
            out += arrFields[i];
            params += '@' + arrFields[i];
        }
        out += ') VALUES (' + params + ')';

        return out;
    }    

    this.BuildSqlUpdate = function (table, arrFields, arrKeyFields) {
        var out = 'UPDATE ' + table + ' SET ';
        var params = '';
        for (var i = 0; i < arrFields.length; i++) {
            if (i > 0) { 
                out += ', ';
            };
            out += arrFields[i] + ' = @' + arrFields[i];
        }
        out += ' WHERE '; 
        for (var j = 0; j < arrKeyFields.length; j++) {
            if (j > 0) {
                out += ' AND ';
            }
            out += arrKeyFields[j] + ' = @' + arrKeyFields[j];
        }

        return out;
    }   
    this.ParseXmlProperties = function (ctl, $node, defDataType) {
        ctl.ID = $node.attr("Id");
        ctl.Label = new ctlLabel($node.find("Label"), ctl.ID);
        ctl.Height = ($node.attr("Height")) ? $node.attr("Height") : null;
        ctl.Width = ($node.attr("Width")) ? $node.attr("Width") : null;
        ctl.Nullable = ($node.attr("Nullable")) ? $node.attr("Nullable") : null;
        ctl.DataField = ($node.attr("DataField")) ? $node.attr("DataField") : null;
        if (defDataType) { ctl.DataType = ($node.attr("DataType")) ? $node.attr("DataType") : defDataType; }

    }

    // helper function for creating Property Sheet for controls' tag editing dialog
    this.CreateTextInput = function (label, className, value) {
        var sValue = (value) ? ' value="' + value + '"' : '';
        return '<div class="xmp-designer-row">\n' +
               '<label>' + label + '</label>\n' +
               '<input type="text"' + sValue + ' class="' + className + '" />\n</div>';
    }
    this.CreateTextArea = function (label, className) {
        return '<div class="xmp-designer-row">\n' +
               '<label style="display:block;">' + label + '</label>\n' +
               '<textarea style="width:98%;height:130px;" class="' + className + '"></textarea>\n</div>';
    }
    this.CreateDropdown = function (label, className, arrItemsText, arrItemsValue) {
        return this.CreateListBox(label, className, 1, arrItemsText, arrItemsValue);
    }
    this.CreateDataTypeDropdown = function (label, className) {
        return this.CreateListBox(label, className, 1,
            ["", "Boolean", "Byte", "Date", "DateTime", "Decimal", "Double",
                 "Int16", "Int32", "Int64", "Single", "String"]);
    }
    this.CreateListBox = function (label, className, rows, arrItemsText, arrItemsValue) {
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
    this.CreateCheckbox = function (label, className) {
        return '<div class="xmp-designer-row">\n' +
               '<label>' + label + '</label>\n' +
               '<input type="checkbox" class="' + className + '" />\n</div>';
    }
    this.CreateFieldEditor = function (label, className) {
        return '<div class="xmp-designer-row">\n' +
               '<label>' + label + '</label>\n' +
                   '<div class="' + className + '"></div>';
    }
    this.CreateDataChooser = function () {
        return '<div class="xmp-designer-row">\n' +
               '<div class="designer-datachooser"></div>\n' +
               '</div>'
    }

}
//#endregion

var ctlUtils = new ControlUtilities();
//#region Control Classes

function ListItem(Text, Value) {
    this.Tag = "ListItem";
    this.Text = Text;
    this.Value = Value;
    this.GetXml = function (indent) {
        return '<' + this.Tag + ' Value="' + this.Value + '">' + this.Text + '</' + this.Tag + '>';
    };

} // ListItem()

function Field(Name, Value) {
    this.Tag = "Field";
    this.Name = Name;
    this.Value = Value;
    this.GetXml = function (indent) {
        return '<' + this.Tag + ' Name="' + this.Name + '" Value="' + this.Value + '" />';
    };

} // ListItem()

function ctlValidate(node) {
    this.Tag = "Validate";
    this.Target = null;
    this.Type = null;
    this.Text = null;
    this.Message = null;
    this.ValidationExpression = null;
    this.MaximumValue = null;
    this.MinimumValue = null;
    this.DataType = null;
    this.Operator = null;
    this.CompareTarget = null;
    this.CompareValue = null;
    this.GetDesignerHtml = function () {
        return '';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Type = $ctl.attr("Type");
        this.Text = $ctl.attr("Text");
        this.Message = $ctl.attr("Message");
        switch (this.Type.toLowerCase()) {
            case 'regex':
                this.ValidationExpression = $ctl.attr("ValidationExpression");
                break;
            case 'range':
                this.MaximumValue = $ctl.attr("MaximumValue");
                this.MinimumValue = $ctl.attr("MinimumValue");
                this.DataType = $ctl.attr("DataType");
                break;
            case 'compare':
                this.DataType = $ctl.attr("DataType");
                this.Operator = $ctl.attr("Operator");
                this.CompareTarget = $ctl.attr("CompareTarget");
                this.CompareValue = $ctl.attr("CompareValue");
                break;
        }
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (!indent) { indent = '      '; }
        var sOut = indent + "<" + this.Tag;
        sOut += ' Type="' + this.Type + '"';
        if (this.Text) { sOut += ' Text="' + this.Text + '"'; }
        if (this.Message) sOut += ' Message="' + this.Message + '"';
        switch (this.Type.toLowerCase()) {
            case 'regex':
                if (this.ValidationExpression) { sOut += ' ValidationExpression="' + this.ValidationExpression + '"'; }
                break;
            case 'range':
                if (this.MinimumValue) { sOut += ' MinimumValue="' + this.MinimumValue + '"'; }
                if (this.MaximumValue) { sOut += ' MaximumValue="' + this.MaximumValue + '"'; }
                if (this.DataType) { sOut += ' DataType="' + this.DataType + '"'; }
                break;
            case 'compare':
                if (this.DataType) { sOut += ' DataType="' + this.DataType + '"'; }
                if (this.Operator) { sOut += ' Operator="' + this.Operator + '"'; }
                if (this.CompareTarget) { sOut += ' CompareTarget="' + this.CompareTarget + '"' };
                if (this.CompareValue) { sOut += ' CompareValue="' + this.CompareValue + '"' };
                break;
        }
        sOut += ' />\n';
        return sOut;
    };
    this.PropertySheet = function () {
        var sHtml =
        '<label class="val-all">Validators</label>\n' +
        '<select size="4" class="val-all val-validatorlist" style="float:left;width:150px;"></select>\n' +
        '<ul class="val-commandbuttons" style="float:left; margin:0; padding-left: 2px;">\n' +
        '  <li><span class="ui-icon-plus"></span></li>\n' +
        '  <li><span class="ui-icon-close"></span></li>\n' +
        '</ul>\n' +
        '<br class="val-all" style="clear:both;" />\n' +
        '<div class="val-dataentry">\n' +
        '  <label class="val-all">Validation Type</label>\n' +
        '  <select size="1" class="validation-type-selector val-all">\n' +
        '    <option value=""></option>\n' +
        '    <option value="required">Required</option>\n' +
        '    <option value="regex">Regular Expression</option>\n' +
        '    <option value="email">Email</option>\n' +
        '    <option value="compare">Compare</option>\n' +
        '    <option value="range">Range</option>\n' +
        '    <option value="checkbox">Checkbox</option>\n' +
        '    <option value="checkboxlist">CheckboxList</option>\n' +
        '    <option value="xml">XML</option>\n' +
        '  </select><br class="val-all" />\n' +
        '<label class="val-all">Text</label> <input type="text" class="validation-text val-all" /><br class="val-all" />\n' +
        '<label class="val-all">Message</label> <input type="text" class="validation-message val-all" /><br class="val-all" />\n' +
        '<label class="val-range">Minimum Value</label> <input type="text" class="val-range validation-minvalue"/><br class="val-range" />\n' +
        '<label class="val-range">Maximum Value</label> <input type="text" class="val-range validation-maxvalue"/><br class="val-range" />\n' +
        '<label class="val-range val-compare">Data Type</label>\n' +
        '<select size="1" class="val-range val-compare validation-datatype">\n' +
        '  <option value="string">String</option>\n' +
        '  <option value="integer">Integer</option>\n' +
        '  <option value="double">Double</option>\n' +
        '  <option value="date">Date</option>\n' +
        '  <option value="currency">Currency</option>\n' +
        '</select> <br class="val-range val-compare" />\n' +
        '<label class="val-regex">Validation Expression</label> <input type="text" class="val-regex validation-expression" /><br class="val-regex" />\n' +
        '<label class="val-compare">Compare to Control</label> <input type="text" class="val-compare validation-comparetarget" /><br class="val-compare" />\n' +
        '<label class="val-compare">Compare to Value</label> <input type="text" class="val-compare validation-comparevalue" /><br class="val-compare" />\n' +
        '<label class="val-compare">Comparison Type</label>\n' +
        '<select size="1" class="val-compare validation-operator">\n' +
        '  <option value="Equal">=</option>\n' +
        '  <option value="NotEqual">&lt;&gt;</option>\n' +
        '  <option value="GreaterThan">&gt;</option>\n' +
        '  <option value="GreaterThanEqual">&gt;=</option>\n' +
        '  <option value="LessThan">&lt;</option>\n' +
        '  <option value="LessThanEqual">&lt;=</option>\n' +
        '  <option value="DataTypeCheck">Data Type Check</option>\n' +
        '</select><br class="val-compare" />\n' +
        '<label class="val-all">&nbsp;</label><input type="button" value="Save" />&nbsp;<input type="button" value="Cancel" />';
        return sHtml;
    }
    this.LoadDesigner = function (designer, data) {
        // load values from data
        this.ResetDesigner(designer);
        designer.find('.validation-text').val(this.Text);
        designer.find('.validation-message').val(this.Message);
        designer.find('.validation-type-selector').val(this.Type).change();
        switch (this.Type) {
            case 'regex':
                designer.find('.validation-expression').val(this.ValidationExpression);
                break;
            case 'range':
                designer.find('.validation-minvalue').val(this.MinimumValue);
                designer.find('.validation-maxvalue').val(this.MaximumValue);
                designer.find('.validation-datatype').val(this.DataType);
                break;
            case 'compare':
                designer.find('.validation-datatype').val(this.DataType);
                designer.find('.validation-operator').val(this.Operator);
                designer.find('.validation-comparetarget').val(this.CompareTarget);
                designer.find('.validation-comparevalue').val(this.CompareValue);
                break;
        }
    };
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.Reset();
        this.Text = designer.find('.validation-text').val();
        this.Message = designer.find('.validation-message').val();
        this.Type = designer.find('.validation-type-selector').val();
        switch (this.Type) {
            case 'regex':
                this.ValidationExpression = designer.find('.validation-expression').val();
                break;
            case 'range':
                this.MinimumValue = designer.find('.validation-minvalue').val();
                this.MaximumValue = designer.find('.validation-maxvalue').val();
                this.DataType = designer.find('.validation-datatype').val();
                break;
            case 'compare':
                this.DataType = designer.find('.validation-datatype').val();
                this.Operator = designer.find('.validation-operator').val();
                this.CompareTarget = designer.find('.validation-comparetarget').val();
                this.CompareValue = designer.find('.validation-comparevalue').val();
                break;
        }
    };
    this.Reset = function () {
        this.Text = null;
        this.Message = null;
        this.Type = null;
        this.ValidationExpression = null;
        this.MiniumValue = null;
        this.MaximumValue = null;
        this.DataType = null;
        this.Operator = null;
        this.CompareTarget = null;
        this.CompareValue = null;
    };
    this.ResetDesigner = function (designer) {
        designer.find('.validation-text').val('');
        designer.find('.validation-message').val('');
        designer.find('.validation-type-selector').val('').change();
        designer.find('.validation-expression').val('');
        designer.find('.validation-minvalue').val('');
        designer.find('.validation-maxvalue').val('');
        designer.find('.validation-datatype').val('');
        designer.find('.validation-operator').val('');
        designer.find('.validation-comparetarget').val('');
        designer.find('.validation-comparevalue').val('');
    };
    if (node) { this.ParseXml(node); }
}

// Classes for manipulating controls

function ctlLabel(node, forControl) {
    this.Text = '';
    this.Tag = "Label";
    this.For = forControl;
    this.CssClass = null;
    this.GetDesignerHtml = function () {
        var props = new Array;
        var classes = new Array;
        var sProps = '';
        if (this.For) props.push('for="' + this.For + '"');
        classes.push(style_Label);
        if (this.CssClass) classes.push(this.CssClass);
        props.push('class="' + classes.join(' ') + '"');
        if (props.length) sProps = ' ' + props.join(' ');
        return '<label' + sProps + '>' + this.Text + '</label>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        if ($ctl.attr("CssClass")) this.CssClass = $ctl.attr("CssClass");
        if ($ctl.attr("For")) this.For = $ctl.attr("For");
        // if there's a text attribute get it's value. Otherwise, get the inner text 
        if ($ctl.attr("Text")) {
            this.Text = $ctl.attr("Text");
        } else {
            this.Text = $ctl.text();
        }
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        var sOut = '';
        if (indent === 0) {
            indent = '';
            sOut = '<' + this.Tag;
        }
        else {
            if (!indent) { indent = '      '; }
            sOut = "\n" + indent + "  <" + this.Tag;
        }
        if (this.For) sOut += ' For="' + this.For + '"';
        if (this.CssClass) sOut += ' CssClass="' + this.CssClass + '"';
        sOut += '>' + this.Text + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-label-text") +
            ctlUtils.CreateTextInput("For", "designer-label-for");
    }
    // Only called outside of FormBuilder.
    this.LoadDesigner = function (designer, data) {
        designer.find('.designer-label-text').val(this.Text);
        designer.find('.designer-label-for').val(this.For);
        designer.find('.designer-label-cssclass').val(this.CssClass);
    }
    // Only called outside of FormBuilder
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-label-text').val();
        this.For = designer.find('.designer-label-for').val();
        this.CssClass = designer.find('.designer-label-cssclass').val();
    }
    if (node) { this.ParseXml(node) };
}

function ctlText(node) {
    this.ID = null;
    this.Tag = "Text";
    this.DataField = null;
    this.Nullable = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Can be bound to a column to display that column's value in a read-only fashion.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>Text</span><br />' +
                '<span>DataField </span>' + this.DataField + '<br />' +
                '<span>Nullable </span>';
        if (this.Nullable) sHtml += 'True'
        else sHtml += 'False'

        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.DataField = $ctl.attr("DataField");
        this.Nullable = ($ctl.attr("Nullable")) ? $ctl.attr("Nullable") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("DataField", "designer-datafield required") +
            ctlUtils.CreateCheckbox("Nullable", "designer-text-nullable");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-datafield').val(this.DataField);
        designer.find('.designer-text-nullable').get(0).checked = (this.Nullable);
    }
    this.LoadFromDesigner = function (designer) {
        this.DataField = designer.find('.designer-datafield').val();
        this.Nullable = designer.find('.designer-text-nullable').get(0).checked;
    }
    if (node) this.ParseXml(node);
} // ctlText

function ctlTextBox(node) {
    this.ID = null;
    this.Tag = "TextBox";
    this.Label = null;
    this.DataField = null;
    this.DataType = null;
    this.Nullable = null;
    this.MaxLength = null;
    this.Validation = null;
    this.Description = "Provides users with a means of entering a single line of text";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var sMaxLength = (this.MaxLength) ? ' maxlength="' + this.MaxLength + '"' : '';
        return '<input type="textbox"' + sMaxLength + ctlUtils.BuildStyleProperty(arrStyle) + '></input>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.MaxLength = ($ctl.attr("MaxLength")) ? $ctl.attr("MaxLength") : null;
        this.Validation = ctlUtils.ParseValidateTags(node);
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        var sOut = '';
        var lblXml = (this.Label) ? this.Label.GetXml(indent) : '';
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        sOut += indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.MaxLength) sOut += ' MaxLength="' + this.MaxLength + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        sOut += '>';
        sOut += lblXml;
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) };
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateTextInput("Height", "designer-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
            ctlUtils.CreateTextInput("MaxLength", "designer-maxlength numeric") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable")

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-height').val(this.Height);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-maxlength').val(this.MaxLength);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
    };
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID;
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.MaxLength = designer.find('.designer-maxlength').val();
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
    };
    if (node) this.ParseXml(node);
}

function ctlDateInput(node) {
    this.ID = null;
    this.Tag = "DateInput";
    this.Label = null;
    this.DataField = null;
    this.DataType = "DateTime";
    this.Nullable = null;
    this.Culture = null;
    this.Format = null;
    this.DatePicker = null;
    this.DateOnly = null;
    this.Validation = null;
    this.Description = "Provides users with a means of entering date values. It allows you to specify the format of the date based on the supplied culture ID.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var sOut = '<input type="textbox"' + ctlUtils.BuildStyleProperty(arrStyle) + '></input>';
        if (this.DatePicker) { sOut += ' <img src="images/calendar.jpg" />'; }
        return sOut;
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl, "DateTime");
        this.Culture = ($ctl.attr("Culture")) ? $ctl.attr("Culture") : null;
        this.Format = ($ctl.attr("Format")) ? $ctl.attr("Format") : null;
        this.DateOnly = ($ctl.attr("DateOnly")) ? $ctl.attr("DateOnly") : null;
        if ($ctl.find("Calendar").length > 0) {
            this.DatePicker = true;
        } else {
            this.DatePicker = null;
        }

        this.Validation = ctlUtils.ParseValidateTags(node);
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        var sOut = '';
        var lblXml = (this.Label) ? this.Label.GetXml(indent) : '';
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        sOut += indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DateOnly) sOut += ' DateOnly="' + this.DateOnly + '"';
        if (this.Culture) sOut += ' Culture="' + this.Culture + '"';
        var sFormat = '';
        if (this.Format) {
            sFormat = ' Format="' + this.Format + '"';
        }
        sOut += sFormat;
        sOut += '>';
        sOut += lblXml;
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        if (this.DatePicker) {
            sOut += ' <Calendar Target="' + this.ID + '"';
            sOut += sFormat + '/>';
        }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no label for text editor
        // no datepicker for text editor.
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateTextInput("Height", "designer-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
            ctlUtils.CreateTextInput("Culture", "designer-culture") +
            ctlUtils.CreateTextInput("Format", "designer-format") +
            ctlUtils.CreateCheckbox("Date Only", "designer-dateonly") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable")

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-height').val(this.Height);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        designer.find('.designer-culture').val(this.Culture);
        designer.find('.designer-format').val(this.Format);
        if (this.DatePicker) { designer.find('.designer-datepicker').get(0).checked = true; }
        else { designer.find('.designer-datepicker').get(0).checked = false; }
        if (this.DateOnly) { designer.find('.designer-dateonly').get(0).checked = true; }
        else { designer.find('.designer-dateonly').get(0).checked = false; }
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
    };
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID;
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.Culture = designer.find('.designer-culture').val();
        this.Format = designer.find('.designer-format').val();
        this.DatePicker = designer.find('.designer-datepicker').get(0).checked;
        this.DateOnly = designer.find('.designer-dateonly').get(0).checked;
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
    };
    if (node) this.ParseXml(node);
}

function ctlTextArea(node) {
    this.ID = null;
    this.Tag = "TextArea";
    this.Label = null;
    this.DataField = null;
    this.DataType = null;
    this.Nullable = null;
    this.Validation = null;
    this.Description = "Provides users with a means of entering a multiple lines of text";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        return '<textarea' + ctlUtils.BuildStyleProperty(arrStyle) + '></textarea>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl, "String")
        this.Validation = ctlUtils.ParseValidateTags(node);
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateTextInput("Height", "designer-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable")

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-height').val(this.Height);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
    }
    if (node) this.ParseXml(node);
}

function ctlPassword(node) {
    this.ID = null;
    this.Tag = "Password";
    this.Label = null;
    this.DataField = null;
    this.DataType = null;
    this.Nullable = null;
    this.Validation = null;
    this.Description = "Use this control if you wish the user's input to be obfuscated on-screen as they type.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        return '<input type="password"' + ctlUtils.BuildStyleProperty(arrStyle) + '></input>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl, "string");
        this.Validation = ctlUtils.ParseValidateTags(node);
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = ident + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) };
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateTextInput("Height", "designer-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable")

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-height').val(this.Height);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
    };
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID;
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
    };
    if (node) this.ParseXml(node);
}

function ctlHtmlInput(node) {
    this.ID = null;
    this.Tag = "HtmlInput";
    this.Label = null;
    this.DataField = null;
    this.DataType = null;
    this.Nullable = null;
    this.Validation = null;
    this.Description = "Provides users with the ability to enter HTML via a rich text editor.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        return '<textarea' + ctlUtils.BuildStyleProperty(arrStyle) + '>HTML Input (preview not available)</textarea>';
    }
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.Validation = ctlUtils.ParseValidateTags(node);
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
           ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
           ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
           ctlUtils.CreateTextInput("Height", "designer-height alphanumeric") +
           ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
           ctlUtils.CreateCheckbox("Nullable", "designer-nullable")

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-height').val(this.Height);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
    }
    if (node) this.ParseXml(node);
}

function ctlDropDownList(node) {
    this.ID = null;
    this.Tag = "DropDownList";
    this.Label = null;
    this.DataField = null;
    this.DataType = null;
    this.Nullable = null;
    this.Validation = null;
    this.DataSourceId = null;
    this.DataTextField = null;
    this.DataValueField = null;
    this.AppendDataBoundItems = null;
    this.ListItems = null;
    this.Description = "Enables the user to select one and only one item from a pre-determined list.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var out = '<select size="1"' + ctlUtils.BuildStyleProperty(arrStyle) + '>';
        out += ctlUtils.BuildListOptions(this.ListItems);
        out += '</select>';
        return out;
    }
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.Validation = ctlUtils.ParseValidateTags(node);
        this.DataSourceId = ($ctl.attr("DataSourceId")) ? $ctl.attr("DataSourceId") : null;
        this.DataTextField = ($ctl.attr("DataTextField")) ? $ctl.attr("DataTextField") : null;
        this.DataValueField = ($ctl.attr("DataValueField")) ? $ctl.attr("DataValueField") : null;
        this.AppendDataBoundItems = ($ctl.attr("AppendDataBoundItems")) ? $ctl.attr("AppendDataBoundItems") : null;
        this.ListItems = ctlUtils.ParseListItems($ctl);
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.DataSourceId) sOut += ' DataSourceId="' + this.DataSourceId + '"';
        if (this.DataTextField) sOut += ' DataTextField="' + this.DataTextField + '"';
        if (this.DataValueField) sOut += ' DataValueField="' + this.DataValueField + '"';
        if (this.AppendDataBoundItems) sOut += ' AppendDataBoundItems="' + this.AppendDataBoundItems + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        if (this.ListItems) sOut += '\n' + ctlUtils.GetListItemsXml(this.ListItems);
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateTextInput("Control Data Source", "designer-datasource-listing") +
            ctlUtils.CreateTextInput("Data Text Field", "designer-datatextfield") +
            ctlUtils.CreateTextInput("Data Value Field", "designer-datavaluefield") +
            ctlUtils.CreateCheckbox("Append Databound Items", "designer-append-databounditems") +
            ctlUtils.CreateListBox("Items", "designer-listitems", 7) +
            ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable");

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-height').val(this.Height);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
        // check for ControlDataSources
        designer.find('.designer-datasource-listing').val(this.DataSourceId).change();
        designer.find('.designer-datatextfield').val(this.DataTextField);
        designer.find('.designer-datavaluefield').val(this.DataValueField);
        designer.find('.designer-append-databounditems').get(0).checked = (this.AppendDataBoundItems == true);
        var lstItems = '';
        if (this.ListItems) {
            for (var i = 0; i < this.ListItems.length; i++) {
                lstItems += '<option value="' + this.ListItems[i].Value + '">' + this.ListItems[i].Text + '</option>';
            }
        }
        designer.find('.designer-listitems').html('').append(lstItems);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.DataSourceId = designer.find('.designer-datasource-listing').val();
        this.DataTextField = designer.find('.designer-datatextfield').val();
        this.DataValueField = designer.find('.designer-datavaluefield').val();
        this.AppendDataBoundItems = designer.find('.designer-append-databounditems').get(0).checked;
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
        var newListItems = new Array;
        designer.find('.designer-listitems option').each(function () {
            var $opt = jQuery(this);
            var li = new ListItem($opt.text(), $opt.val());
            newListItems.push(li);
        });
        this.ListItems = null;
        this.ListItems = newListItems;
    }
    if (node) this.ParseXml(node);
}

function ctlListBox(node) {
    this.ID = null;
    this.Tag = "ListBox";
    this.Label = null;
    this.DataField = null;
    this.DataType = null;
    this.Nullable = null;
    this.Validation = null;
    this.ListItems = null;
    this.Rows = 4;
    this.SelectionMode = null;
    this.DataSourceId = null;
    this.DataTextField = null;
    this.DataValueField = null;
    this.AppendDataBoundItems = null;
    this.Description = "Provides users with a means of selecting zero or more items from a pre-defined list";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var out = '<select size="' + this.Rows + '"' + ctlUtils.BuildStyleProperty(arrStyle);
        if (this.SelectionMode && this.SelectionMode == 'Multiple') out += ' multiple="multiple"';
        out += '>';
        out += ctlUtils.BuildListOptions(this.ListItems);
        out += '</select>';
        return out;
    }
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.DataSourceId = ($ctl.attr("DataSourceId")) ? $ctl.attr("DataSourceId") : null;
        this.DataTextField = ($ctl.attr("DataTextField")) ? $ctl.attr("DataTextField") : null;
        this.DataValueField = ($ctl.attr("DataValueField")) ? $ctl.attr("DataValueField") : null;
        this.AppendDataBoundItems = ($ctl.attr("AppendDataBoundItems")) ? $ctl.attr("AppendDataBoundItems") : null;
        this.Validation = ctlUtils.ParseValidateTags(node);
        if (!this.Width) this.Width = '140';
        if ($ctl.attr("Rows")) this.Rows = $ctl.attr("Rows");
        if ($ctl.attr("SelectionMode")) this.SelectionMode = $ctl.attr("SelectionMode");
        this.ListItems = ctlUtils.ParseListItems($ctl);
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.DataSourceId) sOut += ' DataSourceId="' + this.DataSourceId + '"';
        if (this.DataTextField) sOut += ' DataTextField="' + this.DataTextField + '"';
        if (this.DataValueField) sOut += ' DataValueField="' + this.DataValueField + '"';
        if (this.AppendDataBoundItems) sOut += ' AppendDataBoundItems="' + this.AppendDataBoundItems + '"';
        if (this.Rows) sOut += ' Rows="' + this.Rows + '"';
        if (this.SelectionMode) sOut += ' SelectionMode="' + this.SelectionMode + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        if (this.ListItems) sOut += '\n' + ctlUtils.GetListItemsXml(this.ListItems, indent);
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable") +
            ctlUtils.CreateTextInput("Rows", "designer-rows numeric") +
            ctlUtils.CreateDropdown("Selection Mode", 'designer-selectionmode',
                ["Single-Selection", "Multiple-Selection"], ["Single", "Multiple"]) +
            ctlUtils.CreateTextInput("Control Data Source", "designer-datasource-listing") +
            ctlUtils.CreateTextInput("Data Text Field", "designer-datatextfield") +
            ctlUtils.CreateTextInput("Data Value Field", "designer-datavaluefield") +
            ctlUtils.CreateCheckbox("Append Databound Items", "designer-append-databounditems") +
            ctlUtils.CreateListBox("Items", "designer-listitems", 7);

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-rows').val(this.Rows);
        if (this.SelectionMode) { designer.find('.designer-selectionmode').val(this.SelectionMode); };
        designer.find('.designer-datafield.is-active').val(this.DataField);
        designer.find('.designer-datasource-listing').val(this.DataSourceId).change();
        designer.find('.designer-datatextfield').val(this.DataTextField);
        designer.find('.designer-datavaluefield').val(this.DataValueField);
        designer.find('.designer-append-databounditems').get(0).checked = (this.AppendDataBoundItems == true);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
        var lstItems = '';
        if (this.ListItems) {
            for (var i = 0; i < this.ListItems.length; i++) {
                lstItems += '<option value="' + this.ListItems[i].Value + '">' + this.ListItems[i].Text + '</option>';
            }
        }
        designer.find('.designer-listitems').html('').append(lstItems);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        var id = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        var width = parseInt(designer.find('.designer-width').val());
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.DataSourceId = designer.find('.designer-datasource-listing').val();
        this.DataTextField = designer.find('.designer-datatextfield').val();
        this.DataValueField = designer.find('.designer-datavaluefield').val();
        this.AppendDataBoundItems = designer.find('.designer-append-databounditems').get(0).checked;
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
        var rows = parseInt(designer.find('.designer-rows').val());
        this.ID = id;
        if (width != '' && isNaN(width)) { this.Width = '140' }
        else { this.Width = width }
        if (isNaN(rows) || rows <= 0) { this.Rows = 4 }
        else { this.Rows = rows }
        this.SelectionMode = designer.find('.designer-selectionmode').val();
        var newListItems = new Array;
        designer.find('.designer-listitems option').each(function () {
            var $opt = jQuery(this);
            var li = new ListItem($opt.text(), $opt.val());
            newListItems.push(li);
        });
        this.ListItems = null;
        this.ListItems = newListItems;
    }
    if (node) this.ParseXml(node);
}

function ctlDualList(node) {
    this.ID = null;
    this.Tag = "DualList";
    this.Label = null;
    this.DataField = null;
    this.DataType = null;
    this.Nullable = null;
    this.Validation = null;
    this.ListItems = null;
    this.Rows = 6;
    this.DataSourceId = null;
    this.DataTextField = null;
    this.DataValueField = null;
    this.AppendDataBoundItems = null;
    this.Description = "Allows users to select one or more items in a list or remove them by moving them from one list control to another.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var out = '<table style="border-collapse:collapse;">\n' +
              ' <tr>\n' +
              '  <td style="padding: 0px 5px; vertical-align: middle;">\n' +
              '   <select size="' + this.Rows + '"' + ctlUtils.BuildStyleProperty(arrStyle) + '>\n';
        out += ctlUtils.BuildListOptions(this.ListItems);
        out += '   </select>\n';
        out += '  </td>\n' +
           '  <td>\n' +
           '    <input type="button" value=">" style="width: 30px;"/><br />\n' +
           '    <input type="button" value="<"  style="width: 30px;"/><br />\n' +
           '    <input type="button" value=">>"  style="width: 30px;"/><br />\n' +
           '    <input type="button" value="<<"  style="width: 30px;"/><br />\n' +
           '  </td>\n' +
           '  <td>\n' +
           '    <select size="' + this.Rows + '"' + ctlUtils.BuildStyleProperty(arrStyle) + '>\n' +
           '    </select>\n' +
           '  </td>\n' +
           ' </tr>\n' +
           '</table>\n';
        return out;
    }
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.DataSourceId = ($ctl.attr("DataSourceId")) ? $ctl.attr("DataSourceId") : null;
        this.DataTextField = ($ctl.attr("DataTextField")) ? $ctl.attr("DataTextField") : null;
        this.DataValueField = ($ctl.attr("DataValueField")) ? $ctl.attr("DataValueField") : null;
        this.AppendDataBoundItems = ($ctl.attr("AppendDataBoundItems")) ? $ctl.attr("AppendDataBoundItems") : null;
        this.Validation = ctlUtils.ParseValidateTags(node);
        if (!this.Width) this.Width = '140';
        if ($ctl.attr("Rows")) this.Rows = $ctl.attr("Rows");
        this.ListItems = ctlUtils.ParseListItems($ctl);
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.DataSourceId) sOut += ' DataSourceId="' + this.DataSourceId + '"';
        if (this.DataTextField) sOut += ' DataTextField="' + this.DataTextField + '"';
        if (this.DataValueField) sOut += ' DataValueField="' + this.DataValueField + '"';
        if (this.AppendDataBoundItems) sOut += ' AppendDataBoundItems="' + this.AppendDataBoundItems + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        if (this.ListItems) sOut += '\n' + ctlUtils.GetListItemsXml(this.ListItems, indent);
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable") +
            ctlUtils.CreateTextInput("Rows", "designer-rows numeric") +
            ctlUtils.CreateTextInput("Control Data Source", "designer-datasource-listing") +
            ctlUtils.CreateTextInput("Data Text Field", "designer-datatextfield") +
            ctlUtils.CreateTextInput("Data Value Field", "designer-datavaluefield") +
            ctlUtils.CreateCheckbox("Append Databound Items", "designer-append-databounditems") +
            ctlUtils.CreateListBox("Items", "designer-listitems", 7);

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-rows').val(this.Rows);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        designer.find('.designer-datasource-listing').val(this.DataSourceId).change();
        designer.find('.designer-datatextfield').val(this.DataTextField);
        designer.find('.designer-datavaluefield').val(this.DataValueField);
        designer.find('.designer-append-databounditems').get(0).checked = (this.AppendDataBoundItems == true);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
        var lstItems = '';
        if (this.ListItems) {
            for (var i = 0; i < this.ListItems.length; i++) {
                lstItems += '<option value="' + this.ListItems[i].Value + '">' + this.ListItems[i].Text + '</option>';
            }
        }
        designer.find('.designer-listitems').html('').append(lstItems);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        var id = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        var width = parseInt(designer.find('.designer-width').val());
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.DataSourceId = designer.find('.designer-datasource-listing').val();
        this.DataTextField = designer.find('.designer-datatextfield').val();
        this.DataValueField = designer.find('.designer-datavaluefield').val();
        this.AppendDataBoundItems = designer.find('.designer-append-databounditems').get(0).checked;
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
        var rows = parseInt(designer.find('.designer-rows').val());
        this.ID = id;
        if (width != '' && isNaN(width)) { this.Width = '140' }
        else { this.Width = width }
        if (isNaN(rows) || rows <= 0) { this.Rows = 4 }
        else { this.Rows = rows }
        var newListItems = new Array;
        designer.find('.designer-listitems option').each(function () {
            var $opt = jQuery(this);
            var li = new ListItem($opt.text(), $opt.val());
            newListItems.push(li);
        });
        this.ListItems = null;
        this.ListItems = newListItems;
    }
    if (node) this.ParseXml(node);
}

function ctlCheckBox(node) {
    this.ID = null;
    this.Tag = "CheckBox";
    this.Label = null;
    this.Nullable = null;
    this.DataField = null;
    this.DataType = null;
    this.Validation = null;
    this.Checked = false;
    this.Description = "Allows for a yes/no, on/off, or similar toggle-type answer from the user.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var chkProp = (this.Checked) ? ' checked="checked"' : '';
        return '<input type="checkbox"' + ctlUtils.BuildStyleProperty(arrStyle) + chkProp + '/>';
    }
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.Validation = ctlUtils.ParseValidateTags(node);
        this.Checked = ($ctl.attr("Checked") == "True") ? true : null;
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.Checked) sOut += ' Checked="True"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateTextInput("Width", "designer-width alphanumeric") +
            ctlUtils.CreateCheckbox("Checked", "designer-checked") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable");

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
        if (this.Checked) {
            designer.find('.designer-checked').attr('checked', 'checked');
        } else {
            designer.find('.designer-checked').removeAttr('checked');
        }
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        var width = parseInt(designer.find('.designer-width').val());
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
        var checked = designer.find('.designer-checked')[0].checked;
        this.Checked = checked;
    }
    if (node) this.ParseXml(node);
}

function ctlCheckBoxList(node) {
    this.ID = null;
    this.Tag = "CheckBoxList";
    this.Label = null;
    this.DataField = null;
    this.DataType = null;
    this.Nullable = null;
    this.ListItems = null;
    this.Validation = null;
    this.DataSourceId = null;
    this.DataTextField = null;
    this.DataValueField = null;
    this.AppendDataBoundItems = null;
    this.RepeatColumns = null;
    this.RepeatDirection = null;
    this.RepeatLayout = "Table";
    this.SelectedItemsSeparator = "|";
    this.Description = "Enables the user to select 0 or more options from a list by ticking their corresponding checkbox.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var html = '<table' + ctlUtils.BuildStyleProperty(arrStyle) + '>';
        if (this.ListItems) {
            for (var i = 0; i < this.ListItems.length; i++) {
                html += '<tr><td><input type="checkbox" /><label>' + this.ListItems[i].Text + '</label></td></tr>';
            }
        }
        html += '</table>'
        return html;
    }
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.DataSourceId = ($ctl.attr("DataSourceId")) ? $ctl.attr("DataSourceId") : null;
        this.DataTextField = ($ctl.attr("DataTextField")) ? $ctl.attr("DataTextField") : null;
        this.DataValueField = ($ctl.attr("DataValueField")) ? $ctl.attr("DataValueField") : null;
        this.RepeatColumns = ($ctl.attr("RepeatColumns")) ? $ctl.attr("RepeatColumns") : null;
        this.RepeatDirection = ($ctl.attr("RepeatDirection")) ? $ctl.attr("RepeatDirection") : null;
        this.RepeatLayout = ($ctl.attr("RepeatLayout")) ? $ctl.attr("RepeatLayout") : null;
        this.SelectedItemsSeparator = ($ctl.attr("SelectedItemsSeparator")) ? $ctl.attr("SelectedItemsSeparator") : null;
        this.AppendDataBoundItems = ($ctl.attr("AppendDataBoundItems")) ? $ctl.attr("AppendDataBoundItems") : null;
        this.Validation = ctlUtils.ParseValidateTags(node);
        this.ListItems = ctlUtils.ParseListItems($ctl);
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.DataSourceId) sOut += ' DataSourceId="' + this.DataSourceId + '"';
        if (this.DataTextField) sOut += ' DataTextField="' + this.DataTextField + '"';
        if (this.DataValueField) sOut += ' DataValueField="' + this.DataValueField + '"';
        if (this.RepeatColumns) sOut += ' RepeatColumns="' + this.RepeatColumns + '"';
        if (this.RepeatDirection) sOut += ' RepeatDirection="' + this.RepeatDirection + '"';
        if (this.RepeatLayout) sOut += ' RepeatLayout="' + this.RepeatLayout + '"';
        if (this.SelectedItemsSeparator) sOut += ' SelectedItemsSeparator="' + this.SelectedItemsSeparator + '"';
        if (this.AppendDataBoundItems) sOut += ' AppendDataBoundItems="' + this.AppendDataBoundItems + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        if (this.ListItems) sOut += '\n' + ctlUtils.GetListItemsXml(this.ListItems, indent);
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable") +
            ctlUtils.CreateTextInput("Control Data Source", "designer-datasource-listing") +
            ctlUtils.CreateTextInput("Data Text Field", "designer-datatextfield") +
            ctlUtils.CreateTextInput("Data Value Field", "designer-datavaluefield") +
            ctlUtils.CreateTextInput("Repeat Columns", "designer-repeatcolumns numeric") +
            ctlUtils.CreateDropdown("Repeat Direction", "designer-repeatdirection", ["", "Horizontal", "Vertical"]) +
            ctlUtils.CreateDropdown("Repeat Layout", "designer-repeatlayout", ["", "Table", "Flow"]) +
            ctlUtils.CreateTextInput("Selected Items Separator", "designer-selecteditemsseparator", "|") +
            ctlUtils.CreateCheckbox("Append Databound Items", "designer-append-databounditems") +
            ctlUtils.CreateListBox("Items", "designer-listitems", 7);

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        designer.find('.designer-datasource-listing').val(this.DataSourceId).change();
        designer.find('.designer-datatextfield').val(this.DataTextField);
        designer.find('.designer-datavaluefield').val(this.DataValueField);
        designer.find('.designer-repeatcolumns').val(this.RepeatColumns);
        designer.find('.designer-repeatdirection').val(this.RepeatDirection);
        designer.find('.designer-repeatlayout').val(this.RepeatLayout);
        designer.find('.designer-selecteditemsseparator').val(this.SelectedItemsSeparator);
        designer.find('.designer-append-databounditems').get(0).checked = (this.AppendDataBoundItems == true);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
        var lstItems = '';
        if (this.ListItems) {
            for (var i = 0; i < this.ListItems.length; i++) {
                lstItems += '<option value="' + this.ListItems[i].Value + '">' + this.ListItems[i].Text + '</option>';
            }
        }
        designer.find('.designer-listitems').html('').append(lstItems);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.DataSourceId = designer.find('.designer-datasource-listing').val();
        this.DataTextField = designer.find('.designer-datatextfield').val();
        this.DataValueField = designer.find('.designer-datavaluefield').val();
        this.RepeatColumns = designer.find('.designer-repeatcolumns').val();
        this.RepeatDirection = designer.find('.designer-repeatdirection').val();
        this.RepeatLayout = designer.find('.designer-repeatlayout').val();
        this.SelectedItemsSeparator = designer.find('.designer-selecteditemsseparator').val();
        this.AppendDataBoundItems = designer.find('.designer-append-databounditems').get(0).checked;
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
        var newListItems = new Array;
        designer.find('.designer-listitems option').each(function () {
            var $opt = jQuery(this);
            var li = new ListItem($opt.text(), $opt.val());
            newListItems.push(li);
        });
        this.ListItems = null;
        this.ListItems = newListItems;
    }
    if (node) this.ParseXml(node);
}

function ctlRadioButton(node) {
    this.ID = null;
    this.Tag = "RadioButton";
    this.Label = null;
    this.Nullable = null;
    this.DataField = null;
    this.DataType = null;
    this.Validation = null;
    this.Checked = false;
    this.Description = "Enables the user to select only 1 option by ticking its corresponding radio button.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var chkProp = (this.Checked) ? ' checked="checked"' : '';
        return '<input type="radio"' + ctlUtils.BuildStyleProperty(arrStyle) + chkProp + '/>';
    }
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.Validation = ctlUtils.ParseValidateTags(node);
        this.Checked = ($ctl.attr("Checked") == "True") ? true : null;
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.Checked) sOut += ' Checked="True"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateCheckbox("Checked", "designer-checked") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable") +
            ctlUtils.CreateTextInput("Control Data Source", "designer-datasource-listing") +
            ctlUtils.CreateTextInput("Data Text Field", "designer-datatextfield") +
            ctlUtils.CreateTextInput("Data Value Field", "designer-datavaluefield") +
            ctlUtils.CreateCheckbox("Append Databound Items", "designer-append-databounditems") +
            ctlUtils.CreateListBox("Items", "designer-listitems", 7);

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
        if (this.Checked) {
            designer.find('.designer-checked').attr('checked', 'checked');
        } else {
            designer.find('.designer-checked').removeAttr('checked');
        }
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        var width = parseInt(designer.find('.designer-width').val());
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
        var checked = designer.find('.designer-checked')[0].checked;
        this.Checked = checked;
    }
    if (node) this.ParseXml(node);
}

function ctlRadioButtonList(node) {
    this.ID = null;
    this.Tag = "RadioButtonList";
    this.Label = null;
    this.Nullable = null;
    this.DataField = null;
    this.DataType = null;
    this.ListItems = null;
    this.Validation = null;
    this.DataSourceId = null;
    this.DataTextField = null;
    this.DataValueField = null;
    this.RepeatColumns = null;
    this.RepeatDirection = null;
    this.RepeatLayout = "Table";
    this.SelectedItemsSeparator = "|";
    this.AppendDataBoundItems = null;
    this.Description = "Enables the user to select only 1 option from a list by ticking its corresponding radio button.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        var html = '<table' + ctlUtils.BuildStyleProperty(arrStyle) + '>';
        if (this.ListItems) {
            // build unique, temporary group name for radio buttons
            var dt = new Date();
            var sOptName = 'rbl' + dt.getFullYear() + dt.getMonth() + dt.getDate() + dt.getHours() + dt.getMinutes() + dt.getSeconds();
            for (var i = 0; i < this.ListItems.length; i++) {
                html += '<tr><td><input type="radio" name="' + sOptName + '" /><label>' + this.ListItems[i].Text + '</label></td></tr>';
            }
        }
        html += '</table>'
        return html;
    }
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.DataSourceId = ($ctl.attr("DataSourceId")) ? $ctl.attr("DataSourceId") : null;
        this.DataTextField = ($ctl.attr("DataTextField")) ? $ctl.attr("DataTextField") : null;
        this.DataValueField = ($ctl.attr("DataValueField")) ? $ctl.attr("DataValueField") : null;
        this.RepeatColumns = ($ctl.attr("RepeatColumns")) ? $ctl.attr("RepeatColumns") : null;
        this.RepeatDirection = ($ctl.attr("RepeatDirection")) ? $ctl.attr("RepeatDirection") : null;
        this.RepeatLayout = ($ctl.attr("RepeatLayout")) ? $ctl.attr("RepeatLayout") : null;
        this.SelectedItemsSeparator = ($ctl.attr("SelectedItemsSeparator")) ? $ctl.attr("SelectedItemsSeparator") : null;
        this.AppendDataBoundItems = ($ctl.attr("AppendDataBoundItems")) ? $ctl.attr("AppendDataBoundItems") : null;
        this.Validation = ctlUtils.ParseValidateTags(node);
        this.ListItems = ctlUtils.ParseListItems($ctl);
    }
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.DataSourceId) sOut += ' DataSourceId="' + this.DataSourceId + '"';
        if (this.DataTextField) sOut += ' DataTextField="' + this.DataTextField + '"';
        if (this.DataValueField) sOut += ' DataValueField="' + this.DataValueField + '"';
        if (this.RepeatColumns) sOut += ' RepeatColumns="' + this.RepeatColumns + '"';
        if (this.RepeatDirection) sOut += ' RepeatDirection="' + this.RepeatDirection + '"';
        if (this.RepeatLayout) sOut += ' RepeatLayout="' + this.RepeatLayout + '"';
        if (this.SelectedItemsSeparator) sOut += ' SelectedItemsSeparator="' + this.SelectedItemsSeparator + '"';
        if (this.AppendDataBoundItems) sOut += ' AppendDataBoundItems="' + this.AppendDataBoundItems + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) }
        if (this.ListItems) sOut += '\n' + ctlUtils.GetListItemsXml(this.ListItems, indent);
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable") +
            ctlUtils.CreateTextInput("Control Data Source", "designer-datasource-listing") +
            ctlUtils.CreateTextInput("Data Text Field", "designer-datatextfield") +
            ctlUtils.CreateTextInput("Data Value Field", "designer-datavaluefield") +
            ctlUtils.CreateTextInput("Repeat Columns", "designer-repeatcolumns numeric") +
            ctlUtils.CreateDropdown("Repeat Direction", "designer-repeatdirection", ["", "Horizontal", "Vertical"]) +
            ctlUtils.CreateDropdown("Repeat Layout", "designer-repeatlayout", ["", "Table", "Flow"]) +
            ctlUtils.CreateTextInput("Selected Items Separator", "designer-selecteditemsseparator", "|") +
            ctlUtils.CreateCheckbox("Append Databound Items", "designer-append-databounditems") +
            ctlUtils.CreateListBox("Items", "designer-listitems", 7);

    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        designer.find('.designer-datasource-listing').val(this.DataSourceId).change();
        designer.find('.designer-datatextfield').val(this.DataTextField);
        designer.find('.designer-datavaluefield').val(this.DataValueField);
        designer.find('.designer-repeatcolumns').val(this.RepeatColumns);
        designer.find('.designer-repeatdirection').val(this.RepeatDirection);
        designer.find('.designer-repeatlayout').val(this.RepeatLayout);
        designer.find('.designer-selecteditemsseparator').val(this.SelectedItemsSeparator);
        designer.find('.designer-append-databounditems').get(0).checked = (this.AppendDataBoundItems == true);
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
        var lstItems = '';
        if (this.ListItems) {
            for (var i = 0; i < this.ListItems.length; i++) {
                lstItems += '<option value="' + this.ListItems[i].Value + '">' + this.ListItems[i].Text + '</option>';
            }
        }
        designer.find('.designer-listitems').html('').append(lstItems);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.DataSourceId = designer.find('.designer-datasource-listing').val();
        this.DataTextField = designer.find('.designer-datatextfield').val();
        this.DataValueField = designer.find('.designer-datavaluefield').val();
        this.RepeatColumns = designer.find('.designer-repeatcolumns').val();
        this.RepeatDirection = designer.find('.designer-repeatdirection').val();
        this.RepeatLayout = designer.find('.designer-repeatlayout').val();
        this.SelectedItemsSeparator = designer.find('.designer-selecteditemsseparator').val();
        this.AppendDataBoundItems = designer.find('.designer-append-databounditems').get(0).checked;
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
        var newListItems = new Array;
        designer.find('.designer-listitems option').each(function () {
            var $opt = jQuery(this);
            var li = new ListItem($opt.text(), $opt.val());
            newListItems.push(li);
        });
        this.ListItems = null;
        this.ListItems = newListItems;
    }
    if (node) this.ParseXml(node);
}

function ctlFileUpload(node) {
    this.ID = null;
    this.Tag = "FileUpload";
    this.Label = null;
    this.Nullable = null;
    this.DataField = null;
    this.DataType = null;
    this.Validation = null;
    this.DisplayMode = null;
    this.Path = null;
    this.UseUniqueFileName = null;
    this.Extensions = null;
    this.Description = "A basic control for uploading files to the web server. You can specify the allowable extensions, destination, and filename.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) arrStyle.push("height:" + this.Height + "px;");
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");
        return '<input type="file"' + ctlUtils.BuildStyleProperty(arrStyle) + '></input>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        ctlUtils.ParseXmlProperties(this, $ctl);
        this.Validation = ctlUtils.ParseValidateTags(node);
        this.DisplayMode = ($ctl.attr("DisplayMode")) ? $ctl.attr("DisplayMode") : null;
        this.Path = ($ctl.attr("Path")) ? $ctl.attr("Path") : null;
        this.UseUniqueFileName = ($ctl.attr("UseUniqueFileName")) ? $ctl.attr("UseUniqueFileName") : null;
        this.Extensions = ($ctl.attr("Extensions")) ? $ctl.attr("Extensions") : null;
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Nullable) sOut += ' Nullable="' + this.Nullable + '"';
        if (this.DataField) sOut += ' DataField="' + this.DataField + '"';
        if (this.DataType) sOut += ' DataType="' + this.DataType + '"';
        if (this.DisplayMode) sOut += ' DisplayMode="' + this.DisplayMode + '"';
        if (this.Path) sOut += ' Path="' + this.Path + '"';
        if (this.UseUniqueFileName) sOut += ' UseUniqueFileName="True"';
        if (this.Extensions) sOut += ' Extensions="' + this.Extensions + '"';
        sOut += '>';
        if (this.Label) sOut += this.Label.GetXml(indent);
        if (this.Validation) { sOut += ctlUtils.GetListItemsXml(this.Validation, indent) };
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateTextInput("Data Field", "designer-datafield designer-datafield-textbox is-active") +
            ctlUtils.CreateDataTypeDropdown("Data Type", "designer-datatype") +
            ctlUtils.CreateCheckbox("Nullable", "designer-nullable") +
            ctlUtils.CreateDropdown("Display Mode", "designer-displaymode",
                ["File Picker", "File Picker with No Upload", "Upload File and Select It"],
                ["FilePicker", "FilePickerNoUpload", "UploadAndSelect"]) +
            ctlUtils.CreateTextInput("Path", "designer-path") +
            ctlUtils.CreateCheckbox("Use Unique File Name", "designer-useuniquefilename") +
            ctlUtils.CreateTextInput("Allowable Extensions", "designer-extensions");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-height').val(this.Height);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-nullable').get(0).checked = (this.Nullable);
        designer.find('.designer-datafield.is-active').val(this.DataField);
        designer.find('.designer-displaymode').val(this.DisplayMode);
        designer.find('.designer-path').val(this.Path);
        if (this.UseUniqueFileName) {
            designer.find('.designer-useuniquefilename').attr('checked', 'checked');
        } else {
            designer.find('.designer-useuniquefilename').removeAttr('checked');
        }
        ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
    };
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        this.Label.Text = designer.find('.designer-label').val();
        this.Label.For = this.ID;
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.Nullable = designer.find('.designer-nullable').get(0).checked;
        this.DataField = designer.find('.designer-datafield.is-active').val();
        this.DataType = designer.find('.designer-datatype').val();
        this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
        this.DisplayMode = designer.find('.designer-displaymode').val();
        this.Path = designer.find('.designer-path').val();
        this.UseUniqueFileName = designer.find('.designer-useuniquefilename')[0].checked;
        this.Extensions = designer.find('.designer-extensions').val();
    };
    if (node) this.ParseXml(node);
}

function ctlValidationSummary(node) {
    this.ID = null;
    this.Tag = "ValidationSummary";
    this.DisplayMode = null;
    this.HeaderText = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    //this.DataField = null;
    //this.Validation = null;
    this.Description = "Enables the form to display a list of any and all validation messages in one place. Typically this is placed near the Add or Update button on a form.";
    this.GetDesignerHtml = function () {
        var arrStyle = new Array;
        if (this.Height) {
            arrStyle.push("height:" + this.Height + "px;");
        } else {
            arrStyle.push("height:75px;");
        }
        if (this.Width) arrStyle.push("width:" + this.Width + "px;");

        var sHtml = (this.HeaderText) ? this.HeaderText + ' ' : '';
        switch (this.DisplayMode) {
            case "List":
                sHtml += (this.HeaderText) ? '<br />' : '';
                sHtml += 'Error Message 1<br />Error Message 2<br />Error Message 3<br />';
                break;
            case "SingleParagraph":
                sHtml += 'Error Message 1 Error Message 2 Error Message 3 <br />';
                break;
            default:
                sHtml += '<ul><li>Error Message 1</li><li>Error Message 2</li><li>Error Message 3</li></ul>';
        }
        return '<div' + ctlUtils.BuildStyleProperty(arrStyle) + '>' +
           sHtml +
           '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.ID = $ctl.attr("Id");
        //this.Label = new ctlLabel($ctl.find("Label"), this.ID);
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
        this.DisplayMode = ($ctl.attr("DisplayMode")) ? $ctl.attr("DisplayMode") : null;
        this.HeaderText = ($ctl.attr("HeaderText")) ? $ctl.attr("HeaderText") : null;
        //this.DataField = ($ctl.attr("DataField")) ? $ctl.attr("DataField") : null;
        //this.Validation = ctlUtils.ParseValidateTags(node);
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        if (indent === 0) {
            indent = '';
        }
        else {
            if (!indent) { indent = '      '; }
        }
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += (this.DisplayMode) ? ' DisplayMode="' + this.DisplayMode + '"' : '';
        sOut += (this.HeaderText) ? ' HeaderText="' + this.HeaderText + '"' : '';
        sOut += '/>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        // no Label tag for text editor
        return ctlUtils.CreateTextInput("ID", "designer-id") +
            ctlUtils.CreateDropdown("Header Text", "designer-headertext") +
            ctlUtils.CreateDropdown("Display Mode", "designer-displaymode",
                ["Bullet List", "List", "Single Paragraph"],
                ["BulletList", "List", "SingleParagraph"]);
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        //designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-height').val(this.Height);
        designer.find('.designer-width').val(this.Width);
        designer.find('.designer-displaymode').val(this.DisplayMode);
        designer.find('.designer-headertext').val(this.HeaderText);
        //designer.find('.designer-datafield').val(this.DataField);
        //ctlUtils.LoadValidationDesigner(jQuery('#designer-validate'), this.Validation);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        //this.Label.Text = designer.find('.designer-label').val();
        this.Height = designer.find('.designer-height').val();
        this.Width = designer.find('.designer-width').val();
        this.DisplayMode = designer.find('.designer-displaymode').val();
        this.HeaderText = designer.find('.designer-headertext').val();
        //this.DataField = designer.find('.designer-datafield').val();
        //this.Validation = ctlUtils.LoadFromValidationDesigner(designer);
    }
    if (node) this.ParseXml(node);
}

function ctlEmail(node) {
    this.ID = null;
    this.Tag = "Email";
    this.To = null;
    this.From = null;
    this.CC = null;
    this.BCC = null;
    this.ReplyTo = null;
    this.Subject = null;
    this.Format = null;
    this.SendRule = null;
    this.ignoreSendRule = false; // set to true when using in plain text editor
    this.Body = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    //this.DataField = null;
    //this.Validation = null;
    this.Description = "A 'utility' control that has no visible user interface. Use this control to send email notifications when a form is submitted.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>Email</span><br />' +
                '<span>To </span>' + this.To + '<br />' +
                '<span>From </span>' + this.From + '<br />' +
                '<span>Subject </span>' + this.Subject;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.To = $ctl.attr("To");
        this.From = $ctl.attr("From");
        this.CC = $ctl.attr("CC");
        this.BCC = $ctl.attr("BCC");
        this.ReplyTo = $ctl.attr("ReplyTo");
        this.Subject = $ctl.attr("Subject");
        this.Format = $ctl.attr("Format");
        this.SendRule = $ctl.attr("SendRule");
        this.Body = $ctl.text();
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        var bNoIndent = (indent === 0);
        //if (!indent) { indent = '      '; }
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.To) sOut += ' To="' + this.To + '"';
        if (this.From) sOut += ' From="' + this.From + '"';
        if (this.CC) sOut += ' CC="' + this.CC + '"';
        if (this.BCC) sOut += ' BCC="' + this.BCC + '"';
        if (this.ReplyTo) sOut += ' ReplyTo="' + this.ReplyTo + '"';
        if (this.Subject) sOut += ' Subject="' + this.Subject + '"';
        if (this.Format) sOut += ' Format="' + this.Format + '"';
        if (!this.ignoreSendRule) {
            if (this.SendRule) {
                sOut += ' SendRule="' + this.SendRule + '"';
            } else {
                sOut += ' SendRule="both"';
            }
        }
        sOut += '>';
        // special accommodation - need CDATA for form builder. Remove for text editor
        var body = (this.Body) ? this.Body : '';
        if (bNoIndent) { sOut += body; }
        else { sOut += indent + '<![CDATA[' + body + ']]>'; }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        var propSheet = ctlUtils.CreateTextInput("To", "designer-email-to required") +
           ctlUtils.CreateTextInput("From", "designer-email-from required") +
           ctlUtils.CreateTextInput("Reply-To", "designer-email-replyto") +
           ctlUtils.CreateTextInput("CC", "designer-email-cc") +
           ctlUtils.CreateTextInput("BCC", "designer-email-bcc") +
           ctlUtils.CreateTextInput("Subject", "designer-email-subject");
        if (!this.ignoreSendRule) {
            propSheet += ctlUtils.CreateDropdown("Send When", "designer-email-sendrule",
                ["Adding and Updating a Record", "Adding a Record", "Updating a Record"],
                ["both", "add", "edit"]);
        }
        propSheet += ctlUtils.CreateDropdown("Format", "designer-email-format",
                ["Text", "HTML"], ["text", "html"]) +
           ctlUtils.CreateTextArea("Body", "designer-email-body");
        return propSheet;
    }
    this.LoadDesigner = function (designer, data) {
        // load values from data
        //designer.find('.designer-label').val(this.Label.Text);
        designer.find('.designer-email-to').val(this.To);
        designer.find('.designer-email-from').val(this.From);
        designer.find('.designer-email-replyto').val(this.ReplyTo);
        designer.find('.designer-email-cc').val(this.CC);
        designer.find('.designer-email-bcc').val(this.BCC);
        designer.find('.designer-email-subject').val(this.Subject);
        if (!this.ignoreSendRule) {
            designer.find('.designer-email-sendrule').val(this.SendRule);
        }
        designer.find('.designer-email-format').val(this.Format);
        designer.find('.designer-email-body').val(this.Body);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        //this.Label.Text = designer.find('.designer-label').val();
        this.To = designer.find('.designer-email-to').val();
        this.From = designer.find('.designer-email-from').val();
        this.ReplyTo = designer.find('.designer-email-replyto').val();
        this.CC = designer.find('.designer-email-cc').val();
        this.BCC = designer.find('.designer-email-bcc').val();
        this.Subject = designer.find('.designer-email-subject').val();
        this.Format = designer.find('.designer-email-format').val();
        if (!this.ignoreSendRule) {
            this.SendRule = designer.find('.designer-email-sendrule').val();
        }
        this.Body = designer.find('.designer-email-body').val();
    }
    if (node) this.ParseXml(node);
}

function ctlAddToRoles(node) {
    this.ID = null;
    this.Tag = "AddToRoles";
    this.RoleNames = null;
    this.UserId = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form 'action' that has no visible user interface. Use this control to add a user to one or more security roles.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>AddToRoles</span><br />' +
                '<span>RoleNames </span>' + this.RoleNames + '<br />' +
                '<span>UserId </span>' + this.UserId;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.RoleNames = $ctl.attr("RoleNames");
        this.UserId = $ctl.attr("UserId");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.RoleNames) sOut += ' RoleNames="' + this.RoleNames + '"';
        if (this.UserId) sOut += ' UserId="' + this.UserId + '">';
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Role Names", "designer-addtoroles-rolenames required") +
            ctlUtils.CreateTextInput("User ID", "designer-addtoroles-userid required");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-addtoroles-rolenames').val(this.RoleNames);
        designer.find('.designer-addtoroles-userid').val(this.UserId);
    }
    this.LoadFromDesigner = function (designer) {
        this.RoleNames = designer.find('.designer-addtoroles-rolenames').val();
        this.UserId = designer.find('.designer-addtoroles-userid').val();
    }
    if (node) this.ParseXml(node);
} // ctlAddToRoles

function ctlRemoveFromRoles(node) {
    this.ID = null;
    this.Tag = "RemoveFromRoles";
    this.RoleNames = null;
    this.UserId = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form 'action' that has no visible user interface. Use this control to remove a user to one or more security roles.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>RemoveFromRoles</span><br />' +
                '<span>RoleNames </span>' + this.RoleNames + '<br />' +
                '<span>UserId </span>' + this.UserId;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.RoleNames = $ctl.attr("RoleNames");
        this.UserId = $ctl.attr("UserId");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.RoleNames) sOut += ' RoleNames="' + this.RoleNames + '"';
        if (this.UserId) sOut += ' UserId="' + this.UserId + '">';
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Role Names", "designer-removefrom-rolenames required") +
            ctlUtils.CreateTextInput("User ID", "designer-removefrom-userid required");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-removefrom-rolenames').val(this.RoleNames);
        designer.find('.designer-removefrom-userid').val(this.UserId);
    }
    this.LoadFromDesigner = function (designer) {
        this.RoleNames = designer.find('.designer-removefrom-rolenames').val();
        this.UserId = designer.find('.designer-removefrom-userid').val();
    }
    if (node) this.ParseXml(node);
} // ctlRemoveFormRoles

function ctlAddUser(node) {
    this.ID = null;
    this.Tag = "AddUser";
    this.Email = null;
    this.FirstName = null;
    this.LastName = null;
    this.DisplayName = null;
    this.Password = null;
    this.Approved = null;
    this.Username = null;
    this.Country = null;
    this.Street = null;
    this.City = null;
    this.Region = null;
    this.PostalCode = null;
    this.Unit = null;
    this.Telephone = null;
    this.RoleNames = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form 'action' that has no visible user interface. Use this control to register a user and optionally add it to one or more security roles.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>AddUser</span><br />' +
                '<span>Email </span>' + this.Email + '<br />' +
                '<span>Username </span>' + this.Username + '<br />' +
                '<span>Password </span>' + this.Password + '<br />' +
                '<span>FirstName </span>' + this.FirstName + '<br />' +
                '<span>LastName </span>' + this.LastName + '<br />' +
                '<span>RoleNames </span>' + this.RoleNames + '<br />' +
                '<span>Approved </span>' + this.Approved;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Email = $ctl.attr("Email");
        this.Username = $ctl.attr("Username");
        this.Password = $ctl.attr("Password");
        this.FirstName = $ctl.attr("FirstName");
        this.LastName = $ctl.attr("LastName");
        this.DisplayName = $ctl.attr("DisplayName");
        this.Street = $ctl.attr("Street");
        this.Unit = $ctl.attr("Unit");
        this.City = $ctl.attr("City");
        this.Region = $ctl.attr("Region");
        this.PostalCode = $ctl.attr("PostalCode");
        this.Country = $ctl.attr("Country");
        this.Telephone = $ctl.attr("Telephone");
        this.RoleNames = $ctl.attr("RoleNames");
        this.Approved = $ctl.attr("Approved");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Email) sOut += ' Email="' + this.Email + '"';
        if (this.Username) sOut += ' Username="' + this.Username + '"';
        if (this.Password) sOut += ' Password="' + this.Password + '"';
        if (this.FirstName) sOut += ' FirstName="' + this.FirstName + '"';
        if (this.LastName) sOut += ' LastName="' + this.LastName + '"';
        if (this.DisplayName) sOut += ' DisplayName="' + this.DisplayName + '"';
        if (this.Approved) sOut += ' Approved="' + this.Approved + '"';
        if (this.Street) sOut += ' Street="' + this.Street + '"';
        if (this.Unit) sOut += ' Unit="' + this.Unit + '"';
        if (this.City) sOut += ' City="' + this.City + '"';
        if (this.Region) sOut += ' Region="' + this.Region + '"';
        if (this.PostalCode) sOut += ' PostalCode="' + this.PostalCode + '"';
        if (this.Country) sOut += ' Country="' + this.Country + '"';
        if (this.Telephone) sOut += ' Telephone="' + this.Telephone + '"';
        if (this.RoleNames) sOut += ' RoleNames="' + this.RoleNames + '"';
        sOut += '>';
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Email", "designer-adduser-email required") +
            ctlUtils.CreateTextInput("Username", "designer-adduser-username required") +
            ctlUtils.CreateTextInput("Password", "designer-adduser-password required") +
            ctlUtils.CreateTextInput("First Name", "designer-adduser-firstname required") +
            ctlUtils.CreateTextInput("Last Name", "designer-adduser-lastname required") +
            ctlUtils.CreateTextInput("Display Name", "designer-adduser-displayname") +
            ctlUtils.CreateTextInput("Street", "designer-adduser-street") +
            ctlUtils.CreateTextInput("Unit", "designer-adduser-unit") +
            ctlUtils.CreateTextInput("City", "designer-adduser-city") +
            ctlUtils.CreateTextInput("Region", "designer-adduser-region") +
            ctlUtils.CreateTextInput("Postal Code", "designer-adduser-postalcode") +
            ctlUtils.CreateTextInput("Country", "designer-adduser-country") +
            ctlUtils.CreateTextInput("Telephone", "designer-adduser-telephone") +
            ctlUtils.CreateTextInput("Add to Roles", "designer-adduser-rolenames") +
            ctlUtils.CreateCheckbox("Approved", "designer-adduser-approved");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-adduser-email').val(this.Email);
        designer.find('.designer-adduser-username').val(this.Username);
        designer.find('.designer-adduser-password').val(this.Password);
        designer.find('.designer-adduser-firstname').val(this.FirstName);
        designer.find('.designer-adduser-lastname').val(this.LastName);
        designer.find('.designer-adduser-displayname').val(this.DisplayName);
        designer.find('.designer-adduser-street').val(this.Street);
        designer.find('.designer-adduser-unit').val(this.Unit);
        designer.find('.designer-adduser-city').val(this.City);
        designer.find('.designer-adduser-region').val(this.Region);
        designer.find('.designer-adduser-postalcode').val(this.PostalCode);
        designer.find('.designer-adduser-country').val(this.Country);
        designer.find('.designer-adduser-telephone').val(this.Telephone);
        designer.find('.designer-adduser-rolenames').val(this.RoleNames);
        designer.find('.designer-adduser-approved').get(0).checked = this.Approved;
    }
    this.LoadFromDesigner = function (designer) {
        this.Email = designer.find('.designer-adduser-email').val();
        this.Username = designer.find('.designer-adduser-username').val();
        this.Password = designer.find('.designer-adduser-password').val();
        this.FirstName = designer.find('.designer-adduser-firstname').val();
        this.LastName = designer.find('.designer-adduser-lastname').val();
        this.DisplayName = designer.find('.designer-adduser-displayname').val();
        this.Street = designer.find('.designer-adduser-street').val();
        this.Unit = designer.find('.designer-adduser-unit').val();
        this.City = designer.find('.designer-adduser-city').val();
        this.Region = designer.find('.designer-adduser-region').val();
        this.PostalCode = designer.find('.designer-adduser-postalcode').val();
        this.Country = designer.find('.designer-adduser-country').val();
        this.Telephone = designer.find('.designer-adduser-telephone').val();
        this.RoleNames = designer.find('.designer-adduser-rolenames').val();
        this.Approved = designer.find('.designer-adduser-approved').get(0).checked;
    }
    if (node) this.ParseXml(node);
} // ctlAddUser

function ctlUpdateUser(node) {
    this.ID = null;
    this.Tag = "UpdateUser";
    this.Email = null;
    this.FirstName = null;
    this.LastName = null;
    this.DisplayName = null;
    this.OldPassword = null;
    this.NewPassword = null;
    this.Approved = null;
    this.Country = null;
    this.Street = null;
    this.City = null;
    this.Region = null;
    this.PostalCode = null;
    this.Unit = null;
    this.Telephone = null;
    this.UserId = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form 'action' that has no visible user interface. Use this control to update a previously registered user's profile data.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>UpdateUser</span><br />' +
                '<span>OldPassword</span>' + this.OldPassword + '<br />' +
                '<span>NewPassword </span>' + this.NewPassword + '<br />' +
                '<span>FirstName </span>' + this.FirstName + '<br />' +
                '<span>LastName </span>' + this.LastName + '<br />' +
                '<span>DisplayName </span>' + this.DisplayName + '<br />' +
                '<span>Email </span>' + this.Email + '<br />' +
                '<span>Country </span>' + this.Country + '<br />' +
                '<span>Street </span>' + this.Street + '<br />' +
                '<span>City </span>' + this.City + '<br />' +
                '<span>Region </span>' + this.Region + '<br />' +
                '<span>PostalCode </span>' + this.PostalCode + '<br />' +
                '<span>Unit </span>' + this.Unit + '<br />' +
                '<span>Telephone </span>' + this.Telephone + '<br />' +
                '<span>Approved </span>' + this.Approved;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Email = $ctl.attr("Email");
        this.OldPassword = $ctl.attr("OldPassword");
        this.NewPassword = $ctl.attr("NewPassword");
        this.FirstName = $ctl.attr("FirstName");
        this.LastName = $ctl.attr("LastName");
        this.DisplayName = $ctl.attr("DisplayName");
        this.Street = $ctl.attr("Street");
        this.Unit = $ctl.attr("Unit");
        this.City = $ctl.attr("City");
        this.Region = $ctl.attr("Region");
        this.PostalCode = $ctl.attr("PostalCode");
        this.Country = $ctl.attr("Country");
        this.Telephone = $ctl.attr("Telephone");
        this.Approved = $ctl.attr("Approved");
        this.UserId = $ctl.attr("UserId");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Email) sOut += ' Email="' + this.Email + '"';
        if (this.OldPassword) sOut += ' OldPassword="' + this.OldPassword + '"';
        if (this.NewPassword) sOut += ' NewPassword="' + this.NewPassword + '"';
        if (this.FirstName) sOut += ' FirstName="' + this.FirstName + '"';
        if (this.LastName) sOut += ' LastName="' + this.LastName + '"';
        if (this.DisplayName) sOut += ' DisplayName="' + this.DisplayName + '"';
        if (this.Approved) sOut += ' Approved="' + this.Approved + '"';
        if (this.Street) sOut += ' Street="' + this.Street + '"';
        if (this.Unit) sOut += ' Unit="' + this.Unit + '"';
        if (this.City) sOut += ' City="' + this.City + '"';
        if (this.Region) sOut += ' Region="' + this.Region + '"';
        if (this.PostalCode) sOut += ' PostalCode="' + this.PostalCode + '"';
        if (this.Country) sOut += ' Country="' + this.Country + '"';
        if (this.Telephone) sOut += ' Telephone="' + this.Telephone + '"';
        if (this.UserId) sOut += ' UserId="' + this.UserId + '"';
        sOut += '>';
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("User ID", "designer-updateuser-userid") +
            ctlUtils.CreateTextInput("Old Password", "designer-updateuser-oldpassword") +
            ctlUtils.CreateTextInput("New Password", "designer-updateuser-newpassword") +
            ctlUtils.CreateTextInput("First Name", "designer-updateuser-firstname required") +
            ctlUtils.CreateTextInput("Last Name", "designer-updateuser-lastname required") +
            ctlUtils.CreateTextInput("Display Name", "designer-updateuser-displayname") +
            ctlUtils.CreateTextInput("Email", "designer-updateuser-email required") +
            ctlUtils.CreateTextInput("Street", "designer-updateuser-street") +
            ctlUtils.CreateTextInput("Unit", "designer-updateuser-unit") +
            ctlUtils.CreateTextInput("City", "designer-updateuser-city") +
            ctlUtils.CreateTextInput("Region", "designer-updateuser-region") +
            ctlUtils.CreateTextInput("Postal Code", "designer-updateuser-postalcode") +
            ctlUtils.CreateTextInput("Country", "designer-updateuser-country") +
            ctlUtils.CreateTextInput("Telephone", "designer-updateuser-telephone") +
            ctlUtils.CreateCheckbox("Approved", "designer-updateuser-approved");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-updateuser-userid').val(this.UserId);
        designer.find('.designer-updateuser-oldpassword').val(this.OldPassword);
        designer.find('.designer-updateuser-newpassword').val(this.NewPassword);
        designer.find('.designer-updateuser-firstname').val(this.FirstName);
        designer.find('.designer-updateuser-lastname').val(this.LastName);
        designer.find('.designer-updateuser-displayname').val(this.DisplayName);
        designer.find('.designer-updateuser-email').val(this.Email);
        designer.find('.designer-updateuser-street').val(this.Street);
        designer.find('.designer-updateuser-unit').val(this.Unit);
        designer.find('.designer-updateuser-city').val(this.City);
        designer.find('.designer-updateuser-region').val(this.Region);
        designer.find('.designer-updateuser-postalcode').val(this.PostalCode);
        designer.find('.designer-updateuser-country').val(this.Country);
        designer.find('.designer-updateuser-telephone').val(this.Telephone);
        designer.find('.designer-updateuser-approved').get(0).checked = this.Approved;
    }
    this.LoadFromDesigner = function (designer) {
        this.UserId = designer.find('.designer-updateuser-userid').val();
        this.OldPassword = designer.find('.designer-updateuser-oldpassword').val();
        this.NewPassword = designer.find('.designer-updateuser-newpassword').val();
        this.FirstName = designer.find('.designer-updateuser-firstname').val();
        this.LastName = designer.find('.designer-updateuser-lastname').val();
        this.DisplayName = designer.find('.designer-updateuser-displayname').val();
        this.Email = designer.find('.designer-updateuser-email').val();
        this.Street = designer.find('.designer-updateuser-street').val();
        this.Unit = designer.find('.designer-updateuser-unit').val();
        this.City = designer.find('.designer-updateuser-city').val();
        this.Region = designer.find('.designer-updateuser-region').val();
        this.PostalCode = designer.find('.designer-updateuser-postalcode').val();
        this.Country = designer.find('.designer-updateuser-country').val();
        this.Telephone = designer.find('.designer-updateuser-telephone').val();
        this.Approved = designer.find('.designer-updateuser-approved').get(0).checked;
    }
    if (node) this.ParseXml(node);
} // ctlUpdateUser

function ctlAction(node) {
    this.ID = null;
    this.Tag = "Action";
    this.Assembly = null;
    this.Namespace = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form 'action' that has no visible user interface. Use this control to execute a custom action.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>Action</span><br />' +
                '<span>Assembly </span>' + this.Assembly + '<br />' +
                '<span>Namespace </span>' + this.Namespace;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Assembly = $ctl.attr("Assembly");
        this.Namespace = $ctl.attr("Namespace");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Assembly) sOut += ' Assembly="' + this.Assembly + '"';
        if (this.Namespace) sOut += ' Namespace="' + this.Namespace + '">';
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Assembly", "designer-action-assembly required") +
            ctlUtils.CreateTextInput("Namespace", "designer-action-namespace required");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-action-assembly').val(this.Assembly);
        designer.find('.designer-action-namespace').val(this.Namespace);
    }
    this.LoadFromDesigner = function (designer) {
        this.Assembly = designer.find('.designer-action-assembly').val();
        this.Namespace = designer.find('.designer-action-namespace').val();
    }
    if (node) this.ParseXml(node);
} // ctlAction

function ctlLogin(node) {
    this.ID = null;
    this.Tag = "Login";
    this.Username = null;
    this.Password = null;
    this.UserIdField = null;
    this.UsernameField = null;
    this.FirstNameField = null;
    this.LastNameField = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form 'action' that has no visible user interface. Use this control to log a user into the DNN site";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>Login</span><br />' +
                '<span>Username </span>' + this.Username + '<br />' +
                '<span>Password </span>' + this.Method;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Username = $ctl.attr("Username");
        this.Password = $ctl.attr("Password");
        this.UserIdField = $ctl.attr("UserIdField");
        this.UsernameField = $ctl.attr("UsernameField");
        this.FirstNameField = $ctl.attr("FirstNameField");
        this.LastNameField = $ctl.attr("LastNameField");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Username) sOut += ' Username="' + this.Username + '"';
        if (this.Password) sOut += ' Password="' + this.Password + '"';
        if (this.UserIdField) sOut += ' UserIdField="' + this.UserIdField + '"';
        if (this.UsernameField) sOut += ' UsernameField="' + this.UsernameField + '"';
        if (this.FirstNameField) sOut += ' FirstNameField="' + this.FirstNameField + '"';
        if (this.LastNameField) sOut += ' LastNameField="' + this.LastNameField + '"';
        sOut += ' />\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Username", "designer-login-username required") +
            ctlUtils.CreateTextInput("Password", "designer-login-password required") +
            ctlUtils.CreateTextInput("UserIdField", "designer-login-useridfield") +
            ctlUtils.CreateTextInput("UsernameField", "designer-login-usernamefield") +
            ctlUtils.CreateTextInput("FirstNameField", "designer-login-firstnamefield") +
            ctlUtils.CreateTextInput("LastNameField", "designer-login-lastnamefield");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-login-username').val(this.Username);
        designer.find('.designer-login-password').val(this.Password);
        designer.find('.designer-login-useridfield').val(this.UserIdField);
        designer.find('.designer-login-usernamefield').val(this.UsernameField);
        designer.find('.designer-login-firstnamefield').val(this.FirstNameField);
        designer.find('.designer-login-lastnamefield').val(this.LastNameField);
    }
    this.LoadFromDesigner = function (designer) {
        this.Username = designer.find('.designer-login-username').val();
        this.Password = designer.find('.designer-login-password').val();
        this.UserIdField = designer.find('.designer-login-useridfield').val();
        this.UsernameField = designer.find('.designer-login-usernamefield').val();
        this.FirstNameField = designer.find('.designer-login-firstnamefield').val();
        this.LastNameField = designer.find('.designer-login-lastnamefield').val();
    }
    if (node) this.ParseXml(node);
} // ctlLogin

function ctlRedirect(node) {
    this.ID = null;
    this.Tag = "Redirect";
    this.Method = null;
    this.Target = null;
    this.If = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form 'action' that has no visible user interface. Use this control to send the user to the specified URL";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>Redirect</span><br />' +
                '<span>If </span>' + this.If + '<br />' +
                '<span>Target URL </span>' + this.Target + '<br />' +
                '<span>Method </span>' + this.Method;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Method = $ctl.attr("Method");
        this.Target = $ctl.attr("Target");
        this.If = $ctl.attr("If");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.If) sOut += ' If="' + this.If + '"';
        if (this.Method) sOut += ' Method="' + this.Method + '"';
        if (this.Target) sOut += ' Target="' + this.Target + '">';
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Redirect If", "designer-redirect-if") +
            ctlUtils.CreateTextInput("Target URL", "designer-redirect-target required") +
            ctlUtils.CreateDropdown("Method", "designer-redirect-method", ["Get", "Post"]);
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-redirect-if').val(this.If);
        designer.find('.designer-redirect-target').val(this.Target);
        designer.find('.designer-redirect-method').val(this.Method);
    }
    this.LoadFromDesigner = function (designer) {
        this.If = designer.find('.designer-redirect-if').val();
        this.Target = designer.find('.designer-redirect-target').val();
        this.Method = designer.find('.designer-redirect-method').val();
    }
    if (node) this.ParseXml(node);
} // ctlRedirect

function ctlRegister(node) {
    this.ID = null;
    this.Tag = "Register";
    this.Assembly = null;
    this.Namespace = null;
    this.TagPrefix = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form control that has no visible user interface. Use this control to " +
                     "include a control library (DLL) in the form so its controls can be used.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>Register</span><br />' +
                '<span>Assembly </span>' + this.Assembly + '<br />' +
                '<span>Namespace </span>' + this.Namespace + '<br />' +
                '<span>Tag Prefix </span>' + this.TagPrefix;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Assembly = $ctl.attr("Assembly");
        this.Namespace = $ctl.attr("Namespace");
        this.TagPrefix = $ctl.attr("TagPrefix");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Assembly) sOut += ' Assembly="' + this.Assembly + '"';
        if (this.Namespace) sOut += ' Namespace="' + this.Namespace + '"';
        if (this.TagPrefix) sOut += ' TagPrefix="' + this.TagPrefix + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Assembly", "designer-register-assembly required") +
                ctlUtils.CreateTextInput("Namespace", "designer-register-namespace required") +
                ctlUtils.CreateTextInput("Tag Prefix", "designer-register-tagprefix required");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-action-assembly').val(this.Assembly);
        designer.find('.designer-action-namespace').val(this.Namespace);
        designer.find('.designer-action-tagprefix').val(this.TagPrefix);
    }
    this.LoadFromDesigner = function (designer) {
        this.Assembly = designer.find('.designer-action-assembly').val();
        this.Namespace = designer.find('.designer-action-namespace').val();
        this.TagPrefix = designer.find('.designer-action-tagprefix').val();
    }
    if (node) this.ParseXml(node);
} //ctlRegister

function ctlSilentPost(node) {
    this.ID = null;
    this.Tag = "SilentPost";
    this.Url = null;
    this.Fields = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A form 'action' that has no visible user interface. Use this control to send an HTTP POST request to the specified URL";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>SilentPost</span><br />' +
                '<span>URL </span>' + this.Url;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Url = $ctl.attr("Url");
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.If) sOut += ' If="' + this.If + '"';
        if (this.Target) sOut += ' Target="' + this.Target + '">';
        if (this.Fields) {
            sOut += '\n';
            for (var i = 0; i < this.Fields.length; i++) {
                sOut += this.Fields[i].GetXml(indent + '  ') + '\n';
            }
        }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("SilentPost If", "designer-silentpost-if") +
            ctlUtils.CreateTextInput("Target URL", "designer-silentpost-target required") +
            ctlUtils.CreateFieldEditor("Fields", "designer-fields");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-silentpost-if').val(this.If);
        designer.find('.designer-silentpost-target').val(this.Target);
        var lstItems = '';
        if (this.Fields) {
            for (var i = 0; i < this.Fields.length; i++) {
                lstItems += '<option value="' + this.Fields[i].Value + '">' + this.Fields[i].Name + '</option>';
            }
        }
        designer.find('.designer-fields').html('').append(lstItems);
    }
    this.LoadFromDesigner = function (designer) {
        this.If = designer.find('.designer-silentpost-if').val();
        this.Target = designer.find('.designer-silentpost-target').val();
        var newFields = new Array;
        designer.find('.designer-fields select option').each(function () {
            var $opt = jQuery(this);
            var fld = new Field($opt.text(), $opt.val());
            newFields.push(fld);
        });
        this.Fields = null;
        this.Fields = newFields;
    }
    if (node) this.ParseXml(node);
} // ctlSilentPost

function ctljQueryReady(node) {
    this.ID = null;
    this.Tag = "jQueryReady";
    this.Script = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A 'utility' control that has no visible user interface. Use this control to " +
                     "inject Javascript that will run only when the DOM is available";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>jQueryReady</span><br />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Script = $ctl.text();
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        var bNoIndent = (indent === 0);
        //if (!indent) { indent = '      '; }
        indent = '';
        var sOut = indent + '<' + this.Tag + '>\n';
        // special accommodation - need CDATA for form builder. Remove for text editor
        var sScript = (this.Script) ? this.Script : '';
        if (bNoIndent) { sOut += sScript; }
        else { sOut += indent + '<![CDATA[' + sScript + ']]>'; }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextArea("Script Content", "designer-jqueryready-script");
    }
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-jqueryready-script').val(this.Script);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.Script = designer.find('.designer-jqueryready-script').val();
    }
    if (node) this.ParseXml(node);
}

function ctlScriptBlock(node) {
    this.ID = null;
    this.Tag = "ScriptBlock";
    this.ScriptId = null;
    this.BlockType = "ClientScript";
    this.RegisterOnce = null;
    this.Url = null;
    this.Script = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A 'utility' control that has no visible user interface. Use this control to " +
                     "inject Javascript or CSS into your page";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>ScriptBlock</span><br />' +
                '<span>ScriptId </span>' + this.ScriptId + '<br />' +
                '<span>BlockType </span>' + this.BlockType;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.ScriptId = $ctl.attr("ScriptId");
        this.BlockType = $ctl.attr("BlockType");
        this.RegisterOnce = $ctl.attr("RegisterOnce");
        this.Url = $ctl.attr("Url");
        this.Script = $ctl.text();
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        var bNoIndent = (indent === 0);
        //if (!indent) { indent = '      '; }
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.ScriptId) sOut += ' ScriptId="' + this.ScriptId + '"';
        if (this.BlockType) {
            sOut += ' BlockType="' + this.BlockType + '"';
        } else {
            sOut += ' BlockType="ClientScript"';
        }
        if (this.RegisterOnce) sOut += ' RegisterOnce="' + this.RegisterOnce + '"';
        if (this.Url) sOut += ' Url="' + this.Url + '"';
        sOut += '>\n';
        // special accommodation - need CDATA for form builder. Remove for text editor
        var sScript = (this.Script) ? this.Script : '';
        if (bNoIndent) { sOut += sScript; }
        else { sOut += indent + '<![CDATA[' + sScript + ']]>'; }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("ScriptId", "designer-scriptblock-scriptid") +
           ctlUtils.CreateDropdown("BlockType", "designer-scriptblock-blocktype",
                ["HeadScript", "ClientScript", "ClientScriptInclude", "StartupScript"]) +
           ctlUtils.CreateCheckbox("Register Once", "designer-scriptblock-registeronce") +
           ctlUtils.CreateTextInput("Url", "designer-scriptblock-url") +
           ctlUtils.CreateTextArea("Script Content", "designer-scriptblock-script");
    }
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-scriptblock-scriptid').val(this.ScriptId);
        designer.find('.designer-scriptblock-blocktype').val(this.BlockType);
        designer.find('.designer-scriptblock-registeronce').get(0).checked = (this.RegisterOnce);
        designer.find('.designer-scriptblock-url').val(this.Url);
        designer.find('.designer-scriptblock-script').val(this.Script);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ScriptId = designer.find('.designer-scriptblock-scriptid').val();
        this.BlockType = designer.find('.designer-scriptblock-blocktype').val();
        this.RegisterOnce = designer.find('.designer-scriptblock-registeronce').get(0).checked;
        this.Url = designer.find('.designer-scriptblock-url').val();
        this.Script = designer.find('.designer-scriptblock-script').val();
    }
    if (node) this.ParseXml(node);
}

function ctlControlDataSource(node) {
    this.ID = null;
    this.Tag = "ControlDataSource";
    this.ConnectionString = null; // if null or empty, then 'dnn' is assumed
    this.TableName = null; // name of table or view to retrieve columns from
    this.Columns = null;
    this.SortBy = null;
    this.SortOrder = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A 'utility' control that has no visible user interface. Use this control to bind other controls to a data source.";
    this.GetDesignerHtml = function () {
        var cols = '';
        if (this.Columns) {
            cols = '<span>Columns: </span>' + this.Columns.join(",");
        }
        var sHtml = '<span>Control Data Source</span><br />' +
                '<span>ID: </span>' + this.ID + '<br />' +
                cols;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.ID = $ctl.attr("Id");
        this.ConnectionString = ($ctl.attr("ConnectionString")) ? $ctl.attr("ConnectionString") : null;
        this.TableName = $ctl.attr("TableName");
        // get columns
        var col = null;
        var arrCols = new Array;
        if ($ctl.attr("Columns")) { arrCols = $ctl.attr("Columns").split(","); }
        this.Columns = arrCols;
        this.SortBy = $ctl.attr("SortBy") || null;
        this.SortOrder = $ctl.attr("SortOrder") || null;
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        //if (!indent) { indent = '      '; }
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.ConnectionString) sOut += ' ConnectionString="' + this.ConnectionString + '"';
        if (this.TableName) sOut += ' TableName="' + this.TableName + '"';
        if (this.Columns) {
            sOut += ' Columns="' + this.Columns.join(",") + '"';
        }
        if (this.SortBy) sOut += ' SortBy="' + this.SortBy + '"';
        if (this.SortOrder) sOut += ' SortOrder="' + this.SortOrder + '"';
        sOut += ' />\n';
        return sOut;
    };
    this.GetFullTag = function () {
        // returns the generated SQL and the full tag code
        var sOut = '<' + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.ConnectionString) sOut += ' ConnectionString="' + this.ConnectionString + '"';
        sOut += ' CommandText="' + ctlUtils.BuildSqlSelect(this.TableName, this.Columns, this.SortBy, this.SortOrder) + '"'
        sOut += ' />';
        return sOut;
    }
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput('ID', 'designer-id') +
               ctlUtils.CreateDataChooser();
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        var ds = designer.find('.designer-datachooser').dataChooser("getDataSettings");

        this.ConnectionString = ds.connectionString;
        if (this.ConnectionString == '') this.ConnectionString = null;
        this.TableName = ds.selectedTable;
        this.Columns = ds.selectedFields;
        this.SortBy = (ds.sortFields.length) ? ds.sortFields[0] : '';
        this.SortOrder = ds.sortOrder;
    }
    if (node) this.ParseXml(node);
}

function ctlSelectCommand(node) {
    this.ID = null;
    this.Tag = "SelectCommand";
    this.ConnectionString = null; // if null or empty, then 'dnn' is assumed
    this.TableName = null; // name of table or view to retrieve columns from
    this.Columns = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A 'utility' control that has no visible user interface. Use this control to load data into your form.";
    this.GetDesignerHtml = function () {
        var cols = '';
        if (this.Columns) {
            cols = '<span>Columns: </span>' + this.Columns.join(",");
        }
        var sHtml = '<span>Select Command</span><br />' +
                cols;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.ID = $ctl.attr("Id");
        this.ConnectionString = ($ctl.attr("ConnectionString")) ? $ctl.attr("ConnectionString") : null;
        this.TableName = $ctl.attr("TableName");
        // get columns
        var col = null;
        var arrCols = new Array;
        if ($ctl.attr("Columns")) { arrCols = $ctl.attr("Columns").split(","); }
        this.Columns = arrCols;
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        //if (!indent) { indent = '      '; }
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.ConnectionString) sOut += ' ConnectionString="' + this.ConnectionString + '"';
        if (this.TableName) sOut += ' TableName="' + this.TableName + '"';
        if (this.Columns) {
            sOut += ' Columns="' + this.Columns.join(",") + '"';
        }
        sOut += ' />\n';
        return sOut;
    };
    this.GetFullTag = function () {
        // returns the generated SQL and the full tag code
        var sOut = '<' + this.Tag;
        if (this.ConnectionString) sOut += ' ConnectionString="' + this.ConnectionString + '"';
        sOut += ' CommandText="' + ctlUtils.BuildSqlSelect(this.TableName, this.Columns) + '"'
        sOut += ' />';
        return sOut;
    }
    this.PropertySheet = function () {
        return ctlUtils.CreateDataChooser();
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-id').val(this.ID);
        // hide all controls that shouldn't be shown yet
        designer.find('div').hide();
        designer.find('div:eq(0)').show();
        designer.find('div:eq(1)').show();
        if (this.ConnectionString) {
            designer.find('.designer-datasource').val('ext');
            designer.find('.designer-connectionstring').val(this.ConnectionString);
            designer.find('div:eq(2)').show();
        } else {
            designer.find('.designer-datasource').val('dnn');
            designer.find('.designer-connectionstring').val('');
        }
        // get list of tables
        var me = this;
        getTables(true, this.ConnectionString,
      function (data) {
          var tableList = designer.find('.designer-tables');
          tableList.html('<option value=""></option>').append(data);
          // try to pre-select and then load columns, pre-selecting them
          tableList.val(me.TableName);
          tableList.parent().show();
          if (me.TableName) {
              getColumns(me.TableName, this.ConnectionString, true,
            function (data) {
                var colList = designer.find('.designer-columns');
                colList.html('').append(data);
                colList.parent().show();
                if (me.Columns) {
                    colList.val(me.Columns);
                }
            },
            function (xhr, textStatus, errorThrown) {
                kbxmShowDialog(xhr.responseText, "Error", [180, 125]);
            });
          }
      },
      function (xhr, textStatus, errorThrown) {
          kbxmShowDialog(xhr.responseText, "Error", [180, 125]);
      });
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-id').val();
        var ds = designer.find('.designer-datachooser').dataChooser("getDataSettings");

        this.ConnectionString = ds.connectionString;
        if (this.ConnectionString == '') this.ConnectionString = null;
        this.TableName = ds.selectedTable;
        this.Columns = ds.selectedFields;
        this.SortBy = (ds.sortFields.length) ? ds.sortFields[0] : '';
        this.SortOrder = ds.sortOrder;
    }
    if (node) this.ParseXml(node);
}

function ctlSubmitCommand(node) {
    this.ID = null;
    this.Tag = "SubmitCommand";
    this.ConnectionString = null; // if null or empty, then 'dnn' is assumed
    this.TableName = null; // name of table or view to retrieve columns from
    this.Columns = null;
    this.KeyFields = new Array; 
    this.QueryType = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "A 'utility' control that has no visible user interface. Use this control to send data from your form to the database.";
    this.GetDesignerHtml = function () {
        var cols = '';
        if (this.Columns) {
            cols = '<span>Columns: </span>' + this.Columns.join(",");
        }
        var sHtml = '<span>Submit Command</span><br />' +
                cols;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.ID = $ctl.attr("Id");
        this.ConnectionString = ($ctl.attr("ConnectionString")) ? $ctl.attr("ConnectionString") : null;
        this.TableName = $ctl.attr("TableName");
        // get columns
        var col = null;
        var arrCols = new Array;
        if ($ctl.attr("Columns")) { arrCols = $ctl.attr("Columns").split(","); }
        this.Columns = arrCols;
    };
    // generate the XML that defines this control for use in re-creating the form later
    this.GetXml = function (indent) {
        //if (!indent) { indent = '      '; }
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.ConnectionString) sOut += ' ConnectionString="' + this.ConnectionString + '"';
        if (this.TableName) sOut += ' TableName="' + this.TableName + '"';
        if (this.Columns) {
            sOut += ' Columns="' + this.Columns.join(",") + '"';
        }
        sOut += ' />\n';
        return sOut;
    };
    this.GetFullTag = function () {
        // returns the generated SQL and the full tag code
        var sOut = '<' + this.Tag;
        if (this.ConnectionString) sOut += ' ConnectionString="' + this.ConnectionString + '"';
        sOut += ' CommandText="' 
        if (this.QueryType && this.QueryType == 'update') {
            sOut += ctlUtils.BuildSqlUpdate(this.TableName, this.Columns, this.KeyFields);
        } else {
            // for null, default to Insert.
            sOut += ctlUtils.BuildSqlInsert(this.TableName, this.Columns);
        } 
        sOut += '" />';
        return sOut;
    }
    this.PropertySheet = function () {
        return ctlUtils.CreateDropdown('Query Type', 'designer-query-type', ['Insert', 'Update'], ['insert', 'update']) + 
               ctlUtils.CreateDataChooser();
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-query-type').val('insert');
        // hide all controls that shouldn't be shown yet
        designer.find('div').hide();
        designer.find('div:eq(0)').show();
        designer.find('div:eq(1)').show();
        if (this.ConnectionString) {
            designer.find('.designer-datasource').val('ext');
            designer.find('.designer-connectionstring').val(this.ConnectionString);
            designer.find('div:eq(2)').show();
        } else {
            designer.find('.designer-datasource').val('dnn');
            designer.find('.designer-connectionstring').val('');
        }
        // get list of tables
        var me = this;
        getTables(true, this.ConnectionString,
      function (data) {
          var tableList = designer.find('.designer-tables');
          tableList.html('<option value=""></option>').append(data);
          // try to pre-select and then load columns, pre-selecting them
          tableList.val(me.TableName);
          tableList.parent().show();
          if (me.TableName) {
              getColumns(me.TableName, this.ConnectionString, true,
            function (data) {
                var colList = designer.find('.designer-columns');
                colList.html('').append(data);
                colList.parent().show();
                if (me.Columns) {
                    colList.val(me.Columns);
                }
            },
            function (xhr, textStatus, errorThrown) {
                kbxmShowDialog(xhr.responseText, "Error", [180, 125]);
            });
          }
      },
      function (xhr, textStatus, errorThrown) {
          kbxmShowDialog(xhr.responseText, "Error", [180, 125]);
      });
    }
    // function to load control properties from a tag designer form.
    this.LoadFromDesigner = function (designer) {
        var ds = designer.find('.designer-datachooser').dataChooser("getDataSettings");

        this.ConnectionString = ds.connectionString;
        if (this.ConnectionString == '') this.ConnectionString = null;
        this.TableName = ds.selectedTable;
        this.Columns = ds.selectedFields;
        this.KeyFields = ds.keyFields;
        this.QueryType = designer.find('.designer-query-type').val();
    }
    if (node) this.ParseXml(node);
}

function ctlAddButton(node) {
    this.ID = null;
    this.Tag = "AddButton";
    this.Text = "Add";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will submit the AddForm";
    this.GetDesignerHtml = function () {
        var sHtml = '<input type="button" value="' + this.Text + '" />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Add";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-addbutton-text") +
            ctlUtils.CreateTextInput("Height", "designer-addbutton-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-addbutton-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-addbutton-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-addbutton-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-addbutton-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-addbutton-text').val(this.Text);
        designer.find('.designer-addbutton-height').val(this.Height);
        designer.find('.designer-addbutton-width').val(this.Width);
        designer.find('.designer-addbutton-redirect').val(this.Redirect);
        designer.find('.designer-addbutton-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-addbutton-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-addbutton-text').val();
        this.Height = designer.find('.designer-addbutton-height').val();
        this.Width = designer.find('.designer-addbutton-width').val();
        this.Redirect = designer.find('.designer-addbutton-redirect').val();
        this.RedirectMethod = designer.find('.designer-addbutton-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-addbutton-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlAddButton
function ctlAddImage(node) {
    this.ID = null;
    this.Tag = "AddImage";
    this.AlternateText = "Add";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.ImageUrl = null;
    this.ImageAlign = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a clickable image that, when pressed, will submit the AddForm";
    this.GetDesignerHtml = function () {
        var style = '';
        if (this.ImageHeight || this.Width) {
            style = 'style="';
            style += (this.Height) ? this.Height + 'px;' : '';
            style += (this.Width) ? this.Width + 'px;' : '';
            style += '"';
        }
        var sHtml = '<input type="image" src="' + this.ImageUrl + '"';
        sHtml += (this.style) ? ' ' + style : '';
        sHtml += ' />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.AlternateText = ($ctl.attr("AlternateText")) ? $ctl.attr("AlternateText") : "Add";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
        this.ImageUrl = ($ctl.attr("ImageUrl")) ? $ctl.attr("ImageUrl") : null;
        this.ImageAlign = ($ctl.attr("ImageAlign")) ? $ctl.attr("ImageAlign") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.AlternateText) sOut += ' AlternateText="' + this.AlternateText + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.ImageUrl) sOut += ' ImageUrl="' + this.ImageUrl + '"';
        if (this.ImageAlign) sOut += ' ImageAlign="' + this.ImageAlign + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Alternate Text", "designer-addimage-alternatetext") +
            ctlUtils.CreateTextInput("Image URL", "designer-addimage-imageurl") +
            ctlUtils.CreateDropdown("Image Align", "designer-addimage-imagealign",
                ["", "Left", "Right", "Baseline", "Top", "Middle", "Bottom", "AbsBottom", "AbsMiddle", "TextTop"]) +
            ctlUtils.CreateTextInput("Height", "designer-addimage-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-addimage-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-addimage-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-addimage-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-addimage-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-addimage-alternatetext').val(this.AlternateText);
        designer.find('.designer-addimage-imageurl').val(this.ImageUrl);
        designer.find('.designer-addimage-imagealign').val(this.ImageAlign);
        designer.find('.designer-addimage-height').val(this.Height);
        designer.find('.designer-addimage-width').val(this.Width);
        designer.find('.designer-addimage-redirect').val(this.Redirect);
        designer.find('.designer-addimage-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-addimage-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.AlternateText = designer.find('.designer-addimage-alternatetext').val();
        this.ImageUrl = designer.find('.designer-addimage-imageurl').val();
        this.ImageAlign = designer.find('.designer-addimage-imagealign').val();
        this.Height = designer.find('.designer-addimage-height').val();
        this.Width = designer.find('.designer-addimage-width').val();
        this.Redirect = designer.find('.designer-addimage-redirect').val();
        this.RedirectMethod = designer.find('.designer-addimage-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-addimage-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlAddImage
function ctlAddLink(node) {
    this.ID = null;
    this.Tag = "AddLink";
    this.Text = "Add";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will submit the AddForm";
    this.GetDesignerHtml = function () {
        var sHtml = '<a href="#">' + this.Text + '</a>';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Add";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-addlink-text") +
            ctlUtils.CreateTextInput("Height", "designer-addlink-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-addlink-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-addlink-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-addlink-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-addlink-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-addlink-text').val(this.Text);
        designer.find('.designer-addlink-height').val(this.Height);
        designer.find('.designer-addlink-width').val(this.Width);
        designer.find('.designer-addlink-redirect').val(this.Redirect);
        designer.find('.designer-addlink-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-addlink-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-addlink-text').val();
        this.Height = designer.find('.designer-addlink-height').val();
        this.Width = designer.find('.designer-addlink-width').val();
        this.Redirect = designer.find('.designer-addlink-redirect').val();
        this.RedirectMethod = designer.find('.designer-addlink-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-addlink-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlAddLink

function ctlAjaxButton(node) {
    this.ID = null;
    this.Tag = "AjaxButton";
    this.Text = null;
    this.CssClass = null;
    this.Height = null;
    this.LoadingCssClass = null;
    this.LoadingImageUrl = null;
    this.OnError = null;
    this.OnSuccess = null;
    this.Target = null;
    this.Url = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when executes an AJAX call and insert the results into the page";
    this.GetDesignerHtml = function () {
        var sHtml = '<input type="button" value="' + this.Text + '" onclick="return false;" />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : null;
        this.CssClass = ($ctl.attr("CssClass")) ? $ctl.attr("CssClass") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.LoadingCssClass = ($ctl.attr("LoadingCssClass")) ? $ctl.attr("LoadingCssClass") : null;
        this.LoadingImageUrl = ($ctl.attr("LoadingImageUrl")) ? $ctl.attr("LoadingImageUrl") : null;
        this.OnError = ($ctl.attr("OnError")) ? $ctl.attr("OnError") : null;
        this.OnSuccess = ($ctl.attr("OnSuccess")) ? $ctl.attr("OnSuccess") : null;
        this.Target = ($ctl.attr("Target")) ? $ctl.attr("Target") : null;
        this.Url = ($ctl.attr("Url")) ? $ctl.attr("Url") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.CssClass) sOut += ' CssClass="' + this.CssClass + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.LoadingCssClass) sOut += ' LoadingCssClass="' + this.LoadingCssClass + '"';
        if (this.LoadingImageUrl) sOut += ' LoadingImageUrl="' + this.LoadingImageUrl + '"';
        if (this.OnError) sOut += ' OnError="' + this.OnError + '"';
        if (this.OnSuccess) sOut += ' OnSuccess="' + this.OnSuccess + '"';
        if (this.Target) sOut += ' Target="' + this.Target + '"';
        if (this.Url) sOut += ' Url="' + this.Url + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        var pre = "designer-ajaxbutton-";
        return ctlUtils.CreateTextInput("Text", pre + "text") +
            ctlUtils.CreateTextInput("Url", pre + "url") +
            ctlUtils.CreateTextInput("Target", pre + "target") +
            ctlUtils.CreateTextInput("Loading Image URL", pre + "loadingimageurl") +
            ctlUtils.CreateTextInput("Loading CSS Class", pre + "loadingcssclass") +
            ctlUtils.CreateTextInput("OnError", pre + "onerror") +
            ctlUtils.CreateTextInput("OnSuccess", pre + "onsuccess") +
            ctlUtils.CreateTextInput("Height", pre + "height alphanumeric") +
            ctlUtils.CreateTextInput("Width", pre + "width alphanumeric") +
            ctlUtils.CreateTextInput("CSS Class", pre + "cssclass alphanumeric");
    };
    this.LoadDesigner = function (designer, data) {
        var pre = ".designer-ajaxbutton-";
        // load values from data
        designer.find(pre + 'text').val(this.Text);
        designer.find(pre + 'url').val(this.Url);
        designer.find(pre + 'target').val(this.Target);
        designer.find(pre + 'loadingimageurl').val(this.LoadingImageUrl);
        designer.find(pre + 'loadingcssclass').val(this.LoadingCssClass);
        designer.find(pre + 'onerror').val(this.OnError);
        designer.find(pre + 'onsuccess').val(this.OnSuccess);
        designer.find(pre + 'height').val(this.Height);
        designer.find(pre + 'width').val(this.Width);
        designer.find(pre + 'cssclass').val(this.CssClass);
    }
    this.LoadFromDesigner = function (designer) {
        var pre = ".designer-ajaxbutton-";
        this.Text = designer.find(pre + 'text').val();
        this.Url = designer.find(pre + 'url').val();
        this.Target = designer.find(pre + 'target').val();
        this.LoadingImageUrl = designer.find(pre + 'loadingimageurl').val();
        this.LoadingCssClass = designer.find(pre + 'loadingcssclass').val();
        this.OnError = designer.find(pre + 'onerror').val();
        this.OnSuccess = designer.find(pre + 'onsuccess').val();
        this.Height = designer.find(pre + 'height').val();
        this.Width = designer.find(pre + 'width').val();
        this.CssClass = designer.find(pre + 'cssclass').val();
    }
    if (node) this.ParseXml(node);
} //ctlAjaxButton

function ctlAjaxImage(node) {
    this.ID = null;
    this.Tag = "AjaxImage";
    this.AlternateText = null;
    this.CssClass = null;
    this.Height = null;
    this.ImageUrl = null;
    this.LoadingCssClass = null;
    this.LoadingImageUrl = null;
    this.OnError = null;
    this.OnSuccess = null;
    this.Target = null;
    this.Url = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a clickable image that, when executes an AJAX call and insert the results into the page";
    this.GetDesignerHtml = function () {
        var style = '';
        if (this.Height || this.Width) {
            style = 'style="';
            style += (this.Height) ? this.Height + 'px;' : '';
            style += (this.Width) ? this.Width + 'px;' : '';
            style += '"';
        }
        var sHtml = '<input type="image" src="' + this.ImageUrl + '"';
        sHtml += (this.style) ? ' ' + style : '';
        sHtml += (this.AlternateText) ? ' ' + this.AlternateText : '';
        sHtml += ' onclick="return false;" />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.AlternateText = ($ctl.attr("AlternateText")) ? $ctl.attr("AlternateText") : null;
        this.CssClass = ($ctl.attr("CssClass")) ? $ctl.attr("CssClass") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.ImageUrl = ($ctl.attr("ImageUrl")) ? $ctl.attr("ImageUrl") : null;
        this.LoadingCssClass = ($ctl.attr("LoadingCssClass")) ? $ctl.attr("LoadingCssClass") : null;
        this.LoadingImageUrl = ($ctl.attr("LoadingImageUrl")) ? $ctl.attr("LoadingImageUrl") : null;
        this.OnError = ($ctl.attr("OnError")) ? $ctl.attr("OnError") : null;
        this.OnSuccess = ($ctl.attr("OnSuccess")) ? $ctl.attr("OnSuccess") : null;
        this.Target = ($ctl.attr("Target")) ? $ctl.attr("Target") : null;
        this.Url = ($ctl.attr("Url")) ? $ctl.attr("Url") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.AlternateText) sOut += ' AlternateText="' + this.AlternateText + '"';
        if (this.ImageUrl) sOut += ' ImageUrl="' + this.ImageUrl + '"';
        if (this.CssClass) sOut += ' CssClass="' + this.CssClass + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.LoadingCssClass) sOut += ' LoadingCssClass="' + this.LoadingCssClass + '"';
        if (this.LoadingImageUrl) sOut += ' LoadingImageUrl="' + this.LoadingImageUrl + '"';
        if (this.OnError) sOut += ' OnError="' + this.OnError + '"';
        if (this.OnSuccess) sOut += ' OnSuccess="' + this.OnSuccess + '"';
        if (this.Target) sOut += ' Target="' + this.Target + '"';
        if (this.Url) sOut += ' Url="' + this.Url + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        var pre = "designer-ajaximage-";
        return ctlUtils.CreateTextInput("AlternateText", pre + "alternatetext") +
            ctlUtils.CreateTextInput("Image Url", pre + "imageurl") +
            ctlUtils.CreateTextInput("Url", pre + "url") +
            ctlUtils.CreateTextInput("Target", pre + "target") +
            ctlUtils.CreateTextInput("Loading Image URL", pre + "loadingimageurl") +
            ctlUtils.CreateTextInput("Loading CSS Class", pre + "loadingcssclass") +
            ctlUtils.CreateTextInput("OnError", pre + "onerror") +
            ctlUtils.CreateTextInput("OnSuccess", pre + "onsuccess") +
            ctlUtils.CreateTextInput("Height", pre + "height alphanumeric") +
            ctlUtils.CreateTextInput("Width", pre + "width alphanumeric") +
            ctlUtils.CreateTextInput("CSS Class", pre + "cssclass alphanumeric");
    };
    this.LoadDesigner = function (designer, data) {
        var pre = ".designer-ajaximage-";
        // load values from data
        designer.find(pre + 'alternatetext').val(this.AlternateText);
        designer.find(pre + 'imageurl').val(this.ImageUrl);
        designer.find(pre + 'url').val(this.Url);
        designer.find(pre + 'target').val(this.Target);
        designer.find(pre + 'loadingimageurl').val(this.LoadingImageUrl);
        designer.find(pre + 'loadingcssclass').val(this.LoadingCssClass);
        designer.find(pre + 'onerror').val(this.OnError);
        designer.find(pre + 'onsuccess').val(this.OnSuccess);
        designer.find(pre + 'height').val(this.Height);
        designer.find(pre + 'width').val(this.Width);
        designer.find(pre + 'cssclass').val(this.CssClass);
    }
    this.LoadFromDesigner = function (designer) {
        var pre = ".designer-ajaximage-";
        this.AlternateText = designer.find(pre + 'text').val();
        this.ImageUrl = designer.find(pre + 'imageurl').val();
        this.Url = designer.find(pre + 'url').val();
        this.Target = designer.find(pre + 'target').val();
        this.LoadingImageUrl = designer.find(pre + 'loadingimageurl').val();
        this.LoadingCssClass = designer.find(pre + 'loadingcssclass').val();
        this.OnError = designer.find(pre + 'onerror').val();
        this.OnSuccess = designer.find(pre + 'onsuccess').val();
        this.Height = designer.find(pre + 'height').val();
        this.Width = designer.find(pre + 'width').val();
        this.CssClass = designer.find(pre + 'cssclass').val();
    }
    if (node) this.ParseXml(node);
} //ctlAjaxImage

function ctlAjaxLink(node) {
    this.ID = null;
    this.Tag = "AjaxLink";
    this.Text = null;
    this.CssClass = null;
    this.Height = null;
    this.LoadingCssClass = null;
    this.LoadingImageUrl = null;
    this.OnError = null;
    this.OnSuccess = null;
    this.Target = null;
    this.Url = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a hyperlink that, when executes an AJAX call and insert the results into the page";
    this.GetDesignerHtml = function () {
        var sHtml = '<a href="#">' + this.Text + '</a>';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : null;
        this.CssClass = ($ctl.attr("CssClass")) ? $ctl.attr("CssClass") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.LoadingCssClass = ($ctl.attr("LoadingCssClass")) ? $ctl.attr("LoadingCssClass") : null;
        this.LoadingImageUrl = ($ctl.attr("LoadingImageUrl")) ? $ctl.attr("LoadingImageUrl") : null;
        this.OnError = ($ctl.attr("OnError")) ? $ctl.attr("OnError") : null;
        this.OnSuccess = ($ctl.attr("OnSuccess")) ? $ctl.attr("OnSuccess") : null;
        this.Target = ($ctl.attr("Target")) ? $ctl.attr("Target") : null;
        this.Url = ($ctl.attr("Url")) ? $ctl.attr("Url") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.CssClass) sOut += ' CssClass="' + this.CssClass + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.LoadingCssClass) sOut += ' LoadingCssClass="' + this.LoadingCssClass + '"';
        if (this.LoadingImageUrl) sOut += ' LoadingImageUrl="' + this.LoadingImageUrl + '"';
        if (this.OnError) sOut += ' OnError="' + this.OnError + '"';
        if (this.OnSuccess) sOut += ' OnSuccess="' + this.OnSuccess + '"';
        if (this.Target) sOut += ' Target="' + this.Target + '"';
        if (this.Url) sOut += ' Url="' + this.Url + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        var pre = "designer-ajaxlink-";
        return ctlUtils.CreateTextInput("Text", pre + "text") +
            ctlUtils.CreateTextInput("Url", pre + "url") +
            ctlUtils.CreateTextInput("Target", pre + "target") +
            ctlUtils.CreateTextInput("Loading Image URL", pre + "loadingimageurl") +
            ctlUtils.CreateTextInput("Loading CSS Class", pre + "loadingcssclass") +
            ctlUtils.CreateTextInput("OnError", pre + "onerror") +
            ctlUtils.CreateTextInput("OnSuccess", pre + "onsuccess") +
            ctlUtils.CreateTextInput("Height", pre + "height alphanumeric") +
            ctlUtils.CreateTextInput("Width", pre + "width alphanumeric") +
            ctlUtils.CreateTextInput("CSS Class", pre + "cssclass alphanumeric");
    };
    this.LoadDesigner = function (designer, data) {
        var pre = ".designer-ajaxlink-";
        // load values from data
        designer.find(pre + 'text').val(this.Text);
        designer.find(pre + 'url').val(this.Url);
        designer.find(pre + 'target').val(this.Target);
        designer.find(pre + 'loadingimageurl').val(this.LoadingImageUrl);
        designer.find(pre + 'loadingcssclass').val(this.LoadingCssClass);
        designer.find(pre + 'onerror').val(this.OnError);
        designer.find(pre + 'onsuccess').val(this.OnSuccess);
        designer.find(pre + 'height').val(this.Height);
        designer.find(pre + 'width').val(this.Width);
        designer.find(pre + 'cssclass').val(this.CssClass);
    }
    this.LoadFromDesigner = function (designer) {
        var pre = ".designer-ajaxlink-";
        this.Text = designer.find(pre + 'text').val();
        this.Url = designer.find(pre + 'url').val();
        this.Target = designer.find(pre + 'target').val();
        this.LoadingImageUrl = designer.find(pre + 'loadingimageurl').val();
        this.LoadingCssClass = designer.find(pre + 'loadingcssclass').val();
        this.OnError = designer.find(pre + 'onerror').val();
        this.OnSuccess = designer.find(pre + 'onsuccess').val();
        this.Height = designer.find(pre + 'height').val();
        this.Width = designer.find(pre + 'width').val();
        this.CssClass = designer.find(pre + 'cssclass').val();
    }
    if (node) this.ParseXml(node);
} //ctlAjaxLink

function ctlUpdateButton(node) {
    this.ID = null;
    this.Tag = "UpdateButton";
    this.Text = "Update";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will submit the EditForm";
    this.GetDesignerHtml = function () {
        var sHtml = '<input type="button" value="' + this.Text + '" />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Add";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-updatebutton-text") +
            ctlUtils.CreateTextInput("Height", "designer-updatebutton-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-updatebutton-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-updatebutton-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-updatebutton-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-updatebutton-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-updatebutton-text').val(this.Text);
        designer.find('.designer-updatebutton-height').val(this.Height);
        designer.find('.designer-updatebutton-width').val(this.Width);
        designer.find('.designer-updatebutton-redirect').val(this.Redirect);
        designer.find('.designer-updatebutton-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-updatebutton-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-updatebutton-text').val();
        this.Height = designer.find('.designer-updatebutton-height').val();
        this.Width = designer.find('.designer-updatebutton-width').val();
        this.Redirect = designer.find('.designer-updatebutton-redirect').val();
        this.RedirectMethod = designer.find('.designer-updatebutton-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-updatebutton-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlUpdateButton
function ctlUpdateImage(node) {
    this.ID = null;
    this.Tag = "UpdateImage";
    this.AlternateText = "Update";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.ImageUrl = null;
    this.ImageAlign = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a clickable image that, when pressed, will submit the Update";
    this.GetDesignerHtml = function () {
        var style = '';
        if (this.ImageHeight || this.Width) {
            style = 'style="';
            style += (this.Height) ? this.Height + 'px;' : '';
            style += (this.Width) ? this.Width + 'px;' : '';
            style += '"';
        }
        var sHtml = '<input type="image" src="' + this.ImageUrl + '"';
        sHtml += (this.style) ? ' ' + style : '';
        sHtml += ' />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.AlternateText = ($ctl.attr("AlternateText")) ? $ctl.attr("AlternateText") : "Update";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
        this.ImageUrl = ($ctl.attr("ImageUrl")) ? $ctl.attr("ImageUrl") : null;
        this.ImageAlign = ($ctl.attr("ImageAlign")) ? $ctl.attr("ImageAlign") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.AlternateText) sOut += ' AlternateText="' + this.AlternateText + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.ImageUrl) sOut += ' ImageUrl="' + this.ImageUrl + '"';
        if (this.ImageAlign) sOut += ' ImageAlign="' + this.ImageAlign + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Alternate Text", "designer-updateimage-alternatetext") +
            ctlUtils.CreateTextInput("Image URL", "designer-updateimage-imageurl") +
            ctlUtils.CreateDropdown("Image Align", "designer-updateimage-imagealign",
                ["", "Left", "Right", "Baseline", "Top", "Middle", "Bottom", "AbsBottom", "AbsMiddle", "TextTop"]) +
            ctlUtils.CreateTextInput("Height", "designer-updateimage-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-updateimage-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-updateimage-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-updateimage-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-updateimage-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-updateimage-alternatetext').val(this.AlternateText);
        designer.find('.designer-updateimage-imageurl').val(this.ImageUrl);
        designer.find('.designer-updateimage-imagealign').val(this.ImageAlign);
        designer.find('.designer-updateimage-height').val(this.Height);
        designer.find('.designer-updateimage-width').val(this.Width);
        designer.find('.designer-updateimage-redirect').val(this.Redirect);
        designer.find('.designer-updateimage-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-updateimage-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.AlternateText = designer.find('.designer-updateimage-alternatetext').val();
        this.ImageUrl = designer.find('.designer-updateimage-imageurl').val();
        this.ImageAlign = designer.find('.designer-updateimage-imagealign').val();
        this.Height = designer.find('.designer-updateimage-height').val();
        this.Width = designer.find('.designer-updateimage-width').val();
        this.Redirect = designer.find('.designer-updateimage-redirect').val();
        this.RedirectMethod = designer.find('.designer-updateimage-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-updateimage-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlUpdateImage
function ctlUpdateLink(node) {
    this.ID = null;
    this.Tag = "UpdateLink";
    this.Text = "Update";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will submit the EditForm";
    this.GetDesignerHtml = function () {
        var sHtml = '<a href="#">' + this.Text + '</a>';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Update";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-updatelink-text") +
            ctlUtils.CreateTextInput("Height", "designer-updatelink-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-updatelink-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-updatelink-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-updatelink-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-updatelink-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-updatelink-text').val(this.Text);
        designer.find('.designer-updatelink-height').val(this.Height);
        designer.find('.designer-updatelink-width').val(this.Width);
        designer.find('.designer-updatelink-redirect').val(this.Redirect);
        designer.find('.designer-updatelink-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-updatelink-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-updatelink-text').val();
        this.Height = designer.find('.designer-updatelink-height').val();
        this.Width = designer.find('.designer-updatelink-width').val();
        this.Redirect = designer.find('.designer-updatelink-redirect').val();
        this.RedirectMethod = designer.find('.designer-updatelink-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-updatelink-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlUpdateLink

function ctlCancelButton(node) {
    this.ID = null;
    this.Tag = "CancelButton";
    this.Text = "Cancel";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will cancel the form";
    this.GetDesignerHtml = function () {
        var sHtml = '<input type="button" value="' + this.Text + '" />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Add";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-cancelbutton-text") +
            ctlUtils.CreateTextInput("Height", "designer-cancelbutton-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-cancelbutton-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-cancelbutton-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-cancelbutton-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-cancelbutton-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-cancelbutton-text').val(this.Text);
        designer.find('.designer-cancelbutton-height').val(this.Height);
        designer.find('.designer-cancelbutton-width').val(this.Width);
        designer.find('.designer-cancelbutton-redirect').val(this.Redirect);
        designer.find('.designer-cancelbutton-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-cancelbutton-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-cancelbutton-text').val();
        this.Height = designer.find('.designer-cancelbutton-height').val();
        this.Width = designer.find('.designer-cancelbutton-width').val();
        this.Redirect = designer.find('.designer-cancelbutton-redirect').val();
        this.RedirectMethod = designer.find('.designer-cancelbutton-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-cancelbutton-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlCancelButton
function ctlCancelImage(node) {
    this.ID = null;
    this.Tag = "CancelImage";
    this.AlternateText = "Cancel";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.ImageUrl = null;
    this.ImageAlign = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a clickable image that, when pressed, will cancel the Form";
    this.GetDesignerHtml = function () {
        var style = '';
        if (this.ImageHeight || this.Width) {
            style = 'style="';
            style += (this.Height) ? this.Height + 'px;' : '';
            style += (this.Width) ? this.Width + 'px;' : '';
            style += '"';
        }
        var sHtml = '<input type="image" src="' + this.ImageUrl + '"';
        sHtml += (this.style) ? ' ' + style : '';
        sHtml += ' />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.AlternateText = ($ctl.attr("AlternateText")) ? $ctl.attr("AlternateText") : "Cancel";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
        this.ImageUrl = ($ctl.attr("ImageUrl")) ? $ctl.attr("ImageUrl") : null;
        this.ImageAlign = ($ctl.attr("ImageAlign")) ? $ctl.attr("ImageAlign") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.AlternateText) sOut += ' AlternateText="' + this.AlternateText + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.ImageUrl) sOut += ' ImageUrl="' + this.ImageUrl + '"';
        if (this.ImageAlign) sOut += ' ImageAlign="' + this.ImageAlign + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Alternate Text", "designer-cancelimage-alternatetext") +
            ctlUtils.CreateTextInput("Image URL", "designer-cancelimage-imageurl") +
            ctlUtils.CreateDropdown("Image Align", "designer-cancelimage-imagealign",
                ["", "Left", "Right", "Baseline", "Top", "Middle", "Bottom", "AbsBottom", "AbsMiddle", "TextTop"]) +
            ctlUtils.CreateTextInput("Height", "designer-cancelimage-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-cancelimage-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-cancelimage-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-cancelimage-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-cancelimage-onclientclick");
    };
    this.LoCancelesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-cancelimage-alternatetext').val(this.AlternateText);
        designer.find('.designer-cancelimage-imageurl').val(this.ImageUrl);
        designer.find('.designer-cancelimage-imagealign').val(this.ImageAlign);
        designer.find('.designer-cancelimage-height').val(this.Height);
        designer.find('.designer-cancelimage-width').val(this.Width);
        designer.find('.designer-cancelimage-redirect').val(this.Redirect);
        designer.find('.designer-cancelimage-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-cancelimage-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.AlternateText = designer.find('.designer-cancelimage-alternatetext').val();
        this.ImageUrl = designer.find('.designer-cancelimage-imageurl').val();
        this.ImageAlign = designer.find('.designer-cancelimage-imagealign').val();
        this.Height = designer.find('.designer-cancelimage-height').val();
        this.Width = designer.find('.designer-cancelimage-width').val();
        this.Redirect = designer.find('.designer-cancelimage-redirect').val();
        this.RedirectMethod = designer.find('.designer-cancelimage-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-cancelimage-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlCancelImage
function ctlCancelLink(node) {
    this.ID = null;
    this.Tag = "CancelLink";
    this.Text = "Cancel";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will cancel the Form";
    this.GetDesignerHtml = function () {
        var sHtml = '<a href="#">' + this.Text + '</a>';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Cancel";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-cancellink-text") +
            ctlUtils.CreateTextInput("Height", "designer-cancellink-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-cancellink-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-cancellink-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-cancellink-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-cancellink-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-cancellink-text').val(this.Text);
        designer.find('.designer-cancellink-height').val(this.Height);
        designer.find('.designer-cancellink-width').val(this.Width);
        designer.find('.designer-cancellink-redirect').val(this.Redirect);
        designer.find('.designer-cancellink-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-cancellink-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-cancellink-text').val();
        this.Height = designer.find('.designer-cancellink-height').val();
        this.Width = designer.find('.designer-cancellink-width').val();
        this.Redirect = designer.find('.designer-cancellink-redirect').val();
        this.RedirectMethod = designer.find('.designer-cancellink-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-cancellink-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlCancelLink

function ctlCalendarButton(node) {
    this.ID = null;
    this.Tag = "CalendarButton";
    this.Text = "Choose Date...";
    this.Format = null;
    this.Target = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will pop-up a Javascript date picker";
    this.GetDesignerHtml = function () {
        var sHtml = '<input type="button" value="' + this.Text + '" />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Choose Date...";
        this.Format = ($ctl.attr("Format")) ? $ctl.attr("Format") : null;
        this.Target = ($ctl.attr("Target")) ? $ctl.attr("Target") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Format) sOut += ' Format="' + this.Format + '"';
        if (this.Target) sOut += ' Target="' + this.Target + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-calendarbutton-text") +
           ctlUtils.CreateTextInput("Target Control", "designer-calendarbutton-target") +
           ctlUtils.CreateTextInput("Date Format", "designer-calendarbutton-format") +
           ctlUtils.CreateTextInput("Height", "designer-calendarbutton-height alphanumeric") +
           ctlUtils.CreateTextInput("Width", "designer-calendarbutton-width alphanumeric");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-calendarbutton-text').val(this.Text);
        designer.find('.designer-calendarbutton-height').val(this.Height);
        designer.find('.designer-calendarbutton-width').val(this.Width);
        designer.find('.designer-calendarbutton-format').val(this.Format);
        designer.find('.designer-calendarbutton-target').val(this.Target);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-calendarbutton-text').val();
        this.Height = designer.find('.designer-calendarbutton-height').val();
        this.Width = designer.find('.designer-calendarbutton-width').val();
        this.Format = designer.find('.designer-calendarbutton-format').val();
        this.Target = designer.find('.designer-calendarbutton-target').val();
    }
    if (node) this.ParseXml(node);
} //ctlCalendarButton
function ctlCalendarImage(node) {
    this.ID = null;
    this.Tag = "CalendarImage";
    this.AlternateText = "Choose Date";
    this.Format = null;
    this.Target = null;
    this.Height = null;
    this.Width = null;
    this.ImageUrl = null;
    this.ImageAlign = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a clickable image that, when pressed, will pop-up a Javascript date picker";
    this.GetDesignerHtml = function () {
        var style = '';
        if (this.ImageHeight || this.Width) {
            style = 'style="';
            style += (this.Height) ? this.Height + 'px;' : '';
            style += (this.Width) ? this.Width + 'px;' : '';
            style += '"';
        }
        var sHtml = '<input type="image" src="' + this.ImageUrl + '"';
        sHtml += (this.style) ? ' ' + style : '';
        sHtml += ' />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.AlternateText = ($ctl.attr("AlternateText")) ? $ctl.attr("AlternateText") : "Calendar";
        this.Format = ($ctl.attr("Format")) ? $ctl.attr("Format") : null;
        this.Target = ($ctl.attr("Target")) ? $ctl.attr("Target") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
        this.ImageUrl = ($ctl.attr("ImageUrl")) ? $ctl.attr("ImageUrl") : null;
        this.ImageAlign = ($ctl.attr("ImageAlign")) ? $ctl.attr("ImageAlign") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.AlternateText) sOut += ' AlternateText="' + this.AlternateText + '"';
        if (this.Format) sOut += ' Format="' + this.Format + '"';
        if (this.Target) sOut += ' Target="' + this.Target + '"';
        if (this.ImageUrl) sOut += ' ImageUrl="' + this.ImageUrl + '"';
        if (this.ImageAlign) sOut += ' ImageAlign="' + this.ImageAlign + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Alternate Text", "designer-calendarimage-alternatetext") +
            ctlUtils.CreateTextInput("Image URL", "designer-calendarimage-imageurl") +
            ctlUtils.CreateDropdown("Image Align", "designer-calendarimage-imagealign",
                ["", "Left", "Right", "Baseline", "Top", "Middle", "Bottom", "AbsBottom", "AbsMiddle", "TextTop"]) +
            ctlUtils.CreateTextInput("Height", "designer-calendarimage-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-calendarimage-width alphanumeric") +
            ctlUtils.CreateTextInput("Date Format", "designer-calendarimage-format") +
            ctlUtils.CreateTextInput("Target Control", "designer-calendarimage-target");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-calendarimage-alternatetext').val(this.AlternateText);
        designer.find('.designer-calendarimage-imageurl').val(this.ImageUrl);
        designer.find('.designer-calendarimage-imagealign').val(this.ImageAlign);
        designer.find('.designer-calendarimage-height').val(this.Height);
        designer.find('.designer-calendarimage-width').val(this.Width);
        designer.find('.designer-calendarimage-format').val(this.Format);
        designer.find('.designer-calendarimage-target').val(this.Target);
    }
    this.LoadFromDesigner = function (designer) {
        this.AlternateText = designer.find('.designer-calendarimage-alternatetext').val();
        this.ImageUrl = designer.find('.designer-calendarimage-imageurl').val();
        this.ImageAlign = designer.find('.designer-calendarimage-imagealign').val();
        this.Height = designer.find('.designer-calendarimage-height').val();
        this.Width = designer.find('.designer-calendarimage-width').val();
        this.Format = designer.find('.designer-calendarimage-format').val();
        this.Target = designer.find('.designer-calendarimage-target').val();
    }
    if (node) this.ParseXml(node);
} //ctlCalendarImage
function ctlCalendarLink(node) {
    this.ID = null;
    this.Tag = "CalendarLink";
    this.Text = "Calendar";
    this.Format = null;
    this.Target = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will submit the CalendarForm";
    this.GetDesignerHtml = function () {
        var sHtml = '<a href="#">' + this.Text + '</a>';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Calendar";
        this.Format = ($ctl.attr("Format")) ? $ctl.attr("Format") : null;
        this.Target = ($ctl.attr("Target")) ? $ctl.attr("Target") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Format) sOut += ' Format="' + this.Format + '"';
        if (this.Target) sOut += ' Target="' + this.Target + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-calendarlink-text") +
            ctlUtils.CreateTextInput("Height", "designer-calendarlink-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-calendarlink-width alphanumeric") +
            ctlUtils.CreateTextInput("Date Format", "designer-calendarlink-format") +
            ctlUtils.CreateDropdown("Target Control", "designer-calendarlink-target");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-calendarlink-text').val(this.Text);
        designer.find('.designer-calendarlink-height').val(this.Height);
        designer.find('.designer-calendarlink-width').val(this.Width);
        designer.find('.designer-calendarlink-format').val(this.Format);
        designer.find('.designer-calendarlink-target').val(this.Target);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-calendarlink-text').val();
        this.Height = designer.find('.designer-calendarlink-height').val();
        this.Width = designer.find('.designer-calendarlink-width').val();
        this.Format = designer.find('.designer-calendarlink-format').val();
        this.Target = designer.find('.designer-calendarlink-target').val();
    }
    if (node) this.ParseXml(node);
} //ctlCalendarLink

function ctlCaptcha(node) {
    this.ID = null;
    this.Tag = "Captcha";
    this.CaptchaChars = null;
    this.CaptchaHeight = null;
    this.CaptchaWidth = null;
    this.CaptchaLength = null;
    this.ErrorMessage = null;
    this.Expiration = null;
    this.Height = null;
    this.Width = null;
    this.Text = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Renders the DNN CAPTCHA control at runtime. NOTE: Due to a limitation in the DNN CAPTCHA control, " +
                    "this tag can only be used in the FormView module.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>CAPTCHA (preview not available)</span><br />' +
                '<span>Captcha Chars </span>' + this.CaptchaChars + '<br />' +
                '<span>Captcha Length </span>' + this.CaptchaLength + '<br />' +
                '<span>Error Message </span>' + this.ErrorMessage;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.ID = ($ctl.attr("Id")) ? $ctl.attr("Id") : null;
        this.CaptchaChars = ($ctl.attr("CaptchaChars")) ? $ctl.attr("CaptchaChars") : null;
        this.CaptchaHeight = ($ctl.attr("CaptchaHeight")) ? $ctl.attr("CaptchaHeight") : null;
        this.CaptchaWidth = ($ctl.attr("CaptchaWidth")) ? $ctl.attr("CaptchaWidth") : null;
        this.CaptchaLength = ($ctl.attr("CaptchaLength")) ? $ctl.attr("CaptchaLength") : null;
        this.ErrorMessage = ($ctl.attr("ErrorMessage")) ? $ctl.attr("ErrorMessage") : null;
        this.Expiration = ($ctl.attr("Expiration")) ? $ctl.attr("Expiration") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.CaptchaChars) sOut += ' CaptchaChars="' + this.CaptchaChars + '"';
        if (this.CaptchaHeight) sOut += ' CaptchaHeight="' + this.CaptchaHeight + '"';
        if (this.CaptchaWidth) sOut += ' CaptchaWidth="' + this.CaptchaWidth + '"';
        if (this.CaptchaLength) sOut += ' CaptchaLength="' + this.CaptchaLength + '"';
        if (this.ErrorMessage) sOut += ' ErrorMessage="' + this.ErrorMessage + '"';
        if (this.Expiration) sOut += ' Expiration="' + this.Expiration + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        sOut += ' />\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("ID", "designer-captcha-id alphanumeric") +
            ctlUtils.CreateTextInput("Captcha Characters", "designer-captcha-captchachars") +
            ctlUtils.CreateTextInput("Captcha Height", "designer-captcha-captchaheight alphanumeric") +
            ctlUtils.CreateTextInput("Captcha Width", "designer-captcha-captchawidth alphanumeric") +
            ctlUtils.CreateTextInput("Captcha Length", "designer-captcha-captchalength numeric") +
            ctlUtils.CreateTextInput("Error Message", "designer-captcha-errormessage") +
            ctlUtils.CreateTextInput("Expiration", "designer-captcha-expiration numeric") +
            ctlUtils.CreateTextInput("Text", "designer-captcha-text") +
            ctlUtils.CreateTextInput("Height", "designer-captcha-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-captcha-width alphanumeric");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-captcha-id').val(this.ID);
        designer.find('.designer-captcha-captchachars').val(this.CaptchaChars);
        designer.find('.designer-captcha-captchaheight').val(this.CaptchaHeight);
        designer.find('.designer-captcha-captchawidth').val(this.CaptchaWidth);
        designer.find('.designer-captcha-captchalength').val(this.CaptchaLength);
        designer.find('.designer-captcha-errormessage').val(this.ErrorMessage);
        designer.find('.designer-captcha-expiration').val(this.Expiration);
        designer.find('.designer-captcha-text').val(this.Text);
        designer.find('.designer-captcha-height').val(this.Height);
        designer.find('.designer-captcha-width').val(this.Width);
    }
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-captcha-id').val();
        this.CaptchaChars = designer.find('.designer-captcha-captchachars').val();
        this.CaptchaHeight = designer.find('.designer-captcha-captchaheight').val();
        this.CaptchaWidth = designer.find('.designer-captcha-captchawidth').val();
        this.CaptchaLength = designer.find('.designer-captcha-captchalength').val();
        this.ErrorMessage = designer.find('.designer-captcha-errormessage').val();
        this.Expiration = designer.find('.designer-captcha-expiration').val();
        this.Text = designer.find('.designer-captcha-text').val();
        this.Height = designer.find('.designer-captcha-height').val();
        this.Width = designer.find('.designer-captcha-width').val();
    }
    if (node) this.ParseXml(node);
} //ctlCaptcha

function ctlContinueButton(node) {
    this.ID = null;
    this.Tag = "ContinueButton";
    this.Text = "Continue";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a push button that, when pressed, will return the user to " +
                       "the page that would normally be displayed after form submission or the URL " +
                       "specified in the Redirect attribute. NOTE: This can only be used inside the " +
                       "AddSuccessTemplate and EditSuccessTemplate tags.";
    this.GetDesignerHtml = function () {
        var sHtml = '<input type="button" value="' + this.Text + '" />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Add";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        var bNoIndent = (indent === 0);
        indent = '';
        var sOut = indent + "<";
        // special circumstance - if using text editor, add the xmod: prefix
        if (bNoIndent) { sOut += "xmod:"; }
        sOut += this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-continuebutton-text") +
            ctlUtils.CreateTextInput("Height", "designer-continuebutton-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-continuebutton-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-continuebutton-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-continuebutton-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-continuebutton-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-continuebutton-text').val(this.Text);
        designer.find('.designer-continuebutton-height').val(this.Height);
        designer.find('.designer-continuebutton-width').val(this.Width);
        designer.find('.designer-continuebutton-redirect').val(this.Redirect);
        designer.find('.designer-continuebutton-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-continuebutton-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-continuebutton-text').val();
        this.Height = designer.find('.designer-continuebutton-height').val();
        this.Width = designer.find('.designer-continuebutton-width').val();
        this.Redirect = designer.find('.designer-continuebutton-redirect').val();
        this.RedirectMethod = designer.find('.designer-continuebutton-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-continuebutton-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlContinueButton
function ctlContinueImage(node) {
    this.ID = null;
    this.Tag = "ContinueImage";
    this.AlternateText = "Continue";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.ImageUrl = null;
    this.ImageAlign = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a clickable image that, when pressed, will return the user to " +
                       "the page that would normally be displayed after form submission or the URL " +
                       "specified in the Redirect attribute. NOTE: This can only be used inside the " +
                       "AddSuccessTemplate and EditSuccessTemplate tags.";
    this.GetDesignerHtml = function () {
        var style = '';
        if (this.ImageHeight || this.Width) {
            style = 'style="';
            style += (this.Height) ? this.Height + 'px;' : '';
            style += (this.Width) ? this.Width + 'px;' : '';
            style += '"';
        }
        var sHtml = '<input type="image" src="' + this.ImageUrl + '"';
        sHtml += (this.style) ? ' ' + style : '';
        sHtml += ' />';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.AlternateText = ($ctl.attr("AlternateText")) ? $ctl.attr("AlternateText") : "Continue";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
        this.ImageUrl = ($ctl.attr("ImageUrl")) ? $ctl.attr("ImageUrl") : null;
        this.ImageAlign = ($ctl.attr("ImageAlign")) ? $ctl.attr("ImageAlign") : null;
    };
    this.GetXml = function (indent) {
        var bNoIndent = (indent === 0);
        indent = '';
        var sOut = indent + "<";
        // special circumstance - if using text editor, add the xmod: prefix
        if (bNoIndent) { sOut += "xmod:"; }
        sOut += this.Tag;
        if (this.AlternateText) sOut += ' AlternateText="' + this.AlternateText + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.ImageUrl) sOut += ' ImageUrl="' + this.ImageUrl + '"';
        if (this.ImageAlign) sOut += ' ImageAlign="' + this.ImageAlign + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Alternate Text", "designer-continueimage-alternatetext") +
            ctlUtils.CreateTextInput("Image URL", "designer-continueimage-imageurl") +
            ctlUtils.CreateDropdown("Image Align", "designer-continueimage-imagealign",
                ["", "Left", "Right", "Baseline", "Top", "Middle", "Bottom", "AbsBottom", "AbsMiddle", "TextTop"]) +
            ctlUtils.CreateTextInput("Height", "designer-continueimage-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-continueimage-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-continueimage-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-continueimage-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-continueimage-onclientclick");
    };
    this.LoContinueesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-continueimage-alternatetext').val(this.AlternateText);
        designer.find('.designer-continueimage-imageurl').val(this.ImageUrl);
        designer.find('.designer-continueimage-imagealign').val(this.ImageAlign);
        designer.find('.designer-continueimage-height').val(this.Height);
        designer.find('.designer-continueimage-width').val(this.Width);
        designer.find('.designer-continueimage-redirect').val(this.Redirect);
        designer.find('.designer-continueimage-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-continueimage-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.AlternateText = designer.find('.designer-continueimage-alternatetext').val();
        this.ImageUrl = designer.find('.designer-continueimage-imageurl').val();
        this.ImageAlign = designer.find('.designer-continueimage-imagealign').val();
        this.Height = designer.find('.designer-continueimage-height').val();
        this.Width = designer.find('.designer-continueimage-width').val();
        this.Redirect = designer.find('.designer-continueimage-redirect').val();
        this.RedirectMethod = designer.find('.designer-continueimage-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-continueimage-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlContinueImage
function ctlContinueLink(node) {
    this.ID = null;
    this.Tag = "ContinueLink";
    this.Text = "Continue";
    this.OnClientClick = null;
    this.Redirect = null;
    this.RedirectMethod = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "Represents a hyperlink that, when pressed, will return the user to " +
                       "the page that would normally be displayed after form submission or the URL " +
                       "specified in the Redirect attribute. NOTE: This can only be used inside the " +
                       "AddSuccessTemplate and EditSuccessTemplate tags.";
    this.GetDesignerHtml = function () {
        var sHtml = '<a href="#">' + this.Text + '</a>';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.Text = ($ctl.attr("Text")) ? $ctl.attr("Text") : "Continue";
        this.Redirect = ($ctl.attr("Redirect")) ? $ctl.attr("Redirect") : null;
        this.RedirectMethod = ($ctl.attr("RedirectMethod")) ? $ctl.attr("RedirectMethod") : null;
        this.OnClientClick = ($ctl.attr("OnClientClick")) ? $ctl.attr("OnClientClick") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        var bNoIndent = (indent === 0);
        indent = '';
        var sOut = indent + "<";
        // special circumstance - if using text editor, add the xmod: prefix
        if (bNoIndent) { sOut += "xmod:"; }
        sOut += this.Tag;
        if (this.Text) sOut += ' Text="' + this.Text + '"';
        if (this.Redirect) sOut += ' Redirect="' + this.Redirect + '"';
        if (this.RedirectMethod) sOut += ' RedirectMethod="' + this.RedirectMethod + '"';
        if (this.OnClientClick) sOut += ' OnClientClick="' + this.OnClientClick + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += ' />';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("Text", "designer-continuelink-text") +
            ctlUtils.CreateTextInput("Height", "designer-continuelink-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-continuelink-width alphanumeric") +
            ctlUtils.CreateTextInput("Redirect To", "designer-continuelink-redirect") +
            ctlUtils.CreateDropdown("Redirect Method", "designer-continuelink-redirectmethod",
                ["No Redirection", "GET", "POST"], ["", "get", "post"]) +
            ctlUtils.CreateTextInput("OnClientClick", "designer-continuelink-onclientclick");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-continuelink-text').val(this.Text);
        designer.find('.designer-continuelink-height').val(this.Height);
        designer.find('.designer-continuelink-width').val(this.Width);
        designer.find('.designer-continuelink-redirect').val(this.Redirect);
        designer.find('.designer-continuelink-redirectmethod').val(this.RedirectMethod);
        designer.find('.designer-continuelink-onclientclick').val(this.OnClientClick);
    }
    this.LoadFromDesigner = function (designer) {
        this.Text = designer.find('.designer-continuelink-text').val();
        this.Height = designer.find('.designer-continuelink-height').val();
        this.Width = designer.find('.designer-continuelink-width').val();
        this.Redirect = designer.find('.designer-continuelink-redirect').val();
        this.RedirectMethod = designer.find('.designer-continuelink-redirectmethod').val();
        this.OnClientClick = designer.find('.designer-continuelink-onclientclick').val();
    }
    if (node) this.ParseXml(node);
} //ctlContinueLink

function ctlPanel(node) {
    this.ID = null;
    this.Tag = "Panel";
    this.DefaultButton = null;
    this.ShowRoles = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "The Panel tag is a container tag that holds other tags and HTML. " +
                     "It can be used just as a container, making it easy to set the container's " +
                     "colors and borders. Primarily, though, it is used to show/hide parts of " +
                     "the form based on what role the current user is in. So, for instance, you " +
                     "can include controls that will only be available to administrators or editors " +
                     "or registered users, etc.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>Panel</span><br />' +
                '<span>ID </span>' + this.ID + '<br />' +
                '<span>ShowRoles </span>' + this.ShowRoles + '<br />' +
                '<span>DefaultButton </span>' + this.DefaultButton;
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.ID = ($ctl.attr("Id")) ? $ctl.attr("Id") : null;
        this.DefaultButton = ($ctl.attr("DefaultButton")) ? $ctl.attr("DefaultButton") : null;
        this.ShowRoles = ($ctl.attr("ShowRoles")) ? $ctl.attr("ShowRoles") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.ID) sOut += ' Id="' + this.ID + '"';
        if (this.DefaultButton) sOut += ' DefaultButton="' + this.DefaultButton + '"';
        if (this.ShowRoles) sOut += ' ShowRoles="' + this.ShowRoles + '">';
        if (this.Height) sOut += ' Height="' + this.Height + '">';
        if (this.Width) sOut += ' Width="' + this.Width + '">';
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("ID", "designer-panel-id") +
            ctlUtils.CreateTextInput("Default Button", "designer-panel-defaultbutton") +
            ctlUtils.CreateTextInput("Show Roles", "designer-panel-showroles");
        ctlUtils.CreateTextInput("Height", "designer-panel-height alphanumeric");
        ctlUtils.CreateTextInput("Width", "designer-panel-width alphanumeric");
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-panel-id').val(this.ID);
        designer.find('.designer-panel-defaultbutton').val(this.DefaultButton);
        designer.find('.designer-panel-showroles').val(this.ShowRoles);
        designer.find('.designer-panel-height').val(this.Height);
        designer.find('.designer-panel-width').val(this.Width);
    }
    this.LoadFromDesigner = function (designer) {
        this.ID = designer.find('.designer-panel-id').val();
        this.DefaultButton = designer.find('.designer-panel-defaultbutton').val();
        this.ShowRoles = designer.find('.designer-panel-showroles').val();
        this.Height = designer.find('.designer-panel-height').val();
        this.Width = designer.find('.designer-panel-width').val();
    }
    if (node) this.ParseXml(node);
} //ctlPanel
function ctlTabstrip(node) {
    this.ID = null;
    this.Tag = "Tabstrip";
    this.BackColor = null;
    this.BorderColor = null;
    this.ForeColor = null;
    this.HoverBackColor = null;
    this.HoverForeColor = null;
    this.SelectedBackColor = null;
    this.SelectedForeColor = null;
    this.Tabs = null;
    this.Height = null;
    this.Width = null;
    this.Label = new ctlLabel(null, '');
    this.Label.Text = '';
    this.Description = "The Tabstrip tag renders as a series of tabs that, when clicked, " +
                     "shows the corresponding content within that tab. This control requires " +
                     "that Javascript be enabled in the browser to function correctly.";
    this.GetDesignerHtml = function () {
        var sHtml = '<span>Tabstrip</span><br />' +
                '<span>Tabs </span><br />' +
                '<ul>';
        for (var i = 0; i < this.Tabs.length - 1; i++) {
            sHtml += '<li>' + this.Tabs[i] + '</li>';
        }
        sHtml += '</ul>';
        return '<div>' + sHtml + '</div>';
    };
    this.ParseXml = function (node) {
        var $ctl = jQuery(node);
        this.BackColor = ($ctl.attr("BackColor")) ? $ctl.attr("BackColor") : null;
        this.BorderColor = ($ctl.attr("BorderColor")) ? $ctl.attr("BorderColor") : null;
        this.ForeColor = ($ctl.attr("ForeColor")) ? $ctl.attr("ForeColor") : null;
        this.HoverBackColor = ($ctl.attr("HoverBackColor")) ? $ctl.attr("HoverBackColor") : null;
        this.HoverForeColor = ($ctl.attr("HoverForeColor")) ? $ctl.attr("HoverForeColor") : null;
        this.SelectedBackColor = ($ctl.attr("SelectedBackColor")) ? $ctl.attr("SelectedBackColor") : null;
        this.SelectedForeColor = ($ctl.attr("SelectedForeColor")) ? $ctl.attr("SelectedForeColor") : null;
        this.Height = ($ctl.attr("Height")) ? $ctl.attr("Height") : null;
        this.Width = ($ctl.attr("Width")) ? $ctl.attr("Width") : null;
        // parse tabs
        this.Tabs = new Array();
        $node.find("Tab").each(function () {
            this.Tabs.push($(this).attr("Text"));
        });
    };
    this.GetXml = function (indent) {
        indent = '';
        var sOut = indent + "<" + this.Tag;
        if (this.BackColor) sOut += ' BackColor="' + this.BackColor + '"';
        if (this.BorderColor) sOut += ' BorderColor="' + this.BorderColor + '"';
        if (this.ForeColor) sOut += ' ForeColor="' + this.ForeColor + '"';
        if (this.HoverBackColor) sOut += ' HoverBackColor="' + this.HoverBackColor + '"';
        if (this.HoverForeColor) sOut += ' HoverForeColor="' + this.HoverForeColor + '"';
        if (this.SelectedBackColor) sOut += ' SelectedBackColor="' + this.SelectedBackColor + '"';
        if (this.SelectedForeColor) sOut += ' SelectedForeColor="' + this.SelectedForeColor + '"';
        if (this.Height) sOut += ' Height="' + this.Height + '"';
        if (this.Width) sOut += ' Width="' + this.Width + '"';
        sOut += '>\n';
        for (var i = 0; i < this.Tabs.length; i++) {
            sOut += indent + '<Tab Text="' + this.Tabs[i] + '"></Tab>\n';
        }
        sOut += indent + '</' + this.Tag + '>\n';
        return sOut;
    };
    this.PropertySheet = function () {
        return ctlUtils.CreateTextInput("BackColor", "designer-tabstrip-backcolor colorpicker") +
            ctlUtils.CreateTextInput("Border Color", "designer-tabstrip-bordercolor colorpicker") +
            ctlUtils.CreateTextInput("ForeColor", "designer-tabstrip-forecolor colorpicker") +
            ctlUtils.CreateTextInput("Hover BackColor", "designer-tabstrip-hoverbackcolor colorpicker") +
            ctlUtils.CreateTextInput("Hover ForeColor", "designer-tabstrip-hoverforecolor colorpicker") +
            ctlUtils.CreateTextInput("Selected BackColor", "designer-tabstrip-selectedbackcolor colorpicker") +
            ctlUtils.CreateTextInput("Selected ForeColor", "designer-tabstrip-selectedforecolor colorpicker") +
            ctlUtils.CreateTextInput("Height", "designer-tabstrip-height alphanumeric") +
            ctlUtils.CreateTextInput("Width", "designer-tabstrip-width alphanumeric") +
            ctlUtils.CreateListBox("Tabs", "designer-tabstrip-tabs textlistitems", 6);
    };
    this.LoadDesigner = function (designer, data) {
        // load values from data
        designer.find('.designer-tabstrip-backcolor').val(this.BackColor);
        designer.find('.designer-tabstrip-bordercolor').val(this.BorderColor);
        designer.find('.designer-tabstrip-forecolor').val(this.ForeColor);
        designer.find('.designer-tabstrip-hoverbackcolor').val(this.HoverBackColor);
        designer.find('.designer-tabstrip-hoverforecolor').val(this.HoverForeColor);
        designer.find('.designer-tabstrip-selectedbackcolor').val(this.SelectedBackColor);
        designer.find('.designer-tabstrip-selectedforecolor').val(this.SelectedForeColor);
        designer.find('.designer-tabstrip-height').val(this.Height);
        designer.find('.designer-tabstrip-width').val(this.Width);
        var $tabList = designer.find('.designer-tabstrip-tabs')
        var sTabItems = ''
        for (var i = 0; i < this.Tabs.length; i++) {
            var tabText = this.Tabs[i];
            sTabItems += '<option value="' + tabText + '">' + tabText + '</option>\n';
        }
        $tabList.html(sTabItems);
    }
    this.LoadFromDesigner = function (designer) {
        this.BackColor = designer.find('.designer-tabstrip-backcolor').val();
        this.BorderColor = designer.find('.designer-tabstrip-bordercolor').val();
        this.ForeColor = designer.find('.designer-tabstrip-forecolor').val();
        this.HoverBackColor = designer.find('.designer-tabstrip-hoverbackcolor').val();
        this.HoverForeColor = designer.find('.designer-tabstrip-hoverforecolor').val();
        this.SelectedBackColor = designer.find('.designer-tabstrip-selectedbackcolor').val();
        this.SelectedForeColor = designer.find('.designer-tabstrip-selectedforecolor').val();
        this.Height = designer.find('.designer-tabstrip-height').val();
        this.Width = designer.find('.designer-tabstrip-width').val();
        var $tabList = designer.find('.designer-tabstrip-tabs');
        var TabsText = new Array;
        $tabList.find('option').each(function () {
            TabsText.push($(this).val());
        });
        this.Tabs = TabsText;
    }
    if (node) this.ParseXml(node);
} //ctlTabstrip

//
//====================================================================
// validateTagsUI Plugin
//====================================================================
// options:
//   -- includeTargetProperty:true|false Will prompt for Target property for 
//			each validation tag.
(function ($) {
    var dataID = "validateTagsUI";
    var methods = {
        init: function (options) {
            var opts = $.extend({}, $.fn.validateTagsUI.defaults, options);
            var $this = $(this), data = $this.data(dataID);
            if (!data) {
                $this.data(dataID, {
                    opts: opts
                });
            }
            initialize($this);
        },
        getValidateList: function () {
            var $lst = $(this).find('.val-validatorlist');
            var arrTags = $lst.data(dataID);
            if (!arrTags) return new Array;
            return arrTags;
        },
        getValidateTagsXml: function () {
            var $this = $(this);
            var $lst = $this.find('.val-validatorlist');
            var arrTags = $lst.data(dataID);
            if (!arrTags) return '';
            var sOut = '', tag = null;
            for (var i = 0; i < arrTags.length; i++) {
                tag = arrTags[i];
                sOut += '<Validate Type="' + tag.Type + '"';
                if (tag.Target) sOut += ' Target="' + tag.Target + '"';
                if (tag.Text) sOut += ' Text="' + tag.Text + '"';
                if (tag.Message) sOut += ' Message="' + tag.Message + '"';
                if (tag.ValidationExpression) sOut += ' ValidationExpression="' + tag.ValidationExpression + '"';
                if (tag.MaximumValue) sOut += ' MaximumValue="' + tag.MaximumValue + '"';
                if (tag.MinimumValue) sOut += ' MinimumValue="' + tag.MinimumValue + '"';
                if (tag.DataType) sOut += ' DataType="' + tag.DataType + '"';
                if (tag.Operator) sOut += ' Operator="' + tag.Operator + '"';
                if (tag.CompareTarget) sOut += ' CompareTarget="' + tag.CompareTarget + '"';
                if (tag.CompareValue) sOut += ' CompareValue="' + tag.CompareValue + '"';
                sOut += ' />\n';
            }
            return sOut;
        }
    };

    $.fn.validateTagsUI = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.validateTagsUI');
        }
    };

    $.validateTagsUI = {}; // base object to hold static functions

    $.fn.validateTagsUI.defaults = {
        includeTargetProperty: true
    } // defaults

    function initialize($container) {
        var opts = $container.data(dataID).opts;
        var bIncludeTarget = opts.includeTargetProperty;
        var sHtml =
            beginTag('div', '', "xmp-designer-row val-all") +
            createLabel("Validators") +
            createSelect("", 4, "val-validatorlist", "float:left;width:150px;") +
            beginTag("ul", "", "val-commandbuttons ui-helper-reset", "float:left;margin:0;padding-left:2px;") +
            '<li><span class="ui-icon ui-icon-plus"></span></li>\n' +
            '<li><span class="ui-icon ui-icon-close"></span></li>\n' +
            endTag('ul') + '\n' +
            endTag('div') + '\n' +
            createSelectRow('val-all val-props', 'Validation Type', 1, 'validation-type-selector', '',
                ["", "Required", "Regular Expression", "Email", "Compare",
                 "Range", "Checkbox", "CheckboxList", "XML"],
                ["", "required", "regex", "email", "compare",
                 "range", "checkbox", "checkboxlist", "xml"]);
        if (bIncludeTarget) sHtml +=
            createInputRow('val-all val-props', 'Target', 'text', 'validation-target required', '');
        sHtml +=
            createInputRow('val-all val-props', 'Text', 'text', 'validation-text', '') +
            createInputRow('val-all val-props', 'Message', 'text', 'validation-message', '') +
            createInputRow('val-range val-props', 'Minimum Value', 'text', 'validation-minvalue') +
            createInputRow('val-range val-props', 'Maximum Value', 'text', 'validation-maxvalue', '') +
            createSelectRow('val-range val-compare val-props', 'Data Type', 1, 'validation-datatype', '', ["", "String", "Integer", "Double", "Date", "Currency"], ["", "string", "integer", "double", "date", "currency"]) +
            createInputRow('val-regex val-props', 'Validation Expression', 'text') +
            createInputRow('val-compare val-props', 'Compare to Control', 'text', 'validation-compare-target') +
            createInputRow('val-compare val-props', 'Compare to Value', 'text', 'validation-compare-value') +
            createSelectRow('val-compare val-props', 'Comparison Type', 1, 'validation-operator', '',
                ["", "=", "&lt;&gt;", "&gt;", "&gt;=", "&lt;", "&lt;=", "Data Type Check"],
                ["", "Equal", "NotEqual", "GreaterThan", "GreaterThanEqual", "LessThan",
                 "LessThanEqual", "DataTypeCheck"]) +
            beginTag('div', '', 'val-all val-props val-buttons') +
            '<label class="val-all">&nbsp;</label><input type="button" value="Save" />' +
            '&nbsp;<input type="button" value="Cancel" />' +
            endTag('div')
            ;
        var $html = $(sHtml);
        $html.find("label").css({ 'float': 'left', 'display': 'block', 'width': '120px' });
        $html.find('div').css({ 'overflow': 'hidden' });
        $container.html($html).css({ 'overflow': 'hidden' });
        $container.find('div.xmp-designer-row').css(
            { 'overflow': 'hidden', 'margin-bottom': '8px' });
        $container.find('ul.val-commandbuttons').css({ 'margin-left': '5px' })
            .find('li').addClass('ui-state-default ui-corner-all').css({ 'margin-bottom': '4px', 'padding': '3px' }).hover(function () {
                $(this).addClass('ui-state-hover');
                $(this).css({ 'cursor': 'pointer' });
            }, function () {
                $(this).removeClass('ui-state-hover');
                $(this).css({ 'cursor': 'default' });
            });
        // setup events
        $container.find('div.xmp-designer-row').hide();
        $container.find('div.val-all').show();
        $container.find('.val-props').hide();
        $container.find('select.validation-type-selector').change(function () {
            showTagPropertyInputs($container, $(this).val());
        });
        $container.find('ul li span.ui-icon-plus').parent().click(function () {
            $container.find('input[value=Save]').removeClass('is-editing');
            $container.find('.validation-type-selector').parent().show();
        }); // add button click
        $container.find('ul li span.ui-icon-close').parent().click(function () {
            // find the item in the tags list and remove it.
            var $lst = $container.find('.val-validatorlist');
            var itemIndex = $lst.get(0).selectedIndex;
            if (itemIndex >= 0) {
                var arrTags = $lst.data(dataID);
                if (arrTags) arrTags.splice(itemIndex, 1);
                $lst.find('option').eq(itemIndex).remove();
                clearProperties($container);
                $container.find('.val-props').hide();
            }
        }); // delete button click
        $container.find('.val-buttons input:first').click(function () {
            if (validateDesigner($container)) {
                var tag = loadTagFromDesigner($container);
                var $lst = $container.find('.val-validatorlist');
                var $this = $(this);
                var bIsEditing = $this.hasClass('is-editing');

                var arrValidators = $lst.data(dataID);
                if (!arrValidators) { arrValidators = new Array; }
                $lst.data(dataID, arrValidators);
                var itemTitle = '';
                switch (tag.Type) {
                    case "required": itemTitle = "Required"; break;
                    case "regex": itemTitle = "Regular Expression"; break;
                    case "email": itemTitle = "Email"; break;
                    case "compare": itemTitle = "Compare"; break;
                    case "range": itemTitle = "Range"; break;
                    case "checkbox": itemTitle = "Checkbox"; break;
                    case "checkboxlist": itemTitle = "CheckboxList"; break;
                    case "xml": itemTitle = "XML"; break;
                }
                var listItem = '<option value="' + tag.Type + '">' + itemTitle + '</option>';
                if (bIsEditing) {
                    var idx = $lst.get(0).selectedIndex;
                    if (idx >= 0 && arrValidators.length > 0) {
                        arrValidators[idx] = tag;
                        $lst.find('option').eq(idx).replaceWith(listItem);
                    }
                }
                if (!bIsEditing) {
                    arrValidators.push(tag);
                    $lst.append(listItem);
                }
                $this.removeClass('is-editing');
                clearProperties($container);
                $container.find('.val-props').hide();
            }
        }); // Save button click
        $container.find('.val-buttons input:last').click(function () {
            clearProperties($container);
            $container.find('.required-error').remove();
            $container.find('input[value=Save]').removeClass('is-editing');
            $container.find('.val-props').hide();
        }); // Cancel button click
        $container.find('.val-validatorlist').change(function () {
            // prepare for updating.
            $container.find('input[value=Save]').addClass('is-editing');
            loadProperties($container);
        }); // validator list change
    } // initialize

    function clearProperties($container) {
        $container.find(".val-props input, .val-props select").not(".val-buttons input").val('');
    }
    function showTagPropertyInputs($container, tagType) {
        $container.find('.val-props').hide();
        switch (tagType) {
            case 'required': break;
            case 'regex': $container.find('.val-regex').show(); break;
            case 'email': break;
            case 'compare': $container.find('.val-compare').show(); break;
            case 'range': $container.find('.val-range').show(); break;
            case 'checkbox': break;
            case 'checkboxlist': break;
            case 'xml': break;
            default: return;
        }
        $container.find('.val-all').show();
    }

    function validateDesigner($container) {
        var opts = $container.data(dataID).opts;
        var bIncludeTarget = opts.includeTargetProperty;
        $container.find('.required-error').remove();
        var isValid = true;
        if (bIncludeTarget) {
            isValid = (isValid && $container.find('.validation-target').required());
        }
        var valType = $container.find('select.validation-type-selector').val();
        switch (valType) {
            case 'regex': isValid = (isValid && $container.find('.val-regex input').required()); break;
        }
        return isValid;
    }

    function loadTagFromDesigner($container) {
        return {
            Tag: "Validate",
            Target: $container.find('.validation-target').val(),
            Type: $container.find('select.validation-type-selector').val(),
            Text: $container.find('.validation-text').val(),
            Message: $container.find('.validation-message').val(),
            ValidationExpression: $container.find('.val-regex input').val(),
            MaximumValue: $container.find('.validation-maxvalue input').val(),
            MinimumValue: $container.find('validation-minvalue input').val(),
            DataType: $container.find('.validation-datatype').val(),
            Operator: $container.find('.validation-operator').val(),
            CompareTarget: $container.find('.validation-compare-target').val(),
            CompareValue: $container.find('.validation-compare-value').val()
        }
    }

    function loadProperties($container) {
        var $lst = $container.find('.val-validatorlist');
        var $lstType = $container.find('select.validation-type-selector');
        var includeTarget = $container.data(dataID).opts.includeTargetProperty;
        // get the tag item from the list
        var arrTags = $lst.data(dataID);
        var idx = $lst.get(0).selectedIndex;
        if (arrTags) {
            var tag = arrTags[idx];
            if (tag) {
                $lstType.val(tag.Type);
                showTagPropertyInputs($container, tag.Type);
                if (includeTarget) { $container.find('.validation-target').val(tag.Target) };
                $container.find('.validation-text').val(tag.Text);
                $container.find('.validation-message').val(tag.Message);
                if (tag.Type == 'regex') $container.find('.val-regex input').val(tag.ValidationExpression);
                if (tag.Type == 'range') {
                    $container.find('.validation-maxvalue input').val(tag.MaximumValue);
                    $container.find('.validation-minvalue input').val(tag.MinimumValue);
                    $container.find('.validation-datatype').val(tag.DataType);
                }
                if (tag.Type == 'compare') {
                    $container.find('.validation-operator').val(tag.Operator);
                    $container.find('.validation-datatype').val(tag.DataType);
                    $container.find('.validation-compare-target').val(tag.CompareTarget);
                    $container.find('.validation-compare-value').val(tag.CompareValue);
                }
            } // if (tag)
        } // if (arrTags)
    } // loadProperties()

    function createInputRow(divClass, labelText, inputType, inputClass, inputStyle) {
        var divClassName = (divClass) ? 'xmp-designer-row ' + divClass : 'xmp-designer-row';
        return beginTag('div', '', divClassName, '') +
               createLabel(labelText, '', '') +
               createInput(inputType, inputClass, inputStyle) +
               endTag('div');
    }
    function createSelectRow(divClass, labelText, size, selectClass, selectStyle,
                             arrTextItems, arrValueItems) {
        var divClassName = (divClass) ? 'xmp-designer-row ' + divClass : 'xmp-designer-row';
        return beginTag('div', '', divClassName, '') +
               createLabel(labelText, '', '') +
               createSelect('', size, selectClass, selectStyle, arrTextItems, arrValueItems) +
               endTag('div');
    }
    function createLabel(text, className, style) {
        return beginTag('label', className, style) + text + endTag('label');
    }
    function createOption(value, text) {
        return '<option value="' + value + '">' + text + '</option>';
    }
    function createInput(type, className, style) {
        var sOut = '<input type="' + type + '"';
        if (className) sOut += ' class="' + className + '"';
        if (style) sOut += ' style="' + style + '"';
        sOut += ' />';
        return sOut;
    }
    function createSelect(id, size, className, style, arrTextItems, arrValueItems) {
        var sOut = beginTag("select", id, className, style, ["size", size]) + '\n';
        if (arrTextItems) {
            for (var i = 0; i < arrTextItems.length; i++) {
                var sVal = arrTextItems[i];
                if (arrValueItems) sVal = arrValueItems[i];
                sOut += createOption(sVal, arrTextItems[i]) + '\n';
            }
        }
        return sOut += endTag('select') + '\n';

    }
    function beginTag(tagName, id, className, style, arrPropertyPairs) {
        var sOut = '<' + tagName;
        if (id) sOut += ' id="' + id + '"';
        if (className) sOut += ' class="' + className + '"';
        if (style) sOut += ' style="' + style + '"';
        if (arrPropertyPairs) {
            for (var i = 0; i < arrPropertyPairs.length; i += 2) {
                var sName = arrPropertyPairs[i];
                var sVal = arrPropertyPairs[i + 1];
                sOut += ' ' + sName + '="' + sVal + '"';
            }
        }
        sOut += '>';
        return sOut;
    }
    function endTag(tagName) {
        return '</' + tagName + '>';
    }

})(jQuery);

//#region adminList Plugin
//
//====================================================================
// adminList Plugin
//====================================================================
//
(function ($) {
    $.fn.adminList = function () {

        return this.each(function () {
            var theList = $(this);
            var itemText = null;
            var itemValue = null;

            theList.wrap("<div style=\"border:1px solid #CCC;overflow:hidden;\" />");
            var container = theList.parent();
            theList.css({ "width": "150px", "float": "left" });
            theList.change(function () {
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
                         " <label style=\"display:block;float:left;width:30px;\">Text</label> <input type=\"text\" /><br />" +
                         " <label style=\"clear:left;display:block;float:left;width:30px;\">Value</label> <input type=\"text\" /><br />" +
                         " <input type=\"button\" value=\"Save\" style=\"margin-left:30px;\" /> <input type=\"button\" value=\"Hide\" />" +
                         "</div>");
            itemText = btns.find("input[type=text]:first");
            itemValue = btns.find("input[type=text]:last");
            btns.find("ul").css({ "margin-left": "10px" });
            btns.find("li").addClass("ui-state-default ui-corner-all")
                        .css({ "cursor": "pointer", "list-style": "none outside none", "margin": "2px", "padding": "1px 0 2px 2px", "position": "relative", "width": "18px" })
                        .hover(function () { $(this).addClass("ui-state-highlight"); }, function () { $(this).removeClass("ui-state-highlight"); });
            btns.find("li span").addClass("ui-icon");
            btns.find("li:first").css({ "margin-top": "-5px" });
            // Add Button 
            btns.find("li span.ui-icon-plus").click(function () {
                // clear the input boxes and show the panel to add an item
                var editdiv = $(this).parent().parent().parent().find("div");
                itemText.val('');
                var btnSave = editdiv.find("input[value=Save]");
                btnSave.removeClass("admin-list-update");
                btnSave.addClass("admin-list-new");
                editdiv.show();
                itemText.focus();
            });
            // Move Item Up/Down
            btns.find("li span.ui-icon-circle-arrow-n").click(function () {
                var lst = theList.get(0);
                var curIndex = lst.selectedIndex;
                if (curIndex > 0) {
                    // can move up - swap current item with the one above it
                    var selItem = theList.find("option:selected");
                    var prevItem = selItem.prev();
                    prevItem.before(selItem);
                }
            });
            // Delete Item(s)
            btns.find("li span.ui-icon-close").parent().click(function () {
                var selItem = theList.find("option:selected");
                if (selItem) { selItem.remove(); }
                // hide the edit panel if it's showing.
                container.find("div").hide();
            });
            btns.find("li span.ui-icon-circle-arrow-s").click(function () {
                var lst = theList.get(0);
                var curIndex = lst.selectedIndex;
                if (curIndex < lst.length - 1) {
                    // can move up - swap current item with the one above it
                    var selItem = theList.find("option:selected");
                    var nextItem = selItem.next();
                    nextItem.after(selItem);
                }
            });


            // add a little headroom for the Save/Hide buttons
            btns.find("input[type=button]").css({ "margin-top": "5px" });
            btns.find("input[value=Save]").click(function () {
                // validate and add to list box
                if ($(this).hasClass("admin-list-update")) {
                    var selItem = theList.find("option:selected");
                    selItem.val(itemValue.val());
                    selItem.text(itemText.val());
                    itemText.val('');
                    itemValue.val('');
                    $(this).parent().hide();
                }
                else {
                    // add item to listbox
                    var newItem = "<option value=\"" + itemValue.val() + "\">" + itemText.val() + "</option>";
                    theList.append(newItem);
                    // select item so listbox scrolls to selected item
                    var items = theList.find("option").length;
                    theList.attr("selectedIndex", items - 1);
                    // set user back to item text and select the text there so they're ready to add
                    // another item.
                    itemText.focus();
                    itemText.select();

                }
            });
            btns.find("input[value=Hide]").click(function () {
                $(this).parent().hide();
            });
            $(this).after(btns);

        });
    }
})(jQuery);

//#endregion

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
(function ($) {
    var dataID = "listEditor";
    var methods = {
        init: function (options) {
            var opts = $.extend({}, $.fn.listEditor.defaults, options);
            var $this = $(this);
            var data = $this.data(dataID);
            if (!data) {
                $this.data(dataID, { opts: opts, container: $this });
            }
            return this.each(function () {
                initialize($(this));
            });
        },
        getListItems: function () {
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
            for (var i = 0; i < arrItems.length; i++) {
                var currentItem = arrItems[i];
                var outputItem = {};
                // assign each property its value for this item
                for (var j = 0; j < arrProperties.length; j++) {
                    outputItem[arrProperties[j].Name] = currentItem[j]
                }
                // add the new object to the output array
                arrOutputItems.push(outputItem);
            }
            return arrOutputItems;
        },
        getPropertyNames: function () {
            var $container = $(this);
            var data = $container.data(dataID);
            var opts = data.opts;
            var arrItemProperties = opts.itemProperties;
            var $list = $container.find('select:first');
            var arrOutput = new Array();
            for (var i = 0; i < arrItemProperties.length; i++) {
                arrOutput.push(arrItemProperties[i].Name);
            }
            return arrOutput;
        }
    }; // methods
    $.fn.listEditor = function (method) {
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
            { Name: "Text", Caption: null, Control: "textbox", Value: null },
            { Name: "Value", Caption: null, Control: "textbox", Value: null }
        ],
        inputPanelClass: "list-editor-input-panel"
    };

    function initialize($container) {
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
        for (var i = 0; i < props.length; i++) {
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
                    if (props[i].Control.toLowerCase() == 'listbox') size = 5;
                    sHtml += '<label>' + caption + '</label><select size="' + size + '"';
                    if (props[i].Value) {
                        sHtml += '>';
                        var arrValues = props[i].Value.split('|');
                        for (var j = 0; j < arrValues.length; j++) {
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
        $list.data(dataID, new Array());

        // set styling
        $container.css({ 'overflow': 'hidden' });
        $list.css({ 'width': '150px', 'float': 'left', 'padding': '0px' });
        $btnList.css({ 'float': 'left', 'padding': '0px', 'margin-left': '10px', 'margin-top': '2px' });
        $btnAdd.css({ 'margin-top': '-5px' }).find('span:first').addClass("ui-icon-plus");
        $btnDelete.find('span:first').addClass("ui-icon-close");
        $btnUp.find('span:first').addClass("ui-icon-circle-arrow-n");
        $btnDown.find('span:first').addClass("ui-icon-circle-arrow-s");
        $btnList.find('li').addClass('ui-state-default ui-corner-all')
            .css({ 'cursor': 'pointer', 'list-style': 'none outside none',
                'margin': '2px', 'padding': '1px 0 2px 2px', 'position': 'relative',
                'width': '18px'
            })
            .hover(function () { $(this).addClass('ui-state-highlight'); },
                   function () { $(this).removeClass('ui-state-highlight'); })
            .find('span').addClass('ui-icon');
        $inputPanel.css({ 'display': 'none', 'clear': 'left' });
        $inputPanel.find('div')
            .css({ 'overflow': 'hidden' })
            .find('label').css(
                { 'display': 'block', 'font-size': '.8em' })
            .parent().find('input').css(
                { 'float': 'left' });

        $btnSave.css({ 'margin-left': '30px' });
        $btnHide.css({ 'margin-left': '8px' });

        // events
        $list.change(function () {
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
        $btnAdd.click(function () {
            // clear input boxes and show panel
            $inputPanel.find('input[type="text"]').val('');
            $btnSave.removeClass('parameter-designer-update')
                    .addClass('parameter-designer-new');
            $inputPanel.show();
            setPropertyInputFocus($container, settings, 0);
        });
        $btnDelete.click(function () {
            var selItem = $list.find('option:selected');
            if (selItem) {
                var selIndex = $list.get(0).selectedIndex;
                var arrParams = $list.data(dataID);
                arrParams.splice(selIndex, 1);
                selItem.remove();
            }
            // hide the edit panel if it's showing
            $inputPanel.hide();
        });
        $btnUp.click(function () {
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
        $btnDown.click(function () {
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
        $btnSave.click(function () {
            // validate and add to list box
            var objData = readProperties($container, settings);
            var props = settings.itemProperties;
            var arrObjectList = $list.data(dataID);
            if ($(this).hasClass('parameter-designer-update')) {
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
        $btnHide.click(function () {
            $inputPanel.hide();
        });
    } // function initialize()

    // returns array of property values in the order specified in settings.itemProperties
    function readProperties($container, settings) {
        var props = settings.itemProperties;
        var $inputPanel = $container.find('.' + settings.inputPanelClass);
        var arrValues = new Array();
        for (var i = 0; i < props.length; i++) {
            var $row = $inputPanel.find('div').eq(i);
            switch (props[i].Control.toLowerCase()) {
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
    function writeProperties($container, settings, itemPropertyValues) {
        var props = settings.itemProperties;
        var $inputPanel = $container.find('.' + settings.inputPanelClass);
        for (var i = 0; i < props.length; i++) {
            var $row = $inputPanel.find('div').eq(i);
            switch (props[i].Control.toLowerCase()) {
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

    function setPropertyInputFocus($container, settings, index) {
        var prop = settings.itemProperties[index];
        var $row = $container.find('.list-editor-input-panel div:eq(' + index + ')');
        switch (prop.Control.toLowerCase()) {
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



//
//====================================================================
// formBuilder Plugin
//  REQUIRES:
//  jquery.hoverintent.js 
//====================================================================
//
; (function ($) {
    var dataID = 'formBuilder';
    var methods = {
        init: function (options) {
            var opts = $.extend({}, $.fn.formBuilder.defaults, options);
            var container, canvas, toolbar, sectionControls, sectionStyling, sectionSettings;
            var ThemeList, LabelAlignList, LabelWidthBox;
            var ControlPicker;
            var FormNameBox, FormNameLabel, DataOptionList, TableList, KeyFieldList
            var activeRow; // currently selected row

            var $this = $(this),
                  data = $this.data(dataID);
            if (!data) {
                $(this).data(dataID, {
                    opts: opts,
                    container: $(this),
                    toolbar: null,
                    sectionControls: null,
                    sectionStyling: null,
                    sectionSettings: null,
                    sectionButtons: null,
                    themeList: null,
                    labelAlignList: null,
                    labelWidthBox: null,
                    controlPicker: null,
                    formNameBox: null,
                    formNameLabel: null,
                    convertLink: null,
                    dataOptionList: null,
                    connectionStringBox: null,
                    loadExternalTablesButton: null,
                    tableList: null,
                    keyFieldList: null,
                    activeRow: null,
                    createAutoFormLabel: null,
                    createFormButton: null,
                    updateFormButton: null,
                    cancelFormButton: null,
                    isEditingForm: false,
                    useTextEditor: false
                });
            }
            container = $(this);
            initialize($this);
        },
        convertForm: function (formName, g) {
            var fb_data = $(this).data(dataID);
            $.ajax({
                type: "POST",
                datatype: "text",
                url: "KBXM_DUtils.aspx",
                data: { xdata: fb_data.opts.xdata, g: g, method: 'formconvertfromxml', formname: formName },
                success: function (data) {
                    if (fb_data.opts.convertFormHandler) {
                        fb_data.opts.convertFormHandler(data);
                    }
                },
                error: function (data) {
                    kbxmShowDialog(XMLHttpRequest.responseText, "error", [180, 125]);
                },
                cache: false
            });
        },
        newForm: function (useTextEditor, isGlobal) {

            var container = $(this);
            reset(container);
            var data = container.data(dataID);
            // set flag to indicate the form is being created
            data.isEditingForm = false;
            if (isGlobal) data.opts.globalForm = true;
            data.useTextEditor = useTextEditor;
            if (!useTextEditor) {
                data.createFormButton.show();
                data.updateFormButton.hide();
                data.cancelFormButton.show();
                container.find('div#xmp-formbuilder-buttons').show();
                container.find('div#xmp-texteditor-buttons').hide();
                container.find('#work-area').show()
            } else {
                container.find('div#xmp-formbuilder-buttons').hide();
                container.find('div#xmp-texteditor-buttons').show();
                container.find('#work-area').hide();
                // use plain text editor and not form builder
                // only show settings tab
                data.toolbar.tabs('select', 0);
                data.toolbar.find('ul.xmp-toolbar-tabs li:eq(1)').hide();
                data.toolbar.find('ul.xmp-toolbar-tabs li:eq(2)').hide();
                data.createFormButton.hide();
                data.updateFormButton.hide();
                data.cancelFormButton.hide();
                data.canvas.hide();
            }
        },
        editForm: function (formName, isGlobal) {
            var container = $(this);
            var fb_data = container.data(dataID);
            var opts = fb_data.opts;
            opts.globalForm = isGlobal;
            var FormNameBox = fb_data.formNameBox;
            var FormNameLabel = fb_data.formNameLabel;
            var TableList = fb_data.tableList;
            var KeyFieldList = fb_data.keyFieldList;
            var dataOptionList = fb_data.dataOptionList;
            var activeRow = fb_data.activeRow;
            var createFormButton = fb_data.createFormButton;
            var updateFormButton = fb_data.updateFormButton;
            // set the flag to indicate a form is being edited
            fb_data.isEditingForm = true;

            // ensure FB is in a consistent state
            reset(container);

            $.ajax({
                type: "POST",
                datatype: "xml",
                url: "KBXM_Manage.aspx",
                data: {
                    xdata: opts.xdata,
                    callback: 'editform',
                    itemname: formName,
                    g: (opts.globalForm ? "1" : "0")
                },
                success: function (data) {
                    var $data = $(data);
                    if ($data.find("Forms").length > 0) {
                        // An XML config file exists, load it.
                        container.find('div#xmp-formbuilder-buttons').show();
                        container.find('div#xmp-texteditor-buttons').hide();
                        // set the form name
                        FormNameBox.val(formName).hide();
                        FormNameLabel.text(formName).show();
                        // set the form styling
                        var theme = $data.find("Forms Style").attr("Theme");
                        var labelAlign = $data.find("Forms Style").attr("LabelAlign");
                        var labelWidth = $data.find("Forms Style").attr("LabelWidth");
                        var roundCorners = $data.find("Forms Style").attr("RoundCorners");
                        fb_data.themeList.val(theme);
                        fb_data.themeList.change();
                        fb_data.labelAlignList.val(labelAlign);
                        fb_data.labelWidthBox.val(labelWidth);
                        $('#chkUseRoundedCorners')[0].checked = (roundCorners == "True") ? true : false;

                        // set the table data
                        var tblName = $data.find("Forms Form Data").attr("TableName");
                        var keyField = $data.find("Forms Form Data").attr("Key");
                        var connStr = $data.find("Forms Form Data").attr("ConnectionString");
                        var dataSourceType = (connStr) ? "ext_table" : "dnn_table";
                        // If no table was ever selected, dnn_table should be removed (PR)
                        dataSourceType = (tblName === undefined) ? "" : dataSourceType;
                        var selFields = $data.find("Forms Form Data").attr("SelectedFields");
                        var arrSelFields = [];
                        if (selFields) {
                            arrSelFields = selFields.split(",");
                        }

                        $('#data-options').dataChooser({
                            "xdata": opts.xdata,
                            "initDataSourceType": dataSourceType,
                            "initConnectionString": connStr,
                            "initSelectedTable": tblName,
                            "initSelectedFields": arrSelFields,
                            "initSelectedKeyFields": [keyField],
                            "onSelectedFieldsChanged": function (selectedFields) {
                                if (selectedFields.length) {
                                    container.find('#xmp-formbuilder-create').show();
                                    loadDataFieldControls(container, selectedFields);

                                } else {
                                    container.find('#xmp-formbuilder-create').hide();
                                }
                                // hide/show the drop-down or textbox used for entering DataFields on the desigers
                                // based on the DataOption selected.
                                setDataFieldControls(container);
                            }
                        });
                        loadDataFieldControls(container, $('#data-options').dataChooser('getSelectedFields'));
                        
                        /*
                        if (connStr) {
                        fb_data.dataOptionList.val('ext');
                        fb_data.dataOptionList.change();
                        fb_data.connectionStringBox.val(connStr);
                        loadTables(container, tblName, keyField, connStr);
                        TableList.parent().show();
                        KeyFieldList.parent().show();
                        } else {
                        if (tblName) {
                        fb_data.dataOptionList.val('dnn');
                        loadTables(container, tblName, keyField);
                        TableList.parent().show();
                        KeyFieldList.parent().show();
                        } else {
                        fb_data.dataOptionList.val('');
                        }
                        }
                        */

                        // set buttons tab values
                        setFormButtons(container, data);
                        var ctrls = getFormControls(data);
                        for (var i = 0; i < ctrls.length; i++) {
                            activeRow = addControlToCanvas(ctrls[i], container);
                            activeRow.data(keyControlData, ctrls[i]);
                            activeRow.find('li').click(function () {
                                toolbarClick(container, $(this));
                            });
                        }
                        updateFormButton.show();
                        createFormButton.hide();
                        container.show();
                        // apply styling
                        setFormStyle();
                    } else {
                        container.find('div#xmp-formbuilder-buttons').hide();
                        container.find('div#xmp-texteditor-buttons').show();
                    }
                }
            });
        },
        previewForm: function (formName) {

        }
    };

    $.fn.formBuilder = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.formBuilder');
        }
    };
    //    // will only be used on one instance.
    //    //return this.each(function() { }); // this.each(function())

    function initialize(container) {
        var data = container.data(dataID);
        var opts = data.opts;
        container.html(
        '<div id="xmp-canvas-toolbar" style="height: auto;">' +
        '  <ul class="xmp-toolbar-tabs">' +
        '    <li><a href="#sectionSettings">' + opts.settingsLabel + '</a></li>' +
        '    <li><a href="#sectionButtons">' + opts.buttonsLabel + '</a></li>' +
        '    <li><a href="#sectionStyling">' + opts.stylingLabel + '</a></li>' +
        '  </ul>' +
        '  <div id="sectionSettings" class="section">Settings section</div>' +
        '  <div id="sectionButtons" class="section">Buttons section</div>' +
        '  <div id="sectionStyling" class="section">Styling section</div>' +
        '</div>' +
        '<div style="position:relative;" id="work-area">' +
        '<h3 class="ui-widget ui-widget-header ui-corner-all" style="width: 176px;padding: 6px 0px 6px 5px; margin: 4px 0 3px 0;">Controls</h3>' +
        '<div id="sectionControls" style="width:182px;padding-top:5px;"></div>' +
        '<div id="canvasContainer" style="width:680px;margin-left:10px;position: absolute; left: 190px; top: 0px; padding: 0px">' +
        '<h3 class="ui-widget ui-widget-header ui-corner-all" style="padding:6px 0px 6px 5px; margin: 0px 0 3px 0;">Form</h3>' +
        '<div id="canvas" class="ui-widget ui-widget-content" style="overflow:scroll;resize:vertical;min-height:400px;max-height:760px;margin-top:10px; margin-bottom: 15px;"></div>' +
        '<input type="button" class="xmp-fb-create" value="Create Form" />' +
        '<input type="button" class="xmp-fb-update" value="Update Form" />' +
        '<input type="button" class="xmp-fb-cancel" value="Cancel" style="margin-left: 10px;"/>' +
        '</div>' +
        '</div>'
      );
        var toolbar = container.find('#xmp-canvas-toolbar');
        data.toolbar = toolbar;
        data.canvas = container.find('#canvas');
        data.sectionControls = container.find('#sectionControls'); //toolbar.find('#sectionControls');
        data.sectionStyling = toolbar.find('#sectionStyling');
        data.sectionSettings = toolbar.find('#sectionSettings');
        data.sectionButtons = toolbar.find('#sectionButtons');
        data.sectionEvents = toolbar.find('#sectionEvents');
        createSectionSettings(container);
        createSectionButtons(container);
        createSectionStyling(container);
        createSectionControls(container);
        //createSectionEvents(container); 
        toolbar.tabs();
        data.sectionControls.accordion({ autoHeight: false, active: 2 });

        var createFormButton = container.find('.xmp-fb-create');
        data.createFormButton = createFormButton
        var updateFormButton = container.find('.xmp-fb-update');
        data.updateFormButton = updateFormButton
        var cancelFormButton = container.find('.xmp-fb-cancel');
        data.cancelFormButton = cancelFormButton

        loadThemes(container);

        // style and apply input restrictions on control designers
        $('.designer-listitems').adminList();
        $('.designer-height').css({ 'width': '50px' }).alphanumeric();
        $('.designer-width').css({ 'width': '50px' }).alphanumeric();
        $('.designer-maxlength').css({ 'width': '75px' }).numeric();

        $('.val-commandbuttons li').addClass('ui-state-default ui-corner-all ui-helper-reset')
                                 .css({ 'width': '18px', 'cursor': 'pointer', 'padding': '1px 0px 2px 2px', 'margin-bottom': '3px' })
                                 .hover(function () { $(this).addClass('ui-state-hover') },
                                        function () { $(this).removeClass('ui-state-hover') });
        $('.val-commandbuttons li span:first').addClass('ui-icon ui-icon-plus');
        $('.val-commandbuttons li span:last').addClass('ui-icon ui-icon-close');

        // Add-in data field text boxes and hide them. These are used when there is no DataSource
        $('#properties select.designer-datafield').addClass('designer-datafield-dropdown').hide().parent().append(
        '<input type="text" class="designer-datafield designer-datafield-textbox is-active"/>').show();

        var $valDesigner = $("#designer-validate");
        $valDesigner.find('select.validation-type-selector').change(function () {
            $valDesigner.find('.val-required').hide();
            $valDesigner.find('.val-regex').hide();
            $valDesigner.find('.val-email').hide();
            $valDesigner.find('.val-compare').hide();
            $valDesigner.find('.val-range').hide();
            $valDesigner.find('.val-checkbox').hide();
            $valDesigner.find('.val-checkboxlist').hide();
            switch ($(this).val()) {
                case 'required':
                    $valDesigner.find(".val-required").show();
                    break;
                case 'regex':
                    $valDesigner.find(".val-regex").show();
                    break;
                case 'email':
                    $valDesigner.find(".val-email").show();
                    break;
                case 'compare':
                    $valDesigner.find(".val-compare").show();
                    break;
                case 'range':
                    $valDesigner.find(".val-range").show();
                    break;
                case 'checkbox':
                    $valDesigner.find(".val-checkbox").show();
                    break;
                case 'checkboxlist':
                    $valDesigner.find(".val-checkboxlist").show();
                    break;
            }
        });

        // setup events for control data source designer
        var $cdsDesigner = $('#designer-controldatasource');
        var $cdsDataSourceList = $cdsDesigner.find('.designer-datasource');
        var $cdsConnStrBox = $cdsDesigner.find('.designer-connectionstring');
        var $cdsTableList = $cdsDesigner.find('.designer-tables');
        var $cdsColumnList = $cdsDesigner.find('.designer-columns');
        var $cdsSortBy = $cdsDesigner.find('.designer-sortcolumns');
        var $cdsSortOrder = $cdsDesigner.find('.designer-sortorder');
        var $cdsLoadExtTables = $cdsDesigner.find('.designer-loadexttables');
        $cdsDesigner.find('div').css({ 'overflow': 'hidden', 'display': 'none' });
        $cdsDesigner.find('div:eq(0)').show();
        $cdsDesigner.find('div:eq(1)').show();
        $cdsDataSourceList.change(function () {
            if ($(this).val() == 'ext') {
                $cdsConnStrBox.parent().show();
                $cdsTableList.parent().hide();
                $cdsColumnList.parent().hide();
            } else {
                $cdsConnStrBox.val('').parent().hide();
                $cdsColumnList.html('').parent().hide();
                $cdsTableList.parent().show();
                $cdsDataSourceList.after('<span class="xmp-progress"/>');
                getTables(true, null,
            function (data) {
                $cdsDesigner.find('.xmp-progress').remove();
                $cdsTableList.html('<option value=""/>').append(data);
            },
            function (xhr, responseText, errorThrown) {
                $cdsDesigner.find('.xmp-progress').remove();
            });
            }
        });
        $cdsLoadExtTables.click(function () {
            $cdsDataSourceList.after('<span class="xmp-progress"></span>');
            getTables(true, $cdsConnStrBox.val(),
          function (data) {
              $cdsDataSourceList.after('<span class="xmp-progress"/>');
              $cdsTableList.html(data).parent().show();
          },
          function (xhr, responseText, errorThrown) {
              $cdsDesigner.find('.xmp-progress').remove();
          });
        });
        $cdsDesigner.find('.designer-tables').change(function () {
            if ($(this).val()) {
                getColumns($(this).val(), $cdsConnStrBox.val(), true, function (data) {
                    $cdsColumnList.html(data).parent().show();
                    $cdsSortBy.html(data).parent().show();
                    $cdsSortOrder.parent().show();
                });
            } else {
                $cdsColumnList.html('').parent().hide();
                $cdsSortBy.html('').parent().hide();
                $cdsSortOrder.parent().hide();
            }
        });

        // setup events for loading/setting ControlDataSource values on controls
        $('.xmp-designer designer-datavaluefield').parent().hide(); //DataTextField
        $('.xmp-designer designer-datavaluefield').parent().hide(); //DataValueField
        $('.xmp-designer designer-append-databounditems').parent().hide(); //AppendDBItems
        $('.xmp-designer select.designer-datasource-listing').change(function () {
            var $this = $(this);
            var TextList = $this.parent().next().find('.designer-datatextfield');
            var ValueList = $this.parent().next().next().find('.designer-datavaluefield');
            var Append = $this.parent().parent().find('.designer-append-databounditems');
            if ($this.val()) {
                // show other rows and load them
                // get the control data source with the specified ID
                var cds = getControlById(container, $this.val(), "ControlDataSource");
                if (cds) {
                    TextList.html('');
                    ValueList.html('');
                    for (var i = 0; i < cds.Columns.length; i++) {
                        TextList.append('<option value="' + cds.Columns[i] + '">' + cds.Columns[i] + '</option>');
                        ValueList.append('<option value="' + cds.Columns[i] + '">' + cds.Columns[i] + '</option>');
                    }
                    TextList.parent().show();
                    ValueList.parent().show();
                    Append.parent().show();
                }
            } else {
                TextList.html('').parent().hide();
                ValueList.html('').parent().hide();
                Append.get(0).checked = false;
                Append.parent().hide();
            }
        });

        // assign events
        createFormButton.click(function () {
            var bIsValid = validateForm(container);
            if (!bIsValid) { return false; }
            createFormButton_Click(container);
        }); // create button click

        updateFormButton.click(function () {
            if (!validateForm(container)) { return false; }
            updateFormButton_Click(container);
        }); // update button click

        cancelFormButton.click(function () {
            reset(container);
            if (opts.cancelFormHandler) opts.cancelFormHandler();
        }); // cancel button click

    } // init()

    // creates thes FormBuilder form
    function createFormButton_Click(container) {
        var data = container.data(dataID);
        var opts = data.opts;
        var ds = $('#data-options').dataChooser('getDataSettings');

        // If external SQL, get connection string 
        var connStr = '';
        if (ds.dataSourceType == 'ext_table') {
            connStr = ds.connectionString;
        }
        var sXml = createFormXml(container);
        var global = (opts.globalForm ? "1" : "0");
        jQuery.ajax({
            type: "POST",
            datatype: "xml",
            url: 'KBXM_DUtils.aspx',
            data: {
                xdata: opts.xdata,
                method: 'formfromxml',
                connstr: connStr,
                formdef: sXml,
                isnew: true,
                formname: data.formNameBox.val(),
                g: global
            },
            success: function (data) {
                if (data.success) {
                    reset(container);
                    if (opts.createFormHandler) opts.createFormHandler(data);
                } else {
                    kbxmShowDialog(data.msg, "error", [180, 125]);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var results = $.parseJSON(XMLHttpRequest.responseText);
                kbxmShowDialog(XMLHttpRequest.responseText, "error", [180, 125]);
            },
            cache: false
        });
    } // createFormButton_Click()

    // updates the FormBuilder form
    function updateFormButton_Click(container) {
        var data = container.data(dataID);
        var opts = data.opts;
        var global = (opts.globalForm ? "1" : "0");

        // If external SQL, get connection string 
        var connStr = '';
        var ds = $('#data-options').dataChooser("getDataSettings");
        if (ds.dataSourceType == 'ext_table') {
            connStr = ds.connectionString;
        }
        var sXml = createFormXml(container);
        jQuery.ajax({
            type: "POST",
            datatype: "xml",
            url: 'KBXM_DUtils.aspx',
            data: {
                xdata: opts.xdata,
                method: 'formfromxml',
                connstr: connStr,
                formdef: sXml,
                formname: data.formNameLabel.text(),
                g: global
            },
            success: function (data) {
                reset(container);
                if (opts.updateFormHandler) opts.updateFormHandler(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                kbxmShowDialog(XMLHttpRequest.responseText, "error", [180, 125]);
            },
            cache: false
        });
        
        
    } // updateFormButton_Click()

    function createSectionSettings(container) {
        var fb_data = container.data(dataID);
        var sectionSettings = fb_data.sectionSettings;
        var opts = fb_data.opts;

        sectionSettings.html(
              '<div><label for="txtFormName" class="settings-form-name">' + opts.formNameLabel + '</label> ' +
              '     <input id="txtFormName" class="settings-form-name" />' +
                   '<label id="lblFormName" class="settings-form-name-label"></label>' +
              '</div>' +
              '<div id="data-options"></div>' +
              '<div id="xmp-formbuilder-buttons" style="clear: left; margin-left: 120px; padding-top: 10px;"> ' +
              '  <div style="clear: left;">' + 
              '    <input type="checkbox" id="xmp-formbuilder-autovalidate" style="float: left;" />' + 
              '    <label style="float:right;" for="xmp-formbuilder-autovalidate">' + opts.createAutoValidateLabel + '</label>' +  
              '  </div>' + 
              '  <input type="button" id="xmp-formbuilder-create" value="' + opts.createAutoFormLabel + '" />' + 
              '</div>' +
              '<div id="xmp-texteditor-buttons" style="clear: left; margin-left: 80px; padding-top: 10px;"> ' +
              '  <input type="button" id="xmp-texteditor-create" value="' + opts.createFormLabel + '" />' +
              '  <input type="button" id="xmp-texteditor-cancel" value="' + opts.cancelFormLabel + '" style="margin-left: 5px;" />' +
              '</div>'
            );
        sectionSettings.find('img').attr({ 'src': 'images/ajax-loader.gif', 'alt': 'Processing', 'title': 'Processing...' })
                                       .css({ 'display': 'none', 'margin-left': '5px' });
        // styling
        sectionSettings.find('div label').css({ 'display': 'block', 'float': 'left', 'width': '120px' });
        sectionSettings.find('div').css({ 'margin-bottom': '5px', 'overflow': 'hidden' });
         
        fb_data.formNameBox = sectionSettings.find('#txtFormName');
        fb_data.formNameLabel = sectionSettings.find('#lblFormName');

        // Test of the Data Chooser in the Form Builder
        var dataChooser = $('#data-options');
        dataChooser.dataChooser({
            'xdata': opts.xdata
            , 'onSelectedFieldsChanged': function (selectedFields) {
                if (selectedFields.length) {
                    container.find('#xmp-formbuilder-create').show();
                    loadDataFieldControls(container, selectedFields);
                } else {
                    container.find('#xmp-formbuilder-create').hide();
                }
                // hide/show the drop-down or textbox used for entering DataFields on the desigers
                // based on the DataOption selected.
                setDataFieldControls(container);
            }
        });

        sectionSettings.find('#xmp-texteditor-create').click(function () {
            // ensure form settings are OK
            var arrErrors = new Array;
            if (fb_data.isEditingForm == false) {
                if (fb_data.formNameBox.val().length < 1) {
                    arrErrors.push("Please provide a name for the form (use only letters, numbers, hyphens (-) and underscores (_)");
                } else {
                    var patt = new RegExp("[^A-Za-z0-9_\-]");
                    if (patt.test(fb_data.formNameBox.val())) {
                        arrErrors.push("The form name contains illegal characters. Please use only letters, numbers, hyphens (-) and underscores (_)");
                    }
                }
            }
            if (arrErrors.length > 0) { displayErrorDlg(arrErrors, sectionSettings); return false; }

            var ds = dataChooser.dataChooser("getDataSettings");

            if (ds.dataSourceType == '') {
                var defForm =
                  '<AddForm>\n' +
                  '  <SubmitCommand CommandText="" />\n\n' +
                  '  <Label For="txtFieldOne" Text="Field One:" />\n' +
                  '  <TextBox Id="txtFieldOne" DataField="FieldOne" DataType="string" /> <br />\n\n' +
                  '  <AddButton Text="Add" /> &nbsp;<CancelButton Text="Cancel" />\n' +
                  '</AddForm>\n\n' +
                  '<EditForm>\n' +
                  '  <SelectCommand CommandText="" />\n' +
                  '  <Submitcommand CommandText="" />\n\n' +
                  '  <Label For="txtFieldOne" Text="Field One:" /> \n' +
                  '  <TextBox Id="txtFieldOne" DataField="FieldOne" DataType="string" /> <br />\n\n' +
                  '  <UpdateButton Text="Update" /> &nbsp;<CancelButton Text="Cancel"/>\n' +
                  '  <Textbox Id="txtKey" DataField="KeyFieldName" DataType="int32" Visible="False" />\n' +
                  '</EditForm>\n\n';
                kbxmSplitForm(defForm, opts.addFormTextEditor, opts.editFormTextEditor);
                $EditorPanel.find('#ItemEditTitle').text(fb_data.formNameBox.val());
                $('#txtItemSaveEdit').hide();
                $('#txtItemSaveNew').show();
                $EditorPanel.show();
                if (opts.addFormTextEditor) opts.addFormTextEditor.refresh()
                if (opts.editFormTextEditor) opts.editFormTextEditor.refresh()
                container.hide();
            }
            else {
                var connStr = '';
                if (ds.dataSourceType == 'ext_table') {
                    connStr = ds.connectionString;
                    if (!connStr) {
                        kbxmShowDialog('Please supply a valid connection string for the external data source', "Error", [180, 125]);
                        return false;
                    }
                }
                var addValidation = ($('#xmp-formbuilder-autovalidate').get(0).checked) ? "1" : "0";
                $.ajax({
                    type: "POST",
                    datatype: "html",
                    url: "KBXM_DUtils.aspx",
                    data: {
                        method: 'formfromtable',
                        addvalidation: addValidation, 
                        name: ds.selectedTable,
                        keyfield: ds.keyFields[0],
                        fields: ds.selectedFields.toString(),
                        connstr: connStr,
                        output: '',
                        options: '',
                        xdata: opts.xdata
                    },
                    success: function (results) {
                        if (results.indexOf('ERROR') == 0) {
                            kbxmShowDialog(results, "error", [180, 125]);
                        } else {
                            kbxmSplitForm(results, opts.addFormTextEditor, opts.editFormTextEditor);
                            $EditorPanel.find('#ItemEditTitle').text(fb_data.formNameBox.val());
                            $('#txtItemSaveEdit').hide();
                            $('#txtItemSaveNew').show();
                            $EditorPanel.show();
                            if (opts.addFormTextEditor) opts.addFormTextEditor.refresh()
                            if (opts.editFormTextEditor) opts.editFormTextEditor.refresh()
                            container.hide();
                        }
                    },
                    error: function (results) {
                        kbxmShowDialog(XMLHttpRequest.responseText, "error", [180, 125]);
                    },
                    cache: false
                }); // $.ajax()
            } // else
        }); //#xmp-texteditor-create.click

        sectionSettings.find('#xmp-texteditor-cancel').click(function () {
            if (opts.cancelFormHandler) { opts.cancelFormHandler(); }
        }); // xmp-texteditor-cancel.click()

        sectionSettings.find('#xmp-formbuilder-create').click(function (event) {
            event.preventDefault;
            var ds = $('#data-options').dataChooser('getDataSettings');
            // create form from selected table
            if (ds.selectedTable && ds.keyFields.length) {
                var tblName = ds.selectedTable;
                var tblKey = ds.keyFields[0];
                var connStr = (ds.connectionString) ? ds.connectionString : '';
                var addValidation = ($('#xmp-formbuilder-autovalidate').get(0).checked) ? "1" : "0";

                $.ajax({
                    type: "POST",
                    dataType: "xml",
                    url: 'KBXM_DUtils.aspx',
                    data: {
                        method: 'formxmlfromtable',
                        name: tblName,
                        keyfield: tblKey,
                        addvalidation: addValidation, 
                        fields: ds.selectedFields.toString(),
                        connstr: connStr,
                        xdata: opts.xdata
                    },
                    success: function (data) {
                        clearCanvas(container);
                        var $data = $(data);
                        if ($data.find("Forms").length > 0) {
                            // An XML config file exists, load it.
                            // set the form styling
                            var theme = $data.find("Forms Style").attr("Theme");
                            var labelAlign = $data.find("Forms Style").attr("LabelAlign");
                            var labelWidth = $data.find("Forms Style").attr("LabelWidth");
                            // Patrick: Removed the value changes below. Not needed on auto generated form.
                            //fb_data.themeList.val(theme);
                            //fb_data.labelAlignList.val(labelAlign);
                            //fb_data.labelWidthBox.val(labelWidth);
                            // set buttons tab values
                            //setFormButtons(container, data);
                            var ctrls = getFormControls(data);
                            for (var i = 0; i < ctrls.length; i++) {
                                activeRow = addControlToCanvas(ctrls[i], container);
                                activeRow.data(keyControlData, ctrls[i]);
                                activeRow.find('li.xmp-control-toolbar').click(function () {
                                    toolbarClick(container, $(this));
                                });
                            } // for i
                            //fb_data.updateFormButton.show();
                            //fb_data.createFormButton.hide();
                            container.show();
                            // apply styling
                            setFormStyle();
                        } // if data.find("Forms").length > 0
                        setCreateButtonState(container);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        kbxmShowDialog(XMLHttpRequest.responseText, opts.errorLabel, [180, 125]);
                        setCreateButtonState(container);
                    },
                    cache: false
                }); // $.ajax
                return false;
            } //if (tableList.val() && keyFieldList.val())
        }); //sectionSettings.find('#xmp-formbuilder-create').click

    } // createSectionSettings()

    // created the tab content for the section where the user can define the AddButton, UpdateButton, and CancelButton for the form.
    function createSectionButtons(container) {
        var data = container.data(dataID);
        var sectionButtons = data.sectionButtons;
        var opts = data.opts;

        sectionButtons.html(
        '<div>' +
                '<label>' + opts.addFormButtonLabel + '</label>' +
                '<input type="text" id="txtAddFormAddButtonText" value="Add" />' +
        '</div>' +
        '<div>' +
                '<label>' + opts.editFormButtonLabel + '</label>' +
                '<input type="text" id="txtEditFormUpdateButtonText" value="Update" />' +
        '</label>' +
        '</div>' +
        '<div>' +
        '<label for="chkIncludeCancelButton">' + opts.includeCancelButtonLabel + '</label>' +
        '<input type="checkbox" id="chkIncludeCancelButton" checked="checked" /> ' +
        '</div>' +
        '<div id="divCancelButtonTextPanel">' +
                '  <label>' + opts.cancelFormButtonLabel + '</label>' +
                '  <input type="text" id="txtCancelButtonText" value="Cancel" />' +
        '</div>')
        .find('div').css({ 'overflow': 'hidden', 'margin-top': '5px' });
        sectionButtons.find('div > label').css({ 'display': 'block', 'float': 'left', 'width': '130px', 'text-align': 'right', 'margin-right': '10px' });

        sectionButtons.find('#chkIncludeCancelButton').click(function () {
            setCancelButtonTextPanelVisibility(container);
        });
    } // createSectioButtons()

    function createSectionControls(container) {
        var data = container.data(dataID);
        var sectionControls = data.sectionControls;

        sectionControls.html(
        '<h4><a href="#">Actions</a></h4>' +
        '<ul class="xmp-control-list">' +
                '  <li><a href="#addtoroles">Add To Roles</a></li>' +
                '  <li><a href="#adduser">Add User</a></li>' +
                '  <li><a href="#login">Login</a></li>' +
                '  <li><a href="#email">Send Email</a></li>' +
                '  <li><a href="#redirect">Redirect to URL</a></li>' +
                '  <li><a href="#removefromroles">Remove From Roles</a></li>' +
        '</ul>' +
        '<h4><a href="#">Display</a></h4>' +
        '<ul class="xmp-control-list">' +
            '  <li><a href="#text">Data Bound Text</a></li>' +
            '  <li><a href="#label">Label</a></li>' +
        '</ul>' +
        '<h4><a href="#">Input</a></h4>' +
        '<ul class="xmp-control-list">' +
        '  <li><a href="#textbox">Text Box</a></li>' +
                '  <li><a href="#textarea">Text Area</a></li>' +
                '  <li><a href="#dateinput">Date Input</a></li>' +
                '  <li><a href="#htmlinput">HTML Input</a></li>' +
        '</ul>' +
        '<h4><a href="#">Lists</a></h4>' +
        '<ul class="xmp-control-list">' +
                '  <li><a href="#dropdownlist">Drop-Down List</a></li>' +
                '  <li><a href="#listbox">List Box</a></li>' +
                '  <li><a href="#duallist">Dual List</a></li>' +
                '  <li><a href="#checkboxlist">Checkbox List</a></li>' +
                '  <li><a href="#radiobuttonlist">Radio Button List</a></li>' +
        '</ul>' +
        '<h4><a href="#">Option Choosers</a></h4>' +
        '<ul class="xmp-control-list">' +
                '  <li><a href="#checkbox">Checkbox</a></li>' +
                '  <li><a href="#radiobutton">Radio Button</a></li>' +
        '</ul>' +
        '<h4><a href="#">Other</a></h4>' +
        '<ul class="xmp-control-list">' +
                '  <li><a href="#fileupload">File Upload</a></li>' +
                '  <li><a href="#validationsummary">Validation Summary</a></li>' +
                '  <li><a href="#controldatasource">Control Data Source</a></li>' +
        '</ul>');
        sectionControls.find('li a').css({ 'text-decoration': 'none' });
        sectionControls.find('ul').css({ 'padding': '0px' }).find('li').css({ 'margin': '3px 5px', 'padding': '5px 10px' })
        .addClass('ui-corner-all').hover(
            function () { $(this).addClass('ui-state-hover').css({ 'cursor': 'pointer' }) },
            function () { $(this).removeClass('ui-state-hover').css({ 'cursor': 'default' }) })
        .click(function (e) {
            controlPickerClick(container, $(this).find('a').attr('href'));
        });


        // create events
        /*
        sectionControls.find('ul.xmp-control-list a').click(function(event) {
        controlPickerClick(container, $(this).attr('href'));
        event.stopPropagation();
        }); // ControlPicker('a').click()
        */
    } // createSectionControls()

    function createSectionStyling(container) {
        var data = container.data(dataID);
        var sectionStyling = data.sectionStyling;
        var opts = data.opts;

        sectionStyling.html(
                '<label>' + opts.themeLabel + '</label>' +
                '<select size="1" id="ddlFormTheme"></select>' +
                '<label>' + opts.alignmentLabel + '</label>' +
                '<select size="1" id="ddlFormAlignment">' +
                '  <option value="left" selected="selected">' + opts.leftAlignLabel + '</option>' +
                '  <option value="right">' + opts.rightAlignLabel + '</option>' +
                '  <option value="top">' + opts.topAlignLabel + '</option>' +
                '</select>' +
                '<label>' + opts.labelWidthLabel + '</label>' +
                '<input type="text" id="txtLabelWidth" />' +
                '<div id="divUseRoundedCorners" style="display:none;padding-left: 45px; margin-top: 8px;">' +
                '  <input type="checkbox" id="chkUseRoundedCorners" />' +
                '  <label for="chkUseRoundedCorners">Use Rounded Corners on Supported Browsers</label>' +
                '</div>');
        ThemeList = sectionStyling.find('#ddlFormTheme');
        data.themeList = ThemeList;
        LabelAlignList = sectionStyling.find('#ddlFormAlignment');
        data.labelAlignList = LabelAlignList;
        LabelWidthBox = sectionStyling.find('#txtLabelWidth');
        data.labelWidthBox = LabelWidthBox;

        // styling of controls
        ThemeList.css({ 'margin-right': '20px' });
        LabelAlignList.css({ 'margin-right': '20px' });
        LabelWidthBox.css({ 'width': '50px' }).numeric(); //only allow number input

        // create events
        ThemeList.change(function () {
            var curVal = $(this).val();
            if (curVal == 'dnn' || curVal == 'none') {
                $('#divUseRoundedCorners').hide();
            } else {
                $('#divUseRoundedCorners').show();
            }
            setFormStyle();
        });
        LabelAlignList.change(function () {
            setFormStyle();
        });
        $('#chkUseRoundedCorners').click(function () {
            setFormStyle();
        });
        LabelWidthBox.blur(function () { setFormStyle(); });
    } // createSectionStyling()

    function clearCanvas(container) {
        var data = container.data(dataID);
        data.canvas.find('.' + style_Row).remove();
        setCreateButtonState(container);
    }

    function reset(container) {

        var data = container.data(dataID);
        var opts = data.opts;
        $('#xmp-canvas-toolbar').tabs('select', 0);
        clearCanvas(container);
        data.canvas.show();
        data.formNameBox.val('').show();
        data.formNameLabel.val('').hide();
        data.toolbar.find('ul.xmp-toolbar-tabs li').show(); // ensure all tabs are shown.
        // remove any buttons added by use of plain text editor previously
        data.sectionSettings.find('.xmp-texteditor-buttons').remove();
        // reset the data options
        container.find('#data-options').dataChooser({
            'xdata': opts.xdata
            , 'onSelectedFieldsChanged': function (selectedFields) {
                if (selectedFields.length) {
                    container.find('#xmp-formbuilder-create').show();
                    loadDataFieldControls(container, selectedFields);
                } else {
                    container.find('#xmp-formbuilder-create').hide();
                }
                // hide/show the drop-down or textbox used for entering DataFields on the desigers
                // based on the DataOption selected.
                setDataFieldControls(container);
            }
        });
        //data.dataOptionList.val('');
        //data.dataOptionList.change();
        //data.keyFieldList.find('option').remove();
        //data.tableList.find('option').remove();
        //data.connectionStringBox.val('');
        container.find('#xmp-formbuilder-create').hide();
        // clear theme
        data.themeList.val('dnn');
        data.themeList.change();
        // clear any error messages
        container.find('.xmp-fb-validation-messages').remove();

        /*
            Kelly, please verify this. 
            If a form is created or edited that utilizes a datasource, the dropdown is shown for data-field in the designer
            dialogs. On cancel, save, or update, these fields are not being cleared. This code may better serve in a different location
            but this seems to work. It's resetting the default to be the textbox for data-field.

            This should work on all shared datafield (textbox, textarea, ddl, etc)
        */
        var $designer = $('.xmp-designer');
        $designer.find('select.designer-datafield').removeClass('is-active').hide().html("");
        $designer.find('input[type="text"].designer-datafield').addClass('is-active').show().val("");

    } // reset()

    function loadThemes(container) {
        var data = container.data(dataID);
        var opts = data.opts;
        var ThemeList = data.themeList;

        $.ajax({
            type: "POST",
            dataType: "html",
            url: 'KBXM_Manage.aspx',
            data: { callback: 'loadthemeslist', xdata: opts.xdata },
            success: function (data) {
                ThemeList.html('<option value="none" selected="selected">' + opts.noneSelectedLabel + '</option>' +
                         '<option value="dnn">' + opts.dnnStylingLabel + '</option>').append(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                kbxmShowDialog(XMLHttpRequest.responseText, opts.errorLabel, [180, 125]);
            },
            cache: false
        });
    } // loadThemes()

    // optional: selectedTable, selectedKey - pass-in to pre-select them in the list if they are in loaded list.
    function loadTables(container, selectedTable, selectedKey, connStr) {
        var data = container.data(dataID);
        var opts = data.opts;
        var TableList = data.tableList;
        var functionData = null;

        // adjust function call based on whether this is a DNN or external SQL DB
        if (connStr) {
            var connection = connStr;
            functionData = { method: 'gettablesext', connstr: connection, xdata: opts.xdata };
        } else {
            functionData = { method: 'gettables', xdata: opts.xdata };
        }

        $('#kbxmProgressLoadTables').show();
        $.ajax({
            type: "POST",
            dataType: "html",
            url: 'KBXM_DUtils.aspx',
            data: functionData,
            success: function (data) {
                TableList.html('<option value="" selected="selected" />').append(data);
                if (selectedTable) {
                    TableList.val(selectedTable);
                    // load the columns and pre-select the key
                    loadColumns(selectedTable, true, container, selectedKey, connStr);
                }
                $('#kbxmProgressLoadTables').hide();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                kbxmShowDialog(XMLHttpRequest.responseText, opts.errorLabel, [180, 125]);
                $('#kbxmProgressLoadTables').hide();
            },
            cache: false
        });
    } // loadTables()

    function loadColumns(tableName, includeViews, container, selectedKey, connStr) {
        var data = container.data(dataID);
        var opts = data.opts;
        var KeyFieldList = data.keyFieldList;

        $('#kbxmProgressLoadCols').show();
        var methodName = "gettablecols";
        if (includeViews) {
            if (connStr) { methodName = "gettableorviewcolsext"; }
            else { methodName = "gettableorviewcols"; }
        } else {
            if (connStr) { methodName = "gettablecolsext"; }
        }

        if (!connStr) connStr = '';

        jQuery.ajax({
            type: "POST",
            dataType: "html",
            url: 'KBXM_DUtils.aspx',
            data: { method: methodName, name: tableName, xdata: opts.xdata, connstr: connStr },
            success: function (data) {
                KeyFieldList.html('<option value=""></option>').append(data);
                if (selectedKey) {
                    KeyFieldList.val(selectedKey);
                }
                $('#kbxmProgressLoadCols').hide();
                // Populate column selector on control designers
                $('select.designer-datafield').html('<option value=""></option>').append(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                kbxmShowDialog(XMLHttpRequest.responseText, opts.errorLabel, [180, 125]);
                $('#kbxmProgressLoadCols').hide();
            },
            cache: false
        });
    }

    function addControlToCanvas(ctl, container) {
        var data = container.data(dataID);
        var canvas = data.canvas;

        // adds a control row to the canvas and returns that row as a jQuery object
        // look for the last validation summary control and insert above that, if it exists
        var vs = canvas.find('.xmp-canvas-ctrl-ValidationSummary');
        var lastRow = null;
        if (vs.length > 0) {
            vs.before(buildRowHtml(ctl.Label, ctl));
            lastRow = vs.prev();
        } else {
            canvas.append(buildRowHtml(ctl.Label, ctl));
            lastRow = canvas.find('div.' + style_Row + ':last');
        }
        canvas.sortable();
        
        lastRow.data(keyControlData, ctl);
        isEditing = false;
        // update data source pickers in designers if this is a ControlDataSource
        lastRow.mousedown(function () {
            $(this).parent().find('.' + style_Row).removeClass("ui-state-active");
            $(this).addClass("ui-state-active");
            container.data.activeRow = $(this);
        });
        lastRow.hoverIntent(function () { $(this).find('ul.xmp-canvas-toolbar').fadeIn(); },
                     function () { $(this).find('ul.xmp-canvas-toolbar').hide(); });
        if (ctl.Tag == "ControlDataSource") {
            loadControlDataSourcePickers(container);
        }
        return lastRow;
    } // addControlToCanvas()

    function loadControlDataSourcePickers(container) {
        var listCDS = getControlsByTag(container, "ControlDataSource");
        // get the ID's
        var sHtml = '';
        listCDS.each(function () {
            var sId = $(this).data(keyControlData).ID;
            if (sId) {
                sHtml += '<option value="' + sId + '">' + sId + '</option>';
            }
        });
        // reload the data source drop downs.
        $('.designer-datasource-listing').html('<option value=""></option>' + sHtml);
    }

    // returns HTML representing a control row in the form designer.
    // Pass-in the control object for the label/control combo.
    function buildRowHtml(lbl, ctrl, bControlsOnly) {
        // add xmp-canvas-ctrl-(tagName) so tags of a certain type (ControlDataSource) can be retrieved more easily later
        var out = '<div class="' + style_Row + ' xmp-canvas-ctrl-' + ctrl.Tag + '">' +
                 '<ul class="xmp-canvas-toolbar ui-state-highlight ui-corner-all" style="display:none;">' +
                 '  <li class="ui-state-default ui-corner-all xmp-control-toolbar">' +
                 '    <span class="ui-icon ui-icon-arrowthick-2-n-s" style="float:left;"></span>' +
                 '  </li>' +
                 '  <li class="ui-state-default ui-corner-all xmp-control-toolbar">' +
                 '    <span class="ui-icon ui-icon-pencil" style="float:left;"></span>' +
                 '  </li>' +
                 ' <li class="ui-state-default ui-corner-all xmp-control-toolbar">' +
                 '    <span class="ui-icon ui-icon-closethick" style="float:left;"></span>' +
                 ' </li>' +
                 '</ul>';
        if (!bControlsOnly) {
            var lblHtml = (lbl) ? lbl.GetDesignerHtml() : '';
            out +=
            lblHtml + ctrl.GetDesignerHtml() + '</div>';
        } else {
            out = lbl.GetDesignerHtml() + ctrl.GetDesignerHtml() + '</div>';
        }
        return out;
    } // buildRowHtml()

    function getControlCount(container) {
        var canvas = container.data(dataID).canvas;
        return canvas.find('div.' + style_Row).length;
    } // getControlCount()

    function getControlById(container, IdToFind, tagName) {
        var ControlsList = null;
        if (tagName) {
            ControlsList = getControlsByTag(container, tagName);
        } else {
            ControlsList = container.data(dataID).canvas.find('div.' + style_Row)
        }
        if (!ControlsList) { return null };

        var ctrlToReturn = null;
        ControlsList.each(function () {
            var ctrl = $(this).data(keyControlData);
            if (ctrl.ID && ctrl.ID == IdToFind) {
                ctrlToReturn = ctrl;
                return false;
            }
        });
        return ctrlToReturn;
    }

    function getControlsByTag(container, tagName) {
        var canvas = container.data(dataID).canvas;
        return canvas.find('div.xmp-canvas-ctrl-' + tagName);
    }

    function setCreateButtonState(container) {
        if (getControlCount(container) > 0) {
            // ensure Create Form button is enabled
            $('.xmp-fb-create').removeClass('ui-state-disabled');
        } else {
            $('.xmp-fb-create').addClass('ui-state-disabled');
        }
    }

    function loadDataFieldControls(container, selectedFields) {
        var sHtml = '';
        if (selectedFields && selectedFields.length) {
            for (var i = 0; i < selectedFields.length; i++) {
                sHtml += '<option value="' + selectedFields[i] + '">' + selectedFields[i] + '</option>';
            }
        }
        $('#properties .designer-datafield-dropdown').html(sHtml);
    }

    function setDataFieldControls(container) {
        var data = container.data(dataID);
        var ds = $('#data-options').dataChooser("getDataSettings");

        switch (ds.dataSourceType) {
            case 'dnn_table':
                // change designers to use a drop-down for DataField rather than a textbox
                $('#properties .designer-datafield-dropdown').addClass('is-active').show();
                $('#properties .designer-datafield-textbox').removeClass('is-active').hide();
                break;
            case 'ext_table':
                // change designers to use a drop-down for DataField rather than a textbox
                $('#properties .designer-datafield-dropdown').addClass('is-active').show();
                $('#properties .designer-datafield-textbox').removeClass('is-active').hide();
                break;
            case '':
                // change designers to use a textbox for DataField rather than drop-down
                $('#properties .designer-datafield-dropdown').removeClass('is-active').hide();
                $('#properties .designer-datafield-textbox').addClass('is-active').show();
                break;
        }

    }


    function toolbarClick(container, $button) {
        var data = container.data(dataID);
        var activeRow = data.activeRow;
        // bring up editor for the control
        // if no Row is passed, assume activeRow has been set already
        if ($button) {
            data.activeRow = $button.parent().parent();
            if ($button.find('span').hasClass('ui-icon-closethick')) {
                // delete row.
                data.activeRow.remove();
                data.activeRow = null;
                setCreateButtonState(container);
                return;
            } else if ($button.find('span').hasClass('ui-icon-arrowthick-2-n-s')) {
                return; // user is moving the row
            } else {
                isEditing = true;
            }
        }
        var theControl = data.activeRow.data(keyControlData);
        var ctrlType = theControl.Tag;
        if (!bDialogInit) {
            $('div#properties-tabs').tabs();
            $('div#properties').dialog(
                {
                    autoOpen: false,
                    modal: true,
                    width: 480,
                    title: ctrlType,
                    position: [251, 217],
                    close: function () {
                        // do cleanup of "new row placeholders" if user hits Esc or X button
                        data.canvas.find('div.xmp-newrow').remove();
                        $(this).find('.ui-state-error').remove();
                    },
                    buttons: {
                        Cancel: function () {
                            if (!isEditing) { data.activeRow.remove(); } // remove temporary control row from canvas
                            $(this).dialog('close');
                        },
                        'Apply': function () {
                            // remove any previous error messages
                            var $dlg = $(this);
                            // get visible control property tab
                            var data = container.data(dataID);
                            var theControl = data.activeRow.data(keyControlData);
                            var $PropertyTabLink = $dlg.find('#ul-properties-tabs li a[href$="-' + theControl.Tag.toLowerCase() + '"]');
                            var PropertyTabId = $PropertyTabLink.attr('href');
                            var $PropertyTab = $dlg.find(PropertyTabId);
                            // validate
                            var $ErrContainer = $('<div class="ui-state-error ui-corner-all"><ul></ul></div>');
                            var $ErrList = $ErrContainer.find('ul');
                            var bValid = true;
                            if ($PropertyTab.find('.designer-id').val() === '') {
                                bValid = false;
                                $ErrList.append('<li>Control ID required</li>');
                            }
                            var activeRow = data.activeRow;
                            if (bValid) {
                                setControlProperties(container);
                                setFormStyle(activeRow); // apply current form style settings to newly created row
                                activeRow.removeClass('xmp-newrow'); // clear flag class name
                                $ErrContainer.remove();
                                $dlg.dialog("close");
                            } else {
                                $dlg.append($ErrContainer);
                            }
                            setCreateButtonState(container);
                        }
                    }
                });
            bDialogInit = true;
        }
        $('div#properties div.xmp-designer').hide();
        var curTab = null;
        var $tabs = $("ul#ul-properties-tabs");
        $tabs.find('li').hide();
        var ctl = data.activeRow.data(keyControlData);
        var $des = $('#designer-' + ctl.Tag.toLowerCase());
        var $desValidate = jQuery('#designer-validate');
        var $tabLink = $tabs.find('li a[href=#designer-' + ctl.Tag.toLowerCase() + ']');
        var $validateTabLink = $tabs.find('li a[href=#designer-validate]');
        $tabLink.click().parent().show();
        switch (ctl.Tag) {
            case 'ValidationSummary':
            case 'Email':
            case 'ControlDataSource':
            case 'AddToRoles':
            case 'Redirect':
            case 'Text':
            case 'Label':
            case 'AddUser':
            case 'Login':
            case 'RemoveFromRoles':
                break;
            default:
                $validateTabLink.parent().show();
        }
        if (ctl.Tag === "ControlDataSource") {
            // control data source needs datachooser plugin applied
            var dataChoosers = $des.find('.designer-datachooser');
            dataChoosers.dataChooser({
                xdata : data.opts.xdata, 
                keyFieldChooser: false, 
                enableSort: true, 
                "initDataSourceType": (ctl.ConnectionString) ? "ext_table" : "dnn_table",
                "initConnectionString": ctl.ConnectionString,
                "initSelectedTable": ctl.TableName,
                "initSelectedFields": ctl.Columns
            });
        } else {

        }
        ctl.LoadDesigner($des);
        $des.show();
        $desValidate.show();
        var dlgTitle = (theControl.ID ? theControl.ID + ' - ' : 'New ') + ctrlType;
        $('div#properties').dialog('option', 'title', dlgTitle);
        $('div#properties').dialog('open');

    } // toolbarClick()

    function controlPickerClick(container, href) {
        var data = container.data(dataID);
        // for IE, need to get #xxxxxx at the *end* of the href b/c it pre-pends the full page URL.
        var hashTagIdx = href.lastIndexOf("#");
        if (hashTagIdx >= 0) {
            href = href.substring(hashTagIdx);
        }
        var ctl;
        switch (href) {
            case '#textbox': ctl = new ctlTextBox(); break;
            case '#textarea': ctl = new ctlTextArea(); break;
            case '#dateinput': ctl = new ctlDateInput(); break;
            case '#password': ctl = new ctlPassword(); break;
            case '#htmlinput': ctl = new ctlHtmlInput(); break;
            case '#dropdownlist': ctl = new ctlDropDownList(); break;
            case '#listbox': ctl = new ctlListBox(); break;
            case '#duallist': ctl = new ctlDualList(); break;
            case '#checkbox': ctl = new ctlCheckBox(); break;
            case '#checkboxlist': ctl = new ctlCheckBoxList(); break;
            case '#radiobutton': ctl = new ctlRadioButton(); break;
            case '#radiobuttonlist': ctl = new ctlRadioButtonList(); break;
            case '#fileupload': ctl = new ctlFileUpload(); break;
            case '#validationsummary': ctl = new ctlValidationSummary(); break;
            case '#validate': ctl = new ctlValidate(); break;
            case '#email': ctl = new ctlEmail(); break;
            case '#controldatasource': ctl = new ctlControlDataSource(); break;
            case '#addtoroles': ctl = new ctlAddToRoles(); break;
            case '#removefromroles': ctl = new ctlRemoveFromRoles(); break;
            case '#adduser': ctl = new ctlAddUser(); break;
            case '#login': ctl = new ctlLogin(); break;
            case '#redirect': ctl = new ctlRedirect(); break;
            case '#text': ctl = new ctlText(); break;
            case '#label': ctl = new ctlLabel(); break;
        }
        if (ctl) {
            ctl.Label = new ctlLabel();
            if (href == '#validationsummary' || href == '#email' ||
              href == '#controldatasource' || href == '#addtoroles' ||
              href == '#redirect' || href == '#text' || href == '#label' ||
              href == '#adduser' || href == '#removefromroles' || href == '#login') {
                ctl.Label.Text = '';
            } else {
                ctl.Label.Text = ctl.Tag;
            }
        }
        data.activeRow = addControlToCanvas(ctl, container);
        data.activeRow.parent().find('.' + style_Row).removeClass('ui-state-active');
        data.activeRow.addClass('ui-state-active xmp-newrow');
        toolbarClick(container);
    }

    // dispatcher to apply designer properties to canvas and store those changes.
    function setControlProperties(container) {
        var activeRow = container.data(dataID).activeRow;
        var ctl = activeRow.data(keyControlData);
        ctl.LoadFromDesigner($('div#designer-' + ctl.Tag.toLowerCase()));
        // if this is a ControlDataSource tag, update the ControlDataSource pickers
        loadControlDataSourcePickers(container);

        // if the control is a Label, it won't have an internal label
        var labelDesignerHtml = (ctl.Label) ? ctl.Label.GetDesignerHtml() : '';
        activeRow.html(
                 '<ul class="xmp-canvas-toolbar ui-state-highlight ui-corner-all" style="display:none;">' +
                 '  <li class="ui-state-default ui-corner-all">' +
                 '    <span class="ui-icon ui-icon-arrowthick-2-n-s" style="float:left;"></span>' +
                 '  </li>' +
                 '  <li class="ui-state-default ui-corner-all">' +
                 '    <span class="ui-icon ui-icon-pencil" style="float:left;"></span>' +
                 '  </li>' +
                 ' <li class="ui-state-default ui-corner-all">' +
                 '    <span class="ui-icon ui-icon-closethick" style="float:left;"></span>' +
                 ' </li>' +
                 '</ul>' +
                  labelDesignerHtml + ctl.GetDesignerHtml());
        activeRow.data(keyControlData, ctl);
        activeRow.find('li').click(function () {
            toolbarClick(container, $(this));
        });

    }

    // checks various aspects of the form construction and warns user of any issues
    function validateForm(container) {
        var data = container.data(dataID);
        var $rows = data.canvas.find('.' + style_Row);
        var bHasValidators = false;
        var bHasValidationSummary = false;
        var arrErrors = new Array;
        var arrWarnings = new Array;
        var arrColumns = new Array;
        var ds = $('#data-options').dataChooser('getDataSettings');

        // remove previous validation messages
        container.find('.xmp-fb-validation-messages').remove();

        for (var i = 0; i < ds.selectedFields.length; i++) {
            arrColumns.push(ds.selectedFields[i]);
        }


        // ensure form settings are OK
        if (data.isEditingForm == false) {
            if (data.formNameBox.val().length < 1) {
                arrErrors.push("Please provide a name for the form (use only letters, numbers, hyphens (-) and underscores (_)");
            } else {
                var patt = new RegExp("[^A-Za-z0-9_\-]");
                if (patt.test(data.formNameBox.val())) {
                    arrErrors.push("The form name contains illegal characters. Please use only letters, numbers, hyphens (-) and underscores (_)");
                }
            }
        }

        // array used to check for duplicate control ID's
        var arrIds = new Array();
        var bDupeIdFound = false;
        var controlCount = 0;
        $rows.each(function (index, row) {
            controlCount++;
            var curControl = $(row).data(keyControlData);
            switch (curControl.Tag) {
                case "Email":
                case "AddToRoles":
                case "AddUser": 
                case "Redirect":
                case "Text":
                case "Label":
                    break;
                case "ValidationSummary":
                    bHasValidationSummary = true;
                    break;
                default:
                    // validate control has ID
                    if (!curControl.ID) {
                        var AorAn = 'A ';
                        if (curControl.Tag.match(/^[aeiouAEIOU]/)) { AorAn = 'An '; }
                        arrErrors.push(AorAn + curControl.Tag + " control is missing an ID");
                    } else {
                        // validate ID format
                        var resultStartWithDigit = curControl.ID.match(/^\d/);
                        var resultAlphaNumeric = curControl.ID.match(/^[a-z0-9_]+$/i);
                        if ((resultStartWithDigit) || (!resultAlphaNumeric)) {
                            arrErrors.push("An invalid control ID was found: " + curControl.ID +
                    ". ID's must start with a letter and can only contain letters, numbers " +
                    "and underscores");
                        } else {
                            if (resultAlphaNumeric.length < 1) {
                                arrErrors.push("An invalid control ID was found: " + curControl.ID +
                    ". Control ID's must contain at least one character.");
                            }
                        }
                        // check for duplicate ID
                        bDupeIdFound = false;
                        if (arrIds.length > 0) {
                            for (var idx = 0; idx < arrIds.length; idx++) {
                                if (curControl.ID == arrIds[idx]) {
                                    arrErrors.push("Found a duplicated control ID: " + curControl.ID + ". Please make all ID's unique.");
                                    bDupeIdFound = true;
                                }
                            } // for...
                        }
                        if (!bDupeIdFound) {
                            arrIds.push(curControl.ID);
                        }
                    } // if (!curControl.ID)

                    if (curControl.Tag != "ControlDataSource") {
                        if ((!curControl.Label) || (!curControl.Label.Text) || (curControl.Label.Text.length == 0)) {
                            arrErrors.push(curControl.ID + " is missing a Label");
                        }
                        if (!curControl.DataField) {
                            arrWarnings.push(curControl.ID + " has not been assigned a column from the data source (DataField property).");
                        } else {
                            // check to see if the DataField is in the list of columns in the table
                            // only check if the user has selected a data source
                            if (ds.dataSourceType != '') {
                                if ($.inArray(curControl.DataField, arrColumns) == -1) {
                                    arrWarnings.push(curControl.ID + " has a DataField assigned " +
                  "that is not in the list of columns for the currently selected data source");
                                }
                            }
                        }
                    }
            }
            if ((!bHasValidators) && (curControl.Validation) && (curControl.Validation.length > 0)) bHasValidators = true;
        }); // for... rows.length

        // verify there is at least one control in the form
        if (controlCount < 1) {
            arrErrors.push("The form must have at least one control");
        }

        // if there is at least one validator in the list, check for existence of ValidationSummary
        if (bHasValidators && !bHasValidationSummary) {
            arrWarnings.push("One or more controls have validation but no Validation Summary has been detected");
        }

        var dlgContent = '';
        if (arrErrors.length > 0) {
            displayErrorDlg(arrErrors, $('#canvas'));
            return false;
        }
        if (arrWarnings.length > 0) {
            var out = '<div class="xmp-fb-validation-messages">';
            out += '<p>XMod Pro has detected the following potential issues in your form. While you can save your form ' +
               'without fixing all the issues, it is recommended you do so.</p>' +
               '<ul>';
            for (i = 0; i < arrWarnings.length; i++) {
                out += '<li>' + arrWarnings[i] + '</li>';
            } // for... arrWarnings.length
            out += '</ul></div>';
            var $msg = $(out);
            $msg.addClass('ui-state-highlight').css({ 'padding': '3px 15px' });
            if (arrErrors.length == 0 && arrWarnings.length > 0) {
                // Only warnings, no errors. Notify user via dialog and allow him/her to click to continue or cancel.
                $msg.dialog({
                    modal: true,
                    buttons: {
                        "Create the Form Anyway": function () {
                            $(this).dialog("destroy");
                            createFormButton_Click(container);
                        },
                        "Cancel": function () {
                            $(this).dialog("destroy");
                            return false;
                        }
                    },
                    title: "Warning",
                    close: function () { $(this).dialog("destroy"); }
                });
                $msg.parent().position({ of: $('#canvas'), my: 'center center', at: 'center center' });
            } else {
                container.append($msg);
                return (arrErrors.length == 0);
            }
        } else {
            return (arrErrors.length == 0);
        }
    }

    function displayErrorDlg(arrErrors, $container) {
        if (arrErrors.length > 0) {
            var out = '<div class="xmp-fb-validation-messages">';
            out += '<p class=" ui-state-error ui-corner-all" style="padding:5px;">XMod Pro has detected the following errors in your form. Please correct ' +
               'these problems before proceeding.</p>' +
               '<ul>';
            for (i = 0; i < arrErrors.length; i++) {
                out += '<li>' + arrErrors[i] + '</li>';
            } // for... arrErrors.length
            out += '</ul></div>';
            var $content = $(out);
            var $dlg = $content.dialog({
                modal: true,
                title: "Error",
                close: function () { $(this).dialog("destroy"); }
            });
            $content.parent().position({ of: $container, my: 'center center', at: 'center center' });
        }

    }

    // returns an array of selected fields.
    function getSelectedColumns($container) {
        return $container.find('#data-options').dataChooser("getSelectedFields");
    }

    function createFormXml(container) {
        var data = container.data(dataID);
        var canvas = data.canvas;
        var sectionSettings = data.sectionSettings;
        var sectionButtons = data.sectionButtons;
        var $FormNameBox = data.formNameBox;
        var $FormNameLabel = data.formNameLabel;
        var opts = data.opts;
        var ds = $('#data-options').dataChooser('getDataSettings');

        var sXml = '';
        var sControlDataSourceTags = '';
        canvas.find('div.' + style_Row).each(function () {
            if ($(this).data(keyControlData).Tag == "ControlDataSource") {
                sControlDataSourceTags += $(this).data(keyControlData).GetXml('    ') + '\n';
            } else {
                sXml += $(this).data(keyControlData).GetXml('      ') + '\n';
            }
        });
        var sFormName = '';
        if ($FormNameBox.css('display') == "none") {
            sFormName = $FormNameLabel.text();
        } else {
            sFormName = $FormNameBox.val();
        }
        var connectionString = '';
        if (ds.dataSourceType == 'ext_table') {
            connectionString = ' ConnectionString="' + ds.connectionString + '"';
        }
        var selectedFields = '';
        if (ds.selectedFields) {
            selectedFields = ds.selectedFields.toString().replace('"', '');
        }
        var sUseRoundedCorners = ($("#chkUseRoundedCorners")[0].checked) ? ' RoundCorners="True"' : '';
        var sDataTag = '';
        if (ds.dataSourceType) {
            var sDataTag = '    <Data TableName="' + ds.selectedTable + '"' +
                  ' Key="' + ds.keyFields[0] + '" SelectedFields="' + selectedFields + '"' +
                  connectionString +
                  ' />\n'
        }

        
        var _addbtntxt = sectionButtons.find('#txtAddFormAddButtonText').val(),
            _editbtntxt = sectionButtons.find('#txtEditFormUpdateButtonText').val(),
            _cancelbtntxt = sectionButtons.find('#txtCancelButtonText').val()


        sXml = '<Forms FormName="' + sFormName + '">\n' +
             '  <Style Theme="' + $("#ddlFormTheme").val() + '" LabelAlign="' + $("#ddlFormAlignment").val() + '"' + sUseRoundedCorners +
             '    LabelWidth="' + $("#txtLabelWidth").val() + '"/>\n' +
             '  <Form Type="Add">\n' +
             sDataTag +
             '    <Controls>\n' + sXml + '\n' +
             sControlDataSourceTags +
             '      <CommandButtons>\n' +
             '        <AddButton Text="' + xmlSanitizer(_addbtntxt) + '" /> \n' +
             '        <UpdateButton Text="' + xmlSanitizer(_editbtntxt) + '" /> \n' +
             '        <CancelButton Text="' + xmlSanitizer(_cancelbtntxt) + '" style="margin-left: 12px;" ' +
             'Visible="' + sectionButtons.find('#chkIncludeCancelButton').get(0).checked + '"/> \n' +
             '      </CommandButtons>\n' +
             '    </Controls>\n' +
             '  </Form>\n' +
             '</Forms>';
        return sXml;
    } // createFormXml()


    $.formBuilder = {}; // base object to hold static functions

    // OPTIONS:
    // xdata - XMod Pro-specific encrypted data, needed for AJAX calls
    // globalForm - If true, form will be saved in global, not portal directory
    // createFormHandler - pass-in function to call when Create button is clicked
    // updateFormHandler - pass-in function to call when Update button is clicked
    // cancelFormHandler - pass-in function to call when Cancel button is clicked
    // ...Label - Text to use as caption for various controls.
    $.fn.formBuilder.defaults = {
        controlsLabel: "Controls",
        stylingLabel: "Styling",
        settingsLabel: "Settings",
        buttonsLabel: "Buttons",
        eventsLabel: "Events",
        themeLabel: "Theme: ",
        alignmentLabel: "Label Alignment: ",
        leftAlignLabel: "Left-Align",
        rightAlignLabel: "Right-Align",
        topAlignLabel: "Top",
        labelWidthLabel: "Label Width: ",
        emailToLabel: "To: ",
        emailFromLabel: "From: ",
        emailSubjectLabel: "Subject: ",
        emailFormatLabel: "Format: ",
        emailBodyLabel: "Body: ",
        globalForm: false,
        xdata: null,
        errorLabel: "Error",
        noneSelectedLabel: "(None Selected)",
        dnnStylingLabel: "Basic DNN Styling",
        formNameLabel: "Form Name: ",
        dataOptionLabel: "Data Source: ",
        tablesLabel: "Table: ",
        keyFieldLabel: "Key Field: ",
        createFormLabel: "Create",
        createAutoFormLabel: "Auto-Create Form",
        createAutoValidateLabel: "Add Validation?", 
        updateFormLabel: "Update",
        cancelFormLabel: "Cancel",
        addFormButtonLabel: "Add Button Text",
        editFormButtonLabel: "Update Button Text",
        cancelFormButtonLabel: "Text",
        includeCancelButtonLabel: "Include Cancel Button",
        createFormHandler: null,
        updateFormHandler: null,
        cancelFormHandler: null,
        convertFormHandler: null,
        addFormTextEditor: null,
        editFormTextEditor: null
    }; // formBuilder.defaults


})(jQuery);

//
//====================================================================
// alphanumeric Plugin
//====================================================================
//
// plugin to restrict (and allow) input into a textbox
// examples:
// $(sel).alphanumeric();
// $(sel).alphanumeric({allow: '.,_ '}); -- allows dot comma underscore and space
// $(sel).alpha({nocaps:true}); -- only lower case letters
// $(sel).numeric(); -- only numbers
// $(sel).numeric({allow:'.'}); -- only numbers and dots
// $(sel).alphanumeric({ichars:'.1a'}) -- custom rule to only prevent certain chars (dot 1 and a in this ex.)
(function ($) {
    $.fn.alphanumeric = function (p) {
        p = $.extend({
            ichars: "!@#$%^&*()+=[]\\\';,/{}|\":<>?~`.-_ ",
            nchars: "",
            allow: ""
        }, p);

        return this.each
            (
                function () {

                    if (p.nocaps) p.nchars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    if (p.allcaps) p.nchars += "abcdefghijklmnopqrstuvwxyz";

                    s = p.allow.split('');
                    for (i = 0; i < s.length; i++) if (p.ichars.indexOf(s[i]) != -1) s[i] = "\\" + s[i];
                    p.allow = s.join('|');

                    var reg = new RegExp(p.allow, 'gi');
                    var ch = p.ichars + p.nchars;
                    ch = ch.replace(reg, '');

                    $(this).keypress
                        (
                            function (e) {

                                if (!e.charCode) k = String.fromCharCode(e.which);
                                else k = String.fromCharCode(e.charCode);

                                if (ch.indexOf(k) != -1) e.preventDefault();
                                if (e.ctrlKey && k == 'v') e.preventDefault();

                            }

                        );

                    $(this).bind('contextmenu', function () { return false });

                }
            );

    };

    $.fn.numeric = function (p) {

        var az = "abcdefghijklmnopqrstuvwxyz";
        az += az.toUpperCase();

        p = $.extend({
            nchars: az
        }, p);

        return this.each(function () {
            $(this).alphanumeric(p);
        }
        );

    };

    $.fn.alpha = function (p) {

        var nm = "1234567890";

        p = $.extend({
            nchars: nm
        }, p);

        return this.each(function () {
            $(this).alphanumeric(p);
        }
        );

    };

})(jQuery);

//====================================================================
// required Plugin (required field validator)
//====================================================================
(function ($) {
    $.fn.required = function () {
        var isValid = true;
        this.each(function () {
            var $this = $(this);
            // clear any validation messages
            $this.next('.required-error').remove();
            if ($this.val()) {
                isValid = (isValid && true);
            } else {
                $this.after('<span class="required-error" style="font-size: .8em;"><img style="width: 16px; height: 16px; margin-right: 5px;" src="images/warning.png" />Required</span>');
                isValid = false;
            }

        });
        return isValid;
    }
})(jQuery);


function getStyleInfo() {
    // read values in from controls
    var colWidth = jQuery('#txtLabelWidth').val();
    if (colWidth != parseInt(colWidth, 10)) colWidth = '120px'
    else colWidth = parseInt(colWidth, 10) + 'px'

    var colSpacing = jQuery('#txtColSpacing').val();
    if (colSpacing != parseInt(colSpacing, 10)) colSpacing = '10px'
    else colSpacing = parseInt(colSpacing, 10) + 'px'

    var rowSpacing = jQuery('#txtRowSpacing').val();
    if (rowSpacing != parseInt(rowSpacing, 10)) rowSpacing = '3px'
    else rowSpacing = parseInt(rowSpacing, 10) + 'px'

    var styleInfo = {
        'layout': jQuery('#ddlFormAlignment').val(),
        'colwidth': colWidth,
        'colspacing': colSpacing,
        'rowspacing': rowSpacing,
        'theme': jQuery('#ddlFormTheme').val(),
        'cornerForm': true, //(jQuery('#chkUseRoundedCorners').get(0).checked) ? true : false,
        'validationsummary': true,
        'validatedatatypes': true
    }
    return styleInfo;
}

// given a returned XML file, set the Buttons tab controls
function setFormButtons(container, xml) {
    var $btns = container.data('formBuilder').sectionButtons;
    var $cmdBtns = $(xml).find('Forms Form Controls CommandButtons');
    $btns.find('#txtAddFormAddButtonText').val($cmdBtns.find('AddButton').attr("Text"));
    $btns.find('#txtEditFormUpdateButtonText').val($cmdBtns.find('UpdateButton').attr("Text"));
    $btns.find('#txtCancelButtonText').val($cmdBtns.find('CancelButton').attr("Text"));
    var bShowCancel = true;
    if ($cmdBtns.find('CancelButton').attr("Visible")) {
        var inclCancelAttr = $cmdBtns.find('CancelButton').attr("Visible");
        if (inclCancelAttr == "false") { bShowCancel = false };
    }
    $btns.find('#chkIncludeCancelButton').get(0).checked = bShowCancel;
    setCancelButtonTextPanelVisibility(container);
}

function setCancelButtonTextPanelVisibility(container) {
    var $chk = container.find('#chkIncludeCancelButton');
    var isChecked = $chk.get(0).checked;
    if (isChecked) $chk.parent().parent().find('#divCancelButtonTextPanel').show();
    else $chk.parent().parent().find('#divCancelButtonTextPanel').hide();
}

function setFormStyle(row) {
    // row is optional - if null, style will be applied to all rows
    var styleInfo = getStyleInfo();
    // if top or left align, align labels left, otherwise, right
    var align = (styleInfo.layout == 'right') ? 'right' : 'left';
    var lblFloat = (styleInfo.layout == 'top') ? 'none' : 'left';
    var $labels, $rows
    if (row) {
        $labels = jQuery(row).find('.xmp-form-label');
        $rows = row;
    } else {
        $labels = jQuery('#canvas .xmp-form-label');
        $rows = jQuery('#canvas .xmp-form-row');
    }
    $labels.width(styleInfo.colwidth).css(
  { 'text-align': align,
      'float': lblFloat,
      'margin-right': styleInfo.colspacing,
      'display': 'block'
  });
    $rows.css({ 'margin': styleInfo.rowspacing });
}

// Parses the XML of a form def. and creates an array of control objects.
function getFormControls(xml) {
    var ctrls = new Array;
    var ctl = null;
    jQuery(xml).find('Controls').children().each(function () {
        ctl = null;
        switch (this.tagName.toLowerCase()) {
            case 'textbox':
                ctl = new ctlTextBox();
                break;
            case 'textarea':
                ctl = new ctlTextArea();
                break;
            case 'dateinput':
                ctl = new ctlDateInput();
                break;
            case 'htmlinput':
                ctl = new ctlHtmlInput();
                break;
            case 'dropdownlist':
                ctl = new ctlDropDownList();
                break;
            case 'listbox':
                ctl = new ctlListBox();
                break;
            case 'duallist':
                ctl = new ctlDualList();
                break;
            case 'checkbox':
                ctl = new ctlCheckBox();
                break;
            case 'checkboxlist':
                ctl = new ctlCheckBoxList();
                break;
            case 'radiobutton':
                ctl = new ctlRadioButton();
                break;
            case 'radiobuttonlist':
                ctl = new ctlRadioButtonList();
                break;
            case 'fileupload':
                ctl = new ctlFileUpload();
                break;
            case 'password':
                ctl = new ctlPassword();
                break;
            case 'email':
                ctl = new ctlEmail();
                break;
            case 'addtoroles':
                ctl = new ctlAddToRoles();
                break;
            case 'login':
                ctl = new ctlLogin();
                break;
            case 'text':
                ctl = new ctlText();
                break;
            case 'label':
                ctl = new ctlLabel();
                break;
            case 'redirect':
                ctl = new ctlRedirect();
                break;
            case 'controldatasource':
                ctl = new ctlControlDataSource();
                break;
            case 'validate':
                ctl = new ctlValidate();
                break;
            case 'validationsummary':
                ctl = new ctlValidationSummary();
                break;
        }
        if (ctl) {
            ctl.ParseXml(this);
            ctrls.push(ctl);
        }
    });
    return ctrls;
}

// Version of loadTables, modified for use outside form builder so ControlDataSource and others can use it.
function getTables(includeViews, connStr, onSuccess, onError) {
    var functionData = null;

    // adjust function call based on whether this is a DNN or external SQL DB
    if (connStr) {
        var methodName = (includeViews) ? 'gettablesextandviews' : 'gettablesext';
        functionData = { method: methodName, connstr: connStr, xdata: kbxm_xdata };
    } else {
        var methodName = (includeViews) ? 'gettablesandviews' : 'gettable';
        functionData = { method: methodName, xdata: kbxm_xdata };
    }

    $.ajax({
        type: "POST",
        url: 'KBXM_DUtils.aspx',
        data: functionData,
        success: function (data) {
            if (onSuccess) onSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (onError) {
                onError(XMLHttpRequest, textStatus, errorThrown);
            }
        },
        cache: false
    });
} // loadTables()

function getColumns(tableName, connStr, includeViews, onSuccess, onError) {
    var methodName = "gettablecols";
    if (includeViews) {
        if (connStr) { methodName = "gettableorviewcolsext"; }
        else { methodName = "gettableorviewcols"; }
    } else {
        if (connStr) { methodName = "gettablecolsext"; }
    }

    if (!connStr) connStr = '';

    jQuery.ajax({
        type: "POST",
        dataType: "html",
        url: 'KBXM_DUtils.aspx',
        data: { method: methodName, name: tableName, xdata: kbxm_xdata, connstr: connStr },
        success: function (data) {
            if (onSuccess) onSuccess(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (onError) onError(XMLHttpRequest, textStatues, errorThrown);
        },
        cache: false
    });
}

// Cleans up ampersands for anything that needs to be processed as XML
function xmlSanitizer(string) {
    return string.replace(/amp;/g, "").replace(/&/g, "&amp;");
}
