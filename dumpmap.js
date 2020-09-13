`use strict`;
const sprintf  = require('/nodejs/node_modules/sprintf-js').sprintf;
const xlsxFile = require('/nodejs/node_modules/read-excel-file/node');
const outctrl  = require('./outctrl');

module.exports.Ddmp = class Ddmp {
  constructor() {
    this.trims = false;
    this.lfchr = '';
    this.strow = 0;
  }

  Dumpmap(parm, s) {
    s.Envmnt.SetRunVars(parm, s);
    this.o = new outctrl.Outctrl(s);
    this.trims = s.Envmnt.Trims;
    this.lfchr = s.Envmnt.Lfchr;
    this.openStreams(s);
  }

  openStreams(s) {
    const k = s.Dfault.d.konst;
    xlsxFile(s.Envmnt.Inpdr + s.Envmnt.Ctmrl + '\\' + s.Envmnt.Fname,
      { sheet: 2 }).then((rows) => {
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
      if (title != k.MAPPING_X12_SPECS && title !=
        k.MAPPING_ISO_SPECS) {
        console.error(
          'Error: Document is not an EDI Mapping Specification file.');
      }
      this.procDataLines(s, this.cell);
    });
  }

  procDataLines(s) {
    const k = s.Dfault.d.konst;
    var sectn = '';
    var sectx = '';
    var segmn = '';
    var fseg  = false;
    var ffld  = false;
    var sfld  = false;
    var sqhdr = 0;
    var sqsct = 0;
    var sqsgm = 0;
    var sqfld = 0;
    sqhdr++;
    this.procHeader(s, sqhdr);
    for (var row = k.ITEMS_TOP_LINE;
      String(this.cell[row][5]) != k.END_OF_MAPPING; row++) {
      var wrd = String(this.cell[row][2]).split(':');
      for (var i = 0; i < wrd.length; i++) {
        wrd[i] = String(wrd[i]).toUpperCase().trim();
      }
      if (wrd[0] == 'CONTROL RECORD') {
        sectn = 'MAIN';
        segmn = wrd[0];
        sqsct++;
        this.procSections(s, sqsct, row, sectn, sectn);
        fseg = true;
        sqsgm++;
        this.procSegments(s, sqsgm, row, sectn, segmn.substr(0, 7), 'cntrl',
          fseg);
        fseg = false;
        ffld = true;
      } else if (wrd[0] == 'MAPPING SECTION') {
        sectn = wrd[1];
        sectx = wrd[0] + ': ' + wrd[1];
        sqsct++;
        this.procSections(s, sqsct, row, sectn, sectx);
        fseg = true;
        ffld = true;
      } else if (wrd[0] == 'SEGMENT') {
        segmn = wrd[1];
        sqsgm++;
        this.procSegments(s, sqsgm, row, sectn, segmn, 'segmnt', fseg);
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
          this.procFields(s, sqfld, row, sectn, segmn.substr(0, 7), sfld);
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
    hd.mapid = s.Envmnt.Mapid;
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

  procSections(s, sqsct, row, sectn, sectx) {
    var sc = new sc_tp();
    var wrd = String(this.cell[row][3]).split(':');
    for (var i = 0; i < wrd.length; i++) {
      wrd[i] =  wrd[i].toUpperCase().trim();
    }
    sc.seqno = sprintf('%04d', sqsct);
    sc.mapid = s.Envmnt.Mapid;
    sc.secid = sectn;
    sc.stext = this.fmtValue(String(this.cell[row][3]))
    sc.lpmax = '';
    sc.stats = '';
    this.o.OutSection(s, sc, sectn, sectx)
  }

  procSegments(s, sqsgm, row, sectn, segmn, cntrl, fseg) {
    var sg = new sg_tp();
    var wrd = String(this.cell[row][3]).split(':');
    for (var i = 0; i < wrd.length; i++) {
      wrd[i] =  wrd[i].toUpperCase().trim();
    }
    sg.seqno = sprintf('%04d', sqsgm);
    sg.mapid = s.Envmnt.Mapid;
    sg.secid = sectn;
    sg.segid = segmn;
    sg.sgmtp = wrd[1];
    sg.lpmax = this.fmtValue(String(this.cell[row][4]));
    sg.stats = this.fmtValue(String(this.cell[row][5]));
    sg.usage = this.fmtValue(String(this.cell[row+1][0]));
    this.o.OutSegment(s, sg, cntrl, fseg);
  }

  procFields(s, sqfld, row, sectn, segmn, sfld) {
    var fl = new fl_tp();
    fl.seqno = sprintf('%04d', sqfld);
    fl.mapid = s.Envmnt.Mapid;
    fl.segid = segmn;
    fl.secid = sectn;
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
class sc_tp {
  constructor() {
    this.seqno = '';
    this.mapid = '';
    this.secid = '';
    this.stext = '';
    this.lpmax = '';
    this.stats = '';
  }
}
class sg_tp {
  constructor() {
    this.seqno = '';
    this.mapid = '';
    this.secid = '';
    this.segid = '';
    this.sgmtp = '';
    this.lpmax = '';
    this.stats = '';
    this.usage = '';
  }
}
class fl_tp {
  constructor() {
    this.seqno = '';
    this.mapid = '';
    this.secid = '';
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
