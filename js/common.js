$(function () {
    var map = L.map('map-face-mask').setView([23.696291, 120.8546711], 8);
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
            let data = res.features;
            let iconColor;
            let textColorAdult;
            let textColorChild;
            let countyName = [];
            let countyFilter = [];
            let countyOption = "";
            let conuntyCategory = [];
            let townCategory = [];
            let townName = [];
            let townFilter = [];
            let townOption = "";
            let selectedContent = "";
            let nowLat;
            let nowLng;

            data.forEach(function (item) {
                if (item.properties.mask_adult <= 10) {
                    iconColor = redIcon;
                    textColorAdult = "redText";
                } else if (item.properties.mask_adult > 11 && item.properties.mask_adult <= 50) {
                    iconColor = greenIcon;
                    textColorAdult = "greenText";
                } else {
                    iconColor = blueIcon;
                    textColorAdult = "blueText";
                };

                if (item.properties.mask_child <= 10) {
                    textColorChild = "redText";
                } else if (item.properties.mask_child > 11 && item.properties.mask_child <= 50) {
                    textColorChild = "greenText";
                } else {
                    textColorChild = "blueText";
                };
                markers.addLayer(L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], { icon: iconColor }).bindPopup(`<div class="mask-data"><h2>${item.properties.name}</h2><b>${item.properties.phone}</b><h3 class=${textColorAdult}>大人口罩：<span>${item.properties.mask_adult}</span></h3><h4 class=${textColorChild}>小孩口罩：<span>${item.properties.mask_child}</span></h4></div>`));
            });

            countyName = data.map(function (item) {
                return item.properties.county;
            });

            countyFilter = countyName.filter(function (item, index, arr) {
                return arr.indexOf(item) === index;
            });

            countyFilter.splice(1, 1);

            countyFilter.forEach(function (item) {
                countyOption += `<option value=${item}>${item}</option>`
            });

            $('.county').append(countyOption);

            $('.county').on('change', function () {
                let countyValue = $(this).val();
                conuntyCategory = res.features.filter(function (item) {
                    return item.properties.county === countyValue;
                });

                townName = conuntyCategory.map(function (item) {
                    return item.properties.town;
                });

                townFilter = townName.filter(function (item, index, arr) {
                    return arr.indexOf(item) === index;
                });

                townOption = `<option value="default" disabled="" selected="">--- 請選擇行政區 ---</option>`;
                townFilter.forEach(function (item) {
                    townOption += `<option value=${item}>${item}</option>`
                });

                $('.town').empty().append(townOption);

                selectedContent = "";
                conuntyCategory.forEach(function (item) {
                    selectedContent +=
                        `<li data-geometry-x=${item.geometry.coordinates[1]} data-geometry-y=${item.geometry.coordinates[0]}>
                        <h4>${item.properties.name}</h4>
                        <div class="clinic-number">${item.properties.phone}</div>
                        <div class="clinic-address">${item.properties.address}</div>
                        <div class="clinic-note">${item.properties.note}</div>
                        <div class="clinic-mask">
                            <b class="mask-adult">成人口罩數量<span>${item.properties.mask_adult}</span></b>
                            <b class="mask-child">兒童口罩數量<span>${item.properties.mask_child}</span></b>
                        </div>
                    </li>`
                });
                $('.face-mask-info ul').empty().append(selectedContent);

                let countyGeometry = conuntyCategory[0].geometry.coordinates;
                map.setView([countyGeometry[1], countyGeometry[0]], 14);
            });

            $('.town').on('change', function () {
                let townValue = $(this).val();

                townCategory = conuntyCategory.filter(function (item) {
                    return item.properties.town === townValue;
                });

                selectedContent = "";
                townCategory.forEach(function (item) {
                    selectedContent +=
                        `<li data-geometry-x=${item.geometry.coordinates[1]} data-geometry-y=${item.geometry.coordinates[0]}>
                        <h4>${item.properties.name}</h4>
                        <div class="clinic-number">${item.properties.phone}</div>
                        <div class="clinic-address">${item.properties.address}</div>
                        <div class="clinic-note">${item.properties.note}</div>
                        <div class="clinic-mask">
                            <b class="mask-adult">成人口罩數量<span>${item.properties.mask_adult}</span></b>
                            <b class="mask-child">兒童口罩數量<span>${item.properties.mask_child}</span></b>
                        </div>
                    </li>`
                });
                $('.face-mask-info ul').empty().append(selectedContent);

                let townGeometry = townCategory[0].geometry.coordinates;
                map.setView([townGeometry[1], townGeometry[0]], 15);
            });

            $('.face-mask-info ul').on('click', 'li', function () {
                let geometryX = $(this).data('geometry-x');
                let geometryY = $(this).data('geometry-y');

                console.log(geometryX);
                console.log(geometryY);

                map.setView([geometryX, geometryY], 18);
                markers.eachLayer(function(layer){
                    //console.log(layer._latlng.lat);
                    if(layer._latlng.lat === geometryX && layer._latlng.lng === geometryY){
                        layer.openPopup();
                    } 
                });
            });
        }
    });
    map.addLayer(markers);

    function buyDate() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let week = now.getDay();
        let date = now.getDate();
        let monthCHT = "";
        let dateCHT = "";

        switch (week) {
            case 1:
                monthCHT = "星期一"
                break;
            case 2:
                monthCHT = "星期二"
                break;
            case 3:
                monthCHT = "星期三"
                break;
            case 4:
                monthCHT = "星期四"
                break;
            case 5:
                monthCHT = "星期五"
                break;
            case 6:
                monthCHT = "星期六"
                break;
            case 7:
                monthCHT = "星期日"
                break;
        }

        if (week % 2 === 1) {
            dateCHT = "奇數";
        } else {
            dateCHT = "偶數";
        };

        document.querySelector('.bd-year').textContent = year;
        document.querySelector('.bd-month').textContent = month;
        document.querySelector('.bd-date').textContent = date;
        document.querySelector('.buy-date span').textContent = monthCHT;
        document.querySelector('.buy-date b').textContent = dateCHT;
    };

    buyDate();
});