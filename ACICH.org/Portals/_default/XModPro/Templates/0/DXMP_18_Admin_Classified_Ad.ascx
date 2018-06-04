<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:ScriptBlock runat="server" ScriptId="CustomCSS" BlockType="HeadScript" RegisterOnce="True">
  <style type="text/css">
  	.pager-active {
      color: #fff !important;
      background-color: #337ab7 !important;
      border-color: #337ab7 !important;
    }
    
    .approved-False {
      background-color: #fcf8e3 !important;
    }
    .summary-wrapper { margin-top: 50px; }
    .summary-wrapper .title-wrapper { text-align: center; }
    .summary-wrapper .title-wrapper h1 { margin: 0px; }
    .summary-wrapper .title-wrapper h2 { margin: 0px; }
    .summary-wrapper .title-wrapper h5 { margin: 0px; }
    .summary-wrapper .image-wrapper { text-align: center; margin-top: 20px; }
    .summary-wrapper .price-wrapper { text-align: center; font-size: 20px; color: darkgreen; }
    .summary-wrapper .contact-wrapper { text-align: center; margin-top: 10px; font-size: 16px; color: #555; }
    .summary-wrapper .adsummary-wrapper { max-width: 600px; margin: 20px auto; }
    .summary-wrapper .adsummary-wrapper p { font-size: 16px; color: #555; border: 4px solid #ebebeb; padding: 20px; border-radius: 10px; }
    .summary-wrapper .adinfo-wrapper { max-width: 600px; margin: 15px auto; }
    .summary-wrapper .addetails-wrapper { border: 4px solid #ebebeb; border-radius: 10px; padding: 20px; margin: 20px 0px;}    
  </style>    
</xmod:ScriptBlock>

<xmod:Template runat="server" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators" DetailRoles="Administrators">
  <ListDataSource CommandText="SELECT 
                                a.[AdID]
                               ,a.[SellerID]
                               ,seller.[Seller_Name]
                               ,u.[Username] AS SellerUsername
                               ,loc.City + ', ' + loc.State AS CityState
                               ,a.[Ad_Title]
                               ,a.[Ad_Price]
                               ,a.[PrimaryImage]
                               ,a.[Date_Created]
                               ,uu.[Username] AS CreatedByUsername
                               ,a.[Date_Updated]
                               ,uuu.[Username] AS UpdatedByUsername
                               ,a.[IsSold]
                               ,a.[Ad_Expires]
                               ,a.[Approved]
                               ,a.[Active]
                               
                               FROM XMP_Classified_Ad a
                               INNER JOIN XMP_Classified_Seller seller ON a.SellerID = seller.SellerID
                               LEFT JOIN XMP_Classified_Location loc ON a.LocationID = loc.LocationID
                               LEFT JOIN Users u on seller.UserID = u.UserID
                               LEFT JOIN Users uu on a.CreatedBy = uu.UserID
                               LEFT JOIN Users uuu ON a.UpdatedBy = uuu.UserID
                               ORDER BY a.Approved ASC, a.Date_Created DESC"/>
  
  
  <DetailDataSource CommandText="SELECT 
                                  
                                  -- From XMP_Classified_Ad Table
                                  a.[AdID]
                                 ,a.[SellerID]
                                 ,a.[LocationID]
                                 ,a.[Ad_Title]
                                 ,a.[Ad_Subtitle]
                                 ,a.[Ad_Price]
                                 ,a.[PrimaryImage]
                                 ,a.[Ad_Summary]
                                 ,a.[Ad_Description]
                                 ,a.[Date_Created]
                                 ,a.[CreatedBy]
                                 ,a.[Created_IP]
                                 ,a.[Date_Updated]
                                 ,a.[UpdatedBy]
                                 ,a.[Updated_IP]
                                 ,a.[IsSold]
                                 ,a.[DateSold]
                                 ,a.[Ad_Expires]
                                 ,a.[Approved]
                                 ,a.[Active]
                                 ,a.[ShowAddress]
                                 ,a.[ShowPhone]
                                 ,a.[ShowEmail] 
                                 
                                 -- From XMP_Classified_Seller Table
                                 ,seller.[UserID] AS SellerUserID
                                 ,seller.[Seller_Name]
                                 ,seller.[Seller_Image]
                                 ,seller.[Seller_Level]
                                 ,seller.[Approved_Ads]
                                 ,seller.[Seller_Location]
                                 ,seller.[Seller_Address]
                                 ,seller.[Seller_Phone]
                                 ,seller.[Seller_Email]
                                 ,seller.[Show_Address_By_Default]
                                 ,seller.[Show_Phone_By_Default]
                                 ,seller.[Date_Created] AS Seller_Date_Created
                                 ,seller.[Date_Updated] AS Seller_Date_Updated
                                 ,seller.[Banned]
                                 ,seller.[IsDeleted] AS SellerDeleted
                                 
                                 -- From Users Table 
                                 ,u.[Username] AS SellerUsername
                                 
                                 -- From Users Table
                                 ,uu.[Username] AS CreatedByUsername
                                 
                                 -- From Users Table
                                 ,uuu.[Username] AS UpdatedByUsername
                                 
                                 -- From Users Table
                                 ,uuuu.[Username] AS Seller_UpdatedByUsername
                                 ,uuuu.[UserID] AS Seller_UpdatedBy
                                 
                                 -- From UserPortals Table
                                 ,up.[IsDeleted] AS UserDeleted
                                 ,up.[Authorised] AS UserAuthorized
                                 
                                 -- From XMP_Classified_Level Table
                                 ,level.[Level_Name]
                                 
                                 -- From XMP_Classified_Location Table
                                 ,loc.City + ', ' + loc.State AS CityState
                                 
                                 -- From XMP_Classified_Location Table
                                 ,loc2.City + ', ' + loc2.State AS SellerCityState
                                 
                                 FROM XMP_Classified_Ad a
                                 INNER JOIN XMP_Classified_Seller seller ON a.SellerID = seller.SellerID
                                 INNER JOIN XMP_Classified_Level level ON seller.Seller_Level = level.LevelID 
                                 LEFT JOIN XMP_Classified_Location loc ON a.LocationID = loc.LocationID
                                 LEFT JOIN XMP_Classified_Location loc2 ON seller.Seller_Location = loc2.LocationID
                                 LEFT JOIN Users u on seller.UserID = u.UserID
                                 LEFT JOIN Users uu on a.CreatedBy = uu.UserID
                                 LEFT JOIN Users uuu ON a.UpdatedBy = uuu.UserID
                                 LEFT JOIN Users uuuu ON seller.UpdatedBy = uuuu.UserID
                                 LEFT JOIN UserPortals up ON seller.UserID = up.UserID
                                 WHERE a.[AdID] = @AdID">
    <Parameter Name="AdID" />
  </DetailDataSource>
  
  
  <CustomCommands>
    <DataCommand CommandName="DeleteAd" CommandText="DELETE FROM XMP_Classified_Ad WHERE [AdID] = @AdID">
    	<Parameter Name="AdID" />       
    </DataCommand>
    <DataCommand CommandName="ApproveAd" CommandText="UPDATE XMP_Classified_Ad SET [Approved]=1, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [AdID] = @AdID">
    	<Parameter Name="AdID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="UnapproveAd" CommandText="UPDATE XMP_Classified_Ad SET [Approved]=0, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [AdID] = @AdID">
    	<Parameter Name="AdID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="ActivateAd" CommandText="UPDATE XMP_Classified_Ad SET [Active]=1, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [AdID] = @AdID">
    	<Parameter Name="AdID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="DeactivateAd" CommandText="UPDATE XMP_Classified_Ad SET [Active]=0, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [AdID] = @AdID">
    	<Parameter Name="AdID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="MarkAsSold" CommandText="UPDATE XMP_Classified_Ad SET [IsSold]=1, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [AdID] = @AdID">
    	<Parameter Name="AdID" /> 
      <Parameter Name="UserID" />
    </DataCommand>
    <DataCommand CommandName="MarkAsUnSold" CommandText="UPDATE XMP_Classified_Ad SET [IsSold]=0, [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [AdID] = @AdID">
    	<Parameter Name="AdID" /> 
      <Parameter Name="UserID" />
    </DataCommand>    
    <DataCommand CommandName="RenewAd" CommandText="UPDATE XMP_Classified_Ad SET [Ad_Expires]=DATEADD(Month, 1, getdate()), [Date_Updated]=getdate(), [UpdatedBy]=@UserID WHERE [AdID] = @AdID">
    	<Parameter Name="AdID" /> 
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
    FilterExpression="Ad_Title LIKE '%{0}%' OR Seller_Name LIKE '%{0}%'"
    SearchLabelText="Search For:" SearchButtonText="GO" 
    SortFieldNames="Seller_Name,CityState,Date_Created,Approved,Active"
    SortFieldLabels="Seller,Location,Created,Approved,Active"
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
          <th>Image</th>
          <th>ID</th>
          <th>Seller</th>
          <th>Location</th>
          <th>Title</th>
          <th>Price</th>
          <th>Created</th>
          <th>By</th>
          <th>Updated</th>
          <th>By</th>
          <th>Sold</th>
          <th>Expires</th>
          <th>Approved</th>
          <th>Active</th>
          <th style="min-width: 160px">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
  </HeaderTemplate>
  <ItemTemplate>

        <tr class="approved-<%#Eval("Values")("Approved")%>">
          <td>
            <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
            	<img src="/Portals/<%#PortalData("ID")%>/Classifieds/Ads/<%#Eval("Values")("SellerID")%>/thm_<%#Eval("Values")("PrimaryImage")%>" />
            </xmod:IfNotEmpty>
          </td>
          <td><%#Eval("Values")("AdID")%></td>
          <td><%#Eval("Values")("Seller_Name")%> (<%#Eval("Values")("SellerID")%> - <%#Eval("Values")("SellerUsername")%>)</td>
          <td><%#Eval("Values")("CityState")%></td>
          <td><%#Eval("Values")("Ad_Title")%></td>
          <td><xmod:Format runat="server" Type="Float" Value='<%#Eval("Values")("Ad_Price")%>' Pattern="c" /></td>
          <td><xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Created")%>' Pattern="MM/dd/yyyy" /></td>
          <td><%#Eval("Values")("CreatedByUsername")%></td>
          <td><xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Updated")%>' Pattern="MM/dd/yyyy" /></td>
          <td><%#Eval("Values")("UpdatedByUsername")%></td>
          <td><%#Eval("Values")("IsSold")%></td>
          <td><xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></td>
          <td><%#Eval("Values")("Approved")%></td>
          <td><%#Eval("Values")("Active")%></td>
          <td>
          	<div class="btn-group" role="group">
              <xmod:DetailButton runat="server" CssClass="btn btn-xs btn-default" Text="Details">
              	<Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
            	</xmod:DetailButton>
              <xmod:EditButton runat="server" CssClass="btn btn-xs btn-default" Text="Edit">
              	<Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
            	</xmod:EditButton>   
    					<div class="btn-group" role="group">
                <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">More <span class="caret"></span></button>
                <ul class="dropdown-menu" role="menu">
                  <xmod:Select runat="server" Mode="Standard">
                  	<Case Comparetype="Role" Operator="=" Expression="Administrators">
                    	<xmod:Select runat="server" Mode="Inclusive">
                      	<Case Comparetype="Boolean" Value='<%#Eval("Values")("Approved")%>' Operator="=" Expression="False">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Approve Ad" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="ApproveAd" Type="Custom">
                                <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>  
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("Approved")%>' Operator="=" Expression="True">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Unapprove Ad" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="UnapproveAd" Type="Custom">
                                <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>  
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("Active")%>' Operator="=" Expression="False">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Activate Ad" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="ActivateAd" Type="Custom">
                                <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>  
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("Active")%>' Operator="=" Expression="True">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Deactivate Ad" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="DeactivateAd" Type="Custom">
                                <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>  
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("IsSold")%>' Operator="=" Expression="False">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Mark As Sold" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="MarkAsSold" Type="Custom">
                                <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>  
                        </Case>
                        <Case Comparetype="Boolean" Value='<%#Eval("Values")("IsSold")%>' Operator="=" Expression="True">
                      		<li>
                            <xmod:CommandLink runat="server" Text="Mark As Not Sold" OnClientClick="return confirm('Are you sure?');">
                              <Command Name="MarkAsUnsold" Type="Custom">
                                <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                                <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                              </Command>
                            </xmod:CommandLink>
                          </li>  
                        </Case>
                      </xmod:Select>                       
                      
                      <li>
                        <xmod:CommandLink runat="server" Text="Renew Ad" OnClientClick="return confirm('Are you sure?');">
                          <Command Name="RenewAd" Type="Custom">
                            <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                      </li>    
                      
                      <li>
                        <xmod:CommandLink runat="server" Text="Delete" OnClientClick="return confirm('Are you sure?');">
                          <Command Name="DeleteAd" Type="Custom">
                            <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
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

    <div role="tabpanel">

      <ul class="nav nav-tabs" role="tablist" style="margin-left: 0px">
        <li role="presentation" class="active"><a href="#adsummary" aria-controls="adsummary" role="tab" data-toggle="tab">Ad Summary</a></li>
        <li role="presentation"><a href="#addetails" aria-controls="addetails" role="tab" data-toggle="tab">Detailed Description</a></li>
        <li role="presentation"><a href="#seller" aria-controls="seller" role="tab" data-toggle="tab">Seller</a></li>
      </ul>

      <div class="tab-content">
        
        <div role="tabpanel" class="tab-pane active" id="adsummary">
        	<div class="summary-wrapper">
            <div class="title-wrapper">
              <h1><%#Eval("Values")("Ad_Title")%></h1>
              <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Ad_Subtitle")%>'>
              	<h2><%#Eval("Values")("Ad_Subtitle")%></h2>
              </xmod:IfNotEmpty>
              <h5>Item located in <%#Eval("Values")("CityState")%></h5>
            </div>
            <div class="price-wrapper">
              <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Ad_Price")%>'>
              	<xmod:Format runat="server" Type="Float" Value='<%#Eval("Values")("Ad_Price")%>' Pattern="c" />
              </xmod:IfNotEmpty>
              <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("Ad_Price")%>'>
              	FREE!
              </xmod:IfEmpty>
            </div>
            <div class="contact-wrapper">
              <xmod:Select runat="server" Mode="Inclusive">
              	<Case Comparetype="Boolean" Value='<%#Eval("Values")("ShowPhone")%>' Operator="=" Expression="True">
                	Phone: <%#Eval("Values")("Seller_Phone")%><br/>
                </Case>
                <Case Comparetype="Boolean" Value='<%#Eval("Values")("ShowEmail")%>' Operator="=" Expression="True">
                	Email: <a href="mailto:<%#Eval("Values")("Seller_Email")%>"><%#Eval("Values")("Seller_Email")%></a>
                </Case>
              </xmod:Select>
            </div>
            <div class="image-wrapper">
							<xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
                <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/Ads/<%#Eval("Values")("SellerID")%>/<%#Eval("Values")("PrimaryImage")%>" />
              </xmod:IfNotEmpty>
              <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
                <img class="img-thumbnail" src="http://placehold.it/300&text=no+image" />
              </xmod:IfEmpty>
            </div>
            
            <div class="adsummary-wrapper">
              <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Ad_Summary")%>'>
              	<p><%#Eval("Values")("Ad_Summary")%></p>
              </xmod:IfNotEmpty>	
            </div>
            <div class="adinfo-wrapper">
              <ul class="list-group" style="margin-left: 0px">
                <li class="list-group-item">Posted by <%#Eval("Values")("Seller_Name")%> on: <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Created")%>' Pattern="MM/dd/yyyy" /></li>
                <li class="list-group-item">Expires on: <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></li>
                <xmod:Select runat="server">
                	<Case Comparetype="Boolean" Value='<%#Eval("Values")("ShowAddress")%>' Operator="=" Expression="True">
                  	<li class="list-group-item">Address: <%#Eval("Values")("Seller_Address")%> - <%#Eval("Values")("SellerCityState")%></li>
                  </Case>
                </xmod:Select>
              </ul>
            </div>
          </div>        
        </div>
        
        <div role="tabpanel" class="tab-pane" id="addetails">
        	<div class="summary-wrapper">
            <div class="title-wrapper">
              <h1><%#Eval("Values")("Ad_Title")%></h1>
              <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Ad_Subtitle")%>'>
              	<h2><%#Eval("Values")("Ad_Subtitle")%></h2>
              </xmod:IfNotEmpty>
              <h5>Item located in <%#Eval("Values")("CityState")%></h5>
            </div>
            <div class="price-wrapper">
              <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Ad_Price")%>'>
              	<xmod:Format runat="server" Type="Float" Value='<%#Eval("Values")("Ad_Price")%>' Pattern="c" />
              </xmod:IfNotEmpty>
              <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("Ad_Price")%>'>
              	FREE!
              </xmod:IfEmpty>
            </div>
            <div class="contact-wrapper">
              <xmod:Select runat="server" Mode="Inclusive">
              	<Case Comparetype="Boolean" Value='<%#Eval("Values")("ShowPhone")%>' Operator="=" Expression="True">
                	Phone: <%#Eval("Values")("Seller_Phone")%><br/>
                </Case>
                <Case Comparetype="Boolean" Value='<%#Eval("Values")("ShowEmail")%>' Operator="=" Expression="True">
                	Email: <a href="mailto:<%#Eval("Values")("Seller_Email")%>"><%#Eval("Values")("Seller_Email")%></a>
                </Case>
              </xmod:Select>
            </div>
            <div class="addetails-wrapper">
              <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Ad_Description")%>'>
              	<div><%#Eval("Values")("Ad_Description")%></div>
              </xmod:IfNotEmpty>	
              <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("Ad_Description")%>'>
              	<div>Contact seller for details...</div>
              </xmod:IfEmpty>
            </div>
            <div class="adinfo-wrapper">
              <ul class="list-group" style="margin-left: 0px;">
                <li class="list-group-item">Posted by <%#Eval("Values")("Seller_Name")%> on: <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Created")%>' Pattern="MM/dd/yyyy" /></li>
                <li class="list-group-item">Expires on: <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></li>
                <xmod:Select runat="server">
                	<Case Comparetype="Boolean" Value='<%#Eval("Values")("ShowAddress")%>' Operator="=" Expression="True">
                  	<li class="list-group-item">Address: <%#Eval("Values")("Seller_Address")%> - <%#Eval("Values")("SellerCityState")%></li>
                  </Case>
                </xmod:Select>
              </ul>
            </div>
          </div> 
        
        </div>
        
        
        <div role="tabpanel" class="tab-pane" id="seller">
          <div class="media" style="margin-top: 50px">
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
              <h5>User: <%#Eval("Values")("SellerUsername")%> (<%#Eval("Values")("SellerUserID")%>)</h5>
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
                <td><%#Eval("Values")("Seller_Date_Created")%></td>
                <td><%#Eval("Values")("Seller_Date_Updated")%></td>
                <td><%#Eval("Values")("Seller_UpdatedByUsername")%> (<%#Eval("Values")("Seller_UpdatedBy")%>)</td>
                <td><%#Eval("Values")("Banned")%></td>
                <td><%#Eval("Values")("SellerDeleted")%></td> 
                <td><%#Eval("Values")("UserDeleted")%></td>
                <td><%#Eval("Values")("UserAuthorized")%></td>
              </tr>
            </tbody>

          </table>
        </div>

        
      </div>

		</div>
    
    
    
    

    <xmod:ReturnLink runat="server" CssClass="btn btn-default" Text="&lt;&lt; Go Back" />
    <hr />

  </DetailTemplate>
</xmod:Template></xmod:masterview>