<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.FormBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls.Form" TagPrefix="xmod" %>
<%@ Register tagprefix="rmg" namespace="reflect.xile" assembly="reflect.xile" %>
<xmod:FormView runat="server"><AddItemTemplate><xmod:AddForm runat="server">

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
    </style>  
  </ScriptBlock> 
  
  <SelectCommand CommandText="SELECT 1 AS Show_Address_By_Default, 1 AS Show_Phone_By_Default" />

  <SubmitCommand CommandText="INSERT INTO [XMP_Classified_Seller] ([UserID], [Seller_Name], [Seller_Address], [Seller_Location], [Seller_Phone], [Seller_Email], [Show_Address_By_Default], [Show_Phone_By_Default], [Seller_Image], [Seller_Level], [Agree], [Banned]) VALUES(@UserID, @Seller_Name, @Seller_Address, @Seller_Location, @Seller_Phone, @Seller_Email, @Show_Address_By_Default, @Show_Phone_By_Default, @Seller_Image, @Seller_Level, @Agree, @Banned) " />
  
  <ControlDataSource Id="cds_Users" CommandText="SELECT [UserID], [Username] FROM [Users] u WHERE u.IsSuperUser = 0 AND NOT EXISTS ( SELECT * FROM XMP_Classified_Seller WHERE UserID = u.UserID ) ORDER BY [Username] ASC" />
  
  <ControlDataSource Id="cds_Locations" CommandText="SELECT [LocationID], [City] + ', ' + [State] AS CityState FROM [XMP_Classified_Location] ORDER BY [City] ASC" />
  
  <ControlDataSource Id="cds_Levels" CommandText="SELECT [LevelID], [Level_Name] FROM [XMP_Classified_Level] ORDER BY [LevelID] ASC" />
  
  <div class="form-horizontal">
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="UserID">Select User</Label>
      <div class="col-sm-10">
        <DropDownList Id="UserID" CssClass="form-control required-field" DataField="UserID" DataSourceId="cds_Users" DataTextField="Username" DataValueField="UserID" AppendDataBoundItems="true" DataType="int32">
          <ListItem Value="">- Please Select -</ListItem>
        </DropDownList>
      	<Validate Target="UserID" CssClass="validate-error" Type="required" Text="*" Message="User is required." />
      </div>      
    </div>
    
   
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Name">Seller Name</Label>
      <div class="col-sm-10">
        <TextBox Id="Seller_Name" CssClass="form-control required-field" MaxLength="150" DataField="Seller_Name" DataType="string" />
        <Validate Target="Seller_Name" CssClass="validate-error" Type="required" Text="*" Message="Name is required." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Address">Seller Address</Label>
      <div class="col-sm-10">
        <TextBox Id="Seller_Address" CssClass="form-control required-field" MaxLength="150" DataField="Seller_Address" DataType="string" />
        <Validate Target="Seller_Address" CssClass="validate-error" Type="required" Text="*" Message="Address is required." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Location">Location</Label>
      <div class="col-sm-10">
        <DropDownList Id="Seller_Location" CssClass="form-control" Nullable="true" DataField="Seller_Location" DataSourceId="cds_Locations" DataTextField="CityState" DataValueField="LocationID" AppendDataBoundItems="true" DataType="int32">
          <ListItem Value="">- Please Select -</ListItem>
        </DropDownList>
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Phone">Seller Phone</Label>
      <div class="col-sm-10">
        <TextBox Id="Seller_Phone" CssClass="form-control required-field" MaxLength="50" DataField="Seller_Phone" DataType="string" />
        <Validate Target="Seller_Phone" CssClass="validate-error" Type="required" Text="*" Message="Phone is required." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Email">Seller Email</Label>
      <div class="col-sm-10">
        <TextBox Id="Seller_Email" Value='<%#UserData("Email")%>' CssClass="form-control required-field" MaxLength="100" DataField="Seller_Email" DataType="string" />
        <Validate Target="Seller_Email" CssClass="validate-error" Type="required" Text="*" Message="Email is required." />
        <Validate Target="Seller_Email" CssClass="validate-error" Type="email" Text="*" Message="Email is invalid." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Show_Address_By_Default">&nbsp;</Label>
      <div class="col-sm-10">
        <CheckBox Id="Show_Address_By_Default" DataField="Show_Address_By_Default" DataType="boolean" /> Show Address by Default
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Show_Phone_By_Default">&nbsp;</Label>
      <div class="col-sm-10">
        <CheckBox Id="Show_Phone_By_Default" DataField="Show_Phone_By_Default" DataType="boolean" /> Show Phone by Default
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Image">Seller Image</Label>
      <div class="col-sm-10">
        <rmg:Xile runat="server" 
          Id="Seller_Image" 
          Nullable="True" 
          DataField="Seller_Image" 
          Dropzone="False"
          AcceptFileTypes="jpg,jpeg,png"
          MaxNumberOfFiles="1"
          MaxFileSize="2097152"
          AutoUpload="True"
          AutoCreateFolder="True"
          FileUploadPath='<%#Join("~/Portals/{0}/Classifieds/SellerImages/", PortalData("ID"))%>'
          ResizeVersions="width=800;height=600;mode=max, sm_:width=400;height=400;mode=max, thm_:width=80;height=80;mode=max"
          UniqueFileName="True"
          UploadMode="Single"
          AddFilesButtonText="Add Image"
          WrapperClass="rmg-singleupload"
          ShowTopCancelButton="False"
          ShowTopCheckBox="False"
          ShowTopProgressBar="False"
          ShowTopDeleteButton="False">
        </rmg:Xile>        
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Level">Level</Label>
      <div class="col-sm-10">
        <DropDownList Id="Seller_Level" CssClass="form-control required-field" DataField="Seller_Level" DataSourceId="cds_Levels" DataTextField="Level_Name" DataValueField="LevelID" AppendDataBoundItems="true" DataType="int32">
          <ListItem Value="">- Please Select -</ListItem>
        </DropDownList>
        <Validate Target="Seller_Level" CssClass="validate-error" Type="required" Text="*" Message="Level is required." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Agree">&nbsp;</Label>
      <div class="col-sm-10">
        <CheckBox Id="Agree" DataField="Agree" DataType="boolean" /> I Agree to the Terms and Conditions
        <Validate Type="checkbox" CssClass="validate-error" Target="Agree" Text="*" Message="You must agree to the terms and conditions." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Banned">&nbsp;</Label>
      <div class="col-sm-10">
        <CheckBox Id="Banned" DataField="Banned" DataType="boolean" /> Banned
      </div>      
    </div>
    
    <ValidationSummary CssClass="col-sm-offset-2 col-sm-10 alert alert-info" Id="vsXMP_Classified_Seller" />
    
    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-10">
        <AddButton CssClass="btn btn-primary" Text="Create Seller" />  
        <CancelButton CssClass="btn btn-default" Text="Cancel" Visible="true" />
      </div>
    </div>
    
  </div>
</xmod:AddForm></AddItemTemplate>

<EditItemTemplate><xmod:EditForm runat="server">

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
    </style>  
  </ScriptBlock>


  <SelectCommand CommandText="SELECT 'Hello' AS Hello, [UserID], @CurrentUser AS [UpdatedBy], [Seller_Name], [Seller_Address], [Seller_Location], [Seller_Phone], [Seller_Email], [Show_Address_By_Default], [Show_Phone_By_Default], [Seller_Image], [Seller_Level], [Agree], [Banned], [SellerID] FROM XMP_Classified_Seller WHERE [SellerID]=@SellerID">
    <Parameter Name="CurrentUser" Value='<%#UserData("ID")%>' DataType="int32" />    
  </SelectCommand>

  <SubmitCommand CommandText="UPDATE [XMP_Classified_Seller] SET [UserID]=@UserID, [UpdatedBy]=@UpdatedBy, [Date_Updated]=getdate(), [Seller_Name]=@Seller_Name, [Seller_Address]=@Seller_Address, [Seller_Location]=@Seller_Location, [Seller_Phone]=@Seller_Phone, [Seller_Email]=@Seller_Email, [Show_Address_By_Default]=@Show_Address_By_Default, [Show_Phone_By_Default]=@Show_Phone_By_Default, [Seller_Image]=@Seller_Image, [Seller_Level]=@Seller_Level, [Agree]=@Agree, [Banned]=@Banned WHERE [SellerID]=@SellerID" />
  
  <ControlDataSource Id="cds_Users" CommandText="SELECT [UserID], [Username] FROM [Users] u WHERE u.IsSuperUser = 0 AND NOT EXISTS ( SELECT * FROM XMP_Classified_Seller WHERE UserID = u.UserID ) OR u.UserID = @UserAccount ORDER BY [Username] ASC">
    <Parameter Name="UserAccount" Value='<%#SelectData("UserID")%>' DataType="int32" />
  </ControlDataSource>
  
  <ControlDataSource Id="cds_Locations" CommandText="SELECT [LocationID], [City] + ', ' + [State] AS CityState FROM [XMP_Classified_Location] ORDER BY [City] ASC" />
  
  <ControlDataSource Id="cds_Levels" CommandText="SELECT [LevelID], [Level_Name] FROM [XMP_Classified_Level] ORDER BY [LevelID] ASC" />
  
  
  <div class="form-horizontal">
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="UserID">Select User</Label>
      <div class="col-sm-10">
        <DropDownList Id="UserID" CssClass="form-control required-field" DataField="UserID" DataSourceId="cds_Users" DataTextField="Username" DataValueField="UserID" AppendDataBoundItems="true" DataType="int32">
          <ListItem Value="">- Please Select -</ListItem>
        </DropDownList>
      	<Validate Target="UserID" CssClass="validate-error" Type="required" Text="*" Message="User is required." />
      </div>      
    </div>
     
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Name">Seller Name</Label>
      <div class="col-sm-10">
        <TextBox Id="Seller_Name" CssClass="form-control required-field" MaxLength="150" DataField="Seller_Name" DataType="string" />
        <Validate Target="Seller_Name" CssClass="validate-error" Type="required" Text="*" Message="Name is required." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Address">Seller Address</Label>
      <div class="col-sm-10">
        <TextBox Id="Seller_Address" CssClass="form-control required-field" MaxLength="150" DataField="Seller_Address" DataType="string" />
        <Validate Target="Seller_Address" CssClass="validate-error" Type="required" Text="*" Message="Address is required." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Location">Location</Label>
      <div class="col-sm-10">
        <DropDownList Id="Seller_Location" CssClass="form-control" Nullable="true" DataField="Seller_Location" DataSourceId="cds_Locations" DataTextField="CityState" DataValueField="LocationID" AppendDataBoundItems="true" DataType="int32">
          <ListItem Value="">- Please Select -</ListItem>
        </DropDownList>
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Phone">Seller Phone</Label>
      <div class="col-sm-10">
        <TextBox Id="Seller_Phone" CssClass="form-control required-field" MaxLength="50" DataField="Seller_Phone" DataType="string" />
        <Validate Target="Seller_Phone" CssClass="validate-error" Type="required" Text="*" Message="Phone is required." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Email">Seller Email</Label>
      <div class="col-sm-10">
        <TextBox Id="Seller_Email" Value='<%#UserData("Email")%>' CssClass="form-control required-field" MaxLength="100" DataField="Seller_Email" DataType="string" />
        <Validate Target="Seller_Email" CssClass="validate-error" Type="required" Text="*" Message="Email is required." />
        <Validate Target="Seller_Email" CssClass="validate-error" Type="email" Text="*" Message="Email is invalid." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Show_Address_By_Default">&nbsp;</Label>
      <div class="col-sm-10">
        <CheckBox Id="Show_Address_By_Default" DataField="Show_Address_By_Default" DataType="boolean" /> Show Address by Default
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Show_Phone_By_Default">&nbsp;</Label>
      <div class="col-sm-10">
        <CheckBox Id="Show_Phone_By_Default" DataField="Show_Phone_By_Default" DataType="boolean" /> Show Phone by Default
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Image">Seller Image</Label>
      <div class="col-sm-10">
        <rmg:Xile runat="server" 
          Id="Seller_Image" 
          Nullable="True" 
          DataField="Seller_Image" 
          Dropzone="False"
          AcceptFileTypes="jpg,jpeg,png"
          MaxNumberOfFiles="1"
          MaxFileSize="2097152"
          AutoUpload="True"
          AutoCreateFolder="True"
          FileUploadPath='<%#Join("~/Portals/{0}/Classifieds/SellerImages/", PortalData("ID"))%>'
          ResizeVersions="width=800;height=600;mode=max, sm_:width=400;height=400;mode=max, thm_:width=80;height=80;mode=max"
          UniqueFileName="True"
          UploadMode="Single"
          AddFilesButtonText="Add Image"
          WrapperClass="rmg-singleupload"
          ShowTopCancelButton="False"
          ShowTopCheckBox="False"
          ShowTopProgressBar="False"
          ShowTopDeleteButton="False">
        </rmg:Xile>        
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Seller_Level">Level</Label>
      <div class="col-sm-10">
        <DropDownList Id="Seller_Level" CssClass="form-control required-field" DataField="Seller_Level" DataSourceId="cds_Levels" DataTextField="Level_Name" DataValueField="LevelID" AppendDataBoundItems="true" DataType="int32">
          <ListItem Value="">- Please Select -</ListItem>
        </DropDownList>
        <Validate Target="Seller_Level" CssClass="validate-error" Type="required" Text="*" Message="Level is required." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Agree">&nbsp;</Label>
      <div class="col-sm-10">
        <CheckBox Id="Agree" DataField="Agree" DataType="boolean" /> I Agree to the Terms and Conditions
        <Validate Type="checkbox" CssClass="validate-error" Target="Agree" Text="*" Message="You must agree to the terms and conditions." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Banned">&nbsp;</Label>
      <div class="col-sm-10">
        <CheckBox Id="Banned" DataField="Banned" DataType="boolean" /> Banned
      </div>      
    </div>
    
    <ValidationSummary CssClass="col-sm-offset-2 col-sm-10 alert alert-info" Id="vsXMP_Classified_Seller" />
    
    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-10">
        <UpdateButton CssClass="btn btn-primary" Text="Save Changes" />  
        <CancelButton CssClass="btn btn-default" Text="Cancel" Visible="true" />
      </div>
    </div>
    
  </div>
  
  <TextBox Visible="False" Id="SellerID" DataField="SellerID" DataType="int32" />
  <TextBox Id="UpdatedBy" Nullable="True" DataField="UpdatedBy" DataType="int32" Visible="False" />
</xmod:EditForm></EditItemTemplate>

</xmod:FormView>
