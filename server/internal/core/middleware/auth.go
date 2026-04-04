package middleware

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/Arjuna-Ragil/sprintmont/internal/config"
	"github.com/Arjuna-Ragil/sprintmont/internal/core/models"
	"github.com/coreos/go-oidc"
	"github.com/gin-gonic/gin"
)

type AuthDB struct{
	DB *config.DB
	Verifier *oidc.IDTokenVerifier
}

func NewAuthDB(db *config.DB) *AuthDB{
	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, "https://sso.arjunaa.my.id/application/o/sprint-mont/"); if err != nil{
		log.Fatalf("Failed to connect to authentik: %v", err)
	}
	verifier := provider.Verifier(&oidc.Config{SkipClientIDCheck: true})

	return &AuthDB{
		DB: db,
		Verifier: verifier,
	}
}

func (db *AuthDB) AuthMiddleware() gin.HandlerFunc{
	return func(c *gin.Context) {
		authHeader := c.GetHeader("authorization")
		var tokenString string
		if authHeader != "" {
			tokenString = strings.Replace(authHeader, "Bearer ", "", 1)
		} else {
			tokenString = c.Query("token")
		}

		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"error": "No Authentication token",
			})
			return
		}

		idToken, err := db.Verifier.Verify(c.Request.Context(), tokenString); if err != nil{
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"error": "Token is invalid",
			})
			return
		}
		var claims struct{
			Subject string `json:"sub"`
			Email string `json:"email"`
			Username string `json:"username"`
		}
		if err := idToken.Claims(&claims); err != nil{
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Failed to read token",
			})
			return
		}
		var user models.User
		if err := db.DB.Gorm.Where(models.User{ID: claims.Subject}).Attrs(models.User{
			Email: claims.Email,
			Username: claims.Username,
		}).FirstOrCreate(&user).Error; err != nil{
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to find / create user",
			})
			return
		}
		c.Set("userID", user.ID)
		c.Next()
	}
}