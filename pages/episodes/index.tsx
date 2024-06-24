import {API} from "../../assets/api/api";
import {CharacterType, ResponseType} from "../../assets/api/rick-and-morty-api";
import {PageWrapper} from "../../components/PageWrapper/PageWrapper";
import {Header} from "../../components/Header/Header";
import { Card } from "../../components/Card/Card";
import {GetServerSideProps} from "next";

// getServerSideProps вызывается на сервере каждый раз, когда запрашиваем страницу
// getServerSideProps подразумевает, что данные, которые мы запрашиваем могут меняться

// res - тот ответ, что приходит с сервера
export const getServerSideProps: GetServerSideProps = async ({res}) => {
    // устанавливаем заголовок, который говорит закешировать данные на 100 секунд
    // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=100')
    const episodes = await API.rickAndMorty.getEpisodes()

    const isAuth = false

    if (!episodes) {
        return {
            notFound: true
        }
    }

    if (!isAuth) {
        return {
            redirect: {
                destination: '/test',
                permanent: false
            }
        }
    }

    return {
        props: {episodes}
    }
}

type PropsType = {
    episodes: ResponseType<CharacterType>
}
const Episodes = (props: PropsType) => {
    const {episodes} = props

    const episodesList = episodes.results.map(episode => (
      <Card key={episode.id} name={episode.name}/>
    ))

    return (
       <PageWrapper>
           <Header/>
           {episodesList}
       </PageWrapper>
    )
}

export default Episodes