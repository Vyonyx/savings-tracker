package models

import (
	"time"
)

type Transaction struct {
	ID uint `gorm:"foreignKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Amount int `json:"amount"`
	Type string `json:"type"`
	UserID string `gorm:"index" json:"userId"`
	GoalID uint `gorm:"index" json:"goalId"`
}
