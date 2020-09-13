`use strict`;
const fs   = require('fs');
const xlsx = require('/nodejs/node_modules/xlsx');

class Param_tp {
  constructor(optn, prm1, prm2) {
    this.Optn = optn;
    this.Prm1 = prm1;
    this.Prm2 = prm2;
  }
}

class Params {
  constructor() {
    this.Cmdpr = []
    var args = process.argv.slice(2);
    if (args.length == 0) {
      console.log('Run option missing\r\n')
      return
    }
    for (var i = 0; i < args.length; i++) {
      var curarg = args[i].toLowerCase();
      if (curarg.substr(0,1) == '-' || curarg.substr(0,1) == '//') {
        var optn = curarg.substr(1, curarg.length);
        var prm1 = '';
        var prm2 = '';
        if (optn != '') {
          if (optn.indexOf(':') != -1) {
            prm1 = optn.substr(optn.indexOf(':')+1, optn.length);
            optn = optn.substr(0, optn.indexOf(':')).trim();
            if (prm1.indexOf(':') != -1) {
              prm2 = prm1.substr(prm1.indexOf(':')+1, prm1.length).trim();
              prm1 = prm1.substr(0, prm1.indexOf(':')).trim();
            }
          }
          this.Cmdpr.push(new Param_tp(optn, prm1, prm2))
        } else {
          console.log('Run option missing\r\n')
        }
      }
    }
  }
}

class Output_tp {
  constructor(ocode, oactv, ofile) {
    this.Ocode = ocode;
    this.Oactv = oactv;
    this.Ofile = ofile;
  }
}

class Program_tp {
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

class Run_tp {
  constructor(option, objNam, inpDir, outDir) {
    this.Optcd = option;
    this.Objnm = objNam;
    this.Inpdr = inpDir;
    this.Outdr = outDir;
  }
}

class Cdb_tp {
  constructor(id, table, cr) {
    this.id    = id;
    this.table = table;
    this.cr    = cr;
  }
}

class Lrf_tp {
  constructor(id, table, file, ld) {
    this.id    = id;
    this.table = table;
    this.file  = file;
    this.ld    = ld;
  }
}

class Config {
  constructor(fname) {
    this.Progm = new Program_tp()
    this.Run   = []; // Array of Run_tp
    this.Cdb   = []; // Array of Cdb_tp
    this.Lrf   = []; // Array of Lrf_tp
    var jsonv = fs.readFileSync(fname);
    var c = JSON.parse(jsonv);
    this.Progm.Idxnm = c.program.idxNam.trim();
    this.Progm.Lrfdr = c.program.lrfDir.trim();
    this.Progm.Dbonm = c.program.dboNam.trim();
    this.Progm.Dbodr = c.program.dboDir.trim();
    this.Progm.Inpdr = c.program.inpDir.trim();
    this.Progm.Outdr = c.program.outDir.trim();
    this.Progm.Trims = c.program.trimSpace;
    this.Progm.Nodat = c.program.useNoData;
    this.Progm.Omite = c.program.ommitEmpty;
    this.Progm.Ndchr = c.program.noDataChar.trim();
    this.Progm.Lfchr = c.program.lineFeedChar.trim();
    for (var output of c.program.output) {
      this.Progm.Outtp.push(new Output_tp(
        output.otype.trim(),
        output.activ,
        output.ofile.trim()));
    }
    for (var run of c.run) {
      this.Run.push(new Run_tp(
        run.option.trim().toLowerCase(),
        run.objNam.trim(),
        run.inpDir.trim(),
        run.outDir.trim()));
    }
    for (var cdb of c.cdb) {
      this.Cdb.push(new Cdb_tp(
        cdb.id.trim().toLowerCase(),
        cdb.table.trim(),
        cdb.cr));
    }
    for (var lrf of c.lrf) {
      this.Lrf.push(new Lrf_tp(
        lrf.id.trim().toLowerCase(),
        lrf.table.trim(),
        lrf.file.trim(),
        lrf.ld));
    }
  }
}

class Dfault {
  constructor(fname) {
    var jsonv  = fs.readFileSync(fname);
    this.d     = JSON.parse(jsonv);
    this.Sqlst = []; // Array of booleans
    for (var sqlst of this.d.sqlst) {
      this.Sqlst.push(sqlst.activ ? true : false);
    }
  }
}

class Envmnt {
  constructor(c, k) {
    this.Objnm = '';
    this.Idxnm = c.Progm.Idxnm.length > 0 ? c.Progm.Idxnm : k.INDEX_NAME;
    this.Lrfdr = c.Progm.Lrfdr.length > 0 ? c.Progm.Lrfdr : k.REFDATA_DIR;
    this.Dbonm = c.Progm.Dbonm.length > 0 ? c.Progm.Dbonm : k.DB_NAME;
    this.Dbodr = c.Progm.Dbodr.length > 0 ? c.Progm.Dbodr : k.DB_DIR;
    this.Inpdr = c.Progm.Inpdr.length > 0 ? c.Progm.Inpdr : k.INPUTS_DIR;
    this.Outdr = c.Progm.Outdr.length > 0 ? c.Progm.Outdr : k.OUTPUTS_DIR;
    this.Trims = c.Progm.Trims.length > 0 ? c.Progm.Trims : k.TRIM_SPACE;
    this.Nodat = c.Progm.Nodat.length > 0 ? c.Progm.Nodat : k.USE_NO_DATA;
    this.Omite = c.Progm.Omite.length > 0 ? c.Progm.Omite : k.OMMIT_EMPTY;
    this.Ndchr = c.Progm.Ndchr.length > 0 ? c.Progm.Ndchr : k.NODATA_CHAR;
    this.Lfchr = c.Progm.Lfchr.length > 0 ? c.Progm.Lfchr : k.LF_CHAR;
    this.Inptf = '';
    this.Mapid = '';
    this.Ctmrs = '';
    this.Ctmrl = '';
    this.Messg = '';
    this.Mvers = '';
    this.Idocm = '';
    this.Stats = '';
    this.Fname = '';
    this.Msgtp = '';
    this.Otype = []; // Array of Output_tp
    for (var otp of c.Progm.Outtp) {
      if (otp.Oactv) {
        this.Otype.push(new Output_tp(otp.Ocode, otp.Oactv, otp.Ofile))
      }
    }
    this.Cdb = c.Cdb;
    this.Lrf = c.Lrf;
    this.Dtsys = new Date();
    this.Dtcur = new Date();
    this.Dtnul = new Date(0);
  }

  SetRunVars(p, s) {
    if (p.Optn == 'cdb') {
      if (p.Prm1.Length > 0) {
        s.Envmnt.Dbonam = p.Prm1.trim();
      }
      if (p.Prm2.length > 0) {
        var ids = String(p.Prm2.split('.'));
        for (var i = 0; i < ids.length; i++) {
          for (var j = 0; j < this.Cdb.length; j++) {
            if (ids[i] == this.Cdb[j].id) {
              this.Cdb[j].cr = true;
              break;
            }
          }
        }
      }
    }
    if (p.Optn == 'lrf' && p.Prm1.length > 0) {
      var ids = String(p.Prm1.split('.'));
      for (var i = 0; i < ids.length; i++) {
        for (var j = 0; j < this.Lrf.length; j++) {
          if (ids[i] == this.Lrf[j].id) {
            this.Lrf[j].ld = true;
            break;
          }
        }
      }
    }
    if (p.Optn == 'dmp') {
      if (p.Prm1.length > 0) {
        this.Objnm = p.Prm1.trim();
      } else {
        console.log('Error: Not possible to determine IDOC-Type name.\r\n');
        process.exit(1);
      }
    }
    var found = false;
    for (var i = 0; i < s.Config.Run.length && !found; i++) {
      var run = s.Config.Run[i];
      if (p.Optn == run.Optcd && p.Prm1 == run.Objnm) {
        found = true;
        this.Objnm = run.Objnm.length > 0 ? run.Objnm : p.Prm1;
        if (p.Optn == 'dmp') {
          this.Inpdr = run.Inpdr.length > 0 ? run.Inpdr : this.Inpdr;
          this.Outdr = run.Outdr.length > 0 ? run.Outdr : this.Outdr;
        }
      }
    }
    this.getMapDetail(s.Dfault.d.konst);
    for (var i = 0; i < this.Otype.length; i++) {
      this.Otype[i].Ofile = this.Otype[i].Ofile.replace('<mapid-mvers_idocm>',
        this.Mapid+'-'+this.Mvers+'_'+this.Idocm, 1);
    }
  }

  getMapDetail(k) {
    var found = false;
    const workbook = xlsx.readFile(this.Lrfdr+this.Idxnm);
    const sheet_name_list = workbook.SheetNames;
    var xlsj = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[k.IX_MAPPING_SHEET]]);
    for (var i=0; i < xlsj.length && !found; i++) {
      if (!found && xlsj[i].mapid == this.Objnm) {
        this.Mapid = xlsj[i].mapid;
        this.Ctmrs = xlsj[i].ctmrs;
        this.Ctmrl = xlsj[i].ctmrl;
        this.Messg = xlsj[i].messg;
        this.Mvers = xlsj[i].mvers;
        this.Idocm = xlsj[i].idocm;
        this.Stats = xlsj[i].stats;
        this.Fname = xlsj[i].fname;
        this.Msgtp = this.GetMsgTp(this.messg);
        found = true;
      }
    }
  }

  GetMsgTp(messg) {
    if (messg == 'invoice' || messg == '810') {
      return 'inv';
    } else if (messg == 'desadv' || messg == '856') {
      return 'asn';
    } else {
      return 'crl';
    }
  }
}

module.exports.Settings = class Settings {
  constructor(cfnam, dfnam) {
    this.Params = new Params();
    this.Config = new Config(cfnam);
    this.Dfault = new Dfault(dfnam);
    this.Envmnt = new Envmnt(this.Config, this.Dfault.d.konst);
  }
}
