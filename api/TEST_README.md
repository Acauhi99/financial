# Financial API - Test Suite

Este documento descreve como executar a suíte completa de testes da Financial API.

## 🚀 Execução Rápida

```bash
# Executar todos os testes (recomendado)
make test

# Testes completos com cleanup
make test-full
```

## 📋 Pré-requisitos

- Docker e Docker Compose
- Go 1.21+
- curl (para health checks)

## 🧪 Tipos de Teste

### Testes de Integração

A suíte inclui testes abrangentes para:

- **Autenticação**: Registro, login, JWT, proteção de endpoints
- **Transações**: CRUD, validações, paginação, busca, filtros
- **Investimentos**: CRUD, cálculos, validações, busca
- **Dashboard**: Resumos, cálculos, agregações
- **Overview**: Dados consolidados, gráficos
- **Categorias**: Categorias padrão, estrutura
- **Health Check**: Status da API
- **Multi-tenancy**: Isolamento entre usuários
- **Performance**: Thresholds de tempo, concorrência

## 🛠️ Comandos Disponíveis

### Usando Makefile (Recomendado)

```bash
# Mostrar todos os comandos disponíveis
make help

# Testes
make test                # Executar todos os testes
make test-coverage      # Testes com relatório de cobertura
make test-quick         # Testes rápidos (sem cleanup)
make test-verbose       # Testes com output detalhado

# Desenvolvimento
make dev                # Ambiente de desenvolvimento
make build              # Build da aplicação
make run                # Executar localmente

# Docker
make docker-up          # Ambiente de produção
make docker-down        # Parar ambiente
make docker-logs        # Ver logs

# Database
make db-up              # Apenas MongoDB
make db-reset           # Reset completo do banco

# Limpeza
make clean              # Limpeza básica
make clean-all          # Limpeza completa
```

### Usando Scripts Diretamente (Avançado)

```bash
# Testes completos com todas as opções
./run-tests.sh --coverage --verbose

# Ajuda
./run-tests.sh --help
```

## 🏗️ Arquitetura de Testes

### Ambiente Isolado

Os testes executam em um ambiente completamente isolado:

- **MongoDB de Teste**: Porta 27018, dados temporários
- **API de Teste**: Porta 8081, configuração de teste
- **Rede Isolada**: `financial-test-network`

### Configuração Automática

O script automaticamente:

1. ✅ Verifica pré-requisitos
2. 🧹 Limpa ambiente anterior
3. 🐳 Inicia containers de teste
4. ⏳ Aguarda serviços ficarem prontos
5. 🧪 Executa todos os testes
6. 📊 Gera relatórios (se solicitado)
7. 🧹 Limpa ambiente de teste

### Health Checks

- **MongoDB**: Ping de conexão a cada 5s
- **API**: Health endpoint a cada 10s
- **Timeout**: 60s para inicialização completa

## 📊 Relatórios

### Cobertura de Código

```bash
make test-coverage
```

Gera:
- Relatório de cobertura no terminal
- Arquivo HTML: `coverage.html`

### Logs Detalhados

```bash
make test-verbose
```

Mostra:
- Output detalhado de cada teste
- Tempos de execução
- Comandos Docker executados

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# URL da API (automaticamente configurada)
FINANCIAL_API_URL=http://localhost:8081

# Timeout dos testes
TEST_TIMEOUT=300s
```

### Personalização

Edite `docker-compose.test.yml` para:
- Alterar portas
- Modificar configurações do banco
- Ajustar health checks

## 🐛 Troubleshooting

### Problemas Comuns

**Docker não está rodando:**
```bash
# Verificar status
docker info

# Iniciar Docker (Linux)
sudo systemctl start docker
```

**Portas em uso:**
```bash
# Verificar portas ocupadas
lsof -i :8081
lsof -i :27018

# Parar processos se necessário
make clean
```

**Testes falhando:**
```bash
# Ver logs detalhados
make test-verbose

# Ver logs dos containers
docker-compose -f docker-compose.test.yml logs
```

**Cleanup manual:**
```bash
# Limpeza completa
make clean-all

# Remover containers órfãos
docker container prune -f
docker volume prune -f
```

### Performance

**Testes lentos:**
```bash
# Usar modo rápido para desenvolvimento
make test-quick

# Verificar recursos do Docker
docker system df
```

**Timeout de inicialização:**
- Aumentar timeout no `run-tests.sh`
- Verificar recursos disponíveis
- Usar `make test-verbose` para debug

## 📈 Métricas de Qualidade

### Thresholds de Performance

- **Queries**: < 100ms
- **Searches**: < 200ms  
- **Dashboard**: < 300ms
- **Overview**: < 500ms

### Cobertura Esperada

- **Handlers**: > 90%
- **Services**: > 85%
- **Repositories**: > 80%

### Cenários Testados

- ✅ Casos de sucesso
- ✅ Validações de entrada
- ✅ Casos de erro
- ✅ Segurança e autenticação
- ✅ Performance e concorrência
- ✅ Isolamento multi-tenant

## 🚀 CI/CD Integration

Para integrar com pipelines:

```yaml
# GitHub Actions exemplo
- name: Run Tests
  run: |
    chmod +x ./run-tests.sh
    ./run-tests.sh --coverage

# GitLab CI exemplo
test:
  script:
    - make test-coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
```