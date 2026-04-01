package config

import (
	"log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Bucket struct {
	Client *minio.Client
}

func InitBucket(cfg *Config) (*Bucket, error) {
	endpoint := cfg.Bkt_Endpoint
	accessKeyID := cfg.Bkt_Access
	secretAccessKey := cfg.Bkt_Password
	useSSL := false

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalf("Bucket Failed to initiate: %v", err)
	}

	return &Bucket{Client: client}, nil
}