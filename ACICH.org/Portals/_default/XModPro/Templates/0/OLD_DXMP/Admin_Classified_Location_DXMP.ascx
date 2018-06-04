<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:Template runat="server" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators">
  <ListDataSource CommandText="SELECT [LocationID], [City], [State] FROM XMP_Classified_Location"/>
  <DeleteCommand CommandText="DELETE FROM XMP_Classified_Location WHERE [LocationID] = @LocationID">
    <Parameter Name="LocationID" />
  </DeleteCommand>
  
  <HeaderTemplate>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Location ID</th>
          <th>City</th>
          <th>State</th>
          <th width="125">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
  </HeaderTemplate>
  <ItemTemplate>
        <tr>
          <td><%#Eval("Values")("LocationID")%></td>
          <td><%#Eval("Values")("City")%></td>
          <td><%#Eval("Values")("State")%></td>
          <td>
            <xmod:EditLink runat="server" Text="Edit">
              <Parameter Name="LocationID" Value='<%#Eval("Values")("LocationID")%>' />
            </xmod:EditLink>
            <xmod:DeleteLink runat="server" Text="Delete" OnClientClick="return confirm('Are you sure you want to delete this?');">
              <Parameter Name="LocationID" Value='<%#Eval("Values")("LocationID")%>' />
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
  <xmod:AddLink runat="server" CssClass="btn btn-primary" Text="New Location" />
</div></xmod:masterview>