<%@ Control Language="vb" AutoEventWireup="false" Inherits="KnowBetter.XModPro.FormBase" %>
<%@ Register Assembly="KnowBetter.XModPro.Web.Controls" Namespace="KnowBetter.XModPro.Web.Controls.Form" TagPrefix="xmod" %>
<xmod:FormView runat="server"><AddItemTemplate><xmod:AddForm runat="server">
	
  <ScriptBlock ScriptId="CustomCSS" BlockType="HeadScript" RegisterOnce="true">
		<style type="text/css">
      .contact-form {
        max-width: 800px;
        margin: auto;
      }
      
      .validate-error {
        position: absolute;
        top: 0;
        left: 0;
        color: red;
      }
      
      .contact-radio input {
      	margin-right: 5px; 
      }
      
      .required-field {
      	border-left: 1px solid red; 
      }
    </style>  
  </ScriptBlock>  

  <div class="form-horizontal contact-form" role="form">
    <div class="form-group">
			<Label CssClass="col-sm-2 control-label" For="Department">Department</Label>
      <div class="col-sm-10">
    		<DropDownList Id="Department" CssClass="form-control required-field" DataField="Department">
          <ListItem Value="">
            - Please Select -
          </ListItem>
          <ListItem Value="Support">
            Support
          </ListItem>
          <ListItem Value="Report Abuse">
            Report Abuse
          </ListItem>
          <ListItem Value="General">
            General
          </ListItem>
        </DropDownList>
        <Validate Target="Department" CssClass="validate-error" Type="required" Text="*" Message="Please select a department." />
      </div>
    </div>
    
    <div class="form-group">
			<Label CssClass="col-sm-2 control-label" For="Name">Name</Label>
      <div class="col-sm-10">
        <TextBox Id="Name" Value='<%#UserData("Firstname")%>' CssClass="form-control required-field" MaxLength="50" DataField="Name" />
    		<Validate Target="Name" CssClass="validate-error" Type="required" Text="*" Message="Please enter your name." />
	    </div>
    </div>
    
    <div class="form-group">
			<Label CssClass="col-sm-2 control-label" For="Email">Email</Label>
      <div class="col-sm-10">
				<TextBox Id="Email" Value='<%#UserData("Email")%>' CssClass="form-control required-field" MaxLength="50" DataField="Email" />
      	<Validate Target="Email" CssClass="validate-error" Type="required" Text="*" Message="Please enter an email address." />
      	<Validate Target="Email" CssClass="validate-error" Type="email" Text="*" Message="Please enter a valid email address." />
      </div>      
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Phone">Phone</Label>
      <div class="col-sm-10">
				<TextBox Id="Phone" CssClass="form-control" MaxLength="20" DataField="Phone" />
      </div>
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="Message">Message</Label>
      <div class="col-sm-10">
        <TextArea Id="Message" CssClass="form-control required-field" DataField="Message" />
      	<Validate Target="Message" CssClass="validate-error" Type="required" Text="*" Message="Please enter a message." />
      </div>
    </div>
    
    <div class="form-group">
      <Label CssClass="col-sm-2 control-label" For="ContactMethod">Please select a preferred contact method:</Label>
      <div class="col-sm-10">
				<RadioButtonList Id="ContactMethod" CssClass="contact-radio" DataField="ContactMethod" RepeatDirection="Vertical" RepeatLayout="table" SelectedItemsSeparator="|">
          <ListItem Value="Email" Selected="True">
            Email
          </ListItem>
          <ListItem Value="Phone">
            Phone
          </ListItem>
          <ListItem Value="Either">
            Either
          </ListItem>
          <ListItem Value="None">
            None
          </ListItem>
        </RadioButtonList>
      </div>		
    </div>   
		<ValidationSummary CssClass="col-sm-offset-2 col-sm-10 alert alert-info" Id="ContactValidation" DisplayMode="BulletList" HeaderText="Please correct the following errors:" />
    
    <div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<AddButton CssClass="btn btn-primary" Text="Send Message" />  		
      </div>
    </div>      
  </div>
   
  <Email To="book@discoverxmodpro.com" From="book@discoverxmodpro.com" ReplyTo="[[Email]]" Format="text" Subject="[[Name]] has sent you a message">
    You received a message from [[Name]].

    Department: [[Department]]
    Name: [[Name]]
    Email: [[Email]]
    Phone: [[Phone]]
    Contact Method: [[ContactMethod]]
    Message: [[Message]]

    Thank you!
  </Email>
</xmod:AddForm></AddItemTemplate>

<AddSuccessTemplate><xmod:AddSuccess runat="server">
  <ItemTemplate>
    <ScriptBlock ScriptId="SuccessCSS" BlockType="HeadScript" RegisterOnce="true">
      <style type="text/css">
        .success-message {
          max-width: 800px;
          margin: auto;
        }
      </style>
  	</ScriptBlock>
    
  	<div class="alert alert-success success-message">
			Thank you <%#Eval("Values")("Name")%>! We'll get back to you as soon as possible.
    </div>
    
  </ItemTemplate>
</xmod:AddSuccess></AddSuccessTemplate>

<EditItemTemplate><xmod:EditForm runat="server">
  <ScriptBlock BlockType="HeadScript" RegisterOnce="True" ScriptId="KBXM_Theme_none_Contact_Us">
    <link rel="stylesheet" type="text/css" href="/DesktopModules/XModPro/styles/none" />
  </ScriptBlock>

  <ScriptBlock BlockType="HeadScript" RegisterOnce="True" ScriptId="KBXM_Style_Contact_Us">
    <style type="text/css">
      .xmp-Contact_Us { padding: 10px 5px 5px 5px; }
      .xmp-Contact_Us .xmp-form-row { margin: 3px; padding: 3px; clear:left;}
      .xmp-Contact_Us label.xmp-form-label, .xmp-Contact_Us span.xmp-form-label{ display:block; float:left; width: 120px;text-align: left; margin-right: 5px; }
      .xmp-Contact_Us .xmp-button { margin-right: 5px; }
    </style>
  </ScriptBlock>


<div class="xmp-form xmp-Contact_Us">
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Department">Department</Label><DropDownList Id="Department" DataField="Department"><ListItem Value="">- Please Select -</ListItem><ListItem Value="Support">Support</ListItem><ListItem Value="Report Abuse">Report Abuse</ListItem><ListItem Value="General">General</ListItem></DropDownList><Validate Target="Department" CssClass="xmp-validation" Type="required" Text="*" Message="Please select a department."></Validate></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Name">Name</Label><TextBox Id="Name" MaxLength="50" DataField="Name"></TextBox><Validate Target="Name" CssClass="xmp-validation" Type="required" Text="*" Message="Please enter your name."></Validate></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Email">Email</Label><TextBox Id="Email" MaxLength="50" DataField="Email"></TextBox><Validate Target="Email" CssClass="xmp-validation" Type="required" Text="*" Message="Please enter an email address."></Validate><Validate Target="Email" CssClass="xmp-validation" Type="email" Text="*" Message="Please enter a valid email address."></Validate></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Phone">Phone</Label><TextBox Id="Phone" MaxLength="20" DataField="Phone"></TextBox></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="Message">Message</Label><TextArea Id="Message" DataField="Message"></TextArea><Validate Target="Message" CssClass="xmp-validation" Type="required" Text="*" Message="Please enter a message."></Validate></div>
    <div class="xmp-form-row"><Label CssClass="xmp-form-label" For="ContactMethod">Please select a preferred contact method:</Label><RadioButtonList Id="ContactMethod" DataField="ContactMethod" RepeatDirection="Vertical" RepeatLayout="Table" SelectedItemsSeparator="|"><ListItem Value="Email">Email</ListItem><ListItem Value="Phone">Phone</ListItem><ListItem Value="Either">Either</ListItem><ListItem Value="None">None</ListItem></RadioButtonList></div><ValidationSummary CssClass="xmp-validation" Id="ContactValidation" DisplayMode="BulletList" HeaderText="Please correct the following errors:"></ValidationSummary><div class="xmp-form-row"><Label class="xmp-form-label">&nbsp;</Label><UpdateButton Text="Update"></UpdateButton><CancelButton Text="Cancel" style="margin-left: 12px;" Visible="false"></CancelButton></div>
  </div></xmod:EditForm></EditItemTemplate>

</xmod:FormView>
