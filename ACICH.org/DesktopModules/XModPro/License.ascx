<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="License.ascx.vb" Inherits="KnowBetter.XModPro.UI.License" %>
<%@ Register TagPrefix="dnn" TagName="Label" Src="~/controls/LabelControl.ascx" %>

<script type="text/javascript">
  var tempLicEmail = '<%=tempLicense.Email%>';
  var tempLicInvoice = '<%=tempLicense.Invoice%>'; 
  
  jQuery(document).ready( function(){
    var $TrialCheckbox = jQuery('#<%=chkTrialLicense.ClientID%>');
    var $AccountTextbox = jQuery('#<%=txtAccount.ClientID%>');
    var $InvoiceTextbox = jQuery('#<%=txtInvoice.ClientID%>');
    
    // ensure invoice text box is visible if this isn't a trial
    if (!$TrialCheckbox.get(0).checked) {$AccountTextbox.show();}
    
    $TrialCheckbox.click(function(){
      if ($TrialCheckbox.get(0).checked) {
        $InvoiceTextbox.val('TRIAL');
        $AccountTextbox.val('').hide();
      } else {
        $InvoiceTextbox.val(tempLicInvoice);
        $AccountTextbox.val(tempLicEmail).show();
      }
    }); 
  });
</script>

<h1><asp:label ID="lblControlTitle" runat="server" resourcekey="ControlTitle" /></h1>
<p class="Normal" style="text-align: justify;"><asp:label ID="lblControlHelp" runat="server" resourcekey="ControlHelp" /></p>

<table width="100%" cellspacing="4" cellpadding="0" border="0">
 <tr>
  <td class="SubHead" width="165" valign="top">
   <dnn:label id="plStatus" runat="server" controlname="chkTrialLicense" suffix=":" />
  </td>
  <td class="Normal">
   <%=(New KnowBetter.XModPro.Licensing.License()).Status.Replace(vbCrLf, "<br />")%>
  </td>
 </tr>
 <tr>
  <td class="SubHead" width="165">
   <dnn:label id="plTrialLicense" runat="server" controlname="chkTrialLicense" suffix=":" />
  </td>
  <td>
   <asp:checkbox id="chkTrialLicense" runat="server" AutoPostBack="false" />
  </td>
 </tr>
</table>
<table width="100%" cellspacing="4" cellpadding="0" border="0" runat="server" id="tblAccount">
 <tr>
  <td class="SubHead" width="165">
   <dnn:label id="plAccount" runat="server" controlname="txtAccount" suffix=":" />
  </td>
  <td>
   <asp:textbox runat="server" id="txtAccount" Width="300" />
  </td>
 </tr>
 <tr>
  <td class="SubHead" width="165">
   <dnn:label id="plInvoice" runat="server" controlname="txtInvoice" suffix=":" />
  </td>
  <td>
   <asp:textbox runat="server" id="txtInvoice" Width="300" />
  </td>
 </tr>
</table>

<div style="padding-left: 171px; margin-top: 5px;">

    <asp:Button ID="cmdRequestActivation" runat="server" resourcekey="btnRequestActivation" Text="Activate (Web Service)" /> 
    <asp:Button ID="cmdRequestActivationManual" runat="server" resourcekey="btnManual" Text="Manual Activation" style="margin-left:5px;" />
</div>

<table width="100%" cellspacing="4" cellpadding="0" border="0"  id="tblDirectEntry" runat="server" visible="false">
 <tr>
  <td class="SubHead" width="165">
   <dnn:label id="plServerId" runat="server" controlname="txtServerId" suffix=":" />
  </td>
  <td>
   <asp:textbox runat="server" id="txtServerId" TextMode="MultiLine" Width="400" Height="250" />
  </td>
 </tr>
 <tr>
  <td>&nbsp;</td>
  <td>
   <a href="http://www.dnndev.com/DesktopModules/Bring2mind/Licenses/CustomerDirectRequest.aspx" Class="CommandButton" Target="_blank"><asp:label ID="lblGoToDNNDev" runat="server" resourcekey="lblGoToDNNDev">Manually activate XMod Pro at DNNDev.com</asp:label></a>
  </td>
 </tr>
 <tr>
  <td class="SubHead" width="165">
   <dnn:label id="plActivationKey" runat="server" controlname="txtActivationKey" suffix=":" />
  </td>
  <td>
   <asp:textbox runat="server" id="txtActivationKey" TextMode="MultiLine" Width="400" Height="150" />
  </td>
 </tr>
 <tr>
  <td>&nbsp;</td>
  <td>
    <asp:Button ID="cmdSubmitActivation" runat="server" Text="Activate" resourcekey="cmdUpload" />
  </td>
 </tr>
</table> 
<div id="divActivationResults" runat="server" visible="false"></div>       



<div style="margin-top: 10px;">
 <asp:button id="cmdUpdate" runat="server" text="Update" resourcekey="cmdUpdate" />&nbsp; 
 <asp:button id="cmdCancel" runat="server" text="Cancel" resourcekey="cmdCancel" />
</div>

