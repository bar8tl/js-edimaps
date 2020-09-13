Modules Structure


                         package.json
                              |
                          edimaps.js
                              |
     +--------------+---------+-+-----------+----------+
     |              |           |           |          |
constants.js   settings.js   crtdb.js   ldindx.js   dumpmap.js
                    |                                  |
             +------------+                            |
             |            |                            |
         config.json  defaults.json                 outctrl.js
                                                       |
                                           +-----------+------------+
                                           |           |            |
                                        outtxt.js   outsql.js   outjson.js


