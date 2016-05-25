package publish

import (
	"fmt"
	"log"
	"os"
	"strings"
)

type LoggerInterface interface {
	Print(...interface{})
}

var Logger LoggerInterface

func init() {
	Logger = log.New(os.Stdout, "\r\n", 0)
}

func stringifyPrimaryValues(primaryValues [][][]interface{}, columns ...string) string {
	var values []string
	for _, primaryValue := range primaryValues {
		var primaryKeys []string
		for _, value := range primaryValue {
			if len(columns) == 0 {
				primaryKeys = append(primaryKeys, fmt.Sprint(value[1]))
			} else {
				for _, column := range columns {
					if column == fmt.Sprint(value[0]) {
						primaryKeys = append(primaryKeys, fmt.Sprint(value[1]))
					}
				}
			}
		}
		if len(primaryKeys) > 1 {
			values = append(values, fmt.Sprintf("[%v]", strings.Join(primaryKeys, ", ")))
		} else {
			values = append(values, primaryKeys...)
		}
	}
	return strings.Join(values, "; ")
}
