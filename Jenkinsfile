pipeline {
    agent {
        label 'macbook'
    }

    environment {
        REGISTRY = "ghcr.io"
        IMAGE = "mike-urssu/flowops"
        CACHE_DIR = "/home/jenkins/cache"
    }

    stages {
        stage('Check Commit') {
            steps {
                script {

                    def latest = sh(
                        script: "git ls-remote https://github.com/mike-urssu/flowops.git HEAD | awk '{print \$1}'",
                        returnStdout: true
                    ).trim()

                    def last = sh(
                        script: "cat $CACHE_DIR/last_commit 2>/dev/null || echo ''",
                        returnStdout: true
                    ).trim()

                    if (latest == last) {
                        env.SKIP_BUILD = "true"
                        echo "No code changes → skip pipeline"
                    } else {
                        env.SKIP_BUILD = "false"
                        sh "mkdir -p $CACHE_DIR && echo ${latest} > $CACHE_DIR/last_commit"
                    }
                }
            }
        }

        stage('Checkout') {
            when { expression { env.SKIP_BUILD != "true" } }
            steps {
                checkout scm
            }
        }

        stage('Check Dependency Change') {
            when { expression { env.SKIP_BUILD != "true" } }
            steps {
                script {

                    def depsHash = sh(
                        script: "sha256sum package-lock.json | awk '{print \$1}'",
                        returnStdout: true
                    ).trim()

                    def oldDeps = sh(
                        script: "cat $CACHE_DIR/deps.hash 2>/dev/null || echo ''",
                        returnStdout: true
                    ).trim()

                    if (depsHash == oldDeps) {
                        env.SKIP_NPM = "true"
                        echo "Dependency unchanged → npm install skip"
                    } else {
                        env.SKIP_NPM = "false"
                        sh "echo ${depsHash} > $CACHE_DIR/deps.hash"
                    }
                }
            }
        }

        stage('Restore node_modules cache') {
            when { expression { env.SKIP_NPM != "true" } }
            steps {
                sh '''
                if [ -d $CACHE_DIR/node_modules ]; then
                    rsync -a $CACHE_DIR/node_modules .
                fi
                '''
            }
        }

        stage('Install dependencies') {
            when { expression { env.SKIP_NPM != "true" } }
            steps {
                sh 'npm ci --cache ~/.npm'
            }
        }

        stage('Save node_modules cache') {
            when { expression { env.SKIP_NPM != "true" } }
            steps {
                sh '''
                mkdir -p $CACHE_DIR
                rsync -a node_modules $CACHE_DIR/
                '''
            }
        }

        stage('Build React') {
            when { expression { env.SKIP_BUILD != "true" } }
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            when { expression { env.SKIP_BUILD != "true" } }
            steps {
                sh '''
                docker buildx build \
                --platform linux/amd64 \
                --tag $REGISTRY/$IMAGE:latest \
                --cache-from=type=registry,ref=$REGISTRY/$IMAGE:buildcache \
                --cache-to=type=registry,ref=$REGISTRY/$IMAGE:buildcache,mode=max \
                --push \
                .
                '''
            }
        }

        stage('Deploy') {
            when { expression { env.SKIP_BUILD != "true" } }
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
