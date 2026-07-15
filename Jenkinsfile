pipeline {
    agent any

    tools {
        jdk 'JDK'
        maven 'Maven'
    }

    environment {
        SCANNER_HOME = tool 'SonarScanner'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/mohamed7431/DevSecOps.git',
                credentialsId: 'github-token'
            }
        }

        stage('Gitleaks Scan') {
            steps {
                sh '''
                mkdir -p reports

                gitleaks detect \
                  --source . \
                  --report-format sarif \
                  --report-path reports/gitleaks.sarif || true
                '''
            }
        }

        stage('Semgrep Scan') {
            steps {
                sh '''
                semgrep \
                  --config auto \
                  . \
                  --json \
                  --output reports/semgrep.json || true
                '''
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan .',
                                odcInstallation: 'DependencyCheck'
            }
        }

        stage('Publish Dependency Report') {
            steps {
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {

                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                      -Dsonar.projectKey=employee-app \
                      -Dsonar.projectName=employee-app \
                      -Dsonar.sources=src \
                      -Dsonar.java.binaries=target/classes
                    """
                }
            }
        }

        stage('Maven Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

    }

    post {

        always {

            archiveArtifacts artifacts: 'reports/*', fingerprint: true

            archiveArtifacts artifacts: '**/dependency-check-report.*',
                             fingerprint: true

        }

        success {
            echo 'Phase 2 completed successfully.'
        }

        failure {
            echo 'Phase 2 failed.'
        }
    }
}
