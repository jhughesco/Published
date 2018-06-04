<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="ManageForms.aspx.vb" Inherits="KnowBetter.XModPro.ManageForms1" %>


<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head" runat="server">
	<title>XMod Pro - Manage Forms</title>
	
	<link rel="stylesheet" type="text/css" media="screen" href="styles/ui-lightness/ui-lightness.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="styles/ui.jqgrid.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="scripts/code-mirror/codemirror.css" />
  	<link rel="stylesheet" type="text/css" media="screen" href="scripts/code-mirror/util/addon/fold/foldgutter.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="scripts/code-mirror/util/simple-hint.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="scripts/code-mirror/util/dialog.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="scripts/code-mirror/theme/default.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="scripts/code-mirror/util/show-hint.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="styles/xmp.designers.css" />
	
	<style type="text/css">
		body {background-color: Transparent; border:none;}
		/* Needed to get grid text to be the right size. For some reason this is not a problem 
		   on ManageTemplates/ManageFeeds */
		table {font-size: 1em;} 
		
		.kbxmDialog 
		{
			font-size: 12px;
		}
		.kbxmRow {margin-bottom: 10px;}
		.kbxmSubRow {margin-left: 25px; display: none; margin-top: 10px; padding-bottom: 10px;}
		#divKeyField {display:none;}
		input.EditorButton {display:none; margin-right: 5px;}
		#btnCancelEdit {display:inline;}
		.kbxmHelp {font-size: .9em;}
		.kbxmHelp ul {padding-left: 5px;}
		.kbxmHelp ul li {padding: 0; margin: 0px; list-style: none; }
		.kbxmHelp ul li#liPreview {background: url(images/preview.png) no-repeat left center; padding-left: 20px;}
		.kbxmHelp ul li#liEdit {background: url(images/edit.gif) no-repeat left center; padding-left: 20px;}
		.kbxmHelp ul li#liDelete {background: url(images/delete.gif) no-repeat left center; padding-left: 20px;}
		.kbxmHelp ul li#liCopy {background: url(images/copy.png) no-repeat left center; padding-left: 20px;}
		.kbxmHelp ul li#liRename {background: url(images/rename.png) no-repeat left center; padding-left: 20px;}
		
		.xmp-loading {background: url(images/ajax-loader.gif) no-repeat left center; }
		
		.xmp-clickable {cursor: pointer;}
		
		  .xmp-form-row {
			  border: 1px dotted #CCC;
			  margin-bottom: 5px;
			  padding: 9px 5px 15px 3px;
			  position: relative;
			  min-height: 15px;
		  }
		  .xmp-form-row ul.xmp-canvas-toolbar li {
			  list-style: none outside none;
			  float: left;
			  padding: 3px;
			  cursor: pointer;
			  margin: 0 2px;
		  }
		  .xmp-form-label {
		  /* Caption 'column' for each control */
		  width: 80px; 
			  float: left;
		  }
		  
		  .xmp-designer-row {overflow:hidden; width: 100%;}
		  
		  .xmp-designer label {
			  width: 120px;
			  display: block;
			  float: left;
			  margin-bottom: 10px;
		  }
		  .xmp-designer br {
			  clear: both;
		  }
		  
		  .xmp-designer select {
			margin-bottom: 8px;
		  }
		
		ul.xmp-canvas-toolbar {
		  margin: 0px;
		  padding: 5px;
		  position:absolute;
		  z-index: 999;
		  top: 3px;
		}
		
		  .xmp-canvas-toolbar div.section{
			float:left;
			  border: 1px solid #777;
			  margin-bottom: 1px;
			  position: relative;
			  width: 200px;
		  }
		  .xmp-canvas-toolbar div.section h1{
			  float: left;
			  width:100%;
			  margin: 0;
			  background-color: #777;
			  padding: 5px;
			  color: #FFF;
			  font-size: 12px;
			  padding: 3px auto;
			  font-weight: bold;
			  font-family: Verdana, Geneva, sans-serif;
			  cursor: pointer;
		  }

		  .xmp-canvas-toolbar div.panel {
			  clear: left;
			  margin: 10px auto 5px 10px;
			  padding: 10px;
			  position: absolute;
			  top: 18px;
			  left: -10px;
			  border: 1px solid black;
			  display: none;
			  background-color: #FFF;
			  font-size: 11px;
			  color: #000;
			  font-family: Verdana, Geneva, sans-serif;
			  cursor: default;
			  height: 200px;
			  width: 200px;
		  }
				  
		  #divFormBuilder { display:none; }
		.CodeMirror  
		{
		    border-left: 1px solid #CCC; 
		    border-right: 1px solid #CCC; 
		    border-bottom: 1px solid #CCC; 
		    min-height: 650px;
		    /*height: auto;
		    max-height: 900px;*/
		    font-size: 1.1em;
		}
		.CodeMirror-scroll 
		{
			width: 100%;
			/*height: auto;*/
			min-height: 650px;
			/*max-height: 900px;*/
			font-size: 1.1em;
			/*overflow-x: auto;
			overflow-y: hidden;*/
		}

		.cm-xmptoken { color: #F90; font-weight: bold; }
		.xmp-toolbar { overflow: hidden; padding: 5px 8px;}
		.xmp-toolbar ul li 
		{
			display: block;
			float: left;
			margin-right: 8px;
			width: 24px;
			height: 24px;
		}	      
	</style>
	
	<script src="scripts/jquery.min.js" type="text/javascript"></script>
    <script src="scripts/jquery-migrate.min.js" type="text/javascript"></script>
	<script src="scripts/i18n/grid.locale-en.js" type="text/javascript"></script>
	<script src="scripts/jquery-ui.min.js" type="text/javascript"></script>
	<script src="scripts/jquery.jqGrid.min.js" type="text/javascript"></script>
	<script src="scripts/code-mirror/codemirror.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/util/addon/fold/foldcode.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/util/addon/fold/foldgutter.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/util/addon/fold/brace-fold.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/util/addon/fold/xml-fold.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/util/addon/fold/comment-fold.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/javascript.js" type="text/javascript"></script>
	<script src="scripts/code-mirror/xml.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/css.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/htmlmixed.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/util/closetag.js" type="text/javascript"></script>
	<script src="scripts/code-mirror/util/show-hint.js" type="text/javascript"></script>
	<script src="scripts/code-mirror/util/xmod-hint.js" type="text/javascript"></script>
	<script src="scripts/code-mirror/util/dialog.js" type="text/javascript"></script>
	<script src="scripts/code-mirror/util/searchcursor.js" type="text/javascript"></script>
	<script src="scripts/code-mirror/util/search.js" type="text/javascript"></script>
	<script src="scripts/code-mirror/util/formatting.js" type="text/javascript"></script>

	<script src="scripts/editortoolbar.js" type="text/javascript"></script>
	<script src="scripts/formbuilder.js" type="text/javascript"></script>
    <script src="scripts/datachooser.js" type="text/javascript"></script>
	<script src="scripts/preview.js" type="text/javascript"></script>
    <script src="scripts/jquery.hoverintent.minified.js" type="text/javascript"></script>
	<script src="scripts/snippet-mgr.js" type="text/javascript"></script>

	<!-- Document.Ready() -->
	<script type="text/javascript">
	    var kbxm_UrlManage = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/KBXM_Manage.aspx")%>';
	    var kbxm_UrlUtil = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/KBXM_DUtils.aspx")%>';
	    var kbxm_xdata = '<%=Request("xdata")%>';
	    var kbxm_UniqueId = 0;
	    var bInitEditor = false;
	    var bInitBuilder = false;
	    var lastSel;
	    var oldItemName;
	    var $Grid;
	    var $dlg;
	    var kbxmItemType = 'form';
	    var $GridPanel;
	    var $EditorPanel;
	    var $FormBuilder;
	    var $PreviewPanel;
	    var $EditorControl;
	    var $TablesList;
	    var $KeyFieldList;
	    // setup auto-complete flag
	    var xmpCCDefinition = "form";

	    jQuery(document).ready(function () {
	        $Grid = jQuery('#list');
	        $dlg = jQuery('#divDialog');
	        $KeyFieldList = jQuery('#ddlKeyField');
	        $EditorControl = jQuery('#taEditor');
	        $EditorControlEditForm = jQuery('#taEditorEditForm');
	        $EditorPanel = jQuery('#divEditorPanel');
	        $ShowNewFormPanelButton = jQuery('#btnShowNewFormPanel');
	        $UseFormBuilder = jQuery('#chkUseFormBuilder');
	        $GridPanel = jQuery('#divGridPanel');
	        $PreviewPanel = jQuery('#divPreview');
	        $FormBuilder = jQuery('#formBuilder');


	        jQuery('#btnCancelEdit').click(function () {
	            $EditorPanel.hide();
	            $GridPanel.show();
	        });
	        jQuery('#txtItemSaveEdit').click(function () {
	            var row = $Grid.jqGrid('getRowData', lastSel);
	            var newVal = jQuery.trim(getAddForm() + "\n\n\n") +
							 jQuery.trim(getEditForm() + "\n\n");
	            kbxmAjaxSaveItem(row.itemname, newVal, null ,jQuery('#ddlPortalFilter').val(),false);
	        });
	        jQuery('#txtItemSaveNew').click(function () {
	            // verify item name is valid
	            var $ItemName = jQuery('#txtFormName');
	            var sName = $ItemName.val();
	            if (!(sName.match(/^[a-zA-Z0-9_\-]+$/gi))) {
	                kbxmShowDialog('<%=LocalizeText("ItemNameValidation")%>',
							 '<%=LocalizeText("InvalidFormName")%>',
							 [200, 125]);
	            }
	            else {
	                var isGlobal = jQuery('#ddlPortalFilter').val();
	                var newVal = jQuery.trim(getAddForm()) + "\n\n\n" +
						 jQuery.trim(getEditForm()) + "\n\n";
	                kbxmAjaxSaveItem(sName, newVal, function () { $Grid.jqGrid().trigger('reloadGrid'); }, isGlobal, true);
	                
	                
	            }
	        });
	        jQuery('#btnPortalFilter').click(function () {
	            var newUrl = 'KBXM_Manage.aspx?callback=loadlist&g=' + jQuery('#ddlPortalFilter').val() + '&xdata=<%=Server.UrlEncode(Request.Params("xdata"))%>'
	            jQuery('#list').jqGrid('setGridParam', { url: newUrl }).trigger("reloadGrid");
	        });
	        kbxmInitGrid();

	        $ShowNewFormPanelButton.click(function () {
	            if (!bInitBuilder) kbxmInitFormBuilder();
	            $FormBuilder.hide();
	            $GridPanel.hide();
	            var isGlobal = jQuery('#ddlPortalFilter').val() == "1";
	            $FormBuilder.formBuilder('newForm', !$UseFormBuilder[0].checked, isGlobal);
	            $FormBuilder.show();
	        });
	        jQuery('#ddlHelp').change(function () {
	            $Help = jQuery(this);
	            if ($Help.val() == '') return false;
	            jQuery('#dlgHelp').load($Help.val()).dialog({
	                position: [0, 30],
	                height: 500,
	                width: 700,
	                maxWidth: 880,
	                maxHeight: 570,
	                draggable: false,
	                resizable: true,
	                buttons: { "Close": function () { jQuery(this).dialog('destroy') } }
	            });
	            jQuery('#dlgHelp').dialog('open');
	        });

	        jQuery('#btnPreviewReturn').click(function () {
	            $PreviewPanel.hide();
	            $GridPanel.show();
	            return false;
	        });
	        $PreviewPanel.xmpPreview({
	          xdata: '<%=Server.UrlEncode(Request("xdata"))%>',
	          returnHandler: function() {
	            jQuery('#divPreview').hide();
	            $GridPanel.show();
	          }
	        });
	    });
	    function getAddForm() { return editor.getValue(); }
	    function getEditForm() { return editor2.getValue(); }
	    function setAddForm(addFormDef) { editor.setValue(addFormDef); }
	    function setEditForm(editFormDef) { editor2.setValue(editFormDef); } 
    </script>

	<script src="scripts/kbxm-cp-ajax.js" type="text/javascript"></script>
</head>

<body style="height: 1000px;">
	<form id="form1" runat="server">
		<div id="divTestWebService"></div>
		<div id="dlgHelp" style="display:none;"></div>
		<div id="divGridPanel" class="ui-widget" style="width: 850px;">
			<div style="margin: 10px 0px; overflow:hidden;">
				<div style="float:left;margin:0px;">
					<input type="button" id="btnShowNewFormPanel" class="ui-widget" value="<%=LocalizeText("NewForm")%>" /> 
					<input type="checkbox" id="chkUseFormBuilder" checked="checked" /> <label for="chkUseFormBuilder" class="ui-widget">Use Form Builder</label>
				</div>
                <div style="float:right;">
                    Showing: 
                    <select size="1" id="ddlPortalFilter">
                        <option value="0">Portal Forms</option>
                        <option value="1">Global Forms</option>
                    </select>
                    <input type="button" id="btnPortalFilter" value="Go" />
                </div>
			</div>
			<div style="float:left;">
				<table id="list"></table>
				<div id="divGridPanelPager"></div>
			</div>
			<div style="clear:both;">&nbsp;</div>
		</div>
		
				
		
		<div id="divEditorPanel" style="display:none;">
			<h3 id="ItemEditTitle" class="ui-widget" style="margin:3px; float:left;"></h3>
			<div id="divHelp" class="ui-widget" style="float:right; padding-right: 20px;">
				<label for="ddlHelp"><%=LocalizeText("HelpTopics")%></label>&nbsp;
				<select id="ddlHelp" size="1">
					<option value=""></option>
					<option value="help/form_addbutton.html">Add Button</option>
					<option value="help/form_add_edit.html">Add Form</option>
                    <option value="help/form_addtoroles.html">Add to Roles</option>
                    <option value="help/form_ajaxbutton.html">AjaxButton</option>
                    <option value="help/form_ajaximage.html">AjaxImage</option>
                    <option value="help/form_ajaxlink.html">AjaxLink</option>
					<option value="help/form_calendarbutton.html">Calendar Button</option>
					<option value="help/form_calendarimage.html">Calendar Image</option>
					<option value="help/form_calendarlink.html">Calendar Link</option>
					<option value="help/form_cancelbutton.html">Caancel Button</option>
					<option value="help/form_cpatcha.html">Captcha</option>
					<option value="help/form_checkbox.html">CheckBox</option>
					<option value="help/form_checkboxlist.html">CheckBoxList</option>
					<option value="help/form_continuebutton.html">Continue Button</option>
					<option value="help/form_continueimage.html">Continue Image</option>
					<option value="help/form_continuelink.html">Continue Link</option>
                    <option value="help/form_controldatasource.html">Control Data Source</option>
					<option value="help/form_dateinput.html">Date Input</option>
					<option value="help/form_dropdownlist.html">Dropdown List</option>
					<option value="help/form_add_edit.html">Edit Form</option>
					<option value="help/form_email.html">Email</option>
					<option value="help/form_fileupload.html">File Upload</option>
					<option value="help/form_htmlinput.html">HTML Input</option>
					<option value="help/form_jqueryready.html">jQueryReady</option>
					<option value="help/form_label.html">Label</option>
					<option value="help/form_listbox.html">ListBox</option>
					<option value="help/form_panel.html">Panel</option>
					<option value="help/form_password.html">Password</option>
					<option value="help/form_radiobutton.html">RadioButton</option>
					<option value="help/form_radiobuttonlist.html">RadioButtonList</option>
                    <option value="help/form_redirect.html">Redirect</option>
                    <option value="help/form_removefromroles.html">Remove from Roles</option>
					<option value="help/form_scriptblock.html">ScriptBlock</option>
					<option value="help/form_tabstrip.html">Tabstrip</option>
					<option value="help/form_text.html">Text</option>
					<option value="help/form_textarea.html">TextArea</option>
					<option value="help/form_textbox.html">Textbox</option>
					<option value="help/form_updatebutton.html">UpdateButton</option>
					<option value="help/form_validate_checkbox.html">Validate (Checkbox)</option>
					<option value="help/form_validate_compare.html">Validate (Compare)</option>
					<option value="help/form_validate_email.html">Validate (Email)</option>
					<option value="help/form_validate_range.html">Validate (Range)</option>
					<option value="help/form_validate_regex.html">Validate (Regular Expression)</option>
					<option value="help/form_validate_required.html">Validate (Required)</option>
					<option value="help/form_validate_xml.html">Validate (XML)</option>
					<option value="help/form_validationsummary.html">ValidationSummary</option>
					<option value="help/tokens_functions.html">Tokens: Functions</option>
					<option value="help/tokens_module.html">Tokens: Module</option>
					<option value="help/tokens_portal.html">Tokens: Portal</option>
					<option value="help/tokens_request.html">Tokens: Request</option>
					<option value="help/tokens_user.html">Tokens: User</option>

				</select>
			</div>
			<div style="clear:both;height:1px">&nbsp;</div>
			<div id="xmpFormEditorTabs">
				<ul>
					<li><a href="#xmpAddFormEditor"><%=LocalizeText("AddForm")%></a></li>
					<li><a href="#xmpEditFormEditor"><%=LocalizeText("EditForm")%></a></li>
				</ul>
				<div id="xmpAddFormEditor">
					<div id="editor-toolbar1"></div>
					<textarea id="taEditor"></textarea>
				</div>
				<div id="xmpEditFormEditor">
				   <div id="editor-toolbar2"></div>
				   <textarea id="taEditorEditForm"></textarea>
				</div>
			</div>
			<div class="ui-widget kbxmRow">
				<input type="button" id="txtItemSaveEdit" value="<%=LocalizeText("Save")%>" class="EditorButton" />
				<input type="button" id="txtItemSaveNew" value="<%=LocalizeText("Save")%>" class="EditorButton" />
				<input type="button" id="btnCancelEdit" value="<%=LocalizeText("Cancel")%>" class="EditorButton" />
			</div>            
		</div>
		<div id="kbxmOptions" style="display:none;" class="kbxmDialog"></div>
		<div id="divDialog" style="display:none" class="kbxmDialog"></div>
		<div id="divPreview"></div>
		
		<div id="properties" style="display:none; width: 600px;">
			<div id="properties-tabs">
			  <ul id="ul-properties-tabs">
				<li><a href="#designer-text">Text</a></li>
				<li><a href="#designer-label">Label</a></li>
				<li><a href="#designer-textbox">Textbox</a></li>
				<li><a href="#designer-textarea">Text Area</a></li>
				<li><a href="#designer-dateinput">Date Input</a></li>
				<li><a href="#designer-htmlinput">HTML Input</a></li>
				<li><a href="#designer-password">Password</a></li>
				<li><a href="#designer-dropdownlist">Drop-Down List</a></li>
				<li><a href="#designer-listbox">List Box</a></li>
				<li><a href="#designer-duallist">Dual-List</a></li>
				<li><a href="#designer-checkbox">Checkbox</a></li>
				<li><a href="#designer-checkboxlist">Checkbox List</a></li>
				<li><a href="#designer-radiobutton">Radio Button</a></li>
				<li><a href="#designer-radiobuttonlist">Radio Button List</a></li>
				<li><a href="#designer-fileupload">File Upload</a></li>
				<li><a href="#designer-validationsummary">Validation Summary</a></li>
				<li><a href="#designer-validate">Validation</a></li>
				<li><a href="#designer-email">Email</a></li>
				<li><a href="#designer-addtoroles">Add To Roles</a></li>
				<li><a href="#designer-removefromroles">Remove From Roles</a></li>
				<li><a href="#designer-adduser">Add User</a></li>
				<li><a href="#designer-login">Login</a></li>
				<li><a href="#designer-redirect">Redirect</a></li>
				<li><a href="#designer-controldatasource">Control Data Source</a></li>
			  </ul>
			  <div id="designer-textbox" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Height</label>
					  <input type="text" class="designer-height" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Width</label>
					  <input type="text" class="designer-width" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  MaxLength</label>
					  <input type="text" class="designer-maxlength" /></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
			  </div>
			  <div id="designer-textarea" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Height</label>
					  <input type="text" class="designer-height" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Width</label>
					  <input type="text" class="designer-width" /></div>
				   <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
			 </div>
			  <div id="designer-dateinput" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Height</label>
					  <input type="text" class="designer-height" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Width</label>
					  <input type="text" class="designer-width" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Culture</label>
					  <input type="text" class="designer-culture" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Format</label>
					  <input type="text" class="designer-format" /></div>
				  <div class="xmp-designer-row">
					<label>Date Picker</label>
					<input type="checkbox" class="designer-datepicker" />
				  </div>
				  <div class="xmp-designer-row">
					<label>Date Only</label>
					<input type="checkbox" class="designer-dateonly" />
				  </div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
			  </div>
			  <div id="designer-htmlinput" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Height</label>
					  <input type="text" class="designer-height" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Width</label>
					  <input type="text" class="designer-width" /></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
			  </div>
			  <div id="designer-password" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Height</label>
					  <input type="text" class="designer-height" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Width</label>
					  <input type="text" class="designer-width" /></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
			  </div>
			  <div id="designer-dropdownlist" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Height</label>
					  <input type="text" class="designer-height" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Width</label>
					  <input type="text" class="designer-width" /></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Control Data Source</label>
					  <select size="1" class="designer-datasource-listing">
					  </select></div>
				  <div class="xmp-designer-row">
					<label>Data Text Field</label>
					<select size="1" class="designer-datatextfield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Data Value Field</label>
					<select size="1" class="designer-datavaluefield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Append Databound Items</label> 
					<input type="checkbox" class="designer-append-databounditems" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Items</label>
					  <select size="7" class="designer-listitems">
					  </select></div>
			  </div>
			  <div id="designer-listbox" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Width</label>
					  <input type="text" class="designer-width" /></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Rows</label>
					  <input type="text" class="designer-rows" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Selection Mode</label>
					  <select size="1" class="designer-selectionmode">
						  <option value="Single">Single-Selection</option>
						  <option value="Multiple">Multiple-Selection</option>
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Control Data Source</label>
					  <select size="1" class="designer-datasource-listing">
					  </select></div>
				  <div class="xmp-designer-row">
					<label>Data Text Field</label>
					<select size="1" class="designer-datatextfield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Data Value Field</label>
					<select size="1" class="designer-datavaluefield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Append Databound Items</label> 
					<input type="checkbox" class="designer-append-databounditems" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Items</label>
					  <select size="7" class="designer-listitems">
					  </select></div>
			  </div>
			  <div id="designer-duallist" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Width</label>
					  <input type="text" class="designer-width" /></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Rows</label>
					  <input type="text" class="designer-rows" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Control Data Source</label>
					  <select size="1" class="designer-datasource-listing">
					  </select></div>
				  <div class="xmp-designer-row">
					<label>Data Text Field</label>
					<select size="1" class="designer-datatextfield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Data Value Field</label>
					<select size="1" class="designer-datavaluefield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Append Databound Items</label> 
					<input type="checkbox" class="designer-append-databounditems" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Items</label>
					  <select size="7" class="designer-listitems">
					  </select></div>
			  </div>
			  <div id="designer-checkbox" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Checked</label>
					  <input type="checkbox" class="designer-checked" /></div>
				   <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
			 </div>
			  <div id="designer-checkboxlist" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Control Data Source</label>
					  <select size="1" class="designer-datasource-listing">
					  </select></div>
				  <div class="xmp-designer-row">
					<label>Data Text Field</label>
					<select size="1" class="designer-datatextfield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Data Value Field</label>
					<select size="1" class="designer-datavaluefield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Append Databound Items</label> 
					<input type="checkbox" class="designer-append-databounditems" />
				  </div>
				  <div class="xmp-designer-row">
					<label>Repeat Columns</label>
					<input type="text" class="designer-repeatcolumns numeric" />
				  </div>
				  <div class="xmp-designer-row">
					<label>Repeat Direction</label>
					<select size="1" class="designer-repeatdirection">
                        <option value=""></option>
                        <option value="Horizontal">Horizontal</option>
                        <option value="Vertical">Vertical</option>
                    </select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Repeat Layout</label>
					<select size="1" class="designer-repeatlayout">
                        <option value=""></option>
                        <option value="Table">Table</option>
                        <option value="Flow">Flow</option>
                    </select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Selected Items Separator</label>
					<input type="text" class="designer-selecteditemsseparator" value="|" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Items</label>
					  <select size="7" class="designer-listitems">
					  </select></div>
			  </div>
			  <div id="designer-radiobutton" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Checked</label>
					  <input type="checkbox" class="designer-checked" /></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
			  </div>
			  <div id="designer-radiobuttonlist" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Control Data Source</label>
					  <select size="1" class="designer-datasource-listing">
					  </select></div>
				  <div class="xmp-designer-row">
					<label>Data Text Field</label>
					<select size="1" class="designer-datatextfield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Data Value Field</label>
					<select size="1" class="designer-datavaluefield"></select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Repeat Columns</label>
					<input type="text" class="designer-repeatcolumns numeric" />
				  </div>
				  <div class="xmp-designer-row">
					<label>Repeat Direction</label>
					<select size="1" class="designer-repeatdirection">
                        <option value=""></option>
                        <option value="Horizontal">Horizontal</option>
                        <option value="Vertical">Vertical</option>
                    </select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Repeat Layout</label>
					<select size="1" class="designer-repeatlayout">
                        <option value=""></option>
                        <option value="Table">Table</option>
                        <option value="Flow">Flow</option>
                    </select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Selected Items Separator</label>
					<input type="text" class="designer-selecteditemsseparator" value="|" />
				  </div>
				  <div class="xmp-designer-row">
					<label>Append Databound Items</label> 
					<input type="checkbox" class="designer-append-databounditems" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Items</label>
					  <select size="7" class="designer-listitems">
					  </select></div>
			  </div>
			  <div id="designer-fileupload" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Label</label>
					  <input type="text" class="designer-label" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select></div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-nullable" />
				  </div>
				  <div class="xmp-designer-row">
					  <label>
						  Display Mode</label>
					  <select size="1" class="designer-displaymode">
						  <option value="FilePicker">File Picker</option>
						  <option value="FilePickerNoUpload">File Picker with No Upload Option</option>
						  <option value="UploadAndSelect">Upload File and Select It</option>
					  </select></div>
				  <div class="xmp-designer-row">
					  <label>
						  Path</label>
					  <input type="text" class="designer-path" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Use Unique File Name</label>
					  <input type="checkbox" class="designer-useuniquefilename" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Allowable Extensions</label>
					  <input type="text" class="designer-extensions" /></div>
			  </div>
			  <div id="designer-validationsummary" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>
						  ID</label>
					  <input type="text" class="designer-id" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Header Text</label>
					  <input type="text" class="designer-headertext" /></div>
				  <div class="xmp-designer-row">
					  <label>
						  Display Mode</label>
					  <select size="1" class="designer-displaymode">
						  <option value="BulletList" selected="selected">BulletList</option>
						  <option value="List">List</option>
						  <option value="SingleParagraph">Single Paragraph</option>
					  </select></div>
			  </div>
			  <div id="designer-validate" class="xmp-designer">
				<label class="val-all">Validators</label>
				<select size="4" class="val-all val-validatorlist" style="float:left;width:150px;"></select>
				<ul class="val-commandbuttons" style="float:left; margin:0; padding-left: 2px;">
					<li><span></span></li>
					<li><span></span></li>
				</ul>
				<br class="val-all" style="clear:both;" />
				<div class="val-dataentry">
				<label class="val-all">Validation Type</label>
				<select size="1" class="validation-type-selector val-all">
				<option value=""></option>
				<option value="required">Required</option>
				<option value="regex">Regular Expression</option>
				<option value="email">Email</option>
				<option value="compare">Compare</option>
				<option value="range">Range</option>
				<option value="checkbox">Checkbox</option>
                <option value="checkboxlist">CheckboxList</option>
				<option value="xml">XML</option>
				</select><br class="val-all" />
				<label class="val-all">Text</label> <input type="text" class="validation-text val-all" /><br class="val-all" />
				<label class="val-all">Message</label> <input type="text" class="validation-message val-all" /><br class="val-all" />
				<label class="val-range">Minimum Value</label> <input type="text" class="val-range validation-minvalue"/><br class="val-range" />
				<label class="val-range">Maximum Value</label> <input type="text" class="val-range validation-maxvalue"/><br class="val-range" />
				<label class="val-range val-compare">Data Type</label>
				<select size="1" class="val-range val-compare validation-datatype">
				<option value="string">String</option>
				<option value="integer">Integer</option>
				<option value="double">Double</option>
				<option value="date">Date</option>
				<option value="currency">Currency</option>
				</select> <br class="val-range val-compare" />
				<label class="val-regex">Validation Expression</label> <input type="text" class="val-regex validation-expression" /><br class="val-regex" />
				<label class="val-compare">Compare to Control</label> <input type="text" class="val-compare validation-comparetarget" /><br class="val-compare" />
				<label class="val-compare">Compare to Value</label> <input type="text" class="val-compare validation-comparevalue" /><br class="val-compare" />
				<label class="val-compare">Comparison Type</label>
				<select size="1" class="val-compare validation-operator">
				    <option value="Equal">=</option>
				    <option value="NotEqual">&lt;&gt;</option>
				    <option value="GreaterThan">&gt;</option>
				    <option value="GreaterThanEqual">&gt;=</option>
				    <option value="LessThan">&lt;</option>
				    <option value="LessThanEqual">&lt;=</option>
				    <option value="DataTypeCheck">Data Type Check</option>
				</select><br class="val-compare" />
				<label class="val-all">&nbsp;</label><input type="button" value="Save" />&nbsp;<input type="button" value="Cancel" />
			</div>
			</div>
			  <div id="designer-email" class="xmp-designer">
				<label>To</label> <input type="text" class="designer-email-to" /><br />
				<label>From</label> <input type="text" class="designer-email-from" /><br />
				<label>Reply-To</label> <input type="text" class="designer-email-replyto" /><br />
				<label>CC</label> <input type="text" class="designer-email-cc" /><br />
				<label>BCC</label> <input type="text" class="designer-email-bcc" /><br />
				<label>Subject</label> <input type="text" class="designer-email-subject" /><br />
				<label>Format</label> 
				<select class="designer-email-format" size="1">
			<option value="text">Text</option>
			<option value="html">HTML</option>
			</select><br />
				<label>When to Send</label> 
				<select class="designer-email-sendrule" size="1">
			<option value="both">When Adding and Updating A Record</option>
			<option value="add">When Adding A Record</option>
			<option value="edit">When Updating A Record</option>
			</select><br />
				<label>Body</label><br />
				<textarea style="width: 98%; height: 130px;" class="designer-email-body"></textarea>
			  </div>
			  <div id="designer-addtoroles" class="xmp-designer">
				<label>Role Names</label> <input type="text" class="designer-addtoroles-rolenames required" /><br />
				<label>User ID</label> <input type="text" class="designer-addtoroles-userid required" /><br />
			  </div>
			  <div id="designer-removefromroles" class="xmp-designer">
				<label>Role Names</label> <input type="text" class="designer-removefromroles-rolenames required" /><br />
				<label>User ID</label> <input type="text" class="designer-removefromroles-userid required" /><br />
			  </div>
			  <div id="designer-redirect" class="xmp-designer">
				<label>Target URL</label> <input type="text" class="designer-redirect-target required" /><br />
				<label>Method</label> 
				<select class="designer-redirect-method" size="1">
					<option value="Get">Get</option>
					<option value="Post">Post</option>
				</select>
				<br />
			  </div>
			  <div id="designer-adduser" class="xmp-designer">
				<label>Email</label> <input type="text" class="designer-adduser-email required" /><br />
				<label>Username</label> <input type="text" class="designer-adduser-username required" /><br />
				<label>Password</label> <input type="text" class="designer-adduser-password required" /><br />
				<label>First Name</label> <input type="text" class="designer-adduser-firstname required" /><br />
				<label>Last Name</label> <input type="text" class="designer-adduser-lastname required" /><br />
				<label>Display Name</label> <input type="text" class="designer-adduser-displayname" /><br />
				<label>Street</label> <input type="text" class="designer-adduser-street" /><br />
				<label>Unit</label> <input type="text" class="designer-adduser-unit" /><br />
				<label>City</label> <input type="text" class="designer-adduser-city" /><br />
				<label>Region</label> <input type="text" class="designer-adduser-region" /><br />
				<label>Postal Code</label> <input type="text" class="designer-adduser-postalcode" /><br />
				<label>Country</label> <input type="text" class="designer-adduser-country" /><br />
				<label>Telephone</label> <input type="text" class="designer-adduser-telephone" /><br />
				<label>Add To Roles</label> <input type="text" class="designer-adduser-rolenames" /><br />
				<label>Approved</label> <input type="checkbox" class="designer-adduser-approved" /><br />
			  </div>
			  <div id="designer-login" class="xmp-designer">
				<label>Username</label> <input type="text" class="designer-login-username required" /><br />
				<label>Password</label> <input type="text" class="designer-login-password required" /><br />
				<label>UserIdField</label> <input type="text" class="designer-login-useridfield" /><br />
				<label>UsernameField</label> <input type="text" class="designer-login-usernamefield" /><br />
				<label>FirstNameField</label> <input type="text" class="designer-login-firstnamefield" /><br />
				<label>LastNameField</label> <input type="text" class="designer-login-lastnamefield" /><br />
			  </div>
			  <div id="designer-text" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>Data Field</label>
					  <select size="1" class="designer-datafield">
					  </select>
				  </div>
				  <div class="xmp-designer-row">
					<label>Nullable</label>
					<input type="checkbox" class="designer-text-nullable" />
				  </div>
			  </div>
			  <div id="designer-label" class="xmp-designer">
				  <div class="xmp-designer-row">
					  <label>Text</label>
					  <input type="text" class="designer-label-text" />
				  </div>
				  <div class="xmp-designer-row">
					<label>For</label>
					<input type="text" class="designer-label-for" />
				  </div>
				  <div class="xmp-designer-row">
					<label>CSS Class</label>
					<input type="text" class="designer-label-cssclass" />
				  </div>
			  </div>
			  <div id="designer-controldatasource" class="xmp-designer">
				<div class="xmp-designer-row">
					<label>ID</label> 
					<input type="text" class="designer-id" />
				</div>
                <div class="xmp-designer-row designer-datachooser"></div>
			  </div>
			</div>
		</div>

<div id="formBuilder" style="display:none;"></div>

<script type="text/javascript">
    CodeMirror.commands.autocomplete = function (cm) {
        CodeMirror.showHint(cm, CodeMirror.xmodHint)
    }

    function kbxmInitTextEditor() {
        // Setup first editor
        editor = CodeMirror.fromTextArea(document.getElementById("taEditor"),
				  {
				    mode: "htmlmixed",
				    tabMode: "indent",
				    tabSize: 2,
				    lineNumbers: true,
				    foldGutter: true,
				    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                  autoCloseTag: true, 
				    extraKeys: {
				        "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); },
				        "'>'": function (cm) { cm.closeTag(cm, '>'); },
				        "'/'": function (cm) { cm.closeTag(cm, '/'); },
				        "Ctrl-Space": "autocomplete"
				    }
				});
        currEditor = editor; // set default currently visible editor to editor 1

        // setup 2nd editor
        editor2 = CodeMirror.fromTextArea(document.getElementById("taEditorEditForm"),
				  {
				    mode: "htmlmixed",
				    tabMode: "indent",
				    tabSize: 2,
				    lineNumbers: true,
				    foldGutter: true,
				    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                  autoCloseTag: true, 
				    extraKeys: {
				        "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); },
				        "'>'": function (cm) { cm.closeTag(cm, '>'); },
				        "'/'": function (cm) { cm.closeTag(cm, '/'); },
				        "Ctrl-Space": "autocomplete"
				    }
				});
        CodeMirror.commands["selectAll"](editor);
        CodeMirror.commands["selectAll"](editor2);

        $('#xmpFormEditorTabs').tabs({
            show: function (event, ui) {
                switch (ui.index) {
                    case 0:
                        editor.refresh();
                        editor.focus();
                        currEditor = editor;
                        break;
                    case 1:
                        editor2.refresh();
                        editor2.focus();
                        currEditor = editor2;
                        break;
                }
            }
        });
        // setup toolbar actions
        $('#editor-toolbar1').editorToolbar({ editor: editor, contentType: 'form', xdata: kbxm_xdata });
        $('#editor-toolbar2').editorToolbar({ editor: editor2, contentType: 'form', xdata: kbxm_xdata });

        bInitEditor = true;
    }

    function kbxmInitFormBuilder() {
        if (!bInitEditor) kbxmInitTextEditor();
        jQuery('#formBuilder').formBuilder({ xdata: '<%=Request("xdata")%>',
            createFormHandler: function () {
                $FormBuilder.hide();
                $GridPanel.show();
                kbxmReloadGrid();
            },
            updateFormHandler: function () {
                $FormBuilder.hide();
                $GridPanel.show();
            },
            cancelFormHandler: function () {
                $FormBuilder.hide();
                $GridPanel.show();
            },
            convertFormHandler: function () {
                kbxmReloadGrid();
            },
            addFormTextEditor: editor,
            editFormTextEditor: editor2
        }
										);
        bInitBuilder = true;
    }

</script>

<script type="text/javascript">

    function kbxmShowDialog(msg, title, position) {
        if (!title) title = '';
        if (!position) position = 'center';
        var $dlg = jQuery('#divDialog');
        $dlg.html(msg);
        $dlg.dialog({
            position: position,
            modal: true,
            buttons: { '<%=LocalizeText("Close")%>': function () { jQuery(this).dialog("destroy"); } },
            title: title
        });
    }
    function kbxmGenerateActionButtons(id) {
        var spnId = "<span style=\"display:none;\">" + id + "</span>";
        var pe = "<a href=\"#preview\" class=\"xmp-grid-commandbutton xmp-grid-preview\">" + spnId + "<img src=\"images/preview.png\" title=\"Preview\" style=\"margin-left:5px;\" />";
        var ee = "<a href=\"#edit\" class=\"xmp-grid-commandbutton xmp-grid-edit\">" + spnId + "<img src=\"images/edit.gif\" title=\"Edit\" style=\"margin-left:5px;\" /></a>";
        var re = "<a href=\"#rename\" class=\"xmp-grid-commandbutton xmp-grid-rename\">" + spnId + "<img src=\"images/rename.png\" title=\"Rename\" style=\"margin-left:5px;\" /></a>";
        var cpy = "<a href=\"#copy\" class=\"xmp-grid-commandbutton xmp-grid-copy\">" + spnId + "<img src=\"images/copy.png\" title=\"Copy\" style=\"margin-left:5px;\" /></a>";
        var de = "<a href=\"#delete\" class=\"xmp-grid-commandbutton xmp-grid-delete\">" + spnId + "<img src=\"images/delete.gif\" title=\"Delete\" style=\"margin-left:5px;\" /></a>";
        var se = "<a href=\"#save\" class=\"xmp-grid-commandbutton xmp-grid-save\">" + spnId + "<img src=\"images/accept.gif\" title=\"Save\" style=\"margin-left:5px;display:none;\" /></a>";
        var ce = "<a href=\"#cancel\" class=\"xmp-grid-commandbutton xmp-grid-cancel\">" + spnId + "<img src=\"images/cancel.gif\" title=\"Cancel\" style=\"margin-left:10px;display:none;\" /></a>";
        return pe + ee + re + cpy + de + se + ce;
    }
    function kbxmGenerateConversionLinks(id) {
        var curRow = $Grid.jqGrid('getRowData', id);
        if (curRow) {
            var format = curRow.itemtype;
            if (format == 'Auto-Layout') {
                $Grid.jqGrid('setRowData', id, { itemtype: '<a title="Copy and convert this form to custom HTML format" href="#" onclick="kbxmConvertForm(' + id + ');return false;">' + format + '</a>' });
            }
        }
    }
    function kbxmGenerateInUseIcons(id) {
        var curRow = $Grid.jqGrid('getRowData', id);
        if (curRow) {
            if (jQuery('#ddlPortalFilter').val() == 1) {
                // global forms aren't eligible for in-use stats at this time.
                $Grid.jqGrid('setRowData', id, { inuse: '<div style="width: 20px;margin-left: auto; margin-right: auto;">N/A</div>' });
            } else {
                var inUse = curRow.inuse;
                if (inUse == "1") {
                    $Grid.jqGrid('setRowData', id, { inuse: '<div style="height:10px; width: 10px; border-radius: 10px; margin-left: auto; margin-right: auto; background-color: green; border: 1px solid green;"></div>' });
                } else {
                    $Grid.jqGrid('setRowData', id, { inuse: '<div style="height:10px; width: 10px; border-radius: 10px; margin-left: auto; margin-right: auto; border: 1px solid black;"></div>' });
                }
            }
        }
    }
    function kbxmInitGrid() {
        $Grid.jqGrid({
            url: 'KBXM_Manage.aspx?callback=loadlist&g=' + jQuery('#ddlPortalFilter').val() + '&xdata=<%=Server.UrlEncode(Request.Params("xdata"))%>',
            datatype: 'xml',
            mtype: 'GET',
            height: 570,
            width: 850,
            colNames: ['', '', '<%=LocalizeText("FormNameColumn")%>', 'Type', 'Used?', 'Modified', 'Created'],
            colModel: [
			{ name: 'act', index: 'act', align: 'center', width: 130, sortable: false },
			{ name: 'id', index: 'id', width: 60, hidden: true },
			{ name: 'itemname', index: 'itemname', width: 250, editable: true, edittype: 'text', editoptions: { size: 50, maxlength: 128} },
			{ name: 'itemtype', index: 'itemtype', width: 80, editable: false },
            { name: 'inuse', index: 'inuse', align: 'left', width: 60, editable: false },
			{ name: 'modified', index: 'modified', width: 150, editable: false },
			{ name: 'created', index: 'created', width: 150, editable: false }
		],
            caption: '<%=LocalizeText("FormManager")%>',
            editurl: 'KBXM_Manage.aspx?callback=editform&xdata=<%=Server.UrlEncode(Request.Params("xdata"))%>',
            rowNum: 25,
            rowList: [5, 10, 15, 20, 25, 30, 40, 50, 75, 100],
            pager: '#divGridPanelPager',
            viewrecords: true,
            rownumbers: true,
            gridComplete: function () {
                var ids = $Grid.jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var cl = ids[i];
                    $Grid.jqGrid('setRowData', ids[i], { act: kbxmGenerateActionButtons(cl),
                        itemtype: kbxmGenerateConversionLinks(cl),
                        inuse: kbxmGenerateInUseIcons(cl)
                    });
                }
                jQuery('a.xmp-grid-commandbutton').find('img').css({ 'border': '0px' });
                jQuery('a.xmp-grid-commandbutton').click(function () {
                    var $btn = jQuery(this);
                    var id = $btn.find('span').text();
                    if ($btn.hasClass('xmp-grid-preview')) { kbxmPreview(id); }
                    else {
                        if ($btn.hasClass('xmp-grid-commit')) { kbxmCommit(id, $btn); event.stopPropagation(); }
                        else {
                            if ($btn.hasClass('xmp-grid-edit')) { kbxmEditRow(id); }
                            else {
                                if ($btn.hasClass('xmp-grid-rename')) { kbxmRename(id); }
                                else {
                                    if ($btn.hasClass('xmp-grid-copy')) { kbxmCopy(id); }
                                    else {
                                        if ($btn.hasClass('xmp-grid-delete')) { kbxmDeleteRow(id); }
                                        else {
                                            if ($btn.hasClass('xmp-grid-save')) { kbxmSaveRow(id); }
                                            else {
                                                if ($btn.hasClass('xmp-grid-cancel')) { kbxmCancelEdit(id); }
                                            } //save
                                        } //delete
                                    } //copy
                                } //rename
                            } //edit
                        } //commit
                    } //preview
                });
            }
        });
        $Grid.jqGrid('navGrid', '#divGridPanelPager', { add: false, edit: false, del: false, search: false });

    }

    function kbxmReloadGrid() {
        $Grid.trigger("reloadGrid");
    }

    function kbxmUpdateEditButtons(action, id) {
        switch (action) {
            case "edit":
                jQuery('#list tr#' + id + ' td a.xmp-grid-save img').show().parent().show();
                jQuery('#list tr#' + id + ' td a.xmp-grid-cancel img').show().parent().show();
                jQuery('#list tr#' + id + ' td a.xmp-grid-preview img').hide().parent().hide();
                jQuery('#list tr#' + id + ' td a.xmp-grid-edit img').hide().parent().hide();
                jQuery('#list tr#' + id + ' td a.xmp-grid-rename img').hide().parent().hide();
                jQuery('#list tr#' + id + ' td a.xmp-grid-copy img').hide().parent().hide();
                jQuery('#list tr#' + id + ' td a.xmp-grid-delete img').hide().parent().hide();
                break;
            default:
                jQuery('#list tr#' + id + ' td a.xmp-grid-save img').hide().parent().hide();
                jQuery('#list tr#' + id + ' td a.xmp-grid-cancel img').hide().parent().hide();
                jQuery('#list tr#' + id + ' td a.xmp-grid-preview img').show().parent().show();
                jQuery('#list tr#' + id + ' td a.xmp-grid-edit img').show().parent().show();
                jQuery('#list tr#' + id + ' td a.xmp-grid-rename img').show().parent().show();
                jQuery('#list tr#' + id + ' td a.xmp-grid-copy img').show().parent().show();
                jQuery('#list tr#' + id + ' td a.xmp-grid-delete img').show().parent().show();
        }
    }
    function kbxmPreview(id) {
        var row = $Grid.jqGrid('getRowData', id);
        jQuery('#divPreview').xmpPreview('show', row.itemname, (jQuery('#ddlPortalFilter').val()=="1"));
        $EditorPanel.hide();
        $GridPanel.hide();
        return false;
    }
    function kbxmPreviewLoadComplete() {
        jQuery('#divPreviewLoading').hide();
        jQuery('#ifPreview').show();
    }
    function kbxmConvertForm(id) {
        var row = $Grid.jqGrid('getRowData', id);
        kbxmInitFormBuilder() 
        $FormBuilder.formBuilder('convertForm', row.itemname, jQuery('#ddlPortalFilter').val());
    }
    function kbxmEditRow(id) {
        lastSel = id;
        var row = $Grid.jqGrid('getRowData', id);
        if (row.itemtype == 'Custom') {
            // no XML file exists, load in plain editor.
            if (!bInitEditor) kbxmInitTextEditor();
            jQuery('#txtItemSaveNew').hide();
            jQuery('#txtItemSaveEdit').show();
            jQuery('#txtItemSaveEdit').val('<%=LocalizeText("Update")%>');
            setAddForm('');
            setEditForm('');
            jQuery('#ItemEditTitle').html('');
            kbxmAjaxGetForm(row.itemname, editor, editor2, jQuery('#ddlPortalFilter').val());
            editor.refresh();
            editor2.refresh();
            $EditorPanel.show();
            $GridPanel.hide();
        } else {
            var isGlobal = (jQuery('#ddlPortalFilter').val() == "1");
            if (!bInitBuilder) kbxmInitFormBuilder();
            $FormBuilder.formBuilder('editForm', row.itemname, isGlobal);
            $GridPanel.hide();
        }

    }

    function kbxmRename(id) {
        if (lastSel != id) { kbxmCancelEdit(lastSel) };
        lastSel = id;
        var row = $Grid.jqGrid('getRowData', id);
        oldItemName = row.itemname;
        $Grid.jqGrid('editRow', id, false);
        kbxmUpdateEditButtons('edit', id);
    }
    function kbxmSaveRow(id) {
        $Grid.jqGrid('saveRow', id, false, 'clientArray');
        var row = $Grid.jqGrid('getRowData', id);
        // put row back in edit mode
        $Grid.jqGrid('editRow', id, false);
        kbxmUpdateEditButtons('edit', id);
        kbxmAjaxRenameItem(row.itemname, id, jQuery('#ddlPortalFilter').val());
    }
    function kbxmCopy(id) {
        var row = $Grid.jqGrid('getRowData', id);
        var itemType = row.itemtype;
        kbxmAjaxCopyItem(row.itemname, id, itemType, kbxmReloadGrid, jQuery('#ddlPortalFilter').val());
        //kbxmReloadGrid();
    }
    function kbxmCancelEdit(id) {
        $Grid.jqGrid('restoreRow', id);
        kbxmUpdateEditButtons('canceledit', id);
    }
    function kbxmDeleteRow(id) {
        lastSel = id;
        var row = $Grid.jqGrid('getRowData', id);
        var bDel = false;
        $dlg.html('<%=LocalizeText("ConfirmDelete")%>').dialog(
		{ position: [100, 100],
		    modal: true,
		    buttons: { '<%=LocalizeText("Cancel")%>': function () { jQuery(this).dialog('destroy'); },
		        '<%=LocalizeText("Delete")%>': function () { kbxmAjaxDeleteItem('form', row.itemname, jQuery("#ddlPortalFilter").val()); }
		    },
		    title: '<%=LocalizeText("ConfirmDeleteTitle")%>'
		});
    }
</script>

	</form>
</body>

</html>
