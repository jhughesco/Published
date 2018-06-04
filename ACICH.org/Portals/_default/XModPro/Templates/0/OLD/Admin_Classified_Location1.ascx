<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:Template runat="server" ID="LocationTemplate" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators">
  <ListDataSource CommandText="SELECT 
                                 [LocationID]
                                ,[City]
                                ,[State]
                                ,(SELECT COUNT(*) FROM XMP_Classified_Seller WHERE Seller_Location = a.LocationID) AS SellersCount

                              FROM [XMP_Classified_Location] a"/>
  
  <CustomCommands>
			<DataCommand CommandName="DeleteLoc" CommandText="DELETE FROM XMP_Classified_Location WHERE [LocationID] = @LocationID">
      	<Parameter Name="LocationID" />
      </DataCommand>
  </CustomCommands>
  
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
          <div class="btn-group" role="group">
            <xmod:EditLink runat="server" Text="Edit" CssClass="btn btn-success btn-xs">
              <Parameter Name="LocationID" Value='<%#Eval("Values")("LocationID")%>' />
            </xmod:EditLink>
          </div>
            <div class="btn-group" role="group">
              
              <button type="button" class="btn btn-default btn-xs">More</button>
              <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              
              <ul class="dropdown-menu" role="menu">
                <li>
                  <xmod:CommandLink runat="server" Text='<%#Join("Show Sellers - {0}", Eval("Values")("SellersCount"))%>' CssClass="btn btn-xs btn-sucess">
                    <Command Target="SellerTemplate" Type="List">
                      <Parameter Name="LocationID" Value='<%#Eval("Values")("LocationID")%>' DataType="Int32" />
                    </Command>
                  </xmod:CommandLink>
                </li>
                <li>
                  <xmod:CommandLink runat="server" Text="Delete Location" CssClass="btn btn-xs btn-danger" OnClientClick="return confirm('Are you sure?');">
                    <Command Name="DeleteLoc" Type="Custom">
                      <Parameter Name="LocationID" Value='<%#Eval("Values")("LocationID")%>' DataType="Int32" />
                    </Command>
                  </xmod:CommandLink>
                </li>
              </ul>
            </div>
        </td>
      </tr>
    </ItemTemplate>
    <AlternatingItemTemplate>
      <tr style="background-color:#e3e3e3;">
        <td><%#Eval("Values")("LocationID")%></td>
        <td><%#Eval("Values")("City")%></td>
        <td><%#Eval("Values")("State")%></td>
        <td>
          <div class="btn-group" role="group">
            <xmod:EditLink runat="server" Text="Edit" CssClass="btn btn-success btn-xs">
              <Parameter Name="LocationID" Value='<%#Eval("Values")("LocationID")%>' />
            </xmod:EditLink>
          </div>
            <div class="btn-group" role="group">
              
              <button type="button" class="btn btn-default btn-xs">More</button>
              <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              
              <ul class="dropdown-menu" role="menu">
                <li>
                  <xmod:CommandLink runat="server" Text='<%#Join("Show Sellers - {0}", Eval("Values")("SellersCount"))%>' CssClass="btn btn-xs btn-sucess">
                    <Command Target="SellerTemplate" Type="List">
                      <Parameter Name="LocationID" Value='<%#Eval("Values")("LocationID")%>' DataType="Int32" />
                    </Command>
                  </xmod:CommandLink>
                </li>
                <li>
                  <xmod:CommandLink runat="server" Text="Delete Location" CssClass="btn btn-xs btn-danger" OnClientClick="return confirm('Are you sure?');">
                    <Command Name="DeleteLoc" Type="Custom">
                      <Parameter Name="LocationID" Value='<%#Eval("Values")("LocationID")%>' DataType="Int32" />
                    </Command>
                  </xmod:CommandLink>
                </li>
              </ul>
            </div>
        </td>
      </tr>
    </AlternatingItemTemplate>
    <FooterTemplate>
      </tbody>
    </table>
  </FooterTemplate>
</xmod:Template>

<div>
  <xmod:AddLink runat="server" CssClass="btn btn-primary" Text="New Location" />
</div><br /><br />

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
			WHERE Seller_Location = @LocationID">
    	
    	<Parameter Name="LocationID" Value="-1" DataType="Int32" />
  </ListDataSource>
  
  <DetailDataSource CommandText="SELECT a.[SellerID]
          ,a.[UserID]
          ,u.[Username]
          ,a.[Date_Created]
          ,a.[Date_Updated]
          ,a.[UpdatedBy]
          ,u.[Username] AS UpdatedByUsername
	        ,a.[Seller_Name]
          ,a.[Seller_Address]
          ,a.[Seller_Location]
          ,c.[City] + ', ' + c.[State] AS CityState
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
          ,up.[IsDeleted] AS UserDeleted
          ,up.[Authorised] AS UserAuthorized

      FROM XMP_Classified_Seller a
      INNER JOIN XMP_Classified_Level b ON a.Seller_Level = b.LevelID
      LEFT JOIN XMP_Classified_Location c ON a.Seller_Location = c.LocationID 
      LEFT JOIN Users u ON a.UserID = u.UserID
      LEFT JOIN Users uu ON a.UserID = uu.UserID
      LEFT JOIN UserPortals up ON a.UserID = up.UserId
      WHERE a.[SellerID] = @SellerID">
    <Parameter Name="SellerID" />
  </DetailDataSource>  

  <DeleteCommand CommandText="DELETE FROM XMP_Classified_Seller WHERE [SellerID] = @SellerID">
    <Parameter Name="SellerID" />
  </DeleteCommand>
  
  <CustomCommands>
    <DataCommand CommandName="SoftDeleteSeller" CommandText="UPDATE XMP_Classified_Seller SET [IsDeleted]=1,[Date_Updated]=getdate(),[UpdatedBy]=@UserID WHERE [SellerID] = @SellerID">
      <Parameter Name="SellerID" />
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="RestoreSeller" CommandText="UPDATE XMP_Classified_Seller SET [IsDeleted]=0,[Date_Updated]=getdate(),[UpdatedBy]=@UserID WHERE [SellerID] = @SellerID">
      <Parameter Name="SellerID" />
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="DeleteSeller" CommandText="DELETE FROM XMP_Classified_Seller WHERE [SellerID] = @SellerID">
      <Parameter Name="SellerID" />
    </DataCommand>
    <DataCommand CommandName="BanSeller" CommandText="UPDATE XMP_Classified_Seller SET [Banned]=1,[Date_Updated]=getdate(),[UpdatedBy]=@UserID WHERE [SellerID] = @SellerID">
      <Parameter Name="SellerID" />
      <Parameter Name="UserID" />
    </DataCommand>
  </CustomCommands>
  
  <Pager 
    PageSize="5" 
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
          <th>Updated By</th>
          <th>Name</th>
          <th>Location</th>
          <th>Level</th>
          <th>Banned</th>
          <th>Seller Deleted</th>
          <th>User Deleted</th>
          <th>User Authorized</th>
          <th width="150">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
  </HeaderTemplate>
    
  <ItemTemplate>
        <tr>
          <td><%#Eval("Values")("SellerID")%></td>
          <td style="white-space:nowrap;">
          	<div class="btn-group" role="group">
              <span class="glyphicon glyphicon-list" aria-hidden="true">
                <xmod:DetailLink runat="server" CssClass="btn btn-sm btn-info" Text='<%#Eval("Values")("Username")%>'>
                  <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                </xmod:DetailLink>
              </span>
            </div>
          </td>
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
          <td style="white-space:nowrap;">
            <div class="btn-group" role="group">
              
              <button type="button" class="btn btn-default btn-xs">More</button>
              <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              
              <ul class="dropdown-menu" role="group">
	            	<li>
									<xmod:CommandLink runat="server" Text="Soft Delete" CssClass="btn btn-xs btn-warning" OnClientClick="return confirm('Are you sure?');">
                		<Command Name="SoftDeleteSeller" Type="Custom">
                      <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                      <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                  	</Command>
              		</xmod:CommandLink>
                </li>
                <li>
									<xmod:CommandLink runat="server" Text="Restore Soft Delete" CssClass="btn btn-xs btn-success" OnClientClick="return confirm('Are you sure?');">
                		<Command Name="RestoreSeller" Type="Custom">
                      <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                      <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                  	</Command>
              		</xmod:CommandLink>
                </li>
                <li>
									<xmod:CommandLink runat="server" Text="Delete Seller" CssClass="btn btn-xs btn-danger" OnClientClick="return confirm('Are you sure, this is Permanent!?');">
                		<Command Name="DeleteSeller" Type="Custom">
                      <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                    </Command>
              		</xmod:CommandLink>
                </li>
                <li>
									<xmod:CommandLink runat="server" Text="Ban Seller" CssClass="btn btn-xs btn-warning" OnClientClick="return confirm('Are you sure?');">
                		<Command Name="BanSeller" Type="Custom">
                      <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                      <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                  	</Command>
              		</xmod:CommandLink>
                </li>
              </ul>
            </div>
         </td>
        </tr>
  </ItemTemplate>

  <AlternatingItemTemplate>
        <tr style="background-color: #e8e8e8;">
          <td><%#Eval("Values")("SellerID")%></td>
          <td style="white-space:nowrap;">
          	<div class="btn-group" role="group">
              <span class="glyphicon glyphicon-list" aria-hidden="true">
                <xmod:DetailLink runat="server" CssClass="btn btn-sm btn-info" Text='<%#Eval("Values")("Username")%>'>
                  <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                </xmod:DetailLink>
              </span>
            </div>
          </td>
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
          <td style="white-space:nowrap;">
            <div class="btn-group" role="group">
              
              
              <button type="button" class="btn btn-default btn-xs">More</button>
              <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              
              <ul class="dropdown-menu" role="group">
	            	<li>
									<xmod:CommandLink runat="server" Text="Soft Delete" CssClass="btn btn-xs btn-warning" OnClientClick="return confirm('Are you sure?');">
                		<Command Name="SoftDeleteSeller" Type="Custom">
                      <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                      <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                  	</Command>
              		</xmod:CommandLink>
                </li>
                <li>
									<xmod:CommandLink runat="server" Text="Restore Soft Delete" CssClass="btn btn-xs btn-success" OnClientClick="return confirm('Are you sure?');">
                		<Command Name="RestoreSeller" Type="Custom">
                      <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                      <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                  	</Command>
              		</xmod:CommandLink>
                </li>
                <li>
									<xmod:CommandLink runat="server" Text="Delete Seller" CssClass="btn btn-xs btn-danger" OnClientClick="return confirm('Are you sure, this is Permanent!?');">
                		<Command Name="DeleteSeller" Type="Custom">
                      <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                    </Command>
              		</xmod:CommandLink>
                </li>
                <li>
									<xmod:CommandLink runat="server" Text="Ban Seller" CssClass="btn btn-xs btn-warning" OnClientClick="return confirm('Are you sure?');">
                		<Command Name="BanSeller" Type="Custom">
                      <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' DataType="Int32" />
                      <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                  	</Command>
              		</xmod:CommandLink>
                </li>
              </ul>
            </div>
         </td>
        </tr>
  </AlternatingItemTemplate>
    
  <FooterTemplate>
      </tbody>
    </table>
	</FooterTemplate>

	<DetailTemplate>
    
    <div class="media">
      <a class="media-left" href="#">
        <img class="img-thumbnail" src="/Portals/0/images/<%#Eval("Values")("Seller_Image")%>" style="max-width: 100px" alt="<%#Eval("Values")("Seller_Name")%>">
      </a>
      <div class="media-body">
        <h4 class="media-heading"><%#Eval("Values")("Seller_Name")%></h4>
        <h5>SellerID: <%#Eval("Values")("SellerID")%></h5>
        <h5>UserID: <%#Eval("Values")("Username")%> (<%#Eval("Values")("UserID")%>)</h5>
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
          <th>Deleted</th>
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
        </tr>
      </tbody>

    </table>

    <xmod:ReturnLink runat="server" CssClass="btn btn-default" Text="&lt;&lt; Go Back" />
		<hr />
    
  </DetailTemplate>

</xmod:Template></xmod:masterview>