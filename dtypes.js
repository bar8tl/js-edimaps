`use strict`;

module.exports.Param_tp = class Param_tp {
  constructor(optn, prm1, prm2) {
    this.Optn = optn;
    this.Prm1 = prm1;
    this.Prm2 = prm2;
  }
}

module.exports.Output_tp = class Output_tp {
  constructor(otype, activ, ofile) {
    this.Otype = otype;
    this.Activ = activ;
    this.Ofile = ofile;
  }
}

module.exports.Progm_tp = class Progm_tp {
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

module.exports.Run_tp = class Run_tp {
  constructor(optcd, objnm, inpdr, outdr) {
    this.Optcd = optcd;
    this.Objnm = objnm;
    this.Inpdr = inpdr;
    this.Outdr = outdr;
  }
}

module.exports.Cdb_tp = class Cdb_tp {
  constructor(id, table, cr) {
    this.Id    = id;
    this.Table = table;
    this.Cr    = cr;
  }
}

module.exports.Lrf_tp = class Lrf_tp {
  constructor(id, table, file, ld) {
    this.Id    = id;
    this.Table = table;
    this.File  = file;
    this.Ld    = ld;
  }
}

module.exports.Sqlst_tp = class Sqlst_tp {
  constructor(activ, table, sqlst) {
    this.Activ = activ;
    this.Table = table;
    this.Sqlst = sqlst;
  }
}

module.exports.Mpcrt_tp = class Mpcrt_tp {
  constructor(table, sqlst) {
    this.Table = table;
    this.Sqlst = sqlst;
  }
}

module.exports.hd_tp = class hd_tp {
  constructor() {
    this.seqno = '';
    this.mapid = '';
    this.mptit = '';
    this.lstup = '';
    this.authr = '';
    this.bvers = '';
    this.custm = '';
    this.tform = '';
    this.sform = '';
    this.instr = '';
    this.sampl = '';
  }
}
module.exports.gp_tp = class gp_tp {
  constructor() {
    this.seqno = '';
    this.mapid = '';
    this.grpid = '';
    this.gtext = '';
    this.lpmax = '';
    this.stats = '';
  }
}
module.exports.sg_tp = class sg_tp {
  constructor() {
    this.seqno = '';
    this.mapid = '';
    this.grpid = '';
    this.segid = '';
    this.sgmtp = '';
    this.lpmax = '';
    this.stats = '';
    this.usage = '';
  }
}
module.exports.fl_tp = class fl_tp {
  constructor() {
    this.seqno = '';
    this.mapid = '';
    this.grpid = '';
    this.segid = '';
    this.targt = '';
    this.targ2 = '';
    this.dtext = '';
    this.idocs = '';
    this.idocq = '';
    this.idocv = '';
    this.sourc = '';
    this.rcond = '';
    this.commt = '';
    this.sampl = '';
    this.chang = '';
  }
}
