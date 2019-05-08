var Holiday = (function () {

    /**
     * 休日取得
     * @param Date date
     * @return string
     */
    var getHolidayName = function (date) {

        var holidayName = "";

        if (typeof date != "object") {
            return holidayName;
        }

        try {
            date.getTime();
        } catch (error) {
            return holidayName;
        }

        holidayName = _getPublicHolidayName(date);

        if (holidayName !== "") {
            return holidayName;
        }

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var weekday = date.getDay();

        // 振替休日の判定

        var timeStamp = date.getTime();
        // 前日(dateをベースに別インスタンスで作成)
        var previousDate = new Date(timeStamp);
        previousDate.setDate(date.getDate() - 1);
        // 前日(dateをベースに別インスタンスで作成)
        var previousDateForLoop = new Date(timeStamp);
        previousDateForLoop.setDate(date.getDate() - 1);

        // 1986-2006の5月4日の特殊処理
        if (1986 <= year && year <= 2006 && month == 5 && day == 4) {
            if (weekday == 1) {
                holidayName = "振替休日";
            }
        }
        if (holidayName !== "") {
            return holidayName;
        }

        if (new Date("1973/04/12") <= date && date <= new Date("2006/12/31")) {
            // 前日が日曜かつ国民の祝日のとき本日は振替休日
            if (previousDate.getDay() === 0 && _getPublicHolidayName(previousDate) !== "") {
                holidayName = "振替休日";
            }
        }
        if (holidayName !== "") {
            return holidayName;
        }

        if (new Date("2007/01/01") <= date) {
            // 前日に国民の祝日が連続しており、その中に日曜が含まれるとき本日は振替休日
            while (true) {
                if (_getPublicHolidayName(previousDateForLoop) === "") {
                    // 前日が国民の祝日では無い場合は終了
                    break;
                }
                if (previousDateForLoop.getDay() === 0) {
                    // 前日が日曜の場合は終了
                    holidayName = "振替休日";
                    break;
                }
                previousDateForLoop.setDate(previousDateForLoop.getDate() - 1);
            }
        }
        if (holidayName !== "") {
            return holidayName;
        }

        // 国民の休日

        // 1986-2006の5月4日の特殊処理
        if (1986 <= year && year <= 2006 && month === 5 && day === 4) {
            if (weekday >= 2 && weekday <= 6) {
                holidayName = "国民の休日";
            }
        }
        if (holidayName !== "") {
            return holidayName;
        }

        // 前後が国民の祝日である平日は国民の休日となる
        // 次の日(dateをベースに別インスタンスで作成)
        var nextDate = new Date(timeStamp);
        nextDate.setDate(date.getDate() + 1);

        if (new Date("1985/12/27") <= date) {
            if (_getPublicHolidayName(previousDate) !== "" && _getPublicHolidayName(nextDate) !== "" && weekday >= 2 && weekday <= 6) {
                holidayName = "国民の休日";
            }
        }

        return holidayName;
    }

    var _fixHolidayObjectList = [
        {"name": "元日", "month": 1, "day": 1, "start": 1949, "end": null},
        {"name": "成人の日", "month": 1, "day": 15, "start": 1949, "end": 1999},
        {"name": "建国記念の日", "month": 2, "day": 11, "start": 1967, "end": null},
        {"name": "天皇誕生日", "month": 2, "day": 23, "start": 2020, "end": null},
        {"name": "昭和天皇の大喪の礼", "month": 2, "day": 24, "start": 1989, "end": 1989},
        {"name": "皇太子・明仁親王の結婚の儀", "month": 4, "day": 10, "start": 1959, "end": 1959},
        {"name": "天皇誕生日", "month": 4, "day": 29, "start": 1949, "end": 1988},
        {"name": "みどりの日", "month": 4, "day": 29, "start": 1989, "end": 2006},
        {"name": "昭和の日", "month": 4, "day": 29, "start": 2007, "end": null},
        {"name": "天皇の即位", "month": 5, "day": 1, "start": 2019, "end": 2019},
        {"name": "憲法記念日", "month": 5, "day": 3, "start": 1949, "end": null},
        {"name": "みどりの日", "month": 5, "day": 4, "start": 2007, "end": null},
        {"name": "こどもの日", "month": 5, "day": 5, "start": 1949, "end": null},
        {"name": "皇太子・皇太子徳仁親王の結婚の儀", "month": 6, "day": 9, "start": 1993, "end": 1993},
        {"name": "海の日", "month": 7, "day": 20, "start": 1996, "end": 2002},
        {"name": "海の日", "month": 7, "day": 23, "start": 2020, "end": 2020},
        {"name": "スポーツの日", "month": 7, "day": 24, "start": 2020, "end": 2020},
        {"name": "山の日", "month": 8, "day": 10, "start": 2020, "end": 2020},
        {"name": "山の日", "month": 8, "day": 11, "start": 2016, "end": 2019},
        {"name": "山の日", "month": 8, "day": 11, "start": 2021, "end": null},
        {"name": "敬老の日", "month": 9, "day": 5, "start": 1966, "end": 2002},
        {"name": "体育の日", "month": 10, "day": 10, "start": 1966, "end": 1999},
        {"name": "即位礼正殿の儀", "month": 10, "day": 22, "start": 2019, "end": 2019},
        {"name": "文化の日", "month": 11, "day": 3, "start": 1948, "end": null},
        {"name": "即位礼正殿の儀", "month": 11, "day": 12, "start": 1990, "end": 1990},
        {"name": "勤労感謝の日", "month": 11, "day": 23, "start": 1948, "end": null},
        {"name": "天皇誕生日", "month": 12, "day": 23, "start": 1989, "end": 2018},
    ];

    var _happyMondayObjectList = [
        {"name": "成人の日", "month": 1, "weekNumber": 2, "start": 2000, "end": null},
        {"name": "海の日", "month": 7, "weekNumber": 3, "start": 2003, "end": 2019},
	{"name": "海の日", "month": 7, "weekNumber": 3, "start": 2021, "end": null},
        {"name": "敬老の日", "month": 9, "weekNumber": 3, "start": 2003, "end": null},
        {"name": "体育の日", "month": 10, "weekNumber": 2, "start": 2000, "end": 2019},
        {"name": "スポーツの日", "month": 10, "weekNumber": 2, "start": 2021, "end": null},
    ];

    /**
     * 国民の祝日取得
     * @param Date date
     * @return string
     */
    var _getPublicHolidayName = function (date) {

        var publicHolidayName = "";

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var weekday = date.getDay();

        // 第何週
        var weekNumber = null;

        if (day % 7 == 0) {
            weekNumber = day / 7;
        } else {
            weekNumber = parseInt(day / 7, 10) + 1;
        }

        // 固定祝日
        _fixHolidayObjectList.forEach(function (object) {

            if (object.end !== null) {
                if (object.start <= year && year <= object.end && month === object.month && day === object.day) {
                    publicHolidayName = object.name;
                }
            } else {
                if (object.start <= year && month === object.month && day === object.day) {
                    publicHolidayName = object.name;
                }
            }

        });

        if (publicHolidayName !== "") {
            return publicHolidayName;
        }

        // ハッピーマンデー制度
        _happyMondayObjectList.forEach(function (object) {

            if (weekday !== 1) {
                // 月曜ではない場合
                return;
            }

            if (object.end !== null) {
                if (object.start <= year && year <= object.end && month === object.month && weekNumber === object.weekNumber) {
                    publicHolidayName = object.name;
                }
            } else {
                if (object.start <= year && month === object.month && weekNumber === object.weekNumber) {
                    publicHolidayName = object.name;
                }
            }

        });

        if (publicHolidayName !== "") {
            return publicHolidayName;
        }

        // 春分の日・秋分の日
        if (1900 <= year && year < 1980) {
            if (month === 3) {
                if (day === parseInt(20.8357 + 0.242194 * ( year - 1980), 10) - parseInt((year - 1983) / 4, 10)) {
                    publicHolidayName = "春分の日";
                }
            }
            if (month === 9) {
                if (day === parseInt(23.2588 + 0.242194 * ( year - 1980), 10) - parseInt((year - 1983) / 4, 10)) {
                    publicHolidayName = "秋分の日";
                }
            }
        }
        if (1980 <= year && year < 2100) {
            if (month === 3) {
                if (day === parseInt(20.8431 + 0.242194 * ( year - 1980), 10) - parseInt((year - 1980) / 4, 10)) {
                    publicHolidayName = "春分の日";
                }
            }
            if (month === 9) {
                if (day === parseInt(23.2488 + 0.242194 * ( year - 1980), 10) - parseInt((year - 1980) / 4, 10)) {
                    publicHolidayName = "秋分の日";
                }
            }
        }
        if (2100 <= year && year < 2150) {
            if (month === 3) {
                if (day === parseInt(20.8510 + 0.242194 * ( year - 1980), 10) - parseInt((year - 1980) / 4, 10)) {
                    publicHolidayName = "春分の日";
                }
            }
            if (month === 9) {
                if (day === parseInt(24.2488 + 0.242194 * ( year - 1980), 10) - parseInt((year - 1980) / 4, 10)) {
                    publicHolidayName = "秋分の日";
                }
            }
        }

        return publicHolidayName;
    }

    return {
        getHolidayName: getHolidayName
    }
})();

//引用元:https://github.com/horikeso/japanese-holidays

function makeCalendar(year,month) {

  var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var x = "";
  var date = ['日','月','火','水','木','金','土'];
  if(month == 1 || month == 2){
    var datemonth = month + 12;
    var dateyear = year - 1;
  }else{
    var datemonth = month
    var dateyear = year;
  }
  var datenumber = parseInt( (dateyear + parseInt(dateyear/4) - parseInt(dateyear/100) + parseInt(dateyear/400) + parseInt((13*datemonth+8)/5) + 1) % 7 );

  var calendar = "<caption>" + year + "年" + month + "月</caption><tr><th>日曜日</th><th>月曜日</th><th>火曜日</th><th>水曜日</th><th>木曜日</th><th>金曜日</th><th>土曜日</th></tr>"
  var state = 0;
  var empty = 0;


  if ((year % 400) == 0) {
    ++days[1];
  }else if ((year % 100) != 0 && (year % 4) == 0) {
    ++days[1];
  }

  for(var n = 1; n <= days[month - 1]; n = n + 1) {

    var shukujitsu = Holiday.getHolidayName(new Date(year + "/" + month + "/" + n));

    if(state == 0){
      calendar += "<tr>";
    }

    if(empty == 0) {
      for(var m = 1; m <= datenumber; m = m + 1){
          calendar += "<th></th>";
          ++state;
          state %= 7;
        }
        ++empty;
    }

    if(state == 0) {
      calendar += "<th class='red'>";
    }else if(shukujitsu != "") {
      calendar += "<th class='red'>";
    }else if(state == 6) {
      calendar += "<th class='blue'>";
    }else{
      calendar += "<th>"
    }

    calendar += n + "<br><textarea class='textbox' rows='1' cols='15' ondblclick='important("+n+");' id='"+n+"'>"+shukujitsu+"</textarea></th>"

    ++state;
    state %= 7;

    if(n == days[month - 1]){
      state = 7;
    }

    if(state == 7){
      calendar += "</tr>"
    }

    ++datenumber;
    datenumber %= 7;
  }


  document.getElementById('calendar').innerHTML = calendar;
}

var today = new Date();
makeCalendar(today.getFullYear(),today.getMonth()+1)

function important(id){
  var color = document.getElementById(id).style.color;
  if(color == 'red'){
    document.getElementById(id).style.color = 'black'
    document.getElementById(id).style.fontWeight = ''
  }else{
    document.getElementById(id).style.color = 'red'
    document.getElementById(id).style.fontWeight = 'bold'
  }
}
