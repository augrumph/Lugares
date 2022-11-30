const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROTAS PARA AS PAGINAS
app.use(express.static(path.join(__dirname, '/static')));
app.use(express.static(path.join(__dirname, '/views')));

app.use(express.static('/'));
// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});


// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				request.session.email = email;
				request.session.password = password;
				// Redirect to home page
				response.redirect('admin.html')
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/home

app.listen(3000);

// CREATE
app.post('/save',function(req,res){

  var nome = req.body.nome;
  var tipo = req.body.tipo;
  var media = req.body.media;
  var imagem = req.body.imagem;
  pool.query("insert into lugares(nome,tipo,media,imagem) values(?,?,?,?) ",[nome,tipo,media,imagem],function(err,rows,fields){
    if(!!err)
    {
      console.log("error", +err);
    }
    else
    {
       res.json({"ResponseCode":"1","ResponseMessage":"success","data":"Data Inserted Successfully!"});

    }
  });
  
})

// SHOW DATA
app.get('/show',function(req,res) {
  pool.query("select * from lugares", function (err, result) {
    if (err) throw err;
    else {
      obj = {print: result};
      console.log(obj);

      res.render("show", obj);
    }
  })
})

//UPDATE
var edit=0;
app.get('/update',function(req,res) {
  pool.query("select * from lugares", function (err, result) {
    if (err) throw err;
    else {
      if (req.query.id != '') {
        pool.query("SELECT * FROM lugares where id = ? ", [req.query.id], function (error, rows) {
          if (!!error) {
            console.log('edit Error' + error);
          } else {
            console.log('edit ok');
            edit = rows;
          }
        });
      }
      // data = {print:result};
      obj = {print: result,req: edit};
      console.log(obj);
      res.render("update", obj);
    }

  })
})

app.post('/updatesave',function(req,res){
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email;
  var contact = req.body.contact;
  var designation = req.body.designation;


  // res.send(id+name+email+contact);
  pool.query("UPDATE lugares set name=?, email=?,contactNo=?,designation=? where id=?",[name,email,contact,designation,id],function(err,rows,fields){

    if(!!err)
    {
      console.log('Error' ,+err);
    }
    else
    {
      console.log('ok');
      res.json({"ResponseCode":"1","ResponseMessage":"Data Updated Successfully","data":rows});
    }
  });
})


// DELETE
app.get('/delete',function(req,res){

  var id = req.query.id;

  pool.query("delete from employee where id=?",[id],function(err,rows,fields){

    if(!!err)
    {
      console.log('Error' ,+err);
    }
    else
    {
      console.log("record deleted");
      return res.redirect('/show');
      //res.json({"ResponseCode":"1","ResponseMessage":"Record deleted successfully!","data":rows});
    }

  });


})