<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.FormBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls.Form" TagPrefix="xmod" %>
<xmod:FormView runat="server"><AddItemTemplate><xmod:AddForm runat="server">

  <ScriptBlock BlockType="HeadScript" RegisterOnce="True" ScriptId="KBXM_Style_Admin_Classified_Location">
    <style type="text/css">
      .xmp-Admin_Classified_Location { padding: 10px 5px 5px 5px; }
      .xmp-Admin_Classified_Location .xmp-form-row { margin: 3px; padding: 3px; clear:left;}
      .xmp-Admin_Classified_Location label.xmp-form-label, .xmp-Admin_Classified_Location span.xmp-form-label{ display:block; float:left; width: 120px;text-align: left; margin-right: 5px; }
      .xmp-Admin_Classified_Location .xmp-button { margin-right: 5px; }
    </style>
  </ScriptBlock>


  <SubmitCommand CommandText="INSERT INTO [XMP_Classified_Location] ([City], [State]) VALUES(@City, @State) " /><div class="xmp-form xmp-Admin_Classified_Location">
    <div class="xmp-form-row"><Label CssClass="xmp-form-label NormalBold" For="City">City</Label><TextBox Id="City" Width="165" MaxLength="25" DataField="City" DataType="string"></TextBox><Validate Target="City" CssClass="NormalRed xmp-validation" Type="required" Text="text" Message="message"></Validate></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label NormalBold" For="State">State</Label><TextBox Id="State" Width="35" MaxLength="5" DataField="State" DataType="string"></TextBox></div><ValidationSummary CssClass="NormalRed xmp-validation" Id="vsXMP_Classified_Location"></ValidationSummary><div class="xmp-form-row"><Label class="xmp-form-label NormalBold">&nbsp;</Label><AddButton Text="Add"></AddButton><CancelButton Text="Cancel" style="margin-left: 12px;" Visible="true"></CancelButton></div>
  </div></xmod:AddForm></AddItemTemplate><EditItemTemplate><xmod:EditForm runat="server">

  <ScriptBlock BlockType="HeadScript" RegisterOnce="True" ScriptId="KBXM_Style_Admin_Classified_Location">
    <style type="text/css">
      .xmp-Admin_Classified_Location { padding: 10px 5px 5px 5px; }
      .xmp-Admin_Classified_Location .xmp-form-row { margin: 3px; padding: 3px; clear:left;}
      .xmp-Admin_Classified_Location label.xmp-form-label, .xmp-Admin_Classified_Location span.xmp-form-label{ display:block; float:left; width: 120px;text-align: left; margin-right: 5px; }
      .xmp-Admin_Classified_Location .xmp-button { margin-right: 5px; }
    </style>
  </ScriptBlock>


  <SelectCommand CommandText="SELECT [City], [State], [LocationID] FROM XMP_Classified_Location WHERE [LocationID]=@LocationID" />  <SubmitCommand CommandText="UPDATE [XMP_Classified_Location] SET [City]=@City, [State]=@State WHERE [LocationID]=@LocationID" /><div class="xmp-form xmp-Admin_Classified_Location">
    <div class="xmp-form-row"><Label CssClass="xmp-form-label NormalBold" For="City">City</Label><TextBox Id="City" Width="165" MaxLength="25" DataField="City" DataType="string"></TextBox><Validate Target="City" CssClass="NormalRed xmp-validation" Type="required" Text="text" Message="message"></Validate></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label NormalBold" For="State">State</Label><TextBox Id="State" Width="35" MaxLength="5" DataField="State" DataType="string"></TextBox></div><ValidationSummary CssClass="NormalRed xmp-validation" Id="vsXMP_Classified_Location"></ValidationSummary><div class="xmp-form-row"><Label class="xmp-form-label NormalBold">&nbsp;</Label><UpdateButton Text="Update"></UpdateButton><CancelButton Text="Cancel" style="margin-left: 12px;" Visible="true"></CancelButton></div>
  </div><TextBox Visible="False" Id="LocationID" DataField="LocationID"></TextBox></xmod:EditForm></EditItemTemplate></xmod:FormView>
