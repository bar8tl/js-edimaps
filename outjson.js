`use strict`;
const fs   = require('fs');
const path = require('path');

module.exports.Ojsn = class Ojsn {
  constructor() {
    this.sec   = 0;
    this.seg   = 0;
    this.fld   = 0;
    this.outdr = '';
    this.outpf = '';
    this.sp    = new Specs_tp();
  }

  OpenOjsn(s, otp) {
    this.sec   = -1;
    this.seg   = -1;
    this.fld   = -1;
    this.outdr = s.Envmnt.Outdr
    if (s.Dfault.d.dflt.OFILE_NAME == "LONG_NAME") {
      var inptn = path.basename(s.Envmnt.Fname, '.xlsx');
      this.outpf = inptn + '.json';
    } else {
      this.outpf = otp.Ofile;
    }
  }

  OutHeader(hd) {
    this.sp.header.title         = hd.mptit;
    this.sp.header.last_update   = hd.lstup;
    this.sp.header.author        = hd.authr;
    this.sp.header.version       = hd.bvers;
    this.sp.header.customer      = hd.custm;
    this.sp.header.target_format = hd.tform;
    this.sp.header.source_format = hd.sform;
    this.sp.header.instructions  = hd.instr;
    this.sp.header.sample        = hd.sampl;
  }

  OutSection(sc, sectx) {
    this.sp.sections.push(new Section_tp(sectx, sc.stext));
    this.sec++;
    this.seg = -1;
    this.fld = -1;
  }

  OutSegment(sg) {
    this.sp.sections[this.sec].segments.push(new Segment_tp(sg.segid, sg.sgmtp,
      sg.lpmax, sg.stats, sg.usage));
    this.seg++;
    this.fld = -1;
  }

  OutField(fl) {
    this.sp.sections[this.sec].segments[this.seg].fields.push(new Field_tp(
      fl.targt, fl.dtext, fl.sourc, fl.rcond, fl.commt, fl.sampl, fl.chang));
    this.fld++;
  }

  OutEof() {
    var data = JSON.stringify(this.sp, null, 2);
    fs.writeFileSync(this.outdr + this.outpf, data);
  }
}

class Specs_tp {
  constructor() {
    this.header   = new Header_tp();
    this.sections = []; // Array of Section_tp
  }
}

class Header_tp {
  constructor() {
    this.title         = '';
    this.last_update   = '';
    this.author        = '';
    this.version       = '';
    this.customer      = '';
    this.target_format = '';
    this.source_format = '';
    this.instructions  = '';
    this.sample        = '';
  }
}

class Section_tp {
  constructor(id, text) {
    this.section  = id;
    this.text     = text;
    this.segments = []; // Array of Segment_tp
  }
}

class Segment_tp {
  constructor(id, name, lpmax, stats, usage) {
    this.segment  = id;
    this.name     = name;
    this.loop_max = lpmax;
    this.status   = stats;
    this.usage    = usage;
    this.fields   = []; // Array of Field_tp
  }
}

class Field_tp {
  constructor(targt, dtext, sourc, rcond, commt, sampl, chang) {
    this.field   = targt;
    this.text    = dtext;
    this.source  = sourc;
    this.r_cond  = rcond;
    this.comment = commt;
    this.sample  = sampl;
    this.change  = chang;
  }
}
