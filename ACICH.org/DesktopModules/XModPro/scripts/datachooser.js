// Data Chooser Plugin for XMod Pro
// Copyright 2011-2013 Kelly Ford
// All rights reserved
// ===================================
// Description: Handles the selection of a table in the database and
// retrieves a list of columns from the selected table that can be used elsewhere.
// functions...
//  getKeyFields(): Valid only if keyChooser option set to true. Returns array of key field names. 
//      Returns false if keyChooser is set to false.
//  getAllFields(): Valid only if keyChooser or fieldChooser option set to true. Returns array of all column names
//      in selected data source. Returns false if keyChooser and fieldChooser are both false.
//  getSelectedFields(): Valid only if fieldChooser option set to true. Returns array of all column names which
//      have been selected by the user. Returns false if fieldChooser is false.
//  getSelectedTable(): Will return the table name if a table was selected.
//  getConnectionString(): If External SQL DB selected, returns the value in the Connection String box. Returns false
//      otherwise
//  getQuery(): If a dnn or external query is selected, will return the query text. Otherwise: returns false.
//  getDataSettings(): return an object with all settings: selectedTable, selectedFields, keyFields, allFields, 
//        connectionString, query.
//  getDataSourceType(): returns a string, representing which data source was chosen. Possible values are:
//      dnn_table, dnn_query, ext_table, ext_query
// ----------------------------------------------------------------------------------------------------------------
(function ($) {
    var dataID = "dataChooser";
    // pointers to labels in label array
    var lblIdx_Error = 0
        , lblIdx_NoneSelected = 1
        , lblIdx_DataSource = 2
        , lblIdx_None = 3
        , lblIdx_DNNDatabaseTable = 4
        , lblIdx_ExtDatabaseTable = 5
        , lblIdx_Table = 6
        , lblIdx_KeyField = 7
        , lblIdx_ConnStr = 8
        , lblIdx_LoadTables = 9
        , lblIdx_ChooseFields = 10
        , lblIdx_Query = 11
        , lblIdx_LoadFields = 12
        , lblIdx_DNNDatabaseQuery = 13
        , lblIdx_ExtDatabaseQuery = 14
        , lblIdx_SortField = 15
        , lblIdx_SortOrder = 16
        , lblIdx_Ascending = 17
        , lblIdx_Descending = 18;
    // pointers to control rows
    var rowIdx_DataSource = 0
        , rowIdx_ConnStr = 1
        , rowIdx_Tables = 2
        , rowIdx_Query = 3
        , rowIdx_Keys = 4
        , rowIdx_Fields = 5
        , rowIdx_SortField = 6
        , rowIdx_SortOrder = 7;

    var methods = {
        init: function (options) {
            var opts = $.extend({}
                , $.fn.dataChooser.defaults, options)
                , $this = $(this)
                , data = $this.data(dataID);
            if (!data) {
                $this.data(dataID, {
                    opts: opts,
                    container: $this,
                    columns: null
                });
            } else {
                $this.data(dataID, {
                    opts: opts
                })
            }
            initialize($this);
            return this;
        },
        getKeyFields: function () {
            return getKeyFields($(this));
        },
        getAllFields: function () {
            return getAllFields($(this));
        },
        getSelectedFields: function () {
            return getSelectedFields($(this));
        },
        getConnectionString: function () {
            return getConnectionString($(this));
        },
        getSelectedTable: function () {
            return getSelectedTable($(this));
        },
        getDataSettings: function () {
            return getDataSettings($(this));
        },
        getQuery: function () { return getQuery($(this)); },
        getDataSourceType: function () {
            return getDataSourceType($(this));
        }
    };

    $.fn.dataChooser = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.dataChooser');
        }
    };

    $.dataChooser = {}; // base object to hold static functions

    // OPTIONS:
    // xdata - XMod Pro-specific encrypted data, needed for AJAX calls
    // labels___ - Text to use as caption for various controls.
    // columnWidth - CSS width of label column
    // keyFieldChooser - if true, will display drop-down for choosing a single column for the key
    // fieldChooser - if true, will display a list box for multiple selection of columns.
    // progressClass - CSS class name to use for styling SPAN element when performing action.
    $.fn.dataChooser.defaults = {
        xdata: null,
        portalId: 0,
        labels: ['Error', '(None Selected)', 'Data Source',
                 'None', 'DotNetNuke Database Table', 'External SQL Server Database Table',
                 'Table', 'Key Field', 'Connection String', 'Load Tables', 'Choose Fields',
                 'Query', 'Load Fields', 'DotNetNuke Database Query', 'External SQL Server Database Query',
                 'Sort On', 'Sort Order', 'Ascending', 'Descending'],
        columnWidth: '120px',
        keyFieldChooser: true,
        fieldChooser: true,
        enableQuery: false,
        enableSort: false,
        progressClass: 'xmp-progress',
        onDataSourceChanged: null, // callback, passes in new list of columns.
        onKeyFieldChanged: null,  // callback whenever selected key field has changed
        onSelectedFieldsChanged: null, // callback whenever selected fields changed.
        onControlLoaded: null, // callback after initialization has finished.
        initDataSourceType: null,
        initConnectionString: null,
        initSelectedTable: null,
        initSelectedFields: null,
        initSelectedKeyFields: null
    }; // dataChooser.defaults


    function initialize(container) {
        var data = container.data(dataID);
        var opts = data.opts;
        // Create tabs
        container.html(
            '<div>' +
            ' <label>' + opts.labels[lblIdx_DataSource] + '</label>' +
            ' <select size="1">' +
            '  <option value="" selected="selected">' + opts.labels[lblIdx_NoneSelected] + '</option>' +
            '  <option value="dnn_table">' + opts.labels[lblIdx_DNNDatabaseTable] + '</option>' +
            '  <option value="dnn_query">' + opts.labels[lblIdx_DNNDatabaseQuery] + '</option>' +
            '  <option value="ext_table">' + opts.labels[lblIdx_ExtDatabaseTable] + '</option>' +
            '  <option value="ext_query">' + opts.labels[lblIdx_ExtDatabaseQuery] + '</option>' +
            ' </select></div>' +
            '<div>' +
            ' <label>' + opts.labels[lblIdx_ConnStr] + '</label>' +
            ' <input type="text" style="width: 300px;"/><br />' +
            ' <input type="button" style="margin-left: 120px;" value="' + opts.labels[lblIdx_LoadTables].replace(" ", "&nbsp;") + '"/>' +
            '</div>' +
            '<div>' +
            ' <label>' + opts.labels[lblIdx_Table] + '</label>' +
            ' <select size="1" /></div>' +
            '<div>' +
            '  <label>' + opts.labels[lblIdx_Query] + '</label>' +
            '  <textarea style="width:300px;height:100px;"></textarea><br />' +
            '  <input type="button" value="' + opts.labels[lblIdx_LoadFields].replace(" ", "&nbsp;") + '"/>' +
            '</div>' +
            '<div style="display:none;">' +
            ' <label>' + opts.labels[lblIdx_KeyField] + '</label>' +
            ' <select size="1" style="min-width: 120px;" /></div>' +
            '<div style="display:none;">' +
            ' <label>' + opts.labels[lblIdx_ChooseFields] + '</label>' +
            ' <select size="5" multiple="multiple" style="min-width: 120px;" /></div>' +
            '<div style="display:none;">' +
            ' <label>' + opts.labels[lblIdx_SortField] + '</label>' +
            ' <select size="1" style="min-width: 120px;" /></div>' +
            '<div style="display:none;">' +
            ' <label>' + opts.labels[lblIdx_SortOrder] + '</label>' +
            ' <select size="1" style="min-width: 60px;">' +
            '  <option value="asc">' + opts.labels[lblIdx_Ascending] + '</option>' +
            '  <option value="desc">' + opts.labels[lblIdx_Descending] + '</option>' +
            ' </select></div>');

        var $rows = container.children('div')
        $rows.css({ 'margin': '5px 0px', 'padding': '0px' }).first().css({ 'margin': '0px' });
        $rows.children('label').css({ 'display': 'block', 'float': 'left',
            'width': opts.columnWidth
        });
        $rows.hide().eq(0).show();

        var $rowConnStr = $rows.eq(rowIdx_ConnStr); //.css({ 'margin-left': '10px' });
        var $rowTables = $rows.eq(rowIdx_Tables); //.css({ 'margin-left': '10px' });
        var $listTables = $rowTables.find('select');
        var $rowQuery = $rows.eq(rowIdx_Query); //.css({ 'margin-left': '10px' });
        var $taQuery = $rowQuery.find('textarea');
        var $btnQuery = $rowQuery.find('input[type=button]').css({ 'margin-left': '120px' });
        var $rowKeys = $rows.eq(rowIdx_Keys); //.css({ 'margin-left': '10px' });
        var $listKeys = $rowKeys.find('select');
        var $rowColChooser = $rows.eq(rowIdx_Fields); //.css({ 'margin-left': '10px' });
        var $listColChooser = $rowColChooser.find('select');
        var $rowSortField = $rows.eq(rowIdx_SortField);
        var $rowSortOrder = $rows.eq(rowIdx_SortOrder);

        // only show query row if enabled
        if (!opts.enableQuery) {
            $rows.eq(0).find('select option').each(function () {
                var $this = $(this);
                if ($this.val() == 'dnn_query' || $this.val() == 'ext_query') $this.remove();
            });
            $rowQuery.hide();
        }

        // hook up click event to load tables for external DB's
        $rowConnStr.find('input[type=button]').click(function () {
            $(this).parent().find('span.ui-state-error').remove();
            loadExternalTables(container);
        });

        var $source = container.find('select:eq(0)');
        $source.change(function () {
            dataSourceChange(container, null);
        });

        $rows.find('input[name=DataSourceType]').css({ 'float': 'left' }).click(function () {
            var $this = $(this);
            var ddl = $this.parent().find('select');
            var ta = $this.parent().find('textarea');
            if (ddl.length > 0) {
                if (this.checked) {
                    $listTables.removeClass('ui-state-disabled');
                    $taQuery.addClass('ui-state-disabled');
                } else {
                    $listTables.addClass('ui-state-disabled');
                    $taQuery.removeClass('ui-state-disabled');
                }
            } else {
                if (this.checked) {
                    $taQuery.removeClass('ui-state-disabled');
                    $listTables.addClass('ui-state-disabled');
                } else {
                    $taQuery.addClass('ui-state-disabled');
                    $listTables.removeClass('ui-state-disabled');
                }
            }
        });

        $listTables.change(function () {
            tableListChange(container, null)
        });

        $btnQuery.click(function () {
            var $this = $(this);
            var connStr = null;
            if ($rowConnStr.is(':visible')) connStr = $rowConnStr.find('input').val();
            if (opts.keyFieldChooser) {
                $rowKeys.show();
                utilLoadColsListFromQuery($listKeys, $taQuery.val(), connStr, opts.xdata, function () {
                    // if displaying field chooser, load that without separate call to server
                    if (opts.fieldChooser) {
                        $rowColChooser.show();
                        $listColChooser.html('').append($listKeys.html());
                    }
                    // callback
                    if (opts.onDataSourceChanged) { opts.onDataSourceChanged(getAllFields(container)) };
                });
            } else {
                // just showing field chooser, not key field chooser
                if (opts.fieldChooser) {
                    $rowColChooser.show();
                    utilLoadColsListFromQuery($listColChooser, $this.val(), connStr, opts.xdata, opts.onDataSourceChanged);
                }
            }
        });

        $listKeys.change(function () {
            if (opts.onKeyFieldChanged) { opts.onKeyFieldChanged($(this).val()); }
        });

        $listColChooser.click(function () {
            if (opts.onSelectedFieldsChanged) {
                opts.onSelectedFieldsChanged(getSelectedFields(container));
            }
        });

        // set initial choices if passed-in
        if (opts.initDataSourceType) {
            $source.val(opts.initDataSourceType);
            dataSourceChange(container, function () {
                if (opts.initConnectionString) {
                    $rowConnStr.find('input[type=text]').val(opts.initConnectionString);
                    loadExternalTables(container,
                        function () {
                            if (opts.initSelectedTable) {
                                $listTables.val(opts.initSelectedTable);
                                tableListChange(container, function () {
                                    if (opts.initSelectedFields) {
                                        for (var i = 0; i < opts.initSelectedFields.length; i++) {
                                            $listColChooser.find('option').each(function () {
                                                if (opts.initSelectedFields[i] == $(this).val()) {
                                                    $(this).get(0).selected = true;
                                                    return false;
                                                }
                                            });
                                        }
                                    } else {
                                        $listColChooser.find('option').each(function () {
                                            this.selected = true;
                                            opts.initSelectedFields.push($(this).val());
                                        });
                                    }
                                    if (opts.onSelectedFieldsChanged) { opts.onSelectedFieldsChanged(opts.initSelectedFields); }
                                    if (opts.initSelectedKeyFields.length) {
                                        for (var i = 0; i < opts.initSelectedKeyFields.length; i++) {
                                            $listKeys.find('option').each(function () {
                                                if (opts.initSelectedKeyFields[i] == $(this).val()) {
                                                    $(this).get(0).selected = true;
                                                    return false;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                } else {
                    if (opts.initSelectedTable) {
                        $listTables.val(opts.initSelectedTable);
                        tableListChange(container, function () {
                            if (opts.initSelectedFields.length) {
                                for (var i = 0; i < opts.initSelectedFields.length; i++) {
                                    $listColChooser.find('option').each(function () {
                                        if (opts.initSelectedFields[i] == $(this).val()) {
                                            $(this).get(0).selected = true;
                                            return false;
                                        }
                                    });
                                }
                            } else {
                                $listColChooser.find('option').each(function () {
                                    this.selected = true;
                                    opts.initSelectedFields.push($(this).val());
                                });
                            }
                            if (opts.onSelectedFieldsChanged) { opts.onSelectedFieldsChanged(opts.initSelectedFields); }
                            if (opts.initSelectedKeyFields) {
                                for (var i = 0; i < opts.initSelectedKeyFields.length; i++) {
                                    $listKeys.find('option').each(function () {
                                        if (opts.initSelectedKeyFields[i] == $(this).val()) {
                                            $(this).get(0).selected = true;
                                            return false;
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

    }

    // functions to support methods
    // returns an object with all the settings
    function getDataSettings($container) {
        return {
            dataSourceType: getDataSourceType($container),
            selectedTable: getSelectedTable($container),
            selectedFields: getSelectedFields($container),
            keyFields: getKeyFields($container),
            allFields: getAllFields($container),
            connectionString: getConnectionString($container),
            query: getQuery($container),
            sortFields: getSortFields($container),
            sortOrder: getSortOrder($container)
        }
    }
    function getQuery($container) {
        var data = $container.data(dataID);
        var opts = data.opts;
        if (!opts.enableQuery) return false;
        var $taQuery = $container.find('div').eq(rowIdx_Query).find('textarea');
        var $lstDataSource = $container.find('div').eq(rowIdx_DataSource).find('select');
        var ds = $lstDataSource.val();
        if (ds == 'ext_query' || ds == 'dnn_query') return $taQuery.val();
        return false;
    }
    function getSelectedFields($container) {
        var data = $container.data(dataID);
        var opts = data.opts;
        if (!opts.fieldChooser) { return false };
        var arrFields = new Array;
        $container.find('div').eq(rowIdx_Fields).find('select').find('option:selected').each(function () {
            arrFields.push($(this).val());
        });
        return arrFields;
    }
    function getKeyFields($container) {
        var data = $container.data(dataID);
        var opts = data.opts;
        if (opts.keyFieldChooser) {
            // only valid if opts.keyChooser is true
            var arrFields = new Array();
            $container.find('div').eq(rowIdx_Keys).find('select option:selected').each(function () {
                arrFields.push($(this).val());
            });
            return arrFields;
        }
        return false;
    }
    function getAllFields($container) {
        var data = $container.data(dataID);
        var opts = data.opts;
        var arrFields = new Array;
        if (opts.keyFieldChooser) {
            $container.find('div').eq(rowIdx_Keys).find('select').find('option').each(function () {
                arrFields.push($(this).val());
            });
        } else if (opts.fieldChooser) {
            $container.find('div').eq(rowIdx_Fields).find('select').find('option').each(function () {
                arrFields.push($(this).val());
            });
        } else { return false }

        return arrFields;
    }
    function getConnectionString($container) {
        var data = $container.data(dataID);
        var opts = data.opts;
        var $rowConnStr = $container.find('div').eq(rowIdx_ConnStr);
        if ($rowConnStr.is(":visible")) {
            return $rowConnStr.find('input[type=text]').val();
        }
        return false;
    }
    function getSelectedTable($container) {
        var $lstDataSource = $container.find('div').eq(rowIdx_DataSource).find('select');
        var $lstTables = $container.find('div').eq(rowIdx_Tables).find('select');
        if ($lstDataSource.val() && $lstTables.val()) return $lstTables.val();
        return false;
    }

    function getDataSourceType($container) {
        return $container.find('select:eq(0)').val()
    }

    function getSortFields($container) {
        var data = $container.data(dataID);
        var opts = data.opts;
        var arrFields = new Array;

        if (opts.enableSort) {
            $container.find('div').eq(rowIdx_SortField).find('option:selected').each(function () {
                arrFields.push($(this).val());
            });
        }
        return arrFields
    }

    function getSortOrder($container) {
        var data = $container.data(dataID);
        var opts = data.opts;
        if (opts.enableSort) {
            return $container.find('div').eq(rowIdx_SortOrder).find('select').val();
        }
        return '';
    }


    // show progress animation
    function showProgress($el) {
        $el.after('<span class="xmp-progress" />');
    }
    function hideProgress($el) {
        $el.siblings('span.xmp-progress:first').remove();
    }

    function utilLoadTablesList($lst, connStr, xdata, onSuccess, onError) {
        showProgress($lst);

        var kbxm_UrlUtil = 'KBXM_DUtils.aspx';
        var kbxm_xdata = xdata;
        var funcData = { method: 'gettablesandviews', xdata: kbxm_xdata };
        if (connStr) {
            funcData = {
                method: 'gettablesextandviews',
                xdata: kbxm_xdata,
                connstr: connStr
            };
        }

        $.ajax({
            type: "GET",
            dataType: "html",
            url: kbxm_UrlUtil,
            data: funcData,
            success: function (data) {
                $lst.html('<option value=""></option>').append(data);
                hideProgress($lst);
                if (onSuccess) { onSuccess(); }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                hideProgress($lst);
                if (onError) { onError(errorThrown); }
            },
            cache: false
        });
    }

    function utilLoadColsList($lst, tableName, connStr, xdata, onSuccess) {
        showProgress($lst);

        var kbxm_UrlUtil = 'KBXM_DUtils.aspx';
        var kbxm_xdata = xdata;
        var funcData = {
            method: 'gettableorviewcols',
            xdata: kbxm_xdata,
            name: tableName
        };
        if (connStr) {
            funcData = {
                method: 'gettableorviewcolsext',
                xdata: kbxm_xdata,
                connstr: connStr,
                name: tableName
            };
        }

        $.ajax({
            type: "GET",
            dataType: "html",
            url: kbxm_UrlUtil,
            data: funcData,
            success: function (data) {
                $lst.html('').append(data);
                hideProgress($lst);
                // call callback, if one has been defined
                if (onSuccess) {
                    var cols = new Array();
                    $lst.find("option").each(function () {
                        cols.push($(this).val());
                    });
                    onSuccess(cols);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                hideProgress($lst);
            },
            cache: false
        });
    }

    function utilLoadColsListFromQuery($lst, query, connStr, xdata, onSuccess) {
        showProgress($lst);

        var kbxm_UrlUtil = 'KBXM_DUtils.aspx';
        var kbxm_xdata = xdata;
        var funcData = {
            method: 'getquerycols',
            xdata: kbxm_xdata,
            query: query
        };
        if (connStr) { funcData.connstr = connStr };

        $.ajax({
            type: "GET",
            dataType: "html",
            url: kbxm_UrlUtil,
            data: funcData,
            success: function (data) {
                $lst.html('').append(data);
                hideProgress($lst);
                // call callback, if one has been defined
                if (onSuccess) {
                    var cols = new Array();
                    $lst.find("option").each(function () {
                        cols.push($(this).val());
                    });
                    onSuccess(cols);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                hideProgress($lst);
            },
            cache: false
        });
    }

    function loadExternalTables($container, callback) {
        var data = $container.data(dataID);
        var opts = data.opts;
        var $rows = $container.children('div')
        var $rowConnStr = $rows.eq(rowIdx_ConnStr);
        var $rowTables = $rows.eq(rowIdx_Tables);
        var $listTables = $rowTables.find('select');

        if ($rowConnStr.find('input').val().trim()) {
            $rowTables.show();
            $listTables.show();
            utilLoadTablesList($listTables, $rowConnStr.find('input').val(), opts.xdata, callback,
                function (errorThrown) {
                    $(this).parent().append('<span class="ui-state-error">' + errorThrown + '</span>');
                });
        } else {
            $(this).parent().append('<span class="ui-state-error">Please enter a valid connection string</span>');
        }
    }

    function dataSourceChange($container, callback) {
        var data = $container.data(dataID);
        var opts = data.opts;
        var $this = $container.find('select:eq(0)')
        var $rows = $container.children('div')
        var $rowConnStr = $rows.eq(rowIdx_ConnStr);
        var $rowKeys = $rows.eq(rowIdx_Keys);
        var $rowTables = $rows.eq(rowIdx_Tables);
        var $rowQuery = $rows.eq(rowIdx_Query);
        var $rowColChooser = $rows.eq(rowIdx_Fields);
        var $listTables = $rowTables.find('select');
        var $rowSortField = $rows.eq(rowIdx_SortField);
        var $rowSortOrder = $rows.eq(rowIdx_SortOrder);

        // initially hide connection string row and table/keyfield selector rows
        $rowConnStr.hide();
        $rowTables.hide();
        $rowKeys.hide();
        $rowColChooser.hide();
        $rowSortField.hide();
        $rowSortOrder.hide();

        if ($this.val() == 'ext_table') {
            // External DB datasource selected.
            $rowConnStr.show(); // show connection string box
            $rowConnStr.find('input[type=button]').show();
            $rowTables.hide();
            $rowQuery.hide();
        } else if ($this.val() == 'ext_query') {
            $rowConnStr.show();
            // Hide Load Tables button in conn str. row
            $rowConnStr.find('input[type=button]').hide();
            $rowTables.hide();
            $rowQuery.show();
        } else if ($this.val() == 'dnn_table') {
            // DNN datasource selected
            $rowTables.show();
            $rowQuery.hide();
            utilLoadTablesList($listTables, null, opts.xdata, callback);
            return;
        } else if ($this.val() == 'dnn_query') {
            // DNN datasource query selected
            $rowTables.hide();
            $rowQuery.show();
        }
        if (callback) { callback() }
    }

    function tableListChange($container, callback) {
        var data = $container.data(dataID);
        var opts = data.opts;

        var $rows = $container.children('div')
        var $rowConnStr = $rows.eq(rowIdx_ConnStr);
        var $rowKeys = $rows.eq(rowIdx_Keys);
        var $listKeys = $rowKeys.find('select');
        var $rowColChooser = $rows.eq(rowIdx_Fields);
        var $listColChooser = $rowColChooser.find('select');
        var $rowTables = $rows.eq(rowIdx_Tables);
        var $listTables = $rowTables.find('select');
        var $rowSortField = $rows.eq(rowIdx_SortField);
        var $listSortField = $rowSortField.find('select');
        var $rowSortOrder = $rows.eq(rowIdx_SortOrder);
        var $listSortOrder = $rowSortOrder.find('select');

        var connStr = null;

        if ($rowConnStr.is(':visible')) connStr = $rowConnStr.find('input').val();
        if (opts.keyFieldChooser) {
            $rowKeys.show();
            utilLoadColsList($listKeys, $listTables.val(), connStr, opts.xdata, function (cols) {
                // if displaying field chooser, load that without separate call to server
                if (opts.fieldChooser) {
                    $rowColChooser.show();
                    $listColChooser.html('').append($listKeys.html());
                }
                if (opts.enableSort) {
                    $rowSortOrder.show();
                    $listSortField.html('').append($listKeys.html());
                    $rowSortField.show();
                }
                if (callback) { callback(); }
                // callback
                if (opts.onDataSourceChanged) {
                    opts.onDataSourceChanged(getAllFields($container))
                };
            });
        } else {
            // just showing field chooser, not key field chooser
            if (opts.fieldChooser) {
                $rowColChooser.show();
                utilLoadColsList($listColChooser, $listTables.val(), connStr, opts.xdata, function () {
                    if (opts.enableSort) {
                        $rowSortOrder.show();
                        $listSortField.html('').append($listColChooser.html());
                        $rowSortField.show();
                    }
                    if (callback) { callback(); }
                    opts.onDataSourceChanged;
                });
            }
        }

    }
})(jQuery);