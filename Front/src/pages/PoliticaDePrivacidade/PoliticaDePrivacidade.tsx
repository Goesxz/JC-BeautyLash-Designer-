import { SEO } from "../../components/SEO/SEO";
import { InstitutionalLayout } from "../../components/InstitutionalLayout/Institutionallayout";

export default function PoliticaDePrivacidade() {
  return (
    <>
      <SEO
        title="Política de Privacidade"
        description="Saiba como o Studio Cílios coleta, utiliza, armazena e protege os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD)."
        path="/politica-de-privacidade"
      />

      <InstitutionalLayout
        eyebrow="Institucional"
        title="Política de Privacidade"
        intro="Transparência é parte do nosso cuidado. Este documento explica, em linguagem simples, como tratamos os seus dados pessoais."
        updatedAt="1 de julho de 2026"
      >
        <article>
          <h2>
            <span className="institutional__index">01</span>
            Introdução
          </h2>
          <p>
            O Studio Cílios ("nós", "nosso estúdio") respeita a sua privacidade
            e está comprometido em proteger os dados pessoais coletados através
            do nosso site, formulários de agendamento e canais de atendimento,
            como WhatsApp e Instagram. Esta Política de Privacidade descreve
            quais dados coletamos, para quais finalidades, por quanto tempo os
            retemos e quais são os seus direitos como titular, em conformidade
            com a{" "}
            <strong>
              Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais
              (LGPD)
            </strong>
            .
          </p>
        </article>

        <article>
          <h2>
            <span className="institutional__index">02</span>
            Quais dados coletamos
          </h2>
          <p>
            Coletamos apenas os dados necessários para prestar nossos serviços
            com qualidade e segurança:
          </p>
          <ul>
            <li>
              <strong>Dados de identificação:</strong> nome completo, telefone e
              e-mail, informados no momento do agendamento.
            </li>
            <li>
              <strong>Dados de agendamento:</strong> serviço escolhido, data,
              horário e histórico de atendimentos.
            </li>
            <li>
              <strong>Dados de navegação:</strong> endereço IP, tipo de
              dispositivo, páginas visitadas e origem de acesso, coletados por
              meio de cookies e ferramentas de análise (ex: Google Analytics,
              Meta Pixel).
            </li>
            <li>
              <strong>Imagens:</strong> fotos de "antes e depois" do
              procedimento, coletadas mediante consentimento específico, para
              fins de portfólio e divulgação.
            </li>
          </ul>
        </article>

        <article>
          <h2>
            <span className="institutional__index">03</span>
            Finalidade do tratamento
          </h2>
          <p>Utilizamos os dados coletados para:</p>
          <ul>
            <li>Confirmar, reagendar ou cancelar horários;</li>
            <li>Enviar lembretes de agendamento via WhatsApp ou SMS;</li>
            <li>
              Personalizar o atendimento com base no histórico de procedimentos
              realizados;
            </li>
            <li>
              Cumprir obrigações legais, fiscais e regulatórias aplicáveis ao
              negócio;
            </li>
            <li>
              Mensurar a performance de campanhas publicitárias veiculadas em
              plataformas como Google Ads e Meta Ads;
            </li>
            <li>
              Divulgar resultados de procedimentos em redes sociais, apenas
              mediante consentimento expresso do cliente.
            </li>
          </ul>
        </article>

        <article>
          <h2>
            <span className="institutional__index">04</span>
            Uso de cookies
          </h2>
          <p>
            Nosso site utiliza cookies próprios e de terceiros para melhorar a
            sua experiência de navegação, lembrar preferências e mensurar o
            desempenho de campanhas de marketing digital. Você pode gerenciar ou
            desativar os cookies diretamente nas configurações do seu navegador,
            ciente de que isso pode impactar algumas funcionalidades do site.
          </p>
          <ul>
            <li>
              <strong>Cookies essenciais:</strong> necessários para o
              funcionamento básico do site e do formulário de agendamento.
            </li>
            <li>
              <strong>Cookies de análise:</strong> ajudam a entender como os
              visitantes utilizam o site (ex: Google Analytics).
            </li>
            <li>
              <strong>Cookies de publicidade:</strong> utilizados para medir a
              eficácia de anúncios em Google Ads e Meta Ads (Facebook e
              Instagram).
            </li>
          </ul>
        </article>

        <article>
          <h2>
            <span className="institutional__index">05</span>
            Compartilhamento de dados
          </h2>
          <p>
            Não vendemos os seus dados pessoais. Podemos compartilhar dados
            estritamente necessários com prestadores de serviço que nos auxiliam
            na operação do negócio, como plataformas de agendamento online,
            gateways de pagamento e ferramentas de marketing, sempre sob
            obrigações contratuais de confidencialidade e segurança.
          </p>
        </article>

        <article>
          <h2>
            <span className="institutional__index">06</span>
            Retenção e exclusão dos dados
          </h2>
          <p>
            Mantemos os seus dados pessoais pelo tempo necessário ao cumprimento
            das finalidades descritas nesta política, ou pelo prazo exigido por
            obrigações legais e fiscais. Dados de agendamento são retidos por
            até <strong>5 (cinco) anos</strong> após o último atendimento, para
            fins de histórico de cliente e cumprimento de obrigações fiscais.
            Findo esse prazo, os dados são anonimizados ou eliminados de forma
            segura.
          </p>
        </article>

        <article>
          <h2>
            <span className="institutional__index">07</span>
            Seus direitos como titular
          </h2>
          <p>Nos termos da LGPD, você pode, a qualquer momento, solicitar:</p>
          <ul>
            <li>Confirmação da existência de tratamento de dados;</li>
            <li>Acesso, correção ou atualização dos seus dados;</li>
            <li>
              Anonimização, bloqueio ou eliminação de dados desnecessários;
            </li>
            <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
            <li>Revogação do consentimento previamente concedido;</li>
            <li>
              Informações sobre com quem compartilhamos os seus dados pessoais.
            </li>
          </ul>

          <div className="institutional__callout">
            <p>
              Para exercer qualquer um desses direitos, entre em contato pelo
              e-mail{" "}
              <a href="mailto:privacidade@seudominio.com.br">
                privacidade@seudominio.com.br
              </a>{" "}
              ou pelo WhatsApp disponível no rodapé do site.
            </p>
          </div>
        </article>

        <hr className="institutional__divider" />

        <article>
          <h2>
            <span className="institutional__index">08</span>
            Alterações desta política
          </h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente para
            refletir melhorias em nossas práticas ou mudanças regulatórias. A
            data da última atualização está sempre indicada no topo desta
            página.
          </p>
        </article>
      </InstitutionalLayout>
    </>
  );
}
