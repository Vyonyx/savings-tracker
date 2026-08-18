package main

import (
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/vyonyx/savings-tracker/backend/controllers"
	"github.com/vyonyx/savings-tracker/backend/initializers"
	"github.com/vyonyx/savings-tracker/backend/middleware"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDb()
	initializers.SyncDatabase()
}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	auth := router.Group("/", middleware.AuthMiddleware(initializers.DB))

	auth.GET("/me", func(ctx *gin.Context) {
		user, exists := ctx.Get("user")
		if exists {
			ctx.JSON(http.StatusOK, gin.H{
				"user": user,
			})
			return
		}

		ctx.Status(http.StatusNotFound)
	})

	auth.POST("/goals", controllers.AddGoal)
	auth.GET("/goals", controllers.GetGoals)
	auth.GET("/goals/:goalID", controllers.GetGoal)

	router.Run(os.Getenv("PORT"))
}
