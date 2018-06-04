function kbxmAjaxCommitItem(itemType, itemName, portalFilter, callback) {
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: kbxm_UrlManage,
        data: {
            itemType: itemType,
            itemName: itemName,
            g: portalFilter,
            callback: "repocommit",
            xdata: kbxm_xdata
        },
        success: function (data) {
            if (data) {
                if (data.error) { alert(data.message); }
                else {
                    if (callback) callback(data);
                }
            } else {
                alert("no data was returned from the commit call");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

function kbxmAjaxCommitItemHistory(itemType, itemName, portalFilter, callback) {
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: kbxm_UrlManage,
        data: {
            itemType: itemType,
            itemName: itemName,
            g: portalFilter,
            callback: "repohistorylist",
            xdata: kbxm_xdata
        },
        success: function (data) {
            if (data) {
                if (data.error) { alert(data.message); }
                else {
                    // success, process it here
                    if (callback) callback(data.message);
                }
            } else {
                alert("no data was returned from the view history call");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

function kbxmAjaxCommitRecoverItem(itemType, itemName, portalFilter, versionId, callback) {
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: kbxm_UrlManage,
        data: {
            itemType: itemType,
            itemName: itemName,
            g: portalFilter,
            versionId: versionId, 
            callback: "reporecover",
            xdata: kbxm_xdata
        },
        success: function (data) {
            if (data) {
                if (data.error) { alert(data.message); }
                else {
                    // success, process it here
                    if (callback) callback(data.message);
                }
            } else {
                alert("no data was returned from the view history call");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}
  
function kbxmAjaxCreateFromTable(tableName, keyField, opts, connStr) {
    var optionString = (opts) ? opts : '';
    var outType = '';
    if (kbxmItemType == 'template') outType = $OutputType.val();

    jQuery.ajax({
      type: "POST",
      dataType: "html",
      url: kbxm_UrlUtil,
      data: { method: (kbxmItemType == 'form') ? 'formfromtable' : 'templatefromtable',
          name: tableName,
          keyfield: keyField,
          output: outType,
          connstr: connStr, 
          options: optionString, 
          xdata: kbxm_xdata
      },
      success: function(data) {
          kbxmProcessAjaxResults(data, function(results) {
              if (kbxmItemType == 'form') {
                  kbxmSplitForm(data);
              }
              else { $EditorControl.val(data); }
          }, 'html');
          jQuery('#kbxmProgressNew').hide();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200, 125]);
          jQuery('#kbxmProgressNew').hide();
      },
      cache: false
    });
    }
        
function kbxmAjaxSaveItem(itemName, itemContent, callback, isGlobal, isNew) {
    var methodName;
    switch (kbxmItemType) {
      case 'form': methodName = 'saveform'; break;
      case 'feed': methodName = 'savefeed'; break;
      default: methodName = 'savetemp';
    }
    jQuery.ajax({
      type: "POST", 
      url: kbxm_UrlManage, 
      data: {itemname:itemName, 
             callback: methodName, 
             itemdata: itemContent,
             xdata: kbxm_xdata,
             isnew: isNew, 
             g: isGlobal},
      success: function(data){
                kbxmProcessAjaxResults(data, function(results){
                    $EditorPanel.hide();
                    $GridPanel.show();
                }, 'text');
                if (callback) {callback();}
               }, 
      error: function(XMLHttpRequest, textStatus, errorThrown){
                 kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200,125]);
               }, 
      cache: false
    });
}


function kbxmAjaxGetTables(bIncludeViews, connStr) {
    var methodName = 'gettables';
    if (connStr) {
      methodName = 'gettablesext';
    } 
    if (bIncludeViews) {
      methodName += 'andviews';
    }
    var functionData = { method: methodName, xdata: kbxm_xdata };
    if (connStr) {
      functionData = { method: methodName, connstr:connStr, xdata: kbxm_xdata };
    }
    jQuery.ajax({
      type: "POST", 
      dataType: "html", 
      url: kbxm_UrlUtil, 
      data: functionData,
      success: function(data){
                kbxmProcessAjaxResults(data, function(results){
                    $TablesList.html("<option />").append(data);
                    $TablesList.parent().show();
                }, 'html');
                jQuery('#kbxmProgressLoadTables').hide();
               }, 
      error: function(XMLHttpRequest, textStatus, errorThrown){
                 kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200,125]);
                 jQuery('#kbxmProgressLoadTables').hide();
               }, 
      cache: false
    });
}

function kbxmAjaxGetTableColumns(tableName, includeViews, connStr) {
    var methodName = (includeViews) ? "gettableorviewcols" : "gettablecols";
    var functionData = { method: methodName, name: tableName, xdata: kbxm_xdata };
    if (connStr) {
      methodName = "gettableorviewcolsext";
      functionData = { method: methodName, name: tableName, connstr: connStr, xdata: kbxm_xdata };
    }
    jQuery.ajax({
      type: "POST",
      dataType: "html",
      url: kbxm_UrlUtil,
      data: functionData,
      success: function(data) {
        kbxmProcessAjaxResults(data, function(results) {
          $KeyFieldList.html("<option />").append(data);
          $KeyFieldList.parent().show();
        }, 'html');
        jQuery('#kbxmProgressLoadCols').hide();
        // Added for v.3.0 form builder - to populate column selector on control designers
        jQuery('select.designer-datafield').html('<option />').append(data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200, 125]);
        jQuery('#kbxmProgressLoadCols').hide();
      },
      cache: false
    });
}

function kbxmAjaxGetForm(itemName, addFormEditor, editFormEditor, isGlobal) {
    jQuery.ajax({
        type: "POST",
        dataType: "html",
        url: kbxm_UrlManage,
        data: { itemname: itemName,
            callback: 'editform',
            xdata: kbxm_xdata, 
            g: isGlobal
        },
        success: function(data) {
            kbxmProcessAjaxResults(data, function(results) {
                jQuery('#ItemEditTitle').html(itemName).show();
                kbxmSplitForm(results, addFormEditor, editFormEditor);
                jQuery('#divItemName').hide();
            }, 'html');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200, 125]);
        },
        cache: false
    });


}

function kbxmSplitForm(formDef, addFormEditor, editFormEditor) {
    // split form into add/edit forms
    var reEditForm = /<EditForm[^>]*>[\s\S]*<\/EditForm>/i;
    var sEditFormDef = '';
    // grab edit form and place in edit editor
    if (reEditForm.test(formDef)) {
        sEditFormDef = reEditForm.exec(formDef)[0];
        //editFormEditor.setValue(EditFormDef);
        //$EditorControlEditForm.val(EditFormDef);
        formDef = formDef.replace(reEditForm, '');
    }
    // pull edit success template out of form and place in edit form editor
    var reEditSuccess = /<EditSuccessTemplate[^>]*>[\s\S]*<\/EditSuccessTemplate>/;
    if (reEditSuccess.test(formDef)) {
        var editSuccess = reEditSuccess.exec(formDef)[0];
        sEditFormDef += "\n\n" + editSuccess;
        //editFormEditor.setValue(editFormEditor.getValue() + "\n\n" + editSuccess);
        //$EditorControlEditForm.val($EditorControlEditForm.val() + "\n\n" + editSuccess);
        formDef = formDef.replace(reEditSuccess, '');
    }
    if (addFormEditor) {
        addFormEditor.setValue(jQuery.trim(formDef) + "\n\n")
        addFormEditor.refresh();
    } else {
        $EditorControl.val(jQuery.trim(formDef) + "\n\n");
    }
    if (editFormEditor) {
        editFormEditor.setValue(sEditFormDef);
        editFormEditor.refresh();
    } else {
        $EditorControlEditForm.val(sEditFormDef);
    }
}

function kbxmAjaxGetItem(itemName, isGlobal){
  var methodName;
  switch (kbxmItemType) {
    case 'form': methodName = 'editform'; break;
    case 'feed': methodName = 'editfeed'; break;
    default: methodName = 'edittemp';
  }
  jQuery.ajax({
      type: "POST",
      dataType: "html",
      url: kbxm_UrlManage,
      data: { itemname: itemName,
          callback: methodName,
          xdata: kbxm_xdata, 
          g: isGlobal
      },
      success: function (data) {
          kbxmProcessAjaxResults(data, function (results) {
              jQuery('#ItemEditTitle').html(itemName).show();
              //$EditorControl.val(results);
              editor.setValue(results);
              jQuery('#divItemName').hide();
          }, 'html');
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200, 125]);
      },
      cache: false
  });
}

function kbxmAjaxRenameItem(itemName, rowId, isGlobal){
  var methodName;
  switch (kbxmItemType) {
    case 'form': methodName = 'renameform'; break;
    case 'feed': methodName = 'renamefeed'; break;
    default: methodName = 'renametemp';
  }
  jQuery.ajax({
      type: "POST", 
      dataType: "json", 
      url: kbxm_UrlManage, 
      data: {itemname:itemName, 
             olditemname:oldItemName, 
             callback: methodName,  
             xdata:kbxm_xdata, 
             g: isGlobal},
      success: function(data){
                kbxmProcessAjaxResults(data, function(results) {
                    // only reset buttons if save was successful
                    kbxmUpdateEditButtons('save', rowId);
                    $Grid.jqGrid('restoreRow',rowId);
                    oldItemName = '';
                    });
               }, 
      error: function(XMLHttpRequest, textStatus, errorThrown){
                 kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200,125]);
                 kbxmCancelEdit(rowId);
                 $Grid.jqGrid('setRowData',rowId,{itemname:oldItemName});
                 oldItemName = '';
               }, 
      cache: false
    });
}

function kbxmAjaxCopyItem(itemName, rowId, originalItemType,callback, isGlobal){
  var methodName;
  switch (kbxmItemType) {
    case 'form': methodName = 'copyform'; break;
    case 'feed': methodName = 'copyfeed'; break;
    default: methodName = 'copytemp';
  }
  jQuery.ajax({
    type: "POST",
    dataType: "json",
    url: kbxm_UrlManage,
    data: { itemname: itemName,
      callback: methodName,
      xdata: kbxm_xdata, 
      g: isGlobal
    },
    success: function (data) {
      kbxmProcessAjaxResults(data, function (theData) {
        var rowIDs = $Grid.jqGrid('getDataIDs');
        var newID = -1;
        var curID;
        for (i = 0; i < rowIDs.length - 1; i++) {
          curID = parseInt(rowIDs[i]);
          if (curID > newID) { newID++ }
        }
        if (kbxmItemType == 'form') {
          $Grid.jqGrid('addRowData', newID, { itemname: theData, itemtype: originalItemType }, 'after', rowId);
        } else {
          $Grid.jqGrid('addRowData', newID, { itemname: theData }, 'after', rowId);
        }
        if (callback) { callback() };
      });
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200, 125]);
    },
    cache: false
  });
}

function kbxmAjaxDeleteItem(itemType,itemName,isGlobal){
  var methodName;
  switch (kbxmItemType) {
    case 'form': methodName = 'deleteform'; break;
    case 'feed': methodName = 'deletefeed'; break;
    default: methodName = 'deletetemp';
  }
  jQuery.ajax({
    type: "POST", 
    dataType: "json", 
    url: kbxm_UrlManage, 
    data: {itemname:itemName, 
           callback: methodName, 
           xdata:kbxm_xdata, 
           g: isGlobal},
    success: function(data){
               $dlg.dialog('destroy');
               kbxmProcessAjaxResults(data, function(){$Grid.jqGrid().trigger('reloadGrid');});
             }, 
    error: function(XMLHttpRequest, textStatus, errorThrown){
               $dlg.dialog('destroy');
               kbxmShowDialog(XMLHttpRequest.responseText, "Error", [200,125]);
             }, 
    cache: false
  });
}       

function kbxmProcessAjaxJsonError(data){
    var res = eval(data);
    kbxmShowDialog(data.msg, "Error");
}

function kbxmProcessAjaxResults(data, SuccessFunc, dataType) {
  if (!data) return;
    if (dataType == undefined) { dataType = 'json' };
    switch (dataType)
    {
    	case 'html':
    	case 'text':
    	    // errors reported as HTML, so just return the HTML
    	    if (data.indexOf("ERROR:") == 0){
    	        kbxmShowDialog(data, "Error", [200,125]);
    	        return;
    	    }
            if (SuccessFunc == undefined){
                $dlg.html(data.data);
                kbxmShowDialog(data.data);
                return;
            }
            else {
                SuccessFunc(data);
            }
    		break;
    	default:
             if (data.success == false){
                $dlg.html(data.msg);
                kbxmShowDialog(data.msg, "Error", [200,125]);
                return;
             }
             else {
                if (SuccessFunc == undefined){
                    $dlg.html(data.data);
                    kbxmShowDialog(data.data);
                    return;
                }
                else {
                    SuccessFunc(data.data);
                    //return data.data 
                }
             }
    }
}
