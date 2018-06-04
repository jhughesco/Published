<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="ManageTemplates.aspx.vb" Inherits="KnowBetter.XModPro.ManageTemplatesHost" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head" runat="server">
    <title>XMod Pro - Manage Templates</title>
    
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
        .kbxmDialog 
        {
        	font-size: 12px;
        }
        .kbxmRow {margin-bottom: 5px;}
        .kbxmSubRow {margin-left: 25px; display: none; margin-top: 10px;}
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
        /* Editor Styling */
		.CodeMirror  
		{
		    border-left: 1px solid #CCC; 
		    border-right: 1px solid #CCC; 
		    border-bottom: 1px solid #CCC; 
		    /*height: auto;*/
		    min-height: 600px;
		    /*max-height: 900px;*/
		    font-size: 1.1em;
		}
		.CodeMirror-scroll 
		{
			width: 100%;
			/*height: auto;*/
			max-height: 900px;
			font-size: 1.1em;
			/*overflow-x: auto;*/
			/*overflow-y: hidden;*/
		}
        .cm-xmptoken {color: #F90; font-weight: bold;}
        .xmp-toolbar {
	        overflow: hidden;
        }
        .xmp-toolbar {
	        padding: 5px 8px;
        }
        .xmp-toolbar ul li {
	        display:block;
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
    <script src="scripts/viewbuilder.js" type="text/javascript"></script>
    <script src="scripts/datachooser.js" type="text/javascript"></script>
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
    <script src="scripts/formbuilder.js" type="text/javascript"></script>
	<script src="scripts/editortoolbar.js" type="text/javascript"></script>
	<script src="scripts/viewDesigners.js" type="text/javascript"></script>
    <script src="scripts/snippet-mgr.js" type="text/javascript"></script>

    <script type="text/javascript">
        var kbxm_WebRoot = '<%=Page.ResolveUrl("~")%>';
        var kbxm_UrlManage = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/KBXM_Manage.aspx")%>';
        var kbxm_UrlUtil = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/KBXM_DUtils.aspx")%>';
        var kbxm_xdata = '<%=Request("xdata")%>';
        var kbxm_UniqueId = 0;
        var lastSel;
        var oldItemName;
        var $Grid; 
        var $dlg;
        var kbxmItemType = 'template';
        var $GridPanel;
        var $EditorPanel;
        var $EditorControl;
        var $TablesList;
        var $KeyFieldList;
        var $OutputType;
        var $PreviewPanel;
        var bDialogInit = false;


        CodeMirror.commands.autocomplete = function (cm) {
            CodeMirror.showHint(cm, CodeMirror.xmodHint) 
        }

        jQuery(document).ready(function () {
            $Grid = jQuery('#list');
            $dlg = jQuery('#divDialog');
            $TablesList = jQuery('#ddlTables');
            $KeyFieldList = jQuery('#ddlKeyField');
            $EditorControl = jQuery('#taEditor');
            $EditorPanel = jQuery('#divEditorPanel');
            $GridPanel = jQuery('#divGridPanel');
            $OutputType = jQuery('#ddlTemplateType');
            $PreviewPanel = jQuery('#divPreview');

            // Setup editor
            editor = CodeMirror.fromTextArea(document.getElementById("taEditor"),
				{ mode: "htmlmixed",
				    tabMode: "indent",
                    tabSize: 2, 
				    lineNumbers: true,
				      foldGutter: true, 
              gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"], 
                    autoCloseTags: true, 
				    extraKeys: {
                "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); } , 
				        "'>'": function (cm) { cm.closeTag(cm, '>'); },
				        "'/'": function (cm) { cm.closeTag(cm, '/'); }, 
                        "Ctrl-Space": "autocomplete"
				    }
				});
                $('#editor-toolbar').editorToolbar({ editor: editor, contentType: 'template', xdata: kbxm_xdata });

            jQuery('#btnCancelEdit').click(function () {
                $EditorPanel.hide();
                $GridPanel.show();
            });
            jQuery('#btnItemSaveEdit').click(function () {
                var row = $Grid.jqGrid('getRowData', lastSel);
                kbxmAjaxSaveItem(row.itemname, editor.getValue(), null, jQuery('#ddlPortalFilter').val(), false);
            });
            jQuery('#btnItemSaveNew').click(function () {
                // verify item name is valid
                var $ItemName = jQuery('#txtItemName');
                var sName = $ItemName.val();
                if (!(sName.match(/^[a-zA-Z0-9_\-]+$/gi))) {
                    kbxmShowDialog('<%=LocalizeText("ItemNameValidation")%>',
                             '<%=LocalizeText("InvalidTemplateName")%>',
                             [200, 125]);
                }
                else {
                    kbxmAjaxSaveItem(sName, editor.getValue(), kbxmReloadGrid, jQuery('#ddlPortalFilter').val(), true);
                }
            });

            jQuery('#btnPortalFilter').click(function () {
                var newUrl = 'KBXM_Manage.aspx?callback=loadtemplates&g=' + jQuery('#ddlPortalFilter').val() + '&xdata=<%=Server.UrlEncode(Request.Params("xdata"))%>'
                jQuery('#list').jqGrid('setGridParam', { url: newUrl }).trigger("reloadGrid");
            });

            kbxmInitGrid();
            jQuery('#divNewTemplateDialog').viewBuilder({
                xdata: kbxm_xdata,
                onSave: function (output) {
                    editor.execCommand("selectAll");
                    editor.replaceSelection(output);
                    jQuery('#txtItemName').val(''); // clear any previous names
                    jQuery('#ItemEditTitle').hide();
                    jQuery('#divItemName').show();
                    $GridPanel.hide();
                    $EditorPanel.show();
                    jQuery('#btnItemSaveNew').show();
                    jQuery('#btnItemSaveEdit').hide();
                    editor.refresh();
                    editor.focus();
                    jQuery('#divNewTemplateDialog').dialog('close');
                },
                onCancel: function () {
                    jQuery('#divNewTemplateDialog').dialog('close');
                }
            });

            jQuery('#btnNewTemplate').click(function () {
                if (!bDialogInit) {
                    jQuery('#divNewTemplateDialog').dialog(
                {
                    autoOpen: false,
                    modal: true,
                    width: 480,
                    title: '<%=LocalizeText("NewTemplate")%>',
                    position: [285, 117]
                });
                    bDialogInit = true;
                }
                jQuery('#divNewTemplateDialog').dialog('open');
            });

            jQuery('#ddlTemplateType').change(function () {
                switch (jQuery(this).val()) {
                    case 'slideshow':
                        // change label for key field
                        jQuery('#divKeyField label').text('<%=LocalizeText("ImageField")%>');
                        jQuery('#divSlideshowOptions').show();
                        break;
                    default:
                        jQuery('#divKeyField label').text('<%=LocalizeText("SelectUniqueId")%>');
                        jQuery('#divSlideshowOptions').hide();
                }
            });

            jQuery("#btnNew").click(function () {
                var sDefault =
              '<xmod:Template>\n' +
              '  <ListDataSource CommandText="" />\n' +
              '  <DetailDataSource CommandText="" />\n\n' +
              '  <HeaderTemplate>\n' +
              '    \n' +
              '  </HeaderTemplate>\n\n' +
              '  <ItemTemplate>\n' +
              '    \n' +
              '  </ItemTemplate>\n\n' +
              '  <FooterTemplate>\n' +
              '    \n' +
              '  </FooterTemplate>\n\n' +
              '  <DetailTemplate>\n' +
              '    \n' +
              '  </DetailTemplate>\n' +
              '</xmod:Template>\n';
                $EditorControl.val(sDefault);
                jQuery('#ItemEditTitle').hide();
                jQuery('#divItemName').show();
                if (document.getElementById('chkLoadFromTable').checked && $TablesList.val() != '') {
                    jQuery('#kbxmProgressNew').show();
                    var options = '';
                    switch (jQuery('#ddlTemplateType').val()) {
                        case 'slideshow':
                            options = "height|" + jQuery('#divSlideshowOptions div:first').children('input:first').val() + ";";
                            options += "width|" + jQuery('#divSlideshowOptions div:first').children('input:last').val() + ";";
                            options += "timeout|" + jQuery('#divSlideshowOptions div:last').children('input:first').val() + ";";
                            options += "basepath|" + jQuery('#divSlideshowOptions div:last').children('input:last').val() + ";";
                            break;
                    }
                    var connStr = '';
                    if (jQuery('#ddlDataSource').val() == 'ext') {
                        connStr = jQuery('#txtConnectionString').val();
                    }
                    kbxmAjaxCreateFromTable($TablesList.val(), $KeyFieldList.val(), options, connStr);
                }
                jQuery('#txtItemName').val('');
                jQuery('#btnItemSaveNew').show();
                jQuery('#btnItemSaveEdit').hide();
                $GridPanel.hide();
                $EditorPanel.show();
                jQuery('#divNewTemplateDialog').dialog('close');
            });
            jQuery("#chkLoadFromTable").click(function () {
                if (this.checked) {
                    jQuery('#divDataSource').show();
                    /*
                    if (jQuery("option", $TablesList).length) {
                    $TablesList.parent().show();
                    }
                    else {
                    jQuery('#kbxmProgressLoadTables').show();
                    kbxmAjaxGetTables(true); // inlcude views
                    }*/
                }
                else {
                    jQuery('#divDataSource').hide();
                    $TablesList.parent().hide();
                    $KeyFieldList.parent().hide();
                }
            });
            jQuery('#ddlDataSource').change(function () {
                jQuery('#divConnectionString').hide();
                jQuery('#divTablesList').hide();
                jQuery('#divKeyField').hide();
                switch ($(this).val()) {
                    case 'dnn':
                        jQuery('#kbxmProgressLoadTables').show();
                        kbxmAjaxGetTables(true); // include views
                        break;
                    case 'ext':
                        jQuery('#divConnectionString').show();
                        break;
                } // switch
            });
            jQuery('#btnLoadExternalTables').click(function () {
                var connStr = jQuery('#txtConnectionString').val();
                if (connStr) {
                    kbxmAjaxGetTables(true, connStr);
                }
            }); //btnLoadExternalTables_click
            $TablesList.change(function () {
                var tableName = $TablesList.val();
                if (tableName == '') {
                    $KeyFieldList.parent().hide();
                }
                else {
                    jQuery('#kbxmProgressLoadCols').show();
                    if (jQuery('#ddlDataSource').val() == 'ext') {
                        kbxmAjaxGetTableColumns(tableName, true, jQuery('#txtConnectionString').val());
                    } else {
                        kbxmAjaxGetTableColumns(tableName, true); //include views
                    }
                }
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
                    buttons: { '<%=LocalizeText("Close")%>': function () { jQuery(this).dialog('close') } }
                });
                jQuery('#dlgHelp').dialog('open');
            });

            jQuery('#btnPreviewReturn').click(function () {
                $PreviewPanel.hide();
                $GridPanel.show();
                return false;
            });

        });
            
    </script>
    
    <script src="scripts/kbxm-cp-ajax.js" type="text/javascript"></script>

    <script type="text/javascript">
        function kbxmShowDialog(msg, title, position) {
            if (!title) title = '';
            if (!position) position = 'center';
            var $dlg = jQuery('#divDialog');
            $dlg.html(msg);
            $dlg.dialog({
                position: position,
                modal: true,
                buttons: { "Close": function () { jQuery(this).dialog("destroy"); } },
                title: title
            });
        }
        function kbxmReloadGrid() {
            $Grid.jqGrid().trigger('reloadGrid');
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

        function kbxmGenerateInUseIcons(id) {
            var curRow = $Grid.jqGrid('getRowData', id);
            if (curRow) {
                if (jQuery('#ddlPortalFilter').val() == 1) {
                    // global templates aren't eligible for in-use stats at this time.
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
            jQuery("#list").jqGrid({
                url: 'KBXM_Manage.aspx?callback=loadtemplates&xdata=<%=Server.UrlEncode(Request.Params("xdata"))%>',
                datatype: 'xml',
                mtype: 'GET',
                height: 600,
                width: 884,
                colNames: ['', '', '<%=LocalizeText("TemplateNameColumn")%>', 'Used?', 'Modified', 'Created'],
                colModel: [
              { name: 'act', index: 'act', width: 120, sortable: false },
              { name: 'id', index: 'id', width: 60, hidden: true },
              { name: 'itemname', index: 'itemname', width: 250, editable: true, edittype: 'text', editoptions: { size: 50, maxlength: 128} },
              { name: 'inuse', index: 'inuse', align: 'left', editable: false },
              { name: 'modified', index: 'modified', width: 150, editable: false },
              { name: 'created', index: 'created', width: 150, editable: false }
           ],
                caption: '<%=LocalizeText("TemplateManager")%>',
                editurl: 'KBXM_Manage.aspx?callback=edittemp&xdata=<%=Server.UrlEncode(Request.Params("xdata"))%>',
                rowNum: 25,
                rowList: [5, 10, 15, 20, 25, 30, 40, 50, 75, 100],
                pager: '#divGridPanelPager',
                viewrecords: true,
                rownumbers: true,
                gridComplete: function () {
                    var ids = jQuery("#list").jqGrid('getDataIDs');
                    for (var i = 0; i < ids.length; i++) {
                        var cl = ids[i];
                        jQuery("#list").jqGrid('setRowData', ids[i], {
                            act: kbxmGenerateActionButtons(cl), 
                            inuse : kbxmGenerateInUseIcons(cl)
                        });
                    }
                    jQuery('a.xmp-grid-commandbutton').find('img').css({ 'border': '0px' });
                    jQuery('a.xmp-grid-commandbutton').click(function () {
                        var $btn = jQuery(this);
                        var id = $btn.find('span').text();
                        if ($btn.hasClass('xmp-grid-preview')) { kbxmPreview(id); }
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
                        } //preview
                    });
                }
            });
            jQuery('#list').jqGrid('navGrid', '#divGridPanelPager', { add: false, edit: false, del: false, search: false });
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
            jQuery('#ifPreview').hide();
            $PreviewPanel.show();
            jQuery('#divPreviewLoading').show();
            jQuery('#ifPreview').attr('src', 'PreviewTemplate.aspx?tn=' + row.itemname + 
                                             '&xdata=<%=Server.UrlEncode(Request("xdata"))%>' + 
                                             '&g=' + jQuery('#ddlPortalFilter').val());
            $EditorPanel.hide();
            $GridPanel.hide();
            return false;
        }
        function kbxmPreviewLoadComplete() {
            jQuery('#divPreviewLoading').hide();
            jQuery('#ifPreview').show();
        }
        function kbxmEditRow(id) {
            lastSel = id;
            jQuery('#btnItemSaveNew').hide();
            jQuery('#btnItemSaveEdit').show();
            var row = $Grid.jqGrid('getRowData', id);
            jQuery('#btnItemSaveEdit').val('<%=LocalizeText("Update")%>');
            $GridPanel.hide();
            $EditorPanel.show();
            kbxmAjaxGetItem(row.itemname, jQuery('#ddlPortalFilter').val());
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
            kbxmAjaxCopyItem(row.itemname, id, null, kbxmReloadGrid, jQuery('#ddlPortalFilter').val());
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
                    '<%=LocalizeText("Delete")%>': function () { kbxmAjaxDeleteItem('template', row.itemname, jQuery("#ddlPortalFilter").val()); }
                },
                title: '<%=LocalizeText("ConfirmDeleteTitle")%>'
            });
        }

    </script>

</head>
<body style="height: 600px;">
    <form id="form1" runat="server">
        <div id="dlgHelp" style="display:none;"></div>
        
        
        <div id="divGridPanel" class="ui-widget" style="margin-top:10px;">
            <div style="overflow:hidden;">
                <div style="margin: 10px 0px;float:left;">
                    <input type="button" id="btnNewTemplate" value="<%=LocalizeText("NewTemplate")%>" />
                </div>
                <div style="float:right;">
                    Showing: 
                    <select size="1" id="ddlPortalFilter">
                        <option value="0">Portal Templates</option>
                        <option value="1">Global Templates</option>
                    </select>
                    <input type="button" id="btnPortalFilter" value="Go" />
                </div>
            </div>
            <div style="float:left;">
                <table id="list"></table>
                <div id="divGridPanelPager"></div>
            </div>
        </div>
        
        
        <div id="divEditorPanel" style="display:none;" class="ui-widget">
            <h3 id="ItemEditTitle" style="margin:3px; float:left;"></h3>
            <div id="divItemName" style="float:left; margin-bottom: 8px;">
                <label for="txtItemName"><%=LocalizeText("TemplateName")%></label>
                <input id="txtItemName" />
            </div>
            <div id="divHelp" class="ui-widget" style="float:right; padding-right: 20px; margin-bottom: 8px;">
                <label for="ddlHelp"><%=LocalizeText("HelpTopics")%></label>&nbsp;
                <select id="ddlHelp" size="1">
                    <option value=""></option>
                    <option value="help/temp_addbutton.html">Add Button</option>
                    <option value="help/temp_addimage.html">Add Image</option>
                    <option value="help/temp_addlink.html">Add Link</option>
                    <option value="help/temp_ajaxbutton.html">Ajax Button</option>
                    <option value="help/temp_ajaximage.html">Ajax Image</option>
                    <option value="help/temp_ajaxlink.html">Ajax Link</option>
                    <option value="help/temp_commandbutton.html">Command Button</option>
                    <option value="help/temp_commandimage.html">Command Image</option>
                    <option value="help/temp_commandlink.html">Command Link</option>
                    <option value="help/temp_datalist.html">DataList</option>
                    <option value="help/temp_pager.html">...Pager</option>
                    <option value="help/temp_searchsort.html">...Search Sort</option>
                    <option value="help/temp_deletebutton.html">Delete Button</option>
                    <option value="help/temp_deleteimage.html">Delete Image</option>
                    <option value="help/temp_deletelink.html">Delete Link</option>
                    <option value="help/temp_detailbutton.html">Detail Button</option>
                    <option value="help/temp_detailimage.html">Detail Image</option>
                    <option value="help/temp_detaillink.html">Detail Link</option>
                    <option value="help/temp_each.html">Each</option>
                    <option value="help/temp_editbutton.html">Edit Button</option>
                    <option value="help/temp_editimage.html">Edit Image</option>
                    <option value="help/temp_editlink.html">Edit Link</option>
                    <option value="help/temp_format.html">Format</option>
                    <option value="help/temp_jqueryready.html">jQueryReady</option>
                    <option value="help/temp_loadfeed.html">Load Feed</option>
                    <option value="help/temp_loadfeedbutton.html">Load Feed Button</option>
                    <option value="help/temp_loadfeedimage.html">Load Feed Image</option>
                    <option value="help/temp_loadfeedlink.html">Load Feed Link</option>
                    <option value="help/temp_metatags.html">Meta Tags</option>
                    <option value="help/temp_scriptblock.html">Script Block</option>
                    <option value="help/temp_redirect.html">Redirect</option>
                    <option value="help/temp_register.html">Register</option>
                    <option value="help/temp_returnbutton.html">Return Button</option>
                    <option value="help/temp_returnimage.html">Return Image</option>
                    <option value="help/temp_returnlink.html">Return Link</option>
                    <option value="help/temp_select.html">Select</option>
                    <option value="help/temp_slideshow.html">Slideshow</option>
                    <option value="help/temp_template.html">Template</option>
                    <option value="help/temp_pager.html">...Pager</option>
                    <option value="help/temp_searchsort.html">...Search Sort</option>
                    <option value="help/temp_togglebutton.html">Toggle Button</option>
                    <option value="help/temp_toggleimage.html">Toggle Image</option>
                    <option value="help/temp_togglelink.html">Toggle Link</option>
                    <option value="help/temp_tokens_data.html">Tokens: Data Parameters</option>
                    <option value="help/tokens_field.html">Tokens: Field</option>
                    <option value="help/tokens_functions.html">Tokens: Functions</option>
                    <option value="help/tokens_module.html">Tokens: Module</option>
                    <option value="help/tokens_portal.html">Tokens: Portal</option>
                    <option value="help/tokens_request.html">Tokens: Request</option>
                    <option value="help/tokens_user.html">Tokens: User</option>
                </select>
            </div>
            <div style="clear:both;height:1px">&nbsp;</div>
            <div id="editor-toolbar"></div>
            <textarea id="taEditor"></textarea>
            <div class="kbxmRow">
              <input type="button" id="btnItemSaveEdit" value="<%=LocalizeText("Save")%>" class="EditorButton" />
              <input type="button" id="btnItemSaveNew" value="<%=LocalizeText("Save")%>" class="EditorButton" />
              <input type="button" id="btnCancelEdit" value="<%=LocalizeText("Cancel")%>" class="EditorButton" />
            </div>
        </div>
        
        
        <div id="divPreview" style="display: none; height: 500px;" class="ui-widget ui-corner-all">
            <p><%=LocalizeText("TemplateEditorNote")%></p>
            <div id="divPreviewLoading" style="width:99%; height:50px; text-align: left;">
                <img src="images/ajax-loader.gif" /> <%=LocalizeText("LoadingPreview")%>
            </div>
            <iframe id="ifPreview" style="width:99%; height: 475px;" scrolling="no" frameborder="0" onload="kbxmPreviewLoadComplete()"></iframe>
            <button id="btnPreviewReturn"><%=LocalizeText("Return")%></button>
        </div>
        
        <div id="divNewTemplateDialog" style="display:none; padding: 10px;" class="kbxmDialog">
             <div class="kbxmRow">
                <label for="ddlTemplateType"><%=LocalizeText("TemplateType")%></label>
                <select id="ddlTemplateType" size="1">
                    <option value="grid"><%=LocalizeText("Grid")%></option>
                    <option value="onecoltable"><%=LocalizeText("OneColumnTable")%></option>
                    <option value="ol"><%=LocalizeText("NumberedList")%> (&lt;ol&gt;)</option>
                    <option value="ul"><%=LocalizeText("BulletList")%> (&lt;ul&gt;)</option>
                    <option value="pl"><%=LocalizeText("Paragraphs")%> (&lt;p&gt;)</option>
                    <option value="dl"><%=LocalizeText("BasicList")%> (&lt;div&gt;)</option>
                    <option value="datalist"><%=LocalizeText("DataList")%></option>
                    <option value="slideshow"><%=LocalizeText("ImageSlideshow")%></option>
                </select>
                <div id="divSlideshowOptions" style="display:none;" class="kbxmRow">
                    <div class="kbxmSubRow" style="display:block;">
                        <label><%=LocalizeText("Height")%></label> <input type="text" style="width:40px;" /> 
                        <label><%=LocalizeText("Width")%></label> <input type="text" style="width:40px;" />
                    </div>
                    <div class="kbxmSubRow" style="display:block;">
                        <label><%=LocalizeText("FrameDuration")%></label> <input type="text" style="width:60px;" value="4000" /><br />
                        <label><%=LocalizeText("BaseImagePath")%></label><br />
                        <input type="text" style="width:200px;" value="~/Portals/<%=GetPortalId()%>" />
                    </div>
                </div>
            </div>
            <div class="kbxmRow">
                <input type="checkbox" id="chkLoadFromTable" />
                <label for="chkLoadFromTable" class="kbxmLabel">
                    <%=LocalizeText("GenerateTemplateFromTable")%></label>
                <img src="images/ajax-loader.gif" alt="Processing" title="Processing..." id="Img1"
                    style="display: none; margin-left: 5px;" />
                <div class="kbxmSubRow" id="divDataSource">
                    <label for="ddlDataSource"><%=LocalizeText("SelectDataSource")%></label><br style="clear:both;"/>
                    <select id="ddlDataSource">
                      <option value="" selected="selected"><%=LocalizeText("None")%></option>
                      <option value="dnn"><%=LocalizeText("DotNetNukeDatabase")%></option>
                      <option value="ext"><%=LocalizeText("ExternalSQLServer")%></option>
                    </select>
                    <div id="divConnectionString" style="clear:both; display:none;">
                      <label for="txtConnectionString"><%=LocalizeText("ConnectionString")%></label><br style="clear:both;"/>
                      <input id="txtConnectionString" style="width:300px;" /> 
                      <input type="button" id="btnLoadExternalTables" value="<%=LocalizeText("LoadTables")%>" />
                    </div>
                </div>
                
                <div class="kbxmSubRow" id="divTablesList">
                    <label for="ddlTables">
                        <%=LocalizeText("SelectTable")%>
                    </label><br style="clear:both;" />
                    <select id="ddlTables" size="1">
                    </select>
                    <img src="images/ajax-loader.gif" alt="Processing" title="Processing..." id="Img2"
                        style="display: none; margin-left: 5px;" />
                </div>
                <div class="kbxmSubRow" id="divKeyField">
                    <label for="ddlKeyField">
                        <%=LocalizeText("SelectUniqueId")%>
                    </label><br style="clear:both;" />
                    <select id="ddlKeyField" size="1">
                    </select>
                </div>
            </div>
           <div style="margin-top:20px; margin-bottom: 20px;">
                <input type="button" id="btnNew" value="<%=LocalizeText("NewTemplate")%>" />
                <img src="images/ajax-loader.gif" alt="Processing" title="Processing..." id="kbxmProgressNew"
                    style="display: none; margin-left: 5px;" />
            </div>
         </div>
        
        <div id="divDialog" style="display:none" class="kbxmDialog"></div>


    </form>
</body>
</html>
