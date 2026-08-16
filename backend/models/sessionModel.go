package models

import "time"

type Session struct {
	ID        string    `gorm:"column:id;primaryKey" json:"id"`
	UserID    string    `gorm:"column:userId" json:"userId"`
	Token     string    `gorm:"column:token" json:"token"`
	ExpiresAt time.Time `gorm:"column:expiresAt" json:"expiresAt"`
	IPAddress *string   `gorm:"column:ipAddress" json:"ipAddress,omitempty"`
	UserAgent *string   `gorm:"column:userAgent" json:"userAgent,omitempty"`
	CreatedAt time.Time `gorm:"column:createdAt" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt" json:"updatedAt"`
}

func (Session) TableName() string {
	return "session"
}
