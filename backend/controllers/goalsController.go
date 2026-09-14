package controllers

import (
	"fmt"
	"net/http"
	"strconv"
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

type GoalAndBankAccountName struct {
	models.Goal
	BankAccountName string `json:"bankAccountName"`
}

func GetGoal(ctx *gin.Context) {
	user := getUser(ctx)
	goalID := ctx.Param("goalID")
	var result GoalAndBankAccountName

	tx := initializers.DB.WithContext(ctx.Request.Context()).
		Model(&models.Goal{}).
		Select("goals.*, bank_accounts.name AS bank_account_name").
		Joins("JOIN bank_accounts ON bank_accounts.id = goals.bank_account_id").
		Preload("Transactions").
		Where("goals.user_id = ?", user.ID).
		Where("goals.id = ?", goalID).
		First(&result)

	if tx.Error != nil || tx.RowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": tx.Error.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, result)
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

func DeleteGoal(ctx *gin.Context)  {
	goalID, ok := ctx.Params.Get("goalID")

	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not find goal id in params",
		})
		return
	}
	user := getUser(ctx)
	id, err := strconv.ParseUint(goalID, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "goal id is not a number",
		})
		return
	}

	tx := initializers.DB.
		Where("user_id = ?", user.ID).
		Select("Transactions").
		Delete(&models.Goal{ID: uint(id)})

	if tx.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Could not delete goal id %s: %s", goalID, tx.Error.Error()),
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
