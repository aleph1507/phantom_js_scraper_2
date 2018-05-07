var links = [];
var casper = require("casper").create({
    pageSettings: {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"
    }
});

var nabavki_url = 'https://www.e-nabavki.gov.mk/PublicAccess/home.aspx#/notices';
var currentPage = 1;
var jobs = [];

console.log(nabavki_url);

var terminate = function() {
    this.echo("Exiting..").exit();
};

var processPage = function() {
    // Part 1: Scrape and print the jobs in the jobs table
    jobs = this.evaluate(getJobs);
    require('utils').dump(jobs);

    // Part 2: Exit if we're finished scraping
    if (currentPage >= 3 || !this.exists("table#jobs")) {
        return terminate.call(casper);
    }

    // Part 3: Click the Next link and wait for the next page 
    // of jobs to load
    currentPage++;

    this.thenClick("li#next a").then(function() {
        this.waitFor(function() {
            return currentPage === this.evaluate(getSelectedPage);
        }, processPage, terminate);
    });
};

function getJobs() {
    var rows = document.querySelectorAll('table#notices-grid td');
    var jobs = [];

    console.log('rows:');
    console.log(rows);

    for (var i = 0, row; row = rows[i]; i++) {
    	var job = {};
    	job['broj_na_oglas'] = row.cells[1].querySelector('a').innerText;
        job['dogovoren_organ'] = row.cells[2].innerText;
        job['predmet_na_dogovorot'] = row.cells[3].innerText;
        job['vid_na_dogovorot'] = row.cells[4].innerText;
        job['vid_na_postapka'] = row.cells[5].innerText;
        job['datum_na_objava'] = row.cells[6].innerText;
        job['kraen_rok'] = row.cells[7].innerText;
        // var a = row.cells[1].querySelector('a');
        // var l = row.cells[2].querySelector('span');
        var job = {};

        // job['title'] = a.innerText;
        // job['url'] = a.getAttribute('href');
        // job['location'] = l.innerText;
        jobs.push(job);
    } 

    return jobs;       
}

// Return the current page by looking for the disabled page number link in the pager
function getSelectedPage() {
    var el = document.querySelector('li[class="active"]');
    return parseInt(el.textContent);
}

casper.start(nabavki_url);
casper.waitForSelector('a.show-documents', processPage, terminate);
casper.run();
