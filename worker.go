package publish

import "github.com/qor/worker"

func (publish *Publish) SetWorker(w *worker.Worker) error {
	publish.WorkerScheduler = w
	return nil
}
