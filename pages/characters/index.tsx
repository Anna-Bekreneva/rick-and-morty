import {API} from "../../assets/api/api";
import {CharacterType, ResponseType} from "../../assets/api/rick-and-morty-api";
import {PageWrapper} from "../../components/PageWrapper/PageWrapper";
import {Header} from "../../components/Header/Header";
import dynamic from "next/dynamic";

const CharacterCard = dynamic(() => import('../../components/Card/CharacterCard/CharacterCard').then((module) => module.CharacterCard), {
  ssr: false,
  loading: () => <h1>Loading...</h1>
})

// next на сервере должен запустить функцию, а только потом отрендерить страницу

// мы на страничку можем прокинуть те пропсы, которые вернет функция getStaticProps
// getStaticProps вызывается один раз на сервере во время билда
// getStaticProps можно использовать для того, чтобы прочитать какую-то информацию из файлов
export const getStaticProps = async () => {
  const characters = await API.rickAndMorty.getCharacters()

  return {
    props: {characters},
    // прошло 60 секунд и запросили страницу занова. Если произошла ошибка при запросе, то инвалидация не происходит
    revalidate: 60
  }
}

type PropsType = {
  characters: ResponseType<CharacterType>
}
const Characters = (props: PropsType) => {
  const {characters} = props

  const charactersList = characters.results.map(character => (
    <CharacterCard key={character.id} character={character}/>
  ))

  return (
    <PageWrapper>
      <Header/>
      {charactersList}
    </PageWrapper>
  )
}

export default Characters