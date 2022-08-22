// lrfdata.js [2019-07-01 BAR8TL]
// Loads Reference Data Files onto EDIMAPS Database
'use strict';
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
      if (lrf.Ld && lrf.Id == s.Konst.INDEX_REF) {
        this.loadIndex(s).then((msg) => {
          console.log(sprintf('Table %-8s %s...', 'index', msg));
        });
      } else if (lrf.Ld && lrf.Id == s.Konst.CHANGES_REF) {
        this.loadChanges(s).then((msg) => {
          console.log(sprintf('Table %-8s %s...', 'changes', msg));
        });
      } else if (lrf.Ld && lrf.Id == s.Konst.CODES_INDEX_REF) {
        this.loadCodeIndex(s, lrf).then((msg) => {
          console.log(sprintf('Table %-8s %s...', 'cd_index', msg));
        });
      } else if (lrf.Ld && lrf.Id == s.Konst.CODES_CODE_REF) {
        this.loadCodeCodes(s, lrf).then((msg) => {
          console.log(sprintf('Table %-8s %s...', 'cd_codes', msg));
        });
      } else if (lrf.Ld && lrf.Id == s.Konst.CODES_DATA_REF) {
        this.loadCodeData(s, lrf).then((msg) => {
          console.log(sprintf('Table %-8s %s...', 'cd_data', msg));
        });
      }
    }
  }

  loadIndex(s) {
    return new Promise((resolve, reject) => {
      const wbook = xlsx.readFile(s.Idxrt);
      const shlst = wbook.SheetNames;
      const xlsjs = xlsx.utils.sheet_to_json(
        wbook.Sheets[shlst[s.Konst.IDX_MAPPING_SHEET]]);
      const db = new sqlite3.Database(s.Dbort);
      db.serialize(() => {
        db.run('DELETE FROM indix;');
        for (var i = 0; i < xlsjs.length; i++) {
          db.run('INSERT INTO indix VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
            xlsjs[i].mapid, xlsjs[i].ctmrs, xlsjs[i].ctmrl, xlsjs[i].messg,
            xlsjs[i].mvers, xlsjs[i].idocm, xlsjs[i].idoct, xlsjs[i].mstat,
            xlsjs[i].fname, xlsjs[i].relsd, xlsjs[i].chgnr, xlsjs[i].suprt,
            xlsjs[i].asgnd, xlsjs[i].dstat,
            s.GetMsgTp(xlsjs[i].messg));
        }
        db.close();
      });
      resolve('uploaded');
    });
  }

  loadChanges(s) {
    return new Promise((resolve, reject) => {
      const wbook = xlsx.readFile(s.Idxrt);
      const shlst = wbook.SheetNames;
      const xlsjs = xlsx.utils.sheet_to_json(
        wbook.Sheets[shlst[s.Konst.CHG_CONTROL_SHEET]]);
      const db = new sqlite3.Database(s.Dbort);
      db.serialize(() => {
        db.run('DELETE FROM changes;');
        for (var i = 0; i < xlsjs.length; i++) {
          db.run('INSERT INTO changes VALUES(?,?);',
            xlsjs[i].chgid, xlsjs[i].fname);
        }
        db.close();
      });
      resolve('uploaded');
    });
  }

  loadCodeIndex(s, lrf) {
    return new Promise((resolve, reject) => {
      var csvdata = [];
      fs.createReadStream(s.Lrfdr + lrf.File)
        .pipe(parse({delimiter: '|'}))
        .on('data', csvrow => csvdata.push(csvrow))
        .on('end', () => {
          const db = new sqlite3.Database(s.Dbort);
          db.serialize(() => {
            db.run('DELETE FROM cd_index;');
            for (var row of csvdata) {
              db.run('INSERT INTO cd_index VALUES(?,?,?);',
                row[0], row[1], row[2]);
            }
            db.close();
          });
        });
        resolve('uploaded');
    });
  }

  loadCodeCodes(s, lrf) {
    return new Promise((resolve, reject) => {
      var csvdata = [];
      fs.createReadStream(s.Lrfdr + lrf.File)
        .pipe(parse({delimiter: '|'}))
        .on('data', csvrow => csvdata.push(csvrow))
        .on('end', () => {
          const db = new sqlite3.Database(s.Dbort);
          db.serialize(() => {
            db.run('DELETE FROM cd_codes;');
            for (var row of csvdata) {
              db.run('INSERT INTO cd_codes VALUES(?,?,?);',
                row[0], row[1], row[2]);
            }
            db.close();
          });
        });
      resolve('uploaded');
    });
  }

  loadCodeData(s, lrf) {
    return new Promise((resolve, reject) => {
      var csvdata = [];
      fs.createReadStream(s.Lrfdr + lrf.File)
        .pipe(parse({delimiter: '|'}))
        .on('data', csvrow => csvdata.push(csvrow))
        .on('end', () => {
          const db = new sqlite3.Database(s.Dbort);
          db.serialize(() => {
            db.run('DELETE FROM cd_data;');
            for (var row of csvdata) {
              db.run('INSERT INTO cd_data VALUES(?,?,?,?);',
                row[0], row[1], row[2], row[3]);
            }
            db.close();
          });
        });
      resolve('uploaded');
    });
  }
}
