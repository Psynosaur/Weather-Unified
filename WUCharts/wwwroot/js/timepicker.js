let loaded = false;
$(document).ready(function () {
    $('.timepicker').timepicker({
        timeFormat: 'HH:mm',
        interval: 60,
        minTime: '0',
        maxTime: lh,
        defaultTime: lh,
        startTime: '0',
        dynamic: false,
        dropdown: true,
        scrollbar: false,
        change: function (time) {
            if (loaded) {
                window.location = '/hour/' + time.getHours();
            }
            loaded = true;
        }
    })

});