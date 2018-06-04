<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.FormBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls.Form" TagPrefix="xmod" %>
<xmod:FormView runat="server"><AddItemTemplate><xmod:AddForm runat="server">

  <ScriptBlock ScriptId="CustomCSS" BlockType="HeadScript" RegisterOnce="true">
		<style type="text/css">
      .validate-error {
        position: absolute;
        top: 0;
        left: 0;
        color: red;
      }
      
      .validate-error-addon {
        left: -15px;        
      }
      
      .required-field {
      	border-left: 1px solid red; 
      }
    </style>  
  </ScriptBlock>

  <SubmitCommand CommandText="INSERT INTO [XMP_Classified_Level] ([Level_Name], [Level_Description], [Level_Price]) VALUES(@Level_Name, @Level_Description, @Level_Price) " />
  
  <div class="form-horizontal">
    <div class="form-group">
      <label for="Level_Name" CssClass="col-sm-2 control-label">Level Name</label>
      <div class="col-sm-10">
        <TextBox Id="Level_Name" CssClass="form-control required-field" Placeholder="Add level name..." MaxLength="20" DataField="Level_Name" DataType="string" />
        <Validate Target="Level_Name" CssClass="validate-error" Type="Required" Text="*" Message="Level Name is required" />
      </div>
    </div>
    
    <div class="form-group">
      <label for="Level_Description" CssClass="col-sm-2 control-label">Description</label>
      <div class="col-sm-10">
        <TextArea Id="Level_Description" CssClass="form-control" Nullable="true" DataField="Level_Description" DataType="string" />
      </div>
    </div>
    
    <div class="form-group">
      <label for="Level_Price" CssClass="col-sm-2 control-label">Price</label>
      <div class="col-sm-10">
        <div class="input-group">
          <div class="input-group-addon">$</div>
					<TextBox Id="Level_Price" cssClass="form-control" Width="150" Nullable="True" DataField="Level_Price" DataType="decimal" />
          <Validate Target="Level_Price" CssClass="validate-error validate-error-addon" Type="regex" Message="Please enter price only (1234.00)" Text="*" ValidationExpression="^\d{0,10}(\.\d{1,2})?$" />
        	<Validate Target="Level_Price" CssClass="validate-error validate-error-addon" Type="Required" Text="*" Message="Level Price is required" />
        </div>				
      </div>              
		</div>
    
    <ValidationSummary CssClass="col-sm-offset-2 col-sm-10 alert alert-info" Id="vsXMP_Classified_Level" />
    
    <div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<AddButton CssClass="btn btn-primary" Text="Add Level" />
        <CancelButton Text="Cancel" CssClass="btn btn-default" style="margin-left: 12px;" Visible="true" />
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
      
      .validate-error-addon {
        left: -15px;        
      }
      
      .required-field {
      	border-left: 1px solid red; 
      }
    </style>  
  </ScriptBlock>


  <SelectCommand CommandText="SELECT [Level_Name], [Level_Description], [Level_Price], [LevelID] FROM XMP_Classified_Level WHERE [LevelID]=@LevelID" />

  <SubmitCommand CommandText="UPDATE [XMP_Classified_Level] SET [Level_Name]=@Level_Name, [Level_Description]=@Level_Description, [Level_Price]=@Level_Price WHERE [LevelID]=@LevelID" />
  <div class="form-horizontal">
    <div class="form-group">
      <label for="Level_Name" CssClass="col-sm-2 control-label">Level Name</label>
      <div class="col-sm-10">
        <TextBox Id="Level_Name" CssClass="form-control required-field" Placeholder="Add level name..." MaxLength="20" DataField="Level_Name" DataType="string" />
        <Validate Target="Level_Name" CssClass="validate-error" Type="Required" Text="*" Message="Level Name is required" />
      </div>
    </div>
    
    <div class="form-group">
      <label for="Level_Description" CssClass="col-sm-2 control-label">Description</label>
      <div class="col-sm-10">
        <TextArea Id="Level_Description" CssClass="form-control" Nullable="true" DataField="Level_Description" DataType="string" />
      </div>
    </div>
    
		<div class="form-group">
      <label for="Level_Price" CssClass="col-sm-2 control-label">Price</label>
      <div class="col-sm-10">
        <div class="input-group">
          <div class="input-group-addon">$</div>
					<TextBox Id="Level_Price" cssClass="form-control" Width="150" Nullable="True" DataField="Level_Price" DataType="decimal" />
          <Validate Target="Level_Price" CssClass="validate-error validate-error-addon" Type="regex" Message="Please enter price only (1234.00)" Text="*" ValidationExpression="^\d{0,10}(\.\d{1,2})?$" />
        	<Validate Target="Level_Price" CssClass="validate-error validate-error-addon" Type="Required" Text="*" Message="Level Price is required" />
        </div>				
      </div>              
		</div>
    
    <ValidationSummary CssClass="col-sm-offset-2 col-sm-10 alert alert-info" Id="vsXMP_Classified_Level" />
    
    <div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<UpdateButton CssClass="btn btn-primary" Text="Update Level" />
        <CancelButton Text="Cancel" CssClass="btn btn-default" style="margin-left: 12px;" Visible="true" />
      </div>
    </div>    
    
  </div>
  <TextBox Visible="False" Id="LevelID" DataField="LevelID">
  </TextBox>
</xmod:EditForm></EditItemTemplate>

</xmod:FormView>
