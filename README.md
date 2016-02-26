## Publish

Publish allow user update a resource but do not show the change in website until it is get "published" for [GORM-backend](https://github.com/jinzhu/gorm) models

[![GoDoc](https://godoc.org/github.com/qor/publish?status.svg)](https://godoc.org/github.com/qor/publish)

## Usage

Embed `publish.Status` as anonymous field in your model to get the publish feature

```go
type Product struct {
  Name        string
  Description string
  publish.Status
}
```

```go
db, err = gorm.Open("sqlite3", "demo_db")
publish := publish.New(db)

// Run migration to add `publish_status` column from `publish.Status`
db.AutoMigrate(&Product{})
// Create `products_draft` table
publish.AutoMigrate(&Product{})

draftDB := publish.DraftDB() // Draft resources are saved here
productionDB := publish.ProductionDB() // Published resources saved here
```

With the draft db, all changes you made will be saved in `products_draft`, with the `productionDB`, all you changes will be in `products` table, and sync back to `products_draft`

```go
// Publish changes you made in `products_draft` to `products`
publish.Publish(&product)

// Overwrite this product's data in `products_draft` with its data in `products`
publish.Discard(&product)
```

## Publish Event

In some cases, you might want to update many records, but don't want to show all of them as draft, for example, when sorting products, I have changed 100 products's position, but don't want to show 100 products as draft, but only want to show one event `Changed product's sorting` in the draft page, after publish this event, then publish all position changes to production, `PublishEvent` is built for that

```go
// Register Publish Event
publish.RegisterEvent("changed_product_sorting", changedSortingPublishEvent{})

// Publish Event definition
type changedSortingPublishEvent struct {
	Table       string
	PrimaryKeys []string
}

func (e changedSortingPublishEvent) Publish(db *gorm.DB, event publish.PublishEventInterface) (err error) {
	if event, ok := event.(*publish.PublishEvent); ok {
		if err = json.Unmarshal([]byte(event.Argument), &e); err == nil {
      // e.PrimaryKeys => get primary keys
      // sync your changes made for above primary keys to production
		}
	}
}

func (e changedSortingPublishEvent) Discard(db *gorm.DB, event publish.PublishEventInterface) (err error) {
  // discard your changes made in draft
}

func init() {
  // change an `changed_product_sorting` event, including primary key 1, 2, 3
  db.Create(&publish.PublishEvent{
    Name: "changed_product_sorting",
    Argument: "[1,2,3]",
  })
}
```

## Qor Support

[QOR](http://getqor.com) is architected from the ground up to accelerate development and deployment of Content Management Systems, E-commerce Systems, and Business Applications, and comprised of modules that abstract common features for such system.

Although Publish could be used alone, it works nicely with QOR, if you have requirements to manage your application's data, be sure to check QOR out!

[Publish Demo: http://demo.getqor.com/admin/publish](http://demo.getqor.com/admin/publish)

If you want to all changes you made in draft table by default, initialize QOR admin with publish's draft DB, if you want to manage those drafts data, add it as resource

```go
Admin := admin.New(&qor.Config{DB: Publish.DraftDB()})
Admin.AddResource(Publish)
```

## License

Released under the [MIT License](http://opensource.org/licenses/MIT).
