(function($){
    $.fn.xmpCharCount = function(options){
       	var defaults = {
		    maxlength: 0, 
		    classname: 'xmp-charcount',
		    label: '', 
		    countmethod: 'down'
    	};
	
	    options = $.extend(defaults, options);

        return this.each(function(){
            $(this).after("<span></span>")
                .next()
                .css({'padding-left':'3px','padding-right':'3px'})
                .addClass(options.classname)
                .hide()
                .end()
                .keypress( function(e){
					var current = $(this).val().length;
					if ((options.maxlength > 0) && (current >= options.maxlength)) {
						if (e.which != 0 && e.which != 8) {
							e.preventDefault();
						}
					}
                })
                .keyup( function(e){
                    var current = $(this).val().length;
                    if (options.countmethod == 'up'){
                        jQuery(this).next().show().text(current + options.label);
                    }
                    else {
                        jQuery(this).next().show().text(options.maxlength - current + options.label);
                    }
                });
        });
    }
})(jQuery);

function xmp_CheckBoxValidatorEvaluateIsValid(val){
    var control = document.getElementById(val.controltovalidate);
    var mustBeChecked = Boolean(val.mustBeChecked == 'true');
    return control.checked == mustBeChecked;
  }

