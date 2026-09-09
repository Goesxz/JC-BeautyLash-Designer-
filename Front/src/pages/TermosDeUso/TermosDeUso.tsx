import { SEO } from "../../components/SEO/SEO";
import { InstitutionalLayout } from "../../components/InstitutionalLayout/Institutionallayout";

export default function TermosDeUso() {
  return (
    <>
      <SEO
        title="Termos de Uso"
        description="Conheça as regras de agendamento, cancelamento, remarcação e uso do site do Studio Cílios."
        path="/termos-de-uso"
      />

      <InstitutionalLayout
        eyebrow="Institucional"
        title="Termos de Uso"
        intro="Regras claras para uma experiência de agendamento tranquila, do primeiro clique à cadeira do estúdio."
        updatedAt="1 de julho de 2026"
      >
        <article>
          <h2>
            <span className="institutional__index">01</span>
            Aceitação dos termos
          </h2>
          <p>
            Ao acessar este site e/ou realizar um agendamento com o Studio
            Cílios, você declara estar de acordo com os termos e condições
            descritos a seguir. Caso não concorde com algum ponto, pedimos que
            entre em contato conosco antes de utilizar nossos serviços.
          </p>
        </article>

        <article>
          <h2>
            <span className="institutional__index">02</span>
            Sobre os serviços
          </h2>
          <p>
            O Studio Cílios oferece serviços de extensão de cílios, design de
            sobrancelhas e procedimentos de beleza correlatos, prestados
            presencialmente em nosso endereço físico. As informações sobre
            técnicas, durabilidade e cuidados de manutenção apresentadas no site
            têm caráter informativo e podem variar conforme a avaliação
            individual de cada cliente.
          </p>
        </article>

        <article>
          <h2>
            <span className="institutional__index">03</span>
            Agendamento
          </h2>
          <ul>
            <li>
              Os agendamentos podem ser realizados através do formulário do
              site, WhatsApp ou redes sociais oficiais do estúdio;
            </li>
            <li>
              A confirmação do horário está sujeita à disponibilidade da agenda
              e será comunicada por mensagem;
            </li>
            <li>
              Para alguns procedimentos, pode ser solicitado um sinal (pagamento
              antecipado) para garantia do horário reservado;
            </li>
            <li>
              Recomendamos chegar com 10 minutos de antecedência para
              preenchimento da anamnese e preparação do atendimento.
            </li>
          </ul>
        </article>

        <article>
          <h2>
            <span className="institutional__index">04</span>
            Cancelamento e remarcação
          </h2>
          <p>
            Compreendemos que imprevistos acontecem. Para manter a qualidade do
            atendimento a todas as clientes, seguimos a seguinte política:
          </p>
          <ul>
            <li>
              Cancelamentos ou remarcações devem ser solicitados com no mínimo{" "}
              <strong>24 (vinte e quatro) horas</strong> de antecedência;
            </li>
            <li>
              Cancelamentos realizados com menos de 24 horas de antecedência
              poderão resultar na perda do sinal pago, quando aplicável;
            </li>
            <li>
              Faltas sem aviso prévio ("no-show") impedem novos agendamentos sem
              pagamento antecipado integral do procedimento;
            </li>
            <li>
              Atrasos superiores a 15 minutos podem acarretar em redução do
              tempo de procedimento ou necessidade de reagendamento, a critério
              do estúdio.
            </li>
          </ul>
        </article>

        <article>
          <h2>
            <span className="institutional__index">05</span>
            Contraindicações e responsabilidade da cliente
          </h2>
          <p>
            É de responsabilidade da cliente informar, com honestidade, sobre
            alergias, sensibilidades, gestação, uso de medicamentos ou qualquer
            condição de saúde que possa interferir no procedimento. O estúdio se
            reserva o direito de recusar ou interromper um atendimento caso
            identifique contraindicações que coloquem em risco a saúde da
            cliente.
          </p>
        </article>

        <article>
          <h2>
            <span className="institutional__index">06</span>
            Uso do site
          </h2>
          <p>
            Todo o conteúdo deste site — textos, imagens, identidade visual e
            logotipo — é de propriedade do Studio Cílios ou utilizado sob
            licença, sendo proibida a reprodução sem autorização prévia. O uso
            do site deve respeitar a legislação vigente, sendo vedado qualquer
            uso que vise fraudar, sobrecarregar ou comprometer o funcionamento
            da plataforma.
          </p>
        </article>

        <article>
          <h2>
            <span className="institutional__index">07</span>
            Fotos e divulgação
          </h2>
          <p>
            Fotos de "antes e depois" podem ser utilizadas em nosso portfólio e
            redes sociais apenas mediante consentimento expresso da cliente,
            podendo este consentimento ser revogado a qualquer momento, conforme
            descrito em nossa{" "}
            <a href="/politica-de-privacidade">Política de Privacidade</a>.
          </p>
        </article>

        <hr className="institutional__divider" />

        <article>
          <h2>
            <span className="institutional__index">08</span>
            Alterações destes termos
          </h2>
          <p>
            Estes Termos de Uso podem ser atualizados a qualquer momento, para
            refletir mudanças em nossos serviços ou na legislação aplicável.
            Recomendamos a consulta periódica desta página.
          </p>

          <div className="institutional__callout">
            <p>
              Dúvidas sobre estes termos podem ser esclarecidas pelo WhatsApp
              disponível no rodapé do site ou pela nossa{" "}
              <a href="/perguntas-frequentes">página de Perguntas Frequentes</a>
              .
            </p>
          </div>
        </article>
      </InstitutionalLayout>
    </>
  );
}
