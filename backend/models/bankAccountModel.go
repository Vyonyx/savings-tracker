package models

import "time"

type BankAccount struct {
	ID uint `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Name string `json:"name"`
	UserID string `gorm:"index" json:"userId"`
	Goals []Goal `gorm:"foreignKey:BankAccountID;references:ID" json:"goals,omitempty"`
	Transactions []Transaction `gorm:"foreignKey:BankAccountID;references:ID" json:"transactions,omitempty"`
}
