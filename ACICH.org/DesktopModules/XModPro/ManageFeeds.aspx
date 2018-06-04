<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="ManageFeeds.aspx.vb" Inherits="KnowBetter.XModPro.ManageFeedsHost" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head" runat="server">
    <title>Untitled Page</title>
    
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
			min-height: 600px;
			/*max-height: 900px;*/
			font-size: 1.1em;
			/*overflow-x: auto;
			overflow-y: hidden;*/
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
    <script src="scripts/code-mirror/xml.js" type="text/javascript"></script>
    <script src="scripts/code-mirror/javascript.js" type="text/javascript"></script>
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
	<script src="scripts/editortoolbar.js" type="text/javascript"></script>
	<script src="scripts/viewDesigners.js" type="text/javascript"></script>
	<script src="scripts/snippet-mgr.js" type="text/javascript"></script>
    
    <script type="text/javascript">
        var kbxm_UrlManage = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/KBXM_Manage.aspx")%>';
        var kbxm_UrlUtil = '<%=Page.ResolveUrl("~/DesktopModules/XModPro/KBXM_DUtils.aspx")%>';
        var kbxm_xdata = '<%=Request("xdata")%>';
        var kbxm_UniqueId = 0;
        var lastSel;
        var oldItemName;
        var $Grid; 
        var $dlg;
        var kbxmItemType = 'feed';
        var $GridPanel;
        var $EditorPanel;
        var $EditorControl;
        var $TablesList;
        var $KeyFieldList; 
        var $OutputType;
        var $PreviewPanel;
        var bDialogInit = false;
        // setup auto-complete flag
        var xmpCCDefinition = "feed";


        jQuery(document).ready(function() {
            $Grid = jQuery('#list');
            $dlg = jQuery('#divDialog');
            $TablesList = jQuery('#ddlTables');
            $KeyFieldList = jQuery('#lstColumns');
            $EditorControl = jQuery('#taEditor');
            $EditorPanel = jQuery('#divEditorPanel');
            $GridPanel = jQuery('#divGridPanel');
            $OutputType = jQuery('#ddlFeedType');
            $PreviewPanel = jQuery('#divPreview');

            // Setup editor
            editor = CodeMirror.fromTextArea(document.getElementById("taEditor"),
				    {
				      mode: "htmlmixed",
				      tabMode: "indent",
				      tabSize: 2,
				      lineNumbers: true,
				      foldGutter: true,
				      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
				      autoCloseTags: true,
				    extraKeys: {
				        "Ctrl-Q": function(cm) { cm.foldCode(cm.getCursor()); },
				        "'>'": function (cm) { cm.closeTag(cm, '>'); },
				        "'/'": function (cm) { cm.closeTag(cm, '/'); }, 
                        "Ctrl-Space": "autocomplete"
				    }
				});
            $('#editor-toolbar').editorToolbar({ editor: editor, contentType: 'feed' });

            jQuery('#btnCancelEdit').click(function () {
                $EditorPanel.hide();
                $GridPanel.show();
            });
            jQuery('#btnItemSaveEdit').click(function() {
                var row = $Grid.jqGrid('getRowData', lastSel);
                kbxmAjaxSaveItem(row.itemname, editor.getValue(),null,false,false);
            });
            jQuery('#btnItemSaveNew').click(function() {
                // verify item name is valid
                var $ItemName = jQuery('#txtItemName');
                var sName = $ItemName.val();
                if (!(sName.match(/^[a-zA-Z0-9_\-]+$/gi))) {
                    kbxmShowDialog('<%=LocalizeText("ItemNameValidation")%>',
                             '<%=LocalizeText("InvalidFeedName")%>',
                             [200, 125]);
                }
                else {
                    kbxmAjaxSaveItem(sName, editor.getValue(), kbxmReloadGrid,false,true);
                }
            });

            kbxmInitGrid();

            jQuery('#btnNewFeed').click(function() {
              if (!bDialogInit) {
                jQuery('#divNewFeedDialog').dialog( 
                {
                  autoOpen: false, 
                  modal: true, 
                  width: 400, 
                  title: '<%=LocalizeText("NewFeed")%>', 
                  position: [285, 117]
                });
                bDialogInit = true;
              }
              jQuery('#divNewFeedDialog').dialog('open'); 
            });

            jQuery('#ddlFeedType').change(function() {
                switch (jQuery(this).val()) {
                    default:
                        jQuery('#divKeyField label').text('<%=LocalizeText("SelectColumns")%>');
                }
            });

            jQuery("#btnNew").click(function() {
              kbxmCreateFeed();
            });
            jQuery("#chkLoadFromTable").click(function() {
                if (this.checked) {
                  jQuery('#divDataSource').show();
                }
                else {
                  jQuery('#divDataSource').hide();
                  $TablesList.parent().hide();
                  $KeyFieldList.parent().hide();
                }
            });
            jQuery('#ddlDataSource').change( function(){
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
            jQuery('#btnLoadExternalTables').click( function() {
              var connStr = jQuery('#txtConnectionString').val();
              if (connStr) {
                kbxmAjaxGetTables(true, connStr);
              }
            }); //btnLoadExternalTables_click
            $TablesList.change(function() {
                var tableName = $TablesList.val();
                if (tableName == '') {
                    $KeyFieldList.parent().hide();
                }
                else {
                    jQuery('#kbxmProgressLoadCols').show();
                    kbxmGetTableColumns();
                }
            });

            jQuery('#ddlHelp').change(function() {
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
                    buttons: { '<%=LocalizeText("Close")%>': function() { jQuery(this).dialog('close') } }
                });
                jQuery('#dlgHelp').dialog('open');
            });

            jQuery('#btnPreviewReturn').click(function() {
                $PreviewPanel.hide();
                $GridPanel.show();
                return false;
            });
            jQuery('#lnkCallingAFeed').click( function() {
              kbxmShowDialog( 
                '<p>Use a URL in the form of:<br />' + 
                '<strong>http://<em>sitename</em>/DesktopModules/XModPro/Feed.aspx?xfd=<em>FeedName</em>&amp;pid=<em>PortalId</em></strong><br /><br />' + 
                'Where <em>sitename</em> is your site\'s domain, <em>FeedName</em> is the name of the feed as listed in the grid, ' + 
                'and <em>PortalId</em> is the numeric ID of the portal for which the feed is created.</p>', 
                'Calling An XMod Pro Feed', [200,15]);
            });
        }); 
            
    </script>
    
    <script src="scripts/kbxm-cp-ajax.js" type="text/javascript"></script>

</head>
<body style="height: 600px;">
    <form id="form1" runat="server">
        <div id="dlgHelp" style="display:none;"></div>
        
        
        <div id="divGridPanel" class="ui-widget" style="margin-top:10px;">
            <div style="margin: 10px 0px; width: 850px; overflow:hidden;">
              <div style="float: left; width:300px;"><input type="button" id="btnNewFeed" value="<%=LocalizeText("NewFeed")%>" /></div>
              <div style="float: right; width:400px; text-align:right;"><a href="#" id="lnkCallingAFeed">How To: Call A Feed</a></div>
            </div>
            <div style="float:left;clear: both;">
                <table id="list"></table>
                <div id="divGridPanelPager"></div>
            </div>
            <div style="width: 850px; margin: 10px 0px; clear: both;">
              <p>NOTE: If your feed relies on parameters that are passed-in to the feed, 
                you may not be able to preview it in this interface. You can always call the live feed 
                in your browser (see the "How To: Call A Feed" link above the grid for more information)
               </p>
            </div>
        </div>
        
        
        <div id="divEditorPanel" style="display:none;" class="ui-widget">
            <h3 id="ItemEditTitle" style="margin:3px; float:left;"></h3>
            <div id="divItemName" style="float:left;">
                <label for="txtItemName"><%=LocalizeText("FeedName")%></label>
                <input id="txtItemName" />
            </div>
            <div id="divHelp" class="ui-widget" style="float:right; padding-right: 20px;">
                <label for="ddlHelp"><%=LocalizeText("HelpTopics")%></label>&nbsp;
                <select id="ddlHelp" size="1">
                    <option value=""></option>
                    <option value="help/feeds.html">Feed Tag</option>
                    <option value="help/temp_format.html">Format</option>
                    <option value="help/temp_metatags.html">Meta Tags</option>
                    <option value="help/temp_scriptblock.html">Script Block</option>
                    <option value="help/temp_register.html">Register</option>
                    <option value="help/temp_select.html">Select</option>
                    <option value="help/tokens_field.html">Tokens: Field</option>
                    <option value="help/tokens_functions.html">Tokens: Functions</option>
                    <option value="help/tokens_request.html">Tokens: Request</option>
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
            <div id="divPreviewLoading" style="width:99%; height:50px; text-align: left;">
                <img src="images/ajax-loader.gif" /> <%=LocalizeText("LoadingPreview")%>
            </div>
            <iframe id="ifPreview" style="width:99%; height: 475px;" scrolling="no" frameborder="0" onload="kbxmPreviewLoadComplete()"></iframe>
            <button id="btnPreviewReturn"><%=LocalizeText("Return")%></button>
        </div>
        
        <div id="divNewFeedDialog" style="display:none; padding: 10px;" class="kbxmDialog">
             <div class="kbxmRow">
                <label for="ddlFeedType"><%=LocalizeText("FeedType")%></label>
                <select id="ddlFeedType" size="1">
                    <option value="custom"><%=LocalizeText("Custom")%></option>
                    <option value="csv"><%=LocalizeText("CommaSeparatedValues")%></option>
                    <option value="xml">XML</option>
                </select>
            </div>
             <div class="kbxmRow">
                <label for="txtFilename"><%=LocalizeText("Filename")%></label>
                <input type="text" id="txtFilename" style="width: 250px;" />
            </div>
            <div class="kbxmRow">
                <input type="checkbox" id="chkLoadFromTable" />
                <label for="chkLoadFromTable" class="kbxmLabel">
                    <%=LocalizeText("GenerateFeedFromTable")%></label>
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
                    <label for="lstColumns">
                        <%=LocalizeText("SelectUniqueId")%>
                    </label><br style="clear:both;" />
                    <select id="lstColumns" size="8" multiple="multiple">
                    </select>
                </div>
            </div>
           <div style="margin-top:20px; margin-bottom: 20px;">
                <input type="button" id="btnNew" value="<%=LocalizeText("NewFeed")%>" />
                <img src="images/ajax-loader.gif" alt="Processing" title="Processing..." id="kbxmProgressNew"
                    style="display: none; margin-left: 5px;" />
            </div>
         </div>
        
        <div id="divDialog" style="display:none" class="kbxmDialog"></div>

    <script type="text/javascript">
        function kbxmShowDialog(msg,title,position){
          if (!title) title = '';
          if (!position) position = 'center';
          var $dlg = jQuery('#divDialog');
          $dlg.html(msg);
          $dlg.dialog({
            position: position, 
            modal: true, 
            buttons: {'<%=LocalizeText("Close")%>': function(){jQuery(this).dialog("destroy");}}, 
                       title: title
                      });
        }
        function kbxmReloadGrid() {
          $Grid.jqGrid().trigger('reloadGrid');
        }
        function kbxmGenerateActionButtons(id){
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
        function kbxmInitGrid() {
          jQuery("#list").jqGrid({
            url: 'KBXM_Manage.aspx?callback=loadfeeds&g=0&xdata=<%=Server.UrlEncode(Request.Params("xdata"))%>', 
            datatype:'xml',
            mtype:'GET',  
            height:550,
            width: 850,
            colNames:['','','<%=LocalizeText("FeedNameColumn")%>', 'Modified', 'Created'],
            colModel :[ 
              {name:'act', index:'act', width:120, sortable:false}, 
              {name:'id', index:'id', width:60, hidden:true},
              {name:'itemname', index:'itemname', width:250, editable:true, edittype:'text', editoptions: {size:50,maxlength:128}},
              {name: 'modified', index: 'modified', width: 150, editable: false },
              {name: 'created', index: 'created', width: 150, editable: false }
           ],
            caption: '<%=LocalizeText("FeedManager")%>', 
            editurl: 'KBXM_Manage.aspx?callback=editfeed&xdata=<%=Server.UrlEncode(Request.Params("xdata"))%>',
            rowNum: 25, 
            rowList: [5,10,15,20,25,30,40,50,75,100], 
            pager: '#divGridPanelPager',  
            viewrecords: true, 
            rownumbers: true,
            gridComplete: function(){
              var ids = jQuery("#list").jqGrid('getDataIDs');
              for(var i=0;i < ids.length;i++){ 
                var cl = ids[i]; 
                jQuery("#list").jqGrid('setRowData',ids[i],{act:kbxmGenerateActionButtons(cl)}); 
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
          jQuery('#list').jqGrid('navGrid','#divGridPanelPager',{add:false,edit:false,del:false,search:false});
        }
        
        function kbxmUpdateEditButtons(action,id){
          switch (action)
          {
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

        function kbxmPreview(id){
            var row = $Grid.jqGrid('getRowData',id);
            jQuery('#ifPreview').hide();
            $PreviewPanel.show();
            jQuery('#divPreviewLoading').show();
            jQuery('#ifPreview').attr('src', 'Feed.aspx?xfd=' + row.itemname + '&pid=<%=GetPortalId()%>');
            $EditorPanel.hide();
            $GridPanel.hide();
            return false;
        }
        function kbxmPreviewLoadComplete(){
            jQuery('#divPreviewLoading').hide();
            jQuery('#ifPreview').show();
        }
        function kbxmEditRow(id){
            lastSel = id;
            jQuery('#btnItemSaveNew').hide();
            jQuery('#btnItemSaveEdit').show();
            var row = $Grid.jqGrid('getRowData',id);
            jQuery('#btnItemSaveEdit').val('<%=LocalizeText("Update")%>');
            $GridPanel.hide();
            $EditorPanel.show();
            kbxmAjaxGetItem(row.itemname);
        }
        function kbxmRename(id){
          if (lastSel != id) {kbxmCancelEdit(lastSel)};
          lastSel = id;
          var row = $Grid.jqGrid('getRowData',id);
          oldItemName = row.itemname;
          $Grid.jqGrid('editRow',id, false);
          kbxmUpdateEditButtons('edit',id);
        }
        function kbxmSaveRow(id){
          $Grid.jqGrid('saveRow', id, false, 'clientArray');
          var row = $Grid.jqGrid('getRowData',id);
         // put row back in edit mode
         $Grid.jqGrid('editRow',id,false);
         kbxmUpdateEditButtons('edit',id);
         kbxmAjaxRenameItem(row.itemname, id);
        }
        function kbxmCopy(id){
          var row = $Grid.jqGrid('getRowData',id);
          kbxmAjaxCopyItem(row.itemname,id,null,kbxmReloadGrid);
        }
        function kbxmCancelEdit(id){
          $Grid.jqGrid('restoreRow',id);
          kbxmUpdateEditButtons('canceledit',id);
        }
        function kbxmDeleteRow(id){
          lastSel = id;
          var row = $Grid.jqGrid('getRowData',id);
          var bDel = false;
          $dlg.html('<%=LocalizeText("ConfirmDelete")%>').dialog(
            {position:[100,100], 
             modal: true, 
             buttons: {'<%=LocalizeText("Cancel")%>': function(){ jQuery(this).dialog('destroy');}, 
                       '<%=LocalizeText("Delete")%>': function(){ kbxmAjaxDeleteItem('feed',row.itemname, 0);}
                      }, 
             title: '<%=LocalizeText("ConfirmDeleteTitle")%>'
            });
       }

      function kbxmGetTableColumns() {
        var chkLoadFromTable = jQuery('#chkLoadFromTable').get(0).checked;
        if (!chkLoadFromTable) return;
        var tableName = $TablesList.val();
        var methodName = 'gettableorviewcols';
        var functionData = { method: methodName, name: tableName, xdata: kbxm_xdata };
        var connStr = null;
        var dataSource = jQuery('#ddlDataSource').val();
        if (dataSource == 'ext') {
          methodName = 'gettableorviewcolsext';
          connStr = jQuery('#txtConnectionString').val();
          functionData = { method: methodName, name: tableName, connstr: connStr, xdata: kbxm_xdata }; 
        }
        jQuery.ajax({
          type: "POST", 
          dataType: "html", 
          url: kbxm_UrlUtil, 
          data: functionData, 
          success: function(data) {
            $KeyFieldList.html('').append(data);
            $KeyFieldList.parent().show();
            jQuery('#kbxmProgressLoadCols').hide();
          }, 
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200, 125]);
            jQuery('#kbxmProgressLoadCols').hide();
          }, 
          cache: false
        });
      }
      
      function kbxmCreateFeed() {
        var bLoadFromTable = jQuery('#chkLoadFromTable').get(0).checked;
        var sContentType = 'text/html';
        var sFilename = '';
        var sCommandText = "";
        var sConnStr = "";
        var sFeedContent = '';
        if (bLoadFromTable) {
          var tableName = '';
          var colNames = '';
          switch (jQuery('#ddlDataSource').val()){
            case 'ext': 
              sConnStr = ' ConnectionString="' + jQuery('#txtConnectionString').val() + '"';
            case 'dnn':
              tableName = $TablesList.val();
              colNames = $KeyFieldList.val();
              sCommandText = "SELECT " + colNames + " FROM " + tableName
              break;
            default:
          }
        } // if (bLoadFromTable)
        switch (jQuery('#ddlFeedType').val()) {
          case 'csv':
            sContentType = 'text/csv';
            sFeedContent = prepareCsvFeed();
            break;
          case 'xml':
            sContentType = 'text/xml';
            sFeedContent = prepareXmlFeed();
            break;
          default:
            sFeedContent = prepareDefaultFeed();
        }
        if (jQuery('#txtFilename').val()) sFilename = ' FileName="' + jQuery('#txtFilename').val() + '"';
        var sFeedTemplate =
              '<xmod:Feed ContentType="' + sContentType + '"' + sFilename + '>\n\n' +
              '<ListDataSource CommandText="' + sCommandText + '"' + sConnStr + ' />\n\n' +
              sFeedContent + 
              '</xmod:Feed>\n';
        jQuery('#ItemEditTitle').hide();
        jQuery('#divItemName').show();
        jQuery('#txtItemName').val('');
        jQuery('#btnItemSaveNew').show();
        jQuery('#btnItemSaveEdit').hide();
        $GridPanel.hide();
        $EditorPanel.show();
        editor.execCommand("selectAll");
        editor.replaceSelection(sFeedTemplate);
        jQuery('#divNewFeedDialog').dialog('close');
      }

      function prepareDefaultFeed(){
        return '<HeaderTemplate></HeaderTemplate>\n\n' + 
               '<ItemTemplate></ItemTemplate>\n\n' + 
               '<FooterTemplate></FooterTemplate>\n\n';
      }

      function prepareXmlFeed() {
        var sOut = '<HeaderTemplate><?xml version="1.0" encoding="utf-8"?>\n' +
                   '  <Root>\n' +
                   '</HeaderTemplate>\n\n' + 
                   '<ItemTemplate>\n' + 
                   '  <Item>\n';
                   
        $KeyFieldList.find('option:selected').each( function(){
          var colName = jQuery(this).val();
          sOut +=  '    <' + colName + '>[[' + colName + ']]</' + colName + '>\n';
        });
        sOut +=    '  </Item>\n' + 
                   '</ItemTemplate>\n\n' + 
                   '<FooterTemplate>\n' + 
                   '  </Root>\n' + 
                   '</FooterTemplate>\n\n'
        return sOut;
      }

      function prepareCsvFeed() {
        var sHead = '';
        var sItem = '';
        $KeyFieldList.find('option:selected').each(function() {
          var colName = jQuery(this).val();
          if (sHead.length > 0) { sHead += ','; }
          if (sItem.length > 0) { sItem += ','; }
          sHead += colName;
          sItem += '[[' + colName + ']]';
        });
        return '<HeaderTemplate>' + sHead + '\n</HeaderTemplate>\n\n' + 
               '<ItemTemplate>' + sItem + '\n</ItemTemplate>\n\n' + 
               '<FooterTemplate></FooterTemplate>\n\n';
      }

    </script>

    </form>
</body>
</html>
