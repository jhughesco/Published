<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:Template runat="server" UsePaging="True" Ajax="False" AddRoles="" EditRoles="" DeleteRoles="">
  <ListDataSource CommandText="SELECT [LevelID], [Level_Name], [Level_Description], [Level_Price] FROM XMP_Classified_Level"/>
  <DeleteCommand CommandText="DELETE FROM XMP_Classified_Level WHERE [LevelID] = @LevelID">
    <Parameter Name="LevelID" />
  </DeleteCommand>
  <HeaderTemplate>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Level ID</th>
          <th>Level_Name</th>
          <th>Level_Description</th>
          <th>Level_Price</th>
          <th width="125">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
  </HeaderTemplate>
  <ItemTemplate>
        <tr>
          <td><%#Eval("Values")("LevelID")%></td>
          <td><%#Eval("Values")("Level_Name")%></td>
          <td><%#Eval("Values")("Level_Description")%></td>
          <td><xmod:Format runat="server" type="Float" Value='<%#Eval("Values")("Level_Price")%>' Pattern="c" /></td>
          <td>
            <xmod:EditLink runat="server" Text="Edit">
              <Parameter Name="LevelID" Value='<%#Eval("Values")("LevelID")%>' />
            </xmod:EditLink>
            <xmod:DeleteLink runat="server" Text="Delete" OnClientClick="return confirm('Are you sure you want to delete this?');">
              <Parameter Name="LevelID" Value='<%#Eval("Values")("LevelID")%>' />
            </xmod:DeleteLink>
            
          </td>
        </tr>
  </ItemTemplate>
  <FooterTemplate>
      </tbody>
    </table>
  </FooterTemplate>
</xmod:Template>
<div>
  <xmod:AddLink runat="server" CssClass="btn btn-primary" Text="New Level" />
</div></xmod:masterview>