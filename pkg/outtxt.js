// outtxt.js [2019-07-01 BAR8TL]
// Process TEXT output
'use strict';
const fs       = require('fs');
const path     = require('path');
const sprintf  = require('/nodejs/node_modules/sprintf-js').sprintf;

module.exports.Otxt = class Otxt {
  constructor() {
    this.line  = '';
    this.outdr = '';
    this.outpf = '';
    this.ndchr = '';
    this.nodat = false;
    this.omite = false;
  }

  OpenOtxt(s, otp) {
    this.outdr = s.Outdr;
    this.nodat = s.Nodat;
    this.omite = s.Omite;
    this.ndchr = s.Ndchr;
    if (s.Dflt.OFILE_NAME == 'LONG_NAME') {
      var inptn = path.basename(s.Fname, '.xlsx');
      this.outpf = inptn + '.txt';
    } else {
      this.outpf = otp.Ofile;
    }
  }

  OutHeader(hd) {
    this.Print ('BEGIN_MAPPING_SPECS\r\n');
    this.Print ('  BEGIN_CONTROL_GROUP\r\n');
    this.Print ('    BEGIN_HEADER_RECORD\r\n');
    this.Printf('      NAME                %s\r\n', hd.mptit);
    this.Printf('      LAST_UPDATE         %s\r\n', hd.lstup);
    this.Printf('      AUTHOR              %s\r\n', hd.authr);
    this.Printf('      VERSION             %s\r\n', hd.bvers);
    this.Printf('      CUSTOMER            %s\r\n', hd.custm);
    this.Printf('      TARGET_FORMAT       %s\r\n', hd.tform);
    this.Printf('      SOURCE_FORMAT       %s\r\n', hd.sform);
    this.Printf('      INSTRUCTIONS        %s\r\n', hd.instr);
    this.Printf('      SAMPLE              %s\r\n', hd.sampl);
    this.Print ('    END_HEADER_RECORD\r\n');
    this.Print ('  END_CONTROL_GROUP\r\n');
    this.Print ('  BEGIN_SEGMENTS_GROUP\r\n');
  }

  OutGroup(gp, grupx) {
    this.Print ('      END_FIELDS\r\n');
    this.Print ('    END_SEGMENT\r\n');
    this.Printf('    BEGIN_TEXT            %s\r\n', grupx);
    this.Printf('      TEXT                %s\r\n', gp.gtext);
    this.Print ('    END_TEXT\r\n');
  }

  OutSegment(sg, cntrl, fseg) {
    if (!fseg) {
      this.Print('      END_FIELDS\r\n');
      this.Print('    END_SEGMENT\r\n');
    }
    this.Printf('    BEGIN_SEGMENT         %s\r\n', sg.segid);
    this.Printf('      NAME                %s\r\n', sg.sgmtp);
    this.Printf('      LOOPMAX             %s\r\n', sg.lpmax);
    this.Printf('      STATUS              %s\r\n', sg.stats);
    this.Printf('      USAGE               %s\r\n', sg.usage);
    this.Print ('      BEGIN_FIELDS\r\n');
  }

  OutField(fl, sfld) {
    if (sfld) {
      this.Print('\r\n');
    }
    this.Printf('        TARGET            %s\r\n', fl.targt);
    this.Printf('        TEXT              %s\r\n', fl.dtext);
    this.Printf('        SOURCE            %s\r\n', fl.sourc);
    this.Printf('        RULE_COND         %s\r\n', fl.rcond);
    this.Printf('        COMMENT           %s\r\n', fl.commt);
    this.Printf('        SAMPLE            %s\r\n', fl.sampl);
    this.Printf('        CHANGE            %s\r\n', fl.chang);
  }

  OutEof() {
    this.Print('      END_FIELDS\r\n');
    this.Print('    END_SEGMENT\r\n');
    this.Print('  END_SEGMENTS_GROUP\r\n');
    this.Print('END_MAPPING_SPECS\r\n');
    fs.writeFile(this.outdr+this.outpf, this.line, (err) => {
      if (err) throw err;
    });
  }

  Print(txt) {
    this.line += txt;
  }

  Printf(txt, val) {
    if (this.nodat) {
      if (val.length == 0 || val === 'null') {
        val = this.ndchr
      }
    }
    if (val.length > 0 && val != this.ndchr) {
      this.line += sprintf(txt, val);
    } else {
      if (!this.omite) {
        this.line += sprintf(txt, val);
      }
    }
  }
}
