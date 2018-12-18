conn = new Mongo("172.16.177.147:21001");
db = conn.getDB("meizu-image");

cursor = db.image.find();

var result = {};

while (cursor.hasNext()) {
    current = cursor.next();
    curBiz = current.bizId;
    curFiles = current.files;
    if (isNaN(result[curBiz])) {
        result[curBiz] = 0
    }
    //if (curFiles.length > 1) {
    //    printjson(current);
    //}
    for (var i = 0; i < curFiles.length; i++) {
        curFile = curFiles[i]
        //if (curFiles.length > 1) {
        //    printjson(curFile);
        //    printjson(curFile.size);
        //}
        result[curBiz] = result[curBiz] + curFile.size;
    }

}
printjson(result);
