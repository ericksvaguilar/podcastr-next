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

// SSG

export default function Home(props) {
  console.log(props.episodes); // Esse console é executado no servidor do next
  return <h1>Index</h1>;
}

//

export async function getStaticProps() {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },

    // `revalidate` recebe um número em segundos, de quanto em quanto tempo eu quero gerar uma nova versão dessa página
    revalidate: 60 * 60 * 8,
  };
}
