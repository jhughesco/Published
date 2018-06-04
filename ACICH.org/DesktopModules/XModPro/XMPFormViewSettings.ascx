<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="XMPFormViewSettings.ascx.vb" Inherits="KnowBetter.XModPro.XMPFormViewSettings" %>
<%@ Register Assembly="KnowBetter.XModPro" Namespace="KnowBetter.XModPro" TagPrefix="xmp" %>


<style type="text/css">
    #kbxmTabs ul li {list-style: none;} /*override any stylesheet settings coming from DNN
</style>

<div id="kbxmTabs">
	<ul>
		<li><a href="#kbxmTabSettings"><%=Localize("Settings")%></a></li>
		<li><a href="#kbxmTabAbout"><%=Localize("About")%></a></li>
	</ul>
	<div id="kbxmTabSettings">
        
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
        
        <div id="divXMPFormMode" style="padding:5px;margin-bottom:5px;width:400px;">
        <asp:Label ID="lblFormMode" runat="server" Text="Form Mode" Font-Bold="true" resourcekey="FormMode.Text" /><br />
        <asp:Label ID="lblFormModeDesc" runat="server" 
            Text="Each form can contain a distinct definition when adding and when editing a record. Select which definition this module should display" 
            resourcekey="FormModeDesc.Text" /> 
            <asp:RadioButtonList ID="rblFormMode" cssclass="Normal" runat="server" >
                <asp:ListItem Text="Add" Value="add" Selected="True" />
                <asp:ListItem Text="Edit" Value="edit" />
            </asp:RadioButtonList>
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
        <div id="divXMPHostOptionsPanel" style="padding:5px;margin-bottom:5px;width:400px" runat="server">
            <asp:CheckBox ID="chkEnableHostOptionsPanel" runat="server" Text="Enable Host Options Panel" resourcekey="EnableHostOptionsPanel.Text" Checked="false" /><br />
            <asp:Label ID="lbljQueryPath" runat="server" Text="The Host Options Panel requires jQuery 1.3.2 to be registered in the page in order to function 
             If jQuery 1.3.2 or later is not included in the page by default, specify the URL to the jQuery file here. Otherwise, leave this field blank." resourcekey="jQueryPathLabel" /><br />
            <asp:TextBox ID="txtjQueryPath" runat="server" Width="300" />
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
    jQuery(document).ready( function() {
        jQuery('#kbxmTabs').tabs();
        var $form = $('#<%=ddlForms.ClientID%>');
        var $formg = $('#<%=ddlGlobalForms.ClientID%>');

        $form.change(function () {
            if ($(this).val()) { $formg.val(''); }
        });
        $formg.change(function () {
            if ($(this).val()) { $form.val(''); }
        });

        jQuery('#<%=lstCustomSettings.ClientID%>')
            .adminList(
                { textEntryLabel: 'Setting Name',
                    valueEntryLabel: 'Setting Value',
                    showUpDownButtons: false,
                    listChanged: listChanged
                });
    });
    function listChanged() {
        var sOut = '';
        this.children("option").each(function(i) {
            sOut += '[' + jQuery(this).text() + '|' + jQuery(this).val() + ']';
        });
        jQuery('#<%=hidUDS.ClientID%>').val(sOut);
    }
</script>
