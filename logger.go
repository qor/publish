package publish

import (
	"log"
	"os"
)

type LoggerInterface interface {
	Print(...interface{})
}

var Logger LoggerInterface

func init() {
	Logger = log.New(os.Stdout, "\r\n", 0)
}
