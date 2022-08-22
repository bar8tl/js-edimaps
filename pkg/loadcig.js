// loadcig.js [2019-07-01 BAR8TL]
// Loads Customer EDI Implementation Guidelines onto EDIMAPS Database
'use strict';
const sprintf = require('/nodejs/node_modules/sprintf-js').sprintf;
const sqlite3 = require('/nodejs/node_modules/sqlite3');
const xlsx    = require('/nodejs/node_modules/xlsx');

module.exports.Dlig = class Dlig {
  constructor() {
    this.mapid = '';
    this.versn = '';
    this.relsn = '';
  }

  LoadCustIg(parm, s) {
    s.SetRunSettings(parm, s);
    var posep = s.Cignm.lastIndexOf('.');
    if (posep == -1) {
      console.log('Error: Type of input file not identified.\r\n');
      process.exit(1);
    }
    var filnm = s.Cignm.substring(0, posep)
    var token = filnm.split('_');
    if (token.length < 2) {
      console.log('Error: EDI IG file name not compliant to standard.\r\n');
      process.exit(1);
    }
    var subst = token[1].split('-');
    if (subst.length == 1 || subst.length == 2 || subst.length == 3) {
      this.mapid = subst[0].trim().toUpperCase();
    }
    if (subst.length == 2 || subst.length == 3) {
      this.versn = subst[1].trim().toUpperCase();
    }
    if (subst.length == 3) {
      this.relsn = subst[2].trim().toUpperCase();
    }
    this.loadIG(s).then((msg) => {
      console.log(sprintf('File %-30s %s...', s.Cigrt, msg));
    });
  }

  loadIG(s) {
    return new Promise((resolve, reject) => {
      const wbook = xlsx.readFile(s.Cigrt);
      const shlst = wbook.SheetNames;
      const xlsjs = xlsx.utils.sheet_to_json(
        wbook.Sheets[shlst[s.Konst.CUSTOMER_IG_SHEET]]);
      const db = new sqlite3.Database(s.Dbort);
      db.serialize(() => {
        console.log(this.mapid, this.versn, this.relsn);
        db.run('DELETE FROM igitems where mapid=? and versn=? and relsn=?;',
          this.mapid, this.versn, this.relsn);
        for (var i = 0; i < xlsjs.length; i++) {
          var mapid = typeof xlsjs[i].MAPID === 'undefined' ? '':xlsjs[i].MAPID;
          var versn = typeof xlsjs[i].VERSN === 'undefined' ? '':xlsjs[i].VERSN;
          var rels  = typeof xlsjs[i].RELS  === 'undefined' ? '':xlsjs[i].RELS;
          var posno = typeof xlsjs[i].POSNO === 'undefined' ? '':xlsjs[i].POSNO;
          var path  = typeof xlsjs[i].PATH  === 'undefined' ? '':xlsjs[i].PATH;
          var dtype = typeof xlsjs[i].DTYPE === 'undefined' ? '':xlsjs[i].DTYPE;
          var sgrup = typeof xlsjs[i].SGRUP === 'undefined' ? '':xlsjs[i].SGRUP;
          var segm  = typeof xlsjs[i].SEGM  === 'undefined' ? '':xlsjs[i].SEGM;
          var dstr  = typeof xlsjs[i].DSTR  === 'undefined' ? '':xlsjs[i].DSTR;
          var delem = typeof xlsjs[i].DELEM === 'undefined' ? '':xlsjs[i].DELEM;
          var itmid = typeof xlsjs[i].ITMID === 'undefined' ? '':xlsjs[i].ITMID;
          var level = typeof xlsjs[i].LEVEL === 'undefined' ? '':xlsjs[i].LEVEL;
          var descr = typeof xlsjs[i].DESCR === 'undefined' ? '':xlsjs[i].DESCR;
          var count = typeof xlsjs[i].COUNT === 'undefined' ? '':xlsjs[i].COUNT;
          var minoc = typeof xlsjs[i].MINOC === 'undefined' ? '':xlsjs[i].MINOC;
          var maxoc = typeof xlsjs[i].MAXOC === 'undefined' ? '':xlsjs[i].MAXOC;
          var estat = typeof xlsjs[i].ESTAT === 'undefined' ? '':xlsjs[i].ESTAT;
          var etype = typeof xlsjs[i].ETYPE === 'undefined' ? '':xlsjs[i].ETYPE;
          var elen  = typeof xlsjs[i].ELEN  === 'undefined' ? '':xlsjs[i].ELEN;
          var cstat = typeof xlsjs[i].CSTAT === 'undefined' ? '':xlsjs[i].CSTAT;
          var ctype = typeof xlsjs[i].CTYPE === 'undefined' ? '':xlsjs[i].CTYPE;
          var clen  = typeof xlsjs[i].CLEN  === 'undefined' ? '':xlsjs[i].CLEN;
          var notes = typeof xlsjs[i].NOTES === 'undefined' ? '':xlsjs[i].NOTES;
          db.run('INSERT INTO igitems ' +
            'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
            mapid.trim(), versn.trim(), rels.trim(),  posno.trim(),
            path.trim(),  dtype.trim(), sgrup.trim(), segm.trim(),
            dstr.trim(),  delem.trim(), itmid.trim(), level.trim(),
            descr.trim(), count.trim(), minoc.trim(), maxoc.trim(),
            estat.trim(), etype.trim(), elen.trim(),  cstat.trim(),
            ctype.trim(), clen.trim(),  notes.trim());
        }
        db.close();
      });
      resolve('uploaded');
    });
  }
}
