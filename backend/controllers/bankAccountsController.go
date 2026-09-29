package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vyonyx/savings-tracker/backend/initializers"
	"github.com/vyonyx/savings-tracker/backend/models"
)

type NewBankAccount struct {
	Name string
}

func GetBankAccounts(ctx * gin.Context)  {
	user := getUser(ctx)
	var bankAccounts []models.BankAccount
	tx := initializers.DB.WithContext(ctx.Request.Context()).
		Model(&models.BankAccount{}).
		Preload("Transactions").
		Where("user_id = ?", user.ID).
		Find(&bankAccounts)

	if tx.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("could not find bank accounts: %s", tx.Error.Error()),
		})
		return
	}

	ctx.JSON(http.StatusOK, bankAccounts)
}

func GetBankAccount(ctx *gin.Context) {
	user := getUser(ctx)
	id, ok := ctx.Params.Get("bankAccountID")

	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not find bank account ID in URL params",
		})
		return
	}

	var bankAccount models.BankAccount
	tx := initializers.DB.WithContext(ctx.Request.Context()).
		Preload("Transactions").
		Where("user_id = ?", user.ID).
		Where("id = ?", id).
		First(&bankAccount)

	if tx.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": fmt.Sprintf("Could not find bank account id %s: %s", id, tx.Error.Error()),
		})
		return
	}

	ctx.JSON(http.StatusOK, bankAccount)
}

func AddBankAccount(ctx *gin.Context) {
	var body NewBankAccount
	err := ctx.ShouldBind(&body)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Invalid new bank account details: %s", err.Error()),
		})
		return
	}

	user := getUser(ctx)

	entry := models.BankAccount{
		Name: body.Name,
		UserID: user.ID,
	}

	tx := initializers.DB.Create(&entry)

	if tx.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Could not create new bank account: %s", tx.Error.Error()),
		})
		return
	}

	ctx.Status(http.StatusCreated)
}

func EditBankAccount(ctx *gin.Context) {
	var updatedBankAccount models.BankAccount
	err := ctx.ShouldBind(&updatedBankAccount)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Could not decode bank account from request body: %s", err.Error()),
		})
		return
	}

	tx := initializers.DB.Save(updatedBankAccount)

	if tx.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Could not save edited bank account: %s", tx.Error.Error()),
		})
		return
	}

	ctx.Status(http.StatusOK)
}

func DeleteBankAccount(ctx *gin.Context) {
	var bankAccount models.BankAccount
	err := ctx.ShouldBind(&bankAccount)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Could not extract bank account from request body: %s", err.Error()),
		})
	}

	user := getUser(ctx)

	tx := initializers.DB.Delete(&bankAccount).Where("user_id = ?", user.ID)

	if tx != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Could not delete bank account: %s", tx.Error.Error()),
		})
		return
	}

	ctx.Status(http.StatusOK)
}
