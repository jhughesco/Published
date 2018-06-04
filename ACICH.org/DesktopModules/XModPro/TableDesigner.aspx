<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="TableDesigner.aspx.vb" Inherits="KnowBetter.XModPro.TableDesigner" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <link rel="stylesheet" type="text/css" media="screen" href="styles/ui-lightness/ui-lightness.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="styles/ui.jqgrid.css" />
    <style type="text/css">
        .kbxmDialog 
        {
        	font-size: 12px;
        }
        .kbxmRow {margin-bottom: 5px;}
        .kbxmSubRow {margin-left: 25px; display: none;}
        .kbxmRowLabel {font-weight: bold;}
    </style>
    <script src="scripts/jquery.min.js" type="text/javascript"></script>
    <script src="scripts/jquery-migrate.min.js" type="text/javascript"></script>
    <script src="scripts/i18n/grid.locale-en.js" type="text/javascript"></script>
    <script src="scripts/jquery-ui.min.js" type="text/javascript"></script>
    <script src="scripts/jquery.jqGrid.min.js" type="text/javascript"></script>
    
    <script type="text/javascript">
        var kbxm_UniqueId = 0;
        var lastSel;
        var $dlg;
        
        jQuery(document).ready(function(){ 
          $dlg = jQuery('#divDialog');
          jQuery('#btnCreateTable').attr('disabled','disabled');

          kbxmInitGrid();
          
          jQuery("#btnNew").click( function() {
            jQuery("#list").jqGrid('restoreRow', lastSel);
            kbxm_UniqueId = kbxm_UniqueId + 1;
            jQuery("#list").jqGrid('addRowData', kbxm_UniqueId, {id:kbxm_UniqueId,cname:'NewColumn'+kbxm_UniqueId,dtype:'Integer',dtypeval:'int',nulls:'No',ident:'No',defval:'',ctltype:'TextBox'});
            lastSel = kbxm_UniqueId;
            jQuery("#list").jqGrid('setSelection', kbxm_UniqueId, true);
            kbxmUpdateEditButtons('edit',kbxm_UniqueId);
          });
          jQuery("#btnCreateTable").click( function(){
            kbxmGetGridData();
            var tblDefVal = jQuery("#hidGridData").val();
            jQuery("#kbxmProgress").show();
            var nAutoGenForm = 0;
            var nAutoGenTemp = 0;
            jQuery.ajax({
              type: "POST", 
              url: '<%=Page.ResolveUrl("~/DesktopModules/XModPro/KBXM_DUtils.aspx")%>', 
              dataType: 'html',
              data: {name:jQuery('#kbxmTableName').val(), 
                     method:'CreateTable', 
                     tblDef:tblDefVal,
                     createform:nAutoGenForm, 
                     createtemp:nAutoGenTemp, 
                     xdata:'<%=Request("xdata")%>'},
              success: function(data){
                         kbxmProcessAjaxResults(data, function(result){
                            $dlg.html(result).dialog({
                                position: [200,200], 
                                modal: false, 
                                buttons: {"Close": function(){jQuery(this).dialog("destroy");}}, 
                                           title: 'Success'
                                          });
                         }, 'html');
                         jQuery("#kbxmProgress").hide();
                       }, 
              error: function(XMLHttpRequest, textStatus, errorThrown){
                         kbxmDisplayAjaxError(XMLHttpRequest);
                         jQuery("#kbxmProgress").hide();
                       }, 
              cache: false
            });
          });
          
        }); 
            
    </script>
    <script src="scripts/kbxm-cp-ajax.js" type="text/javascript"></script>

</head>
<body>
    <form id="form1" runat="server">
    <script type="text/javascript">
        function kbxmDisplayAjaxResults(data){
             var $dlg = jQuery('#divDialog');
             if (data.success == false){
                $dlg.html(data.msg);
             }
             else {
                $dlg.html(data.data);
             }
             $dlg.dialog({modal: true, buttons: {'<%=LocalizeText("Close")%>': function(){jQuery(this).dialog("destroy");}} });
        }
        function kbxmDisplayAjaxError(XMLHttpRequest){
             var $dlg = jQuery('#divDialog');
             $dlg.html(XMLHttpRequest.responseText);
             $dlg.dialog({
               modal: true, 
               buttons: {'<%=LocalizeText("Close")%>': function(){jQuery(this).dialog("destroy");}}, 
               title: '<%=LocalizeText("Error")%>'
             });
        }
        function kbxmInitGrid() {
            jQuery("#list").jqGrid({
                datatype: "local",
                height: 250,
                colNames: ['', '', '<%=LocalizeText("ColumnName")%>', '<%=LocalizeText("DataType")%>', '', '<%=LocalizeText("Size")%>', '<%=LocalizeText("Nulls")%>', '<%=LocalizeText("Identity")%>', '<%=LocalizeText("DefaultValue")%>'],
                colModel: [
              { name: 'act', index: 'act', width: 60, sortable: false },
              { name: 'id', index: 'id', hidden: true },
              { name: 'cname', index: 'cname', width: 150, editable: true, edittype: 'text', editoptions: { size: 50, maxlength: 128} },
              { name: 'dtype', index: 'dtype', width: 200, editable: true, edittype: 'select', editoptions: {
                  value: { 'bit': 'Boolean',
                      'money': 'Currency',
                      'date': 'Date',
                      'datetime': 'Date/Time',
                      'smalldatetime': 'Date/Time (Small)', 
                      'datetime2': 'Date/Time (Large)', 
                      'float': 'Float',
                      'int': 'Integer',
                      'bigint': 'Big Integer',
                      'smallint': 'Small Integer',
                      'tinyint': 'Tiny Integer (0-128)',
                      'decimal': 'Decimal',
                      'char': 'Fixed-Length Text',
                      'nchar': 'Fixed-Length Text (Unicode)',
                      'varchar': 'Variable-Length Text',
                      'nvarchar': 'Variable-Length Text (Unicode)',
                      'varcharmax': 'MAX Length Text',
                      'nvarcharmax': 'MAX Length Text (Unicode)',
                      'text': 'Long Text',
                      'ntext': 'Long Text (Unicode)',
                      'uniqueidentifier': 'Unique Identifier', 
                      'xml': 'XML'
                  },
                  dataEvents: [
                  { type: 'change',
                      fn: function (e) {
                          jQuery('input[name=dtypeval]').val(this.value);
                          var $chkIdent = jQuery('input[name=ident]');
                          var $txtSize = jQuery('input[name=size]');
                          var $txtDefault = jQuery('input[name=defval]');

                          switch (this.value) {
                              case 'int':
                              case 'smallint':
                              case 'tinyint':
                              case 'bigint':
                                  $chkIdent.show();
                                  $txtSize.val('').hide();
                                  break;
                              case 'bit':
                                  break;
                              case 'datetime':
                              case 'smalldatetime':
                              case 'date':
                                  $chkIdent.attr('checked', false).hide();
                                  $txtSize.val('').hide();
                                  break;
                              case 'datetime2':
                                  $chkIdent.attr('checked', false).hide();
                                  break;
                              case 'decimal':
                              case 'float':
                              case 'money':
                                  $chkIdent.attr('checked', false).hide();
                                  break;
                              case 'varchar':
                              case 'nvarchar':
                              case 'char':
                              case 'nchar':
                                  $chkIdent.attr('checked', false).hide();
                                  if ($txtSize.val() == '') $txtSize.val('50');
                                  $txtSize.show();
                                  break;
                              case 'text':
                              case 'ntext':
                              case 'varcharmax':
                              case 'nvarcharmax':
                              case 'xml': 
                                  $chkIdent.attr('checked', false).hide();
                                  $txtSize.val('').hide();
                                  break;
                              case 'uniqueidentifier':
                                  $chkIdent.attr('checked', false).hide();
                                  $txtSize.val('').hide();
                                  if ($txtDefault.val() == '') $txtDefault.val('NEWID()');
                                  break;
                          }
                      }
                  }
                ]
              }
              },
              { name: 'dtypeval', index: 'dtypeval', hidden: true, editable: true },
              { name: 'size', index: 'size', width: 40, editable: true, edittype: 'text', editrules: { integer: true }, editoptions: { style: 'display:none'} },
              { name: 'nulls', index: 'nulls', width: 40, align: 'center', editable: true, edittype: 'checkbox',
                  editoptions: {
                      value: 'Yes:No',
                      dataEvents: [
                        { type: 'click',
                            fn: function (e) {
                                if (jQuery(this).attr('checked') == true) {
                                    jQuery('input[name=defval]').val('').hide();
                                }
                                else {
                                    jQuery('input[name=defval]').show();
                                }
                            }
                        }
                    ]
                  }
              },
              { name: 'ident', index: 'ident', width: 60, align: 'center', editable: true, edittype: 'checkbox',
                  editoptions: {
                      value: 'Yes:No',
                      dataEvents: [
                        { type: 'click',
                            fn: function (e) {
                                if (jQuery(this).attr('checked') == true) {
                                    jQuery('input[name=nulls]').attr('checked', false).hide();
                                    jQuery('input[name=defval]').val('').hide();
                                }
                                else {
                                    jQuery('input[name=nulls]').show();
                                    jQuery('input[name=defval]').show();
                                }
                            }
                        }
                    ]
                  }
              },
              { name: 'defval', index: 'defval', width: 180, editable: true, edittype: 'text' },
            ],
                caption: '<%=LocalizeText("TableDesigner")%>',
                editurl: 'clientArray',
                viewrecords: true,
                rownumbers: true,
                gridComplete: function () {
                    var ids = jQuery("#list").jqGrid('getDataIDs');
                    for (var i = 0; i < ids.length; i++) {
                        var cl = ids[i];
                        ee = "<input type='image' src=\"images/edit.gif\" value=\"Edit\" title=\"Edit\" style=\"margin-left:5px;\" onclick=\"kbxmEditRow('" + cl + "');return false;\" />";
                        de = "<input type='image' src=\"images/delete.gif\" value=\"Delete\" title=\"Delete\" style=\"margin-left:5px;\" onclick=\"kbxmDeleteRow('" + cl + "');return false;\" />";
                        se = "<input type='image' src=\"images/accept.gif\" value=\"Save\" title=\"Save\" style=\"margin-left:5px;display:none;\" onclick=\"kbxmSaveRow(" + cl + ");return false;\" />";
                        ce = "<input type='image' src=\"images/cancel.gif\" value=\"Cancel\" title=\"Cancel\" style=\"margin-left:10px;display:none;\" onclick=\"kbxmCancelEdit('" + cl + "');return false;\" />";
                        jQuery("#list").jqGrid('setRowData', ids[i], { act: ee + de + se + ce });
                    }
                },
                onSelectRow: function (id) {
                    if (id && id !== lastSel) {
                        jQuery("#list").jqGrid('restoreRow', lastSel, kbxmAfterRestore);
                        lastSel = id;
                    }
                    kbxmEditRow(id)
                }
            }); 
        
        }
        
        function kbxmUpdateEditButtons(action,id){
          switch (action)
          {
          	case "edit":
          		jQuery('#list tr#' + id + ' td input[type=image][value=Save]').show();
          		jQuery('#list tr#' + id + ' td input[type=image][value=Cancel]').show();
          		jQuery('#list tr#' + id + ' td input[type=image][value=Edit]').hide();
          		jQuery('#list tr#' + id + ' td input[type=image][value=Delete]').hide();
          		break;
          	default:
          		jQuery('#list tr#' + id + ' td input[type=image][value=Save]').hide();
          		jQuery('#list tr#' + id + ' td input[type=image][value=Cancel]').hide();
          		jQuery('#list tr#' + id + ' td input[type=image][value=Edit]').show();
          		jQuery('#list tr#' + id + ' td input[type=image][value=Delete]').show();
          }
          if (jQuery('#list').jqGrid('getDataIDs').length > 0) {
            jQuery('#btnCreateTable').removeAttr('disabled');
          }
          else {
            jQuery('#btnCreateTable').attr('disabled','disabled');
          }
    }

        function kbxmSaveRow(id){
          jQuery('#list').jqGrid('saveRow',id,false,'clientArray');
          // only reset buttons if save was successful
          if(jQuery('#list tr#' + id).attr("editable")!=="1"){kbxmUpdateEditButtons('save',id);}
        }
        function kbxmEditRow(id){
          jQuery('#list').jqGrid('editRow',id, true,false,false,'clientArray',null,kbxmAfterSave,null,kbxmAfterRestore);
          var $ColName = jQuery('#'+id+'_cname');
          $ColName.focus();
          $ColName.select();
          kbxmUpdateEditButtons('edit',id);
          lastSel = id;
        }
        function kbxmAfterSave(rowid,resp){
            kbxmUpdateEditButtons('save',rowid);
        }
        function kbxmAfterRestore(rowid){
            kbxmUpdateEditButtons('canceledit',rowid)
        }
        function kbxmCancelEdit(id){
          jQuery('#list').jqGrid('restoreRow',id,kbxmAfterRestore);
        }
        function kbxmDeleteRow(id){
          jQuery('#list').jqGrid('delRowData',id);
          kbxmUpdateEditButtons('delete',id);
       }
        function kbxmGetGridData(){
          if (typeof(lastSel) !== 'undefined') kbxmCancelEdit(lastSel);
          var rows = jQuery("#list").jqGrid('getRowData');
          var out = '';
          for(var i=0;i < rows.length;i++){
            out += rows[i].cname + '|' + rows[i].dtype + '|' + rows[i].dtypeval + '|' + rows[i].size + '|' + rows[i].nulls + '|' + 
                   rows[i].ident + '|' + rows[i].defval + '###';
          }
          document.getElementById('hidGridData').value = out;
        }
        
    </script>
    <div>
        <p class="ui-widget ui-state-default ui-corner-all" style="padding:5px;">
            <%=LocalizeText("DatabaseToolsDescription")%> </p>
        <table id="list"></table>
        <div id="pager"></div>
        <input type="button" id="btnNew" value="<%=LocalizeText("NewColumn")%>" />
        <input type="hidden" id="hidGridData" value="" runat="server"/>
        <input type="hidden" id="hidOptions" value="" runat="server"/>
        <div class="ui-widget kbxmRow" style="margin-top: 8px;">
            <label id="kbxmTableNameLabel" class="kbxmRowLabel" for="kbxmTableName" style="float:left; margin-right: 10px;"><%=LocalizeText("TableName")%></label>
            <input ID="kbxmTableName" MaxLength="128" />          
        </div>
        <input class="ui-widget" type="button" value="<%=LocalizeText("CreateTable")%>" id="btnCreateTable" />
        <span id="kbxmProgress" class="ui-widget" style="display:none;margin-left: 5px; font-size: .8em;">
          <img src="images/ajax-loader.gif" alt="Processing" title="<%=LocalizeText("Processing")%>"/>
          <%=LocalizeText("Processing")%>
        </span>
        <div id="divDialog" title="Results" class="kbxmDialog"></div>
    </div>
    </form>
</body>
</html>
