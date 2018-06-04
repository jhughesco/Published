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
</xmod:ScriptBlock>

<xmod:Template runat="server" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators" DetailRoles="Administrators">
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
      LEFT JOIN UserPortals up ON a.UserID = up.UserID"/>
  
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
  
  <SearchSort 
    FilterExpression="Seller_Name LIKE '%{0}%'"
    SearchLabelText="Search For:" SearchButtonText="GO" 
    SortFieldNames="Seller_Name,Seller_Location,Seller_Level,Date_Created"
    SortFieldLabels="Name,Location,Level,Created"
    SearchBoxCssClass="form-control"
    SearchButtonCssClass="btn btn-default"
    SortButtonText="Go"
    SortButtonCssClass="btn btn-default"
    SortFieldListCssClass="form-control">
    
    <div class="row">
      <div class="col-sm-6">
        <div class="input-group">
          {SearchBox}
          <span class="input-group-btn">
            {SearchButton}
          </span>
        </div>
      </div>
      <div class="col-sm-6">
      	<div class="form-inline">
          <div class="form-group">
            <label class="control-label">Sort</label>
            {SortFieldList}
            {SortButton}
          </div>
          <div class="form-group">
            <div class="checkbox">
              <label>
                {ReverseSort} Reverse
              </label>
            </div>
          </div>
        </div> 	
      </div>
    </div><br/>
  </SearchSort>

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
              <xmod:DetailButton runat="server" OnClientClick="console.log(this);" CssClass="btn btn-xs btn-default" Text="Details">
              	<Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
              </xmod:DetailButton>
              <xmod:EditButton runat="server" CssClass="btn btn-xs btn-default" Text="Edit">
                <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
              </xmod:EditButton>   
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
                      
                      <li>
                      	<xmod:Redirect runat="server" Display="LinkButton" Method="Post" Target="/Admin/Classifieds-Admin/Sellers/Post-Ad" Text="Post Ad">
                          <Field Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                        </xmod:Redirect>
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
        <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Seller_Image")%>'>
          <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/SellerImages/thm_<%#Eval("Values")("Seller_Image")%>" style="max-width: 100px" alt="<%#Eval("Values")("Seller_Name")%>">
        </xmod:IfNotEmpty>
        <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("Seller_Image")%>'>
          <img class="img-thumbnail" src="/Portals/0/avatar.png" style="max-width: 100px" alt="<%#Eval("Values")("Seller_Name")%>">
        </xmod:IfEmpty>
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
</xmod:Template>
<div>
  <xmod:AddLink runat="server" CssClass="btn btn-primary" Text="New Seller" />
</div></xmod:masterview>