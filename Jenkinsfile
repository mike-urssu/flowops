pipeline {
    agent any

    stages {
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
