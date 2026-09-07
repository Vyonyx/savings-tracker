package initializers

import "github.com/vyonyx/savings-tracker/backend/models"

func SyncDatabase()  {
	DB.AutoMigrate(&models.BankAccount{}, &models.Goal{}, &models.Transaction{} )
}
