const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const path = require("path");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "placepicker",
});
module.exports = connection;

const app = express();

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROTAS PARA AS PAGINAS
app.use(express.static(path.join(__dirname, "/static")));
app.use(express.static(path.join(__dirname, "/views")));

app.use(express.static("/"));
// http://localhost:3000/
app.get("/admin", function (request, response) {
  // Render login template
  response.sendFile(path.join(__dirname + "/login.html"));
});
app.get("/", function (request, response) {
  // Render login template
  response.sendFile(path.join(__dirname + "/views/place_menu.html"));
});
// http://localhost:3000/auth
app.post("/auth", function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;
  let email = request.body.email;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query(
      "SELECT * FROM logins WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
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
          response.redirect("admin.html");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

// http://localhost:3000/home

app.listen(3000);

app.post("/save", function (req, res) {
  let id = Math.floor(Math.random() * 10000000);
  let nome = req.body.nome;
  let tipo = req.body.tipo;
  let media = req.body.media;
  let imagem = req.body.imagem;

  connection.query(
    "INSERT INTO lugares VALUES (?,?,?,?,?)",
    [id, nome, tipo, media, imagem],
    function (err, result) {
      if (err) throw err;
      else {
        res.redirect("admin.html");
      }
    }
  );
});

// SHOW DATA
app.get("/show", function (req, res) {
  connection.query("select * from lugares", function (err, result) {
    if (err) throw err;
    else {
      res.render("admin", { userData: result });
    }
  });
});

// DELETE
app.get("/remove/(:id)", function (req, res) {
  const lugar = { id: req.params.id };

  connection.query(
    "DELETE FROM lugares WHERE id = " + req.params.id,
    lugar,
    function (err, result) {
      if (err) throw err;
      else {
        console.log("Deletado Com sucesso");
      }
    }
  );
});
