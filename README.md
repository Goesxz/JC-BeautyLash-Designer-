<div align="center">

  <br />
  <img src="Front/src/assets/logo.png" alt="JC Beauty Studio Logo" width="120" title="JC Beauty Studio" />
  <br />

  # 💅 JC Beauty Lash Designer

  **Full-Stack Appointment & Business Management Platform**

  *Uma solução completa de agendamento online e gestão empresarial desenvolvida sob medida para estúdios de beleza.*

  <p align="center">
    <a href="#-sobre-o-projeto">Sobre</a> •
    <a href="#-funcionalidades">Funcionalidades</a> •
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-arquitetura">Arquitetura</a> •
    <a href="#-instalação">Instalação</a> •
    <a href="#-api-reference">API</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
    <img src="https://img.shields.io/badge/JWT-Protected-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  </p>

</div>

---

## 📌 Sobre o Projeto

O **JC Beauty Lash Designer** é um sistema completo (*Full-Stack*) projetado para centralizar a presença digital e automatizar a gestão operacional de um estúdio especializado em extensão de cílios.

A plataforma conecta a **experiência do cliente** (agendamento intuitivo, vitrine de serviços e checagem de horários em tempo real) a um **painel administrativo seguro** que gerencia agenda, clientes, serviços, relatórios e métricas financeiras.

---

## ✨ Funcionalidades

### 🛍️ Área do Cliente (Landing Page & Agendamento)
- **Hero Banner Institucional:** Apresentação da marca, proposta de valor e Call-to-Actions rápidos.
- **Vitrine de Serviços Exclusiva:** Catálogo com preços, tempo de procedimento e opções de *Aplicação* ou *Manutenção* (Brasileiro, Egípcio, Fio a Fio).
- **Agendamento Inteligente:** Seleção de datas e verificação de horários disponíveis em tempo real sem conflitos.
- **Canais de Contato Rápidos:** Integração direta com WhatsApp e Instagram.
- **Informativos Legais:** Seções dedicadas para FAQ, Termos de Uso e Política de Privacidade.

### 🛡️ Dashboard Administrativo
- **Autenticação Segura:** Login protegido via JSON Web Tokens (JWT) e senhas criptografadas.
- **Gestão de Agenda & Timeline:** Visualização e atualização de status de agendamentos em tempo real.
- **Módulo Financeiro & Relatórios:** Acompanhamento de receitas, balanços e métricas de desempenho.
- **Cadastro de Clientes & Serviços:** Controle detalhado do histórico de atendimentos e catálogo de preços/durações.
- **Configurações Globais:** Ajustes de dias úteis, horários de funcionamento e regras de negócio.

---

## 📸 Screenshots

## 📸 Screenshots

<div align="center">

### 1️⃣ Landing Page Principal
<img src="./docs/assets/home.jpeg" alt="Hero Landing Page" width="100%" />

<br /><br />

### 2️⃣ Catálogo de Serviços
<img src="./docs/assets/servicos.jpeg" alt="Vitrine de Serviços" width="100%" />

<br /><br />

### 3️⃣ Formulário de Agendamento Online
<img src="./docs/assets/agendamento.jpeg" alt="Formulário de Agendamento" width="100%" />

</div>

---

## 📐 Arquitetura da Aplicação

```mermaid
graph TD
    Client[Cliente / Browser] -->|HTTP / HTTPS| Frontend[Frontend: React + Vite + TS]
    Admin[Administrador] -->|Autenticação JWT| Frontend
    
    Frontend -->|REST API Requests| Backend[Backend: Node.js + Express]
    
    subgraph Servidor Backend
        Backend --> Auth[Middleware JWT]
        Backend --> Controllers[Controllers & Routes]
        Backend --> Services[Business Logic]
    end
    
    Services -->|Prisma Client| ORM[Prisma ORM]
    ORM -->|SQL Queries| DB[(Database: SQLite)]
