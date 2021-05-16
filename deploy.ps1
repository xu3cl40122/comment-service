# docker build -t xu3cl40122/comment-service -f .\Dockerfile.prod .
# docker push xu3cl40122/comment-service
ssh -i D:\Lee\sideProject\god\gc-service.pem ec2-user@ec2-52-11-194-84.us-west-2.compute.amazonaws.com sudo bash /home/ec2-user/projects/comment-service/updateDocker.sh

