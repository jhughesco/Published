<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="InlineEditor.aspx.vb" Inherits="KnowBetter.XModPro.InlineEditor" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
	<title>XMod Pro Inline Editor</title>
	<link href="<%=ResolveUrl("~/DesktopModules/XModPro/styles/ui-lightness/ui-lightness.css")%>" type="text/css" rel="Stylesheet" />
	<link href="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/codemirror.css")%>" type="text/css" rel="Stylesheet" />
	<link href="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/show-hint.css")%>" type="text/css" rel="Stylesheet" />
	<link href="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/addon/fold/foldgutter.css")%>" type="text/css" rel="Stylesheet" />
	<link href="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/dialog.css")%>" type="text/css" rel="Stylesheet" />
	<link href="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/theme/default.css")%>" type="text/css" rel="Stylesheet" />
	<link href="<%=ResolveUrl("~/DesktopModules/XModPro/styles/xmp.designers.css")%>" type="text/css" rel="Stylesheet" />

	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/jquery.min.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/jquery-ui.min.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/codemirror.js")%>" type="text/javascript"></script>
  <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/addon/fold/foldcode.js")%>" type="text/javascript"></script>
  <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/addon/fold/foldgutter.js")%>" type="text/javascript"></script>
  <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/addon/fold/brace-fold.js")%>" type="text/javascript"></script>
  <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/addon/fold/xml-fold.js")%>" type="text/javascript"></script>
  <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/addon/fold/comment-fold.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/javascript.js")%>" type="text/javascript"></script>
  <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/xml.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/css.js")%>" type="text/javascript"></script>
  <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/htmlmixed.js")%>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/closetag.js")%>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/simple-hint.js")%>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/xmod-hint.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/dialog.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/searchcursor.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/search.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/formatting.js")%>" type="text/javascript"></script>
<%--	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/code-mirror/util/overlay.js")%>" type="text/javascript"></script>--%>	
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/editortoolbar.js")%>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/formbuilder.js")%>" type="text/javascript"></script>
    <script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/datachooser.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/viewDesigners.js")%>" type="text/javascript"></script>
	<script src="<%=ResolveUrl("~/DesktopModules/XModPro/scripts/snippet-mgr.js")%>" type="text/javascript"></script>

	<style type="text/css">
		.CodeMirror { border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; font-size: 1.1em;}
		.CodeMirror-scroll 
		{
			height: 20px;
			width: 100%;
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
</head>
<body>
	<form id="form1" runat="server">
	<asp:Literal ID="litFormBuilderMessage" runat="server" Visible="false"></asp:Literal>
	<asp:panel ID="pnlEditArea" runat="server">
	<script type="text/javascript">

		$(document).ready(function() {
			var editingForm = <%=IsEditingForm()%>;
            if (editingForm) {window.xmpCCDefinition = 'form'; } else {window.xmpCCDefinition = 'template'; }
			var edHeight = $(document).height() - jQuery('#divControls').height() - 160;
			// Setup first editor
			editor = CodeMirror.fromTextArea(document.getElementById("<%=taCode1.ClientID%>"), 
				{
                    mode: "htmlmixed", 
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
			currEditor = editor; // set default currently visible editor to editor 1
						
			// setup 2nd editor if needed
			if (editingForm) {
				editor2 = CodeMirror.fromTextArea(document.getElementById("<%=taCode2.ClientID%>"), 
				{
                    mode: "htmlmixed", 
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
			} else {
				// hide other controls
				$('#TabEditor2').remove();
			}
			$('#<%=FormEditorTabs.ClientID%>').tabs({
				show: function(event,ui){
					switch (ui.index)
					{
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
            if (editingForm) {
                $('#editor-toolbar1').editorToolbar({editor: editor, contentType: 'form', xdata: '<%=Request("xdata")%>'});
                $('#editor-toolbar2').editorToolbar({editor: editor2, contentType: 'form', xdata: '<%=Request("xdata")%>'});
            } else {
                $('#editor-toolbar1').editorToolbar({editor: editor, xdata: '<%=Request("xdata")%>'});
            }
			$(".CodeMirror-scroll").css({ 'height': edHeight + 'px' });
            editor.setSize(null,edHeight + 'px');
            editor.refresh();
            if (editingForm) {
                editor2.setSize(null,edHeight + 'px');
                editor2.refresh();
            }


			jQuery('#btnSave').click(function(){
				var $this = jQuery(this);
                var chkReload = document.getElementById('<%=chkReloadPage.ClientID%>');
				jQuery('#btnClose').next('div.ui-state-highlight').remove();
				$this.after('<img src="images/ajax-loader.gif" class="loading" />');
				jQuery.ajax({
					url: '<%=ResolveUrl("~/DesktopModules/XModPro/InlineEditor.aspx")%>', 
					dataType: 'text', 
                    type: 'POST', 
					data: {
						'cmd': 'save', 
						'in': encodeURIComponent($('#txtItemName').val()), 
						'it': $('#txtItemType').val(), 
						'def': (editingForm) ? editor.getValue() + editor2.getValue() : editor.getValue(), 
						'pid': $('#txtPID').val(),
                        'xdata': '<%=Request("xdata")%>'
					}, 
					success: function(retVal) {
						jQuery('#btnClose').after('<div class="ui-widget ui-state-highlight ui-corner-all" style="padding:10px;">' + retVal + '</div>');
						$this.next('img.loading').first().remove();
                        if (chkReload.checked) {
                            jQuery('#btnClose').next('div').append('<div>Reloading host page</div>');
                            parent.location.reload();
                        }
					}
				});
				return false;
			});
			jQuery('#btnClose').click(function() {
                var chkReload = document.getElementById('<%=chkReloadPage.ClientID%>');
                if (chkReload.checked) {
                    parent.location.reload();
                } else {
                    parent.jQuery.colorbox.close(); 
                    return false;
                }
            });
		});
    </script>
    <h3 class="ui-widget"><%=GetItemName()%></h3>
	<div id="FormEditorTabs" runat="server">
		<ul>
			<li id="TabOne" runat="server"><a id="TabOneLink" href="#TabEditor1" runat="server">Add Form</a></li>
			<li id="TabTwo" runat="server"><a id="TabTwoLink" href="#TabEditor2" runat="server">Edit Form</a></li>
		</ul>
		<div id="TabEditor1">
            <div id="editor-toolbar1"></div>
			<textarea runat="server" id="taCode1"></textarea>
		</div>
		<div id="TabEditor2">
            <div id="editor-toolbar2"></div>
			<textarea runat="server" id="taCode2"></textarea>
		</div>
   </div>
	<div id="divControls">
		<div style="font-size: .7em; font-style: italic;" class="ui-widget">CTRL+F/CMD+F to Search; CTRL+G/CMD+G to Find Next; CTRL+SHIFT+F/CMD+OPTION+F Replace; SHIFT+CTRL+R/SHIFT+CMD+OPTION+F Replace All</div>
		<asp:CheckBox ID="chkReloadPage" runat="server" Checked="true" Text="Reload page after save" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;" visible="true"/><br />
		<button id="btnSave" style="margin-top: 5px;">Save</button> <button id="btnClose" style="margin-top:5px;" onclick="parent.jQuery.fn.colorbox.close();">Close</button> 
		<asp:TextBox ID="txtItemType" runat="server" style="display:none;" />
		<asp:TextBox ID="txtItemName" runat="server" style="display:none;" />
		<asp:TextBox ID="txtPID" runat="server" style="display:none;"  />
		<asp:TextBox ID="txtOrigItem" runat="server" TextMode="MultiLine" Visible="false" />
	</div>
	</asp:panel>
	</form>
</body>
</html>
