// settings.js [2019-07-01 BAR8TL]
// Establishes program global and run settings
'use strict';
const fs     = require('fs');
const xlsx   = require('/nodejs/node_modules/xlsx');
const params = require('./params');

// Dfault - Defaults, Constants and Literal values
class Dfault {
  constructor(fname) {
    var jsonv = fs.readFileSync(fname);
    this.d = JSON.parse(jsonv);
    this.Sqlst = []; // Array of sqlst_tp
    this.customizeDfault();
  }

  customizeDfault() {
    this.Dflt  = this.d.dflt;
    this.Konst = this.d.konst;
    this.Errs  = this.errs;
    for (var sql of this.d.sqlst) {
      if (sql.activ) {
        this.Sqlst.push(new Sqlst_tp(
          sql.activ,
          sql.table,
          sql.sqlst
        ));
      }
    }
  }
}

// Envmnt - Run specific environment variables
class Envmnt {
  constructor() {
    this.Dtsys = new Date();
    this.Dtcur = new Date();
    this.Dtnul = new Date(0);
    this.Objnm = '';
    this.Inptf = '';
    this.Mapid = '';
    this.Ctmrs = '';
    this.Ctmrl = '';
    this.Messg = '';
    this.Mvers = '';
    this.Idocm = '';
    this.Mstat = '';
    this.Fname = '';
    this.Chgnr = '';
    this.Suprt = '';
    this.Asgnd = '';
    this.Rsvld = '';
    this.Dstat = '';
    this.Msgtp = '';
  }
}

// Config - Values from configuration file
class Config {
  constructor(fname) {
    var jsonv = fs.readFileSync(fname);
    this.c = JSON.parse(jsonv);
    this.Idxnm = '';
    this.Lrfdr = '';
    this.Cigdr = '';
    this.Dbonm = '';
    this.Dbodr = '';
    this.Inpdr = '';
    this.Outdr = '';
    this.Trims = '';
    this.Outtp = []; // Array of Output_tp
    this.Run   = []; // Array of Run_tp
    this.Cdb   = []; // Array of Cdb_tp
    this.Lrf   = []; // Array of Lrf_tp
    this.Idxrt = '';
    this.Cigrt = '';
    this.Dbort = '';
    this.Nodat = '';
    this.Omite = '';
    this.Ndchr = '';
    this.Lfchr = '';
    this.cutomizeConfig();
  }

  cutomizeConfig() {
    this.Idxnm = this.c.progm.idxnm.length > 0 ?
      this.c.progm.idxnm.trim() : dfault.Konst.INDEX_NAME;
    this.Lrfdr = this.c.progm.lrfdr.length > 0 ?
      this.c.progm.lrfdr.trim() : dfault.Konst.REFDATA_DIR;
    this.Cigdr = this.c.progm.cigdr.length > 0 ?
      this.c.progm.cigdr.trim() : dfault.Konst.CUSTOMERIG_DIR;
    this.Dbonm = this.c.progm.dbonm.length > 0 ?
      this.c.progm.dbonm.trim() : dfault.Konst.DB_NAME;
    this.Dbodr = this.c.progm.dbodr.length > 0 ?
      this.c.progm.dbodr.trim() : dfault.Konst.DB_DIR;
    this.Inpdr = this.c.progm.inpdr.length > 0 ?
      this.c.progm.inpdr.trim() : dfault.Konst.INPUTS_DIR;
    this.Outdr = this.c.progm.outdr.length > 0 ?
      this.c.progm.outdr.trim() : dfault.Konst.OUTPUTS_DIR;
    this.Ndchr = this.c.progm.ndchr.length > 0 ?
      this.c.progm.ndchr.trim() : dfault.Konst.NODATA_CHAR;
    this.Lfchr = this.c.progm.lfchr.length > 0 ?
      this.c.progm.lfchr.trim() : dfault.Konst.LF_CHAR;
    this.Idxrt = this.Lrfdr + this.Idxnm;
    this.Cigrt = this.Cigdr;
    this.Dbort = this.Dbodr + this.Dbonm;
    this.Trims = this.c.progm.trims;
    this.Nodat = this.c.progm.nodat;
    this.Omite = this.c.progm.omite;
    for (var otp of this.c.progm.outpt) {
      if (otp.activ) {
        this.Outtp.push(new Output_tp(
          otp.otype.trim().toLowerCase(),
          otp.activ,
          otp.ofile.trim().toLowerCase()
        ));
      }
    }
    for (var run of this.c.run) {
      this.Run.push(new Run_tp(
        run.optcd.trim().toLowerCase(),
        run.objnm.trim(),
        run.inpdr.trim(),
        run.outdr.trim()
      ));
    }
    for (var cdb of this.c.cdb) {
      this.Cdb.push(new Cdb_tp(
        cdb.id.trim().toLowerCase(),
        cdb.table.trim(),
        cdb.cr
      ));
    }
    for (var lrf of this.c.lrf) {
      this.Lrf.push(new Lrf_tp(
        lrf.id.trim().toLowerCase(),
        lrf.table.trim(),
        lrf.file.trim(),
        lrf.tab.trim(),
        lrf.ld
      ));
    }
  }
}

// settings - Program global settings - Inheriting from parameters,
// configuration, defaults and constants
module.exports.Settings = class Settings {
  constructor(cfnam, dfnam) {
    this.params = new params.Params();
    this.dfault = new Dfault(dfnam);
    this.config = new Config(cfnam);
    this.envmnt = new Envmnt();
    this.customizeSettings()
  }

  // Following definitions will be migrated to own class as soon as I am able
  // to implement multiple inheritance
  customizeSettings() {
    // Params
    this.Parms = this.params.Parms; // Array of Parm_tp
    // Dfault
    this.Dflt  = this.dfault.Dflt;
    this.Konst = this.dfault.Konst;
    this.Errs  = this.dfault.Errs;
    this.Sqlst = this.dfault.Sqlst; // Array of Sqlst_tp
    // Config
    this.Idxnm = this.config.Idxnm;
    this.Lrfdr = this.config.Lrfdr;
    this.Cigdr = this.config.Cigdr;
    this.Dbonm = this.config.Dbonm;
    this.Dbodr = this.config.Dbodr;
    this.Inpdr = this.config.Inpdr;
    this.Outdr = this.config.Outdr;
    this.Trims = this.config.Trims;
    this.Outtp = this.config.Outtp; // Array of Output_tp
    this.Run   = this.config.Run;   // Array of Run_tp
    this.Cdb   = this.config.Cdb;   // Array of Cdb_tp
    this.Lrf   = this.config.Lrf;   // Array of Lrf_tp
    this.Idxrt = this.config.Idxrt;
    this.Cigrt = this.config.Cigrt;
    this.Dbort = this.config.Dbort;
    this.Nodat = this.config.Nodat;
    this.Omite = this.config.Omite;
    this.Ndchr = this.config.Ndchr;
    this.Lfchr = this.config.Lfchr;
    // Envmnt
    this.Dtsys = this.envmnt.Dtsys;
    this.Dtcur = this.envmnt.Dtcur;
    this.Dtnul = this.envmnt.Dtnul;
    this.Objnm = this.envmnt.Objnm;
    this.Inptf = this.envmnt.Inptf;
    this.Mapid = this.envmnt.Mapid;
    this.Ctmrs = this.envmnt.Ctmrs;
    this.Ctmrl = this.envmnt.Ctmrl;
    this.Messg = this.envmnt.Messg;
    this.Mvers = this.envmnt.Mvers;
    this.Idocm = this.envmnt.Idocm;
    this.Mstat = this.envmnt.Mstat;
    this.Fname = this.envmnt.Fname;
    this.Chgnr = this.envmnt.Chgnr;
    this.Suprt = this.envmnt.Suprt;
    this.Asgnd = this.envmnt.Asgnd;
    this.Rsvld = this.envmnt.Rsvld;
    this.Dstat = this.envmnt.Dstat;
    this.Msgtp = this.envmnt.Msgtp;
  }

  SetRunSettings(p) {
    if (p.Optn == this.Konst.CREATE_DB) {
      if (p.Prm1.Length > 0) {
        this.Dbonm = p.Prm1.trim();
      }
      if (p.Prm2.length > 0) {
        var ids = p.Prm2.split('.');
        for (var i = 0; i < this.Cdb.length; i++) {
          for (var j = 0; j < ids.length; j++) {
            if (this.Cdb[i].Id == ids[j]) {
              this.Cdb[i].Cr = true;
              break;
            } else {
              this.Cdb[i].Cr = false;
            }
          }
        }
      }
    }
    if (p.Optn == this.Konst.LOAD_REFERENCES && p.Prm1.length > 0) {
      var ids = p.Prm1.split('.');
      for (var i = 0; i < this.Lrf.length; i++) {
        for (var j = 0; j < ids.length; j++) {
          if (this.Lrf[i].Id == ids[j]) {
            this.Lrf[i].Ld = true;
            break;
          } else {
            this.Lrf[i].Ld = false;
          }
        }
      }
    }
    if (p.Optn == this.Konst.DUMP_MAPPING_FILE) {
      if (p.Prm1.length > 0) {
        this.Objnm = p.Prm1.trim();
      } else {
        console.log('Error: Not possible to determine IDOC-Type name.\r\n');
        process.exit(1);
      }
    }
    if (p.Optn == this.Konst.LOAD_CUSTOMER_IG) {
      if (p.Prm1.length > 0) {
        this.Cignm = p.Prm1.trim();
        this.Cigrt = this.Cigdr + this.Cignm;
      } else {
        console.log('Error: Not possible to determine Customer IG file.\r\n');
        process.exit(1);
      }
    }
    var found = false;
    for (var i = 0; i < this.Run.length && !found; i++) {
      var run = s.config.Run[i];
      if (p.Optn == run.Optcd && p.Prm1 == run.Objnm) {
        found = true;
        this.Objnm = run.Objnm.length > 0 ? run.Objnm : p.Prm1;
        if (p.Optn == this.Konst.DUMP_MAPPING_FILE) {
          this.Inpdr = run.Inpdr.length > 0 ? run.Inpdr : this.Inpdr;
          this.Outdr = run.Outdr.length > 0 ? run.Outdr : this.Outdr;
        }
      }
    }
    this.getMapDetail();
    for (var i = 0; i < this.Outtp.length; i++) {
      this.Outtp[i].Ofile = this.Outtp[i].Ofile.replace('<mapid-mvers_idocm>',
        this.Mapid+'-'+this.Mvers+'_'+this.Idocm, 1);
    }
  }

  getMapDetail() {
    var found = false;
    const workbook = xlsx.readFile(this.Lrfdr+this.Idxnm);
    const sheet_name_list = workbook.SheetNames;
    var xlsj = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[this.Konst.IDX_MAPPING_SHEET]]);
    for (var i = 0; i < xlsj.length && !found; i++) {
      if (!found && xlsj[i].mapid == this.Objnm) {
        this.Mapid = xlsj[i].mapid;
        this.Ctmrs = xlsj[i].ctmrs;
        this.Ctmrl = xlsj[i].ctmrl;
        this.Messg = xlsj[i].messg;
        this.Mvers = xlsj[i].mvers;
        this.Idocm = xlsj[i].idocm;
        this.Idoct = xlsj[i].idoct;
        this.Mstat = xlsj[i].mstat;
        this.Fname = xlsj[i].fname;
        this.Relsd = xlsj[i].relsd;
        this.Chgnr = xlsj[i].chgnr;
        this.Suprt = xlsj[i].suprt;
        this.Asgnd = xlsj[i].asgnd;
        this.Rsvld = xlsj[i].rsvld;
        this.Dstat = xlsj[i].dstat;
        this.Msgtp = this.GetMsgTp(this.Messg);
        found = true;
      }
    }
  }

  GetMsgTp(messg) {
    if (messg == 'invoice' || messg == '810') {
      return this.Konst.INVOICE_MAP;
    } else if (messg == 'desadv' || messg == '856') {
      return this.Konst.ASN_MAP;
    } else {
      return this.Konst.CUSTOMER_RELEASE_MAP;
    }
  }
}

// Sqlst_tp - Structure for SQL statements in default file
class Sqlst_tp {
  constructor(activ, table, sqlst) {
    this.Activ = activ;
    this.Table = table;
    this.Sqlst = sqlst;
  }
}

// Output_tp - Output settings structure
class Output_tp {
  constructor(otype, activ, ofile) {
    this.Otype = otype;
    this.Activ = activ;
    this.Ofile = ofile;
  }
}

// Progm_tp - Program settings structure
class Progm_tp {
  constructor() {
    this.Idxnm = '';
    this.Lrfdr = '';
    this.Dbonm = '';
    this.Dbodr = '';
    this.Inpdr = '';
    this.Outdr = '';
    this.Trims = false;
    this.Nodat = false;
    this.Omite = false;
    this.Ndchr = '';
    this.Lfchr = '';
    this.Outtp = []; // Array of Output_tp
  }
}

// Run_tp - Run settings structure
class Run_tp {
  constructor(optcd, objnm, inpdr, outdr) {
    this.Optcd = optcd;
    this.Objnm = objnm;
    this.Inpdr = inpdr;
    this.Outdr = outdr;
  }
}

// Cdb_tp - DB creation settings structure
class Cdb_tp {
  constructor(id, table, cr) {
    this.Id    = id;
    this.Table = table;
    this.Cr    = cr;
  }
}

// Lrf_tp - Reference Loading settings structure
class Lrf_tp {
  constructor(id, table, file, tab, ld) {
    this.Id    = id;
    this.Table = table;
    this.File  = file;
    this.Tab   = tab;
    this.Ld    = ld;
  }
}
