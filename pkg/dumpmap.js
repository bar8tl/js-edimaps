// dumpmap.js [2019-07-01 BAR8TL]
// Starts archive processes for EDI messages mapping specifications
'use strict';
const xlsxFile = require('/nodejs/node_modules/read-excel-file/node');
const dumpcrl  = require('./dumpcrl');
const dumpinv  = require('./dumpinv');
const dumpasn  = require('./dumpasn');

module.exports.Ddmp = class Ddmp {
  constructor() {}

  Dumpmap(parm, s) {
    s.SetRunSettings(parm, s);
    xlsxFile(s.Inpdr + s.Ctmrl + '\\' + s.Fname,
      { sheet: s.Konst.MAPPING_SHEET }).then((rows) => {
      switch (s.Msgtp) {
      case s.Konst.CUSTOMER_RELEASE_MAP :
        var dmpcr = new dumpcrl.Dmpcr();
        dmpcr.Procmap(s, rows);
        break;
      case s.Konst.INVOICE_MAP :
        var dmpin = new dumpinv.Dmpin();
        dmpin.Procmap(s, rows);
        break;
      case s.konst.ASN_MAP :
        var dmpsn = new dumpasn.Dmpsn();
        dmpsn.Procmap(s, rows);
        break;
      }
    });
  }
}
