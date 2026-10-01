/**
 * PM2 Ecosystem Configuration — Pour déploiement sur Hostinger / VPS
 * 
 * Commandes utiles :
 *   pm2 start ecosystem.config.js          # Démarrer l'app
 *   pm2 restart ecosystem.config.js        # Redémarrer (après mise à jour)
 *   pm2 stop hertz-rental                  # Arrêter
 *   pm2 logs hertz-rental --lines 200      # Voir les logs
 *   pm2 status                             # Statut des process
 *   pm2 save                               # Persister le process (démarrage auto au reboot)
 *   pm2 startup                            # Installer le service systemd
 */

module.exports = {
  apps: [
    {
      name: 'hertz-rental',
      script: './dist/server.js',
      cwd: __dirname,

      instances: 1,
      exec_mode: 'fork',

      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },

      // Redémarrage automatique
      autorestart: true,
      watch: false,

      // Gestion mémoire
      max_memory_restart: '512M',

      // Logs
      error_file: './logs/app-error.log',
      out_file: './logs/app-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      max_size: '10M',
      retain: 7,

      // Délais et tentatives
      min_uptime: '10s',
      listen_timeout: 15000,
      kill_timeout: 3000,
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
