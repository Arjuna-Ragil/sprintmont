package database

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"time"

	"github.com/Arjuna-Ragil/sprintmont/internal"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Bucket struct {
	Client *minio.Client
}

func InitBucket(cfg *internal.Config) (*Bucket, error){
	endpoint := cfg.Bkt_Endpoint
	accessKeyID := cfg.Bkt_Access
	secretAccessKey := cfg.Bkt_Password
	useSSL := false

	client, err := minio.New(endpoint, &minio.Options{
		Creds: credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalf("Bucket Failed to initiate: %v", err)
	}

	return &Bucket{Client: client}, nil
}

func (repo *Bucket) UploadFile(file *multipart.FileHeader, bucketName string) (string, error) {
	ctx := context.Background()
	publicDomain := os.Getenv("BUCKET_PUBLIC_DOMAIN")
	if publicDomain == "" {
		publicDomain = "http://localhost:8335"
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer func(src multipart.File) {
		err := src.Close()
		if err != nil {

		}
	}(src)

	exists, err := repo.Client.BucketExists(ctx, bucketName)
	if err != nil {
		return "", err
	}
	if !exists {
		err := repo.Client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			return "", fmt.Errorf("failed to create bucket %s: %v", bucketName, err)
		}
		log.Println("Successfully created bucket:", bucketName)
	}

	objectName := fmt.Sprintf("file_%d_%s", time.Now().Unix(), file.Filename)
	contentType := file.Header.Get("Content-Type")

	info, err := repo.Client.PutObject(ctx, bucketName, objectName, src, file.Size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", err
	}
	log.Println("Successfully uploaded file:", info)
	fileURL := fmt.Sprintf("%s/%s/%s", publicDomain, bucketName, objectName)
	return fileURL, nil
}