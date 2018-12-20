Mon = 11
Year = 2018

dateRange = {
        updateTime: {
                $gte: ISODate(Year+"-"+('0'+Mon).slice(-2)+"-01T00:00:00.000Z"),
                $lt: ISODate(Year+"-"+('0'+Mon).slice(-2)+"-30T23:59:59.999Z")
        }
}

conn = new Mongo("172.16.177.147:21001")
db = conn.getDB("meizu-image")

cursor = db.image.find(dateRange).limit(100000)

var sizeSummary     = {}
var numSummary      = {}
var sizeDaliy       = {}
var numDaliy        = {}
var sizeAvg         = {}
var numAvg          = {}
var sizePeak        = {}
var numPeak         = {}

var monDays = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
}

function humanSize(size, suffix, indent) {
            //add 1 to avoid negative
            var i = Math.floor( Math.log(size+1) / Math.log(1024) ); 
            return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + [''+suffix , 'K'+suffix, 'M'+suffix, 'G'+suffix, 'T'+suffix][i+indent];
};

function daysOfMon(mon) {
        var d = Date()
        days = monDays[mon]
        
        if (mon == 2) {
            year = d.getFullYear()
            if (year % 400 == 0 || (year % 100 != 0 && year %4 ==0)) {
                    days = days + 1
            }
        }
        return days
}

function dateString(date) {
        return date.getFullYear() + '-' 
                + ('0' + (date.getMonth()+1)).slice(-2) + '-' 
                + ('0' + date.getDate()).slice(-2)

}

while (cursor.hasNext()) {
    current = cursor.next()
    curBiz = current.bizId
    curFiles = current.files
    curDateObj  = current.updateTime
    curDate = dateString(curDateObj)

    if (isNaN(sizeSummary[curBiz])) {
        sizeSummary[curBiz] = 0
    }
    if (isNaN(numSummary[curBiz])) {
        numSummary[curBiz] = 0
    }
    if (numDaliy[curBiz] == undefined) {
        numDaliy[curBiz] = {}
    }
    if (isNaN(numDaliy[curBiz][curDate])) {
        numDaliy[curBiz][curDate] = 0
    }
    if (sizeDaliy[curBiz] == undefined ) {
        sizeDaliy[curBiz] = {}
    }
    if (isNaN(sizeDaliy[curBiz][curDate])) {
        sizeDaliy[curBiz][curDate] = 0
    }

    numSummary[curBiz] = numSummary[curBiz] + curFiles.length
    numDaliy[curBiz][curDate] = numDaliy[curBiz][curDate] + curFiles.length
    for (var i = 0; i < curFiles.length; i++) {
        curFile = curFiles[i]
        sizeSummary[curBiz] = sizeSummary[curBiz] + curFile.size
        sizeDaliy[curBiz][curDate] = sizeDaliy[curBiz][curDate] + curFile.size

    }
}

for (var biz in sizeDaliy) {
    peakSize = 0
    peakDate = ""

    bizInfo = sizeDaliy[biz]

    for (var date in bizInfo) {
        if (peakSize < bizInfo[date]) {
            peakSize = bizInfo[date]
            peakDate = date
        }
    }
    sizePeak[biz] = {
            "size": humanSize(peakSize, 'B', 1),
            "date": peakDate
    }
}

for (var biz in numDaliy) {
    peakNum = 0
    peakDate = ""

    bizInfo = numDaliy[biz]

    for (var date in bizInfo) {
        if (peakNum < bizInfo[date]) {
            peakNum = bizInfo[date]
            peakDate = date
        }
    }
    numPeak[biz] = {
            "num": humanSize(peakNum, '', 0),
            "date": peakDate
    }
}

for (var biz in sizeSummary) {
    sizeAvg[biz] = humanSize((sizeSummary[biz] / daysOfMon(Mon)), 'B', 1)
    sizeSummary[biz] = humanSize(sizeSummary[biz], 'B', 1)
}

for (var biz in numSummary) {
    numAvg[biz] = humanSize((numSummary[biz] / daysOfMon(Mon)), '', 0)
    numSummary[biz] = humanSize(numSummary[biz], '', 0)
}

var separator = "==============="
var openSymbol = ">"
var closeSymbol = "<"

function openSeparator(title) {
        printjson(separator+title+separator)
}
function closeSeparator(title) {
        printjson(separator+"======="+separator)
}

function separateContent(title, content) {
        openSeparator(title)
        printjson(content)
        closeSeparator(title)
        print()
        print()
}

result = {
        "sizeSummary": sizeSummary,
        "numSummary": numSummary,
        "sizePeak": sizePeak,
        "numPeak": numPeak,
        "sizeAvg": sizeAvg,
        "numAvg": numAvg,
}

for (var title in result) {
        separateContent(title, result[title])
}

//printjson(sizeSummary)
//separateContent("sizeSummary", sizeSummary)
////printjson("numSummary")
//separateContent("numSummary",numSummary)
////printjson("sizeDaliy")
////printjson(sizeDaliy)
////printjson("numDaliy")
////printjson(numDaliy)
////printjson("sizePeak")
//separateContent("sizePeak",sizePeak)
//printjson("numPeak")
//printjson(numPeak)
//printjson("sizeAvg")
//printjson(sizeAvg)
//printjson("numAvg")
//printjson(numAvg)
