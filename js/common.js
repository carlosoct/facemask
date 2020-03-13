$(function () {
    var map = L.map('map-face-mask').setView([25.062945, 121.5624861], 16);
    var greenIcon = new L.Icon({
        iconUrl: 'img/marker-icon-2x-green.png',
        shadowUrl: 'img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var redIcon = new L.Icon({
        iconUrl: 'img/marker-icon-2x-red.png',
        shadowUrl: 'img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    var blueIcon = new L.Icon({
        iconUrl: 'img/marker-icon-2x-blue.png',
        shadowUrl: 'img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var markers = new L.MarkerClusterGroup().addTo(map);

    /* L.marker([25.062945, 121.5624861], { icon: greenIcon }).addTo(map)
        .bindPopup(`<div class="mask-data"><h2>診所名稱</h2><b>電話</b><h3>大人口罩：<span>5</span></h3><h4>小孩口罩：<span>60</span></h4></div>`)
        .openPopup(); */

    $.ajax({
        type: "get",
        url: "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json",
        data: "data",
        dataType: "json",
        success: function (res) {
            //console.log(res.features);
            var data = res.features;
            var iconColor;
            var textColorAdult;
            var textColorChild;
            var countyName = [];
            var countyFilter = [];

            data.forEach(function (item) {
                if(item.properties.mask_adult <= 10){
                    iconColor = redIcon;
                    textColorAdult = "redText";
                }else if(item.properties.mask_adult > 11 && item.properties.mask_adult <= 50){
                    iconColor = greenIcon;
                    textColorAdult = "greenText";
                }else{
                    iconColor = blueIcon;
                    textColorAdult = "blueText";
                };

                if(item.properties.mask_child <= 10){
                    textColorChild = "redText";
                }else if(item.properties.mask_child > 11 && item.properties.mask_child <= 50){
                    textColorChild = "greenText";
                }else{
                    textColorChild = "blueText";
                };
                markers.addLayer(L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], { icon: iconColor }).bindPopup(`<div class="mask-data"><h2>${item.properties.name}</h2><b>${item.properties.phone}</b><h3 class=${textColorAdult}>大人口罩：<span>${item.properties.mask_adult}</span></h3><h4 class=${textColorChild}>小孩口罩：<span>${item.properties.mask_child}</span></h4></div>`));
            });

            countyName = data.map(function(item){
                return item.properties.county;
            });

            countyFilter = countyName.filter(function(item, index, arr){
                return arr.indexOf(item) === index;
            });

            countyFilter.splice(1,1);

            console.log(countyFilter);
        }
    });
    map.addLayer(markers);
});