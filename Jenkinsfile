pipeline {
    agent {
        label 'macbook'
    }

    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mike-urssu/flowops.git'
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t flowops .'
            }
        }

        stage('Deploy') {
            steps {
                sshagent(credentials: ['deploy-ssh']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no home "
                    cd ~/server/flowops &&
                    docker compose pull &&
                    docker compose up -d --remove-orphans
                    "
                    '''
                }
            }
        }
    }
}
