#!/usr/bin/env bash
# Respalda la base de datos SQLite y las imágenes subidas (uploads/) a backups/,
# con retención automática. Pensado para correr por cron en el servidor, junto
# al docker-compose.yml (usa database/ y uploads/ como rutas relativas al repo).
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_FILE="$APP_DIR/database/burgery.db"
UPLOADS_DIR="$APP_DIR/uploads"
BACKUP_DIR="$APP_DIR/backups"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

if [ -f "$DB_FILE" ]; then
  DB_BACKUP="$BACKUP_DIR/burgery-$TIMESTAMP.db"
  if command -v sqlite3 >/dev/null 2>&1; then
    sqlite3 "$DB_FILE" ".backup '$DB_BACKUP'"
  else
    cp "$DB_FILE" "$DB_BACKUP"
  fi
  gzip "$DB_BACKUP"
  echo "Base de datos respaldada: $DB_BACKUP.gz"
else
  echo "Aviso: no se encontró $DB_FILE, se omite el respaldo de la base de datos." >&2
fi

if [ -d "$UPLOADS_DIR" ] && [ -n "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
  UPLOADS_BACKUP="$BACKUP_DIR/uploads-$TIMESTAMP.tar.gz"
  tar -czf "$UPLOADS_BACKUP" -C "$APP_DIR" uploads
  echo "Imágenes respaldadas: $UPLOADS_BACKUP"
fi

find "$BACKUP_DIR" -type f \( -name 'burgery-*.db.gz' -o -name 'uploads-*.tar.gz' \) -mtime +"$RETENTION_DAYS" -delete

echo "Listo. Respaldos actuales en $BACKUP_DIR:"
ls -lh "$BACKUP_DIR"
