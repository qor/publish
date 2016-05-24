package publish

import (
	"fmt"

	"github.com/qor/worker"
)

type workerJobLogger struct {
	job worker.QorJobInterface
}

func (job workerJobLogger) Print(results ...interface{}) {
	job.job.AddLog(fmt.Sprint(results...))
}

type QorWorkerArgument struct {
	IDs []string
	worker.Schedule
}

func (publish *Publish) SetWorker(w *worker.Worker) {
	publish.WorkerScheduler = w
}
