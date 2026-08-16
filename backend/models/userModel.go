package models

import "time"

type User struct {
	ID            string    `gorm:"column:id;primaryKey" json:"id"`
	Name          string    `gorm:"column:name" json:"name"`
	Email         string    `gorm:"column:email" json:"email"`
	EmailVerified bool      `gorm:"column:emailVerified" json:"emailVerified"`
	Image         *string   `gorm:"column:image" json:"image,omitempty"`
	CreatedAt     time.Time `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt     time.Time `gorm:"column:updatedAt" json:"updatedAt"`
}

// TableName overrides GORM's default pluralization ("users") to match
// Better Auth's actual table name ("user").
func (User) TableName() string {
	return "user"
}
