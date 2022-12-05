var express = require('express');
var router = express.Router();


//db connection
const sqlite = require('sqlite3').verbose();
const getDataTime = () => {
  return (new Date().toISOString().slice(0, 19).replace("T", ' '))
};

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = new sqlite.Database('diary.sqlite',
  sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
  (err) => {
    if (err) {
      console.log("ERROR: " + err);
      exit(1);
    }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='entry'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(`SELECT * FROM entry`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'My Diary', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table entry (
                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                     title text NOT NULL,
                     text text NOT NULL);`,
              () => {
                db.all(`SELECT * entry FROM entry`, 
                (err, rows) => {
                  res.render('index', { title: 'My Diary', data: rows });
                });
              });
          }
        });
    });
});

router.post('/new', (req, res, next) => {
  var db = new sqlite.Database('diary.sqlite',
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("ERROR: " + err);
        exit(1);
      }
      console.log("inserting new post");
      db.run(`INSERT INTO entry (title, text)
                values (?, ?);`,[req.body.title, req.body.text]);
      //redirect to homepage
      res.redirect('/');
    }
  );
});

router.post('/update', (req, res, next) => {
  var db = new sqlite.Database('diary.sqlite',
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("ERROR: " + err);
        exit(1);
      }
      console.log("updating post");
      db.run(`UPDATE entry SET text=? WHERE id=?;`,[req.body.text, req.body.id]);
      //redirect to homepage
      res.redirect('/');
    }
  );
});

router.post('/delete', (req, res, next) => {
  var db = new sqlite.Database('diary.sqlite',
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("ERROR: " + err);
        exit(1);
      }
      console.log("Deleting post");
      db.run(`DELETE FROM entry WHERE id=?;`,[req.body.id]); 
      //redirect to homepage    
      res.redirect('/');
    }
  );
});

module.exports = router;
