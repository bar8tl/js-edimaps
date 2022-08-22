// codes.go [2018-03-01 BAR8TL]
// Functions to retrieve SAP codes used into SD IDOCs
// This program i sunder construction, using refe.go program as base, it
// need to be continued for completion
package rb

import "bufio"
import "code.google.com/p/go-sqlite/go1/sqlite3"
import "errors"
import "fmt"
import "github.com/atotto/clipboard"
import "os"
import "strings"

const dbpth = "c:\\c_portab\\01_rb\\programdata\\go-refe\\refe.db"

var admai, odmai string

func Console() {
	admai = "rb"
	s := bufio.NewScanner(os.Stdin)
	fmt.Printf("refe version 1.0.0.0 2013-07-29 16:39:00\n")
	fmt.Printf("%s>", admai)
	for s.Scan() {
		line := strings.Trim(strings.ToLower(s.Text()), " ")
		if line == "" {
			fmt.Printf("%s>", admai)
			continue
		}
		if line == "exit" || line == "quit" {
			break
		}
		tokn := strings.Split(line, " ")

		if tokn[0] == "domain" {
			if len(tokn) >= 2 {
				admai = tokn[1]
				fmt.Printf("%s>", admai)
				continue
			} else {
				admai = odmai
				fmt.Printf("%s>", admai)
				continue
			}
		}

		if tokn[0] == "sys" {
			if len(tokn) >= 2 {
				err := Cpykey(admai, tokn[1], "pwd")
				fmt.Printf("%s>", admai)
				if err == nil {
					fmt.Printf("...password has been copied to the clipboard\n")
				} else {
					fmt.Printf("...system not found, clipboard cleaned\n")
				}
				fmt.Printf("%s>", admai)
				continue
			} else {
				fmt.Printf("%s.sys>", admai)
				inbrk := false
				for s.Scan() {
					slin := strings.Trim(strings.ToLower(s.Text()), " ")
					if slin == "." {
						break
					}
					if slin == ".exit" || slin == ".quit" {
						inbrk = true
						break
					}
					err := Cpykey(admai, slin, "pwd")
					if err == nil {
						fmt.Printf("...password has been copied to the clipboard\n")
					} else {
						fmt.Printf("...system not found, clipboard cleaned\n")
					}
					fmt.Printf("%s.sys>", admai)
				}
				if inbrk {
					break
				}
				fmt.Printf("%s>", admai)
				continue
			}
			fmt.Printf("%s>", admai)
		}
		fmt.Printf("%s> invalid command\n", admai)
	}
}

func Cpykey(domai, systm, crdtp string) error {
	if domai == "rb" {
		domai = ""
	}
	db, err := sqlite3.Open("file:"+dbpth+"?file:locked.sqlite?cache=shared&mode=rwc")
	if err != nil {
	  return errors.New("file not found")
	}
	var usrid, pswrd, numky string
	rdb, err := db.Query(`select userid, password, numkey from refe where domain=? and valid<>"n" and system=?;`, domai, systm)
	if err != nil {
		clipboard.WriteAll("")
		return errors.New("system not found")
	} else {
		rdb.Scan(&usrid, &pswrd, &numky)
		if crdtp == "usr" {
			clipboard.WriteAll(usrid)
		} else if crdtp == "key" {
			clipboard.WriteAll(numky)
		} else {
			clipboard.WriteAll(pswrd)
		}
		rdb.Close()
		return nil
	}
}
