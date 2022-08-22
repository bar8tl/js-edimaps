// params.js [2019-07-01 BAR8TL]
// Gets parameters from run command line
'use strict';

module.exports.Params = class Params {
  constructor() {
    this.Parms = []; // Array of parm_tp
    this.getParams();
  }

  getParams() {
    var args = process.argv.slice(2);
    if (args.length == 0) {
      console.log('Run option missing\r\n')
      return
    }
    for (var i = 0; i < args.length; i++) {
      var curarg = args[i];
      if (curarg.substr(0,1) == '-' || curarg.substr(0,1) == '//') {
        var optn = curarg.substr(1, curarg.length);
        var prm1 = '';
        var prm2 = '';
        if (optn != '') {
          if (optn.indexOf(':') != -1) {
            prm1 = optn.substr(optn.indexOf(':')+1, optn.length);
            optn = optn.substr(0, optn.indexOf(':')).trim();
            if (prm1.indexOf(':') != -1) {
              prm2 = prm1.substr(prm1.indexOf(':')+1, prm1.length).trim();
              prm1 = prm1.substr(0, prm1.indexOf(':')).trim();
            }
          }
          this.Parms.push(new Parm_tp(optn, prm1, prm2))
        } else {
          console.log('Run option missing\r\n')
        }
      }
    }
  }
}

// parm_tp - Command line parameters structure
class Parm_tp {
  constructor(optn, prm1, prm2) {
    this.Optn = optn;
    this.Prm1 = prm1;
    this.Prm2 = prm2;
  }
}
