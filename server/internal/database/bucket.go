package database

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"time"
	"github.com/minio/minio-go/v7"
)

type Bucket struct {
	Client *minio.Client
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