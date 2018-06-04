<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:Template runat="server" UsePaging="True" Ajax="False" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators">
  <ListDataSource CommandText="
    SELECT * FROM (

      SELECT 
        CategoryID
        ,Category_Name
        ,ParentID
        ,Date_Created
        ,Date_Updated
        ,Sort_Order
        ,Sort_Order AS First_Level
        ,NULL AS Second_Level
        ,Active

        FROM XMP_Classified_Category
        WHERE ParentID IS NULL

      UNION ALL

      SELECT
         c.CategoryID
        ,' - ' + c.Category_Name AS Category_Name
        ,c.ParentID
        ,c.Date_Created
        ,c.Date_Updated
        ,c.Sort_Order
        ,d.Sort_Order AS First_Level
        ,c.Sort_Order AS Second_Level
        ,c.Active

        FROM XMP_Classified_Category c
        INNER JOIN XMP_Classified_Category d ON c.ParentID = d.CategoryID
        WHERE c.ParentID IS NOT NULL
    ) AS Categories

    ORDER BY Categories.First_Level, Categories.Second_Level">
  </ListDataSource>
  
  <DeleteCommand CommandText="DELETE FROM XMP_Classified_Category WHERE [CategoryID] = @CategoryID">
    <Parameter Name="CategoryID" />
  </DeleteCommand>
  <HeaderTemplate>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Category ID</th>
          <th>Category_Name</th>
          <th>Parent ID</th>
          <th>Date_Created</th>
          <th>Date_Updated</th>
          <th>Sort_Order</th>
          <th>Active</th>
          <th width="125">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
  </HeaderTemplate>
  <ItemTemplate>
        <tr>
          <td><%#Eval("Values")("CategoryID")%></td>
          <td><%#Eval("Values")("Category_Name")%></td>
          <td><%#Eval("Values")("ParentID")%></td>
          <td><%#Eval("Values")("Date_Created")%></td>
          <td><%#Eval("Values")("Date_Updated")%></td>
          <td><%#Eval("Values")("Sort_Order")%></td>
          <td><%#Eval("Values")("Active")%></td>
          <td>
            <xmod:EditLink runat="server" Text="Edit">
              <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' />
            </xmod:EditLink>
            <xmod:DeleteLink runat="server" Text="Delete" OnClientClick="return confirm('Are you sure you want to delete this?');">
              <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' />
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
  <xmod:AddLink runat="server" CssClass="btn btn-primary" Text="New Category" />
  </div></xmod:masterview>