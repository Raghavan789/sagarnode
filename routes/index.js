/*
* GET home page.
*/
 
exports.index = function(req, res){
    message = '';
   if(req.method == "POST"){
      var post  = req.body;
      console.log(req.body);
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;
      var email= post.email;
 
 
     if (!req.files)
            return res.status(400).send('No files were uploaded.');
 
      var file = req.files.uploaded_image;
      var img_name=file.name;
 
         if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
              file.mv('public/images/upload_images/'+file.name, function(err) {
                             
                 if (err)
 
                   return res.status(500).send(err);
                     var sql = "INSERT INTO `logins`(`first_name`,`last_name`,`mob_no`,`user_name`,'email', `password` ,`image`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + email + "','" + pass + "','" + img_name + "')";
 
                      var query = db.query(sql, function(err, result) {
                    //      res.redirect('profile/'+result.insertId);  
                      });
                  });
          } else {
            message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.render('index.ejs',{message: message});
          }
   } else {
      res.render('index');
   }
 
 };
 
 exports.profile = function(req, res){
   var message = '';
   var id = req.params.id;
    var sql="SELECT * FROM `logins` WHERE `id`='"+id+"'"; 
    db.query(sql, function(err, result){
     if(result.length <= 0)
     message = "Profile not found!";
     
      res.render('profile.ejs',{data:result, message: message});
   });
 };
// Assuming you are using Express.js and a MySQL database connection (`db`).

exports.complaints = function(req, res){
  var message = '';
  var userEmail = req.session.email; // Assuming you store user email in session
  
  if (!userEmail) {
      return res.status(401).send('Unauthorized');
  }

  var sql = "SELECT * FROM `complaints` WHERE `email` = ?";
  db.query(sql, [userEmail], function(err, results) {
      if (err) {
          console.error("Error fetching complaints: ", err);
          return res.status(500).send('Server Error');
      }
      
      if (results.length <= 0) {
          message = "No complaints found!";
      }
      
      res.render('yourcomplaints', { complaints: results, message: message });
  });
};
