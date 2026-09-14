package models

import (
	"time"
)

type Transaction struct {
	ID uint `gorm:"primaryKey" json:"id"`
	Amount int `json:"amount"`
	Type string `json:"type"`
	UserID string `gorm:"index" json:"userId"`
	GoalID uint `gorm:"index" json:"goalId"`
	BankAccountID uint `gorm:"index" json:"bankAccountId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
