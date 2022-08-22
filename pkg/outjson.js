// outjson.js [2019-07-01 BAR8TL]
// Process JSON output
'use strict';
const fs   = require('fs');
const path = require('path');

module.exports.Ojsn = class Ojsn {
  constructor() {
    this.grp   = 0;
    this.seg   = 0;
    this.fld   = 0;
    this.outdr = '';
    this.outpf = '';
    this.sp    = new Specs_tp();
  }

  OpenOjsn(s, otp) {
    this.grp   = -1;
    this.seg   = -1;
    this.fld   = -1;
    this.outdr = s.Outdr
    if (s.Dflt.OFILE_NAME == "LONG_NAME") {
      var inptn = path.basename(s.Fname, '.xlsx');
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

  OutGroup(gp, grupx) {
    this.sp.groups.push(new Group_tp(grupx, gp.gtext));
    this.grp++;
    this.seg = -1;
    this.fld = -1;
  }

  OutSegment(sg) {
    this.sp.groups[this.grp].segments.push(new Segment_tp(sg.segid, sg.sgmtp,
      sg.lpmax, sg.stats, sg.usage));
    this.seg++;
    this.fld = -1;
  }

  OutField(fl) {
    this.sp.groups[this.grp].segments[this.seg].fields.push(new Field_tp(
      fl.targt, fl.dtext, fl.sourc, fl.rcond, fl.commt, fl.sampl, fl.chang));
    this.fld++;
  }

  OutEof() {
    var data = JSON.stringify(this.sp, null, 2);
    fs.writeFileSync(this.outdr + this.outpf, data);
  }
}

// Specs_tp - File fields
class Specs_tp {
  constructor() {
    this.header = new Header_tp();
    this.groups = []; // Array of Section_tp
  }
}

// Header_tp - Header fields
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

// Group_tp - Group fields
class Group_tp {
  constructor(id, text) {
    this.group    = id;
    this.text     = text;
    this.segments = []; // Array of Segment_tp
  }
}

// Segment_tp - Segment fields
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

// Field_tp - Field fields
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
