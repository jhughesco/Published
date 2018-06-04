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

    .approved-False, .approved-alt-False {
      background-color: #fee2e2 !important;
    }
    
    .approved-True {
      background-color: #fff !important;
    }
    
    .approved-alt-True {
      background-color: #e8e8e8 !important;
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
    
    .red hr {
      height: 2px;
      background-color:#FF0000;
      width: 75%;
    }
    
    .grn hr {
      height: 2px;
      background-color:#33CC33;
      width: 75%;
    }
    
    .width_adj {
      width: 75%; 
    }
    
    .summary-wrapper { margin-top:50px; }
    .summary-wrapper .title-wrapper { text-align:center; }
    .summary-wrapper .title-wrapper h1 { margin: 0px; }
    .summary-wrapper .title-wrapper h2 { margin: 0px; }
    .summary-wrapper .title-wrapper h3 { margin: 0px; }
    .summary-wrapper .title-wrapper h4 { margin: 0px; }
    .summary-wrapper .title-wrapper h5 { margin: 0px; }
    .summary-wrapper .image-wrapper { text-align:center; margin-top: 20px; }
    .summary-wrapper .price-wrapper { text-align:center; font-size: 20px; color:darkgreen; }
    .summary-wrapper .contact-wrapper { text-align:center; margin-top: 10px; font-size: 16px; color: #555; }
    .summary-wrapper .adsummary-wrapper { max-width: 600px; margin: 20px auto; }
    .summary-wrapper .adsummary-wrapper p { font-size:16px; }
    .summary-wrapper .adinfo-wrapper { max-width: 600px; margin: 15px auto; }
    .summary-wrapper .adinfo-wrapper ul { margin-left: 0px !important; }
    .summary-wrapper .addetails-wrapper p { font-size:16px; }
    .summary-wrapper .seller-wrapper { margin-top: 50px; }
    .seller_address { margin-left: 10px; }
    .addetails_cards { padding: 5px; border: 2px solid #505050; }
    
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
                      <xmod:Redirect runat="server"  CssClass="btn btn-xs btn-info" Display="LinkButton" Method="Post" Target="~/Classifieds-Admin/Sellers/Seller-Details" Text='<%#Eval("Values")("SellerUsername")%>'>
												<Field Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                      </xmod:Redirect>
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
                <td>
                  <xmod:Select runat="server" Mode="Standard">
                    <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("IsSold")%>'>
                      <xmod:CommandLink runat="server" Text="True" CssClass="btn btn-xs btn-success">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="issold" DataType="string" />
                        </Command>
                      </xmod:CommandLink>    	
                    </Case>
                    <Else>
                      <xmod:CommandLink runat="server" Text="False" CssClass="btn btn-xs btn-danger">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="issold" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                    </Else>
                  </xmod:Select>
              </td>
                <td>
                    <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></td>
                <td>
									<xmod:Select runat="server" Mode="Standard">
                    <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("Approved")%>'>
                      <xmod:CommandLink runat="server" Text="True" CssClass="btn btn-xs btn-success">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="approved" DataType="string" />
                        </Command>
                      </xmod:CommandLink>    	
                    </Case>
                    <Else>
                      <xmod:CommandLink runat="server" Text="False" CssClass="btn btn-xs btn-danger">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="approved" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                    </Else>
                  </xmod:Select>
              	</td>
                <td>
              		<xmod:Select runat="server" Mode="Standard">
                    <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("Active")%>'>
                      <xmod:CommandLink runat="server" Text="True" CssClass="btn btn-xs btn-success">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="active" DataType="string" />
                        </Command>
                      </xmod:CommandLink>    	
                    </Case>
                    <Else>
                      <xmod:CommandLink runat="server" Text="False" CssClass="btn btn-xs btn-danger">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="active" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                    </Else>
                  </xmod:Select>
              	</td>

                <td>
                    <div class="btn-group" role="group" id="AdRow">
                        <xmod:EditLink runat="server" Text="Edit" CssClass="btn btn-xs btn-success">
                          <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
                        </xmod:EditLink>
                    </div>
                  	<div class="btn-group" role="group" id="AdRow">
                        <xmod:CommandLink runat="server" Text="Delete" CssClass="btn btn-xs btn-danger unradius" OnClientClick="return confirm('Are you sure, this is Permanent!?');">
                          <Command Name="DeleteAd" Type="Custom">
                            <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default btn-xs nowrap">More</button>
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="caret"></span>
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu unradius" role="group">
                          <xmod:Select runat="server" Mode="Standard">
                            <Case CompareType="Role" Operator="=" Expression="Administrators">
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
                                <xmod:CommandLink runat="server" Text="Delete" CssClass="btn btn-xs btn-danger unradius" OnClientClick="return confirm('Are you sure, this is Permanent!?');">
                                  <Command Name="DeleteAd" Type="Custom">
                                    <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                                  </Command>
                                </xmod:CommandLink>
                              </li>
                            </Case>
                        </xmod:Select>
                      </ul>
                    </div>
                </td>
            </tr>
        </ItemTemplate>

        <AlternatingItemTemplate>
            <tr class="alt-row approved-alt-<%#Eval("Values")("Approved")%>">
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
                      <xmod:Redirect runat="server"  CssClass="btn btn-xs btn-info" Display="LinkButton" Target="~/Classifieds-Admin/Sellers/Seller-Details" Text='<%#Eval("Values")("SellerUsername")%>'>
												<Field Name="SellerID" Value='<%#Eval("Values")("SellerID")%>' />
                      </xmod:Redirect>
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
                <td>
                  <xmod:Select runat="server" Mode="Standard">
                    <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("IsSold")%>'>
                      <xmod:CommandLink runat="server" Text="True" CssClass="btn btn-xs btn-success">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="issold" DataType="string" />
                        </Command>
                      </xmod:CommandLink>    	
                    </Case>
                    <Else>
                      <xmod:CommandLink runat="server" Text="False" CssClass="btn btn-xs btn-danger">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="issold" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                    </Else>
                  </xmod:Select>
              </td>
                <td>
                    <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></td>
                <td>
									<xmod:Select runat="server" Mode="Standard">
                    <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("Approved")%>'>
                      <xmod:CommandLink runat="server" Text="True" CssClass="btn btn-xs btn-success">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="approved" DataType="string" />
                        </Command>
                      </xmod:CommandLink>    	
                    </Case>
                    <Else>
                      <xmod:CommandLink runat="server" Text="False" CssClass="btn btn-xs btn-danger">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="approved" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                    </Else>
                  </xmod:Select>
              	</td>
                <td>
              		<xmod:Select runat="server" Mode="Standard">
                    <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("Active")%>'>
                      <xmod:CommandLink runat="server" Text="True" CssClass="btn btn-xs btn-success">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="active" DataType="string" />
                        </Command>
                      </xmod:CommandLink>    	
                    </Case>
                    <Else>
                      <xmod:CommandLink runat="server" Text="False" CssClass="btn btn-xs btn-danger">
                        <Command Name="FlagToggle" Type="Custom">
                          <Parameter Name="ID1" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          <Parameter Name="ID2" Value='<%#UserData("ID")%>' DataType="Int32" />
                          <Parameter Name="FlagType" Value="active" DataType="string" />
                        </Command>
                      </xmod:CommandLink>
                    </Else>
                  </xmod:Select>
              	</td>

                <td>
                    <div class="btn-group" role="group" id="AdRow">
                        <xmod:EditLink runat="server" Text="Edit" CssClass="btn btn-xs btn-success">
                          <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' />
                        </xmod:EditLink>
                    </div>
                  	<div class="btn-group" role="group" id="AdRow">
                        <xmod:CommandLink runat="server" Text="Delete" CssClass="btn btn-xs btn-danger unradius" OnClientClick="return confirm('Are you sure, this is Permanent!?');">
                          <Command Name="DeleteAd" Type="Custom">
                            <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                          </Command>
                        </xmod:CommandLink>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default btn-xs nowrap">More</button>
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="caret"></span>
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu unradius" role="group">
                          <xmod:Select runat="server" Mode="Standard">
                            <Case CompareType="Role" Operator="=" Expression="Administrators">
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
                                <xmod:CommandLink runat="server" Text="Delete" CssClass="btn btn-xs btn-danger unradius" OnClientClick="return confirm('Are you sure, this is Permanent!?');">
                                  <Command Name="DeleteAd" Type="Custom">
                                    <Parameter Name="AdID" Value='<%#Eval("Values")("AdID")%>' DataType="Int32" />
                                  </Command>
                                </xmod:CommandLink>
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
          
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" id="myTab" role="tablist" style="margin-left: 0px; margin-top: 10px;">
            <li class="nav-item active">
              <a class="nav-link active" id="summary-tab" data-toggle="tab" href="#summary" role="tab" aria-controls="summary" aria-selected="true">Summary</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="details-tab" data-toggle="tab" href="#details" role="tab" aria-controls="details" aria-selected="false">Details</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="seller-tab" data-toggle="tab" href="#seller" role="tab" aria-controls="seller" aria-selected="false">Seller</a>
            </li>
            <xmod:Select runat="server" Mode="Standard">
              <Case CompareType="Role" Operator="=" Expression="Administrators">
                <li class="nav-item">
                  <a class="nav-link" id="admin-tab" data-toggle="tab" href="#admin" role="tab" aria-controls="admin" aria-selected="false">Ad Details</a>
                </li>
              </Case>
            </xmod:Select>
          </ul>

          <!-- Tab panes -->
          <div class="tab-content">
            <div class="tab-pane active" id="summary" role="tabpanel" aria-labelledby="summary-tab">
            	<div class="containter summary-wrapper">
                
                <div class="row title-wrapper">
                  <div class="col col-md-auto">
                      <h1 class="media-heading"><%#Eval("Values")("Ad_Title")%></h1>
                      <h3 class="media-heading"><%#Eval("Values")("Ad_Subtitle")%></h3>
                      <h5 class="media-heading price-wrapper">Price: <strong><%#Eval("Values")("Ad_Price")%></strong></h5>
                  </div>
                </div>
                
                <div class="row contact-wrapper">
                  <div class="col col-md-auto">
                    <address>
                      <xmod:Select runat="server"  Mode="Inclusive">
                        <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowPhone")%>'>
                            <strong>Phone: </strong><%#Eval("Values")("Seller_Phone")%><br />
                        </Case>
                        <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowEmail")%>'>
                            <strong>Email: </strong><a href="mailto:'<%#Eval("Values")("Seller_Email")%>'" target="_blank"> <%#Eval("Values")("Seller_Email")%> </a>
                        </Case>
                      </xmod:Select>
                    </address>
                  </div>
                </div>
                
                <div class="row image-wrapper">
                  <div class="col col-md-auto" href="#">
                    <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
                      <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/Ads/<%#Eval("Values")("SellerID")%>/<%#Eval("Values")("PrimaryImage")%>" alt="<%#Eval("Values")("PrimaryImage")%>">
                    </xmod:IfNotEmpty>
                    <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("PrimaryImage")%>'>
                      <img class="img-thumbnail" src="http://placehold.it/300&text=no+image" alt="NoSellerImage">
                    </xmod:IfEmpty>
                  </div>
                </div>

                <div class="row adsummary-wrapper">
                  
                  <div class="panel panel-default">
                  	<div class="panel-heading"><p><%#Eval("Values")("Ad_Summary")%></p></div>
                	</div>
                </div>
                
                <div class="row adinfo-wrapper">
                  <ul class="list-group">
                    <li class="list-group-item"><strong>Posted:</strong> <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Updated")%>' Pattern="MM/dd/yyyy" /></li>
                    <li class="list-group-item"><strong>Expires:</strong> <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></li>
                    
                    <xmod:Select runat="server"  Mode="Inclusive">
                      <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowAddress")%>'>
                        <li class="list-group-item"><strong>Address:</strong>
                          <address>
                            <%#Eval("Values")("Seller_Address")%><br>
                            <%#Eval("Values")("Seller_City")%>, <%#Eval("Values")("Seller_State")%>
                          </address>    
                        </li>
                      </Case>
                    </xmod:Select>
                    
                  </ul>
                </div>
            	</div>
            </div>
            
            <div class="tab-pane" id="details" role="tabpanel" aria-labelledby="details-tab">
              
              <div class="containter summary-wrapper">
                
                <div class="row title-wrapper">
                  <div class="col col-md-auto">
                      <h1 class="media-heading"><%#Eval("Values")("Ad_Title")%></h1>
                      <h3 class="media-heading"><%#Eval("Values")("Ad_Subtitle")%></h3>
                      <h5 class="media-heading price-wrapper">Price: <strong><%#Eval("Values")("Ad_Price")%></strong></h5>
                  </div>
                </div>
                
                <div class="row contact-wrapper">
                  <div class="col col-md-auto">
                    <address>
                      <xmod:Select runat="server"  Mode="Inclusive">
                        <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowPhone")%>'>
                            <strong>Phone: </strong><%#Eval("Values")("Seller_Phone")%><br />
                        </Case>
                        <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowEmail")%>'>
                            <strong>Email: </strong><a href="mailto:'<%#Eval("Values")("Seller_Email")%>'" target="_blank"> <%#Eval("Values")("Seller_Email")%> </a>
                        </Case>
                      </xmod:Select>
                    </address>
                  </div>
                </div>
                
                <div class="row addetails-wrapper">
                  <div class="panel panel-default">
                  	<div class="panel-body"><p><%#Eval("Values")("Ad_Description")%></p></div>
                	</div>
                </div>
                
                <div class="row adinfo-wrapper">
                  <ul class="list-group">
                    <li class="list-group-item"><strong>Posted:</strong> <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Date_Updated")%>' Pattern="MM/dd/yyyy" /></li>
                    <li class="list-group-item"><strong>Expires:</strong> <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /></li>
                    
                    <xmod:Select runat="server"  Mode="Inclusive">
                      <Case CompareType="Boolean" Value="True" Operator="=" Expression='<%#Eval("Values")("ShowAddress")%>'>
                        <li class="list-group-item"><strong>Address:</strong>
                          <address>
                            <%#Eval("Values")("Seller_Address")%><br>
                            <%#Eval("Values")("Seller_City")%>, <%#Eval("Values")("Seller_State")%>
                          </address>    
                        </li>
                      </Case>
                    </xmod:Select>
                    
                  </ul>
                </div>
            	</div>
            </div>
     
            
            <div class="tab-pane" id="seller" role="tabpanel" aria-labelledby="seller-tab">
              <div class="containter summary-wrapper">
                <div class="media seller-wrapper">
                  <a class="media-left" href="#">
                    <xmod:IfNotEmpty runat="server" Value='<%#Eval("Values")("Seller_Image")%>'>
                      <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/SellerImages/thm_<%#Eval("Values")("Seller_Image")%>" style="max-width: 100px" alt="<%#Eval("Values")("Seller_Name")%>">
                    </xmod:IfNotEmpty>
                    <xmod:IfEmpty runat="server" Value='<%#Eval("Values")("Seller_Image")%>'>
                      <img class="img-thumbnail" src="/Portals/<%#PortalData("ID")%>/Classifieds/SellerImages/NoImage_Turtle.png" style="max-width: 100px" alt="NoSellerImage">
                    </xmod:IfEmpty>
                  </a>
                  <div class="media-body">
                    <h4 class="media-heading"><%#Eval("Values")("Seller_Name")%></h4>
                    <h5>SellerID: <%#Eval("Values")("SellerID")%></h5>
                    <h5>UserID: <%#Eval("Values")("SellerUsername")%> (<%#Eval("Values")("UserID")%>)</h5>
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
                      <td><%#Eval("Values")("Location")%> (<%#Eval("Values")("Seller_Location")%>)</td>
                      <td><%#Eval("Values")("Seller_Phone")%></td>
                      <td><%#Eval("Values")("Seller_Email")%></td>
                      <td><%#Eval("Values")("Show_Address_By_Default")%></td>
                      <td><%#Eval("Values")("Show_Phone_By_Default")%></td>
                      <td><%#Eval("Values")("Date_Created")%></td>
                      <td><%#Eval("Values")("Date_Updated")%></td>
                      <td><%#Eval("Values")("UpdatedByUsername")%> (<%#Eval("Values")("UpdatedBy")%>)</td>
                      <td><%#Eval("Values")("Banned")%></td>
                      <td><%#Eval("Values")("IsDeleted")%></td>         
                    </tr>
                  </tbody>

                </table>
							</div>
            </div>
            
            <xmod:Select runat="server" Mode="Standard">
                <Case CompareType="Role" Operator="=" Expression="Administrators">
                  <div class="tab-pane" id="admin" role="tabpanel" aria-labelledby="admin-tab">
                    <div class="container summary-wrapper">
                      <div class="row">
                          <div class="col-md-3 addetails_cards">
                            <strong>AdID:</strong> <%#Eval("Values")("AdID")%><br />
                            <strong>SellerID:</strong> <%#Eval("Values")("SellerID")%><br />
                            <strong>Seller Level:</strong> <%#Eval("Values")("Level_Name")%><br />
                            <address>
                              <strong><u>Seller Full Contact</u></strong><br/>
                              <strong>Address</strong><br/>
                              <div class="seller_address">
                                <%#Eval("Values")("Seller_Address")%><br>
                                <%#Eval("Values")("Seller_City")%>, <%#Eval("Values")("Seller_State")%><br />
                              </div>
                              <strong>Phone</strong><br/>
                              <div class="seller_address">
                                <%#Eval("Values")("Seller_Phone")%><br />
                              </div>
                              <strong>Email</strong><br/>
                              <div class="seller_address">
                                <%#Eval("Values")("Seller_Email")%>
                              </div>
                            </address>
                          </div>
                          <div class="col-md-3 addetails_cards">
                            <strong>Created By:</strong> <%#Eval("Values")("CreatedBy")%><br />
                            <strong>Created Username:</strong> <%#Eval("Values")("CreatedByUsername")%><br />
                            <strong>Created IP:</strong> <%#Eval("Values")("Created_IP")%><br />
                            <strong>Last Updated By:</strong> <%#Eval("Values")("UpdatedBy")%><br />
                            <strong>Last Updated Username:</strong> <%#Eval("Values")("UpdatedByUsername")%><br />
                            <strong>Last Updated IP:</strong> <%#Eval("Values")("Updated_IP")%><br />
                            <strong>Expires:</strong> <xmod:Format runat="server" Type="Date" Value='<%#Eval("Values")("Ad_Expires")%>' Pattern="MM/dd/yyyy" /><br /> 
                          </div>
                        </div>
                    </div>
                  </div>
              </Case> 
            </xmod:Select>
          </div>
          
          
          <xmod:CommandLink runat="server" CssClass="btn btn-default" Text="&lt;&lt; Go Back">
            <Command Type="list" />
          </xmod:CommandLink>              
          
        </DetailTemplate>

</xmod:Template></xmod:masterview>