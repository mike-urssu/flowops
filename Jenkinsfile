pipeline {
    agent {
        label 'macbook'
    }

    options {
        skipDefaultCheckout(true)
    }

    environment {
        REGISTRY = "ghcr.io"
        IMAGE = "mike-urssu/flowops"
        TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login GHCR') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'ghcr',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'TOKEN'
                )]) {
                    sh '''
                    echo $TOKEN | docker login ghcr.io -u $USERNAME --password-stdin
                    '''
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                sh '''
                docker buildx build \
                --platform linux/amd64,linux/arm64 \
                -t $REGISTRY/$IMAGE:$TAG \
                --push \
                .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sshagent(credentials: ['deploy-ssh']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no deploy-host "
                    cd ~/server/flowops &&
                    docker compose pull flowops &&
                    docker compose up -d --remove-orphans
                    "
                    '''
                }
            }
        }
    }
}
