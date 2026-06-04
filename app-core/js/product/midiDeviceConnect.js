$(function () {

    $('#midiSelectorIn').on('elf-changed', function(e,v){
        this.value = v;
    });
    $('#midiSelectorOut').on('elf-changed', function(e,v){
        this.value = v;
    });
    /* on click event */
    $('#bMidiDeviceConnect').on('click', function () {
        $es.connect();
    });
});
