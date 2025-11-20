pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'                    // <- change if needed
    AWS_ACCOUNT_ID = '309642614519'    // <- replace with your account id
    ECR_REPO = 'myapp'                          // ECR repo name you'll create in AWS
    IMAGE_TAG = "${env.BUILD_NUMBER}"           // unique tag per build (build number)
    ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
    CLUSTER_NAME = 'myapp-cluster'              // ECS cluster name you'll create
    SERVICE_NAME = 'myapp-service'              // ECS service name you'll create
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Test') {
      steps {
        sh 'echo "Installing dependencies..."'
        sh 'cd app && npm install'
        // For a simple smoke test, we don't run the test while container isn't running.
        // Add proper unit tests here and run them.
      }
    }

    stage('Build Docker image') {
      steps {
        sh "docker build -t ${ECR_REPO}:${IMAGE_TAG} ."
      }
    }

    stage('Login to ECR') {
      steps {
        
          sh '''
            aws ecr get-login-password --region ${AWS_REGION} | \
              docker login --username AWS --password-stdin ${ECR_URI}
          '''
        
      }
    }

    stage('Tag & Push to ECR') {
      steps {
        sh """
          docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}
          docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_URI}:latest
          docker push ${ECR_URI}:${IMAGE_TAG}
          docker push ${ECR_URI}:latest
        """
      }
    }

    stage('Deploy to ECS (force new deployment)') {
      steps {
        
          sh """
            # Force ECS to pick up the new image by creating a new task definition revision
            # For simplicity we do a 'force-new-deployment' to tell the service to reload latest taskdef
            aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --force-new-deployment --region ${AWS_REGION}
          """
        
      }
    }
  }

  post {
    success {
      echo "Pipeline completed successfully: ${env.BUILD_URL}"
    }
    failure {
      echo "Pipeline failed: ${env.BUILD_URL}"
    }
  }
}
