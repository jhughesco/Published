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