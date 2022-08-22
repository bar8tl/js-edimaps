// edimaps.js [2019-07-01 BAR8TL]
// Starts processes for EDI mapping specs
'use strict';
const constant = require('./pkg/constants');
const crtdb    = require('./pkg/crtdb');
const dumpmap  = require('./pkg/dumpmap');
const lrfdata  = require('./pkg/lrfdata');
const loadcig  = require('./pkg/loadcig');
const settings = require('./pkg/settings');

function main() {
  var s = new settings.Settings(constant.CONFIG, constant.DFAULT);
  for (const parm of s.Parms) {
    switch (parm.Optn) {
    case s.Konst.CREATE_DB :
      var dbo = new crtdb.Crtdb();
      dbo.CrtTables(parm, s);
      break;
    case s.Konst.LOAD_REFERENCES :
      var lrf = new lrfdata.Dlrf();
      lrf.LoadRefData(parm, s);
      break;
    case s.Konst.LOAD_CUSTOMER_IG :
      var lig = new loadcig.Dlig();
      lig.LoadCustIg(parm, s);
      break;
    case s.Konst.DUMP_MAPPING_FILE :
      var dmp = new dumpmap.Ddmp();
      dmp.Dumpmap(parm, s);
      break;
    }
  }
}

main();
