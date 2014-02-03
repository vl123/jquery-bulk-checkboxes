/**
 * jQuery Bulk Checkboxes
 *
 * @version 0.3
 * @author vl
 * @license MIT License http://www.opensource.org/licenses/mit-license.php
 * @todo add select/unselect all check on shift key event; push cb values to selectedItems on shift key event
 */

(function($) {

    var selectedItems = [],
        $checkboxes,
        settings;

    var methods = {
        init: function(options) {
            console.log('init');
            settings = $.extend({ // merge default and user defined values
                checkboxes:     'input[type=checkbox]',
                selectAll:      '',
                exclude:        '',
                itemsHolder:    ''
            }, options);

            var $this           = $(this),
                lastChecked     = this;

            $checkboxes = $this.find(settings.checkboxes).not(settings.selectAll).not(settings.exclude);

            $(document).ajaxComplete(function() {
                $checkboxes = $this.find(settings.checkboxes).not(settings.selectAll).not(settings.exclude);
            });

            // check / uncheck all
            $this.on('click', settings.selectAll, function() {
                console.log('selectAll clicked');
                selectedItems = [];
                if ($(this).is(':checked')) {
                    methods.selectAll();
                } else {
                    methods.clearSelection();
                }
            });

            var itemSelector = settings.checkboxes + ':not(' + settings.selectAll + ')';
            $this.on('click', itemSelector, function(event) {
                var $checkbox   = $(this),
                    value       = $checkbox.val();

                if ($checkbox.is(':checked')) {
                    var selectAllCount  = $(settings.selectAll).length,
                        totalItems      = $this.find(settings.checkboxes).length - selectAllCount,
                        checkedItems    = $this.find(settings.checkboxes + ':checked').length;

                    if (totalItems === checkedItems) {
                        $(settings.selectAll).prop('checked', true);
                    }

                    // refactoring
                    selectedItems.push(value);
                } else {
                    $(settings.selectAll).prop('checked', false);

                    // refactoring
                    var valPos = $.inArray(value, selectedItems);
                    if (-1 !== valPos) {
                        selectedItems.splice(valPos, 1);
                    }
                }

                // multiply select - https://gist.github.com/DelvarWorld/3784055
                if (!lastChecked) {
                    lastChecked = this;
                }

                if (event.shiftKey) {
                    var start   = $checkboxes.index(this),
                        end     = $checkboxes.index(lastChecked);

                    $checkboxes.slice(Math.min(start, end), Math.max(start, end) + 1)
                        .prop('checked', lastChecked.checked)
                        .trigger('change');

                    console.log('start = ' + start + ', end = ' + end);
                }
                lastChecked = this;
                // END multiply select
            });
        },
        getSelectedItems: function() {
            return selectedItems;
        },
        clearSelection: function() {
            selectedItems = [];
            $checkboxes.prop('checked', false);
            $(settings.selectAll).prop('checked', false);
        },
        selectAll: function() {
            selectedItems = [];
            $checkboxes.prop('checked', true);
            $(settings.selectAll).prop('checked', true);
            $checkboxes.each(function() {
                selectedItems.push($(this).val());
            });
        }
    };

    $.fn.bulkCheckboxes = function(methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            console.log('Can not find method ' + methodOrOptions);
        }
    };

}(jQuery));