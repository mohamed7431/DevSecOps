pipeline {

    agent any

    tools {
        jdk 'JDK21'
        maven 'Maven-3.6.3'
    }

    environment {
        SCANNER_HOME = tool 'SonarScanner'
        GIT_REPO = 'https://github.com/mohamed7431/DevSecOps.git'
        GIT_BRANCH = 'main'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout Source') {
            steps {
                echo "========== CHECKOUT =========="

                git branch: "${GIT_BRANCH}",
                    credentialsId: 'github-token',
                    url: "${GIT_REPO}"

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
                    semgrep scan \
                        --config auto \
                        --json \
                        --output reports/semgrep.json \
                        . || true
                '''
            }
        }

        stage('OWASP Dependency Check') {
            steps {

                echo "========== DEPENDENCY CHECK =========="

                sh '''
                    mkdir -p reports

                    /opt/dependency-check/bin/dependency-check.sh \
                        --project employee-app \
                        --scan . \
                        --format ALL \
                        --out reports
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {

                echo "========== SONARQUBE =========="

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

                echo "========== MAVEN BUILD =========="

                sh '''
                    mvn clean package -DskipTests
                '''
            }
        }

    }

    post {

        always {

            echo "========== ARCHIVING REPORTS =========="

            archiveArtifacts(
                artifacts: 'reports/**',
                fingerprint: true,
                allowEmptyArchive: true
            )

        }

        success {

            echo "========== PHASE 2 SUCCESS =========="

        }

        failure {

            echo "========== PHASE 2 FAILED =========="

        }

    }

}
