// outctrl.js [2019-07-01 BAR8TL]
// Archiving outputs control
'use strict';
const outjsn = require('./outjson');
const outsql = require('./outsql');
const outtxt = require('./outtxt');
const outmsa = require('./outmsa');

module.exports.Outctrl = class Outctrl {
  constructor(s) {
    this.ot = new outtxt.Otxt();
    this.oj = new outjsn.Ojsn();
    this.ol = new outsql.Osql();
    this.om = new outmsa.Omsa();
    for (var otp of s.Outtp) {
      if (otp.Otype == 'text')
        this.ot.OpenOtxt(s, otp);
      else if (otp.Otype == 'json')
        this.oj.OpenOjsn(s, otp);
      else if (otp.Otype == 'sqlite3')
        this.ol.OpenOsql(s, otp);
      else if (otp.Otype == 'msaccess')
        this.om.OpenOmsa(s, otp);
    }
  }

  OutHeader(s, hd) {
    for (var otp of s.Outtp) {
      if (otp.Otype == 'text') {
        this.ot.OutHeader(hd);
      } else if (otp.Otype == 'json') {
        this.oj.OutHeader(hd);
      } else if (otp.Otype == 'sqlite3') {
        this.ol.OutHeader(s, hd);
      } else if (otp.Otype == 'msaccess') {
        this.om.OutHeader(hd);
      }
    }
  }

  OutGroup(s, gp, group, grupx) {
    for (var otp of s.Outtp) {
      if (otp.Otype == 'text') {
        if (grupx != group) {
          this.ot.OutGroup(gp, grupx);
        }
      } else if (otp.Otype == 'json') {
        this.oj.OutGroup(gp, grupx);
      } else if (otp.Otype == 'sqlite3') {
        this.ol.OutGroup(s, gp);
      } else if (otp.Otype == 'msaccess') {
        this.om.OutGroup(gp);
      }
    }
  }

  OutSegment(s, sg, cntrl, fseg) {
    for (var otp of s.Outtp) {
      if (otp.Otype == 'text') {
        this.ot.OutSegment(sg, cntrl, fseg);
      } else if (otp.Otype == 'json') {
        this.oj.OutSegment(sg);
      } else if (otp.Otype == 'sqlite3') {
        this.ol.OutSegment(s, sg);
      } else if (otp.Otype == 'msaccess') {
        this.om.OutSegment(sg);
      }
    }
  }

  OutField(s, fl, sfld) {
    for (var otp of s.Outtp) {
      if (otp.Otype == 'text') {
        this.ot.OutField(fl, sfld);
      } else if (otp.Otype == 'json') {
        this.oj.OutField(fl);
      } else if (otp.Otype == 'sqlite3') {
        this.ol.OutField(s, fl);
      } else if (otp.Otype == 'msaccess') {
        this.om.OutField(fl);
      }
    }
  }

  OutEof(s) {
    for (var otp of s.Outtp) {
      if (otp.Otype == 'text') {
        this.ot.OutEof();
      } else if (otp.Otype == 'json') {
        this.oj.OutEof();
      } else if (otp.Otype == 'sqlite3') {
        this.ol.OutEof();
      } else if (otp.Otype == 'msaccess') {
        this.om.OutEof();
      }
    }
  }
}
