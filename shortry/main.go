package main

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/boltdb/bolt"
	"github.com/twharmon/gouid"
)

func generateID() string {
	currentTime := int(time.Now().UnixNano())
	random := gouid.String(8, gouid.MixedCaseAlphaNum)
	return strconv.Itoa(currentTime) + random
}

func SetLink(w http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodPost {
		db, err := bolt.Open("./db/links.db", 0600, nil)
		if err != nil {
			log.Fatal(err)
		}

		ID := generateID()
		link := req.FormValue("link")

		db.Update(func(tx *bolt.Tx) error {
			bucket, err := tx.CreateBucket([]byte("links"))
			if err != nil {
				return fmt.Errorf("create bucket-links: %s", err)
			}
			err = bucket.Put([]byte(ID), []byte(link))
			return err
		})

		fmt.Fprintf(w, "Your URL is localhost:8000/%s \n", ID)
	} else {
		fmt.Fprintln(w, "No get allowed")
	}
}

func GetLink(w http.ResponseWriter, req *http.Request) {
	ID := req.URL.Path[len("/"):]
	db, err := bolt.Open("./db/links.db", 0600, nil)

	if err != nil {
		log.Fatal(err)
	}

	db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte("links"))
		v := b.Get([]byte(ID))
		u := &url.URL{
			Scheme: "https",
			Host:   string(v),
		}
		fmt.Printf("The link is %s \n", u.String())
		http.Redirect(w, req, u.String(), http.StatusFound)
		return nil
	})

}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/set", SetLink)
	mux.HandleFunc("/", GetLink)

	log.Fatal(http.ListenAndServe("localhost:8000", mux))
}
