---
title: Deploy with Docker
description: Your first digital space.
---

### Using Docker

You can deploy Capsule using Docker. The following command will start a Capsule container with the specified environment variables and port mapping.

```shell
docker run -d -t -i -e OWNER_EMAIL='your@email.com' \
-e OWNER_PASSWORD='foobar' \
-p 3000:3000 \
-v /path/to/your/data:/data \
--name container_name futurpanda/capsule
```

You will find the Capsule instance at http://localhost:3000.
