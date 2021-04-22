/**
 * * Requisição utilizando o modelo SPA:
 * * Indexação do Google, crawlers, etc não esperam a requisição terminar para indexar
 * * `useEffect()` dispara algo sempre que algo muda na aplicação
 * * [] executa uma única vez, assim que o component é exibido na tela
 *
 * useEffect(() => {
 * fetch("http://localhost:3333/episodes")
 *  .then((response) => response.json())
 *  .then((data) => console.log(data));
 * }, []);
 *
 */

/**
 * * Requisição utilizando o modelo SSR:
 * * Requisição é feita no servidor do next toda vez que o component é exibido em tela, desta forma os dados são entregues já prontos para o browser
 * export async function getServerSideProps() {
 *  const response = await fetch("http://localhost:3333/episodes");
 *  const data = await response.json();
 *
 *  return {
 *    props: {
 *      episodes: data,
 *    },
 *  };
 * }
 */
import { GetStaticProps } from "next";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { ConvertDurationToTimeString } from "../utils/convertDurationToTimeString";

import { api } from "../services/api";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type HomeProps = {
  episodes: Episode[];
};

export default function Home(props: HomeProps) {
  return (
    <div>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
}

// * Requisição utilizando o modelo SSG:
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  // Formatação dos dados no lado do servidor
  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: ConvertDurationToTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });

  return {
    props: {
      episodes: episodes,
    },

    // `revalidate` recebe um número em segundos, de quanto em quanto tempo eu quero gerar uma nova versão dessa página
    revalidate: 60 * 60 * 8,
  };
};
