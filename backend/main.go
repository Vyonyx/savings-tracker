package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/vyonyx/savings-tracker/backend/initializers"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDb()
}

func main() {
	router := gin.Default()

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.Run(os.Getenv("PORT"))
}
