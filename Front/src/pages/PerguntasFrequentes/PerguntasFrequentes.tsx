import { SEO } from "../../components/SEO/SEO";
import { InstitutionalLayout } from "../../components/InstitutionalLayout/Institutionallayout";
import "./PerguntasFrequentes.css";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  category: string;
  items: FaqItem[];
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    category: "Agendamento",
    items: [
      {
        question: "Como faço para agendar um horário?",
        answer:
          "Você pode agendar diretamente pelo formulário na seção de agendamento do site, ou através do nosso WhatsApp. Basta escolher o serviço desejado e confirmar a disponibilidade da agenda.",
      },
      {
        question: "Preciso pagar algum sinal para garantir o horário?",
        answer:
          "Para alguns procedimentos, sim. O sinal garante a reserva do seu horário e é descontado do valor total do serviço no dia do atendimento. Essa informação é sempre comunicada no momento da confirmação.",
      },
      {
        question: "Posso remarcar meu horário?",
        answer:
          "Sim. Pedimos apenas que a remarcação seja solicitada com pelo menos 24 horas de antecedência, para que possamos oferecer o horário a outra cliente da lista de espera.",
      },
    ],
  },
  {
    category: "Procedimentos",
    items: [
      {
        question: "Quanto tempo dura a extensão de cílios?",
        answer:
          "Em média, a extensão de cílios dura de 3 a 4 semanas, sendo recomendada a manutenção a cada 15 a 20 dias para manter o volume e o preenchimento ideais.",
      },
      {
        question: "A extensão de cílios machuca os cílios naturais?",
        answer:
          "Quando aplicada corretamente por uma profissional qualificada, a técnica não danifica os fios naturais. Por isso, avaliamos a saúde dos seus cílios antes de cada procedimento.",
      },
      {
        question: "Posso maquiar os olhos com a extensão de cílios?",
        answer:
          "Sim, mas recomendamos evitar produtos oleosos próximos à raiz dos cílios, pois o óleo pode acelerar a queda da extensão. Rímel e delineador em pó costumam ser bem tolerados.",
      },
    ],
  },
  {
    category: "Pagamento e políticas",
    items: [
      {
        question: "Quais formas de pagamento são aceitas?",
        answer:
          "Aceitamos pagamento via Pix, cartão de débito, cartão de crédito e dinheiro. As formas de pagamento disponíveis são sempre confirmadas junto à recepção antes do atendimento.",
      },
      {
        question: "O que acontece se eu faltar sem avisar?",
        answer:
          "Faltas sem aviso prévio impedem novos agendamentos sem pagamento antecipado integral. Essa política existe para preservar a organização da agenda e o atendimento de todas as clientes.",
      },
    ],
  },
];

export default function PerguntasFrequentes() {
  return (
    <>
      <SEO
        title="Perguntas Frequentes"
        description="Tire suas dúvidas sobre agendamento, procedimentos, pagamento e políticas do Studio Cílios."
        path="/perguntas-frequentes"
      />

      <InstitutionalLayout
        eyebrow="Ajuda e Suporte"
        title="Perguntas Frequentes"
        intro="Reunimos as dúvidas mais comuns das nossas clientes. Não encontrou o que procurava? Fale com a gente pelo WhatsApp."
      >
        {FAQ_GROUPS.map((group) => (
          <article key={group.category} className="faq-group">
            <h2>{group.category}</h2>

            <div className="faq-list">
              {group.items.map((item) => (
                <details key={item.question} className="faq-item">
                  <summary className="faq-item__question">
                    {item.question}
                  </summary>
                  <p className="faq-item__answer">{item.answer}</p>
                </details>
              ))}
            </div>
          </article>
        ))}

        <div className="institutional__callout">
          <p>
            Ainda com dúvidas? Fale diretamente com nossa equipe pelo WhatsApp —
            é só clicar no botão flutuante no canto da tela.
          </p>
        </div>
      </InstitutionalLayout>
    </>
  );
}
