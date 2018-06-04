<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:Template runat="server" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators">
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
  
  <CustomCommands>
    <DataCommand CommandName="DeleteCategory" CommandText="DELETE FROM XMP_Classified_Category WHERE [CategoryID] = @CategoryID">
    	<Parameter Name="CategoryID" />
    </DataCommand>
    <DataCommand CommandName="DeactivateCategory" CommandText="UPDATE XMP_Classified_Category SET [Active]=0, [Date_Updated]=getdate() WHERE [CategoryID] = @CategoryID">
    	<Parameter Name="CategoryID" />
    </DataCommand>
    <DataCommand CommandName="ActivateCategory" CommandText="UPDATE XMP_Classified_Category SET [Active]=1, [Date_Updated]=getdate() WHERE [CategoryID] = @CategoryID">
    	<Parameter Name="CategoryID" />
    </DataCommand>
  </CustomCommands>
  
  <HeaderTemplate>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Category ID</th>
          <th>Category Name</th>
          <th>Parent ID</th>
          <th>Date Created</th>
          <th>Date Updated</th>
          <th>Sort Order</th>
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
          	<div class="btn-group" role="group">
              <xmod:EditButton runat="server" CssClass="btn btn-xs btn-default" Text="Edit">
              	<Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' />
            	</xmod:EditButton>   
    					<div class="btn-group" role="group">
                <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">More<span class="caret"></span></button>
                <ul class="dropdown-menu" role="menu">
                  <xmod:Select runat="server" Mode="Standard">
                  	<Case Comparetype="Role" Operator="=" Expression="Administrators">
                    	<xmod:Select runat="server" Mode="Inclusive">
                      	<Case Comparetype="Boolean" Value='<%#Eval("Values")("Active")%>' Operator="=" Expression="True">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Deactivate" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="DeactivateCategory" Type="Custom">
                                <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("Active")%>' Operator="=" Expression="False">
                        	<li>
                            <xmod:CommandLink runat="server" Text="Activate" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="ActivateCategory" Type="Custom">
                                <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>
                        </Case>
                      </xmod:Select>
                      
                      <li>
                        <xmod:CommandLink runat="server" Text="Delete" OnClientClick="return confirm('Are you sure?');">
                          <Command Name="DeleteCategory" Type="Custom">
                            <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                    </Case>
                    <Else>
                    	<li>
                      	<a>Permission Denied</a>
                      </li>
                    </Else>
                  </xmod:Select> 
                </ul>
              </div>
						</div>
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