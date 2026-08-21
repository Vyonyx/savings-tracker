package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vyonyx/savings-tracker/backend/initializers"
	"github.com/vyonyx/savings-tracker/backend/models"
)

type NewTransaction struct {
	Amount int
	Type string
	GoalID uint

}

func AddTransaction(ctx *gin.Context)  {
	var newTransaction NewTransaction
	err := ctx.ShouldBind(&newTransaction)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("New transaction data is invalid: %s", err.Error()),
		})
		return
	}

	user := getUser(ctx)

	tx := initializers.DB.Create(&models.Transaction{
		Amount: newTransaction.Amount,
		Type: newTransaction.Type,
		GoalID: newTransaction.GoalID,
		UserID: user.ID,
	})

	if tx.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Failed to create new transaction in database: %s", tx.Error.Error()),
		})
		return
	}

	ctx.Status(http.StatusOK)
}
