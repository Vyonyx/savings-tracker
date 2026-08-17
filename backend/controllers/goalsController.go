package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/vyonyx/savings-tracker/backend/initializers"
	"github.com/vyonyx/savings-tracker/backend/models"
)

type NewGoal struct {
	Name string
	GoalAmount int
	Deadline time.Time
	IsComplete bool
	UserID string
}

func AddGoal(ctx *gin.Context) {
	var newGoal NewGoal
	err := ctx.ShouldBind(&newGoal)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	userVal, _ := ctx.Get("user")
	user, _ := userVal.(*models.User)

	initializers.DB.Create(&models.Goal{
		Name: newGoal.Name,
		GoalAmount: newGoal.GoalAmount,
		Deadline: newGoal.Deadline,
		IsComplete: false,
		UserID: user.ID,
	})
}

func GetGoals(ctx *gin.Context) {
	userVal, _ := ctx.Get("user")
	user, _ := userVal.(*models.User)
	var goals []models.Goal

	tx := initializers.DB.Where("user_id = ?", user.ID).Find(&goals)

	if tx.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": tx.Error.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, goals)
}
