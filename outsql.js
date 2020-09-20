`use strict`;
const sqlite3 = require('/nodejs/node_modules/sqlite3');

module.exports.Osql = class Osql {
  constructor() {}

  OpenOsql(s, otp) {
    this.resetTables(s);
    this.db = new sqlite3.Database(s.Dbort, (err) => {
      if (err) {
        return console.error('sql-connection:', err.message);
      }
    });
  }

  OutHeader(hd) {
    this.db.run('INSERT INTO headers VALUES(?,?,?,?,?,?,?,?,?,?,?)',
      hd.seqno, hd.mapid, hd.mptit, hd.lstup, hd.authr, hd.bvers,
      hd.custm, hd.tform, hd.sform, hd.instr, hd.sampl, (err) => {
      if (err) {
        console.log('sql-insert:', err.message);
        throw err;
      }
    });
  }

  OutGroup(gp) {
    this.db.run('INSERT INTO groups VALUES(?,?,?,?,?,?)',
      gp.seqno, gp.mapid, gp.grpid, gp.gtext, gp.lpmax, gp.stats, (err) => {
      if (err) {
        console.log('sql-insert:', err.message);
        throw err;
      }
    });
  }

  OutSegment(sg) {
    this.db.run('INSERT INTO segments VALUES(?,?,?,?,?,?,?,?)',
      sg.seqno, sg.mapid, sg.grpid, sg.segid, sg.sgmtp, sg.lpmax, sg.stats,
      sg.usage, (err) => {
      if (err) {
        console.log('sql-insert:', err.message);
        throw err;
      }
    });
  }

  OutField(fl) {
    this.db.run('INSERT INTO fields VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      fl.seqno, fl.mapid, fl.grpid, fl.segid, fl.targt, fl.targ2, fl.dtext,
      fl.idocs, fl.idocq, fl.idocv, fl.sourc, fl.rcond, fl.commt, fl.sampl,
      fl.chang, (err) => {
      if (err) {
        console.log('sql-insert:', err.message);
        throw err;
      }
    });
  }

  OutEof() {
    this.db.close((err) => {
      if (err) {
        console.error('sql-close:', err.message);
      }
    });
  }

  resetTables(s) {
    const db = new sqlite3.Database(s.Dbort,(err) => {
      if (err) {
        return console.error('sql-connection:', err.message);
      }
    });
    db.serialize(() => {
      db.run('DELETE FROM headers  WHERE mapid=?;', s.Objnm, (err) => {
        if (err) {
          console.log('sql-delete:', err.message);
          throw err;
        }
      });
      db.run('DELETE FROM groups   WHERE mapid=?;', s.Objnm, (err) => {
        if (err) {
          console.log('sql-delete:', err.message);
          throw err;
        }
      });
      db.run('DELETE FROM segments WHERE mapid=?;', s.Objnm, (err) => {
        if (err) {
          console.log('sql-delete:', err.message);
          throw err;
        }
      });
      db.run('DELETE FROM fields   WHERE mapid=?;', s.Objnm, (err) => {
        if (err) {
          console.log('sql-delete:', err.message);
          throw err;
        }
      });
      db.close((err) => {
        if (err) {
          console.error('sql-close:', err.message);
        }
      });
    });
  }
}
