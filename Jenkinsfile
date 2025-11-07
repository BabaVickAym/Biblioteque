pipeline {
    agent none // No default agent
   
    environment {
        SLACK_CHANNEL = '#jenkins'
        SLACK_CONFIG = 'Notifier'
        APP_URL = 'http://192.168.99:80' // Mettez à jour avec l'adresse IP de votre machine si nécessaire
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
                checkout scm // Clone https://github.com/BabaVickAym/Biblioteque.git
                script {
                    // Clone le dépôt restaurant dans un sous-répertoire
                    sh 'git clone https://github.com/BabaVickAym/restaurant.git webapp'
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "ℹ️ *Étape 1/4: Checkout du Code* : Code récupéré avec succès depuis Biblioteque et restaurant cloné dans webapp/. (<${env.BUILD_URL}|Détails>)",
                        teamDomain: 'travailraman',
                        tokenCredentialId: env.SLACK_CONFIG
                    )
                }
            }
        }
        
        stage('Build') {
            agent {
                docker {
                    image 'docker:24.0.6'
                    args '-v /var/run/docker.sock:/var/run/docker.sock --user root'
                }
            }
            steps {
                dir('webapp') { // Exécute les commandes dans le répertoire webapp
                    script {
                        sh 'docker rm -f webapp || true' // Nettoyer le conteneur existant
                        sh 'docker build -t webapp:v1 .'
                        sh 'docker images | grep webapp' // Vérifier que l'image est créée
                        sh 'docker run --name webapp -d -p 80:80 webapp:v1'
                        slackSend(
                            channel: env.SLACK_CHANNEL,
                            color: 'good',
                            message: "🛠️ *Étape 2/4: Build* : Image webapp:v1 construite et conteneur démarré sur port 80. (<${env.BUILD_URL}|Détails>)",
                            teamDomain: 'travailraman',
                            tokenCredentialId: env.SLACK_CONFIG
                        )
                    }
                }
            }
        }
        
        stage('Test') {
            agent any
            steps {
                script {
                    // Vérifier si le conteneur est en cours d'exécution
                    sh 'docker ps | grep webapp'
                    // Tester l'accès à l'application via curl
                    sh "curl -s --fail ${env.APP_URL} || exit 1"
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "🧪 *Étape 3/4: Test* : L'application est accessible à ${env.APP_URL}. (<${env.BUILD_URL}|Détails>)",
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
                        message: "🚀 *Étape 4/4: Déploiement* : Le déploiement sur l'environnement DEV est simulé. Application disponible à ${env.APP_URL}. (<${env.BUILD_URL}|Détails>)",
                        teamDomain: 'travailraman',
                        tokenCredentialId: env.SLACK_CONFIG
                    )
                }
            }
        }
    }
   
    post {
        always {
            node('any') {
                script {
                    // Nettoyer le conteneur
                    sh 'docker rm -f webapp || true'
                    cleanWs()
                }
            }
        }
        success {
            node('any') {
                script {
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "🎉 *Pipeline SUCCÈS* : Le build #${env.BUILD_NUMBER} pour `${env.JOB_NAME}` est terminé avec succès. Application disponible à ${env.APP_URL}. (<${env.BUILD_URL}|Voir le Build>)",
                        teamDomain: 'travailraman',
                        tokenCredentialId: env.SLACK_CONFIG
                    )
                }
            }
        }
        failure {
            node('any') {
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
}
