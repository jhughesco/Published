<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="XMPSettings.ascx.vb" Inherits="KnowBetter.XModPro.XMPSettings" %>
<%@ Register Assembly="KnowBetter.XModPro" Namespace="KnowBetter.XModPro" TagPrefix="xmp" %>
<style type="text/css">
	#kbxmTabs ul li {list-style: none;} /*override any stylesheet settings coming from DNN
</style>

<div id="kbxmTabs">
	<ul>
		<li><a href="#kbxmTabSettings"><%=Localize("Settings")%></a></li>
		<li><a href="#kbxmDnnSearch"><%= Localize("DnnSearch")%></a></li>
		<li><a href="#kbxmTabSecurity"><%=Localize("Security")%></a></li>
		<li><a href="#kbxmTabAbout"><%=Localize("About")%></a></li>
	</ul>
	<div id="kbxmTabSettings">
		<asp:Label ID="lblTemplate" runat="server" Text="Template" Font-Bold="true" resourcekey="Template.Text" /> 
		<div id="divXMPMasterTemplate" style="padding:5px;margin-bottom:5px;">
			<div style="overflow: hidden;">
				<label style="display:block;float:left;width:140px;">Portal Templates:</label> 
				<asp:DropDownList ID="ddlTemplates" runat="server" Style="float:left;" DataTextField="TemplateName" DataValueField="FileFullName" />           
			</div>
			<div style="overflow: hidden;margin-top: 5px;">
				<label style="display:block;float:left;width:140px;">Global Templates:</label> 
				<asp:DropDownList ID="ddlGlobalTemplates" runat="server" Style="float:left;" DataTextField="TemplateName" DataValueField="FileFullName" />           
			</div>
		</div>
		
		<asp:Label ID="lblFormName" runat="server" Text="Form" Font-Bold="true" resourcekey="Form.Text" /> 
		<div id="divXMPForm" style="padding:5px;margin-bottom:5px;">
			<div style="overflow:hidden;">
				<label style="display: block; float:left; width: 140px;">Portal Forms:</label>
				<asp:DropDownList ID="ddlForms" runat="server" Style="float:left;" DataTextField="FormName" DataValueField="FileFullName" />
			</div>
			<div style="overflow:hidden;margin-top:5px;">
				<label style="display: block; float:left; width: 140px;">Global Forms:</label>
				<asp:DropDownList ID="ddlGlobalForms" runat="server" Style="float:left;" DataTextField="FormName" DataValueField="FileFullName" />
			</div>
		</div>
		
		<asp:Label ID="lblCustomSettings" runat="server" Text="Custom Settings" Font-Bold="true" resourcekey="CustomSettings.Text" /> 
		<div id="divXMPCustomSettings" style="padding:5px;margin-bottom:5px; width: 400px;" runat="server">
			<asp:Label ID="lblCustomSettingsHelp" runat="server" resourcekey="CustomSettingsHelp.Text">
				Custom settings enable you to specify one or more values for each module instance that can 
				be used in your templates and forms via the Module token: [[Module:settingName]]
			</asp:Label><br /><br />
			<xmp:CustomSettingsList id="lstCustomSettings" runat="server" Rows="5" Width="200"></xmp:CustomSettingsList>
			<br />
		</div>

		<asp:Label ID="lblEnableHostOptionsPanel" runat="server" Text="Host Options Panel" Font-Bold="true" resourcekey="EnableHostOptionsPanel.Text" /> 
		<div id="divXMPHostOptionsPanel" style="padding:5px;margin-bottom:5px;width:400px;" runat="server">
			<asp:CheckBox ID="chkEnableHostOptionsPanel" runat="server" Text="Enable Host Options Panel" resourcekey="EnableHostOptionsPanel.Text" Checked="false" /><br />
			<asp:Label ID="lbljQueryPath" runat="server" Text="The Host Options Panel requires jQuery 1.3.2 to be registered in the page in order to function 
			 If jQuery 1.3.2 or later is not included in the page by default, specify the URL to the jQuery file here. Otherwise, leave this field blank." resourcekey="jQueryPathLabel" /><br />
			<asp:TextBox ID="txtjQueryPath" runat="server" Width="300" />
		</div>
	</div>
	<div id="kbxmDnnSearch">
		<asp:Label ID="lblDnnSearchDescription" runat="server" resourcekey="DnnSearchDescription.Text"></asp:Label>
		<div id="divSearchOptions" style="margin:4px 0px 10px 12px;padding:4px;">
			<asp:Label ID="lblSearchDataCommand" runat="server" Text="Data Command:" resourcekey="DataCommand.Text" CssClass="NormalBold xmp-ctrllabel" />
			<a href="#" class="ui-icon ui-icon-help">Help</a><br />
			<asp:Label ID="lblSearchDataCommandDescription" runat="server" resourcekey="SearchDataCommandInfo.Text" CssClass="xmp-moreinfo"></asp:Label>
			<asp:TextBox TextMode="MultiLine" ID="txtSearchDataCommand" runat="server" Width="600" Height="150" />
		</div>
		<div id="divXMPSearchTitle" style="margin:4px 0px 10px 12px; padding: 4px;">
			<asp:Label ID="lblSearchTitle" runat="server" CssClass="NormalBold xmp-ctrllabel">Title:</asp:Label> 
			<a href="#" class="ui-icon ui-icon-help">Help</a><br />
			<asp:label runat="server" resourcekey="SearchTitleInfo.Text" CssClass="xmp-moreinfo">Uniquely identifies this record. Usually a record ID or unique string.</asp:label>
			<asp:TextBox ID="txtSearchTitle" runat="server" Width="350" />
		</div>
		<div id="divXMPSearchDescription" style="margin:4px 0px 10px 12px; padding: 4px;">
			<asp:Label ID="lblSearchDescription" runat="server" CssClass="NormalBold xmp-ctrllabel">Description:</asp:Label> 
			<a href="#" class="ui-icon ui-icon-help">Help</a><br />
			<asp:label runat="server" resourcekey="SearchDescriptionInfo.Text" CssClass="xmp-moreinfo">The description of the record</asp:label> 
			<asp:TextBox ID="txtSearchDescription" runat="server" Width="350" />
		</div>
		<div id="divXMPSearchAuthorId" style="margin:4px 0px 10px 12px; padding: 4px;">
			<asp:Label ID="lblSearchAuthorId" runat="server" CssClass="NormalBold xmp-ctrllabel">Author ID:</asp:Label> 
			<a href="#" class="ui-icon ui-icon-help">Help</a><br />
			<asp:Label runat="server" resourcekey="SearchAuthorIdInfo.Text" CssClass="xmp-moreinfo">User ID of record author (optional)</asp:label>
			<asp:TextBox ID="txtSearchAuthorId" runat="server" />
		</div>
		<div id="divXMPSearchContent" style="margin:4px 0px 10px 12px; padding: 4px;">
			<asp:Label ID="lblSearchContent" runat="server" CssClass="NormalBold xmp-ctrllabel">Content:</asp:Label>
			<a href="#" class="ui-icon ui-icon-help">Help</a><br />
			<asp:label runat="server" resourcekey="SearchContentInfo.Text" CssClass="xmp-moreinfo">The content to be indexed (required)</asp:label> 
			<asp:TextBox ID="txtSearchContent" runat="server" Width="350" />
		</div>
		<div id="divXMPSearchGuid" style="margin:4px 0px 10px 12px; padding: 4px;">
			<asp:Label ID="lblSearchGuid" runat="server" CssClass="NormalBold xmp-ctrllabel">GUID:</asp:Label> 
			<a href="#" class="ui-icon ui-icon-help">Help</a><br />
			<asp:label runat="server" resourcekey="SearchGuidInfo.Text" CssClass="xmp-moreinfo">Additional parameters to be added to the record's URL</asp:label>
			<asp:TextBox ID="txtSearchGuid" runat="server" Width="350" />
		</div>
		<div id="divXMPSearchPubDate" style="margin:4px 0px 10px 12px; padding: 4px;">
			<asp:Label ID="lblSearchPubDate" runat="server" CssClass="NormalBold xmp-ctrllabel">Last Modified Date:</asp:Label>
			<a href="#" class="ui-icon ui-icon-help">Help</a><br />
			<asp:label runat="server" resourcekey="SearchPubDateInfo.Text" CssClass="xmp-moreinfo">Used to determine if record should be re-indexed (required)</asp:label>
			<asp:TextBox ID="txtSearchPubDate" runat="server" />
		</div>
		<div id="divXMPSearchKey" style="margin:4px 0px 10px 12px; padding: 4px;">
			<asp:Label ID="lblSearchKey" runat="server" CssClass="NormalBold xmp-ctrllabel">Search Key:</asp:Label> 
			<a href="#" class="ui-icon ui-icon-help">Help</a><br />
			<asp:label runat="server" resourcekey="SearchKeyInfo.Text" CssClass="xmp-moreinfo">Uniquely identifies this record. Usually a record ID or unique string.</asp:label>
			<asp:TextBox ID="txtSearchKey" runat="server" />
		</div>
	</div>
	<div id="kbxmTabSecurity">
		<asp:Label ID="lblSecurityDescription" resourcekey="SecurityDescription.Text" runat="server"/>
		<div id="divXMPAddRoles" style="margin:4px 0px 10px 12px;padding:4px;">
			<asp:Label ID="lblAddRoles" runat="server" Font-Bold="true" Text="Roles That Can Add Records" resourcekey="AddRolesLabel.Text" />
			<br />
			<asp:ListBox ID="lstAddRoles" runat="server" SelectionMode="Multiple">
			</asp:ListBox>
		</div>
	</div>
	<div id="kbxmTabAbout">
		<div id="divXMPAbout" style="margin:4px 0px 10px 12px;padding:4px;">
			<asp:Label ID="lblXMPVersion" runat="server" Font-Bold="true" Text="XMod Pro Version:" resourcekey="XMPVersion.Text" />
			<br />
			<asp:Label ID="lblXMPVersionValue" runat="server" />
		</div>
	</div>
</div>

<asp:ValidationSummary ID="vsErrors" runat="server" CssClass="NormalRed" />


<asp:Button ID="btnClose" runat="server" Text="Save Changes" CssClass="dnnPrimaryAction" resourcekey="Close.Text" />

<asp:Button ID="btnCancel" runat="server" Text="Cancel" CssClass="dnnSecondaryAction" style="margin-left: 20px;" resourcekey="Cancel.Text" />

<asp:HiddenField ID="hidUDS" runat="server" />

<script type="text/javascript">
(function ($) {
    $(document).ready(function () {
        $('#kbxmTabs').tabs();
        var $temp = $('#<%=ddlTemplates.ClientID%>');
        var $tempg = $('#<%=ddlGlobalTemplates.ClientID%>');
        var $form = $('#<%=ddlForms.ClientID%>');
        var $formg = $('#<%=ddlGlobalForms.ClientID%>');

        $temp.change(function () {
            if ($(this).val()) { $tempg.val(''); }
        });
        $tempg.change(function () {
            if ($(this).val()) { $temp.val(''); }
        });
        $form.change(function () {
            if ($(this).val()) { $formg.val(''); }
        });
        $formg.change(function () {
            if ($(this).val()) { $form.val(''); }
        });

        $('#<%=lstCustomSettings.ClientID%>')
			.adminList(
				{ textEntryLabel: 'Setting Name',
				    valueEntryLabel: 'Setting Value',
				    showUpDownButtons: false,
				    listChanged: listChanged
				});
        $('.xmp-moreinfo').hide();
        $('.xmp-ctrllabel').css({ 'float': 'left' });
        var $hlp = jQuery('#kbxmDnnSearch a.ui-icon-help');
        $hlp.each(function () {
            $(this).nextAll("span:first").css({ 'padding': '5px', 'font-size': '.85em' });
        });
        $hlp.css({ 'position': 'absolute', 'left': '5px', 'border': '1px solid #CCC' }).addClass('ui-corner-all').click(function () {
            var $span = jQuery(this).nextAll('span:first');
            if ($span.css('display') == 'block') {
                $span.css({ 'display': 'none' });
            } else { $span.css({ 'display': 'block' }); }
            return false;
        });
        $hlp.next('br').css({ 'clear': 'left' });
    });
    function listChanged() {
        var sOut = '';
        this.children("option").each(function (i) {
            sOut += '[' + $(this).text() + '|' + $(this).val() + ']';
        });
        $('#<%=hidUDS.ClientID%>').val(sOut);
    }
})(jQuery);
</script>
