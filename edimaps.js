`use strict`;
const constant = require('./constants');
const crtdb    = require('./crtdb');
const dumpmap  = require('./dumpmap');
const lrfdata  = require('./lrfdata');
const settings = require('./settings');

function main() {
  var s = new settings.Settings(constant.CONFIG, constant.DFAULT)
  for (const parm of s.Params.Cmdpr) {
    if (parm.Optn == 'cdb') {
      var dbo = new crtdb.Ddbo();
      dbo.CrtTables(parm, s);
    } else if (parm.Optn == 'lrf') {
      var lrf = new lrfdata.Dlrf();
      lrf.LoadRefData(parm, s);
    } else if (parm.Optn == 'dmp') {
      var dmp = new dumpmap.Ddmp();
      dmp.Dumpmap(parm, s);
    }
  }
}

main();
