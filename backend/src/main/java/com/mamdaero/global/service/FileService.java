package com.mamdaero.global.service;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FileService {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucket;

    @Value("${cloud.aws.s3.path.profile}")
    private String PROFILE_IMG_DIR;

    @Value("${cloud.aws.s3.path.board}")
    private String BOARD_IMG_DIR;

    public String saveProfile(MultipartFile multipartFile, Long memberId) throws IOException {
        if(multipartFile.isEmpty()) {
            return null;
        }
        return upload(multipartFile, PROFILE_IMG_DIR, memberId);
    }

    public String saveBoard(MultipartFile multipartFile, Long memberId) throws IOException {
        if(multipartFile.isEmpty()) {
            return null;
        }
        return upload(multipartFile, BOARD_IMG_DIR, memberId);
    }

    private String upload(MultipartFile multipartFile, String dirName, Long memberId) throws IOException {
        String fileName = dirName + memberId + "/" + UUID.randomUUID()  + "_" + multipartFile.getOriginalFilename();
        try (InputStream inputStream = multipartFile.getInputStream()) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(multipartFile.getSize());
            amazonS3.putObject(new PutObjectRequest(bucket, fileName, inputStream, metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        }

        System.out.println(amazonS3.getUrl(bucket, fileName).toString());

        return amazonS3.getUrl(bucket, fileName).toString();
    }

    public void delete(String fileName) throws IOException {
        try {
            System.out.println("삭제할 파일 이름" + fileName);
            String splitStr = ".com/";
            String file = fileName.substring(fileName.lastIndexOf(splitStr) + splitStr.length());
            System.out.println("삭제할 파일 이름2" + file);
            amazonS3.deleteObject(bucket, file);
        } catch (SdkClientException e) {
            throw new IOException("Error delete file from S3", e);
        }
    }
}
