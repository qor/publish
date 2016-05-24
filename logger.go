package publish

import (
	"log"
	"os"
)

type logger interface {
	Print(...interface{})
}

var Logger logger

func init() {
	Logger = log.New(os.Stdout, "\r\n", 0)
}
