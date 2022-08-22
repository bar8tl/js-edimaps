// dumpcrl.js [2019-07-01 BAR8TL]
// Starts archiving of EDI Customer Releases mapping specifications
'use strict';
const sprintf = require('/nodejs/node_modules/sprintf-js').sprintf;
const outctrl = require('./outctrl');

module.exports.Dmpcr = class Dmpcr {
  constructor() {
    this.trims = false;
    this.lfchr = '';
    this.strow = 0;
  }

  Procmap(s, rows) {
    this.trims = s.Trims;
    this.lfchr = s.Lfchr;
    this.o    = new outctrl.Outctrl(s);
    this.cell = rows;
    for (var i in this.cell) {
      for (var j in this.cell[i]) {
        if (this.cell[i][j] == null) {
          this.cell[i][j] = '';
        } else if (this.cell[i][j] == 'DIRECT') {
          this.strow = i-1;
        }
      }
    }
    var title = String(this.cell[0][1]).trim();
    if (title != s.Konst.MAPPING_X12_SPECS &&
        title != s.Konst.MAPPING_ISO_SPECS) {
     console.error('Error: Document is not an EDI Mapping Specification file.');
    }
    this.procLines(s);
  }

  procLines(s) {
    var group = '';
    var grupx = '';
    var segmn = '';
    var fseg  = false;
    var ffld  = false;
    var sfld  = false;
    var sqhdr = 0;
    var sqgrp = 0;
    var sqsgm = 0;
    var sqfld = 0;
    sqhdr++;
    this.procHeader(s, sqhdr);
    for (var row = s.Konst.ITEMS_TOP_LINE;
      String(this.cell[row][5]) != s.Konst.END_OF_MAPPING; row++) {
      var wrd = String(this.cell[row][2]).split(':');
      for (var i = 0; i < wrd.length; i++) {
        wrd[i] = String(wrd[i]).toUpperCase().trim();
      }
      if (wrd[0] == 'CONTROL RECORD') {
        group = 'MAIN';
        segmn = wrd[0];
        sqgrp++;
        this.procGroups(s, sqgrp, row, group, group);
        fseg = true;
        sqsgm++;
        this.procSegments(s, sqsgm, row, group, segmn.substr(0, 7), 'cntrl',
          fseg);
        fseg = false;
        ffld = true;
      } else if (wrd[0] == 'MAPPING SECTION') {
        group = wrd[1];
        grupx = wrd[0] + ': ' + wrd[1];
        sqgrp++;
        this.procGroups(s, sqgrp, row, group, grupx);
        fseg = true;
        ffld = true;
      } else if (wrd[0] == 'SEGMENT') {
        segmn = wrd[1];
        sqsgm++;
        this.procSegments(s, sqsgm, row, group, segmn, 'segmnt', fseg);
        fseg = false;
        ffld = true;
      } else {
        if (wrd[0].length > 0 && wrd[0] !== 'NULL') {
          if (ffld) {
            ffld = false;
            sfld = false;
          } else {
            sfld = true;
          }
          sqfld++;
          this.procFields(s, sqfld, row, group, segmn.substr(0, 7), sfld);
        }
      }
    }
    this.procClosure(s);
  }

  procHeader(s, sqhdr) {
    var hd = new hd_tp();
    if (String(this.cell[this.strow][3]).length > 0) {
      hd.instr = this.fmtValue(String(this.cell[this.strow][3]));
    } else {
      hd.instr = this.fmtValue(String(this.cell[this.strow][4]));
    }
    hd.seqno = sprintf('%04d', sqhdr);
    hd.mapid = s.Mapid;
    hd.mptit = this.fmtValue(String(this.cell[0][1]));
    hd.lstup = this.fmtValue(String(this.cell[1][2]));
    hd.authr = this.fmtValue(String(this.cell[1][4]));
    hd.bvers = this.fmtValue(String(this.cell[2][2]));
    hd.custm = this.fmtValue(String(this.cell[2][4]));
    hd.tform = this.fmtValue(String(this.cell[4][2]));
    hd.sform = this.fmtValue(String(this.cell[4][3]));
    hd.sampl = this.fmtValue(String(this.cell[this.strow][6]));
    this.o.OutHeader(s, hd)
  }

  procGroups(s, sqgrp, row, group, grupx) {
    var gp = new gp_tp();
    var wrd = String(this.cell[row][3]).split(':');
    for (var i = 0; i < wrd.length; i++) {
      wrd[i] =  wrd[i].toUpperCase().trim();
    }
    gp.seqno = sprintf('%04d', sqgrp);
    gp.mapid = s.Mapid;
    gp.grpid = group;
    gp.grptx = this.fmtValue(String(this.cell[row][3]))
    gp.lpmax = '';
    gp.stats = '';
    this.o.OutGroup(s, gp, group, grupx)
  }

  procSegments(s, sqsgm, row, group, segmn, cntrl, fseg) {
    var sg = new sg_tp();
    var wrd = String(this.cell[row][3]).split(':');
    for (var i = 0; i < wrd.length; i++) {
      wrd[i] =  wrd[i].toUpperCase().trim();
    }
    sg.seqno = sprintf('%04d', sqsgm);
    sg.mapid = s.Mapid;
    sg.grpid = group;
    sg.segid = segmn;
    sg.sgmtp = wrd[1];
    sg.lpmax = this.fmtValue(String(this.cell[row][4]));
    sg.stats = this.fmtValue(String(this.cell[row][5]));
    sg.usage = this.fmtValue(String(this.cell[row+1][0]));
    this.o.OutSegment(s, sg, cntrl, fseg);
  }

  procFields(s, sqfld, row, group, segmn, sfld) {
    var fl = new fl_tp();
    fl.seqno = sprintf('%04d', sqfld);
    fl.mapid = s.Mapid;
    fl.segid = segmn;
    fl.grpid = group;
    fl.targt = this.fmtValue(String(this.cell[row][2]));
    fl.targ2 = '';
    fl.dtext = this.fmtValue(String(this.cell[row][0]));
    fl.idocs = '';
    fl.idocq = '';
    fl.idocv = '';
    fl.sourc = this.fmtValue(String(this.cell[row][3]));
    fl.rcond = this.fmtValue(String(this.cell[row][4]));
    fl.commt = this.fmtValue(String(this.cell[row][5]));
    fl.sampl = this.fmtValue(String(this.cell[row][6]));
    fl.chang = this.fmtValue(String(this.cell[row][1]));
    this.o.OutField(s, fl, sfld);
  }

  procClosure(s) {
    this.o.OutEof(s);
  }

  fmtValue(val) {
    for (var i = 0; i < 10; i++) {
      val = val.replace('\r\n', this.lfchr);
    }
    if (this.trims) {
      val = val.trim();
    }
    return val;
  }
}

// hd_tp - Header fields
class hd_tp {
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

// gp_tp - Group fields
class gp_tp {
  constructor() {
    this.seqno = '';
    this.mapid = '';
    this.grpid = '';
    this.gtext = '';
    this.lpmax = '';
    this.stats = '';
  }
}

// sg_tp - Segment fields
class sg_tp {
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

// fl_tp - Field fields
class fl_tp {
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
