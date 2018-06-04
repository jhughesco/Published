<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.TemplateBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls" TagPrefix="xmod" %>
<xmod:masterview runat="server">
<xmod:ScriptBlock runat="server" ScriptId="SellerCSS" BlockType="HeadScript" RegisterOnce="False">

  <style type="text/css">
    .pager-active {
      color: #fff !important;
      background-color: #337ab7 !important;
      border-color: #337ab7 !important;
    }

    .nowrap {
      white-space: nowrap;
    }

    .unradius {
      border-radius: 0px;
    }

    .alt-row {
      background-color: #e8e8e8;
    }

    .approved-False {
      background-color: #fee2e2 !important;
    }
    .detail_title {
      text-align: center;
    }
    .gridfix {
      float:left !important;
    }
    .hide {
      display: none; 
    }
    hr.red {
      height: 2px;
      background-color:#FF0000;
      width: 75%;
    }
    hr.grn {
      height: 2px;
      background-color:#33CC33;
      width: 75%;
    }
    .width_adj {
      width: 75%; 
    }

  </style>
  
  <link href="/js/bootstrap-toggle/css/bootstrap-toggle.min.css" rel="stylesheet">
	<script src="/js/bootstrap-toggle/js/bootstrap-toggle.min.js">
    $(function() {
      $('#toggle-one').bootstrapToggle();
    })
  </script>
  


</xmod:ScriptBlock>



    <xmod:Template runat="server" UsePaging="True" Ajax="True" AddRoles="Administrators" EditRoles="Administrators" DeleteRoles="Administrators" DetailRoles="">

        <ListDataSource CommandText="SELECT * FROM vw_XMP_Classified_Ad ORDER BY Approved, Date_Created" />

      	<DetailDataSource CommandText="SELECT * FROM vw_XMP_Classified_Ad_Detail WHERE [AdID] = @AdID">
            <parameter name="AdID" />
        </DetailDataSource>
      	
        <customcommands>
          <DataCommand CommandName="FlagToggle" CommandText="XMP_Classified_Flag_Toggle" CommandType="StoredProcedure">
            <Parameter Name="ID1" />
            <Parameter Name="ID2" />
            <Parameter Name="FlagType" />
          </DataCommand>
          <DataCommand CommandName="RenewAd" CommandText="XMP_Classified_Admin_RenewAd" CommandType="StoredProcedure">
            <Parameter Name="AdID" />
            <Parameter Name="UserID" />
            <Parameter Name="Updated_IP" />
          </DataCommand>
          <DataCommand CommandName="DeleteAd" CommandText="DELETE FROM XMP_Classified_Ad WHERE [AdID] = @AdID">
            <Parameter Name="AdID" />
          </DataCommand>
          </DataCommand>
        </customcommands>

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

        <SearchSort
            FilterExpression="Ad_Title LIKE '%{0}%'"
            SearchLabelText="Search For:" SearchButtonText="GO"
            SortFieldNames="Ad_Title,Seller_Name,Location,Date_Created"
            SortFieldLabels="Title,Name,Location,Created"
            SearchBoxCssClass="form-control"
            SearchButtonCssClass="btn btn-default"
            SortButtonText="Go"
            SortButtonCssClass="btn btn-default"
            SortFieldListCssClass="form-control">

            <div class="row">
                <div class="col-sm-6">
                    <div class="input-group">
                        {SearchBox}
         
                        <span class="input-group-btn">{SearchButton}
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
            </div>
            <br />
        </SearchSort>

        <HeaderTemplate>
          <div class="table table-responsive">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Seller</th>
                        <th>Location</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Created</th>
                        <th>Created By</th>
                        <th>Updated</th>
                        <th>Updated By</th>
                        <th>IsSold</th>
                        <th>Ad Expires</th>
                        <th>Approved</th>
                        <th>Active</th>
                        <th width="250">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
        </HeaderTemplate>

        <ItemTemplate>
            <tr class="approved-<%#Eval("Values")("Approved")%>">
                <td>
                    <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
                      <xmod:DetailImage runat="server" 
                            	CssClass="img-thumbnail" 
                              ToolTip="View Ad Details" 
                              ImageURL='<%#Join("/Portals/{0}/Classifieds/Ads/{1}/thm_{2}", PortalData("ID"), Eval("Values")("SellerID"), Eval("Values")("PrimaryImage"))%>' 
                              AlternateText='<%#Eval("Values")("PrimaryImage")%>' 
                              Style="max-width: 100px">
                          <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
                      </xmod:DetailImage>
                    </xmod:IfNotEmpty>
                </td>
                <td style="white-space: nowrap;">
                    <div class="btn-group" role="group">
                        <xmod:DetailLink runat="server" CssClass="btn btn-xs btn-info" Text='<%#Eval("Values")("SellerUsername")%>'>
                          <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                        </xmod:DetailLink>
                    </div>
                </td>
                <td><%#Eval("Values")("Location")%></td>
                <td><%#Eval("Values")("Ad_Title")%></td>
                <td>
                    <xmod:Format runat="server" Type="Float" Value='<%#Eval("Values")("Ad_Price")%>' Pattern="c" /></td>
                <td>
                    <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Created")%>' Pattern="MM/dd/yyyy" /></td>
                <td><%#Eval("Values")("CreatedByUsername")%></td>
                <td>
                    <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Updated")%>' Pattern="MM/dd/yyyy" /></td>
                <td><%#Eval("Values")("UpdatedByUsername")%></td>
                <td><%#Eval("Values")("IsSold")%></td>
                <td>
                    <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></td>
                <td><%#Eval("Values")("Approved")%></td>
                <td><%#Eval("Values")("Active")%></td>

                <td>
                    <div class="btn-group" role="group" id="AdRow">
                        <xmod:EditLink runat="server" Text="Edit" CssClass="btn btn-xs btn-success">
                <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
              </xmod:EditLink>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default btn-xs nowrap">More</button>
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="caret"></span>
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu unradius" role="group">
                            <li>
                                <xmod:CommandLink runat="server" Text="Show Address" CssClass="btn btn-xs btn-default unradius">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="address" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                            </li>
                            <li>
                                <xmod:CommandLink runat="server" Text="Show Phone" CssClass="btn btn-xs btn-default unradius">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="phone" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                            </li>
                            <li>
                                <xmod:CommandLink runat="server" Text="Show Email" CssClass="btn btn-xs btn-default unradius">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="email" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                            </li>
                            <xmod:Select runat="server" Mode="Standard">
											<Case CompareType="Role" Operator="=" Expression="Administrators">
                      <li>
                        <xmod:CommandLink runat="server" Text="Approved" CssClass="btn btn-xs btn-warning unradius">
                          <Command Name="FlagToggle" Type="Custom">
                            <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                            <Parameter Name="FlagType" Value="approved" DataType="string" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                      <li>
                        <xmod:CommandLink runat="server" Text="Active" CssClass="btn btn-xs btn-warning unradius">
                          <Command Name="FlagToggle" Type="Custom">
                            <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                            <Parameter Name="FlagType" Value="active" DataType="string" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                      <li>
                        <xmod:CommandLink runat="server" Text="Renew Ad" CssClass="btn btn-xs btn-primary unradius" OnClientClick="return confirm('Renew the Ad for 30 Days?');">
                          <Command Name="RenewAd" Type="Custom">
                            <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                            <Parameter Name="Updated_IP" Value='<%#RequestData("HostAddress")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                      <li>
                        <xmod:CommandLink runat="server" Text="IsSold" CssClass="btn btn-xs btn-success unradius">
                          <Command Name="FlagToggle" Type="Custom">
                            <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                            <Parameter Name="FlagType" Value="issold" DataType="string" />
                          </Command>
                        </xmod:CommandLink>
                      </li>

                      <li>
                        <xmod:CommandLink runat="server" Text="Delete" CssClass="btn btn-xs btn-danger unradius" OnClientClick="return confirm('Are you sure, this is Permanent!?');">
                          <Command Name="DeleteAd" Type="Custom">
                            <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                    <li>
                      <xmod:Redirect runat="server" Display="LinkButton" Method="Post" CssClass="btn btn-xs btn-info unradius" Target="/Classifieds-Admin/Sellers/Post-Ad" Text="Post Ad">
                        <Field Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                      </xmod:Redirect>
                    </li>
             			</Case>
            		</xmod:Select>
                        </ul>
                    </div>
                </td>
            </tr>
        </ItemTemplate>

        <AlternatingItemTemplate>
            <tr class="alt-row approved-<%#Eval("Values")("Approved")%>">
                <td>
                    <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
                      <xmod:DetailImage runat="server" 
                            	CssClass="img-thumbnail" 
                              ToolTip="View Ad Details" 
                              ImageURL='<%#Join("/Portals/{0}/Classifieds/Ads/{1}/thm_{2}", PortalData("ID"), Eval("Values")("SellerID"), Eval("Values")("PrimaryImage"))%>' 
                              AlternateText='<%#Eval("Values")("PrimaryImage")%>' 
                              Style="max-width: 100px">
                          <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
                      </xmod:DetailImage>
                    </xmod:IfNotEmpty>
                </td>
                <td style="white-space: nowrap;">
                    <div class="btn-group" role="group">
                        <xmod:DetailLink runat="server" CssClass="btn btn-xs btn-info" Text='<%#Eval("Values")("SellerUsername")%>'>
                          <Parameter Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                        </xmod:DetailLink>
                    </div>
                </td>
                <td><%#Eval("Values")("Location")%></td>
                <td><%#Eval("Values")("Ad_Title")%></td>
                <td>
                    <xmod:Format runat="server" Type="Float" Value='<%#Eval("Values")("Ad_Price")%>' Pattern="c" /></td>
                <td>
                    <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Created")%>' Pattern="MM/dd/yyyy" /></td>
                <td><%#Eval("Values")("CreatedByUsername")%></td>
                <td>
                    <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Updated")%>' Pattern="MM/dd/yyyy" /></td>
                <td><%#Eval("Values")("UpdatedByUsername")%></td>
                <td><%#Eval("Values")("IsSold")%></td>
                <td>
                    <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></td>
                <td><%#Eval("Values")("Approved")%></td>
                <td><%#Eval("Values")("Active")%></td>

                <td>
                    <div class="btn-group" role="group">
                        <xmod:EditLink runat="server" Text="Edit" CssClass="btn btn-xs btn-success">
                <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
              </xmod:EditLink>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default btn-xs nowrap">More</button>
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="caret"></span>
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu unradius" role="group">
                            <li>
                                <xmod:CommandLink runat="server" Text="Show Address" CssClass="btn btn-xs btn-default unradius">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="address" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                            </li>
                            <li>
                                <xmod:CommandLink runat="server" Text="Show Phone" CssClass="btn btn-xs btn-default unradius">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="phone" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                            </li>
                            <li>
                                <xmod:CommandLink runat="server" Text="Show Email" CssClass="btn btn-xs btn-default unradius">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="email" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                            </li>
                    <xmod:Select runat="server" Mode="Standard">
											<Case CompareType="Role" Operator="=" Expression="Administrators">
                      <li>
                        <xmod:CommandLink runat="server" Text="Approved" CssClass="btn btn-xs btn-warning unradius">
                          <Command Name="FlagToggle" Type="Custom">
                            <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                            <Parameter Name="FlagType" Value="approved" DataType="string" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                      <li>
                        <xmod:CommandLink runat="server" Text="Active" CssClass="btn btn-xs btn-warning unradius">
                          <Command Name="FlagToggle" Type="Custom">
                            <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                            <Parameter Name="FlagType" Value="active" DataType="string" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                      <li>
                        <xmod:CommandLink runat="server" Text="Renew Ad" CssClass="btn btn-xs btn-primary unradius" OnClientClick="return confirm('Renew the Ad for 30 Days?');">
                          <Command Name="RenewAd" Type="Custom">
                            <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="UserID" Value='<%#UserData("ID")%>' DataType="Int32" />
                            <Parameter Name="Updated_IP" Value='<%#RequestData("HostAddress")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                      <li>
                        <xmod:CommandLink runat="server" Text="IsSold" CssClass="btn btn-xs btn-success unradius">
                          <Command Name="FlagToggle" Type="Custom">
                            <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                            <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                            <Parameter Name="FlagType" Value="issold" DataType="string" />
                          </Command>
                        </xmod:CommandLink>
                      </li>

                      <li>
                        <xmod:CommandLink runat="server" Text="Delete" CssClass="btn btn-xs btn-danger unradius" OnClientClick="return confirm('Are you sure, this is Permanent!?');">
                          <Command Name="DeleteAd" Type="Custom">
                            <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                      </li>
                    <li>
                      <xmod:Redirect runat="server" Display="LinkButton" Method="Post" CssClass="btn btn-xs btn-info unradius" Target="/Classifieds-Admin/Sellers/Post-Ad" Text="Post Ad">
                        <Field Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                      </xmod:Redirect>
                    </li>
             			</Case>
            		</xmod:Select>
                        </ul>
                    </div>
                </td>
            </tr>
        </AlternatingItemTemplate>


        <FooterTemplate>
            </tbody>
    	</table>
    </div>
 
        </FooterTemplate>

        <DetailTemplate>
            
          	<div class="container">
              <div class="row">
								<div class="col-md-2" href="#">
                    <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
                        <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/Ads/<%#Eval("Values")("SellerID")%>/thm_<%#Eval("Values")("PrimaryImage")%>" style="max-width: 100px" alt="<%#Eval("Values")("PrimaryImage")%>">
                    </xmod:IfNotEmpty>
                    <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
                        <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/SellerImages/NoImage_Turtle.png" style="max-width: 100px" alt="NoSellerImage">
                    </xmod:IfEmpty>
                </div>
                <div class="col-md-4">
                    <h2 class="media-heading"><%#Eval("Values")("Ad_Title")%></h2>
                  	<h4 class="media-heading"><%#Eval("Values")("Ad_Subtitle")%></h4>
                    <%#Eval("Values")("Ad_Summary")%>
                  	<h5 class="media-heading">Price: <strong><%#Eval("Values")("Ad_Price")%></strong></h5>
                </div>
                <div class="col-md-4">
                  <strong>Sold:</strong>
                  <xmod:Select runat="server" Mode="Standard">
                    <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("IsSold")%>'>
                      <xmod:CommandLink runat="server" Text="Is Sold" CssClass="btn btn-xs btn-success">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="issold" DataType="string" />
                        </Command>
                        <Command Type="detail">
                          <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                        </Command>
                      </xmod:CommandLink>    	
                    </Case>
                    <Else>
                      <xmod:CommandLink runat="server" Text="Not Sold" CssClass="btn btn-xs btn-danger">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="issold" DataType="string" />
                        </Command>
                        <Command Type="detail">
                          <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                        </Command>
                      </xmod:CommandLink>
                    </Else>
                  </xmod:Select>
                  
                      
                	  </div>
                  <strong>Posted:</strong> <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Updated")%>' Pattern="MM/dd/yyyy" /> <br />
                  <strong>Expires:</strong> <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /> 
                </div>
            	</div>
            </div>
						
            <div class="container">
            	
              <div class="row">
                <div class="col">
                  <h3>Description</h3>
                  <p><%#Eval("Values")("Ad_Description")%></p>
                  <hr class="grn"/>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-3">
                  <strong>Seller:</strong> <%#Eval("Values")("Seller_Name")%> 
                </div>
                <div class="col-md-6 center-text">
                  <strong>Contact:</strong>	
                </div>
              </div>
                
              <div class="row">
                <div class="col-md-3">
                  <div class="media">
                    <a class="media-left" href="#">
                      <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Seller_Image")%>'>
                        <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/SellerImages/thm_<%#Eval("Values")("Seller_Image")%>" style="max-width: 100px" alt="<%#Eval("Values")("Seller_Name")%>">
                      </xmod:IfNotEmpty>
                      <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("Seller_Image")%>'>
                        <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/SellerImages/NoImage_Turtle.png" style="max-width: 100px" alt="NoSellerImage">
                      </xmod:IfEmpty>    
                    </a>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="container">
                    <xmod:Select runat="server" Mode="Inclusive">
                      <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowAddress")%>'>
                        <div class="row">
                          <div class="col-xs-6 col-offset-2">
                            <address>
                              <strong>Address</strong><br/>
                              <%#Eval("Values")("Seller_Address")%><br>
                              <%#Eval("Values")("Seller_City")%>, <%#Eval("Values")("Seller_State")%>
                            </address>
                          </div>
                        </div>                        
                      </Case>
                      <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowPhone")%>'>
                        <div class="row">
                          <div class="col-xs-6 col-offset-2">
                            <address>
                              <strong>Phone</strong><br/>
                              <%#Eval("Values")("Seller_Phone")%>
                            </address>
                          </div>
                        </div>
                      </Case>
                      <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowEmail")%>'>
                        <div class="row">
                          <div class="col-xs-6 col-offset-2">
                            <address>
                              <strong>Email</strong><br/>
                              <a href="mailto:'<%#Eval("Values")("Seller_Email")%>'" target="_blank"> <%#Eval("Values")("Seller_Email")%> </a>
                            </address>
                          </div>
                        </div>
                      </Case>
                    </xmod:Select>
                  </div>  
                </div>

              </div>
                
              <div class="row">
                <div class="col">
                  <hr class="grn"/>
                </div>
              </div>

            </div>
              
            <xmod:Select runat="server" Mode="Standard">
              <Case CompareType="Role" Operator="=" Expression="Administrators">
                <div class="container">
                  <div class="row">
                    <div class="col">
                      <hr class="red"/>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="container">
                        <div class="row">
                          <div class="col-md-3">
                            <div class="container">
                              <div class="row">
                                <div class="col-md-3">
                                  <strong>AdID:</strong> <%#Eval("Values")("AdID")%><br />
                                  <strong>SellerID:</strong> <%#Eval("Values")("SellerID")%><br />
                                  <strong>Seller Level:</strong> <%#Eval("Values")("Level_Name")%><br />
                                  <address>
                                    <strong><u>Seller Full Contact</u></strong><br/>
                                    <strong>Address</strong><br/>
                                    <%#Eval("Values")("Seller_Address")%><br>
                                    <%#Eval("Values")("Seller_City")%>, <%#Eval("Values")("Seller_State")%>
                                  </address>
                                  <address>
                                    <strong>Phone</strong><br/>
                                    <%#Eval("Values")("Seller_Phone")%>
                                  </address>
                                  <address>
                                    <strong>Email</strong><br/>
                                    <%#Eval("Values")("Seller_Email")%>
                                  </address>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="container">
                              <div class="row">
                                <div class="col-md-3">
                                  <strong>Created By:</strong> <%#Eval("Values")("CreatedBy")%><br />
                                  <strong>Created Username:</strong> <%#Eval("Values")("CreatedByUsername")%><br />
                                  <strong>Created IP:</strong> <%#Eval("Values")("Created_IP")%><br />
                                  <strong>Last Updated By:</strong> <%#Eval("Values")("UpdatedBy")%><br />
                                  <strong>Last Updated Username:</strong> <%#Eval("Values")("UpdatedByUsername")%><br />
                                  <strong>Last Updated IP:</strong> <%#Eval("Values")("Updated_IP")%><br />
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-md-3">
                                  <h4 class="text-center table-bordered">Ad Controls</h4>
                                  <strong>Expires:</strong> <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /><br /> 
                                  <strong>Active:</strong> <%#Eval("Values")("Active")%><br />
                                  <strong>Approved:</strong> <%#Eval("Values")("Approved")%><br />
                                  <strong>ShowAddress:</strong> <%#Eval("Values")("ShowAddress")%><br />
                                  <strong>ShowPhone:</strong> <%#Eval("Values")("ShowPhone")%><br />
                                  <strong>ShowEmail:</strong> <%#Eval("Values")("ShowEmail")%><br />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                
            </Case> 
          </xmod:Select>
                          
          <xmod:CommandLink runat="server" Text="Return" CssClass="btn btn-md btn-primary">
            <Command Type="list" />
          </xmod:CommandLink>              
          
        </DetailTemplate>

</xmod:Template></xmod:masterview>