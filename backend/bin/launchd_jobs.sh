#!/bin/bash
export PATH="$HOME/.rbenv/shims:$HOME/.rbenv/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export RBENV_ROOT="$HOME/.rbenv"
cd "$(dirname "$0")/.."
exec bin/jobs
