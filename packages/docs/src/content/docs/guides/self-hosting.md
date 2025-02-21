---
title: Self-host your capsule
---

## Fly.io

You can easily deploy your capsule on Fly.io by following these steps:
You will first deploy the server, then then the ui.

1. Install the Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Create an account on fly.io: https://fly.io/docs/hands-on/create-account/
3. Copy these two toml files into a directory.

```toml
# ui.toml
app = 'ui'
primary_region = 'cdg'

[build]

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0
  processes = ['app']

[[vm]]
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1
```

6. Copy this fly.capsule.toml file into your server directory.

```toml
app = 'server'
primary_region = 'cdg'

[build]

[http_service]
internal_port = 3000
force_https = true
auto_stop_machines = 'stop'
auto_start_machines = true
min_machines_running = 0
processes = ['app']

[[vm]]
memory = '1gb'
cpu_kind = 'shared'
cpus = 1


[mounts]
source = "fp_capsule_prod_volume"
destination = "/app/_databases"
```

7. Deploy your capsule with the command :

```shell
fly deploy
```
