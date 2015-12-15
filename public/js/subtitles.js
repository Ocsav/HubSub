subtitles = []; //Json array

function loadSubtitles() {
    $.ajax({
        url: '/subtitles/Dragon_Ball_Super/Dragon_Ball_Super_-_01x01?type=srt',
        complete: function (data) {
            //Split text, matching double newline
            rawData = data.responseText.split(/\n\s*\n/g);
            for (entry in rawData) {
                content = rawData[entry].split(/\n/);
                currentJson = {text: ""};
                //Iterate over entry params (frame, begin, end, text)
                for (param in content) {
                    switch (parseInt(param)) {
                        case 0:
                            currentJson['id'] = $.trim(content[param]);
                            break;
                        case 1:
                            beginEnd = content[param].split(" --> ");
                            currentJson['begin'] = $.trim(beginEnd[0]);
                            currentJson['end'] = $.trim(beginEnd[1]);
                            break;
                        case 2:
                            currentJson['text'] = $.trim(content[param]);
                            break;

                        default:
                            currentJson['text'] += "\n" + $.trim(content[param]);
                    }
                }
                subtitles.push(currentJson); //Add currentJson to array subtitles
            }
            //Create an HTML table to show subtitles
            var divContainer = $("#subtitlesDiv");
            var divHeader = "<div class='thead'>" +
                "<div class='cell'>#</div>" +
                "<div class='cell'>Begin</div>" +
                "<div class='cell'>End</div>" +
                "<div class='cell'>Text</div></div>";
            divContainer.append(divHeader);

            for (var i = 0; i < subtitles.length; i++) {
                var row = $("<div class='row' />").attr("id", "row"+subtitles[i]["id"]);
                lineCells = "<div class='cell'>" + subtitles[i]["id"] + "</div>";
                lineCells += "<div class='cell'>" + subtitles[i]["begin"] + "</div>";
                lineCells += "<div class='cell'>" + subtitles[i]["end"] + "</div>";
                lineCells += "<div class='cell'>" + subtitles[i]["text"] + "</div></div>";
                row.append(lineCells);
                row.on("click", {id: subtitles[i]["id"]}, showDialog);
                divContainer.append(row);
            }
        }
    });
}

function showDialog(event){
    line = getLine(event.data.id);
    $("#lineNumber").val(line["obj"]["id"]);
    $("#begin").val(line["obj"]["begin"]);
    $("#end").val(line["obj"]["end"]);
    $("#lineText").val(line["obj"]["text"]);

    $("#saveButton").on("click", {idRow: line["idx"]}, modifyLine);

}

function modifyLine(event){
    idSub = event.data.idRow;
    subtitles[idSub]["id"] = $("#lineNumber").val();
    subtitles[idSub]["begin"] = $("#begin").val();
    subtitles[idSub]["end"] = $("#end").val();
    subtitles[idSub]["text"] = $("#lineText").val();
    refreshSubtitle("row"+subtitles[idSub]["id"], idSub);
}

function getLine(id){
    for (var i = 0; i < subtitles.length; i++) {
        if (subtitles[i]["id"] == id){
            return {idx: i, obj: subtitles[i]};
        }
    }
}

function refreshSubtitle(idRow, idSub){
    lineCells = "<div class='cell'>" + subtitles[idSub]["id"] + "</div>";
    lineCells += "<div class='cell'>" + subtitles[idSub]["begin"] + "</div>";
    lineCells += "<div class='cell'>" + subtitles[idSub]["end"] + "</div>";
    lineCells += "<div class='cell'>" + subtitles[idSub]["text"] + "</div></div>";
    var row = $("#"+idRow).empty();
    row.append(lineCells);
}