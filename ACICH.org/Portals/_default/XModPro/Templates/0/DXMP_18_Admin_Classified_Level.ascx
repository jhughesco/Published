<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:Template runat="server" ID="LevelTemplate" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators">
  <ListDataSource CommandText="SELECT 
 	 			 [LevelID]
        ,[Level_Name]
        ,[Level_Description]
        ,[Level_Price] 
        ,(SELECT COUNT(*) FROM XMP_Classified_Seller WHERE Seller_Level = a.LevelID) AS SellersCount
        
        FROM XMP_Classified_Level a"/>
  
  <CustomCommands>
    <DataCommand CommandName="DeleteLevel" CommandText="DELETE FROM XMP_Classified_Level WHERE [LevelID] = @LevelID">
    	<Parameter Name="LevelID" />
    </DataCommand>
  </CustomCommands>
  
  
  <HeaderTemplate>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Level ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Sellers</th>
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
          <td><%#Eval("Values")("SellersCount")%></td>
          <td>
          	<div class="btn-group" role="group">
              <xmod:EditButton runat="server" CssClass="btn btn-xs btn-default" Text="Edit">
                <Parameter Name="LevelID" Value='<%#Eval("Values")("LevelID")%>' />
              </xmod:EditButton>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">More<span class="caret"></span></button>
                <ul class="dropdown-menu" role="menu">
                  <xmod:Select runat="server" Mode="Standard">
                  	<Case Comparetype="Role" Operator="=" Expression="Administrators">
                  		<li>
                        <xmod:CommandLink runat="server" Text="Delete" OnClientClick="return confirm('Are you sure?');">
                          <Command Name="DeleteLevel" Type="Custom">
                            <Parameter Name="LevelID" Value='<%#Eval("Values")("LevelID")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                      <xmod:Select runat="server" Mode="Standard">
                      	<Case Comparetype="Numeric" Value='<%#Eval("Values")("SellersCount")%>' Operator=">" Expression="0">
                        	<li>
                            <xmod:CommandLink runat="server" Text='<%#Join("Show Sellers - {0}", Eval("Values")("SellersCount"))%>'>
                              <Command Target="SellerTemplate" Type="List">
                                <Parameter Name="LevelID" Value='<%#Eval("Values")("LevelID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>
                        </Case>
                      </xmod:Select>                         
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
  <xmod:AddLink runat="server" CssClass="btn btn-primary" Text="New Level" />
</div><br/><br/>

<xmod:Template runat="server" ID="SellerTemplate" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators" DetailRoles="Administrators">
  <ListDataSource CommandText="SELECT a.[SellerID]
          ,a.[UserID]
          ,u.[Username]
          ,a.[Date_Created]
          ,a.[Date_Updated]
          ,a.[UpdatedBy]
          ,uu.Username AS UpdatedByUsername
          ,a.[Seller_Name]
          ,a.[Seller_Location]
          ,c.City + ', ' + c.[State] AS CityState
          ,a.[Seller_Level]
          ,b.Level_Name
          ,a.[Banned]
          ,a.[IsDeleted] AS SellerDeleted
          ,up.IsDeleted AS UserDeleted
          ,up.Authorised AS UserAuthorized

      FROM XMP_Classified_Seller a
      INNER JOIN XMP_Classified_Level b ON a.Seller_Level = b.LevelID
      LEFT JOIN XMP_Classified_Location c ON a.Seller_Location = c.LocationID
      LEFT JOIN Users u ON a.UserID = u.UserID
      LEFT JOIN Users uu ON a.UpdatedBy = uu.UserID
      LEFT JOIN UserPortals up ON a.UserID = up.UserID
      WHERE Seller_Level = @LevelID">
  		
    	<Parameter Name="LevelID" Value="-1" DataType="int32" />
    
  </ListDataSource>
  
  <DetailDataSource CommandText="SELECT a.[SellerID]
          ,a.[UserID]
          ,u.[Username]
          ,a.[Date_Created]
          ,a.[Date_Updated]
          ,a.[UpdatedBy]
          ,uu.Username AS UpdatedByUsername
          ,a.[Seller_Name]
          ,a.[Seller_Address]
          ,a.[Seller_Location]
          ,c.City + ', ' + c.[State] AS CityState
          ,a.[Seller_Phone]
          ,a.[Seller_Email]
          ,a.[Show_Address_By_Default]
          ,a.[Show_Phone_By_Default]
          ,a.[Seller_Image]
          ,a.[Seller_Level]
          ,b.[Level_Name]
          ,a.[Approved_Ads]
          ,a.[Agree]
          ,a.[Banned]
          ,a.[IsDeleted] AS SellerDeleted
          ,up.IsDeleted AS UserDeleted
          ,up.Authorised AS UserAuthorized

      FROM XMP_Classified_Seller a
      INNER JOIN XMP_Classified_Level b ON a.Seller_Level = b.LevelID
      LEFT JOIN XMP_Classified_Location c ON a.Seller_Location = c.LocationID
      LEFT JOIN Users u ON a.UserID = u.UserID
      LEFT JOIN Users uu ON a.UpdatedBy = uu.UserID
      LEFT JOIN UserPortals up ON a.UserID = up.UserID
      WHERE a.[SellerID] = @SellerID">
    <Parameter Name="SellerID" />
  </DetailDataSource>
  
  <CustomCommands>
    <DataCommand CommandName="SoftDeleteSeller" CommandText="UPDATE XMP_Classified_Seller SET [IsDeleted]=1, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [SellerID] = @SellerID">
    	<Parameter Name="SellerID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="UndeleteSeller" CommandText="UPDATE XMP_Classified_Seller SET [IsDeleted]=0, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [SellerID] = @SellerID">
    	<Parameter Name="SellerID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="HardDeleteSeller" CommandText="DELETE FROM XMP_Classified_Seller WHERE [SellerID] = @SellerID">
    	<Parameter Name="SellerID" /> 
    </DataCommand>
    <DataCommand CommandName="BanSeller" CommandText="UPDATE XMP_Classified_Seller SET [Banned]=1, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [SellerID] = @SellerID">
    	<Parameter Name="SellerID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="UnbanSeller" CommandText="UPDATE XMP_Classified_Seller SET [Banned]=0, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [SellerID] = @SellerID">
    	<Parameter Name="SellerID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
  </CustomCommands>
  
  <Pager 
  	PageSize="25" 
    ShowTopPager="False" 
    ShowBottomPager="True" 
    ShowFirstLast="True" 
    FirstPageCaption="First" 
    LastPageCaption="Last" 
    ShowPrevNext="True" 
    NextPageCaption="&raquo;" 
    PrevPageCaption="&laquo;"
    CurrentPageCssClass="pager-active">
    
    <ul class="pagination">
      <li>{pager}</li>
    </ul>

  </Pager>
  
  

  <HeaderTemplate>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Created</th>
          <th>Updated</th>
          <th>By</th>
          <th>Name</th>
          <th>Location</th>
          <th>Level</th>
          <th>Banned</th>
          <th>Deleted</th>
          <th>User Deleted</th>
          <th>Authorized</th>
          <th width="150"></th>
        </tr>
      </thead>
      <tbody>
  </HeaderTemplate>    
  <ItemTemplate>
        <tr>
          <td><%#Eval("Values")("SellerID")%></td>
          <td><%#Eval("Values")("Username")%></td>
          <td><%#Eval("Values")("Date_Created")%></td>
          <td><%#Eval("Values")("Date_Updated")%></td>
          <td><%#Eval("Values")("UpdatedByUsername")%></td>
          <td><%#Eval("Values")("Seller_Name")%></td>
          <td><%#Eval("Values")("CityState")%></td>
          <td><%#Eval("Values")("Level_Name")%></td>
          <td><%#Eval("Values")("Banned")%></td>
          <td><%#Eval("Values")("SellerDeleted")%></td>
          <td><%#Eval("Values")("UserDeleted")%></td>
          <td><%#Eval("Values")("UserAuthorized")%></td>
          <td>
          	<div class="btn-group" role="group">
              <xmod:DetailButton runat="server" CssClass="btn btn-xs btn-default" Text="Details">
              	<Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
            	</xmod:DetailButton>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">More<span class="caret"></span></button>
                <ul class="dropdown-menu" role="menu">
                  <xmod:Select runat="server" Mode="Standard">
                  	<Case Comparetype="Role" Operator="=" Expression="Administrators">
                    	<xmod:Select runat="server" Mode="Inclusive">
                      	<Case Comparetype="Boolean" Value='<%#Eval("Values")("SellerDeleted")%>' Operator="=" Expression="False">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Soft Delete" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="SoftDeleteSeller" Type="Custom">
                                <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>                        
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("SellerDeleted")%>' Operator="=" Expression="True">
                          <li>
                            <xmod:CommandLink runat="server" Text="Undelete" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="UndeleteSeller" Type="Custom">
                                <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("Banned")%>' Operator="=" Expression="False">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Ban Seller" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="BanSeller" Type="Custom">
                                <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>  
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("Banned")%>' Operator="=" Expression="True">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Unban Seller" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="UnbanSeller" Type="Custom">
                                <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>  
                        </Case>
                      </xmod:Select>                       
                      
                      <li>
                        <xmod:CommandLink runat="server" Text="Hard Delete" OnClientClick="return confirm('Are you sure?');">
                          <Command Name="HardDeleteSeller" Type="Custom">
                            <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
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

  <DetailTemplate>
    
    <div class="media">
      <a class="media-left" href="#">
        <img class="img-thumbnail" src="/Portals/0/avatar.png" style="max-width: 100px" alt="<%#Eval("Values")("Seller_Name")%>">
      </a>
      <div class="media-body">
        <h4 class="media-heading"><%#Eval("Values")("Seller_Name")%></h4>
        <h5>SellerID: <%#Eval("Values")("SellerID")%></h5>
        <h5>User: <%#Eval("Values")("Username")%> (<%#Eval("Values")("UserID")%>)</h5>
        <h5>Level: <%#Eval("Values")("Level_Name")%> (<%#Eval("Values")("Seller_Level")%>)</h5>
        <h5>Approved Ads: <%#Eval("Values")("Approved_Ads")%></h5>
      </div>
    </div>
    
    <h4>Seller Profile</h4>
    
    <table class="table table-bordered table-striped">
      <thead>
      	<tr>
        	<th>Address</th>
          <th>Location</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Show Address</th>
          <th>Show Phone</th>
          <th>Created</th>
          <th>Updated</th>
          <th>Updated By</th>
          <th>Banned</th>
          <th>Seller Deleted</th>
          <th>User Deleted</th>
          <th>User Authorized</th>
        </tr>
      </thead>
      <tbody>
      	<tr>
        	<td><%#Eval("Values")("Seller_Address")%></td>
          <td><%#Eval("Values")("CityState")%> (<%#Eval("Values")("Seller_Location")%>)</td>
          <td><%#Eval("Values")("Seller_Phone")%></td>
          <td><%#Eval("Values")("Seller_Email")%></td>
          <td><%#Eval("Values")("Show_Address_By_Default")%></td>
          <td><%#Eval("Values")("Show_Phone_By_Default")%></td>
          <td><%#Eval("Values")("Date_Created")%></td>
          <td><%#Eval("Values")("Date_Updated")%></td>
          <td><%#Eval("Values")("UpdatedByUsername")%> (<%#Eval("Values")("UpdatedBy")%>)</td>
          <td><%#Eval("Values")("Banned")%></td>
          <td><%#Eval("Values")("SellerDeleted")%></td> 
          <td><%#Eval("Values")("UserDeleted")%></td>
          <td><%#Eval("Values")("UserAuthorized")%></td>
        </tr>
      </tbody>

    </table>

    <xmod:ReturnLink runat="server" CssClass="btn btn-default" Text="&lt;&lt; Go Back" />
    <hr />

  </DetailTemplate>
</xmod:Template></xmod:masterview>