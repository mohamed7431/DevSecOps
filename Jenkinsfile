pipeline {

    agent any

    environment {

        SONAR_HOME = tool 'SonarScanner'

        IMAGE_NAME = "mohamed7431/employee-app"

        IMAGE_TAG = "${BUILD_NUMBER}"

        GIT_REPO = "https://github.com/mohamed7431/DevSecOps.git"
    }

    stages {

        stage('Checkout') {

            steps {

                checkout scm
            }
        }

        stage('Build') {

            steps {

                sh 'mvn clean package -DskipTests'
            }
        }

        stage('SonarQube Analysis') {

            steps {

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

        stage('Dependency Check') {

            steps {

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

                sh """
                docker build \
                -t ${IMAGE_NAME}:${IMAGE_TAG} \
                -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Trivy Scan') {

            steps {

                sh """
                mkdir -p reports

                trivy image \
                --severity HIGH,CRITICAL \
                --format table \
                --output reports/trivy-report.txt \
                ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Docker Image') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-Creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''

                    echo "$DOCKER_PASS" | docker login \
                    -u "$DOCKER_USER" \
                    --password-stdin

                    docker push ${IMAGE_NAME}:${IMAGE_TAG}

                    docker push ${IMAGE_NAME}:latest

                    docker logout

                    '''
                }
            }
        }

        stage('Update Kubernetes Manifest') {

            steps {

                sh """

                sed -i 's#image: .*#image: ${IMAGE_NAME}:${IMAGE_TAG}#' \
                k8s/employee-deployment.yaml

                """
            }
        }

        stage('Commit and Push') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'github-creds',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_CREDS'
                )]) {

                    sh """

                    git config user.name "Jenkins"

                    git config user.email "jenkins@local"

                    git add k8s/employee-deployment.yaml

                    git commit -m "Deploy image ${IMAGE_TAG}" || true

                    git push https://${GIT_USER}:${GIT_TOKEN}@github.com/mohamed7431/DevSecOps.git HEAD:main

                    """
                }
            }
        }

    }

    post {

        always {

            archiveArtifacts artifacts: 'reports/**/*', fingerprint: true

            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
        }

        success {

            echo "PIPELINE SUCCESS"
        }

        failure {

            echo "PIPELINE FAILED"
        }
    }
}
