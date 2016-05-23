package publish

import "github.com/qor/worker"

type QorWorkerArgument struct {
	IDs []string
}

func (publish *Publish) SetWorker(w *worker.Worker) {
	publish.WorkerScheduler = w
}
