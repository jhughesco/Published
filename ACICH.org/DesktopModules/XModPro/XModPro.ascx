<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="XModPro.ascx.vb" Inherits="KnowBetter.XModPro.XModPro" %>
<%@ Register TagPrefix="xmod" Namespace="KnowBetter.XModPro.Web.Controls" Assembly="KnowBetter.XModPro.Web.Controls" %>

<div id="divConfigHelp" style="margin-left:25px;" runat="server" visible="false">
    <p><strong>What Do I Do Now?</strong></p>
    <ul>
        <li style="list-style:none;margin:5px;">
            <asp:Image ID="imgCheckedForms" runat="server" style="vertical-align:middle;" /> 
            Create a data-entry form using the Control Panel's <asp:LinkButton ID="lnkCPManageForms" runat="server">Manage Forms</asp:LinkButton> Page
        </li>
        <li style="list-style:none;margin:5px;">
            <asp:Image ID="imgCheckedTemplates" runat="server" style="vertical-align:middle;" /> 
            Create a data display view using the Control Panel's <asp:LinkButton ID="lnkCPManageTemplates" runat="server">Manage Templates</asp:LinkButton> Page
        </li>
        <li style="list-style:none;margin:5px;">
            <asp:Image ID="imgCheckedConfigure" runat="server" style="vertical-align:middle;" /> 
           <asp:LinkButton ID="lnkConfigure" runat="server">Configure</asp:LinkButton> this Module to Use your Form and/or Template
        </li>
    </ul>
</div>
<div id="divMessage" runat="server" visible="false" 
    style="border: 1px solid red; background-color:#FFFACD; 
           width:95%; font-family: Verdana,Tahoma,Arial,Helvetica,sans-serif; 
           color:Red; font-size: 10pt; padding:8px; margin-bottom:8px;">&nbsp;</div>
<asp:PlaceHolder ID="phHostOptions" runat="server" />
<asp:PlaceHolder ID="phForm" runat="server" />
<asp:PlaceHolder ID="phXModPro" runat="server" />
