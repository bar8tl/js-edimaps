`use strict`;
const sqlite3 = require('/nodejs/node_modules/sqlite3');

module.exports.Osql = class Osql {
  constructor() {}

  OpenOsql(s, otp) {
    this.resetTables(s);
    this.db = new sqlite3.Database(s.Envmnt.Dbodr + s.Envmnt.Dbonm);
  }

  OutHeader(hd) {
    this.db.run('INSERT INTO headers VALUES(?,?,?,?,?,?,?,?,?,?,?)',
      hd.seqno, hd.mapid, hd.mptit, hd.lstup, hd.authr, hd.bvers,
      hd.custm, hd.tform, hd.sform, hd.instr, hd.sampl);
  }

  OutSection(sc) {
    this.db.run('INSERT INTO sections VALUES(?,?,?,?,?,?)',
      sc.seqno, sc.mapid, sc.secid, sc.stext, sc.lpmax, sc.stats);
  }

  OutSegment(sg) {
    this.db.run('INSERT INTO segments VALUES(?,?,?,?,?,?,?,?)',
      sg.seqno, sg.mapid, sg.secid, sg.segid, sg.sgmtp, sg.lpmax, sg.stats,
      sg.usage);
  }

  OutField(fl) {
    this.db.run('INSERT INTO fields VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      fl.seqno, fl.mapid, fl.secid, fl.segid, fl.targt, fl.targ2, fl.dtext,
      fl.idocs, fl.idocq, fl.idocv, fl.sourc, fl.rcond, fl.commt, fl.sampl,
      fl.chang);
  }

  OutEof() {
    this.db.close();
  }

  resetTables(s) {
    const db = new sqlite3.Database(s.Envmnt.Dbodr + s.Envmnt.Dbonm);
    db.serialize(() => {
      db.run('DELETE FROM headers  WHERE mapid=?;', s.Envmnt.Objnm);
      db.run('DELETE FROM sections WHERE mapid=?;', s.Envmnt.Objnm);
      db.run('DELETE FROM segments WHERE mapid=?;', s.Envmnt.Objnm);
      db.run('DELETE FROM fields   WHERE mapid=?;', s.Envmnt.Objnm);
      db.close();
    });
  }
}
