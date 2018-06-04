<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.FormBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls.Form" TagPrefix="xmod" %>
<%@ Register tagprefix="rmg" namespace="reflect.xile" assembly="reflect.xile" %>
<xmod:FormView runat="server"><AddItemTemplate><xmod:AddForm runat="server" Clientname="Ad">

    <ScriptBlock ScriptId="CustomCSS" BlockType="HeadScript" RegisterOnce="true">
        <style type="text/css">
            .validate-error {
                position: absolute;
                top: 0;
                left: 0;
                color: red;
            }

            .required-field {
                border-left: 1px solid red;
            }

            #Categories_Container {
                list-style-type: none;
                margin-left: 0px;
            }

            #Categories_Container ul {
                list-style-type: none;
                margin-left: 25px
            }

            li.children {
                display: none;
            }

            li.children.show {
                display: block;
            }
        </style>
    </ScriptBlock>

    <SelectCommand CommandText="SELECT @UserID AS CreatedBy, @UserIP AS Created_IP, 0 AS Approved, 1 AS Active, 0 AS ShowAddress, 0 AS ShowPhone, 0 AS ShowEmail">
        <Parameter name="UserID" value='<%#UserData("ID")%>' DataType="int32" />
        <Parameter name=UserIP value='<%#RequestData("HostAddress")%>' DataType="string" />
    </SelectCommand>

    <SubmitCommand CommandText="INSERT INTO [XMP_Classified_Ad] ([SellerID], [LocationID], [Ad_Title], [Ad_Subtitle], [Ad_Price], [PrimaryImage], [Ad_Summary], [Ad_Description], [CreatedBy], [Created_IP], [Approved], [Active], [ShowAddress], [ShowPhone], [ShowEmail]) VALUES(@SellerID, @LocationID, @Ad_Title, @Ad_Subtitle, @Ad_Price, @PrimaryImage, @Ad_Summary, @Ad_Description, @CreatedBy, @Created_IP, @Approved, @Active, @ShowAddress, @ShowPhone, @ShowEmail) "
    />

    <ControlDataSource Id="cds_Locations" CommandText="SELECT [LocationID], [City] + ', ' + [State] AS CityState FROM [XMP_Classified_Location] ORDER BY [City] ASC"
    />

    <ControlDataSource Id="cds_Categories" CommandText="
			SELECT *
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
      ORDER BY Categories.First_Level,Categories.Second_Level" />



    <div class="form-horizontal">
        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="LocationID">Location</Label>
            <div class="col-sm-10">
                <DropDownList Id="LocationID" CssClass="form-control required-field" Nullable="true" DataField="LocationID" DataSourceId="cds_Locations"
                    DataTextField="CityState" DataValueField="LocationID" AppendDataBoundItems="true" DataType="int32">
                    <ListItem Value="">- Select Location -</ListItem>
                </DropDownList>
                <Validate Target="LocationID" CssClass="validate-error" Type="required" Text="*" Message="Location is required." />
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="Ad_Title">Ad Title</Label>
            <div class="col-sm-10">
                <TextBox Id="Ad_Title" CssClass="form-control required-field" Nullable="true" MaxLength="150" DataField="Ad_Title" DataType="string"
                />
                <Validate Target="Ad_Title" CssClass="validate-error" Type="required" Text="*" Message="Ad Title is required." />
            </div>

        </div>
        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="Ad_Subtitle">Ad Subtitle</Label>
            <div class="col-sm-10">
                <TextBox Id="Ad_Subtitle" CssClass="form-control" Width="200" Nullable="true" MaxLength="150" DataField="Ad_Subtitle" DataType="string"
                />
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="Ad_Price">Ad Price</Label>
            <div class="col-sm-10">
                <TextBox Id="Ad_Price" CssClass="form-control" Nullable="True" DataField="Ad_Price" DataType="decimal" />
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="PrimaryImage">Primary Image</Label>
            <div class="col-sm-10">
                <rmg:Xile runat="server" Id="PrimaryImage" Nullable="True" DataField="PrimaryImage" Dropzone="False" AcceptFileTypes="jpg,jpeg,png" MaxNumberOfFiles="1"
                    MaxFileSize="2097152" AutoUpload="True" AutoCreateFolder="True" FileUploadPath='<%#Join("~/Portals/{0}/Classifieds/Ads/{1}/", PortalData("ID"), SelectData("SellerID"))%>'
                    ResizeVersions="width=800;height=600;mode=max, md_:width=400;height=400; sm_:width=200;height=200;mode=max;mode=max, thm_:width=80;height=80;mode=max"
                    UniqueFileName="True" UploadMode="Single" AddFilesButtonText="Add Image" WrapperClass="rmg-singleupload"
                    ShowTopCancelButton="False" ShowTopCheckBox="False" ShowTopProgressBar="False" ShowTopDeleteButton="False">
                </rmg:Xile>
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="AdditionalImages">Additional Images</Label>
            <div class="col-sm-10">
                <rmg:Xile runat="server" Id="AdditionalImages" Nullable="True" DataField="AdditionalImages" Dropzone="True" AcceptFileTypes="jpg,jpeg,png"
                    MaxNumberOfFiles="20" AutoUpload="True" AutoCreateFolder="True" ResizeVersions="width=800;height=600;mode=max, md_:width=400;height=400; sm_:width=200;height=200;mode=max;mode=max, thm_:width=80;height=80;mode=max"
                    FileUploadPath='<%#Join("~/Portals/{0}/Classifieds/Ads/{1}/", PortalData("ID"), SelectData("SellerID"))%>' UniqueFileName="True"
                    UploadMode="Multiple" AddFilesButtonText="Add Files...">
                </rmg:Xile>
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="Ad_summary">Summary</Label>
            <div class="col-sm-10">
                <TextArea Id="Ad_summary" CssClass="form-control" Nullable="true" DataField="Ad_Summary" DataType="string" />
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="Ad_Description">Ad Description</Label>
            <div class="col-sm-10">
                <TextArea Id="Ad_Description" CssClass="form-control" Height="200" Nullable="true" DataField="Ad_Description" DataType="string"
                />
            </div>
        </div>


        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="Categories">Categories</Label>
            <div class="col-sm-10">
                <ListBox Id="Categories" CssClass="form-control" Nullable="true" DataField="Categories" DataType="String" DataSourceId="cds_Categories"
                    DataTextField="Category_Name" DataValueField="CategoryID" AppendDataBoundItems="true" Rows="4" SelectionMode="Multiple"
                />
                <ul Id="Categories_Container">

                </ul>
            </div>
        </div>

        <script>
            $(document).ready(function () {
                let $select = $('#' + Ad.Categories).hide();
                let $container = $('#Categories_Container');
                let checkboxes = '';

                $select.children('option').each(function () {
                    let $option, val, text, textTrim, checkbox, isParent;
                    $option = $(this);
                    val = $option.val();
                    text = $option.text().trim();
                    textTrim = (text.indexOf('-') !== 0) ? text : text.substring(1);
                    isParent = (text.indexOf('-') !== 0) ? true : false;
                    checkbox = '<li class="parent-' + isParent + '"><input type="checkbox" value="' + val + '"' + ($option.is(":selected") ? "checked" : "") + '> <span>' + textTrim + '</span></li>';
                    checkboxes += checkbox;

                });

                $(checkboxes).appendTo($container);

                $container.children('.parent-false:not(.parent-false + .parent-false)').each(function () {
                    $(this).nextUntil('.parent-true').andSelf().wrapAll('<li class="children"><ul>');
                });

                $container.find('li.parent-true input:checked').parent('li').next('li.children').addClass('show');

                //Capture clicks
                $container.find('input').click(function () {
                    let $checkbox, val, checked;
                    $checkbox = $(this);
                    val = $checkbox.val();
                    checked = $checkbox.is(':checked');

                    // Sync with ListBox
                    $select.find('option[value="' + val + '"]').prop('selected', checked);

                    //Deal with the kids
                    if ($checkbox.parent().hasClass('parent-true')) {
                        $checkbox.parent().next('li.children').toggleClass('show');
                        if (checked === false) {
                            $checkbox.parent().next('li.children').find('input').each(function () {
                                let $child, childVal;
                                $child = $(this);
                                childVal = $(this).val();
                                $child.prop('checked', false);
                                $select.find('option[value="' + childVal + '"]').prop('selected', false);
                            });
                        }
                    }
                });

            });

        </script>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="Approved">&nbsp;</Label>
            <div class="col-sm-10">
                <CheckBox Id="Approved" Nullable="True" DataField="Approved" DataType="boolean" />
                <strong>Approved</strong>
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="Active">&nbsp;</Label>
            <div class="col-sm-10">
                <CheckBox Id="Active" Nullable="True" DataField="Active" DataType="boolean" />
                <strong>Active</strong>
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="ShowAddress">&nbsp;</Label>
            <div class="col-sm-10">
                <CheckBox Id="ShowAddress" Nullable="True" DataField="ShowAddress" DataType="boolean" />
                <strong>Show Address</strong>
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="ShowPhone">&nbsp;</Label>
            <div class="col-sm-10">
                <CheckBox Id="ShowPhone" Nullable="True" DataField="ShowPhone" DataType="boolean" />
                <strong>Show Phone</strong>
            </div>
        </div>

        <div class="form-group">
            <Label CssClass="col-sm-2 control-label" For="ShowEmail">&nbsp;</Label>
            <div class="col-sm-10">
                <CheckBox Id="ShowEmail" Nullable="True" DataField="ShowEmail" DataType="boolean" />
                <strong>Show Email</strong>
            </div>
        </div>

        <ValidationSummary CssClass="col-sm-offset-2 col-sm-10 alert alert-info" Id="vsXMP_Classified_Ad" />

        <div class="form-group">
            <Label class="col-sm-2 control-label">&nbsp;</Label>
            <div class="col-sm-10">
                <AddButton CssClass="btn btn-primary" Text="Post Ad" />
                <CancelButton CssClass="btn btn-default" Text="Cancel" />
            </div>

        </div>
    </div>


    <TextBox Id="SellerID" DataField="SellerID" DataType="int32" visible="false" />
    <TextBox Id="CreatedBy" DataField="CreatedBy" DataType="int32" visible="false" />
    <TextBox Id="Created_IP" Width="200" Nullable="True" MaxLength="50" DataField="Created_IP" DataType="string" visible="false"
    />

</xmod:AddForm></AddItemTemplate><EditItemTemplate><xmod:EditForm runat="server">
  <ScriptBlock BlockType="HeadScript" RegisterOnce="True" ScriptId="KBXM_Theme_none_Admin_Classified_Ads">
    <link rel="stylesheet" type="text/css" href="/DesktopModules/XModPro/styles/none" />
  </ScriptBlock>

  <ScriptBlock BlockType="HeadScript" RegisterOnce="True" ScriptId="KBXM_Style_Admin_Classified_Ads">
    <style type="text/css">
      .xmp-Admin_Classified_Ads { padding: 10px 5px 5px 5px; }
      .xmp-Admin_Classified_Ads .xmp-form-row { margin: 3px; padding: 3px; clear:left;}
      .xmp-Admin_Classified_Ads label.xmp-form-label, .xmp-Admin_Classified_Ads span.xmp-form-label{ display:block; float:left; width: 120px;text-align: left; margin-right: 5px; }
      .xmp-Admin_Classified_Ads .xmp-button { margin-right: 5px; }
    </style>
  </ScriptBlock>


  <SelectCommand CommandText="SELECT [SellerID], [LocationID], [Ad_Title], [Ad_Subtitle], [Ad_Price], [PrimaryImage], [Ad_Summary], [Ad_Description], [CreatedBy], [Created_IP], [Approved], [Active], [ShowAddress], [ShowPhone], [ShowEmail], [AdID] FROM XMP_Classified_Ad WHERE [AdID]=@AdID" />  <SubmitCommand CommandText="UPDATE [XMP_Classified_Ad] SET [SellerID]=@SellerID, [LocationID]=@LocationID, [Ad_Title]=@Ad_Title, [Ad_Subtitle]=@Ad_Subtitle, [Ad_Price]=@Ad_Price, [PrimaryImage]=@PrimaryImage, [Ad_Summary]=@Ad_Summary, [Ad_Description]=@Ad_Description, [CreatedBy]=@CreatedBy, [Created_IP]=@Created_IP, [Approved]=@Approved, [Active]=@Active, [ShowAddress]=@ShowAddress, [ShowPhone]=@ShowPhone, [ShowEmail]=@ShowEmail WHERE [AdID]=@AdID" /><ControlDataSource Id="cds_Locations" CommandText="SELECT [LocationID], [City], [State] FROM [XMP_Classified_Location] ORDER BY [LocationID] ASC"></ControlDataSource><div class="xmp-form xmp-Admin_Classified_Ads">
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="SellerID">Seller ID</Label><TextBox Id="SellerID" DataField="SellerID" DataType="int32"></TextBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="LocationID">Location</Label><DropDownList Id="LocationID" Nullable="true" DataField="LocationID" DataSourceId="cds_Locations" DataTextField="LocationID" DataValueField="LocationID" AppendDataBoundItems="true" DataType="int32"><ListItem Value="">- Select Location -</ListItem></DropDownList><Validate Target="LocationID" CssClass="xmp-validation" Type="required" Text="*" Message="Location is required."></Validate></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Ad_Title">Ad Title</Label><TextBox Id="Ad_Title" Nullable="true" MaxLength="150" DataField="Ad_Title" DataType="string"></TextBox><Validate Target="Ad_Title" CssClass="xmp-validation" Type="required" Text="*" Message="Ad Title is required."></Validate></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Ad_Subtitle">Ad Subtitle</Label><TextBox Id="Ad_Subtitle" Nullable="true" MaxLength="150" DataField="Ad_Subtitle" DataType="string"></TextBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Ad_Price">Ad Price</Label><TextBox Id="Ad_Price" Nullable="True" DataField="Ad_Price" DataType="decimal"></TextBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="PrimaryImage">Primary Image</Label><TextBox Id="PrimaryImage" Width="250" Nullable="True" MaxLength="150" DataField="PrimaryImage" DataType="string"></TextBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Ad_summary">Summary</Label><TextArea Id="Ad_summary" Nullable="true" DataField="Ad_Summary" DataType="string"></TextArea></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Ad_Description">Ad Description</Label><TextArea Id="Ad_Description" Height="200" Nullable="true" DataField="Ad_Description" DataType="string"></TextArea></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="CreatedBy">Created By</Label><TextBox Id="CreatedBy" DataField="CreatedBy" DataType="int32"></TextBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Created_IP">Created IP</Label><TextBox Id="Created_IP" Width="200" Nullable="True" MaxLength="50" DataField="Created_IP" DataType="string"></TextBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Approved">Approved</Label><CheckBox Id="Approved" Nullable="True" DataField="Approved" DataType="boolean"></CheckBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Active">Active</Label><CheckBox Id="Active" Nullable="True" DataField="Active" DataType="boolean"></CheckBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="ShowAddress">Show Address</Label><CheckBox Id="ShowAddress" Nullable="True" DataField="ShowAddress" DataType="boolean"></CheckBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="ShowPhone">Show Phone</Label><CheckBox Id="ShowPhone" Nullable="True" DataField="ShowPhone" DataType="boolean"></CheckBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="ShowEmail">Show Email</Label><CheckBox Id="ShowEmail" Nullable="True" DataField="ShowEmail" DataType="boolean"></CheckBox></div><ValidationSummary CssClass="xmp-validation" Id="vsXMP_Classified_Ad"></ValidationSummary><div class="xmp-form-row"><Label class="xmp-form-label">&nbsp;</Label><UpdateButton Text="Update"></UpdateButton><CancelButton Text="Cancel" style="margin-left: 12px;" Visible="true"></CancelButton></div>
  </div><TextBox Visible="False" Id="AdID" DataField="AdID"></TextBox></xmod:EditForm></EditItemTemplate>

</xmod:FormView>
