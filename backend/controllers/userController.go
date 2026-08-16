package controllers

import (
	"context"
	"errors"
	"time"

	"github.com/vyonyx/savings-tracker/backend/models"
	"gorm.io/gorm"
)

var (
	ErrInvalidSession = errors.New("invalid session")
	ErrSessionExpired = errors.New("session expired")
)

func ValidateSession(ctx context.Context, db *gorm.DB, token string) (*models.User, error) {
	var session models.Session

	err := db.WithContext(ctx).
		Where("token = ?", token).
		First(&session).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, ErrInvalidSession
	}
	if err != nil {
		return nil, err
	}

	if time.Now().After(session.ExpiresAt) {
		return nil, ErrSessionExpired
	}

	var user models.User
	if err := db.WithContext(ctx).First(&user, "id = ?", session.UserID).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
