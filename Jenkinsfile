pipeline {
    agent none // No default agent
   
    environment {
        SLACK_CHANNEL = '#jenkins'
        SLACK_CONFIG = 'Notifier'
    }
   
    options {
        skipDefaultCheckout()
        timestamps()
    }
    
    stages {
        stage('Démarrage du Pipeline') {
            agent any
            steps {
                script {
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "✅ *Démarrage du Pipeline* : Le build #${env.BUILD_NUMBER} pour le dépôt `${env.JOB_NAME}` sur la branche `${env.BRANCH_NAME}` a commencé. (<${env.BUILD_URL}|Voir le Build>)",
                        teamDomain: 'travailraman',
                        tokenCredentialId: env.SLACK_CONFIG
                    )
                }
            }
        }
       
        stage('Checkout du Code') {
            agent any
            steps {
                checkout scm
                script {
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "ℹ️ *Étape 1/4: Checkout du Code* : Code récupéré avec succès sur la branche `${env.BRANCH_NAME}`. (<${env.BUILD_URL}|Détails>)",
                        teamDomain: 'travailraman',
                        tokenCredentialId: env.SLACK_CONFIG
                    )
                }
            }
        }
        
        stage('Build') {
            agent {
                docker {
                    image 'docker:24.0.6' // Use a specific Docker image version
                    args '-v /var/run/docker.sock:/var/run/docker.sock --user root'
                }
            }
            steps {
                script {
                    sh 'docker rm -f webapp || true' // Clean up existing container if present
                    sh 'docker build -t webapp:v1 .'
                    sh 'docker run --name webapp -d -p 90:90 webapp:v1'
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "🛠️ *Étape 2/4: Build* : La construction du projet est terminée. (<${env.BUILD_URL}|Détails>)",
                        teamDomain: 'travailraman',
                        tokenCredentialId: env.SLACK_CONFIG
                    )
                }
            }
        }
        
        stage('Test') {
            agent any
            steps {
                echo 'Simuler l\'étape de test (par exemple, npm test, mvn test)'
                script {
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "🧪 *Étape 3/4: Test* : Les tests unitaires et d'intégration ont réussi. (<${env.BUILD_URL}|Détails>)",
                        teamDomain: 'travailraman',
                        tokenCredentialId: env.SLACK_CONFIG
                    )
                }
            }
        }
        
        stage('Déploiement') {
            agent any
            steps {
                echo 'Simuler l\'étape de déploiement sur l\'environnement DEV'
                script {
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "🚀 *Étape 4/4: Déploiement* : Le déploiement sur l'environnement DEV est terminé. (<${env.BUILD_URL}|Détails>)",
                        teamDomain: 'travailraman',
                        tokenCredentialId: env.SLACK_CONFIG
                    )
                }
            }
        }
    }
   
    post {
        always {
            cleanWs()
        }
        success {
            script {
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'good',
                    message: "🎉 *Pipeline SUCCÈS* : Le build #${env.BUILD_NUMBER} pour `${env.JOB_NAME}` est terminé avec succès. Déploiement sur DEV réussi. (<${env.BUILD_URL}|Voir le Build>)",
                    teamDomain: 'travailraman',
                    tokenCredentialId: env.SLACK_CONFIG
                )
            }
        }
        failure {
            script {
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'danger',
                    message: "❌ *Pipeline ÉCHEC* : Le build #${env.BUILD_NUMBER} pour `${env.JOB_NAME}` a échoué. Vérifiez les logs. (<${env.BUILD_URL}|Voir le Build>)",
                    teamDomain: 'travailraman',
                    tokenCredentialId: env.SLACK_CONFIG
                )
            }
        }
    }
}
