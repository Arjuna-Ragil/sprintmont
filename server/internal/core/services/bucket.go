package services

import (
	"mime/multipart"

	"github.com/Arjuna-Ragil/sprintmont/internal/database"
)

type BucketService struct {
	BucketRepo *database.BucketRepo
}

func NewBucketService(bucketRepo *database.BucketRepo) *BucketService {
	return &BucketService{BucketRepo: bucketRepo}
}

func (s *BucketService) UploadImage(file *multipart.FileHeader, bucketName string) (string, error) {
	// In a full implementation, you might validate file size and content type here.
	return s.BucketRepo.UploadFile(file, bucketName)
}
