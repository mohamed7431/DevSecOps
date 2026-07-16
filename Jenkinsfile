pipeline {

    agent any

    environment {
        SONAR_HOME = tool 'SonarQube'
        IMAGE_NAME = "mohamed7431/employee-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "========== CHECKOUT =========="
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "========== MAVEN BUILD =========="
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo "========== SONARQUBE =========="

                withSonarQubeEnv('SonarQube') {

                    sh """
                        ${SONAR_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=Employee-App \
                        -Dsonar.projectName=Employee-App \
                        -Dsonar.sources=src \
                        -Dsonar.java.binaries=target/classes
                    """
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {

                echo "========== DEPENDENCY CHECK =========="

                sh '''
                    mkdir -p reports

                    /opt/dependency-check/bin/dependency-check.sh \
                        --noupdate \
                        --disableOssIndex \
                        --project Employee-App \
                        --scan target \
                        --format ALL \
                        --out reports
                '''
            }
        }

        stage('Build Docker Image') {
            steps {

                echo "========== BUILD DOCKER IMAGE =========="

                sh """
                    docker build \
                    -t ${IMAGE_NAME}:${IMAGE_TAG} \
                    -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Trivy Image Scan') {
            steps {

                echo "========== TRIVY IMAGE SCAN =========="

                sh '''
                    mkdir -p reports

                    trivy image \
                        --severity HIGH,CRITICAL \
                        --format table \
                        --output reports/trivy-report.txt \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Docker Image') {

            steps {

                echo "========== PUSH TO DOCKER HUB =========="

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-Creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${IMAGE_NAME}:latest

                        docker logout
                    '''
                }
            }
        }

    }

    post {

        always {

            echo "========== ARCHIVING REPORTS =========="

            archiveArtifacts artifacts: 'reports/**/*', fingerprint: true

            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true

        }

        success {
            echo "========== PHASE 3 SUCCESS =========="
        }

        failure {
            echo "========== PHASE 3 FAILED =========="
        }

    }

}
