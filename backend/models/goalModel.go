package models

import (
	"time"
)

type Goal struct {
	ID uint `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Name string `json:"name"`
	GoalAmount int `json:"goalAmount"`
	Deadline *time.Time `json:"deadline,omitempty"`
	IsComplete bool `json:"isComplete"`
	UserID string `gorm:"index" json:"userId"`
	BankAccountID uint `gorm:"index" json:"bankAccountID"`
	Transactions []Transaction `gorm:"foreignKey:GoalID;references:ID" json:"transactions,omitempty"`
}
