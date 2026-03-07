pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                sh '''
                docker pull ghcr.io/mike-urssu/flowops:latest
                cd /home/jjoon/server/flowops
                docker compose up -d
                '''
            }
        }
    }
}
