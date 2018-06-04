<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:template runat="server" usepaging="True" ajax="True" addroles="Adminstrators" editroles="Adminstrators" deleteroles="Adminstrators">
    <ListDataSource CommandText="SELECT *
                                 FROM (
                                   SELECT CategoryID
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

                                   SELECT c.CategoryID
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
                                 ORDER BY Categories.First_Level,Categories.Second_Level">
    </ListDataSource>

    <CustomCommands>
      <DataCommand CommandName="Active" CommandText="IF 0 = (SELECT [Active] FROM XMP_Classified_Category WHERE [CategoryID] = @CategoryID)
                                                                UPDATE XMP_Classified_Category SET [Active]=1,[Date_Updated]=getdate() WHERE [CategoryID] = @CategoryID
                                                               ELSE
                                                                UPDATE XMP_Classified_Category SET [Active]=0,[Date_Updated]=getdate() WHERE [CategoryID] = @CategoryID">
        <Parameter Name="CategoryID" />
      </DataCommand>
			<DataCommand CommandName="DeleteCat" CommandText="DELETE FROM XMP_Classified_Category WHERE [CategoryID] = @CategoryID">
      	<Parameter Name="CategoryID" />
      </DataCommand>
  	</CustomCommands>	

    <HeaderTemplate>
      <table class="table table-bordered table-hover">
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
            <div class="btn-group" role="group">
              <xmod:EditLink runat="server" Text="Edit" CssClass="btn btn-xs btn-success">
                <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' />
              </xmod:EditLink>
            </div>
            <xmod:Select runat="server" Mode="Standard">
              <Case CompareType="Role" Operator="=" Expression="Administrators">
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-default btn-xs">More</button>
                  <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="caret"></span>
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu" role="group">
                    <xmod:Select runat="server" Mode="Standard">
                      <Case CompareType="Boolean" Value='<%#Eval("Values")("Active")%>' Operator="=" Expression="False">
                      	<li>
                          <xmod:CommandLink runat="server" Text="Toggle Active" CssClass="btn btn-xs btn-success">
                            <Command Name="Active" Type="Custom">
                              <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                            </Command>
                          </xmod:CommandLink>
                        </li>
                      </Case>
                      <Else>
                        <li>
                          <xmod:CommandLink runat="server" Text="Toggle InActive" CssClass="btn btn-xs btn-warning">
                            <Command Name="Active" Type="Custom">
                              <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                            </Command>
                          </xmod:CommandLink>
                        </li>
											</Else>
                    </xmod:Select>
                    <li>
                      <xmod:CommandLink runat="server" Text="Delete Category" CssClass="btn btn-xs btn-danger" OnClientClick="return confirm('Are you sure?');">
                        <Command Name="DeleteCat" Type="Custom">
                          <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                        </Command>
                      </xmod:CommandLink>
                    </li>
                  </ul>
              	</div>
              </Case>
              <Else>
              </Else>
            </xmod:Select>
          </td>
        </tr>
      </ItemTemplate>
      <AlternatingItemTemplate>
      	<tr style="background-color:#e8e8e8;">
          <td><%#Eval("Values")("CategoryID")%></td>
          <td><%#Eval("Values")("Category_Name")%></td>
          <td><%#Eval("Values")("ParentID")%></td>
          <td><%#Eval("Values")("Date_Created")%></td>
          <td><%#Eval("Values")("Date_Updated")%></td>
          <td><%#Eval("Values")("Sort_Order")%></td>
          <td><%#Eval("Values")("Active")%></td>
          <td>
            <div class="btn-group" role="group">
              <xmod:EditLink runat="server" Text="Edit" CssClass="btn btn-xs btn-success">
                <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' />
              </xmod:EditLink>
            </div>
            <xmod:Select runat="server" Mode="Standard">
              <Case CompareType="Role" Operator="=" Expression="Administrators">
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-default btn-xs">More</button>
                  <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="caret"></span>
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu" role="group">
                    <xmod:Select runat="server" Mode="Standard">
                      <Case CompareType="Boolean" Value='<%#Eval("Values")("Active")%>' Operator="=" Expression="False">
                      	<li>
                          <xmod:CommandLink runat="server" Text="Toggle Active" CssClass="btn btn-xs btn-success">
                            <Command Name="Active" Type="Custom">
                              <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                            </Command>
                          </xmod:CommandLink>
                        </li>
                      </Case>
                      <Else>
                        <li>
                          <xmod:CommandLink runat="server" Text="Toggle InActive" CssClass="btn btn-xs btn-warning">
                            <Command Name="Active" Type="Custom">
                              <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                            </Command>
                          </xmod:CommandLink>
                        </li>
											</Else>
                    </xmod:Select>
                    <li>
                      <xmod:CommandLink runat="server" Text="Delete Category" CssClass="btn btn-xs btn-danger" OnClientClick="return confirm('Are you sure?');">
                        <Command Name="DeleteCat" Type="Custom">
                          <Parameter Name="CategoryID" Value='<%#Eval("Values")("CategoryID")%>' DataType="Int32" />
                        </Command>
                      </xmod:CommandLink>
                    </li>
                  </ul>
              	</div>
              </Case>
              <Else>
              </Else>
            </xmod:Select>
          </td>
        </tr>
      </AlternatingItemTemplate>
      <FooterTemplate>
        </tbody>
      </table>
    </FooterTemplate>
</xmod:template>
<div>
    <xmod:addlink runat="server" cssclass="btn btn-primary" text="New Category" />
</div></xmod:masterview>