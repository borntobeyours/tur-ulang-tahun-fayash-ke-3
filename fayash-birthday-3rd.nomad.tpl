job "fayash-birthday-3rd" {
  datacenters = ["dc1"]
  type        = "service"
  node_pool   = "default"

  group "app" {
    count = 1

    constraint {
      attribute = "${node.unique.name}"
      value     = "apps-prod"
    }

    update {
      max_parallel      = 1
      min_healthy_time  = "5s"
      healthy_deadline  = "2m"
      progress_deadline = "5m"
      auto_revert       = true
    }

    network {
      port "http" {
        static = 3400
        to     = 80
      }
    }

    task "app" {
      driver = "docker"

      config {
        image      = "registry.internal.oh-my.dev/fayash-birthday-3rd:__TAG__"
        force_pull = true
        ports      = ["http"]

        auth {
          username = "harjulianto"
          password = "juventus92"
        }
      }

      resources {
        cpu    = 300
        memory = 256
      }

      service {
        provider = "nomad"
        name     = "fayash-birthday-3rd"
        port     = "http"

        check {
          type     = "http"
          path     = "/"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}
