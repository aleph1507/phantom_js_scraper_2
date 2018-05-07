var fs = require('fs');

var url = 'https://www.e-nabavki.gov.mk/PublicAccess/home.aspx#/notices';

// var page = require('webpage').create();
// page.onConsoleMessage = function(msg) {
//   console.log('Page title is ' + msg);
// };
// page.open(url, function(status) {
//   var title = page.evaluate(function() {
//     return document.title;
//   });
//   console.log('Page title is ' + title);
//   phantom.exit();
// });

var page = require('webpage').create();
//page.setings.userAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64)";
page.viewportSize = {width:1280, height: 1024};

page.onConsoleMessage = function(msg){
	// console.log(msg);
}

page.open(url, function(status) {
  console.log("Status: " + status);
  if(status !== "success") {
  		console.log('unable to load address: ' + url);
  		phantom.exit();
  } else {
  	// 	console.log('pred timeout');
  	// 	window.setTimeout(function(){
  	// 		console.log('vo timeout');
			// page.render('example.png');
   //  		console.log(page.plainText);
   //  		phantom.exit();
  	// 	}, 1000);

  		window.setTimeout(function(){
  			var tds = page.evaluate(function(){
          // var c[];
  				var celltexts = '';
  				var cells = document.querySelectorAll('table#notices-grid td');
  				for(var i = 0; i<cells.length; i++){
            // cts[] = cell[i].innerText;
            // if((i+1) % 8 == 0){
            //   c.push(...cts) = ...cts;
            // }
  					celltexts+=cells[i].innerText + ' -|- ';
            if((i+1) % 8 == 0)
              celltexts+="\n---novred---\n";
  				}
  				//return document.querySelectorAll('table#notices-grid td').innerText;
  				// return celltext;
          return celltexts;
  			});
  			page.render('example.png');
  			var path = 'tabela.txt';
        // var tdArray = tds.split("---novred---");
        // for(var td in tdArray){
        //   console.log(td);
        // }
  			var content = tds;
  			// fs.write(path, content, 'w');
        console.log(content);
  			phantom.exit();
  		}, 1000);

  		// find element to send click to
   		 var element = document.querySelector( 'li#next a' );

	    // create a mouse click event
	    var event = document.createEvent( 'MouseEvents' );
	    event.initMouseEvent( 'click', true, true, window, 1, 0, 0 );

	    // send click to element
	    element.dispatchEvent( event );
  }

});
