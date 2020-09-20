`use strict`;
const constant = require('./constants');
const crtdb    = require('./crtdb');
const dumpmap  = require('./dumpmap');
const lrfdata  = require('./lrfdata');
const settings = require('./settings');

function main() {
  var s = new settings.Settings(constant.CONFIG, constant.DFAULT);
  for (const parm of s.Parms) {
    switch (parm.Optn) {
    case s.Konst.CREATE_DB :
      var dbo = new crtdb.Ddbo();
      dbo.CrtTables(parm, s);
      break;
    case s.Konst.LOAD_REFERENCES :
      var lrf = new lrfdata.Dlrf();
      lrf.LoadRefData(parm, s);
      break;
    case s.Konst.DUMP_MAPPING_FILE :
      var dmp = new dumpmap.Ddmp();
      dmp.Dumpmap(parm, s);
      break;
    }
  }
}

main();
