
var data = [];
var tables = [];
$(document).ready(function(){
    var $tables = $("#event-history").children("table");
    /*
    *   create options form
    */
    //event options
    var $eventOptions = $('<div class="column"/>');
    $eventOptions.append('<h2>Events</h2>');
    for(let i = 0; i < $tables.length; i++){
        var id = $tables[i].firstElementChild.firstElementChild.firstElementChild.firstChild.textContent.trim().replace("\n\n        ", "");
        $eventOptions.append('<input type="checkbox" id="' + id + '" style="margin: 0px 10px 0px 3px;" checked>');
        $eventOptions.append('<label for="' + id + '">' + id + '</label><br>');
        tables[i] = {id: id, table:$tables[i], include: true};
    }
    //other options
    var $otherOptions = $('<div class="column"/>');
    $otherOptions.append('<h2>Other</h2>');
    $otherOptions.append('<input type="checkbox" id="inc_wind" style="margin: 0px 10px 0px 3px;">');
    $otherOptions.append('<label for="inc_wind">Include wind-aided marks</label><br>');


    $csvButton = $('<button type="button" id="csvButton">.csv</button>');
    $csvButton.on('click', getAllData);
    $eventOptions.append($csvButton);
    $("#event-history").find(".row")
        .after($("<div/>", {
            id: 'data_options',
            class: 'row',
            append: $eventOptions
        }));
    $eventOptions.after($otherOptions);
})

function getAllData(){
    for(let i = 0; i < tables.length; i++){
        var eventName = tables[i].table.firstElementChild.firstElementChild.firstElementChild.firstChild.textContent.trim().replace("\n\n        ", "");
        if(!eventName.includes("Relay")){
            datum = {event: eventName, marks: []};
            var body = tables[i].table.children[1];
            var entries = [];
            for(let i = 0; i < body.children.length; i++){
                var mark = body.children[i].firstElementChild.textContent.split(/\s/g).filter(e => e);
                var entry = {mark: mark[0], wind: 0, date: ""};
                if(mark.length > 1){
                    entry.wind = mark[1];
                }
                entry.date = body.children[i].lastElementChild.textContent.trim();
                entries.push(entry);
            }
            datum.marks = entries;
            data.push(datum);
        }
    }
    console.log(data);
    writeToFile(data, "test")
}

function writeToFile(){
    let csvContent = "data:text/csv;charset=utf-8,";

    data.forEach(function(entry) {
        entry.marks.forEach(function(mark) {
            var row = entry.event;
            row += "," + mark.mark + "," + mark.wind + "," + mark.date + "\r\n";
            csvContent += row;
        });
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}