<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<div class="instructions">
  <div style="text-align: center;">
    <img src="/DesktopModules/XModPro/Plugins/Reflect.Xile.Control/docs/img/header.png" style="max-width: 100%;" />
  </div>
  
  <h1>
    Create A Product
  </h1>
  
</div>


<xmod:Template runat="server" UsePaging="True" Ajax="False" AddRoles="" EditRoles="" DeleteRoles="" DetailRoles="">
  <ListDataSource CommandText="SELECT [ProductID], [Name], [PrimaryImage], [AdditionalImages] FROM RMG_Temp_FileUpload"/>
  <DeleteCommand CommandText="DELETE FROM RMG_Temp_FileUpload WHERE [ProductID] = @ProductID">
    <Parameter Name="ProductID" />
  </DeleteCommand>
  <HeaderTemplate>
    
    
    
    <table>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Name</th>
          <th>Primary Image</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
  </HeaderTemplate>
  <ItemTemplate>
        <tr>
          <td><%#Eval("Values")("ProductID")%></td>
          <td><%#Eval("Values")("Name")%></td>
          <td><img src="/Portals/<%#PortalData("ID")%>/RMG_FileUploadTest/<%#UserData("ID")%>/thm_<%#Eval("Values")("PrimaryImage")%>" /></td>
          <td>
            <xmod:EditLink runat="server" Text="Edit">
              <Parameter Name="ProductID" Value='<%#Eval("Values")("ProductID")%>' />
            </xmod:EditLink>
            <xmod:DeleteLink runat="server" Text="Delete">
              <Parameter Name="ProductID" Value='<%#Eval("Values")("ProductID")%>' />
            </xmod:DeleteLink>
          </td>
        </tr>
  </ItemTemplate>
  <FooterTemplate>
      </tbody>
    </table>
  </FooterTemplate>
</xmod:Template>
<div style="margin-bottom: 20px;">
  <xmod:AddLink runat="server" CssClass="dnnPrimaryAction btnPrimary primaryButton" Text="Create New Product" />
</div></xmod:masterview>