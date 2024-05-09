  //weather weight
!(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (!d.getElementById(id)) {
    js = d.createElement(s);
    js.id = id;
    js.src = "https://weatherwidget.io/js/widget.min.js";
    fjs.parentNode.insertBefore(js, fjs);
  }
})(document, "script", "weatherwidget-io-js");

var timeout_date = window.setInterval(( () => Update_date() ), 1000);

//change time
function Update_date(){
var date = new Date();
var options = {
  hour: "2-digit", //(e.g., 02)
  minute: "2-digit", //(e.g., 02)
  hour12: false, // 24 小時制
  timeZone: "Asia/Taipei" // 美國/紐約
};
var wea = document.getElementsByClassName("weatherwidget-io");
options.timeZone = "Asia/Taipei";
wea[0].setAttribute("data-label_1", date.toLocaleTimeString("en-GB", options));
options.timeZone = "Asia/Tokyo";
wea[1].setAttribute("data-label_1", date.toLocaleTimeString("en-GB", options));
options.timeZone = "Europe/London";
wea[2].setAttribute("data-label_1", date.toLocaleTimeString("en-GB", options));
options.timeZone = "America/New_York";
wea[3].setAttribute("data-label_1", date.toLocaleTimeString("en-GB", options));
}
