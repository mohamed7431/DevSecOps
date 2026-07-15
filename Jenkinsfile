pipeline {

    agent any

    tools {
        jdk 'JDK21'
        maven 'Maven-3.6.3'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        GIT_REPO   = 'https://github.com/mohamed7431/DevSecOps.git'
        GIT_BRANCH = 'main'
    }

    stages {

        stage('Checkout Source') {
            steps {
                echo '========== CHECKOUT SOURCE =========='

                git branch: "${GIT_BRANCH}",
                    credentialsId: 'github-token',
                    url: "${GIT_REPO}"

                sh 'git branch'
                sh 'git log --oneline -5'
            }
        }

        stage('Gitleaks Secret Scan') {
            steps {
                echo '========== GITLEAKS SECRET SCAN =========='

                sh '''
                    mkdir -p reports

                    gitleaks detect \
                      --source . \
                      --report-format sarif \
                      --report-path reports/gitleaks.sarif \
                      --exit-code 0
                '''
            }
        }

        stage('Semgrep SAST Scan') {
            steps {
                echo '========== SEMGREP SAST SCAN =========='

                sh '''
                    semgrep scan \
                        --config auto \
                        --json \
                        --output reports/semgrep.json || true
                '''
            }
        }
    }

    post {

        always {

            archiveArtifacts artifacts: 'reports/*', fingerprint: true

            echo 'Security reports archived.'

        }

        success {

            echo 'Phase 1 completed successfully.'

        }

        failure {

            echo 'Phase 1 failed.'

        }
    }
}
