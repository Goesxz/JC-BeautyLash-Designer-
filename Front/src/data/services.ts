import type { Service } from "../types";

export const services: Service[] = [
  {
    slug: "Egípcio",
    name: "Egípcio",
    description: "Fios individuais aplicados um a um para um efeito natural.",
    application: 90,
    maintenance: 70,
    tag: "indicado-para-iniciantes",
  },
  {
    slug: "fio-a-fio",
    name: "Fio a Fio",
    description: "Leques de fios finos para um efeito volumoso e marcante.",
    application: 80,
    maintenance: 60,
    tag: "mais-procurado",
  },
  {
    slug: "brasileiro",
    name: "Brasileiro",
    description: "Técnica mista com efeito glamouroso e alongado.",
    application: 110,
    maintenance: 90,
    tag: "novidade",
  },
  {
    slug: "manutencao",
    name: "Manutenção",
    description:
      "Retoque para prolongar a durabilidade do seu conjunto de cílios.",
    application: 80,
    maintenance: 80,
  },
];
