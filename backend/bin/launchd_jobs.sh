#!/bin/bash
export PATH="$HOME/.rbenv/shims:$HOME/.rbenv/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export RBENV_ROOT="$HOME/.rbenv"
cd "$(dirname "$0")/.."

# Run as production so Rails' development-mode code reloading doesn't
# tear down and restart the Solid Queue workers every time we edit a
# file while this is running unattended.
export RAILS_ENV=production

# dotenv-rails only auto-loads .env in development/test, so load the
# FinMind token manually here.
set -a
[ -f .env ] && source .env
set +a

exec bin/jobs
