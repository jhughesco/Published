<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:ScriptBlock runat="server" ScriptId="SellerCSS" BlockType="HeadScript" RegisterOnce="True">
  <style type="text/css">
    .pager-active {
      color: #fff !important;
      background-color: #337ab7 !important;
      border-color: #337ab7 !important;
    }  
  </style>
  
  <script type="text/javascript">
    if (typeof jQuery != 'undefined') {

      alert("jQuery library is loaded!");

    }else{

      alert("jQuery library is not found!");

    }
   </script>
</xmod:ScriptBlock>

<xmod:Template runat="server" UsePaging="True" Ajax="False" AddRoles="" EditRoles="" DeleteRoles="">
  <ListDataSource CommandText=""/>
  <DeleteCommand CommandText=""/>
  <HeaderTemplate>
    
  </HeaderTemplate>
  <ItemTemplate>
    
  </ItemTemplate>
  <FooterTemplate>
      
  </FooterTemplate>

  <DetailTemplate>

    <xmod:ReturnLink runat="server" CssClass="dnnSecondaryAction" Text="&lt;&lt; Return" />

  </DetailTemplate>
</xmod:Template>
<div>
  <xmod:AddLink runat="server" Text="New" />
  </div>
</xmod:masterview>