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
};

function daysOfMon(mon) {
        var d = new Date();
        days = monDays[mon];
        
        if (mon == 2) {
            year = d.getFullYear();
            if (year % 400 == 0 || (year % 100 != 0 && year %4 ==0)) {
                    days = days + 1
            }
        }
        return days

}

var test = {}

if (test["first"] == undefined ){
        test["first"] = {}
}

test["first"]["second"] = 1
var d = new Date()

date = d.getFullYear().toString() + d.getMonth().toString() + d.getDate().toString()




var MyDate = new Date();
var MyDateString;

//MyDate.setDate(MyDate.getDate() + 20);

MyDateString = MyDate.getFullYear() + '-'
             + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-'
             + ('0' + MyDate.getDate()).slice(-2);

function humanFileSize(size) {
            var i = Math.floor( Math.log(size+1) / Math.log(1024) )
            printjson(i)
            return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}

printjson(humanFileSize(12312))
print()
printjson("")
