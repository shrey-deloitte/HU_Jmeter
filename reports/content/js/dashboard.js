/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9081632653061225, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1"], "isController": false}, {"data": [0.5, 500, 1500, "signUp"], "isController": true}, {"data": [0.0, 500, 1500, "logout"], "isController": true}, {"data": [1.0, 500, 1500, "https://hls.demoblaze.com/about_demo_hls_600k.m3u8"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-12"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.demoblaze.com/bycat"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.demoblaze.com/viewcart"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-2"], "isController": false}, {"data": [0.0, 500, 1500, "addToCart"], "isController": true}, {"data": [1.0, 500, 1500, "https://api.demoblaze.com/check"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-9"], "isController": false}, {"data": [0.0, 500, 1500, "sendMessage"], "isController": true}, {"data": [1.0, 500, 1500, "https://api.demoblaze.com/view"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-5"], "isController": false}, {"data": [0.625, 500, 1500, "https://www.demoblaze.com/index.html-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-6"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.demoblaze.com/index.html-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.demoblaze.com/index.html-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=8-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.demoblaze.com/deletecart"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-11"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.demoblaze.com/cart.html#"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://api.demoblaze.com/entries"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-5"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.demoblaze.com/index.html-8"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.demoblaze.com/index.html-7"], "isController": false}, {"data": [0.625, 500, 1500, "https://www.demoblaze.com/index.html-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.demoblaze.com/cart.html"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-4"], "isController": false}, {"data": [0.625, 500, 1500, "https://www.demoblaze.com/index.html-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/index.html-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=1-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-9"], "isController": false}, {"data": [0.5, 500, 1500, "https://api.demoblaze.com/signup"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-14"], "isController": false}, {"data": [0.5, 500, 1500, "https://api.demoblaze.com/login"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://hls.demoblaze.com/about_demo_hls_600k00000.ts"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://hls.demoblaze.com/index.m3u8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html#-11"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.demoblaze.com/prod.html?idp_=10"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.demoblaze.com/deleteitem"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/config.json"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.demoblaze.com/index.html"], "isController": false}, {"data": [0.5, 500, 1500, "invalidLogin"], "isController": true}, {"data": [1.0, 500, 1500, "https://api.demoblaze.com/addtocart"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.demoblaze.com/cart.html-9"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 239, 0, 0.0, 325.1673640167363, 37, 1638, 307.0, 544.0, 696.0, 1566.7999999999995, 1.5828443514311827, 39.22063180076692, 1.2247809205167093], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 1, 0, 0.0, 1014.0, 1014, 1014, 1014.0, 1014.0, 1014.0, 1014.0, 0.9861932938856016, 25.81919532790927, 7.045888806706114], "isController": false}, {"data": ["signUp", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.35714285714285715, 0.8519345238095237], "isController": true}, {"data": ["logout", 1, 0, 0.0, 2728.0, 2728, 2728, 2728.0, 2728.0, 2728.0, 2728.0, 0.36656891495601174, 360.08522727272725, 3.7795259805718473], "isController": true}, {"data": ["https://hls.demoblaze.com/about_demo_hls_600k.m3u8", 13, 0, 0.0, 42.153846153846146, 37, 45, 43.0, 45.0, 45.0, 45.0, 0.08824387892939811, 0.17695178065965694, 0.036797008108254876], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8", 1, 0, 0.0, 936.0, 936, 936, 936.0, 936.0, 936.0, 936.0, 1.0683760683760686, 7.923093616452991, 7.659129607371795], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-11", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 0.526577818627451, 1.860574959150327], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-12", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.5353249584717609, 1.771438953488372], "isController": false}, {"data": ["login", 1, 0, 0.0, 4789.0, 4789, 4789, 4789.0, 4789.0, 4789.0, 4789.0, 0.20881186051367717, 205.62258561286282, 2.915821087387764], "isController": true}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-10", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.5389057274247492, 1.8845369983277593], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-3", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 1.5059141355140186, 5.2843896028037385], "isController": false}, {"data": ["https://api.demoblaze.com/bycat", 3, 0, 0.0, 336.6666666666667, 323, 350, 337.0, 350.0, 350.0, 350.0, 0.12686062246278754, 0.22064332871701625, 0.053849691305818674], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-4", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.5443676097972974, 1.8244562922297298], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-5", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 1.5953743811881187, 5.346921410891089], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-6", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5335523592715232, 1.7526386589403975], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-0", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 52.357497724514566, 1.2491466929611652], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-1", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.530042146381579, 1.7571700246710527], "isController": false}, {"data": ["https://api.demoblaze.com/viewcart", 2, 0, 0.0, 362.0, 357, 367, 362.0, 367.0, 367.0, 367.0, 0.1563721657544957, 0.065511385848319, 0.07177238076622362], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-2", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 1.6442123724489794, 5.829480229591836], "isController": false}, {"data": ["addToCart", 1, 0, 0.0, 23131.0, 23131, 23131, 23131.0, 23131.0, 23131.0, 23131.0, 0.04323202628507198, 47.42000217511132, 3.3448669399290996], "isController": true}, {"data": ["https://api.demoblaze.com/check", 11, 0, 0.0, 373.81818181818187, 319, 489, 333.0, 488.8, 489.0, 489.0, 0.07446772501100092, 0.022206772754967335, 0.03301596401854923], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-7", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 1.5201208726415094, 5.288178066037736], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-8", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.537109375, 1.8717447916666667], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-9", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 1.5201208726415094, 5.527712264150944], "isController": false}, {"data": ["sendMessage", 1, 0, 0.0, 3077.0, 3077, 3077, 3077.0, 3077.0, 3077.0, 3077.0, 0.32499187520311995, 323.78172479281767, 3.4949321579460513], "isController": true}, {"data": ["https://api.demoblaze.com/view", 8, 0, 0.0, 326.87499999999994, 316, 340, 325.0, 340.0, 340.0, 340.0, 0.19751135690302193, 0.10550655490815722, 0.08204725922131148], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-2", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 1.5345982142857144, 5.440848214285714], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-1", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 0.5283043032786885, 1.7514088114754098], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-0", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 17.487644768370608, 1.6473642172523961], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-9", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 0.5231584821428571, 1.9023944805194806], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-8", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 1.5643962378640777, 5.4516838592233015], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-7", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 0.5197832661290323, 1.8082157258064517], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-6", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5019713785046729, 1.64889992211838], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-5", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 1.549353966346154, 5.192683293269231], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-4", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 0.5231584821428571, 1.7533735795454546], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-3", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 0.5248625814332247, 1.841790513029316], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-8", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5335523592715232, 1.859349130794702], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-9", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.5425347222222222, 1.9728535353535355], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-4", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.530042146381579, 1.7764442845394737], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-5", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 0.526577818627451, 1.7648335375816995], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-11", 4, 0, 0.0, 564.5, 276, 666, 658.0, 666.0, 666.0, 666.0, 0.06325510784995889, 9.89618131878993, 0.03397491144284901], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-6", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5335523592715232, 1.7526386589403975], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-10", 4, 0, 0.0, 454.75, 338, 552, 464.5, 552.0, 552.0, 552.0, 0.06355057036636905, 2.2289866067172954, 0.03407154602650059], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-7", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 0.5099139636075949, 1.7738825158227849], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-13", 4, 0, 0.0, 208.0, 108, 312, 206.0, 312.0, 312.0, 312.0, 0.0636983247340595, 0.5793499486432256, 0.034337378176953946], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-0", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 17.40451388888889, 1.6338045634920635], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-12", 4, 0, 0.0, 466.25, 234, 616, 507.5, 616.0, 616.0, 616.0, 0.0633904375524952, 4.510285346111789, 0.0355952163991062], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-1", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5335523592715232, 1.7688069122516556], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-15", 4, 0, 0.0, 254.5, 106, 308, 302.0, 308.0, 308.0, 308.0, 0.06372470925601402, 0.18023700115501035, 0.03248466624183527], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-2", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 1.5953743811881187, 5.656327351485148], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-14", 4, 0, 0.0, 265.75, 115, 319, 314.5, 319.0, 319.0, 319.0, 0.0637165886138456, 0.9639156282853866, 0.034720562936060406], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=8-3", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 0.5131618232484076, 1.800731488853503], "isController": false}, {"data": ["https://api.demoblaze.com/deletecart", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4592965182648402, 0.996628852739726], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-11", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.530042146381579, 1.872815583881579], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 7.227950155417408, 7.384928674511546], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-10", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 1.4782826834862386, 5.169509747706422], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10-12", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 0.5283043032786885, 1.7482069672131149], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-4", 4, 0, 0.0, 324.25, 261, 471, 282.5, 471.0, 471.0, 471.0, 0.06340852527622338, 0.07957026853510454, 0.03269502084555269], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-11", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 1.5953743811881187, 5.63698948019802], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-10", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.5353249584717609, 1.9466362126245849], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-3", 4, 0, 0.0, 400.5, 290, 492, 410.0, 492.0, 492.0, 492.0, 0.0635919937679846, 0.7701679772579132, 0.0344042622533823], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 8, 0, 0.0, 376.99999999999994, 339, 521, 351.0, 521.0, 521.0, 521.0, 0.0541546793027585, 0.1550071924183449, 0.019408952445422237], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-10", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 1.5643962378640777, 5.470646237864078], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-6", 4, 0, 0.0, 278.25, 110, 462, 270.5, 462.0, 462.0, 462.0, 0.06341857847256353, 0.2640169922153695, 0.032018950263979835], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-5", 4, 0, 0.0, 367.25, 257, 474, 369.0, 474.0, 474.0, 474.0, 0.06340852527622338, 0.060900668563638384, 0.03269502084555269], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-8", 4, 0, 0.0, 434.0, 334, 536, 433.0, 536.0, 536.0, 536.0, 0.06366182836771071, 2.122475410618793, 0.032390441972243444], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-7", 4, 0, 0.0, 507.0, 340, 652, 518.0, 652.0, 652.0, 652.0, 0.0633282143026772, 1.7125210764213228, 0.032344390703418144], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-9", 4, 0, 0.0, 495.0, 370, 541, 534.5, 541.0, 541.0, 541.0, 0.06333924499619965, 2.158668272580441, 0.03228816981251583], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-1", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 0.5248625814332247, 1.7399989820846906], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-0", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 18.915795819935692, 1.6328376205787782], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 1, 0, 0.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 19.465382148093845, 8.056879276637343], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-3", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5214654126213593, 1.861473503236246], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-2", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 1.5201208726415094, 5.38951945754717], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-0", 4, 0, 0.0, 401.0, 309, 478, 408.5, 478.0, 478.0, 478.0, 0.06335629999208046, 0.7755114288825533, 0.03223499247643938], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-5", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5317914603960396, 1.7823071369636965], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-4", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5148013178913738, 1.806484624600639], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-2", 4, 0, 0.0, 509.25, 342, 607, 544.0, 607.0, 607.0, 607.0, 0.06327411930335194, 1.7607692056725248, 0.03460303399402059], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-11", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 1.611328125, 5.634765625], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-7", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 1.549353966346154, 5.089393028846154], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-1", 4, 0, 0.0, 373.5, 270, 461, 381.5, 461.0, 461.0, 461.0, 0.06357683260219975, 0.3404216534744739, 0.032409283806980736], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-12", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 9.39375517384106, 1.6847319950331126], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-10", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 1.5953743811881187, 5.8013613861386135], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-6", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 0.5197832661290323, 1.742061491935484], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-13", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 20.068836522801302, 1.8036186889250814], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-9", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 0.5231584821428571, 1.8231280438311688], "isController": false}, {"data": ["https://api.demoblaze.com/signup", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.35714285714285715, 0.8519345238095237], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-12", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 0.526577818627451, 1.860574959150327], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-8", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 0.5407141359060403, 1.8810297818791948], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-14", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 9.778474506578947, 1.6736482319078947], "isController": false}, {"data": ["https://api.demoblaze.com/login", 3, 0, 0.0, 711.6666666666666, 696, 723, 716.0, 723.0, 723.0, 723.0, 4.149377593360996, 1.0130316390041494, 1.851821836099585], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-0", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 18.657146516393443, 1.6649590163934427], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-2", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5214654126213593, 1.8488319174757282], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-1", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 0.5248625814332247, 1.7399989820846906], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-4", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 0.5283043032786885, 1.8538678278688525], "isController": false}, {"data": ["https://hls.demoblaze.com/about_demo_hls_600k00000.ts", 13, 0, 0.0, 110.0, 37, 270, 43.0, 268.8, 270.0, 270.0, 0.08824387892939811, 14.412773577237154, 0.03705553509730585], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-3", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 10.663685691318328, 1.771000803858521], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-6", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.530042146381579, 1.7764442845394737], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-5", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5214654126213593, 1.7476992313915858], "isController": false}, {"data": ["https://hls.demoblaze.com/index.m3u8", 13, 0, 0.0, 113.15384615384616, 39, 326, 45.0, 319.6, 326.0, 326.0, 0.08808423563210602, 0.04934887540146084, 0.035526161441464636], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-14", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.537109375, 1.77734375], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-13", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5335523592715232, 1.9143211920529801], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-12", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 0.526577818627451, 1.860574959150327], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html#-11", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 0.5443676097972974, 1.903637035472973], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=10", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 7.939149584673097, 7.68480372454448], "isController": false}, {"data": ["https://api.demoblaze.com/deleteitem", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.5481522479564033, 1.245316757493188], "isController": false}, {"data": ["https://www.demoblaze.com/config.json", 13, 0, 0.0, 243.6153846153846, 103, 309, 303.0, 308.2, 309.0, 309.0, 0.08811707369976479, 0.023624536961723296, 0.04004057833607852], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 8, 0, 0.0, 903.5, 103, 1638, 998.0, 1638.0, 1638.0, 1638.0, 0.0537526036417389, 12.047617247866693, 0.2401019619700329], "isController": false}, {"data": ["invalidLogin", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.35498608117816094, 0.6412199173850576], "isController": true}, {"data": ["https://api.demoblaze.com/addtocart", 3, 0, 0.0, 376.0, 365, 386, 377.0, 386.0, 386.0, 386.0, 0.12360430142968976, 0.023779343146141486, 0.06377370369988876], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-8", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 1.5953743811881187, 5.5499690594059405], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-7", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 1.5643962378640777, 5.138804611650485], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-9", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5317914603960396, 1.8532126650165017], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 239, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
