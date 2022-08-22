// outsql.js [2019-07-01 BAR8TL]
// Process SQLITE3 output
'use strict';
const sqlite3 = require('/nodejs/node_modules/sqlite3').verbose();

module.exports.Osql = class Osql {
  constructor() {
    this.hdfst = true;
    this.gpfst = true;
    this.sgfst = true;
    this.flfst = true;
  }

  OpenOsql(s, otp) {
    this.db = new sqlite3.Database(s.Dbort);
  }

  OutHeader(s, hd) {
    this.db.serialize(() => {
      if (this.hdfst) {
        this.db.run('DELETE FROM headers WHERE mapid=?;', s.Objnm);
        this.hdfst = false;
      }
      this.db.run('INSERT INTO headers VALUES(?,?,?,?,?,?,?,?,?,?,?)',
        hd.seqno, hd.mapid, hd.mptit, hd.lstup, hd.authr, hd.bvers,
        hd.custm, hd.tform, hd.sform, hd.instr, hd.sampl);
    });
  }

  OutGroup(s, gp) {
    this.db.serialize(() => {
      if (this.gpfst) {
        this.db.run('DELETE FROM groups WHERE mapid=?;', s.Objnm, (err) => {
          if (err) {
            console.log('sql-delete groups:', err.message);
            throw err;
          }
        });
        this.gpfst = false;
      }
      this.db.run('INSERT INTO groups VALUES(?,?,?,?,?,?)',
        gp.seqno, gp.mapid, gp.grpid, gp.gtext, gp.lpmax, gp.stats, (err) => {
          if (err) {
            console.log('sql-insert groups:', err.message);
            throw err;
          }
        });
    });
  }

  OutSegment(s, sg) {
    this.db.serialize(() => {
      if (this.sgfst) {
        this.db.run('DELETE FROM segments WHERE mapid=?;', s.Objnm, (err) => {
          if (err) {
            console.log('sql-delete segments:', err.message);
            throw err;
          }
        });
        this.sgfst = false;
      }
      this.db.run('INSERT INTO segments VALUES(?,?,?,?,?,?,?,?)',
        sg.seqno, sg.mapid, sg.grpid, sg.segid, sg.sgmtp, sg.lpmax, sg.stats,
        sg.usage, (err) => {
          if (err) {
            console.log('sql-insert segments:', err.message);
            throw err;
          }
        });
    });
  }

  OutField(s, fl) {
    this.db.serialize(() => {
      if (this.flfst) {
        this.db.run('DELETE FROM fields WHERE mapid=?;', s.Objnm, (err) => {
          if (err) {
            console.log('sql-delete fields:', err.message);
            throw err;
          }
        });
        this.flfst = false;
      }
      this.db.run('INSERT INTO fields VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        fl.seqno, fl.mapid, fl.grpid, fl.segid, fl.targt, fl.targ2, fl.dtext,
        fl.idocs, fl.idocq, fl.idocv, fl.sourc, fl.rcond, fl.commt, fl.sampl,
        fl.chang, (err) => {
          if (err) {
            console.log('sql-insert fields:', err.message);
            throw err;
          }
        });
    });
  }

  OutEof() {
    this.db.close((err) => {
      if (err) {
        console.error('sql-close:', err.message);
      }
    });
  }
}
