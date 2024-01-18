const scriptURL = 'https://script.google.com/macros/s/AKfycbxACf_6PaVoH1nPebBbf4D9KhcGkY5nuz0Km2ozPzXsItwwRa8/exec';
const form = document.forms['submit-to-google-sheet'];
var sheetRefresh = true;

// Define spreadsheet URL.
var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1rh6hO1zihGpc4LMabX1sv3RCrLRFKAI6QqflXq_NCiM/edit#gid=0';


//returns HTML for each row
function formatRow(row){
    //console.log("rowTemplate called");
    var rowHTML = "";
    //create theader
    if (row.num === 0){
        rowHTML += "<tr>";
        for (var i=0;i<row.labels.length; i++){
            rowHTML += "<td>"+row.labels[i]+"</td>";
        }
        rowHTML += "</tr>";
        return rowHTML;
    }
    //create tbody
    else {
        rowHTML += "<tr>";
        for (var i=0;i<row.cellsArray.length; i++){
            if (row.labels[i] === "Link"){
                rowHTML += "<td class=\"url\"><a href=\""+row.cellsArray[i]+"\" target=\"_blank\">"+row.cellsArray[i]+"</a></td>";
            }
            else if (row.labels[i] === "timestamp"){
                rowHTML += "<td class=\"time\">"+row.cellsArray[i]+"</td>";
            }
            else if (row.labels[i] === "contributor"){
                rowHTML += "<td class=\"name\">"+row.cellsArray[i]+"</td>";
            }
            else{
                rowHTML += "<td>"+row.cellsArray[i]+"</td>";
            }
        }
        rowHTML += "</tr>";
        return rowHTML;
    }
}

function initialLoad(){
    $('#feed').sheetrock({
        url: mySpreadsheet,
        query: "select A,B,C order by C desc",
        reset: sheetRefresh,
        rowTemplate: formatRow,
        callback: function(error, options, response) {
            if (error === null) {
                $('#feed').html(response.html);
            }
        }
    });
}

initialLoad();

// Load and refresh data from google sheet.
setInterval(function() {
    //console.log("refresh set");
    $('#feed').sheetrock({
        url: mySpreadsheet,
        query: "select A,B,C order by C desc",
        reset: sheetRefresh,
        rowTemplate: formatRow,
        callback: function(error, options, response) {
            if (error === null) {
                $('#feed').html(response.html);
            }
        }
    });
}, 15 * 1000);

// Submit form and add to Google Sheet
form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))
    form.reset();
});

//top bar
$('.button').on('click', function () {
    $('.top').toggleClass('active');
  });

