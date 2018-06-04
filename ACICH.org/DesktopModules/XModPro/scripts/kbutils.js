var Utils = {
    startLoading: function (el, position) {
        var spinner = $('<span class="fa fa-gear fa-spin progress-spinner"></span>');
        if (!position) position = 'after';
        switch (position.toLowerCase()) {
            case 'before': $(el).before(spinner); break;
            case 'after': $(el).after(spinner); break;
            case 'prepend': $(el).prepend(spinner); break;
            case 'append': $(el).append(spinner); break;
            default : $(el).after(spinner); break;
        }
        return spinner;
    },

    hideBsModal : function($modal) {
        $modal.modal('hide');
        $('.modal-backdrop').hide();
        $('body').removeClass('modal-open');

    },

    showBlockMessage: function(message, cssClass, dismissable, el, position, fade, fadeCallback) {
        var html = '<div';
        if (cssClass) html += ' class="' + cssClass + '"';
        html += '>';
        if (fade) dismissable = false;
        if (dismissable) html +=
            '<button type="button" class="close">' +
            '<span aria-hidden="true">&times;</span>' +
            '<span class="sr-only">Close</span></button>';
        html += message + '</div>';
        var $msg = $(html);
        if (!position) position = 'after';
        switch (position.toLowerCase()) {
            case 'before': $(el).before($msg); break;
            case 'after': $(el).after($msg); break;
            case 'prepend': $(el).prepend($msg); break;
            case 'append': $(el).append($msg); break;
            default : $(el).after($msg); break;
        }
        if (fade) {
            $msg.delay(fade).fadeOut(fadeCallback);
        }
        $msg.on('click','button',function(e) {
            e.preventDefault();
            $msg.fadeOut(function(){
                $msg.remove();
            });
        });
        return $msg;
    },

    showInlineMessage: function(message, cssClass, dismissable, el, position, fade, fadeCallback) {
        var html = '<span style="display:inline-block;"';
        if (cssClass) html += ' class="' + cssClass + '"';
        html += '>';
        if (fade) dismissable = false;
        if (dismissable) html +=
            '<button type="button" class="close">' +
            '<span aria-hidden="true">&times;</span>' +
            '<span class="sr-only">Close</span></button>';
        html += message + '</span>';
        var $msg = $(html);
        if (!position) position = 'after';
        switch (position.toLowerCase()) {
            case 'before':
                $msg.css({'margin-right':'5px'});
                $(el).before($msg); break;
            case 'after':
                $msg.css({'margin-left':'5px'});
                $(el).after($msg);
                break;
            case 'prepend': $(el).prepend($msg); break;
            case 'append': $(el).append($msg); break;
            default : $(el).after($msg); break;
        }
        if (fade) {
            $msg.delay(fade).fadeOut(fadeCallback);
        }
        $msg.on('click','button',function(e) {
            e.preventDefault();
            $msg.fadeOut(function(){
                $msg.remove();
            });
        });
        return $msg;
    },

    showInlineWarning: function(message, el, fade, fadeCallback) {
        var dismissable = (fade) ? false : true;
        return this.showInlineMessage(
            message, 'text-warning bg-warning alert', dismissable, el, 'after', fade, fadeCallback);
    },
    showInlineError: function(message, el, fade, fadeCallback) {
        var dismissable = (fade) ? false : true;
        return this.showInlineMessage(
            message, 'text-danger bg-danger alert', dismissable, el, 'after', fade, fadeCallback);
    },
    showInlineSuccess: function(message, el, fade, fadeCallback) {
        var dismissable = (fade) ? false : true;
        return this.showInlineMessage(
            message, 'text-success bg-success alert', dismissable, el, 'after', fade, fadeCallback);
    },
    showBlockWarning: function(message, el, fade, fadeCallback) {
        var dismissable = (fade) ? false : true;
        return this.showBlockMessage(
            message, 'text-warning bg-warning alert', dismissable, el, 'after', fade, fadeCallback);
    },
    showBlockError: function(message, el, fade, fadeCallback) {
        var dismissable = (fade) ? false : true;
        return this.showBlockMessage(
            message, 'text-danger bg-danger alert', dismissable, el, 'after', fade, fadeCallback);
    },
    showBlockSuccess: function(message, el, fade, fadeCallback) {
        var dismissable = (fade) ? false : true;
        return this.showBlockMessage(
            message, 'text-success bg-success alert', dismissable, el, 'after', fade, fadeCallback);
    }

};

