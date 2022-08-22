// crtdb.js [2019-07-01 BAR8TL]
// SQLite tables creation
'use strict';
const sprintf = require('/nodejs/node_modules/sprintf-js').sprintf;
const sqlite3 = require('/nodejs/node_modules/sqlite3');

module.exports.Crtdb = class Crtdb {
  constructor() {
    this.Mpcrt = []; // Array of mpcrt_tp
  }

  CrtTables(parm, s) {
    s.SetRunSettings(parm);
    for (var cdb of s.Cdb) {
      for (var sq of s.Sqlst) {
        if (cdb.Table == sq.Table && cdb.Cr && sq.Activ) {
          this.Mpcrt.push(new Mpcrt_tp(sq.Table, sq.Sqlst));
          break;
        }
      }
    }
    var db = new sqlite3.Database(s.Dbort);
    db.serialize(() => {
      this.Mpcrt.forEach((mapdb) => {
        var sqdrp = 'DROP TABLE IF EXISTS &1;'.replace('&1', mapdb.Table);
        db.run(sqdrp);
        db.run(mapdb.Sqlst, (err) => {
          if (err) {
            console.log('sql-insert:', err.message);
            throw err;
          }
          console.log(sprintf('Table %-8s created...', mapdb.Table));
        });
      });
      db.close((err) => {
        if (err) {
          console.error('sql-close:', err.message);
        }
        console.log('Creation of dabatase', s.Dbonm,'completed.')
      });
    });
  }
}

// Mpcrt_to - Map for tables to create
class Mpcrt_tp {
  constructor(table, sqlst) {
    this.Table = table;
    this.Sqlst = sqlst;
  }
}
