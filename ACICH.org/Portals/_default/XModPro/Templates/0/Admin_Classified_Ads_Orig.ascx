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
    .nowrap {
     	white-space:nowrap;
    }
    .unradius {
    	border-radius: 0px; 
    }
  </style>
</xmod:ScriptBlock>


<xmod:Template runat="server" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators" DetailRoles="Administrators">
  
  <ListDataSource CommandText="SELECT * FROM vw_XMP_Classified_Ad" />
  
  <DetailDataSource CommandText="SELECT [AdID], [SellerID], [LocationID], [Ad_Title], [Ad_Subtitle], [Ad_Price], [PrimaryImage], [Ad_Summary], [Ad_Description], [Date_Created], [CreatedBy], [Created_IP], [Date_Updated], [UpdatedBy], [Updated_IP], [IsSold], [DateSold], [Ad_Expires], [Approved], [Active], [ShowAddress], [ShowPhone], [ShowEmail] FROM XMP_Classified_Ad WHERE [AdID] = @AdID">
    <Parameter Name="AdID" />
  </DetailDataSource>
  
  <DeleteCommand CommandText="DELETE FROM XMP_Classified_Ad WHERE [AdID] = @AdID">
    <Parameter Name="AdID" />
  </DeleteCommand>
  
  <HeaderTemplate>
    <table>
      <thead>
        <tr>
          <th>Ad ID</th>
          <th>Seller ID</th>
          <th>Location ID</th>
          <th>Ad_Title</th>
          <th>Ad_Subtitle</th>
          <th>Ad_Price</th>
          <th>Primary Image</th>
          <th>Ad_Summary</th>
          <th>Ad_Description</th>
          <th>Date_Created</th>
          <th>Created By</th>
          <th>Created_IP</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
  </HeaderTemplate>
  <ItemTemplate>
        <tr>
          <td><%#Eval("Values")("AdID")%></td>
          <td><%#Eval("Values")("SellerID")%></td>
          <td><%#Eval("Values")("LocationID")%></td>
          <td><%#Eval("Values")("Ad_Title")%></td>
          <td><%#Eval("Values")("Ad_Subtitle")%></td>
          <td><%#Eval("Values")("Ad_Price")%></td>
          <td><%#Eval("Values")("PrimaryImage")%></td>
          <td><%#Eval("Values")("Ad_Summary")%></td>
          <td><%#Eval("Values")("Ad_Description")%></td>
          <td><%#Eval("Values")("Date_Created")%></td>
          <td><%#Eval("Values")("CreatedBy")%></td>
          <td><%#Eval("Values")("Created_IP")%></td>
          <td>
            <xmod:EditLink runat="server" Text="Edit">
              <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
            </xmod:EditLink>
            <xmod:DeleteLink runat="server" Text="Delete" OnClientClick="return confirm('Are you sure you want to delete this?');">
              <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
            </xmod:DeleteLink>
            <xmod:DetailLink runat="server" Text="Details">
              <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
            </xmod:DetailLink>
          </td>
        </tr>
  </ItemTemplate>
  <FooterTemplate>
      </tbody>
    </table>
  </FooterTemplate>

  <DetailTemplate>

    <strong>AdID</strong> <%#Eval("Values")("AdID")%><br />
    <strong>SellerID</strong> <%#Eval("Values")("SellerID")%><br />
    <strong>LocationID</strong> <%#Eval("Values")("LocationID")%><br />
    <strong>Ad_Title</strong> <%#Eval("Values")("Ad_Title")%><br />
    <strong>Ad_Subtitle</strong> <%#Eval("Values")("Ad_Subtitle")%><br />
    <strong>Ad_Price</strong> <%#Eval("Values")("Ad_Price")%><br />
    <strong>PrimaryImage</strong> <%#Eval("Values")("PrimaryImage")%><br />
    <strong>Ad_Summary</strong> <%#Eval("Values")("Ad_Summary")%><br />
    <strong>Ad_Description</strong> <%#Eval("Values")("Ad_Description")%><br />
    <strong>Date_Created</strong> <%#Eval("Values")("Date_Created")%><br />
    <strong>CreatedBy</strong> <%#Eval("Values")("CreatedBy")%><br />
    <strong>Created_IP</strong> <%#Eval("Values")("Created_IP")%><br />
    <xmod:ReturnLink runat="server" CssClass="dnnSecondaryAction" Text="&lt;&lt; Return" />

  </DetailTemplate>
</xmod:Template>

<xmod:AddLink runat="server" CssClass="btn btn-primary" Text="New Ad" /></xmod:masterview>