pipeline {
    agent any

    tools {
        jdk 'JDK21'
        maven 'Maven-3.6.3'
    }

    environment {
        SCANNER_HOME = tool 'SonarScanner'
    }

    options {
        timestamps()
    }

    stages {

        stage('Checkout Source') {
            steps {
                echo "========== CHECKOUT =========="

                git branch: 'main',
                    url: 'https://github.com/mohamed7431/DevSecOps.git'

                sh 'git log --oneline -5'
            }
        }

        stage('Gitleaks Secret Scan') {
            steps {
                echo "========== GITLEAKS =========="

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
                echo "========== SEMGREP =========="

                sh '''
                mkdir -p reports

                export PATH=$PATH:/home/ubuntu/.local/bin

                semgrep scan \
                    --config auto \
                    --json \
                    --output reports/semgrep.json . || true
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {

                echo "========== SONARQUBE =========="

                withSonarQubeEnv('SonarQube') {

                    sh '''
                    $SCANNER_HOME/bin/sonar-scanner \
                      -Dsonar.projectKey=Employee-App \
                      -Dsonar.projectName=Employee-App \
                      -Dsonar.sources=src \
                      -Dsonar.java.binaries=target/classes
                    '''
                }
            }
        }

        stage('Maven Build') {
            steps {

                echo "========== MAVEN BUILD =========="

                sh '''
                mvn clean package -DskipTests
                '''
            }

            post {
                success {
                    archiveArtifacts artifacts: 'target/*.jar'
                }
            }
        }

        stage('OWASP Dependency Check') {

            steps {

                echo "========== DEPENDENCY CHECK =========="

                sh '''
                mkdir -p reports

                /opt/dependency-check/bin/dependency-check.sh \
                    --project employee-app \
                    --scan target \
                    --format HTML \
                    --format JSON \
                    --out reports \
                    --noupdate
                '''
            }

            post {

                always {

                    archiveArtifacts artifacts: 'reports/*', fingerprint: true
                }
            }
        }
    }

    post {

        always {

            echo "========== ARCHIVING REPORTS =========="

            archiveArtifacts artifacts: 'reports/**', fingerprint: true
        }

        success {

            echo "========== PHASE 2 COMPLETED =========="
        }

        failure {

            echo "========== PHASE 2 FAILED =========="
        }
    }
}
