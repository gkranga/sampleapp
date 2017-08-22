router.get('/getFormatJson/:resourceName', function(req, res) {
+   res.sendFile(path.normalize(__dirname +'/../static/jsons/'+req.params.resourceName+'.json'))  
+  // var obj = require(__dirname +'/../static/jsons/'+req.params.resourceName+'.json');
+  // var path = __dirname +'/../static/jsons/'+req.params.resourceName+'.json';
+  // var data = ;
+  // res.JSON(obj);
