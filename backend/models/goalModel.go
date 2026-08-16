package models

import (
	"time"
)

type Goal struct {
	ID uint `gorm:"foreignKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Name string `json:"name"`
	GoalAmount int `json:"goalAmount"`
	Deadline time.Time `json:"deadline"`
	IsComplete bool `json:"isComplete"`
	UserID string `gorm:"index" json:"userId"`
	Transactions []Transaction `gorm:"foreignKey:GoalID;references:ID" json:"transactions,omitempty"`
}
