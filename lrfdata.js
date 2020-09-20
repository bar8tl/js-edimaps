`use strict`;
const fs      = require('fs');
const sprintf = require('/nodejs/node_modules/sprintf-js').sprintf;
const parse   = require('/nodejs/node_modules/csv-parse');
const sqlite3 = require('/nodejs/node_modules/sqlite3');
const xlsx    = require('/nodejs/node_modules/xlsx');

module.exports.Dlrf = class Dlrf {
  constructor() {}

  LoadRefData(parm, s) {
    s.SetRunSettings(parm, s);
    for (var lrf of s.Lrf) {
      switch (lrf.Id) {
      case s.Konst.INDEX_REF :
        this.loadIndex(s);
        break;
      case s.Konst.CODES_INDEX_REF :
        this.loadCodeIndex(s, lrf);
        break;
      case s.Konst.CODES_CODE_REF :
        this.loadCodeCodes(s, lrf);
        break;
      case s.Konst.CODES_DATA_REF :
        this.loadCodeData(s, lrf);
        break;
      }
    }
  }

  loadIndex(s) {
    const wbook = xlsx.readFile(s.Idxrt);
    const shlst = wbook.SheetNames;
    const xlsjs = xlsx.utils.sheet_to_json(
      wbook.Sheets[shlst[s.Konst.IX_MAPPING_SHEET]]);
    const db = new sqlite3.Database(s.Dbort, (err) => {
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
          s.GetMsgTp(xlsjs[i].messg), (err) => {
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
        console.log(sprintf('Table %-8s loaded...', 'index'));
      });
    });
  }

  loadCodeIndex(s, lrf) {
    var csvdata = [];
    fs.createReadStream(s.Lrfdr + lrf.File)
      .pipe(parse({delimiter: '|'}))
      .on('data', function(csvrow) {
        csvdata.push(csvrow);
      })
      .on('end', function() {
        const db = new sqlite3.Database(s.Dbort, (err) => {
          if (err) {
            return console.error('sql-connection:', err.message);
          }
        });
        db.serialize(() => {
          db.run('DELETE FROM cd_index;', (err) => {
            if (err) {
              console.log('sql-delete:', err.message);
              throw err;
            }
          });
          for (var row of csvdata) {
            db.run('INSERT INTO cd_index VALUES(?,?,?);',
              row[0], row[1], row[2], (err) => {
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
            console.log(sprintf('Table %-8s loaded...', 'cd-index'));
          });
        });
      });
  }

  loadCodeCodes(s, lrf) {
    var csvdata = [];
    fs.createReadStream(s.Lrfdr + lrf.File)
      .pipe(parse({delimiter: '|'}))
      .on('data', function(csvrow) {
        csvdata.push(csvrow);
      })
      .on('end', function() {
        const db = new sqlite3.Database(s.Dbort, (err) => {
          if (err) {
            return console.error('sql-connection:', err.message);
          }
        });
        db.serialize(() => {
          db.run('DELETE FROM cd_codes;', (err) => {
            if (err) {
              console.log('sql-delete:', err.message);
              throw err;
            }
          });
          for (var row of csvdata) {
            db.run('INSERT INTO cd_codes VALUES(?,?,?);',
              row[0], row[1], row[2], (err) => {
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
            console.log(sprintf('Table %-8s loaded...', 'cd-codes'));
          });
        });
      });
  }

  loadCodeData(s, lrf) {
    var csvdata = [];
    fs.createReadStream(s.Lrfdr + lrf.File)
      .pipe(parse({delimiter: '|'}))
      .on('data', function(csvrow) {
        csvdata.push(csvrow);
      })
      .on('end', function() {
        const db = new sqlite3.Database(s.Dbort, (err) => {
          if (err) {
            return console.error('sql-connection:', err.message);
          }
        });
        db.serialize(() => {
          db.run('DELETE FROM cd_data;', (err) => {
            if (err) {
              console.log('sql-delete:', err.message);
              throw err;
            }
          });
          for (var row of csvdata) {
            db.run('INSERT INTO cd_data VALUES(?,?,?,?);',
              row[0], row[1], row[2], row[3], (err) => {
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
            console.log(sprintf('Table %-8s loaded...', 'cd-data'));
          });
        });
      });
  }
}
