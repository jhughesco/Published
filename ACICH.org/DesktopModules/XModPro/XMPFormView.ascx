<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="XMPFormView.ascx.vb" Inherits="KnowBetter.XModPro.XMPFormView" %>
<%@ Register TagPrefix="xmod" Namespace="KnowBetter.XModPro.Web.Controls" Assembly="KnowBetter.XModPro.Web.Controls" %>

<div id="divMessage" runat="server" visible="false" 
    style="border: 1px solid red; background-color:#FFFACD; 
           width:95%; font-family: Verdana,Tahoma,Arial,Helvetica,sans-serif; 
           color:Red; font-size: 10pt; padding:8px; margin-bottom:8px;">&nbsp;</div>
<asp:PlaceHolder ID="phHostOptions" runat="server" />
<asp:PlaceHolder ID="phForm" runat="server" />

