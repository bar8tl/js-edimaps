`use strict`;
const fs      = require('fs');
const parse   = require('/nodejs/node_modules/csv-parse');
const sqlite3 = require('/nodejs/node_modules/sqlite3');
const xlsx    = require('/nodejs/node_modules/xlsx');

module.exports.Dlrf = class Dlrf {
  constructor() {}

  LoadRefData(parm, s) {
    s.Envmnt.SetRunVars(parm, s);
    for (var lrf of s.Envmnt.Lrf) {
      if (lrf.id == 'idx') {
        this.loadIndex(parm, s);
      } else if (lrf.id == 'cix') {
        this.loadCodeIndex(s.Envmnt, lrf);
      } else if (lrf.id == 'ccd') {
        this.loadCodeCodes(s.Envmnt, lrf);
      } else if (lrf.id == 'cdt') {
        this.loadCodeData(s.Envmnt, lrf);
      }
    }
  }

  loadIndex(parm, s) {
    const wbook = xlsx.readFile(s.Envmnt.Lrfdr + s.Envmnt.Idxnm);
    const shlst = wbook.SheetNames;
    const xlsjs = xlsx.utils.sheet_to_json(
      wbook.Sheets[shlst[s.Dfault.d.konst.IX_MAPPING_SHEET]]);
    const db = new sqlite3.Database(s.Envmnt.Dbodr + s.Envmnt.Dbonm, (err) => {
      if (err) {
        return console.error('sql-connection:', err.message);
      }
    });
    db.serialize(() => {
      db.run('DELETE FROM indix;', (err) => {
        if (err) {
          console.log('sql-delete:', err.message);
          throw err;
        }
      });
      for (var i = 0; i < xlsjs.length; i++) {
        db.run('INSERT INTO indix VALUES(?,?,?,?,?,?,?,?,?);',
          xlsjs[i].mapid, xlsjs[i].ctmrs, xlsjs[i].ctmrl, xlsjs[i].messg,
          xlsjs[i].mvers, xlsjs[i].idocm, xlsjs[i].stats, xlsjs[i].fname,
          s.Envmnt.GetMsgTp(xlsjs[i].messg), (err) => {
          if (err) {
            console.log('sql-insert:', err.message);
            throw err;
          }
        });
      }
      db.close((err) => {
        if (err) {
          console.error('sql-close:', err.message);
        }
      });
    });
  }

  loadCodeIndex(se, lrf) {
    var csvdata = [];
    fs.createReadStream(se.Lrfdr + lrf.file)
      .pipe(parse({delimiter: '|'}))
      .on('data', function(csvrow) {
        csvdata.push(csvrow);
      })
      .on('end', function() {
        const db = new sqlite3.Database(se.Dbodr + se.Dbonm, (err) => {});
        db.serialize(() => {
          db.run('DELETE FROM cd_index;', (err) => {});
          for (var row of csvdata) {
            db.run('INSERT INTO cd_index VALUES(?,?,?);',
              row[0], row[1], row[2], (err) => {});
          }
          db.close((err) => {});
        });
      });
  }

  loadCodeCodes(se,lrf) {
    var csvdata = [];
    fs.createReadStream(se.Lrfdr + lrf.file)
      .pipe(parse({delimiter: '|'}))
      .on('data', function(csvrow) {
        csvdata.push(csvrow);
      })
      .on('end', function() {
        const db = new sqlite3.Database(se.Dbodr + se.Dbonm, (err) => {});
        db.serialize(() => {
          db.run('DELETE FROM cd_codes;', (err) => {});
          for (var row of csvdata) {
            db.run('INSERT INTO cd_codes VALUES(?,?,?);',
              row[0], row[1], row[2], (err) => {});
          }
          db.close((err) => {});
        });
      });
  }

  loadCodeData(se, lrf) {
    var csvdata = [];
    fs.createReadStream(se.Lrfdr + lrf.file)
      .pipe(parse({delimiter: '|'}))
      .on('data', function(csvrow) {
        csvdata.push(csvrow);
      })
      .on('end', function() {
        const db = new sqlite3.Database(se.Dbodr + se.Dbonm, (err) => {});
        db.serialize(() => {
          db.run('DELETE FROM cd_data;', (err) => {});
          for (var row of csvdata) {
            db.run('INSERT INTO cd_data VALUES(?,?,?,?);',
              row[0], row[1], row[2], row[3], (err) => {});
          }
          db.close((err) => {});
        });
      });
  }
}
