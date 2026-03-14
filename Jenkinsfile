pipeline {
    agent {
        docker {
            image 'docker:26-cli'
            label 'macbook'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    options {
        skipDefaultCheckout(true)
    }

    environment {
        REGISTRY = "ghcr.io"
        IMAGE = "mike-urssu/flowops"
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
                docker buildx create --use || true
                docker buildx inspect --bootstrap

                docker buildx build \
                --platform linux/amd64,linux/arm64 \
                -t $REGISTRY/$IMAGE:latest \
                --push
                .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sshagent(credentials: ['deploy-ssh']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no home "
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
