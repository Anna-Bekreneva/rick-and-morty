import {API} from "assets/api/api";
import {CharacterType} from "../../assets/api/rick-and-morty-api";
import {PageWrapper} from "../../components/PageWrapper/PageWrapper";
import {CharacterCard} from "../../components/Card/CharacterCard/CharacterCard";
import {GetStaticProps, GetStaticPaths} from "next";
import {useRouter} from "next/router";
import {getLayout} from "../../components/Layout/BaseLayout/BaseLayout";
import styled from "styled-components";

// getStaticPaths — функция вызывается на сервере, используется для статической генерации нескольких страниц
// то есть мы сразу генерируем несколько страниц
// getStaticPaths используется в связке с getStaticProps
export const getStaticPaths: GetStaticPaths = async () => {
  const {results} = await API.rickAndMorty.getCharacters()

  const paths = results.map(character => ({
    params: {id: String(character.id)}
  }))

  return {
    paths,
    fallback: true
  }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const {id} = params || {}
  const character = await API.rickAndMorty.getCharacter(id as string)

  if (!character) {
    return {
      notFound: true
    }
  }

  return {
    props: {character}
  }
}

type PropsType = {
  character: CharacterType
}
const Character = (props: PropsType) => {
  const {character} = props

  const router = useRouter()

  if (router.isFallback) return <h1>Loading...</h1>

  const characterId = router.query.id

  const goToCharacters = () => {
    router.push('/characters')
  }

  return (
    <PageWrapper>
      <Container>
        <IdText>ID: {characterId}</IdText>
        <CharacterCard key={character.id} character={character}/>
        <Button onClick={goToCharacters}>GO TO CHARACTERS</Button>
      </Container>
    </PageWrapper>
  )
}

Character.getLayout = getLayout
export default Character

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`

const Button = styled.button`
  border-radius: 4px;
  border: 0;
  background-color: #facaff;
  padding: 16px 32px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  
  &:hover {
    background-color: #fa52d3;
    color: white;
  }
`

const IdText = styled.div`
  font-size: 40px;
`
