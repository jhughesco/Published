<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.FormBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls.Form" TagPrefix="xmod" %>
<%@ Register tagprefix="rmg" namespace="reflect.xile" assembly="reflect.xile" %>
<xmod:FormView runat="server"><AddItemTemplate><xmod:AddForm runat="server" AddRoles="All Users">

  <ScriptBlock BlockType="HeadScript" RegisterOnce="True" ScriptId="KBXM_Style_RMG_UploadDemo">
    <style type="text/css">
      .RMG_UploadDemo { padding: 10px 5px 5px 5px; }
      .RMG_UploadDemo .xmp-form-row { clear:left; margin-bottom: 15px;}
      .RMG_UploadDemo .xmp-form-row label { display: block; font-size: 16px; margin-bottom: 5px;}
      .RMG_UploadDemo .xmp-form-row input[type="text"] {
      	padding: 9px;
        margin-bottom: 20px;
        background: #f3f3f3;
        border: 1px solid #bfbfbf;
        -webkit-border-radius: 0px;
        border-radius: 0px;
        -webkit-box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.8), inset 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
        box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.8), inset 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
        color: #666;
        font-size: 13px;
        width: 300px;
        border-radius: 4px;
      }
      .RMG_UploadDemo .xmp-button { margin-right: 5px; }
      .rmg-singleupload {}
      .rmg-singleupload .fileupload-buttons { border: 0px;}
      .rmg-singleupload .rmg-filetable { border-top: 0px; }
    </style>
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
      
  </ScriptBlock>


  <SubmitCommand CommandText="INSERT INTO [RMG_Temp_FileUpload] ([Name], [PrimaryImage], [AdditionalImages]) VALUES(@Name, @PrimaryImage, @AdditionalImages) " />
  
  
  
  <div class="RMG_UploadDemo">
    
    <div class="instructions">
      <h1>
        Create A Product
      </h1>
      <h3>
        Xile Demo
      </h3>
      <p>
        The primary image will be uploaded to your current portal based on the portal and user ID. (Ie: /Portals/0/RMG_FileUploadTest/1/)<br/>
        The additional images will be uploaded the same as above, with one addition. (Ie: /Portals/0/RMG_FileUploadTest/1/Additional/)
      </p>
      
    </div>
    
    
    <div class="xmp-form-row">
      <Label For="Name">Product Name</Label>
      <TextBox Id="Name" Nullable="False" MaxLength="50" DataField="Name" DataType="string"></TextBox>
      <Validate Type="required" Target="Name" Text="Required" Message="Required" />

    </div>
    
    <div class="xmp-form-row">
      <Label For="PrimaryImage">Primary Image</Label>
      <rmg:Xile runat="server" 
        Id="PrimaryImage" 
        Nullable="False" 
        DataField="PrimaryImage" 
        Dropzone="False"
        AcceptFileTypes="jpg,jpeg,png"
        MaxNumberOfFiles="1"
        AutoUpload="True"
        AutoCreateFolder="True"
        FileUploadPath='<%#Join("~/Portals/{0}/RMG_FileUploadTest/{1}", PortalData("ID"), UserData("ID"))%>'
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
    
    <div class="xmp-form-row">
      <Label For="AdditionalImages">Additional Images</Label>
      <rmg:Xile runat="server" 
         Id="AdditionalImages" 
         Nullable="True" 
         DataField="AdditionalImages" 
         Dropzone="True"
         AcceptFileTypes="jpg,jpeg,png"
         MaxNumberOfFiles="20"
         AutoUpload="True"
         AutoCreateFolder="True"
         ResizeVersions="width=800;height=600;mode=max, sm_:width=400;height=400;mode=max, thm_:width=80;height=80;mode=max"
         FileUploadPath='<%#Join("~/Portals/{0}/RMG_FileUploadTest/{1}/Additional/", PortalData("ID"), UserData("ID"))%>'
         UniqueFileName="True"
         UploadMode="Multiple"
         AddFilesButtonText="Add Files...">
       </rmg:Xile>
    </div>
    
    
       
    
    
    <div class="xmp-form-row">
      
      <AddLink Class="dnnPrimaryAction btnPrimary primaryButton" Text="Create Product"></AddLink>
    </div>
  </div>
  
  

</xmod:AddForm></AddItemTemplate>

<EditItemTemplate><xmod:EditForm runat="server">

  <ScriptBlock BlockType="HeadScript" RegisterOnce="True" ScriptId="KBXM_Style_RMG_UploadDemo">
    <style type="text/css">
      .RMG_UploadDemo { padding: 10px 5px 5px 5px; }
      .RMG_UploadDemo .xmp-form-row { clear:left; margin-bottom: 15px;}
      .RMG_UploadDemo .xmp-form-row label { display: block; font-size: 16px; margin-bottom: 5px;}
      .RMG_UploadDemo .xmp-form-row input[type="text"] {
      	padding: 9px;
        margin-bottom: 20px;
        background: #f3f3f3;
        border: 1px solid #bfbfbf;
        -webkit-border-radius: 0px;
        border-radius: 0px;
        -webkit-box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.8), inset 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
        box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.8), inset 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
        color: #666;
        font-size: 13px;
        width: 300px;
        border-radius: 4px;
      }
      .RMG_UploadDemo .xmp-button { margin-right: 5px; }
      .rmg-singleupload {}
      .rmg-singleupload .fileupload-buttons { border: 0px;}
      .rmg-singleupload .rmg-filetable { border-top: 0px; }
    </style>
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
  </ScriptBlock>


  <SelectCommand CommandText="SELECT ProductID, Name, PrimaryImage, AdditionalImages FROM RMG_Temp_FileUpload WHERE ProductID = @ProductID" />
  <SubmitCommand CommandText="UPDATE RMG_Temp_FileUpload SET Name=@Name, PrimaryImage=@PrimaryImage, AdditionalImages=@AdditionalImages WHERE ProductID = @ProductID" />
  
  
  
  <div class="RMG_UploadDemo">
    
    <div class="instructions">
      <h1>
        Create A Product
      </h1>
      <h3>
        Xile Demo
      </h3>
      <p>
        The primary image will be uploaded to your current portal based on the portal and user ID. (Ie: /Portals/0/RMG_FileUploadTest/1/)<br/>
        The additional images will be uploaded the same as above, with one addition. (Ie: /Portals/0/RMG_FileUploadTest/1/Additional/)
      </p>
      
    </div>
    
    
    <div class="xmp-form-row">
      <Label For="Name">Product Name</Label>
      <TextBox Id="Name" Nullable="False" MaxLength="50" DataField="Name" DataType="string"></TextBox>
      <Validate Type="required" Target="Name" Text="Required" Message="Required" />

    </div>
    
    <div class="xmp-form-row">
      <Label For="PrimaryImage">Primary Image</Label>
      <rmg:Xile runat="server" 
        Id="PrimaryImage" 
        Nullable="False" 
        DataField="PrimaryImage" 
        Dropzone="False"
        AcceptFileTypes="jpg,jpeg,png"
        MaxNumberOfFiles="1"
        AutoUpload="True"
        AutoCreateFolder="True"
        FileUploadPath='<%#Join("~/Portals/{0}/RMG_FileUploadTest/{1}", PortalData("ID"), UserData("ID"))%>'
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
    
    <div class="xmp-form-row">
      <Label For="AdditionalImages">Additional Images</Label>
      <rmg:Xile runat="server" 
         Id="AdditionalImages" 
         Nullable="True" 
         DataField="AdditionalImages" 
         Dropzone="True"
         AcceptFileTypes="jpg,jpeg,png"
         MaxNumberOfFiles="20"
         AutoUpload="True"
         AutoCreateFolder="True"
         ResizeVersions="width=800;height=600;mode=max, sm_:width=400;height=400;mode=max, thm_:width=80;height=80;mode=max"
         FileUploadPath='<%#Join("~/Portals/{0}/RMG_FileUploadTest/{1}/Additional/", PortalData("ID"), UserData("ID"))%>'
         UniqueFileName="True"
         UploadMode="Multiple"
         AddFilesButtonText="Add Files...">
       </rmg:Xile>
  	</div>
    
    <div class="xmp-form-row">
      <UpdateButton CssClass="rmg-btn rmg-startupload-btn" Text="Update Product"></UpdateButton>
    </div>
  </div>

  <TextBox Id="ProductID" DataField="ProductID" DataType="Int32" Visible="False"></TextBox>
	
</xmod:EditForm></EditItemTemplate>

</xmod:FormView>
