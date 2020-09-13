`use strict`;
const sqlite3 = require('/nodejs/node_modules/sqlite3');

class Mpcrt_tp {
  constructor(tblnm, sqlst) {
    this.tblnm = tblnm;
    this.sqlst = sqlst;
  }
}

module.exports.Ddbo = class Ddbo {
  constructor() {
    this.mpcrt = []; // Array of Mpcrt_tp
  }

  CrtTables(parm, s) {
    s.Envmnt.SetRunVars(parm, s);
    for (var cdb of s.Envmnt.Cdb) {
      for (var sq of s.Dfault.d.sqlst) {
        if (cdb.table == sq.tblnm && cdb.cr && sq.activ) {
          this.mpcrt.push(new Mpcrt_tp(sq.tblnm, sq.sqlst));
          break;
        }
      }
    }
    var db = new sqlite3.Database(s.Envmnt.Dbodr + s.Envmnt.Dbonm, (err) => {
      if (err) {
        return console.error('sql-connection:', err.message);
      }
    });
    db.serialize(() => {
      this.mpcrt.forEach((mapdb) => {
        var sqdrp = 'DROP TABLE IF EXISTS &1;'.replace('&1', mapdb.tblnm);
        db.run(sqdrp, (err) => {
          if (err) {
            console.log('sql-delete:', err.message);
            throw err;
          }
        });
        db.run(mapdb.sqlst, (err) => {
          if (err) {
            console.log('sql-insert:', err.message);
            throw err;
          }
        });
      });
      db.close((err) => {
        if (err) {
          console.error('sql-close:', err.message);
        }
      });
    });
  }
}
