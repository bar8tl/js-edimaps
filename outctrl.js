`use strict`;
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
    for (var otp of s.Envmnt.Otype) {
      if (otp.Ocode == 'text')
        this.ot.OpenOtxt(s, otp);
      else if (otp.Ocode == 'json')
        this.oj.OpenOjsn(s, otp);
      else if (otp.Ocode == 'sqlite3')
        this.ol.OpenOsql(s, otp);
      else if (otp.Ocode == 'msaccess')
        this.om.OpenOmsa(s, otp);
    }
  }

  OutHeader(s, hd) {
    for (var otp of s.Envmnt.Otype) {
      if (otp.Ocode == 'text') {
        this.ot.OutHeader(hd);
      } else if (otp.Ocode == 'json') {
        this.oj.OutHeader(hd);
      } else if (otp.Ocode == 'sqlite3') {
        this.ol.OutHeader(hd);
      } else if (otp.Ocode == 'msaccess') {
        this.om.OutHeader(hd);
      }
    }
  }

  OutSection(s, sc, sectn, sectx) {
    for (var otp of s.Envmnt.Otype) {
      if (otp.Ocode == 'text') {
        if (sectx != sectn) {
          this.ot.OutSection(sc, sectx);
        }
      } else if (otp.Ocode == 'json') {
        this.oj.OutSection(sc, sectx);
      } else if (otp.Ocode == 'sqlite3') {
        this.ol.OutSection(sc);
      } else if (otp.Ocode == 'msaccess') {
        this.om.OutSection(sc);
      }
    }
  }

  OutSegment(s, sg, cntrl, fseg) {
    for (var otp of s.Envmnt.Otype) {
      if (otp.Ocode == 'text') {
        this.ot.OutSegment(sg, cntrl, fseg);
      } else if (otp.Ocode == 'json') {
        this.oj.OutSegment(sg);
      } else if (otp.Ocode == 'sqlite3') {
        this.ol.OutSegment(sg);
      } else if (otp.Ocode == 'msaccess') {
        this.om.OutSegment(sg);
      }
    }
  }

  OutField(s, fl, sfld) {
    for (var otp of s.Envmnt.Otype) {
      if (otp.Ocode == 'text') {
        this.ot.OutField(fl, sfld);
      } else if (otp.Ocode == 'json') {
        this.oj.OutField(fl);
      } else if (otp.Ocode == 'sqlite3') {
        this.ol.OutField(fl);
      } else if (otp.Ocode == 'msaccess') {
        this.om.OutField(fl);
      }
    }
  }

  OutEof(s) {
    for (var otp of s.Envmnt.Otype) {
      if (otp.Ocode == 'text') {
        this.ot.OutEof();
      } else if (otp.Ocode == 'json') {
        this.oj.OutEof();
      } else if (otp.Ocode == 'sqlite3') {
        this.ol.OutEof();
      } else if (otp.Ocode == 'msaccess') {
        this.om.OutEof();
      }
    }
  }
}
