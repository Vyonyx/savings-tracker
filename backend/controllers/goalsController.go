package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/vyonyx/savings-tracker/backend/initializers"
	"github.com/vyonyx/savings-tracker/backend/models"
)

type NewGoal struct {
	Name string
	GoalAmount int
	Deadline *time.Time
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

	user := getUser(ctx)

	entry := models.Goal{
		Name: newGoal.Name,
		GoalAmount: newGoal.GoalAmount,
		IsComplete: false,
		UserID: user.ID,
	}

	if newGoal.Deadline != nil {
		entry.Deadline = newGoal.Deadline
	}

	initializers.DB.Create(&entry)
}

func GetGoals(ctx *gin.Context) {
	user := getUser(ctx)
	var goals []models.Goal

	tx := initializers.DB.WithContext(ctx.Request.Context()).
		Preload("Transactions").
		Where("user_id = ?", user.ID).
		Find(&goals)

	if tx.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": tx.Error.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, goals)
}

func GetGoal(ctx *gin.Context) {
	user := getUser(ctx)
	goalID := ctx.Param("goalID")
	var goal models.Goal

	tx := initializers.DB.WithContext(ctx.Request.Context()).
		Preload("Transactions").
		Where("user_id = ?", user.ID).
		Where("id = ?", goalID).
		First(&goal)

	if tx.Error != nil || tx.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": tx.Error.Error(),
		})
	}

	ctx.JSON(http.StatusOK, goal)
}

func EditGoal(ctx *gin.Context) {
	user := getUser(ctx)
	var goal models.Goal

	err := ctx.ShouldBind(&goal)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Error editing goal: %s", err.Error()),
		})
		return
	}

	tx := initializers.DB.Where("user_id", user.ID).Save(goal)
	if tx.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": fmt.Sprintf("Could not update goal %d: %s", goal.ID, tx.Error.Error()),
		})
		return
	}

	ctx.Status(http.StatusOK)
}

func getUser(ctx *gin.Context) *models.User {
	userVal, _ := ctx.Get("user")
	user, _ := userVal.(*models.User)
	return user
}
