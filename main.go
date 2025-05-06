package main

import (
	"embed"
	_ "embed"
	"io/fs"
	"log"
	"net/http"
	"os"
)

var (
	//go:embed frontend_local/dist
	web embed.FS
)

const defaultPort = "3030"

func main() {
	dist, _ := fs.Sub(web, "frontend_local/dist")

	http.Handle("/", http.FileServer(http.FS(dist)))

	port := os.Getenv("PORT")

	if port == "" {
		port = defaultPort
	}

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
